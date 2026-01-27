import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import GradeSubmission from '@/components/grading/GradeSubmission'

export default async function SubmissionGradingPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string; submissionId: string }>
}) {
  const { id, assignmentId, submissionId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify user is a teacher
  const { data: member } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', id)
    .eq('user_id', user.id)
    .single()

  // OR more safely:
if (!member || (member as any).role !== 'teacher') {
  redirect(`/dashboard/classes/${id}/assignments/${assignmentId}`)
}
  // Get submission with user info
  const { data: submission, error: submissionError } = await supabase
    .from('submissions')
    .select('*, users(full_name, email, avatar_url), assignments(*, rubrics(*))')
    .eq('id', submissionId)
    .eq('assignment_id', assignmentId)
    .single()

  if (submissionError || !submission) {
    notFound()
  }

  return (
    <div className="mx-auto ">
      <GradeSubmission submission={submission} classId={id} />
    </div>
  )
}

