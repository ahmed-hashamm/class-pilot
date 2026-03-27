import { getCalendarPageData } from "@/lib/data/calendar";
import { Calendar as CalendarIcon, ChevronLeft, CheckCircle2, Clock } from "lucide-react";
import CalenderView from "@/components/dashboard/CalenderView";
import Link from "next/link";

export default async function CalendarPage() {
  const { assignmentList } = await getCalendarPageData();

  const totalDone    = assignmentList.filter((a) => a.isDone).length;
  const totalPending = assignmentList.filter((a) => !a.isDone).length;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 py-8 flex flex-col gap-8">
      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold
            text-muted-foreground hover:text-navy transition-colors w-fit">
          <ChevronLeft size={15} /> Back to dashboard
        </Link>

        {/* Stats */}
        <div className="flex gap-3 flex-wrap">
          <StatPill
            icon={<CalendarIcon size={13} />}
            label="Total"
            value={assignmentList.length}
            variant="navy"
          />
          <StatPill
            icon={<Clock size={13} />}
            label="Pending"
            value={totalPending}
            variant="yellow"
          />
          <StatPill
            icon={<CheckCircle2 size={13} />}
            label="Done"
            value={totalDone}
            variant="green"
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
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
    navy:   "bg-navy/8 text-navy border-navy/15",
    yellow: "bg-yellow/20 text-navy border-yellow/40",
    green:  "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <div className={`inline-flex items-center gap-2.5 border rounded-xl px-4 py-2.5
      text-[13px] font-semibold ${styles[variant]}`}>
      {icon}
      <span className="text-[12px] font-bold uppercase tracking-wide opacity-70">
        {label}
      </span>
      <span className="font-black text-[16px] leading-none">{value}</span>
    </div>
  );
}
