import { getAssignmentDetail } from '@/lib/db_data_fetching/assignments'
import AssignmentDetail from '@/components/features/assignments/AssignmentDetail'
export const dynamic = 'force-dynamic'

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>
}) {
  const { id, assignmentId } = await params
  const { user, assignment, isTeacher, submission, submissions, teacherName } =
    await getAssignmentDetail(id, assignmentId)

  return (
    <AssignmentDetail
      assignment={assignment}
      isTeacher={isTeacher}
      submission={submission}
      submissions={submissions}
      userId={user.id}
      classId={id}
      teacherName={teacherName}
    />
  )
}
