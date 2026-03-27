"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createAssignment, updateAssignment } from "@/actions/ClassActions";
import { toast } from "sonner";
import { AssignmentBasics, AssignmentAttachments } from "./AssignmentFormComponents";
import { AssignmentConfig } from "./AssignmentFormConfig";

export default function CreateAssignmentForm({ classId, userId, rubrics, initialData }: any) {
  const router = useRouter();
  const isEditing = !!initialData;
  const [loading, setLoading] = useState(false);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState(initialData?.attachments || []);
  const [isGroupProject, setIsGroupProject] = useState(initialData?.is_group_project || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("classId", classId);
    formData.append("isGroupProject", String(isGroupProject));
    newFiles.forEach((f) => formData.append("files", f));
    try {
      if (isEditing) {
        formData.append("assignmentId", initialData.id);
        formData.append("existingAttachments", JSON.stringify(existingFiles));
        const res = await updateAssignment(formData);
        if (res.success) { toast.success("Updated"); router.push(`/classes/${classId}/assignments/${res.id}`); router.refresh(); }
      } else {
        const res = await createAssignment(formData);
        if (res.success) { toast.success("Created"); router.push(`/classes/${classId}/assignments/${res.id}`); router.refresh(); }
      }
    } catch { toast.error("Error saving assignment"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 flex flex-col gap-5 w-full">
        <AssignmentBasics initialData={initialData} />
        <AssignmentAttachments newFiles={newFiles} existingFiles={existingFiles} setNewFiles={setNewFiles} setExistingFiles={setExistingFiles} />
      </div>
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        <AssignmentConfig isGroupProject={isGroupProject} setIsGroupProject={setIsGroupProject} rubrics={rubrics} initialData={initialData} />
        <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 bg-navy text-white font-bold text-[14px] py-3 rounded-xl hover:bg-navy/90 transition shadow-sm disabled:opacity-60 cursor-pointer border-none">
          {loading ? <><Loader2 size={15} className="animate-spin" /> {isEditing ? "Saving..." : "Creating..."}</> : (isEditing ? "Save changes" : "Create assignment")}
        </button>
      </div>
    </form>
  );
}
