import { Clock, Star, ChevronRight } from "lucide-react";
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
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Metadata Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {assignment.due_date && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/60 text-navy/40 text-[10px] font-semibold">
            <Clock size={10} className="shrink-0 opacity-60" />
            <span>Due {format(new Date(assignment.due_date), "MMM d, h:mm a")}</span>
          </div>
        )}

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary/60 text-navy/40 text-[10px] font-semibold">
          <Star size={10} className="shrink-0 opacity-60 text-yellow-600 fill-yellow-500/20" />
          <span>{assignment.points ?? 100} pts</span>
        </div>
      </div>

      {/* Teacher avatar */}
      <div className="flex items-center gap-1.5 group/author shrink-0">
        <div className="size-6 rounded-lg overflow-hidden border border-navy/[0.06] bg-navy/5 flex items-center justify-center
          text-[9px] font-black text-navy shrink-0 relative">
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

        <span className="hidden sm:block text-[11px] font-semibold text-navy/40 group-hover/author:text-navy transition-colors
          truncate max-w-[100px]">
          {teacher?.full_name || "Teacher"}
        </span>
      </div>
    </div>
  );
}
