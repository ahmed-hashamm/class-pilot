import { getRubricsList } from '@/lib/db_data_fetching/rubrics'
import Link from 'next/link'
import { Plus, FileText, ChevronRight, BookOpen } from 'lucide-react'
import { Button, PageHeader, EmptyState } from '@/components/ui'

export default async function RubricsPage() {
  const { rubrics } = await getRubricsList()

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 flex flex-col">
      <PageHeader
        title="Rubrics"
        description="Manage your evaluation standards"
        icon={BookOpen}
        backHref="/dashboard"
        backLabel="Back to dashboard"
        action={
          <Link href="/rubrics/create">
            <Button variant="primary" className="gap-2">
              <Plus size={16} />
              <span>New rubric</span>
            </Button>
          </Link>
        }
      />

      {/* List */}
      {rubrics && rubrics.length > 0 ? (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          {rubrics.map((rubric, i) => (
            <Link key={rubric.id} href={`/rubrics/${rubric.id}`}
              className={`group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 transition-all
                hover:bg-secondary/30
                ${i < rubrics.length - 1 ? 'border-b border-border/60' : ''}`}>

              {/* Icon */}
              <div className="shrink-0 size-10 sm:size-12 rounded-2xl bg-navy/5 border border-navy/10
                flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all duration-300">
                <FileText size={20} className="group-hover:text-white transition-colors" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 mb-1">
                  <h3 className="font-bold text-[15px] sm:text-[16px] text-navy truncate max-w-full
                    group-hover:translate-x-0.5 transition-transform duration-300">
                    {rubric.name}
                  </h3>
                  <span className="shrink-0 text-[9px] sm:text-[10px] font-black uppercase
                    tracking-widest bg-navy/5 border border-navy/10
                    rounded-lg px-2 py-0.5 text-navy/40">
                    {Array.isArray(rubric.criteria) ? rubric.criteria.length : 0} criteria
                  </span>
                </div>
                <p className="text-[11px] sm:text-[12px] text-muted-foreground font-medium">
                  Created {rubric.created_at ? new Date(rubric.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  }) : 'recently'}
                </p>
              </div>

              {/* Points */}
              <div className="shrink-0 text-right px-2 sm:px-4">
                <p className="font-black text-[18px] sm:text-[22px] text-navy tabular-nums leading-none">
                  {rubric.total_points}
                </p>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest
                  text-navy/30 mt-0.5">
                  pts
                </p>
              </div>

              <ChevronRight size={18}
                className="shrink-0 text-muted-foreground/30 group-hover:text-navy
                  group-hover:translate-x-1 transition-all duration-300 hidden sm:block" />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          variant="dashboard"
          icon={FileText}
          title="No rubrics yet"
          description="Create your first grading rubric to simplify your feedback process and ensure consistency."
          actions={
            <Link href="/rubrics/create">
              <Button variant="primary" className="mt-2 gap-2 px-6">
                <Plus size={16} />
                <span>Create first rubric</span>
              </Button>
            </Link>
          }
        />
      )}
    </div>
  )
}
