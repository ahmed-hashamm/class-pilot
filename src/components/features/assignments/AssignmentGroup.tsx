"use client";

import AssignmentCard from "./AssignmentCard/AssignmentCard";
import { Assignment } from "@/lib/types/schema";

interface AssignmentGroupProps {
  label: string;
  assignments: Assignment[];
  classId: string;
  muted?: boolean;
}

export default function AssignmentGroup({
  label,
  assignments,
  classId,
  muted = false,
}: AssignmentGroupProps) {
  if (assignments.length === 0) return null;

  return (
    <div>
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 px-1">
        <p className={`text-[12px] font-black tracking-[.2em] uppercase
          ${muted ? "text-muted-foreground/40" : "text-navy/80"}`}>
          {label}
        </p>
        <div className={`h-1 flex-1 rounded-full ${muted ? "bg-secondary/40" : "bg-navy/5"}`} />
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg
          ${muted ? "bg-secondary/50 text-muted-foreground/50" : "bg-navy/10 text-navy"}`}>
          {assignments.length}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            classId={classId}
            muted={muted}
          />
        ))}
      </div>
    </div>
    </div>
  );
}
