import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const alreadyPresent = item.attendance_records?.some((r: any) => r.user_id === userId);

  const handleClose = async () => {
    setLoading(true);
    try {
      const res = await closeAttendance(item.id);
      if (res.error) {
        toast.error(res.error || "Failed");
      } else {
        toast.success("Attendance closed"); 
        setShowCloseConfirm(false);
        queryClient.invalidateQueries({ queryKey: ["streamFeed", item.class_id || item.classId] });
        router.refresh(); 
      }
    } finally { setLoading(false); }
  };

  const handleMark = async () => {
    setLoading(true);
    try {
      const res = await markAttendancePresent(item.id);
      if (res.error) {
        toast.error(res.error || "Failed");
      } else {
        toast.success("Marked as present"); 
        queryClient.invalidateQueries({ queryKey: ["streamFeed", item.class_id || item.classId] });
        router.refresh(); 
      }
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
