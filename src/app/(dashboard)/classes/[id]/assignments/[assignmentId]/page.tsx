import { getAssignmentDetail } from '@/lib/data/assignments'
import AssignmentDetail from '@/components/assignment/AssignmentDetail'

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
