"use client";

import { FeatureButton } from "@/components/ui";
import { AssignmentBasics, AssignmentAttachments } from "./AssignmentFormComponents";
import { AssignmentConfig } from "./AssignmentFormConfig";
import { useAssignmentForm } from "@/lib/hooks";

export default function CreateAssignmentForm({ classId, userId, rubrics, initialData }: any) {
  const {
    loading,
    newFiles, setNewFiles,
    existingFiles, setExistingFiles,
    isGroupProject, setIsGroupProject,
    handleSubmit,
    isEditing
  } = useAssignmentForm(classId, initialData);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 flex flex-col gap-5 w-full">
        <AssignmentBasics initialData={initialData} />
        <AssignmentAttachments newFiles={newFiles} existingFiles={existingFiles} setNewFiles={setNewFiles} setExistingFiles={setExistingFiles} />
      </div>
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        <AssignmentConfig isGroupProject={isGroupProject} setIsGroupProject={setIsGroupProject} rubrics={rubrics} initialData={initialData} />
        <FeatureButton
          type="submit"
          loading={loading}
          label={isEditing ? "Save changes" : "Create assignment"}
          loadingLabel={isEditing ? "Saving changes..." : "Creating assignment..."}
          className="w-full py-4 shadow-md"
          size="lg"
        />
      </div>
    </form>
  );
}
