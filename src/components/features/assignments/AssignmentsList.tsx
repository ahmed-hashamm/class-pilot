"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssignmentsByClass } from "@/lib/db_data_fetching/assignments";
import AssignmentGroup from "./AssignmentGroup";
import { 
  PageHeader, 
  EmptyState, 
  SkeletonLoader,
  FeatureButton 
} from "@/components/ui";
import { ClipboardList, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

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

  const HeaderAction = isTeacher ? (
    <Link href={`/classes/${classId}/assignments/create`}>
      <FeatureButton 
        label="Create assignment" 
        icon={Plus}
      />
    </Link>
  ) : null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <PageHeader 
          icon={ClipboardList} 
          title="Assignments" 
          description="Coursework and evaluative materials"
          action={HeaderAction}
        />
        <SkeletonLoader variant="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <PageHeader 
          icon={ClipboardList} 
          title="Assignments" 
          description="Coursework and evaluative materials"
          action={HeaderAction}
        />
        <EmptyState 
          icon={RefreshCw}
          title="Error loading assignments"
          description="We couldn't load the assignments for this class. Please try again."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const now = new Date();
  const upcoming = assignments.filter((a) => !a.due_date || new Date(a.due_date) >= now);
  const past = assignments.filter((a) => a.due_date && new Date(a.due_date) < now);

  return (
    <div className="flex flex-col gap-6 py-6">
      <PageHeader 
        icon={ClipboardList} 
        title="Assignments" 
        description="Coursework and evaluative materials"
        action={HeaderAction}
      />

      {assignments.length === 0 ? (
        <EmptyState 
          icon={ClipboardList}
          title="No assignments yet"
          description={isTeacher 
            ? "Create your first assignment for students to complete." 
            : "Your teacher has not posted any assignments yet."}
          actionLabel={isTeacher ? "Create first assignment" : undefined}
          onAction={isTeacher ? () => {} : undefined} // Handled by Link above? No, let's just use the header action
        />
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
