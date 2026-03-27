import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateRubricForm from '@/components/features/grading/CreateRubricForm'
import { BookOpen, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function CreateRubricPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
      {/* Back */}
      <Link href="/rubrics"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold
          text-muted-foreground hover:text-navy transition-colors w-fit">
        <ChevronLeft size={15} /> Back to rubrics
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
          <BookOpen size={17} className="text-yellow" />
        </div>
        <div>
          <h1 className="font-black text-[20px] tracking-tight">Create rubric</h1>
          <p className="text-[13px] text-muted-foreground">
            Set your evaluation standards.
          </p>
        </div>
      </div>

      <CreateRubricForm userId={user.id} />
    </div>
  )
}
