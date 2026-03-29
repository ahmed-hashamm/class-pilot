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
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: record, error } = await supabase
      .from("attendances")
      .insert({
        class_id: data.classId,
        title: data.title as any,
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
    students: { id: string; status: string }[]
  }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: record, error: recordError } = await supabase
      .from("attendances")
      .insert({
        class_id: data.classId,
        title: data.title as any,
        date: data.date,
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

    const { error: entriesError } = await supabase.from("attendance_records").insert(entries as any)
    if (entriesError) throw entriesError
  },

  async markAttendancePresent(attendanceId: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: record } = await supabase
      .from('attendances')
      .select('class_id, closed_at')
      .eq('id', attendanceId)
      .maybeSingle()

    if (!record || (record as any).closed_at) throw new Error("Attendance is closed or not found")
    
    const { data, error } = await supabase.from('attendance_records').upsert({
      attendance_id: attendanceId,
      user_id: userId,
      status: 'present'
    } as any).select().maybeSingle()

    if (error) throw error
    return { data, classId: (record as any).class_id }
  },

  async closeAttendance(attendanceId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: record } = await supabase.from('attendances').select('class_id').eq('id', attendanceId).maybeSingle()
    const { error } = await supabase.from('attendances').update({ closed_at: new Date().toISOString() } as any).eq('id', attendanceId)
    if (error) throw error
    return (record as any)?.class_id
  },

  async getAttendanceRecords(classId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data, error } = await supabase
      .from("attendances")
      .select("*")
      .eq("class_id", classId)
      .order("date", { ascending: false })
    if (error) throw error
    return data
  },

  async deleteAttendance(id: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
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
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: poll, error } = await supabase.from("polls")
      .insert({
        class_id: data.classId,
        question: data.question,
        options: data.options,
        deadline: data.deadline,
        created_by: data.userId,
        pinned: data.pinned
      } as any)
      .select()
      .maybeSingle()
    if (error) throw error
    return poll
  },

  async submitPollResponse(pollId: string, optionIndex: number, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: poll } = await supabase.from('polls').select('class_id, closed_at').eq('id', pollId).maybeSingle()
    if (!poll || (poll as any).closed_at) throw new Error("Poll is closed")

    await supabase.from('poll_responses').delete().eq('poll_id', pollId).eq('user_id', userId)
    const { data, error } = await supabase.from('poll_responses').insert({
      poll_id: pollId,
      user_id: userId,
      selected_option_index: optionIndex
    } as any).select().maybeSingle()
    if (error) throw error
    return { data, classId: (poll as any).class_id }
  },

  async closePoll(pollId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: poll } = await supabase.from('polls').select('class_id').eq('id', pollId).maybeSingle()
    const { error } = await supabase.from('polls').update({ closed_at: new Date().toISOString() } as any).eq('id', pollId)
    if (error) throw error
    return (poll as any)?.class_id
  },

  async deletePoll(pollId: string, userId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { error } = await supabase.from("polls").delete().eq("id", pollId)
    if (error) throw error
  },

  async getPollResults(pollId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data: votes, error } = await supabase.from("poll_responses")
      .select("selected_option_index")
      .eq("poll_id", pollId)
    if (error) throw error

    const counts: Record<number, number> = {}
    votes?.forEach((v: any) => {
      counts[v.selected_option_index] = (counts[v.selected_option_index] || 0) + 1
    })
    return counts
  },

  // --- BEHAVIOR ---
  async addBehaviorPoint(data: {
    classId: string
    studentId: string
    points: number
    reason: string
    category: string
    createdBy: string
  }) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { error } = await supabase.from("behavior_logs" as any).insert({
      class_id: data.classId,
      student_id: data.studentId,
      points: data.points,
      reason: data.reason,
      category: data.category,
      created_by: data.createdBy,
    } as any)
    if (error) throw error
  },

  async getBehaviorLogs(studentId: string, classId: string) {
    const supabase = (await createClient() as unknown) as SupabaseClient<Database>
    const { data, error } = await supabase.from("behavior_logs" as any)
      .select("*")
      .eq("student_id", studentId)
      .eq("class_id", classId)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data as any[]
  },
}
