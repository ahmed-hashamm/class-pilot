'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { SubmissionsList } from "@/components/features/submissions";
import { Assignment } from "@/lib/types/schema";
import { gradeAssignmentSubmissionAction } from "@/actions/ClassFeaturesActions";
import { FeatureButton } from "@/components/ui";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface TeacherProgressProps {
  submissions: any[];
  assignment: Assignment;
  classId: string;
}

export default function TeacherProgress({ submissions, assignment, classId }: TeacherProgressProps) {
  const router = useRouter();
  const [gradingIds, setGradingIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const pendingSubmissions = submissions?.filter(s => s.status !== 'graded' && s.final_grade === null) || [];

  const handleGradeAll = async () => {
    if (pendingSubmissions.length === 0) {
      toast.info("No pending submissions to grade");
      return;
    }

    setIsConfirmOpen(false);
    setIsProcessing(true);
    let successCount = 0;
    let failCount = 0;

    for (const sub of pendingSubmissions) {
      setGradingIds(prev => [...prev, sub.id]);
      
      try {
        const result = await gradeAssignmentSubmissionAction(assignment.id, sub.id);
        if (result.error) {
          console.error(`Failed to grade ${sub.id}:`, result.error);
          failCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`Error grading ${sub.id}:`, err);
        failCount++;
      } finally {
        setGradingIds(prev => prev.filter(id => id !== sub.id));
      }
    }

    setIsProcessing(false);
    
    if (successCount > 0) {
      toast.success(`Successfully graded ${successCount} submissions`);
      router.refresh();
    }
    
    if (failCount > 0) {
      toast.error(`Failed to grade ${failCount} submissions. Check console for details.`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Classwork Overview</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-navy/5 text-navy border border-navy/10 rounded-full px-3 py-1">
              {submissions?.length || 0} Submissions
            </span>
            {pendingSubmissions.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-yellow/10 text-navy border border-yellow/20 rounded-full px-3 py-1">
                {pendingSubmissions.length} Pending
              </span>
            )}
          </div>
        </div>

        <FeatureButton
          onClick={() => setIsConfirmOpen(true)}
          disabled={pendingSubmissions.length === 0}
          loading={isProcessing}
          variant="outline"
          icon={Sparkles}
          label="Grade All"
          loadingLabel={`Grading ${pendingSubmissions.length - gradingIds.length}/${pendingSubmissions.length}...`}
          className="border-2 font-black text-[11px] hover:bg-navy hover:text-white px-4 py-2"
        />
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        <SubmissionsList 
          submissions={submissions} 
          assignment={assignment} 
          classId={classId} 
          gradingIds={gradingIds}
        />
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleGradeAll}
        title="Batch AI Grading"
        message={`Are you sure you want to AI-grade ${pendingSubmissions.length} submissions? This will process each submission through the AI rubric, which may take a minute.`}
        confirmLabel="Start Grading"
        cancelLabel="Not Now"
        variant="info"
        isLoading={isProcessing}
      />
    </div>
  );
}
