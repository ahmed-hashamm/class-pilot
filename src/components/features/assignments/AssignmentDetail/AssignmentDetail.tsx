"use client";

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { SubmissionForm } from "@/components/features/submissions";
import { ConfirmModal } from "@/components/ui";
import { useAssignmentDetail } from "@/lib/hooks";
import { Assignment } from "@/lib/types/schema";

import AssignmentDetailHeader from "./AssignmentDetailHeader";
import AssignmentDetailInstructions from "./AssignmentDetailInstructions";
import AssignmentDetailInfo from "./AssignmentDetailInfo";
import StudentStatus from "./StudentStatus";
import TeacherProgress from "./TeacherProgress";

interface AssignmentDetailProps {
  assignment: Assignment;
  isTeacher: boolean;
  submission?: any;
  submissions?: any[];
  classId: string;
}

export default function AssignmentDetail({
  assignment, isTeacher, submission, submissions = [], classId,
}: AssignmentDetailProps) {
  const {
    showSubmissionForm, setShowSubmissionForm,
    showDeleteConfirm, setShowDeleteConfirm,
    isDeleting, handleDelete,
    fromTab, router
  } = useAssignmentDetail(assignment, classId);

  const isGraded = submission?.status === "graded";
  const isTurnedIn = !!submission;

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-6 min-h-screen">
      <div className="flex items-center justify-between shrink-0">
        <button 
          onClick={() => router.push(`/classes/${classId}?tab=${fromTab}`)} 
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-navy transition-colors cursor-pointer bg-transparent border-none w-fit"
        >
          <ArrowLeft size={15} /> Back to Class
        </button>
        {isTeacher && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push(`/classes/${classId}/assignments/${assignment.id}/edit?from=${fromTab}`)} 
              className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-secondary text-foreground hover:bg-navy hover:text-white border border-border rounded-xl px-3 py-2 transition-all cursor-pointer"
            >
              <Pencil size={11} /> Edit
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 rounded-xl px-3 py-2 transition-all cursor-pointer"
            >
              <Trash2 size={11} /> Delete
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete assignment?"
        message="This action cannot be undone. All student submissions and grades for this assignment will be permanently removed."
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      />

      <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0">
        <div className="flex-1 flex flex-col gap-6 pr-2 min-w-0">
          <AssignmentDetailHeader 
            assignment={assignment} 
            isTeacher={isTeacher}
            isTurnedIn={isTurnedIn} 
            isGraded={isGraded} 
          />
          <AssignmentDetailInstructions assignment={assignment} />
          {isTeacher && (
            <TeacherProgress 
              submissions={submissions} 
              assignment={assignment} 
              classId={classId} 
            />
          )}
        </div>

        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 pt-1">
          <div className="flex flex-col gap-6">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1 text-left">Configuration & Status</p>
            {!isTeacher && (
              <StudentStatus
                isTurnedIn={isTurnedIn}
                isGraded={isGraded}
                onShowForm={() => setShowSubmissionForm(true)}
              />
            )}
            <AssignmentDetailInfo assignment={assignment} submission={submission} />
          </div>
        </div>
      </div>

      {showSubmissionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl relative">
            <SubmissionForm 
              assignment={assignment} 
              submission={submission} 
              classId={classId} 
              onClose={() => setShowSubmissionForm(false)} 
              onSuccess={() => { setShowSubmissionForm(false); router.refresh(); }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
