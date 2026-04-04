"use client";

import Link from "next/link";
import { isToday, isPast } from "date-fns";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Assignment } from "@/lib/types/schema";
import AssignmentHeader from "./AssignmentHeader";
import AssignmentFooter from "./AssignmentFooter";

interface AssignmentCardProps {
  assignment: Assignment;
  classId: string;
  muted?: boolean;
}

export default function AssignmentCard({
  assignment,
  classId,
  muted = false,
}: AssignmentCardProps) {
  const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && !assignment.has_submitted;

  const getStatus = () => {
    if (assignment.has_submitted) {
      return { label: 'Submitted', icon: CheckCircle2, color: 'emerald' };
    }
    if (isOverdue) return { label: 'Missing', icon: AlertCircle, color: 'red' };
    if (dueDate && isToday(dueDate)) return { label: 'Due Today', icon: Clock, color: 'amber' };
    return { label: 'Assigned', icon: FileText, color: 'navy' };
  };


  const status = getStatus();

  return (
    <Link
      href={`/classes/${classId}/assignments/${assignment.id}?from=work`}
      className={`group relative flex flex-col bg-white border border-navy/[0.06] rounded-xl overflow-hidden
        transition-all duration-300 hover:-translate-y-1
        shadow-[0_2px_12px_rgb(20,30,60,0.03)]
        hover:shadow-[0_12px_32px_rgba(20,30,60,0.08),0_4px_12px_rgba(20,30,60,0.04)]
        hover:border-navy/[0.12]
        ${muted ? "opacity-60 grayscale-[0.15]" : ""}`}
    >
      {/* Top glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full gap-3">
        <AssignmentHeader assignment={assignment} status={status} />

        {assignment.description && (
          <p className="text-[13px] leading-relaxed text-muted-foreground/50 line-clamp-2 max-w-[90%]">
            {assignment.description}
          </p>
        )}

        <div className="border-t border-dashed border-navy/[0.06] pt-3 mt-auto">
          <AssignmentFooter assignment={assignment} />
        </div>
      </div>
    </Link>
  );
}
