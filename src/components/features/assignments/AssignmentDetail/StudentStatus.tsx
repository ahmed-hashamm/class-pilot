import { BookOpen } from "lucide-react";

interface StudentStatusProps {
  isTurnedIn: boolean;
  isGraded?: boolean;
  onShowForm: () => void;
}

export default function StudentStatus({ isTurnedIn, isGraded, onShowForm }: StudentStatusProps) {
  if (isGraded) return null;

  return (
    <button
      onClick={onShowForm}
      className={`w-full inline-flex items-center justify-center gap-2 font-black text-[13px] py-3.5 rounded-xl border-2 transition-all cursor-pointer 
        ${isTurnedIn 
          ? "bg-navy text-white border-navy hover:bg-navy/90 shadow-md shadow-navy/10" 
          : "bg-white text-navy border-navy hover:bg-navy hover:text-white"
        }`}
    >
      <BookOpen size={16} /> 
      {isTurnedIn ? "Edit Submission" : "Add Submission"}
    </button>
  );
}
