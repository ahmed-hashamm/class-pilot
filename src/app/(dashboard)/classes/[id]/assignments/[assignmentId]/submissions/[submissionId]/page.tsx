import { getSubmissionGradingData } from '@/lib/db_data_fetching/assignments'
import GradeSubmission from '@/components/features/grading/GradeSubmission'

export default async function SubmissionGradingPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string; submissionId: string }>
}) {
  const { id, assignmentId, submissionId } = await params
  const { submission } = await getSubmissionGradingData(id, assignmentId, submissionId)

  return (
    <div className="mx-auto ">
      <GradeSubmission submission={submission} classId={id} />
    </div>
  )
}
