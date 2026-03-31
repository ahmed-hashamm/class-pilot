import { getClassDetail } from '@/lib/db_data_fetching/class-detail'
import ClassDashboardClient from '@/components/features/classes/ClassDashboardClient'

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, classData, isTeacher } = await getClassDetail(id)

  return (
    <ClassDashboardClient
      classId={id}
      userId={user.id}
      className={classData.name}
      classDescription={classData.description}
      classSettings={classData.settings}
      classCode={classData.code}
      isTeacher={isTeacher}
    />
  )
}