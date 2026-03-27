"use client";

import { Lock, XCircle, Timer } from "lucide-react";
import { useCountdown } from "@/lib/hooks/useCountdown";

function formatCountdown(seconds: number) {
  if (seconds === Infinity) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m ${s}s left`;
  return `${s}s left`;
}

export default function StatusBadge({ deadline, closedAt }: { deadline: string | null; closedAt: string | null }) {
  const { remaining, isClosed, isExpired, isActive } = useCountdown(deadline, closedAt);

  if (isClosed) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-red-500/10 text-red-600 border border-red-500/25 rounded-full px-2 py-0.5">
        <Lock size={9} /> Closed
      </span>
    );
  }
  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-gray-500/10 text-gray-600 border border-gray-500/25 rounded-full px-2 py-0.5">
        <XCircle size={9} /> Expired
      </span>
    );
  }
  if (isActive && deadline) {
    const label = formatCountdown(remaining);
    const isUrgent = remaining < 300;
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase border rounded-full px-2 py-0.5 ${isUrgent ? "bg-red-500/10 text-red-600 border-red-500/25 animate-pulse" : "bg-blue-500/10 text-blue-600 border-blue-500/25"}`}>
        <Timer size={9} /> {label}
      </span>
    );
  }
  return null;
}
