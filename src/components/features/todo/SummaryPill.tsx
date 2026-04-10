interface SummaryPillProps {
  label: string
  count: number
  variant: 'navy' | 'red' | 'green'
}

export function SummaryPill({ label, count, variant }: SummaryPillProps) {
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
