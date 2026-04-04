import { Users, Clock, LucideIcon, Award, FileText } from "lucide-react";
import { format } from "date-fns";
import { Assignment } from "@/lib/types/schema";

interface AssignmentHeaderProps {
  assignment: Assignment;
  status: {
    label: string;
    icon: LucideIcon;
    text: string;
    bg: string;
  };
}

export default function AssignmentHeader({ assignment, status }: AssignmentHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      {/* Title & Status Badge */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="font-black text-[18px] sm:text-[20px] text-foreground tracking-tighter leading-tight group-hover:text-navy transition-colors">
            {assignment.title}
          </h3>

          {/* Posted Date Info */}
          <div className="flex items-center gap-1.5 text-muted-foreground/40 text-[11px] font-medium italic">
            <Clock size={11} className="shrink-0 opacity-50" />
            <span>Posted {assignment.created_at ? format(new Date(assignment.created_at), "MMM d") : "Recently"}</span>
          </div>
        </div>

        {/* Rounded Status badge from the design */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy/[0.03] border border-black/[0.03] text-navy/50 text-[11px] font-bold">
          <FileText size={12} className="shrink-0 opacity-60" />
          <span>{assignment.submission_count ?? 0}</span>
        </div>
        <div className={`shrink-0 h-fit flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300
          ${status.label === 'Missing' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
            status.label === 'Due Today' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
              status.label === 'Submitted' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                'bg-navy/5 text-navy/60 border-navy/10'}`}>
          <span>{status.label}</span>
        </div>
      </div>
    </div>
  );
}
