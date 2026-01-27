import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { ChevronLeft, Pencil, FileText, Calendar, BarChart3 } from 'lucide-react'

interface RubricCriterion {
  id: string;
  name: string;
  description?: string;
  points: number;
}

interface Rubric {
  id: string;
  name: string;
  created_at: string;
  total_points: number;
  criteria: RubricCriterion[];
}

export default async function RubricDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: rubric, error: rubricError } = await supabase
    .from('rubrics') 
    .select('*')
    .eq('id', id)
    .eq('created_by', user.id)
    .single() as { data: Rubric | null, error: any }

  if (rubricError || !rubric) {
    notFound()
  }

  const criteria = Array.isArray(rubric.criteria) ? rubric.criteria : []

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 1. TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link 
          href="/rubrics" 
          className="flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors gap-1"
        >
          <ChevronLeft size={16} />
          Back to Rubrics
        </Link>
        <Link href={`/rubrics/${rubric.id}/edit`} className="flex items-center p-2 border rounded-md text-sm font-medium bg-white text-orange-600 hover:text-white hover:bg-orange-600 transition-colors gap-2">
          <Pencil size={14} />
          Edit Rubric
        </Link>
      </div>

      {/* 2. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-orange-600">
            <FileText size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Rubric Template</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {rubric.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {format(new Date(rubric.created_at), 'MMMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <BarChart3 size={14} />
              {criteria.length} Criteria
            </span>
          </div>
        </div>

        <div className="bg-orange-50 px-6 py-4 rounded-2xl border border-orange-100 text-center">
          <p className="text-[10px] font-bold uppercase text-orange-600 tracking-widest">Total Value</p>
          <p className="text-3xl font-black text-orange-700">{rubric.total_points} <span className="text-sm font-medium">pts</span></p>
        </div>
      </div>

      {/* 3. CRITERIA LIST */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Evaluation Criteria</h2>
        <div className="grid gap-3">
          {criteria.map((criterion, index) => (
            <Card key={criterion.id || index} className="border-gray-100 shadow-sm hover:border-orange-200 transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-stretch">
                  {/* Point Label Side */}
                  <div className="sm:w-32 bg-gray-50/50 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100 p-4">
                    <span className="text-2xl font-black text-gray-700">{criterion.points}</span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">Points</span>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          <span className="text-orange-500 text-xs">{String(index + 1).padStart(2, '0')}</span>
                          {criterion.name}
                        </h3>
                        {criterion.description ? (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {criterion.description}
                          </p>
                        ) : (
                          <p className="text-xs italic text-gray-400">No description provided.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 4. FOOTER INFO */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex gap-3 items-start">
        <div className="text-blue-500 mt-0.5">
          <BarChart3 size={18} />
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Tip:</strong> This rubric can be attached to any assignment. When grading, you can click on these criteria to automatically calculate the student&apos;s score.
        </p>
      </div>
    </div>
  )
}