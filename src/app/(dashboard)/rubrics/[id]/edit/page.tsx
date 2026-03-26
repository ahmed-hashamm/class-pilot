
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Pencil } from 'lucide-react'
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
    .from('rubrics').select('id, name, created_at, total_points, criteria')
    .eq('id', id).eq('created_by', user.id).maybeSingle()

  if (!rubric) notFound()

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">

      {/* Back */}
      <Link href={`/rubrics/${id}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold
          text-muted-foreground hover:text-navy transition-colors w-fit">
        <ChevronLeft size={15} /> Back to rubric
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
          <Pencil size={15} className="text-yellow" />
        </div>
        <div>
          <h1 className="font-black text-[20px] tracking-tight">Edit rubric</h1>
          <p className="text-[13px] text-muted-foreground">
            Modify criteria or point values.
          </p>
        </div>
      </div>

      <RubricForm userId={user.id} initialData={rubric} />
    </div>
  )
}