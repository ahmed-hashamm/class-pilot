'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'

/**
 * Fetches assignment detail with submissions, membership, and teacher info.
 */
export async function getAssignmentDetail(classId: string, assignmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('id, title, description, due_date, points, submission_type, attachment_paths, is_group_project, created_by, created_at, rubrics(*), users:created_by(full_name), classes(name)')
    .eq('id', assignmentId)
    .eq('class_id', classId)
    .maybeSingle()

  if (assignmentError || !assignment) notFound()

  const { data: member } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!member) redirect(`/dashboard/classes/${classId}`)

  const isTeacher = (member as { role: string }).role === 'teacher'
  const created_by = (assignment as { created_by: string }).created_by

  // Get student's own submission
  let submission = null
  if (!isTeacher) {
    const { data: submissionData } = await supabase
      .from('submissions')
      .select('id, assignment_id, user_id, final_grade, status, feedback, group_id, submitted_at')
      .eq('assignment_id', assignmentId)
      .eq('user_id', user.id)
      .maybeSingle()
    submission = submissionData
  }

  // Get all submissions for teacher
  let submissions = null
  if (isTeacher) {
    const { data: submissionsData } = await supabase
      .from('submissions')
      .select('id, assignment_id, user_id, final_grade, status, feedback, group_id, submitted_at, users(full_name, email, avatar_url)')
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false })
    submissions = submissionsData
  }

  const { data: teacherName } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', created_by)
    .maybeSingle()

  return { user, assignment, isTeacher, submission, submissions, teacherName }
}

/**
 * Fetches all assignments for a specific class.
 */
export async function getAssignmentsByClass(classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { assignments: [], error: 'Unauthorized' }

  const { data, error } = await supabase
    .from('assignments')
    .select('id, class_id, title, description, points, due_date, attachment_paths, created_at')
    .eq('class_id', classId)
    .order('created_at', { ascending: false })

  return { assignments: data || [], error: error?.message || null }
}

/**
 * Fetches data needed for the Create Assignment page.
 */
export async function getCreateAssignmentData(classId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .single()

  if (!member || (member as { role: string }).role !== 'teacher') {
    redirect(`/classes/${classId}`)
  }

  const { data: rubrics } = await supabase
    .from('rubrics')
    .select('id, name, total_points')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  return { user, rubrics: rubrics || [] }
}

/**
 * Fetches data needed for the Edit Assignment page.
 */
export async function getEditAssignmentData(classId: string, assignmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await (supabase
    .from('class_members') as any)
    .select('role')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .single()

  if (!member || member.role !== 'teacher') redirect(`/dashboard/classes/${classId}`)

  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, title, description, due_date, points, submission_type, rubric_id, is_group_project, attachment_paths')
    .eq('id', assignmentId)
    .eq('class_id', classId)
    .single()

  if (!assignment) notFound()

  const { data: rubrics } = await supabase
    .from('rubrics')
    .select('id, name')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  const parsedAttachments = ((assignment as any)?.attachment_paths || []).map((path: string) => {
    const fileName = path.split('/').pop() || 'File'
    const cleanName = fileName.includes('-') ? fileName.split('-').slice(1).join('-') : fileName
    return { name: cleanName, url: path }
  })

  const initialData = { ...(assignment as any), attachments: parsedAttachments }

  return { user, rubrics: rubrics || [], initialData }
}

/**
 * Fetches data needed for the Submission Grading page.
 */
export async function getSubmissionGradingData(classId: string, assignmentId: string, submissionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: member } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', classId)
    .eq('user_id', user.id)
    .single()

  if (!member || (member as any).role !== 'teacher') {
    redirect(`/dashboard/classes/${classId}/assignments/${assignmentId}`)
  }

  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('*, users(full_name, email, avatar_url), assignments(*, rubrics(*))')
    .eq('id', submissionId)
    .eq('assignment_id', assignmentId)
    .single()

  if (submissionError || !submission) notFound()

  return { submission }
}
