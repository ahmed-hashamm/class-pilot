"use client";

import { Lock, Clock } from "lucide-react";
import { usePoll } from "@/lib/hooks";
import { formatTime } from "@/lib/utils/time";
import { ConfirmModal } from "@/components/ui";

export default function PollBody({ 
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
    closing,
    showCloseConfirm,
    setShowCloseConfirm,
    handleClose,
    handleVote,
    calculateResults
  } = usePoll({ item, userId });

  return (
    <div className="pl-[48px] flex flex-col gap-2">
      {item.options.map((opt: string, idx: number) => {
        const { percent, hasVoted, isMyVote } = calculateResults(idx);

        if (hasVoted || isTeacher || !isActive) {
          return (
            <div key={idx} className="relative overflow-hidden rounded-lg border border-border bg-secondary/30">
              <div className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${isMyVote ? "bg-purple-500/20" : "bg-muted"}`} style={{ width: `${percent}%` }} />
              <div className="relative z-10 flex justify-between px-4 py-2 text-[14px]">
                <span className={isMyVote ? "font-bold text-purple-700" : "font-medium"}>{opt} {isMyVote && "(You)"}</span>
                <span className="text-muted-foreground">{percent}%</span>
              </div>
            </div>
          );
        }
        return (
          <button key={idx} onClick={() => handleVote(idx)} className="flex justify-between w-full px-4 py-2 border border-border rounded-lg text-[14px] font-medium hover:bg-secondary cursor-pointer bg-transparent text-left">
            {opt}
          </button>
        );
      })}
      <ConfirmModal
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={handleClose}
        title="Close this poll?"
        message="Students will no longer be able to submit votes. Results will remain visible."
        confirmLabel="Close Poll"
        variant="warning"
        isLoading={closing}
      />
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">{item.poll_responses?.length || 0} vote(s)</p>
          {isActive && remaining !== Infinity && (
            <span className="text-[10px] font-bold bg-navy/5 text-navy px-1.5 py-0.5 rounded border border-navy/10 flex items-center gap-1">
              <Clock size={10} /> {formatTime(remaining)}
            </span>
          )}
          {!isActive && (
            <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Closed</span>
          )}
        </div>
        {isTeacher && isActive && (
          <button onClick={() => setShowCloseConfirm(true)} disabled={closing} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer disabled:opacity-50">
            <Lock size={12} /> {closing ? "Closing…" : "Close Poll"}
          </button>
        )}
      </div>
    </div>
  );
}
