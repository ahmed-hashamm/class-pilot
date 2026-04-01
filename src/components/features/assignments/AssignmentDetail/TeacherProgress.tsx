'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import { SubmissionsList } from "@/components/features/submissions";
import { Assignment } from "@/lib/types/schema";
import { gradeAssignmentSubmissionAction } from "@/actions/ClassFeaturesActions";
import { Button } from "@/components/ui/button";

interface TeacherProgressProps {
  submissions: any[];
  assignment: Assignment;
  classId: string;
}

export default function TeacherProgress({ submissions, assignment, classId }: TeacherProgressProps) {
  const router = useRouter();
  const [gradingIds, setGradingIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingSubmissions = submissions?.filter(s => s.status !== 'graded' && s.final_grade === null) || [];

  const handleGradeAll = async () => {
    if (pendingSubmissions.length === 0) {
      toast.info("No pending submissions to grade");
      return;
    }

    if (!confirm(`Are you sure you want to AI-grade ${pendingSubmissions.length} submissions? This may take a minute.`)) {
      return;
    }

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

        <Button
          onClick={handleGradeAll}
          disabled={isProcessing || pendingSubmissions.length === 0}
          variant="outline"
          size="sm"
          className="rounded-xl border-2 border-navy text-navy font-black text-[11px] uppercase tracking-wider hover:bg-navy hover:text-white transition-all gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="size-3 animate-spin" />
              Grading {pendingSubmissions.length - gradingIds.length}/{pendingSubmissions.length}...
            </>
          ) : (
            <>
              <Sparkles className="size-3 fill-current" />
              Grade All
            </>
          )}
        </Button>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden min-h-[200px]">
        <SubmissionsList 
          submissions={submissions} 
          assignment={assignment} 
          classId={classId} 
          gradingIds={gradingIds}
        />
      </div>
    </div>
  );
}
