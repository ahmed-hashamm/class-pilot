import { notFound } from "next/navigation"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ClassTabs from "@/components/class/ClassTabs"
import ClassDashboardClient from "@/components/class/ClassDashboardClient"
import { Suspense } from "react"

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch class
  const { data: rawClass, error: classError } = await supabase
    .from('classes')
    .select('id, name, description, settings, code, created_by')
    .eq('id', id)
    .maybeSingle()

  if (classError || !rawClass) {
    notFound()
  }

  // Fetch membership (optional)
  const { data: rawMember } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const isTeacher =
    (rawMember as { role: string } | null)?.role === 'teacher' ||
    (rawClass as { created_by: string }).created_by === user.id

  return (

    <>


      <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-white font-bold tracking-widest uppercase">Loading class...</div>}>
        <ClassDashboardClient
          classId={id}
          userId={user.id}
          className={(rawClass as any).name}
          classDescription={(rawClass as any).description}
          classSettings={(rawClass as any).settings}
          classCode={(rawClass as any).code}
          isTeacher={isTeacher}
        />
      </Suspense>
    </>
  )
}

