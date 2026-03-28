'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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
    .select('id, class_id, title, description, due_date, points, submission_type, attachment_paths, is_group_project, created_by, created_at, rubrics(*), users:created_by(full_name), classes(name)')
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

  // Get student's own submission (supporting both individual and group projects)
  const admin = createAdminClient()
  let submission = null

  if (!isTeacher) {
    // 1. Get user's group IDs for this class
    const { data: memberGroups } = await admin
      .from('project_members')
      .select('project_id, group_projects!inner(class_id)')
      .eq('user_id', user.id)
      .eq('group_projects.class_id', classId)

    const groupIds = (memberGroups || []).map((m: any) => m.project_id)

    // 2. Query for ALL submissions for this assignment and filter in JS
    const { data: allAssignmentSubmissions, error: subError } = await admin
      .from('submissions')
      .select('id, assignment_id, user_id, final_grade, status, teacher_feedback, ai_feedback, group_id, submitted_at, content, files')
      .eq('assignment_id', assignmentId)
      .order('submitted_at', { ascending: false })
    
    if (subError) console.error('[getAssignmentDetail] Sub Query Error:', subError)

    // Find first submission matching user OR any of their groups
    submission = allAssignmentSubmissions?.find(s => 
      s.user_id === user.id || 
      (s.group_id && groupIds.includes(s.group_id))
    ) || null
  }

  console.log(`[getAssignmentDetail] Fetching for ${assignment.title}: ${submission ? 'Turned in' : 'Assigned'}`)

  // Get all submissions for teacher
  let submissions = null
  if (isTeacher) {
    const { data: submissionsData } = await supabase
      .from('submissions')
      .select('id, assignment_id, user_id, final_grade, status, teacher_feedback, group_id, submitted_at, users(full_name, email, avatar_url), group_projects(title, project_members(users(full_name, avatar_url)))')
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

  // Fetch assignments with creator info and submission counts
  const { data, error } = await supabase
    .from('assignments')
    .select(`
      id, 
      class_id, 
      title, 
      description, 
      points, 
      due_date, 
      attachment_paths, 
      is_group_project,
      created_at,
      users:created_by(full_name, avatar_url),
      submissions!left(id, user_id, group_id, status)
    `)
    .eq('class_id', classId)
    .order('created_at', { ascending: false })

  if (error) return { assignments: [], error: error.message }

  // Post-process to get counts and personal status
  const processed = (data || []).map((a: any) => {
    const userSubmission = a.submissions?.find((s: any) => s.user_id === user.id)
    return {
      ...a,
      submission_count: a.submissions?.length || 0,
      user_submission: userSubmission || null
    }
  })

  return { assignments: processed, error: null }
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
    .maybeSingle()

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
    .maybeSingle()

  if (!member || member.role !== 'teacher') redirect(`/dashboard/classes/${classId}`)

  const { data: assignment } = await supabase
    .from('assignments')
    .select('id, title, description, due_date, points, submission_type, rubric_id, is_group_project, attachment_paths')
    .eq('id', assignmentId)
    .eq('class_id', classId)
    .maybeSingle()

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
    .maybeSingle()

  if (!member || (member as any).role !== 'teacher') {
    redirect(`/dashboard/classes/${classId}/assignments/${assignmentId}`)
  }

  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('*, users(full_name, email, avatar_url), assignments(*, rubrics(*))')
    .eq('id', submissionId)
    .eq('assignment_id', assignmentId)
    .maybeSingle()

  if (submissionError || !submission) notFound()

  return { submission }
}
