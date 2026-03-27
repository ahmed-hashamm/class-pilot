"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ClipboardList, Award, Calendar, ArrowRight } from "lucide-react";
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";

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
      className="group flex items-start gap-4 p-5 transition-colors
        hover:bg-secondary/40 border-b border-border last:border-none"
    >
      {/* Icon */}
      <div className="shrink-0 size-11 rounded-xl bg-navy/8 border border-navy/15 
        text-navy flex items-center justify-center group-hover:bg-navy/12 transition-colors">
        <ClipboardList size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-bold text-[15px] truncate transition-colors
            group-hover:text-navy text-foreground">
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

        <p className="flex items-center gap-2 text-[12px] text-muted-foreground mb-1">
          <Calendar size={11} />
          {assignment.due_date
            ? `Due ${format(new Date(assignment.due_date), "MMM d, h:mm a")}`
            : "No due date"}
          <span className="text-border">·</span>
          <span className="font-medium">{assignment.users?.full_name || "Teacher"}</span>
        </p>

        {assignment.description && (
          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mt-2">
            {assignment.description}
          </p>
        )}

        {/* Attachments */}
        {(assignment.attachment_paths || assignment.attachments) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {(assignment.attachment_paths || assignment.attachments).map((path: any, idx: number) => {
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
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
