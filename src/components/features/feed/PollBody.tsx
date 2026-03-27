"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { submitPollResponse, closePoll } from "@/actions/ClassFeaturesActions";

export default function PollBody({ item, userId, isTeacher, isActive }: { item: any; userId: string; isTeacher: boolean; isActive: boolean }) {
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  const handleClose = async () => {
    if (!confirm("Close this poll? Students will no longer be able to vote.")) return;
    setClosing(true);
    try {
      const res = await closePoll(item.id);
      if (!res.success) toast.error(res.error || "Failed to close poll");
      else { toast.success("Poll closed successfully"); router.refresh(); }
    } finally { setClosing(false); }
  };

  const handleVote = async (idx: number) => {
    const res = await submitPollResponse(item.id, idx);
    if (!res.success) toast.error(res.error || "Could not submit vote");
    else { toast.success("Vote submitted successfully"); router.refresh(); }
  };

  return (
    <div className="pl-[48px] flex flex-col gap-2">
      {item.options.map((opt: string, idx: number) => {
        const totalVotes = item.poll_responses?.length || 0;
        const optionVotes = item.poll_responses?.filter((r: any) => r.selected_option_index === idx).length || 0;
        const percent = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
        const hasVoted = item.poll_responses?.some((r: any) => r.user_id === userId);
        const isMyVote = item.poll_responses?.some((r: any) => r.user_id === userId && r.selected_option_index === idx);

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
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground">{item.poll_responses?.length || 0} vote(s)</p>
        {isTeacher && isActive && (
          <button onClick={handleClose} disabled={closing} className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-transparent border-none cursor-pointer disabled:opacity-50">
            <Lock size={12} /> {closing ? "Closing…" : "Close Poll"}
          </button>
        )}
      </div>
    </div>
  );
}
