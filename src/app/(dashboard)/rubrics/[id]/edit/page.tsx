import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import RubricForm from '@/components/grading/CreateRubricForm'

export default async function EditRubricPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: rubric } = await supabase
    .from('rubrics')
    .select('*')
    .eq('id', id)
    .eq('created_by', user.id)
    .single()

  if (!rubric) notFound()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Rubric</h1>
        <p className="text-gray-500">Modify your criteria or point values.</p>
      </div>

      <RubricForm userId={user.id} initialData={rubric} />
    </div>
  )
}