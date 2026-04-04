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
      // Note: mapping logic can be more complex if submission status is available
      return { label: 'Submitted', icon: CheckCircle2, text: 'text-green-600', bg: 'sm:bg-green-50 sm:border-green-100' };
    }
    if (isOverdue) return { label: 'Missing', icon: AlertCircle, text: 'text-red-600', bg: 'sm:bg-red-50 sm:border-red-100' };
    if (dueDate && isToday(dueDate)) return { label: 'Due Today', icon: Clock, text: 'text-orange-600', bg: 'sm:bg-orange-50 sm:border-orange-100' };
    return { label: 'Assigned', icon: FileText, text: 'text-navy/60', bg: 'sm:bg-navy/5 sm:border-navy/10' };
  };

  const status = getStatus();

  return (
    <Link
      href={`/classes/${classId}/assignments/${assignment.id}?from=work`}
      className={`group relative flex flex-col bg-white border border-navy/[0.08] rounded-[24px] transition-all duration-500
        hover:-translate-y-2 shadow-[0_8px_30px_rgb(20,30,60,0.04),0_4px_8px_rgb(20,30,60,0.02)] 
        hover:shadow-[0_20px_40px_rgba(20,30,60,0.1),0_10px_20px_rgba(20,30,60,0.05)] active:scale-[0.98]
        ${muted ? "opacity-75 grayscale-[0.2]" : ""}`}
    >
      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full gap-4">
        <AssignmentHeader assignment={assignment} status={status} />

        {assignment.description && (
          <p className="text-[14px] leading-relaxed text-muted-foreground/60 line-clamp-1 max-w-[90%] tracking-tight">
            {assignment.description}
          </p>
        )}

        <hr className="border-navy/20 mt-2" />

        <div className="mt-auto">
          <AssignmentFooter assignment={assignment} />
        </div>
      </div>
    </Link>
  );
}
