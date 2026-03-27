import { Suspense } from 'react'
import { getClassDetail } from '@/lib/data/class-detail'
import ClassDashboardClient from '@/components/class/ClassDashboardClient'

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, classData, isTeacher } = await getClassDetail(id)

  return (
    <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-white font-bold tracking-widest uppercase">Loading class...</div>}>
      <ClassDashboardClient
        classId={id}
        userId={user.id}
        className={classData.name}
        classDescription={classData.description}
        classSettings={classData.settings}
        classCode={classData.code}
        isTeacher={isTeacher}
      />
    </Suspense>
  )
}