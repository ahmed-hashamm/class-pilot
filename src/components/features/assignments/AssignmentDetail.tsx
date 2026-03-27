"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SubmissionForm } from "@/components/features/submissions";
import {
  AssignmentHeader, AssignmentInfo, AssignmentInstructions,
  StudentStatus, TeacherProgress
} from "./AssignmentDetailComponents";
import { ConfirmModal } from "@/components/ui";

export default function AssignmentDetail({
  assignment, isTeacher, submission, submissions, classId,
}: any) {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromTab = searchParams.get("from") || "stream";

  const isGraded = submission?.status === "graded";
  const isTurnedIn = !!submission;

  const handleDelete = async () => {
    setIsDeleting(true);
    const { deleteAssignment } = await import("@/actions/ClassActions");
    try {
      await deleteAssignment(assignment.id, classId);
      setShowDeleteConfirm(false);
      toast.success("Assignment deleted");
      router.push(`/classes/${classId}?tab=${fromTab}`);
    } catch { toast.error("Failed to delete assignment"); }
    finally { setIsDeleting(false); }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button onClick={() => router.push(`/classes/${classId}?tab=${fromTab}`)} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-navy transition-colors cursor-pointer bg-transparent border-none w-fit"><ArrowLeft size={15} /> Back to Class</button>
        {isTeacher && (
          <div className="flex items-center gap-2">
            <button onClick={() => router.push(`/classes/${classId}/assignments/${assignment.id}/edit?from=${fromTab}`)} className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-secondary text-foreground hover:bg-navy hover:text-white border border-border rounded-xl px-3 py-2 transition-all cursor-pointer"><Pencil size={11} /> Edit</button>
            <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 rounded-xl px-3 py-2 transition-all cursor-pointer"><Trash2 size={11} /> Delete</button>
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

      <AssignmentHeader assignment={assignment} />

      <div className="flex flex-col gap-8">
        <AssignmentInfo assignment={assignment} />
        <AssignmentInstructions assignment={assignment} />
        {isTeacher ? <TeacherProgress submissions={submissions} assignment={assignment} classId={classId} /> : <StudentStatus isTurnedIn={isTurnedIn} isGraded={isGraded} submission={submission} assignment={assignment} onShowForm={() => setShowSubmissionForm(true)} />}
      </div>

      {showSubmissionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <SubmissionForm assignment={assignment} submission={submission} onClose={() => setShowSubmissionForm(false)} onSuccess={() => { setShowSubmissionForm(false); router.refresh(); }} />
          </div>
        </div>
      )}
    </div>
  );
}
