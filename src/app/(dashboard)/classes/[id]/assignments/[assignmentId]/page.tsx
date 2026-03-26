import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { format } from 'date-fns'
import AssignmentDetail from '@/components/assignment/AssignmentDetail'

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>
}) {
  const { id, assignmentId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get assignment
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .select('id, title, description, due_date, points, submission_type, attachment_paths, attachments, is_group_project, created_by, created_at, rubrics(*), users:created_by(full_name), classes(name)')
    .eq('id', assignmentId)
    .eq('class_id', id)
    .maybeSingle()

    
  if (assignmentError || !assignment) {
    notFound()
  }

  // Check if user is a member
  const { data: member } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!member) {
    redirect(`/dashboard/classes/${id}`)
  }

  const isTeacher = (member as { role: string }).role === 'teacher'
  const created_by = (assignment as { created_by: string }).created_by

  // Get user's submission if student
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

  // Get all submissions if teacher
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

  return (
    <AssignmentDetail
      assignment={assignment}
      isTeacher={isTeacher}
      submission={submission}
      submissions={submissions}
      userId={user.id}
      classId={id}
      // created_by={created_by} // This is the user id of the teacher who created the assignment. We need to get the teacher's name from the users table.
      teacherName={teacherName}
    />
  )
}

