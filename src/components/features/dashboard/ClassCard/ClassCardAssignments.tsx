'use client'

import { format, isAfter, startOfDay } from 'date-fns'

interface ClassCardAssignmentsProps {
  assignments: any[]
}

export function ClassCardAssignments({ assignments }: ClassCardAssignmentsProps) {
  // Filter for upcoming assignments only (due date is null or in the future)
  const upcomingAssignments = (assignments || []).filter((a: any) => {
    if (!a.due_date) return true;
    // Include if due today or in the future
    return isAfter(new Date(a.due_date), startOfDay(new Date())) ||
      format(new Date(a.due_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  }).slice(0, 3); // Limit to top 3

  return (
    <div className="flex flex-col gap-1.5 flex-1 mb-5">
      {upcomingAssignments.length > 0 ? (
        upcomingAssignments.map((a: any) => (
          <div key={a.id}
            className="flex items-center justify-between gap-2 px-3 py-2
              bg-secondary/50 rounded-lg border border-border/40 hover:border-border/80 transition-colors">
            <span className="truncate text-[12px] font-medium text-foreground">
              {a.title}
            </span>
            {a.due_date && (
              <span className="shrink-0 text-[11px] text-muted-foreground font-medium">
                {format(new Date(a.due_date), 'MMM d')}
              </span>
            )}
          </div>
        ))
      ) : (
        <p className="text-[12px] text-muted-foreground italic py-1 pl-1">
          No upcoming deadlines
        </p>
      )}
    </div>
  )
}
