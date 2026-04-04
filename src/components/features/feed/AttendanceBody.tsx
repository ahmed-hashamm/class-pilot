import { Button } from "@/components/ui/button";
import { Lock, Check, Clock } from "lucide-react";
import { useAttendance } from "@/lib/hooks";
import { formatTime } from "@/lib/utils/time";
import { FeatureButton, ConfirmModal } from "@/components/ui";

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
  const {
    loading,
    showCloseConfirm,
    setShowCloseConfirm,
    alreadyPresent,
    handleClose,
    handleMark
  } = useAttendance({ item, userId });

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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCloseConfirm(true)}
            disabled={loading}
            className="self-end h-auto p-0 flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-transparent"
          >
            <Lock size={12} /> {loading ? "Closing…" : "Close Session"}
          </Button>
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
      <FeatureButton
        onClick={handleMark}
        loading={loading}
        disabled={!isActive}
        label={isActive ? (alreadyPresent ? "Marked Present" : "I'm Present") : "Session Closed"}
        icon={isActive && alreadyPresent ? Check : undefined}
        className="w-full py-2.5"
      >
        {isActive && remaining !== Infinity && (
          <span className="opacity-60 text-[11px] font-medium border-l border-white/20 pl-2 ml-1 flex items-center gap-1">
            <Clock size={11} /> {formatTime(remaining)}
          </span>
        )}
      </FeatureButton>
    </div>
  );
}
