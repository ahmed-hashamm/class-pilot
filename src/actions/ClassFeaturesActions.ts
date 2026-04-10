'use server'

import { createServerClient } from '@/lib/supabase/server'
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
  setFinalGradeSchema,
  updateManualGradeSchema,
} from '@/lib/validations/classFeatures'
import { ClassFeaturesService } from '@/lib/services/classFeatures.service'
import { GradingService } from '@/lib/services/grading.service'
import { redisSafe } from '@/lib/redis'
import { generateRubricFromAssignment } from '@/lib/ai/grading'


export async function saveRubricAction(payload: unknown) {
  const parsed = saveRubricSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Invalid input' }
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  // Check ownership if editing
  if (parsed.data.id) {
    const { data: existing } = await supabase
      .from('rubrics')
      .select('created_by')
      .eq('id', parsed.data.id)
      .maybeSingle()

    if (existing && (existing).created_by !== user.id) {
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
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to save rubric'
    return { data: null, error }
  }
}

export async function createAttendance(classId: string, date: string, title?: string, deadline?: string, pinned: boolean = false) {
  const parsed = createAttendanceSchema.safeParse({ classId, date, title, deadline, pinned })
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const result = await ClassFeaturesService.createAttendance({
      classId: parsed.data.classId,
      date: parsed.data.date,
      title: parsed.data.title || null,
      deadline: parsed.data.deadline || null,
      userId: user.id,
      pinned: parsed.data.pinned
    })
    await redisSafe.invalidateFeedCache(parsed.data.classId)
    revalidatePath(`/classes/${parsed.data.classId}`)
    return { data: result, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to create attendance'
    return { data: null, error }
  }
}



export async function markAttendancePresent(attendanceId: string) {
  const parsed = markAttendancePresentSchema.safeParse({ attendanceId })
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const result = await ClassFeaturesService.markAttendancePresent(parsed.data.attendanceId, user.id)
    if (result.classId) {
      await redisSafe.invalidateFeedCache(result.classId)
      revalidatePath(`/classes/${result.classId}`)
    }
    return { data: result.data, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to mark attendance'
    return { data: null, error }
  }
}



export async function closeAttendance(attendanceId: string) {
  const parsed = closeAttendanceSchema.safeParse({ attendanceId })
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const classId = await ClassFeaturesService.closeAttendance(parsed.data.attendanceId)
    if (classId) {
      await redisSafe.invalidateFeedCache(classId)
      revalidatePath(`/classes/${classId}`)
    }
    return { data: { success: true }, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to close attendance'
    return { data: null, error }
  }
}



export async function createPoll(classId: string, question: string, options: string[], deadline?: string, pinned: boolean = false) {
  const parsed = createPollSchema.safeParse({ classId, question, options, deadline, pinned })
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const result = await ClassFeaturesService.createPoll({
      classId: parsed.data.classId,
      question: parsed.data.question,
      options: parsed.data.options,
      deadline: parsed.data.deadline || null,
      userId: user.id,
      pinned: parsed.data.pinned
    })
    await redisSafe.invalidateFeedCache(parsed.data.classId)
    revalidatePath(`/classes/${parsed.data.classId}`)
    return { data: result, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to create poll'
    return { data: null, error }
  }
}



export async function submitPollResponse(pollId: string, selectedOptionIndex: number) {
  const parsed = submitPollResponseSchema.safeParse({ pollId, selectedOptionIndex })
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const result = await ClassFeaturesService.submitPollResponse(parsed.data.pollId, parsed.data.selectedOptionIndex, user.id)
    if (result.classId) {
      await redisSafe.invalidateFeedCache(result.classId)
      revalidatePath(`/classes/${result.classId}`)
    }
    return { data: result.data, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to submit response'
    return { data: null, error }
  }
}



export async function closePoll(pollId: string) {
  const parsed = closePollSchema.safeParse({ pollId })
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const classId = await ClassFeaturesService.closePoll(parsed.data.pollId)
    if (classId) {
      await redisSafe.invalidateFeedCache(classId)
      revalidatePath(`/classes/${classId}`)
    }
    return { data: { success: true }, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to close poll'
    return { data: null, error }
  }
}

export async function deleteAttendance(id: string, classId: string) {
  const parsed = deleteAttendanceSchema.safeParse({ id, classId })
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    await ClassFeaturesService.deleteAttendance(parsed.data.id, user.id)
    await redisSafe.invalidateFeedCache(parsed.data.classId)
    revalidatePath(`/classes/${parsed.data.classId}`)
    return { data: { success: true }, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to delete attendance'
    return { data: null, error }
  }
}

export async function deletePoll(id: string, classId: string) {
  const parsed = deletePollSchema.safeParse({ id, classId })
  if (!parsed.success) return { data: null, error: 'Invalid input' }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    await ClassFeaturesService.deletePoll(parsed.data.id, user.id)
    await redisSafe.invalidateFeedCache(parsed.data.classId)
    revalidatePath(`/classes/${parsed.data.classId}`)
    return { data: { success: true }, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to delete poll'
    return { data: null, error }
  }
}

export async function publishAIGrade(submissionId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('*, assignments(class_id)')
      .eq('id', submissionId)
      .maybeSingle()

    if (fetchError || !submission) {
      return { data: null, error: 'Submission not found' }
    }

    const typedSubmission = submission

    if (typedSubmission.ai_grade === null) {
      return { data: null, error: 'No AI grade available to publish' }
    }

    const { error: updateError } = await (supabase.from('submissions'))
      .update({
        final_grade: typedSubmission.ai_grade,
        teacher_feedback: typedSubmission.ai_feedback,
        status: 'graded',
        updated_at: new Date().toISOString(),
      })
      .eq('id', submissionId)

    if (updateError) {
      return { data: null, error: 'Failed to publish AI grade' }
    }

    revalidatePath(`/classes/${typedSubmission.assignments?.class_id}`)
    return { data: { final_grade: typedSubmission.ai_grade }, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to publish AI grade'
    return { data: null, error }
  }
}

export async function updateGradingStatus(submissionId: string, status: 'pending' | 'in_progress' | 'completed') {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const { error } = await (supabase.from('submissions'))
      .update({ status: status })
      .eq('id', submissionId)

    if (error) {
      return { data: null, error: 'Failed to update grading status' }
    }

    return { data: { success: true }, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to update grading status'
    return { data: null, error }
  }
}

export async function generateAIGradingCriteria(payload: unknown) {
  const parsed = generateRubricSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Invalid input' }
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const criteria = await generateRubricFromAssignment(
      parsed.data.title,
      parsed.data.description,
      user.id
    )
    return { data: criteria, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to generate criteria'
    return { data: null, error }
  }
}


export async function gradeAssignmentSubmissionAction(assignmentId: string, submissionId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const result = await GradingService.performAIGrading(assignmentId, submissionId, user.id)

    // Revalidate the assignment detail page
    revalidatePath(`/classes`)

    return { data: result, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to grade submission'
    return { data: null, error }
  }
}

export async function setFinalGradeAction(payload: unknown) {
  const parsed = setFinalGradeSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Invalid input' }
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const result = await GradingService.updateFinalGrade(
      parsed.data.submissionId,
      user.id,
      parsed.data.score
    )

    // Fetch submission to get class_id for revalidation
    const { data: sub } = await supabase
      .from('submissions')
      .select('assignments(class_id)')
      .eq('id', parsed.data.submissionId)
      .maybeSingle()

    if ((sub)?.assignments?.class_id) {
      revalidatePath(`/classes/${(sub).assignments.class_id}`)
    }

    return { data: result, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to update final grade'
    return { data: null, error }
  }
}

export async function updateManualGradeAction(payload: unknown) {
  const parsed = updateManualGradeSchema.safeParse(payload)
  if (!parsed.success) {
    return { data: null, error: parsed.error.errors[0]?.message || 'Invalid input' }
  }

  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Unauthorized' }

  try {
    const result = await GradingService.updateManualGrade(
      parsed.data.submissionId,
      user.id,
      parsed.data.score,
      parsed.data.feedback
    )

    // Refresh to update UI
    const { data: sub } = await supabase
      .from('submissions')
      .select('assignments(class_id)')
      .eq('id', parsed.data.submissionId)
      .maybeSingle()

    if ((sub)?.assignments?.class_id) {
      revalidatePath(`/classes/${(sub).assignments.class_id}`)
    }

    return { data: result, error: null }
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Failed to update manual grade'
    return { data: null, error }
  }
}
