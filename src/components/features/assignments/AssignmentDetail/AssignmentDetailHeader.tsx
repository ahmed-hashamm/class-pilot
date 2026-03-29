import { User, ClipboardList, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { format, isPast } from "date-fns";
import { Assignment } from "@/lib/types/schema";

interface AssignmentDetailHeaderProps {
  assignment: Assignment;
  isTeacher?: boolean;
  isTurnedIn?: boolean;
  isGraded?: boolean;
}

export default function AssignmentDetailHeader({ 
  assignment, 
  isTeacher, 
  isTurnedIn, 
  isGraded 
}: AssignmentDetailHeaderProps) {
  const isExpired = assignment.due_date ? isPast(new Date(assignment.due_date)) : false;

  const getStatus = () => {
    if (isTeacher) {
      if (isExpired) return { label: "Ended", icon: AlertCircle, classes: "bg-red-50 text-red-700 border-red-200" };
      return { label: "Active", icon: Clock, classes: "bg-green-50 text-green-700 border-green-200" };
    }
    if (isGraded) return { label: "Graded", classes: "bg-navy text-white border-navy" };
    if (isTurnedIn) return { label: "Turned in", classes: "bg-green-50 text-green-700 border-green-200" };
    return { label: "Assigned", classes: "bg-yellow/10 text-navy border-yellow/30" };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="shrink-0 size-12 rounded-2xl bg-navy flex items-center justify-center text-yellow shadow-sm">
          <ClipboardList size={22} />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <h1 className="font-black text-[22px] sm:text-[24px] tracking-tight leading-tight text-foreground break-words">
            {assignment.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-[13px] text-muted-foreground font-medium">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <User size={13} className="text-navy/60" />
              {assignment.users?.full_name || "Instructor"}
            </span>
            <span className="text-border hidden sm:inline">·</span>
            <span className="whitespace-nowrap">
              Posted {assignment.created_at ? format(new Date(assignment.created_at), "MMM d, yyyy") : ""}
            </span>
          </div>
        </div>
      </div>

      <span className={`w-fit shrink-0 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider rounded-full px-4 py-1.5 border self-start ${status.classes}`}>
        {isTeacher && status.icon && <status.icon size={13} />}
        {(isGraded || isTurnedIn) && !isTeacher && <CheckCircle2 size={13} />} 
        {status.label}
      </span>
    </div>
  );
}
