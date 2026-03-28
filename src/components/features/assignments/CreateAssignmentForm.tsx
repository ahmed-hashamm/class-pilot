"use client";

import { FeatureButton } from "@/components/ui";
import { AssignmentBasics, AssignmentAttachments } from "./AssignmentFormComponents";
import { AssignmentConfig } from "./AssignmentFormConfig";
import { useAssignmentForm } from "@/lib/hooks";
import { PinToggle } from "../feed/PinToggle";

export default function CreateAssignmentForm({ classId, userId, rubrics, initialData }: any) {
  const {
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
  } = useAssignmentForm(classId, initialData);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start w-full">
      <div className="flex-1 flex flex-col gap-5 w-full">
        <AssignmentBasics 
          title={title} setTitle={setTitle}
          description={description} setDescription={setDescription}
        />
        <AssignmentAttachments 
          newFiles={newFiles} 
          existingFiles={existingFiles} 
          setNewFiles={setNewFiles} 
          setExistingFiles={setExistingFiles} 
        />
      </div>
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        <AssignmentConfig 
          isGroupProject={isGroupProject} 
          setIsGroupProject={setIsGroupProject} 
          rubrics={rubrics} 
          initialData={initialData}
          pinned={isPinned}
          onToggle={setIsPinned}
          onClear={resetForm}
          isEditing={isEditing}
          dueDate={dueDate} setDueDate={setDueDate}
          points={points} setPoints={setPoints}
          submissionType={submissionType} setSubmissionType={setSubmissionType}
          rubricId={rubricId} setRubricId={setRubricId}
        />
        
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
