'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAttendance(classId: string, date: string, title?: string, deadline?: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('attendances')
    .insert([
      {
        class_id: classId,
        date,
        title: title || null,
        deadline: deadline || null,
        created_by: user.id
      }
    ] as any)
    .select()
    .single()

  if (error) {
    console.error('Error creating attendance:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/classes/${classId}`)
  return { success: true, data }
}

export async function markAttendancePresent(attendanceId: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Check if attendance is still open
  const { data: attendance } = await supabase
    .from('attendances')
    .select('deadline, closed_at')
    .eq('id', attendanceId)
    .single() as any

  if (attendance?.closed_at) {
    return { success: false, error: 'This attendance session has been closed.' }
  }
  if (attendance?.deadline && new Date(attendance.deadline) < new Date()) {
    return { success: false, error: 'The deadline for this attendance has passed.' }
  }

  const { data, error } = await supabase
    .from('attendance_records')
    .insert([
      {
        attendance_id: attendanceId,
        user_id: user.id,
        status: 'present'
      }
    ] as any)
    .select()
    .single()

  if (error) {
    console.error('Error marking attendance:', error)
    return { success: false, error: error.message }
  }

  // Revalidate
  const { data: att } = await supabase.from('attendances').select('class_id').eq('id', attendanceId).single() as any
  if (att?.class_id) revalidatePath(`/classes/${att.class_id}`)

  return { success: true, data }
}

export async function closeAttendance(attendanceId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await (supabase
    .from('attendances') as any)
    .update({ closed_at: new Date().toISOString() })
    .eq('id', attendanceId)

  if (error) {
    console.error('Error closing attendance:', error)
    return { success: false, error: error.message }
  }

  // Revalidate
  const { data: att } = await supabase.from('attendances').select('class_id').eq('id', attendanceId).single() as any
  if (att?.class_id) revalidatePath(`/classes/${att.class_id}`)

  return { success: true }
}

export async function createPoll(classId: string, question: string, options: string[], deadline?: string) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { data, error } = await supabase
    .from('polls')
    .insert([
      {
        class_id: classId,
        question,
        options,
        deadline: deadline || null,
        created_by: user.id
      }
    ] as any)
    .select()
    .single()

  if (error) {
    console.error('Error creating poll:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(`/classes/${classId}`)
  return { success: true, data }
}

export async function submitPollResponse(pollId: string, selectedOptionIndex: number) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  // Check if poll is still open
  const { data: poll } = await supabase
    .from('polls')
    .select('deadline, closed_at')
    .eq('id', pollId)
    .single() as any

  if (poll?.closed_at) {
    return { success: false, error: 'This poll has been closed.' }
  }
  if (poll?.deadline && new Date(poll.deadline) < new Date()) {
    return { success: false, error: 'The deadline for this poll has passed.' }
  }

  const { data, error } = await supabase
    .from('poll_responses')
    .insert([
      {
        poll_id: pollId,
        user_id: user.id,
        selected_option_index: selectedOptionIndex
      }
    ] as any)
    .select()
    .single()

  if (error) {
    console.error('Error submitting poll response:', error)
    return { success: false, error: error.message }
  }

  // Revalidate
  const { data: pl } = await supabase.from('polls').select('class_id').eq('id', pollId).single() as any
  if (pl?.class_id) revalidatePath(`/classes/${pl.class_id}`)

  return { success: true, data }
}

export async function closePoll(pollId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  const { error } = await (supabase
    .from('polls') as any)
    .update({ closed_at: new Date().toISOString() })
    .eq('id', pollId)

  if (error) {
    console.error('Error closing poll:', error)
    return { success: false, error: error.message }
  }

  // Revalidate
  const { data: pl } = await supabase.from('polls').select('class_id').eq('id', pollId).single() as any
  if (pl?.class_id) revalidatePath(`/classes/${pl.class_id}`)

  return { success: true }
}
