"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Check, Clock } from "lucide-react";
import { markAttendancePresent, closeAttendance } from "@/actions/ClassFeaturesActions";
import { ConfirmModal } from "@/components/ui";

export default function AttendanceBody({ 
  item, 
  userId, 
  isTeacher, 
  isActive,
  remaining 
}: { 
  item: any; 
  userId: string; 
  isTeacher: boolean; 
  isActive: boolean;
  remaining: number;
}) {
  const [loading, setLoading] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const router = useRouter();

  const formatTime = (seconds: number) => {
    if (seconds === Infinity) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const alreadyPresent = item.attendance_records?.some((r: any) => r.user_id === userId);

  const handleClose = async () => {
    setLoading(true);
    try {
      const res = await closeAttendance(item.id);
      if (res.success) { 
        toast.success("Attendance closed"); 
        setShowCloseConfirm(false);
        router.refresh(); 
      }
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
        <ConfirmModal
          isOpen={showCloseConfirm}
          onClose={() => setShowCloseConfirm(false)}
          onConfirm={handleClose}
          title="Close attendance?"
          message="This will prevent any more students from marking themselves present."
          confirmLabel="Close Session"
          variant="warning"
          isLoading={loading}
        />
        <div className="p-3 bg-secondary/40 border border-border rounded-xl flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] font-bold text-navy">{item.attendance_records?.length || 0} students marked present</p>
            {isActive && remaining !== Infinity && (
              <span className="text-[11px] font-medium text-navy/60 flex items-center gap-1">
                <Clock size={10} /> Time Remaining: {formatTime(remaining)}
              </span>
            )}
          </div>
          {!isActive && (
            <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Closed</span>
          )}
        </div>
        {isActive && (
          <button onClick={() => setShowCloseConfirm(true)} disabled={loading} className="self-end text-xs font-semibold text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer flex items-center gap-1">
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
        className="w-full bg-navy text-white font-bold text-[13px] py-2.5 rounded-xl hover:bg-navy/90 transition disabled:opacity-50 cursor-pointer border-none flex items-center justify-center gap-2"
      >
        {loading ? "Marking…" : isActive ? (
          <>
            I'm Present 
            {remaining !== Infinity && (
              <span className="opacity-60 text-[11px] font-medium border-l border-white/20 pl-2 ml-1 flex items-center gap-1">
                <Clock size={11} /> {formatTime(remaining)}
              </span>
            )}
          </>
        ) : "Session Closed"}
      </button>
    </div>
  );
}
