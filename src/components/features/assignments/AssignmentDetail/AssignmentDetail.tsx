"use client";

import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  // Compute whether the deadline has passed
  const isPastDeadline = (() => {
    if (!assignment.due_date) return false;
    return new Date() > new Date(assignment.due_date);
  })();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col gap-10 min-h-screen">
      <div className="flex items-center justify-between shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/classes/${classId}?tab=${fromTab}`)}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground hover:text-navy transition-colors bg-transparent border-none w-fit p-0 h-auto"
        >
          <ArrowLeft size={15} /> Back to Class
        </Button>
        {isTeacher && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/classes/${classId}/assignments/${assignment.id}/edit?from=${fromTab}`)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-secondary text-foreground hover:bg-navy hover:text-white border border-border rounded-xl px-3 py-2 transition-all h-auto"
            >
              <Pencil size={11} /> Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 rounded-xl px-3 py-2 transition-all h-auto"
            >
              <Trash2 size={11} /> Delete
            </Button>
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
        {/* Left Column: Header, Instructions, and Progress */}
        <div className="flex-1 flex flex-col gap-8 min-w-0 w-full">
          <AssignmentDetailHeader
            assignment={assignment}
            isTeacher={isTeacher}
            isTurnedIn={isTurnedIn}
            isGraded={isGraded}
          />
          <AssignmentDetailInstructions assignment={assignment} />

          {/* Mobile Configuration Section */}
          <div className="lg:hidden">
            <ConfigurationSection
              isTeacher={isTeacher}
              isTurnedIn={isTurnedIn}
              isGraded={isGraded}
              isPastDeadline={isPastDeadline}
              assignment={assignment}
              submission={submission}
              onShowForm={() => setShowSubmissionForm(true)}
            />
          </div>

          {isTeacher && (
            <TeacherProgress
              submissions={submissions}
              assignment={assignment}
              classId={classId}
            />
          )}

        </div>

        {/* Right Sidebar: Configuration & Status (Desktop only) */}
        <aside className="hidden lg:flex w-full lg:w-80 shrink-0 flex-col gap-6">
          <ConfigurationSection
            isTeacher={isTeacher}
            isTurnedIn={isTurnedIn}
            isGraded={isGraded}
            isPastDeadline={isPastDeadline}
            assignment={assignment}
            submission={submission}
            onShowForm={() => setShowSubmissionForm(true)}
          />
        </aside>
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

/* ── Configuration & Status Component ── */
function ConfigurationSection({
  isTeacher, isTurnedIn, isGraded, isPastDeadline, assignment, submission, onShowForm
}: {
  isTeacher: boolean; isTurnedIn: boolean; isGraded: boolean; isPastDeadline: boolean; assignment: Assignment; submission: any; onShowForm: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1 text-left">Configuration & Status</p>
      {!isTeacher && (
        <StudentStatus
          isTurnedIn={isTurnedIn}
          isGraded={isGraded}
          isPastDeadline={isPastDeadline}
          onShowForm={onShowForm}
        />
      )}
      <AssignmentDetailInfo assignment={assignment} submission={submission} />
    </div>
  );
}
