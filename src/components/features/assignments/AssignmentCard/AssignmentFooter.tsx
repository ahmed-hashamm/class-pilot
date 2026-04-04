import { Award, FileText, ChevronRight, Clock, Star } from "lucide-react";
import Image from "next/image";
import { Assignment } from "@/lib/types/schema";
import { useState } from "react";
import { format } from "date-fns";

interface AssignmentFooterProps {
  assignment: Assignment;
}

export default function AssignmentFooter({ assignment }: AssignmentFooterProps) {
  const [imgError, setImgError] = useState(false);
  const teacher = assignment.users;

  return (
    <div className="flex  items-center justify-between gap-4 w-full">
      {/* Metadata Pills - Left side */}
      <div className="flex flex-wrap items-center gap-2">
        {assignment.due_date && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy/[0.03] border border-black/[0.03] text-navy/50 text-[11px] font-bold">
            <Clock size={12} className="shrink-0 opacity-60" />
            <span>Due {format(new Date(assignment.due_date), "MMM d, h:mm a")}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy/[0.03] border border-black/[0.03] text-navy/50 text-[11px] font-bold">
          <Star size={12} className="shrink-0 opacity-60 text-yellow-600 fill-yellow-600/10" />
          <span>{assignment.points ?? 100} pts</span>
        </div>

        {/* <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy/[0.03] border border-black/[0.03] text-navy/50 text-[11px] font-bold">
          <FileText size={12} className="shrink-0 opacity-60" />
          <span>{assignment.submission_count ?? 0}</span>
        </div> */}
      </div>

      {/* Profile Section - Right side */}
      <div className="flex items-center gap-2 group/author shrink-0">
        <div className="size-8 rounded-full overflow-hidden border border-navy/10 bg-navy/5 flex items-center justify-center text-[11px] font-black text-navy shrink-0 relative shadow-sm">
          {teacher?.avatar_url && !imgError ? (
            <Image
              src={teacher.avatar_url.startsWith('http') ? teacher.avatar_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${teacher.avatar_url}`}
              alt={teacher.full_name || "Teacher"}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="uppercase">{teacher?.full_name?.charAt(0) || "T"}</span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[12px] font-bold text-navy/60 transition-colors group-hover/author:text-navy truncate max-w-[120px] tracking-tight">
            {teacher?.full_name || "Teacher"}
          </span>
          <ChevronRight size={14} className="text-navy/20 group-hover/author:text-navy group-hover/author:translate-x-0.5 transition-all" />
        </div>
      </div>
    </div>
  );
}
