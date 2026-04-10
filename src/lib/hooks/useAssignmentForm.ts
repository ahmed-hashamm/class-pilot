import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAssignment, updateAssignment } from "@/actions/ClassActions";

export function useAssignmentForm(classId: string, initialData: any) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  
  // Basic Fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  
  // Attachments
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState(initialData?.attachments || []);
  
  // Config Fields
  const [dueDate, setDueDate] = useState(initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : "");
  const [points, setPoints] = useState(initialData?.points ?? 100);
  const [submissionType, setSubmissionType] = useState(initialData?.submission_type || "file");
  const [rubricId, setRubricId] = useState(initialData?.rubric_id || "");
  const [isGroupProject, setIsGroupProject] = useState(initialData?.is_group_project || false);
  const [isPinned, setIsPinned] = useState(initialData?.pinned || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("classId", classId);
    formData.append("isGroupProject", String(isGroupProject));
    formData.append("pinned", String(isPinned));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("dueDate", dueDate);
    formData.append("points", String(points));
    formData.append("submissionType", submissionType);
    formData.append("rubricId", rubricId);
    
    newFiles.forEach((f) => formData.append("files", f));

    try {
      if (isEditing) {
        formData.append("assignmentId", initialData.id);
        formData.append("existingAttachments", JSON.stringify(existingFiles));
        const { data, error } = await updateAssignment(formData);
        if (error) {
          toast.error(error || "Failed to update assignment");
        } else if (data?.success) {
          toast.success("Assignment updated successfully");
          router.push(`/classes/${classId}/assignments/${data.id}`);
          router.refresh();
        }
      } else {
        const { data, error } = await createAssignment(formData);
        if (error) {
          toast.error(error || "Failed to create assignment");
        } else if (data?.success) {
          toast.success("Assignment created successfully");
          router.push(`/classes/${classId}/assignments/${data.id}`);
          router.refresh();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Error saving assignment");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
    setNewFiles([]);
    setExistingFiles(initialData?.attachments || []);
    setDueDate(initialData?.due_date ? new Date(initialData.due_date).toISOString().slice(0, 16) : "");
    setPoints(initialData?.points ?? 100);
    setSubmissionType(initialData?.submission_type || "file");
    setRubricId(initialData?.rubric_id || "");
    setIsGroupProject(initialData?.is_group_project || false);
    setIsPinned(initialData?.pinned || false);
  };

  return {
    loading,
    title, setTitle,
    description, setDescription,
    newFiles, setNewFiles,
    existingFiles, setExistingFiles,
    dueDate, setDueDate,
    points, setPoints,
    submissionType, setSubmissionType,
    rubricId, setRubricId,
    isGroupProject, setIsGroupProject,
    isPinned, setIsPinned,
    handleSubmit,
    resetForm,
    isEditing
  };
}
