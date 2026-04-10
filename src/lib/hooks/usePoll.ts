import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitPollResponse, closePoll } from "@/actions/ClassFeaturesActions";

interface UsePollProps {
  item: any;
  userId: string;
}

export function usePoll({ item, userId }: UsePollProps) {
  const [closing, setClosing] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const router = useRouter();

  const handleClose = async () => {
    setClosing(true);
    try {
      const res = await closePoll(item.id);
      if (res.error) {
        toast.error(res.error || "Failed to close poll");
      } else { 
        toast.success("Poll closed successfully"); 
        setShowCloseConfirm(false);
        router.refresh(); 
      }
    } finally { setClosing(false); }
  };

  const handleVote = async (idx: number) => {
    const res = await submitPollResponse(item.id, idx);
    if (res.error) {
      toast.error(res.error || "Could not submit vote");
    } else { 
      toast.success("Vote submitted successfully"); 
      router.refresh(); 
    }
  };

  const calculateResults = (idx: number) => {
    const totalVotes = item.poll_responses?.length || 0;
    const optionVotes = item.poll_responses?.filter((r: any) => r.selected_option_index === idx).length || 0;
    const percent = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
    const hasVoted = item.poll_responses?.some((r: any) => r.user_id === userId);
    const isMyVote = item.poll_responses?.some((r: any) => r.user_id === userId && r.selected_option_index === idx);

    return { percent, hasVoted, isMyVote, optionVotes, totalVotes };
  };

  return {
    closing,
    showCloseConfirm,
    setShowCloseConfirm,
    handleClose,
    handleVote,
    calculateResults
  };
}
