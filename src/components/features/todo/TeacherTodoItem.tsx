import { Users, Calendar as CalendarIcon, FileText, Clock, XCircle } from "lucide-react";
import { safeDate } from "@/lib/utils";
import { format, isPast } from "date-fns";
import Link from "next/link";
import { TodoAssignment } from "@/lib/db_data_fetching/todo";

interface TeacherTodoItemProps {
  assignment: TodoAssignment;
}

export function TeacherTodoItem({ assignment }: TeacherTodoItemProps) {
  const isExpired = assignment.due_date ? isPast(safeDate(assignment.due_date)) : false;
  const submissionCount = assignment.submissions?.length ?? 0;
  const gradedCount = assignment.submissions?.filter((s) => s.status === "graded").length ?? 0;

  const statusPill = isExpired
    ? "bg-gray-50 text-gray-600 border-gray-200"
    : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const statusLabel = isExpired ? "Ended" : "Active";
  const StatusIcon = isExpired ? XCircle : Clock;

  return (
    <Link
      href={`/classes/${assignment.classes?.id}/assignments/${assignment.id}`}
      className="flex items-stretch group md:transition-all md:duration-300 transition-colors duration-200 [transform:translateZ(0)]
        bg-navy/5 md:hover:bg-white overflow-hidden
        border rounded-md md:hover:shadow-md md:hover:-translate-y-0.5 border-b-4 border-navy/90"
    >
      <div className="flex flex-1 items-center justify-between gap-6 px-6 py-5">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest text-navy/30">
              {assignment.classes?.name}
            </span>
            {assignment.is_group_project && (
              <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider
                bg-yellow/20 text-navy border border-yellow/30 rounded-lg px-2 py-0.5 shadow-sm">
                <Users size={10} /> Group Project
              </span>
            )}
          </div>
          <p className="font-bold text-[16px] text-navy truncate group-hover:translate-x-0.5 transition-transform duration-300">
            {assignment.title}
          </p>
          <p className="flex items-center gap-2 text-[12px] text-muted-foreground font-medium">
            <CalendarIcon size={12} className="text-navy/20" />
            Due {assignment.due_date ? format(safeDate(assignment.due_date), "MMM d, yyyy") : "No due date"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2.5 shrink-0">
          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest
            border rounded-xl px-3 py-1 shadow-sm ${statusPill}`}>
            <StatusIcon size={10} />
            {statusLabel}
          </span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-navy/50">
              <FileText size={12} className="text-navy/30" />
              {submissionCount} submissions
            </span>
            {gradedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                {gradedCount} graded
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
