'use client'

import { format, isAfter, startOfDay } from 'date-fns'
import { safeDate } from "@/lib/utils";

/**
 * Renders a compact list of the top 3 upcoming assignments.
 */
interface ClassCardAssignmentsProps {
  /** Raw assignment records from Supabase */
  assignments: any[]
}

export function ClassCardAssignments({ assignments }: ClassCardAssignmentsProps) {
  // Filter for upcoming assignments only (due date is null or in the future)
  const upcomingAssignments = (assignments || []).filter((a: any) => {
    if (!a.due_date) return true;
    // Include if due today or in the future
    return isAfter(safeDate(a.due_date), startOfDay(new Date())) ||
      format(safeDate(a.due_date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  }).slice(0, 3); // Limit to top 3

  return (
    <div className="flex flex-col flex-1 mb-5">
      {upcomingAssignments.length > 0 ? (
        <div className="bg-white/60 dark:bg-black/10 rounded-xl p-3 border border-border/40">
          <ul className="flex flex-col gap-2.5">
            {upcomingAssignments.map((a: any) => (
              <li key={a.id} className="flex items-start justify-between gap-2">
                <span className="truncate text-[13px] font-medium text-foreground relative pl-3 before:content-[''] before:absolute before:left-0 before:top-[6px] before:w-1.5 before:h-1.5 before:bg-navy/40 before:rounded-full">
                  {a.title}
                </span>
                {a.due_date && (
                  <span className="shrink-0 text-[11px] text-muted-foreground mt-0.5">
                    {format(safeDate(a.due_date), 'MMM d')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[12px] text-muted-foreground italic py-1 pl-1">
            No upcoming deadlines
          </p>
        </div>
      )}
    </div>
  )
}
