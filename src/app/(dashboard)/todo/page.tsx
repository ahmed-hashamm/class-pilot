import { getTodoPageData } from "@/lib/db_data_fetching/todo";
import {
  CheckCircle2, Inbox, Calendar as CalendarIcon,
  ChevronLeft, Users, Clock, AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function TodoPage() {
  const { user, done, missing, assigned, myGroupIds } = await getTodoPageData();

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
      {/* Back */}
      <Link href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold
          text-muted-foreground hover:text-navy transition-colors w-fit">
        <ChevronLeft size={15} /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
          <CheckCircle2 size={17} className="text-yellow" />
        </div>
        <div>
          <h1 className="font-black text-[20px] tracking-tight">My assignments</h1>
          <p className="text-[13px] text-muted-foreground">
            Track your individual and team progress.
          </p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        <SummaryPill label="Assigned" count={assigned.length} variant="navy" />
        <SummaryPill label="Missing" count={missing.length} variant="red" />
        <SummaryPill label="Done" count={done.length} variant="green" />
      </div>

      {/* Tabs implemented as anchor sections */}
      <Section
        title="Assigned"
        icon={<Clock size={14} />}
        items={assigned}
        emptyIcon={<Inbox size={24} />}
        emptyTitle="All caught up!"
        emptyDesc="No upcoming deadlines."
        status="assigned"
        userId={user.id}
        myGroupIds={myGroupIds}
      />

      {missing.length > 0 && (
        <Section
          title="Missing"
          icon={<AlertCircle size={14} />}
          items={missing}
          emptyIcon={<CheckCircle2 size={24} />}
          emptyTitle="Nothing missing"
          emptyDesc="Great job!"
          status="missing"
          userId={user.id}
          myGroupIds={myGroupIds}
        />
      )}

      <Section
        title="Done"
        icon={<CheckCircle2 size={14} />}
        items={done}
        emptyIcon={<Inbox size={24} />}
        emptyTitle="No completed work yet"
        emptyDesc="Submit an assignment to see it here."
        status="done"
        userId={user.id}
        myGroupIds={myGroupIds}
      />
    </div>
  );
}

/* ── Section ── */
function Section({ title, icon, items, emptyIcon, emptyTitle, emptyDesc, status, userId, myGroupIds }: any) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy
        flex items-center gap-1.5">
        {icon} {title} · {items.length}
      </p>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-12
          border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <div className="text-muted-foreground/30">{emptyIcon}</div>
          <p className="font-bold text-[14px]">{emptyTitle}</p>
          <p className="text-[13px] text-muted-foreground">{emptyDesc}</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {items.map((a: any, i: number) => (
            <TodoItem
              key={a.id}
              assignment={a}
              status={status}
              userId={userId}
              myGroupIds={myGroupIds}
              isLast={i === items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Todo item ── */
function TodoItem({ assignment, status, userId, myGroupIds, isLast }: any) {
  const submission = assignment.submissions?.find((sub: any) =>
    assignment.is_group_project ? myGroupIds.includes(sub.group_id) : sub.user_id === userId
  );
  const grade = submission?.final_grade;
  const isGraded = submission?.status === "graded";
  const isMissing = status === "missing";
  const isDone = status === "done";

  const accentBar = isMissing ? "bg-red-500" : isDone ? "bg-green-500" : "bg-navy";

  const statusPill = isMissing
    ? "bg-red-50 text-red-600 border-red-200"
    : isDone && isGraded
      ? "bg-green-50 text-green-700 border-green-200"
      : isDone
        ? "bg-yellow/20 text-navy border-yellow/40"
        : "bg-navy/8 text-navy border-navy/15";

  const statusLabel = isMissing ? "Overdue"
    : isDone && isGraded ? "Graded"
      : isDone ? "Turned in"
        : "Upcoming";

  return (
    <div className={`flex items-stretch
      ${!isLast ? "border-b border-border" : ""}`}>

      {/* Accent bar */}
      <div className={`w-1 shrink-0 ${accentBar}`} />

      <div className="flex flex-1 items-center justify-between gap-4 px-5 py-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest
              text-muted-foreground">
              {assignment.classes?.name}
            </span>
            {assignment.is_group_project && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold
                bg-yellow/15 text-navy border border-yellow/30 rounded-full px-2 py-0.5">
                <Users size={9} /> Group
              </span>
            )}
          </div>
          <p className="font-bold text-[14px] text-foreground truncate">
            {assignment.title}
          </p>
          <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <CalendarIcon size={11} />
            Due {assignment.due_date ? format(new Date(assignment.due_date), "MMM d, yyyy") : "No due date"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-[10px] font-bold uppercase tracking-wide
            border rounded-full px-2.5 py-0.5 ${statusPill}`}>
            {statusLabel}
          </span>
          {(grade != null || isMissing) && (
            <p className="text-right">
              <span className="font-black text-[16px]">
                {isMissing ? 0 : grade}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {" "}/ {assignment.points}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Summary pill ── */
function SummaryPill({ label, count, variant }: { label: string; count: number; variant: string }) {
  const styles: Record<string, string> = {
    navy: "bg-navy/8 text-navy border-navy/15",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <div className={`inline-flex items-center gap-2 border rounded-xl px-4 py-2
      text-[13px] font-semibold ${styles[variant]}`}>
      {label}
      <span className="font-black text-[15px]">{count}</span>
    </div>
  );
}
