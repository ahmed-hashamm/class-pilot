'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAttendance(classId: string, date: string, title?: string) {
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

  return { success: true, data }
}

export async function createPoll(classId: string, question: string, options: string[]) {
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

  return { success: true, data }
}
