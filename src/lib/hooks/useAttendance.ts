import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markAttendancePresent, closeAttendance } from "@/actions/ClassFeaturesActions";

interface UseAttendanceProps {
  item: any;
  userId: string;
}

export function useAttendance({ item, userId }: UseAttendanceProps) {
  const [loading, setLoading] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const router = useRouter();

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
      if (res.success) { 
        toast.success("Marked as present"); 
        router.refresh(); 
      }
      else toast.error(res.error || "Failed");
    } finally { setLoading(false); }
  };

  return {
    loading,
    showCloseConfirm,
    setShowCloseConfirm,
    alreadyPresent,
    handleClose,
    handleMark
  };
}
