import { SubmissionsList } from "@/components/features/submissions";
import { Assignment } from "@/lib/types/schema";

interface TeacherProgressProps {
  submissions: any[];
  assignment: Assignment;
  classId: string;
}

export default function TeacherProgress({ submissions, assignment, classId }: TeacherProgressProps) {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[.2em] text-navy/40 pl-1">Classwork Overview</p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-navy/5 text-navy border border-navy/10 rounded-full px-3 py-1">
          {submissions?.length || 0} Submissions
        </span>
      </div>
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden min-h-[200px]">
        <SubmissionsList submissions={submissions} assignment={assignment} classId={classId} />
      </div>
    </div>
  );
}
