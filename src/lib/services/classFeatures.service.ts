import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.utf8'
import { SupabaseClient } from '@supabase/supabase-js'

type Attendance = Database['public']['Tables']['attendances']['Row']
type AttendanceRecord = Database['public']['Tables']['attendance_records']['Row']
type Poll = Database['public']['Tables']['polls']['Row']
type PollResponse = Database['public']['Tables']['poll_responses']['Row']

export const ClassFeaturesService = {
  async createAttendance(data: { classId: string; date: string; title: string | null; deadline: string | null; userId: string; pinned: boolean }) {
    const supabase = (await createClient()) as unknown as SupabaseClient<Database>
    const { data: result, error } = await (supabase
      .from('attendances') as any)
      .insert({
        class_id: data.classId,
        date: data.date,
        title: data.title,
        deadline: data.deadline,
        created_by: data.userId,
        pinned: data.pinned
      } as Database['public']['Tables']['attendances']['Insert'])
      .select()
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!result) throw new Error('Failed to create attendance')
    return result as Attendance
  },

  async markAttendancePresent(attendanceId: string, userId: string): Promise<{ data: AttendanceRecord | null; classId: string | undefined }> {
    const supabase = await createClient()
    
    const { data: attendance } = await supabase
      .from('attendances')
      .select('deadline, closed_at, class_id')
      .eq('id', attendanceId)
      .maybeSingle()

    const att = attendance as Attendance | null
    if (att?.closed_at) {
      throw new Error('This attendance session has been closed.')
    }
    if (att?.deadline && new Date(att.deadline) < new Date()) {
      throw new Error('The deadline for this attendance has passed.')
    }

    const { data, error } = await (supabase
      .from('attendance_records') as any)
      .insert({
        attendance_id: attendanceId,
        user_id: userId,
        status: 'present'
      } as Database['public']['Tables']['attendance_records']['Insert'])
      .select()
      .maybeSingle()

    if (error) throw new Error(error.message)
    return { data: data as AttendanceRecord | null, classId: att?.class_id }
  },

  async closeAttendance(attendanceId: string) {
    const supabase = await createClient()
    const { error } = await (supabase
      .from('attendances') as any)
      .update({ closed_at: new Date().toISOString() } as Database['public']['Tables']['attendances']['Update'])
      .eq('id', attendanceId)

    if (error) throw new Error(error.message)

    const { data: att } = await supabase.from('attendances').select('class_id').eq('id', attendanceId).maybeSingle()
    return (att as Attendance | null)?.class_id
  },

  async createPoll(data: { classId: string; question: string; options: string[]; deadline: string | null; userId: string; pinned: boolean }) {
    const supabase = await createClient()
    const { data: result, error } = await (supabase
      .from('polls') as any)
      .insert({
        class_id: data.classId,
        question: data.question,
        options: data.options,
        deadline: data.deadline,
        created_by: data.userId,
        pinned: data.pinned
      } as Database['public']['Tables']['polls']['Insert'])
      .select()
      .maybeSingle()

    if (error) throw new Error(error.message)
    return result as Poll
  },

  async submitPollResponse(pollId: string, selectedOptionIndex: number, userId: string) {
    const supabase = await createClient()
    
    const { data: poll } = await supabase
      .from('polls')
      .select('deadline, closed_at, class_id')
      .eq('id', pollId)
      .maybeSingle()

    const pl = poll as Poll | null
    if (pl?.closed_at) {
      throw new Error('This poll has been closed.')
    }
    if (pl?.deadline && new Date(pl.deadline) < new Date()) {
      throw new Error('The deadline for this poll has passed.')
    }

    const { data, error } = await (supabase
      .from('poll_responses') as any)
      .insert({
        poll_id: pollId,
        user_id: userId,
        selected_option_index: selectedOptionIndex
      } as Database['public']['Tables']['poll_responses']['Insert'])
      .select()
      .maybeSingle()

    if (error) throw new Error(error.message)
    return { data: data as PollResponse | null, classId: pl?.class_id }
  },

  async closePoll(pollId: string) {
    const supabase = await createClient()
    const { error } = await (supabase
      .from('polls') as any)
      .update({ closed_at: new Date().toISOString() } as Database['public']['Tables']['polls']['Update'])
      .eq('id', pollId)

    if (error) throw new Error(error.message)

    const { data: pl } = await supabase.from('polls').select('class_id').eq('id', pollId).maybeSingle()
    return (pl as Poll | null)?.class_id
  }
}
