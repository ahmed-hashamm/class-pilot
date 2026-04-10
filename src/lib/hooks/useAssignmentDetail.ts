import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { deleteAssignment } from "@/actions/ClassActions";

export function useAssignmentDetail(assignment: any, classId: string) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const fromTab = searchParams.get("from") || "stream";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { data, error } = await deleteAssignment(assignment.id, classId);
      if (error) {
        toast.error(error || "Failed to delete assignment");
      } else if (data?.success) {
        // Invalidate both the feed and the assignment lists
        await queryClient.invalidateQueries({ queryKey: ["streamFeed", classId] });
        await queryClient.invalidateQueries({ queryKey: ["classAssignments", classId] });
        
        setShowDeleteConfirm(false);
        toast.success("Assignment deleted successfully");
        router.push(`/classes/${classId}?tab=${fromTab}`);
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete assignment");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    showSubmissionForm, setShowSubmissionForm,
    showDeleteConfirm, setShowDeleteConfirm,
    isDeleting, handleDelete,
    fromTab, router
  };
}
