"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssignmentsByClass } from "@/lib/db_data_fetching/assignments";
import AssignmentGroup from "./AssignmentGroup";
import {
  AssignmentsHeader,
  AssignmentsEmptyState,
  AssignmentsLoadingSkeleton
} from "./AssignmentsListComponents";
import { RefreshCw } from "lucide-react";

interface AssignmentsListProps {
  classId: string;
  isTeacher: boolean;
}

export default function AssignmentsList({ classId, isTeacher }: AssignmentsListProps) {
  const { data: assignments = [], isLoading, error, refetch } = useQuery({
    queryKey: ["classAssignments", classId],
    queryFn: async () => {
      const { assignments: data, error } = await getAssignmentsByClass(classId);
      if (error) throw new Error("Failed to load assignments.");
      return (data || []) as any[];
    },
  });

  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    return fileName.includes("-") ? fileName.split("-").slice(1).join("-") : fileName;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <AssignmentsHeader isTeacher={isTeacher} classId={classId} />
        <AssignmentsLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col items-center justify-center gap-4 py-16
          border-2 border-dashed border-border rounded-2xl bg-white text-center">
          <p className="text-[14px] font-medium text-muted-foreground">Error loading assignments</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-navy text-white font-semibold
              text-[13px] px-5 py-2.5 rounded-xl hover:bg-navy/90 transition cursor-pointer border-none">
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const upcoming = assignments.filter((a) => !a.due_date || new Date(a.due_date) >= now);
  const past = assignments.filter((a) => a.due_date && new Date(a.due_date) < now);

  return (
    <div className="flex flex-col gap-6 py-6">
      <AssignmentsHeader isTeacher={isTeacher} classId={classId} />

      {assignments.length === 0 ? (
        <AssignmentsEmptyState isTeacher={isTeacher} classId={classId} />
      ) : (
        <div className="flex flex-col gap-8">
          <AssignmentGroup
            label="Upcoming"
            assignments={upcoming}
            classId={classId}
            getDisplayName={getDisplayName}
          />
          <AssignmentGroup
            label="Past"
            assignments={past}
            classId={classId}
            getDisplayName={getDisplayName}
            muted
          />
        </div>
      )}
    </div>
  );
}
