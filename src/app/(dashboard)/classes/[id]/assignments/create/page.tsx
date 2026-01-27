import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateAssignmentForm from '@/components/assignment/CreateAssignmentForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CreateAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify user is a teacher in this class
  const { data: member } = await supabase
    .from('class_members')
    .select('role')
    .eq('class_id', id)
    .eq('user_id', user.id)
    .single()

  if (!member || (member as { role: string }).role !== 'teacher') {
    redirect(`/classes/${id}`)
  }

  // Get available rubrics
  const { data: rubrics } = await supabase
    .from('rubrics')
    .select('id, name, total_points')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-12">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 mb-6">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href={`/classes/${id}?tab=work`} 
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ChevronLeft size={18} />
            Back to Class
          </Link>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Draft Assignment</span>
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Form Container */}
      <main className="max-w-5xl mx-auto px-4">
        {/* <div className="flex flex-col gap-2 mb-6">
          <h1 className="text-2xl font-black text-navy tracking-tight">
            Create Assignment
          </h1>
          <p className="text-gray-500 text-sm">
            Fill out the details below to publish a new task to your students.
          </p>
        </div> */}

        {/* The updated compact form component */}
        <CreateAssignmentForm 
          classId={id} 
          userId={user.id} 
          rubrics={rubrics || []} 
        />
      </main>
    </div>
  )
}