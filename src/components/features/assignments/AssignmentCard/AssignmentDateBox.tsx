import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface AssignmentDateBoxProps {
  dueDate: Date | null;
  muted?: boolean;
}

export default function AssignmentDateBox({ dueDate, muted }: AssignmentDateBoxProps) {
  return (
    <div className={`w-20 sm:w-24 shrink-0 flex flex-col items-center justify-center border-r border-border transition-colors
      ${muted ? "bg-secondary/30" : "bg-secondary/10 group-hover:bg-navy/5"}`}>
      {dueDate ? (
        <>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1">
            {format(dueDate, "MMM")}
          </span>
          <span className={`text-2xl font-black leading-none ${muted ? "text-muted-foreground/60" : "text-navy"}`}>
            {format(dueDate, "d")}
          </span>
          <span className={`text-[10px] font-bold text-muted-foreground/40 mt-1`}>
            {format(dueDate, "EEE")}
          </span>
        </>
      ) : (
        <Calendar size={20} className="text-muted-foreground/20" />
      )}
    </div>
  );
}
