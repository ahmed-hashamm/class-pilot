import { BookOpen, Clock } from "lucide-react";
import { FeatureButton } from "@/components/ui";

interface StudentStatusProps {
  isTurnedIn: boolean;
  isGraded?: boolean;
  isPastDeadline?: boolean;
  onShowForm: () => void;
}

export default function StudentStatus({ isTurnedIn, isGraded, isPastDeadline, onShowForm }: StudentStatusProps) {
  if (isGraded) return null;

  // Deadline has passed and student hasn't submitted
  if (isPastDeadline && !isTurnedIn) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Clock size={14} className="text-red-500 shrink-0" />
          <p className="text-[12px] font-bold text-red-600">
            Deadline has passed — submissions are closed.
          </p>
        </div>
      </div>
    );
  }

  // Deadline passed but student already submitted — allow editing
  // (the server will still reject if they try to create a new submission)

  return (
    <FeatureButton
      onClick={onShowForm}
      variant={"primary"}
      className="w-full font-black text-[13px] py-3.5 rounded-xl border-2 shadow-md shadow-navy/10"
      label={isTurnedIn ? "Edit Submission" : "Add Submission"}
      icon={BookOpen}
    />
  );
}
