"use client";

import Link from "next/link";
import { isToday, isPast } from "date-fns";
import { 
  Award, 
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Assignment } from "@/lib/types/schema";
import AssignmentDateBox from "./AssignmentDateBox";
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
      className={`group relative flex items-stretch gap-0 bg-white border border-border rounded-2xl overflow-hidden transition-all duration-300
        hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1 active:scale-[0.99]
        ${muted ? "opacity-75 grayscale-[0.2]" : ""}`}
    >
      <AssignmentDateBox dueDate={dueDate} muted={muted} />

      {/* Main Content Area */}
      <div className="flex-1 p-5 sm:p-6 min-w-0 flex flex-col gap-4">
        <AssignmentHeader assignment={assignment} status={status} />
        <AssignmentFooter assignment={assignment} />
      </div>
    </Link>
  );
}
