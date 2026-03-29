import { Users, User, Clock, LucideIcon } from "lucide-react";
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
      </div>

      <div className="flex flex-col gap-1 overflow-hidden">
        {assignment.description && (
          <p className="text-[13px] text-muted-foreground/60 line-clamp-1 leading-relaxed max-w-2xl break-all overflow-hidden">
            {assignment.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-1 sm:gap-0 mt-1.5 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-wide">
          {/* Date Section */}
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="opacity-40" />
            <span>{assignment.created_at ? format(new Date(assignment.created_at), "MMM d, yyyy") : "Recently"}</span>
          </div>

          <div className="flex flex-row items-center">
            <span className="text-border font-extrabold hidden sm:inline ml-1.5">·</span>

            {/* Badges Section */}
            <div className="flex items-center gap-1.5 ml-1.5 sm:ml-1.5">
              {assignment.is_group_project && (
                <div className="flex items-center text-navy gap-1.5" title="Team Project">
                  <Users size={12} className="opacity-80" />
                  <span className=" text-border font-extrabold">·</span>
                </div>
              )}
              <div className={`flex items-center ${status.text}`} title={status.label}>
                <status.icon size={12} className="opacity-80" />
              </div>
            </div>

            <span className="sm:hidden text-border font-extrabold ml-1.5">·</span>
            {/* Teacher Section */}
            <div className=" sm:hidden flex items-center gap-1.5 ml-1.5">
              <User size={10} className="opacity-40" />
              <span className=" truncate max-w-[150px]">{teacher?.full_name || "Teacher"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
