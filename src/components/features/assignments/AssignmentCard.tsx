"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ClipboardList, Award, Calendar, ArrowRight } from "lucide-react";
import AttachmentButton from "@/components/features/classes/Buttons/AttachmentButton";

interface AssignmentCardProps {
  assignment: any;
  classId: string;
  getDisplayName: (path: string) => string;
  muted?: boolean;
}

export default function AssignmentCard({
  assignment,
  classId,
  getDisplayName,
  muted = false,
}: AssignmentCardProps) {
  return (
    <Link
      href={`/classes/${classId}/assignments/${assignment.id}?from=work`}
      className={`group flex items-start gap-4 p-5 transition-colors
        hover:bg-secondary/40 border-b border-border last:border-none
        ${muted ? "opacity-70" : ""}`}
    >
      {/* Icon */}
      <div className={`shrink-0 size-11 rounded-xl flex items-center
        justify-center border transition-colors
        ${muted
          ? "bg-secondary text-muted-foreground border-border group-hover:bg-border"
          : "bg-navy/8 border-navy/15 text-navy group-hover:bg-navy/12"
        }`}>
        <ClipboardList size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className={`font-bold text-[15px] truncate transition-colors
            group-hover:text-navy
            ${muted ? "text-muted-foreground" : "text-foreground"}`}>
            {assignment.title}
          </h3>

          {/* Points badge */}
          {assignment.points != null && (
            <span className="shrink-0 inline-flex items-center gap-1
              bg-yellow/20 text-navy border border-yellow/40
              text-[10px] font-bold rounded-full px-2.5 py-0.5">
              <Award size={10} />
              {assignment.points} pts
            </span>
          )}
        </div>

        {assignment.description && (
          <p className="text-[13px] text-muted-foreground line-clamp-1 mb-2">
            {assignment.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {/* Due date */}
          {assignment.due_date && (
            <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium
              ${muted ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
              <Calendar size={12} />
              Due {format(new Date(assignment.due_date), "MMM d, h:mm a")}
            </span>
          )}

          {/* Attachments */}
          {(assignment.attachment_paths || assignment.attachments) && (
            (assignment.attachment_paths || assignment.attachments).map((path: any, idx: number) => {
              const filePath = typeof path === 'string' ? path : path.path;
              return (
                <AttachmentButton
                  key={idx}
                  asDiv
                  path={filePath}
                  type="assignment"
                  label={getDisplayName(filePath)}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight size={15} className="shrink-0 mt-0.5 text-muted-foreground/40
        group-hover:text-navy group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}
