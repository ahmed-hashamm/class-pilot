import { Award, FileText, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Assignment } from "@/lib/types/schema";
import { useState } from "react";

interface AssignmentFooterProps {
  assignment: Assignment;
}

export default function AssignmentFooter({ assignment }: AssignmentFooterProps) {
  const [imgError, setImgError] = useState(false);
  const teacher = assignment.users;

  return (
    <div className="flex items-center justify-between gap-4 mt-auto pt-3 border-t border-secondary/40">
      <div className="flex items-center gap-4">
        {/* Points */}
        <div className="flex items-center gap-1.5 text-navy/60 font-black text-[11px] uppercase tracking-wider">
          <Award size={14} className="text-yellow-500" />
          {assignment.points ?? 100} PTS
        </div>

        {/* Submissions Count - Desktop only */}
        <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground/30 font-bold text-[11px] uppercase tracking-wider ml-1">
          <FileText size={14} />
          {assignment.submission_count} Submissions
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-3 ml-auto pr-1">
        {/* Teacher Avatar - Desktop only */}
        <div className="flex items-center gap-2 group/author shrink-0">
          <div className="size-5 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center text-[9px] font-black text-navy shrink-0 relative">
            {teacher?.avatar_url && !imgError ? (
              <Image 
                src={teacher.avatar_url.startsWith('http') ? teacher.avatar_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${teacher.avatar_url}`}
                alt={teacher.full_name || "Teacher"}
                fill
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : teacher?.full_name?.charAt(0)}
          </div>
          <span className="text-[10px] font-bold text-muted-foreground/50 transition-colors group-hover/author:text-navy truncate max-w-[100px]">
            {teacher?.full_name || "Teacher"}
          </span>
        </div>

        {/* Quick Link Button - Far Right */}
        <div className="size-7 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground/40 group-hover:bg-navy group-hover:text-white transition-all shrink-0 shadow-sm border border-border/50">
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}
