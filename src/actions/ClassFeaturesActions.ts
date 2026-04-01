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
  deleteAttendanceSchema,
  deletePollSchema,
  generateRubricSchema,
  saveRubricSchema,
} from '@/lib/validations/classFeatures'
import { ClassFeaturesService } from '@/lib/services/classFeatures.service'
import { GradingService } from '@/lib/services/grading.service'
import { generateRubricFromAssignment } from '@/lib/ai/grading'


export async function saveRubricAction(payload: unknown) {
  const parsed = saveRubricSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Invalid input' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  // Check ownership if editing
  if (parsed.data.id) {
    const { data: existing } = await supabase
      .from('rubrics')
      .select('created_by')
      .eq('id', parsed.data.id)
      .maybeSingle()
      
    if (existing && (existing as any).created_by !== user.id) {
      return { data: null, error: 'Forbidden' }
    }
  }


  try {
    const result = await ClassFeaturesService.saveRubric({
      id: parsed.data.id,
      name: parsed.data.name,
      criteria: parsed.data.criteria,
      total_points: parsed.data.total_points,
      created_by: user.id
    })
    
    revalidatePath('/classes') // General revalidation
    return { data: result, error: null }
  } catch (err: any) {
    console.error('Error saving rubric:', err)
    return { data: null, error: err.message || 'Failed to save rubric' }
  }
}

export async function createAttendance(classId: string, date: string, title?: string, deadline?: string, pinned: boolean = false) {

  const parsed = createAttendanceSchema.safeParse({ classId, date, title, deadline, pinned })
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
      userId: user.id,
      pinned: parsed.data.pinned
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



export async function createPoll(classId: string, question: string, options: string[], deadline?: string, pinned: boolean = false) {
  const parsed = createPollSchema.safeParse({ classId, question, options, deadline, pinned })
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
      userId: user.id,
      pinned: parsed.data.pinned
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
    revalidatePath(`/classes/${classId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Error closing poll:', err)
    return { success: false, error: err.message }
  }
}

export async function deleteAttendance(id: string, classId: string) {
  const parsed = deleteAttendanceSchema.safeParse({ id, classId })
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    await ClassFeaturesService.deleteAttendance(parsed.data.id, user.id)
    revalidatePath(`/classes/${parsed.data.classId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Error deleting attendance:', err)
    return { success: false, error: err.message }
  }
}

export async function deletePoll(id: string, classId: string) {
  const parsed = deletePollSchema.safeParse({ id, classId })
  if (!parsed.success) return { success: false, error: 'Invalid input' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    await ClassFeaturesService.deletePoll(parsed.data.id, user.id)
    revalidatePath(`/classes/${parsed.data.classId}`)
    return { success: true }
  } catch (err: any) {
    console.error('Error deleting poll:', err)
    return { success: false, error: err.message }
  }
}

export async function publishAIGrade(submissionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const { data: submission, error: fetchError } = await (supabase as any)
      .from('submissions')
      .select('*, assignments(class_id)')
      .eq('id', submissionId)
      .maybeSingle()

    if (fetchError || !submission) {
      return { success: false, error: 'Submission not found' }
    }

    if (submission.ai_grade === null) {
      return { success: false, error: 'No AI grade available to publish' }
    }

    const { error: updateError } = await (supabase as any)
      .from('submissions')
      .update({
        final_grade: submission.ai_grade,
        teacher_feedback: submission.ai_feedback,
        status: 'graded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId)

    if (updateError) {
      console.error('Error publishing AI grade:', updateError)
      return { success: false, error: 'Failed to publish AI grade' }
    }

    revalidatePath(`/classes/${submission.assignments?.class_id}`)
    return { success: true, data: { final_grade: submission.ai_grade } }
  } catch (err: any) {
    console.error('Error publishing AI grade:', err)
    return { success: false, error: err.message }
  }
}

export async function updateGradingStatus(submissionId: string, status: 'pending' | 'in_progress' | 'completed') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  try {
    const { error } = await (supabase as any)
      .from('submissions')
      .update({ grading_status: status })
      .eq('id', submissionId)

    if (error) {
      console.error('Error updating grading status:', error)
      return { success: false, error: 'Failed to update grading status' }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Error updating grading status:', err)
    return { success: false, error: err.message }
  }
}

export async function generateAIGradingCriteria(payload: unknown) {
  const parsed = generateRubricSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Invalid input' }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const criteria = await generateRubricFromAssignment(
      parsed.data.title,
      parsed.data.description,
      user.id
    )
    return { data: criteria, error: null }
  } catch (err: any) {
    console.error('Error generating AI rubric:', err)
    return { data: null, error: err.message || 'Failed to generate criteria' }
  }
}


export async function gradeAssignmentSubmissionAction(assignmentId: string, submissionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const result = await GradingService.performAIGrading(assignmentId, submissionId, user.id)
    
    // Revalidate the assignment detail page
    revalidatePath(`/classes`) 
    
    return { data: result, error: null }
  } catch (err: any) {
    console.error('[gradeAssignmentSubmissionAction] Error:', err)
    return { data: null, error: err.message || 'Failed to grade submission' }
  }
}
