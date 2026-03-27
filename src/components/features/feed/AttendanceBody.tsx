"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Check } from "lucide-react";
import { markAttendancePresent, closeAttendance } from "@/actions/ClassFeaturesActions";

export default function AttendanceBody({ item, userId, isTeacher, isActive }: { item: any; userId: string; isTeacher: boolean; isActive: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const alreadyPresent = item.attendance_records?.some((r: any) => r.user_id === userId);

  const handleClose = async () => {
    if (!confirm("Close this attendance session?")) return;
    setLoading(true);
    try {
      const res = await closeAttendance(item.id);
      if (res.success) { toast.success("Attendance closed"); router.refresh(); }
      else toast.error(res.error || "Failed");
    } finally { setLoading(false); }
  };

  const handleMark = async () => {
    setLoading(true);
    try {
      const res = await markAttendancePresent(item.id);
      if (res.success) { toast.success("Marked as present"); router.refresh(); }
      else toast.error(res.error || "Failed");
    } finally { setLoading(false); }
  };

  if (isTeacher) {
    return (
      <div className="pl-[48px] flex flex-col gap-2">
        <div className="p-3 bg-secondary/40 border border-border rounded-xl">
          <p className="text-[13px] font-bold text-navy">{item.attendance_records?.length || 0} students marked present</p>
        </div>
        {isActive && (
          <button onClick={handleClose} disabled={loading} className="self-end text-xs font-semibold text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer flex items-center gap-1">
            <Lock size={12} /> {loading ? "Closing…" : "Close Session"}
          </button>
        )}
      </div>
    );
  }

  if (alreadyPresent) {
    return (
      <div className="pl-[48px]">
        <div className="flex items-center gap-2 text-green-600 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl text-[13px] font-bold">
          <Check size={16} /> Marked Present
        </div>
      </div>
    );
  }

  return (
    <div className="pl-[48px]">
      <button
        onClick={handleMark}
        disabled={loading || !isActive}
        className="w-full bg-navy text-white font-bold text-[13px] py-2.5 rounded-xl hover:bg-navy/90 transition disabled:opacity-50 cursor-pointer border-none"
      >
        {loading ? "Marking…" : isActive ? "I'm Present" : "Session Closed"}
      </button>
    </div>
  );
}
