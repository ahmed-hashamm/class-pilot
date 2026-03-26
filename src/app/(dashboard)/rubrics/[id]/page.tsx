
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ChevronLeft, Pencil, FileText, Calendar, BarChart3, BookOpen, Lightbulb } from 'lucide-react'

interface RubricCriterion {
  id: string
  name: string
  description?: string
  points: number
}

interface Rubric {
  id: string
  name: string
  created_at: string
  total_points: number
  criteria: RubricCriterion[]
}

export default async function RubricDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rubric, error: rubricError } = await supabase
    .from('rubrics')
    .select('id, name, created_at, total_points, criteria')
    .eq('id', id)
    .eq('created_by', user.id)
    .maybeSingle() as { data: Rubric | null; error: any }

  if (rubricError || !rubric) notFound()

  const criteria = Array.isArray(rubric.criteria) ? rubric.criteria : []

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">

      {/* Top nav */}
      <div className="flex items-center justify-between">
        <Link href="/rubrics"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold
            text-muted-foreground hover:text-navy transition-colors">
          <ChevronLeft size={15} /> Back to rubrics
        </Link>

        <Link href={`/rubrics/${rubric.id}/edit`}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold
            px-4 py-2 bg-white border border-border rounded-xl text-foreground
            hover:text-navy hover:border-navy/30 transition-all">
          <Pencil size={13} /> Edit rubric
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between
        pb-6 border-b border-border">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-navy flex items-center justify-center">
              <BookOpen size={14} className="text-yellow" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-navy">
              Rubric template
            </span>
          </div>
          <h1 className="font-black text-[clamp(22px,3vw,32px)] tracking-tight leading-tight">
            {rubric.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[12px]
            text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {format(new Date(rubric.created_at), 'MMMM d, yyyy')}
            </span>
            <span className="text-border">·</span>
            <span className="flex items-center gap-1.5">
              <BarChart3 size={12} />
              {criteria.length} criteria
            </span>
          </div>
        </div>

        {/* Total points card */}
        <div className="shrink-0 bg-navy rounded-2xl px-6 py-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
            Total value
          </p>
          <p className="font-black text-[32px] text-yellow leading-none">
            {rubric.total_points}
            <span className="text-[16px] text-white/40"> pts</span>
          </p>
        </div>
      </div>

      {/* Criteria list */}
      <div className="flex flex-col gap-3">
        <h2 className="text-[11px] font-bold tracking-[.18em] uppercase text-navy">
          Evaluation criteria
        </h2>

        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {criteria.map((criterion, index) => (
            <div key={criterion.id || index}
              className={`flex items-stretch
                ${index < criteria.length - 1 ? 'border-b border-border' : ''}`}>

              {/* Points side */}
              <div className="w-20 sm:w-24 shrink-0 bg-secondary/60 border-r border-border
                flex flex-col items-center justify-center p-4 gap-0.5">
                <span className="font-black text-[22px] text-foreground leading-none">
                  {criterion.points}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide
                  text-muted-foreground">
                  pts
                </span>
              </div>

              {/* Content side */}
              <div className="flex-1 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-navy/50">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-bold text-[14px] text-foreground">
                    {criterion.name}
                  </h3>
                </div>
                {criterion.description ? (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {criterion.description}
                  </p>
                ) : (
                  <p className="text-[12px] italic text-muted-foreground/60">
                    No description provided.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 bg-yellow/10 border border-yellow/30
        rounded-2xl px-5 py-4">
        <Lightbulb size={15} className="text-navy shrink-0 mt-0.5" />
        <p className="text-[13px] text-navy leading-relaxed">
          <strong>Tip:</strong> This rubric can be attached to any assignment. When grading,
          criteria will be used to automatically calculate the student&apos;s score.
        </p>
      </div>
    </div>
  )
}