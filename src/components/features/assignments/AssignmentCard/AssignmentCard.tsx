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

/**
 * A preview card for an assignment in a list.
 * 
 * Features:
 * - Dynamic status calculation (Graded, Submitted, Missing, Assigned)
 * - Visual indicators for overdue or "due today" tasks
 * - Composes sub-components for header metadata and action footer
 */
export default function AssignmentCard({
  assignment,
  classId,
  muted = false,
}: AssignmentCardProps) {
  const dueDate = assignment.due_date ? new Date(assignment.due_date) : null;
  const isOverdue = dueDate && isPast(dueDate) && !assignment.has_submitted;

  const getStatus = () => {
    if (assignment.has_submitted) {
      if ((assignment as any).user_submission?.status === 'graded') {
        return { label: 'Graded', icon: CheckCircle2, color: 'emerald' };
      }
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
      className={`group relative flex flex-col bg-navy/5 hover:bg-white overflow-hidden
        items-stretch transition-all duration-500
       border rounded-md  hover:shadow-md hover:-translate-y-0.5 border-b-4 border-navy/90
        ${muted ? "opacity-80 grayscale-[0.1]" : ""}`}
    >
      {/* Top glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
