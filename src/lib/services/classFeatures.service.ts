import { createClient } from "@/lib/supabase/server"
import { Database } from "@/types/database"
import { SupabaseClient } from "@supabase/supabase-js"

export const ClassFeaturesService = {
  // --- ATTENDANCE ---
  async createAttendance(data: {
    classId: string
    title: string | null
    date: string
    deadline: string | null
    userId: string
    pinned: boolean
  }) {
    const supabase = await createClient()
    const { data: record, error } = await supabase
      .from("attendances")
      .insert({
        class_id: data.classId,
        title: data.title,
        date: data.date,
        deadline: data.deadline,
        created_by: data.userId,
        pinned: data.pinned,
      })
      .select()
      .maybeSingle()

    if (error) throw error
    return record
  },
  async markAttendance(data: {
    classId: string
    title: string
    date: string
    userId: string
    students: { id: string; status: string }[]
  }) {
    const supabase = await createClient()
    const { data: record, error: recordError } = await supabase
      .from("attendances")
      .insert({
        class_id: data.classId,
        title: data.title,
        date: data.date,
        created_by: data.userId,
      })
      .select()
      .maybeSingle()

    if (recordError) throw recordError
    if (!record) throw new Error("Failed to create attendance record")

    const entries = data.students.map((s) => ({
      attendance_id: record.id,
      user_id: s.id,
      status: s.status,
    }))

    const { error: entriesError } = await supabase.from("attendance_records").insert(entries)
    if (entriesError) throw entriesError
  },

  async markAttendancePresent(attendanceId: string, userId: string) {
    const supabase = await createClient()
    const { data: record } = await supabase
      .from('attendances')
      .select('class_id, closed_at')
      .eq('id', attendanceId)
      .maybeSingle()

    if (!record || record.closed_at) throw new Error("Attendance is closed or not found")

    const { data, error } = await supabase.from('attendance_records').upsert({
      attendance_id: attendanceId,
      user_id: userId,
      status: 'present'
    }).select().maybeSingle()

    if (error) throw error
    return { data, classId: record.class_id }
  },

  async closeAttendance(attendanceId: string) {
    const supabase = await createClient()
    const { data: record } = await supabase.from('attendances').select('class_id').eq('id', attendanceId).maybeSingle()
    const { error } = await supabase.from('attendances').update({ closed_at: new Date().toISOString() }).eq('id', attendanceId)
    if (error) throw error
    return record?.class_id
  },

  async getAttendanceRecords(classId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("attendances")
      .select("*")
      .eq("class_id", classId)
      .order("date", { ascending: false })
    if (error) throw error
    return data
  },

  async deleteAttendance(id: string, userId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('attendances').delete().eq('id', id)
    if (error) throw error
  },

  // --- POLLS ---
  async createPoll(data: {
    classId: string
    question: string
    options: any // Json
    deadline: string | null
    userId: string
    pinned: boolean
  }) {
    const supabase = await createClient()
    const { data: poll, error } = await supabase.from("polls")
      .insert({
        class_id: data.classId,
        question: data.question,
        options: data.options,
        deadline: data.deadline,
        created_by: data.userId,
        pinned: data.pinned
      })
      .select()
      .maybeSingle()
    if (error) throw error
    return poll
  },

  async submitPollResponse(pollId: string, optionIndex: number, userId: string) {
    const supabase = await createClient()
    const { data: poll } = await supabase.from('polls').select('class_id, closed_at').eq('id', pollId).maybeSingle()
    if (!poll || poll.closed_at) throw new Error("Poll is closed")

    await supabase.from('poll_responses').delete().eq('poll_id', pollId).eq('user_id', userId)
    const { data, error } = await supabase.from('poll_responses').insert({
      poll_id: pollId,
      user_id: userId,
      selected_option_index: optionIndex
    }).select().maybeSingle()
    if (error) throw error
    return { data, classId: poll.class_id }
  },

  async closePoll(pollId: string) {
    const supabase = await createClient()
    const { data: poll } = await supabase.from('polls').select('class_id').eq('id', pollId).maybeSingle()
    const { error } = await supabase.from('polls').update({ closed_at: new Date().toISOString() }).eq('id', pollId)
    if (error) throw error
    return poll?.class_id
  },

  async deletePoll(pollId: string, userId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("polls").delete().eq("id", pollId)
    if (error) throw error
  },

  async getPollResults(pollId: string) {
    const { redisSafe } = await import('@/lib/redis')
    const cacheKey = `poll:results:${pollId}`

    // 1. Check cache first (10s window)
    const cached = await redisSafe.get<Record<number, number>>(cacheKey)
    if (cached) return cached

    const supabase = await createClient()
    const { data: votes, error } = await supabase.from("poll_responses")
      .select("selected_option_index")
      .eq("poll_id", pollId)
    if (error) throw error

    const counts: Record<number, number> = {}
    votes?.forEach((v: any) => {
      counts[v.selected_option_index] = (counts[v.selected_option_index] || 0) + 1
    })

    // 2. Store in cache for 10 seconds
    await redisSafe.set(cacheKey, counts, { ex: 10 })

    return counts
  },

  // --- AI LOGGING ---
  async logAIUsage(data: {
    userId: string
    actionType: string
    model: string
    inputTokens: number
    outputTokens: number
  }) {
    const supabase = await createClient()
    const { error } = await supabase.from("ai_usage_logs").insert({
      user_id: data.userId,
      action_type: data.actionType,
      model: data.model,
      input_tokens: data.inputTokens,
      output_tokens: data.outputTokens,
    })
    if (error) throw error
  },

  async getAIUsageLogs(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from("ai_usage_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data
  },

  async saveRubric(data: {
    id?: string
    name: string
    criteria: any // Json
    total_points: number
    created_by: string
  }) {
    const supabase = await createClient()

    if (data.id) {
      const { data: rubric, error } = await supabase
        .from('rubrics')
        .update({
          name: data.name,
          criteria: data.criteria,
          total_points: data.total_points,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id)
        .select()
        .maybeSingle()
      if (error) throw error
      return rubric
    } else {
      const { data: rubric, error } = await supabase
        .from('rubrics')
        .insert({
          name: data.name,
          criteria: data.criteria,
          total_points: data.total_points,
          created_by: data.created_by
        })
        .select()
        .maybeSingle()
      if (error) throw error
      return rubric
    }
  },
}

