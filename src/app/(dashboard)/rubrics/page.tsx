import { getRubricsList } from '@/lib/data/rubrics'
import Link from 'next/link'
import { Plus, FileText, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react'

export default async function RubricsPage() {
  const { rubrics } = await getRubricsList()

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
      {/* Back */}
      <Link href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold
          text-muted-foreground hover:text-navy transition-colors w-fit">
        <ChevronLeft size={15} /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
            <BookOpen size={17} className="text-yellow" />
          </div>
          <div>
            <h1 className="font-black text-[20px] tracking-tight">Rubrics</h1>
            <p className="text-[13px] text-muted-foreground">
              Manage your evaluation standards.
            </p>
          </div>
        </div>

        <Link href="/rubrics/create">
          <button className="inline-flex items-center gap-2 bg-navy text-white
            font-semibold text-[13px] px-5 py-2.5 rounded-xl shadow-sm
            hover:bg-navy/90 hover:-translate-y-0.5 transition-all
            cursor-pointer border-none">
            <Plus size={14} /> New rubric
          </button>
        </Link>
      </div>

      {/* List */}
      {rubrics && rubrics.length > 0 ? (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {rubrics.map((rubric, i) => (
            <Link key={rubric.id} href={`/rubrics/${rubric.id}`}
              className={`group flex items-center gap-4 px-5 py-4 transition-colors
                hover:bg-secondary/40
                ${i < rubrics.length - 1 ? 'border-b border-border' : ''}`}>

              {/* Icon */}
              <div className="shrink-0 size-11 rounded-xl bg-navy/8 border border-navy/15
                flex items-center justify-center group-hover:bg-navy/12 transition-colors">
                <FileText size={18} className="text-navy" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-[15px] text-foreground truncate
                    group-hover:text-navy transition-colors">
                    {rubric.name}
                  </h3>
                  <span className="shrink-0 text-[10px] font-bold uppercase
                    tracking-wide bg-secondary border border-border
                    rounded-full px-2 py-0.5 text-muted-foreground">
                    {Array.isArray(rubric.criteria) ? rubric.criteria.length : 0} criteria
                  </span>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  Created {rubric.created_at ? new Date(rubric.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  }) : 'recently'}
                </p>
              </div>

              {/* Points */}
              <div className="shrink-0 text-right">
                <p className="font-black text-[20px] text-foreground tabular-nums">
                  {rubric.total_points}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest
                  text-muted-foreground">
                  pts
                </p>
              </div>

              <ChevronRight size={16}
                className="shrink-0 text-muted-foreground/40 group-hover:text-navy
                  group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center gap-3
          py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
            flex items-center justify-center">
            <FileText size={24} className="text-navy/40" />
          </div>
          <p className="font-bold text-[16px] tracking-tight">No rubrics yet</p>
          <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
            Create your first grading rubric to simplify your feedback process.
          </p>
          <Link href="/rubrics/create">
            <button className="mt-2 inline-flex items-center gap-2 bg-navy text-white
              font-semibold text-[13px] px-5 py-2.5 rounded-xl
              hover:bg-navy/90 transition cursor-pointer border-none">
              <Plus size={14} /> Create first rubric
            </button>
          </Link>
        </div>
      )}
    </div>
  )
}
