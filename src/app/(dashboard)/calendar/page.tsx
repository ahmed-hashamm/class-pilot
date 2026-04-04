import { getCalendarPageData } from "@/lib/db_data_fetching/calendar";
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from "lucide-react";
import CalenderView from "@/components/features/dashboard/CalenderView";
import { PageHeader } from "@/components/ui";

export default async function CalendarPage() {
  const { assignmentList } = await getCalendarPageData();

  const totalDone = assignmentList.filter((a) => a.isDone).length;
  const totalPending = assignmentList.filter((a) => !a.isDone).length;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 flex flex-col gap-8">
      <PageHeader
        title="Calendar"
        description="Schedule and upcoming deadlines"
        icon={CalendarIcon}
        backHref="/dashboard"
        backLabel="Dashboard"
        action={
          <div className="flex gap-3 flex-wrap">
            <StatPill
              icon={<CalendarIcon size={14} />}
              label="Total"
              value={assignmentList.length}
              variant="navy"
            />
            <StatPill
              icon={<Clock size={14} />}
              label="Pending"
              value={totalPending}
              variant="yellow"
            />
            <StatPill
              icon={<CheckCircle2 size={14} />}
              label="Done"
              value={totalDone}
              variant="green"
            />
          </div>
        }
      />

      {/* Calendar */}
      <div className="bg-white border border-border/60 rounded-3xl overflow-hidden shadow-xl
        ring-8 ring-navy/[0.02]">
        <CalenderView assignments={assignmentList} />
      </div>
    </div>
  );
}

/* ── Stat pill ── */
function StatPill({
  icon, label, value, variant,
}: {
  icon: React.ReactNode
  label: string
  value: number
  variant: "navy" | "yellow" | "green"
}) {
  const styles: Record<string, string> = {
    navy: "bg-navy text-white border-navy/10 shadow-md",
    yellow: "bg-yellow/20 text-navy border-yellow/30",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <div className={`inline-flex items-center gap-3 border rounded-xl px-4 py-2.5
      text-[13px] font-bold transition-all hover:-translate-y-0.5 cursor-default ${styles[variant]}`}>
      {icon}
      <span className="text-[11px] font-black uppercase tracking-[0.15em] opacity-60">
        {label}
      </span>
      <span className="font-black text-[18px] tabular-nums leading-none">{value}</span>
    </div>
  );
}
