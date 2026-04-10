import { Users, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { TodoAssignment } from "@/lib/db_data_fetching/todo";

interface TodoItemProps {
  assignment: TodoAssignment
  status: 'assigned' | 'missing' | 'done'
  userId: string
  myGroupIds: string[]
}

export function TodoItem({ assignment, status, userId, myGroupIds }: TodoItemProps) {
  const submission = assignment.submissions?.find((sub) =>
    assignment.is_group_project ? myGroupIds.includes(sub.group_id as string) : sub.user_id === userId
  );
  const grade = submission?.final_grade;
  const isGraded = submission?.status === "graded";
  const isMissing = status === "missing";
  const isDone = status === "done";

  const statusPill = isMissing
    ? "bg-red-50 text-red-600 border-red-200"
    : isDone && isGraded
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : isDone
        ? "bg-yellow/15 text-navy border-yellow/30"
        : "bg-navy/[0.04] text-navy/60 border-navy/10";

  const statusLabel = isMissing ? "Overdue"
    : isDone && isGraded ? "Graded"
      : isDone ? "Turned in"
        : "Upcoming";

  return (
    <Link href={`/classes/${assignment.classes?.id}/assignments/${assignment.id}`} className="flex items-stretch group transition-all duration-300
      bg-navy/5 hover:bg-white overflow-hidden
       border rounded-md  hover:shadow-md hover:-translate-y-0.5 border-b-4 border-navy/90">
      <div className="flex flex-1 items-center justify-between gap-6 px-6 py-5">
        <div className="flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest
              text-navy/30">
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
            Due {assignment.due_date ? format(new Date(assignment.due_date), "MMM d, yyyy") : "No due date"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2.5 shrink-0">
          <span className={`text-[10px] font-black uppercase tracking-widest
            border rounded-xl px-3 py-1 shadow-sm ${statusPill}`}>
            {statusLabel}
          </span>
          {(grade != null || isMissing) && (
            <p className="text-right leading-none">
              <span className="font-black text-[20px] text-navy tabular-nums">
                {isMissing ? 0 : grade}
              </span>
              <span className="text-[12px] font-bold text-navy/20">
                {" "}/ {assignment.points}
              </span>
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
