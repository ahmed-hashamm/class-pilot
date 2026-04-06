import { getTodoPageData } from "@/lib/db_data_fetching/todo";
import {
  CheckCircle2, Inbox, Calendar as CalendarIcon,
  Users, Clock, AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import { PageHeader } from "@/components/ui";
import Link from "next/link";

export default async function TodoPage() {
  const { user, done, missing, assigned, myGroupIds } = await getTodoPageData();

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-10 flex flex-col gap-6">
      <PageHeader
        title="My Assignments"
        description="Track your individual and team progress"
        icon={CheckCircle2}
        backHref="/dashboard"
        backLabel="Back to dashboard"
      />

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap">
        <SummaryPill label="Assigned" count={assigned.length} variant="navy" />
        <SummaryPill label="Missing" count={missing.length} variant="red" />
        <SummaryPill label="Done" count={done.length} variant="green" />
      </div>

      <div className="flex flex-col gap-12">
        {/* Assigned Section */}
        <Section
          title="Assigned"
          icon={<Clock size={16} />}
          items={assigned}
          emptyIcon={<Inbox size={32} />}
          emptyTitle="All caught up!"
          emptyDesc="No upcoming deadlines."
          status="assigned"
          userId={user.id}
          myGroupIds={myGroupIds}
        />

        {missing.length > 0 && (
          <Section
            title="Missing"
            icon={<AlertCircle size={16} />}
            items={missing}
            emptyIcon={<CheckCircle2 size={32} />}
            emptyTitle="Nothing missing"
            emptyDesc="Great job!"
            status="missing"
            userId={user.id}
            myGroupIds={myGroupIds}
          />
        )}

        <Section
          title="Done"
          icon={<CheckCircle2 size={16} />}
          items={done}
          emptyIcon={<Inbox size={32} />}
          emptyTitle="No completed work yet"
          emptyDesc="Submit an assignment to see it here."
          status="done"
          userId={user.id}
          myGroupIds={myGroupIds}
        />
      </div>
    </div>
  );
}

/* ── Section ── */
function Section({ title, icon, items, emptyIcon, emptyTitle, emptyDesc, status, userId, myGroupIds }: any) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <p className="text-[12px] font-black tracking-[.25em] uppercase text-navy/40
          flex items-center gap-2">
          {icon} <span>{title}</span>
        </p>
        <span className="text-[11px] font-bold bg-navy/5 text-navy/40 px-2 py-0.5 rounded-lg border border-navy/5">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20
          border-2 border-dashed border-border/40 rounded-3xl bg-white/40 text-center shadow-sm">
          <div className="text-navy/20 mb-2">{emptyIcon}</div>
          <p className="font-black text-[16px] text-navy tracking-tight">{emptyTitle}</p>
          <p className="text-[13px] text-muted-foreground font-medium">{emptyDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((a: any) => (
            <TodoItem
              key={a.id}
              assignment={a}
              status={status}
              userId={userId}
              myGroupIds={myGroupIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Todo item ── */
function TodoItem({ assignment, status, userId, myGroupIds }: any) {
  const submission = assignment.submissions?.find((sub: any) =>
    assignment.is_group_project ? myGroupIds.includes(sub.group_id) : sub.user_id === userId
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

/* ── Summary pill ── */
function SummaryPill({ label, count, variant }: { label: string; count: number; variant: string }) {
  const styles: Record<string, string> = {
    navy: "bg-navy text-white border-navy shadow-md",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <div className={`inline-flex items-center gap-3 border rounded-2xl px-4 py-2
      text-[13px] font-bold transition-all hover:-translate-y-0.5 cursor-default ${styles[variant]}`}>
      <span className="opacity-80 uppercase tracking-widest text-[11px]">{label}</span>
      <span className="font-black text-[18px] tabular-nums leading-none">{count}</span>
    </div>
  );
}
