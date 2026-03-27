"use client";

import AssignmentCard from "./AssignmentCard";

interface AssignmentGroupProps {
  label: string;
  assignments: any[];
  classId: string;
  getDisplayName: (path: string) => string;
  muted?: boolean;
}

export default function AssignmentGroup({
  label,
  assignments,
  classId,
  getDisplayName,
  muted = false,
}: AssignmentGroupProps) {
  if (assignments.length === 0) return null;

  return (
    <div>
      <p className={`text-[11px] font-bold tracking-[.18em] uppercase mb-3
        ${muted ? "text-muted-foreground/60" : "text-navy"}`}>
        {label} · {assignments.length}
      </p>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            classId={classId}
            getDisplayName={getDisplayName}
            muted={muted}
          />
        ))}
      </div>
    </div>
  );
}
