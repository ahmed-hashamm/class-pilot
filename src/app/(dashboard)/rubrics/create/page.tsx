import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateRubricForm from '@/components/grading/CreateRubricForm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { ArrowLeft } from 'lucide-react'
export default async function CreateRubricPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="mx-auto max-w-3xl p-6 ">
      {/* TOP BAR */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Rubric</h1>
      <CreateRubricForm userId={user.id} />
    </div>
  )
}

