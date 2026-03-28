import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAssignment, updateAssignment } from "@/actions/ClassActions";

export function useAssignmentForm(classId: string, initialData: any) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState(initialData?.attachments || []);
  const [isGroupProject, setIsGroupProject] = useState(initialData?.is_group_project || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("classId", classId);
    formData.append("isGroupProject", String(isGroupProject));
    newFiles.forEach((f) => formData.append("files", f));

    try {
      if (isEditing) {
        formData.append("assignmentId", initialData.id);
        formData.append("existingAttachments", JSON.stringify(existingFiles));
        const { data, error } = await updateAssignment(formData);
        if (data?.success) {
          toast.success("Assignment updated successfully");
          router.push(`/classes/${classId}/assignments/${data.id}`);
          router.refresh();
        } else {
           toast.error(error || "Failed to update assignment");
        }
      } else {
        const { data, error } = await createAssignment(formData);
        if (data?.success) {
          toast.success("Assignment created successfully");
          router.push(`/classes/${classId}/assignments/${data.id}`);
          router.refresh();
        } else {
           toast.error(error || "Failed to create assignment");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving assignment");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    newFiles, setNewFiles,
    existingFiles, setExistingFiles,
    isGroupProject, setIsGroupProject,
    handleSubmit,
    isEditing
  };
}
