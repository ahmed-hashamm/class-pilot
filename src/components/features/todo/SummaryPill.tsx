interface SummaryPillProps {
  label: string
  count: number
  variant: 'navy' | 'red' | 'green'
}

export function SummaryPill({ label, count, variant }: SummaryPillProps) {
  const styles = {
    navy: "bg-navy/[0.03] text-navy border-navy/10",
    red: "bg-red-500/[0.03] text-red-600 border-red-500/10",
    green: "bg-emerald-500/[0.03] text-emerald-700 border-emerald-500/10",
  };

  return (
    <div className={`inline-flex items-center gap-2 border rounded-xl px-3 py-1.5
      transition-colors cursor-default ${styles[variant]}`}>
      <span className="font-bold uppercase tracking-tight text-[11px] opacity-60">
        {label}
      </span>
      <span className="font-black text-[15px] tabular-nums leading-none">
        {count}
      </span>
    </div>
  );
}
