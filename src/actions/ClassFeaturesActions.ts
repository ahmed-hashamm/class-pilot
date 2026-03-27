'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  createAttendanceSchema,
  markAttendancePresentSchema,
  closeAttendanceSchema,
  createPollSchema,
  submitPollResponseSchema,
  closePollSchema,
} from '@/lib/validations/classFeatures'
import { ClassFeaturesService } from '@/lib/services/classFeatures.service'


export async function createAttendance(classId: string, date: string, title?: string, deadline?: string) {
  const parsed = createAttendanceSchema.safeParse({ classId, date, title, deadline })
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const result = await ClassFeaturesService.createAttendance({
      classId: parsed.data.classId,
      date: parsed.data.date,
      title: parsed.data.title || null,
      deadline: parsed.data.deadline || null,
      userId: user.id
    })
    revalidatePath(`/classes/${parsed.data.classId}`)
    return { success: true, data: result }
  } catch (err: any) {
    console.error('Error creating attendance:', err)
    return { success: false, error: err.message }
  }
}



export async function markAttendancePresent(attendanceId: string) {
  const parsed = markAttendancePresentSchema.safeParse({ attendanceId })
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const result = await ClassFeaturesService.markAttendancePresent(parsed.data.attendanceId, user.id)
    if (result.classId) revalidatePath(`/classes/${result.classId}`)
    return { success: true, data: result.data }
  } catch (err: any) {
    console.error('Error marking attendance:', err)
    return { success: false, error: err.message }
  }
}



export async function closeAttendance(attendanceId: string) {
  const parsed = closeAttendanceSchema.safeParse({ attendanceId })
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const classId = await ClassFeaturesService.closeAttendance(parsed.data.attendanceId)
    if (classId) revalidatePath(`/classes/${classId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Error closing attendance:', err)
    return { success: false, error: err.message }
  }
}



export async function createPoll(classId: string, question: string, options: string[], deadline?: string) {
  const parsed = createPollSchema.safeParse({ classId, question, options, deadline })
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const result = await ClassFeaturesService.createPoll({
      classId: parsed.data.classId,
      question: parsed.data.question,
      options: parsed.data.options,
      deadline: parsed.data.deadline || null,
      userId: user.id
    })
    revalidatePath(`/classes/${parsed.data.classId}`)
    return { success: true, data: result }
  } catch (err: any) {
    console.error('Error creating poll:', err)
    return { success: false, error: err.message }
  }
}



export async function submitPollResponse(pollId: string, selectedOptionIndex: number) {
  const parsed = submitPollResponseSchema.safeParse({ pollId, selectedOptionIndex })
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const result = await ClassFeaturesService.submitPollResponse(parsed.data.pollId, parsed.data.selectedOptionIndex, user.id)
    if (result.classId) revalidatePath(`/classes/${result.classId}`)
    return { success: true, data: result.data }
  } catch (err: any) {
    console.error('Error submitting poll response:', err)
    return { success: false, error: err.message }
  }
}



export async function closePoll(pollId: string) {
  const parsed = closePollSchema.safeParse({ pollId })
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    const classId = await ClassFeaturesService.closePoll(parsed.data.pollId)
    if (classId) revalidatePath(`/classes/${classId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Error closing poll:', err)
    return { success: false, error: err.message }
  }
}
