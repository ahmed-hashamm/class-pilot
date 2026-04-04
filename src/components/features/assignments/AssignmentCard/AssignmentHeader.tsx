import { Clock, LucideIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { Assignment } from "@/lib/types/schema";

interface AssignmentHeaderProps {
  assignment: Assignment;
  status: {
    label: string;
    icon: LucideIcon;
    color: string;
  };
}

const STATUS_STYLES: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  red: 'bg-red-50 text-red-600 border-red-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  navy: 'bg-navy/5 text-navy/60 border-navy/10',
};

export default function AssignmentHeader({ assignment, status }: AssignmentHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="font-bold text-[15px] sm:text-[16px] text-foreground tracking-tight leading-snug
          group-hover:text-navy transition-colors line-clamp-1">
          {assignment.title}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground/35 text-[11px] font-medium">
          <Clock size={10} className="shrink-0" />
          <span>Posted {assignment.created_at ? format(new Date(assignment.created_at), "MMM d") : "Recently"}</span>
        </div>
      </div>

      {/* Status & Submission badges */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Submission count */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/60 text-navy/40 text-[10px] font-bold">
          <FileText size={10} className="shrink-0" />
          <span>{assignment.submission_count ?? 0}</span>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider
          border ${STATUS_STYLES[status.color]}`}>
          <status.icon size={10} className="shrink-0" />
          <span>{status.label}</span>
        </div>
      </div>
    </div>
  );
}
