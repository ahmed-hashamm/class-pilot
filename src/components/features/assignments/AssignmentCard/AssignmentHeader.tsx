import { Users, User, Clock, LucideIcon, Award, FileText } from "lucide-react";
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
  const teacher = assignment.users;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 w-full">
        <h3 className="font-black text-[16px] sm:text-[18px] text-foreground flex-1 break-all overflow-hidden group-hover:text-navy transition-colors tracking-tight leading-tight">
          {assignment.title}
        </h3>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-navy/60 font-black text-[11px] uppercase tracking-wider">
            <Award size={14} className="text-yellow-500 shrink-0" />
            {assignment.points ?? 100}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/70 font-bold text-[11px] uppercase tracking-wider ml-1">
            <FileText size={14} className="shrink-0" />
            {assignment.submission_count ?? 0} <span className="hidden sm:flex">Submissions</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-1 sm:gap-2 mt-0.5 text-[11px] font-bold text-muted-foreground/70 uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            {/* Date Section */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Clock size={10} className="opacity-40 shrink-0" />
              <span>{assignment.created_at ? format(new Date(assignment.created_at), "MMM d, yyyy") : "Recently"}</span>
            </div>

            <span className="text-border font-extrabold ml-1.5">·</span>

            {/* Badges Section */}
            <div className="flex items-center gap-1.5 shrink-0">
              {assignment.is_group_project && (
                <div className="flex items-center text-navy gap-1.5" title="Team Project">
                  <Users size={12} className="opacity-80 shrink-0" />
                  <span className=" text-border font-extrabold">·</span>
                </div>
              )}
              <div className={`flex items-center ${status.text}`} title={status.label}>
                <status.icon size={12} className="opacity-80" />
              </div>
            </div>
          </div>

          <span className="text-border font-extrabold hidden sm:inline ml-1.5">·</span>

          {/* Teacher Section - Mobile Only (Desktop has it in footer) */}
          <div className="sm:hidden flex items-center gap-1.5 opacity-80 mt-0.5">
            <User size={10} className="opacity-40" />
            <span className="truncate max-w-[150px]">{teacher?.full_name || "Teacher"}</span>
          </div>
        </div>

        {assignment.description && (
          <p className="text-[13px] text-muted-foreground/60 line-clamp-1 leading-relaxed max-w-2xl break-all overflow-hidden mt-1">
            {assignment.description}
          </p>
        )}
      </div>
    </div>
  );
}
