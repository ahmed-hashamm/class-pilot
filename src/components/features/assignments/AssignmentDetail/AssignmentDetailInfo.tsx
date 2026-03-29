import { Clock, Award, BookOpen, Users } from "lucide-react";
import { format } from "date-fns";
import { Assignment } from "@/lib/types/schema";

interface AssignmentDetailInfoProps {
  assignment: Assignment;
  submission?: any;
}

export default function AssignmentDetailInfo({ assignment, submission }: AssignmentDetailInfoProps) {
  const isGraded = submission?.status === 'graded';

  return (
    <div className="flex flex-col gap-3">
      {isGraded && (
        <div className="flex items-center justify-between bg-navy text-white rounded-2xl px-4 py-4 shadow-md mb-2">
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Your Grade</span>
            <span className="text-[11px] font-medium text-white/80 italic">Graded by instructor</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[28px] font-black text-yellow leading-none">{submission.final_grade ?? 0}</span>
            <span className="text-[12px] font-bold text-white/30">/ {assignment.points}</span>
          </div>
        </div>
      )}
      <InfoRow icon={<Clock size={14} />} label="Due Date" value={assignment.due_date ? format(new Date(assignment.due_date), "MMM d, h:mm a") : "No deadline"} />
      <InfoRow icon={<Award size={14} />} label="Total Value" value={`${assignment.points} points`} />
      <InfoRow icon={<BookOpen size={14} />} label="Type" value={assignment.submission_type === 'file' ? 'File Upload' : 'Text Entry'} />
      {assignment.is_group_project && (
        <InfoRow icon={<Users size={14} />} label="Format" value="Group Project" />
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 justify-between bg-white border border-border rounded-2xl px-4 py-3 shadow-sm hover:border-navy/20 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="size-7 rounded-lg bg-navy/5 flex items-center justify-center text-navy/60">{icon}</div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-navy/40">{label}</span>
      </div>
      <span className="text-[12px] font-black text-foreground">{value}</span>
    </div>
  );
}
