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

import { Assignment } from "@/lib/types/schema";

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
      return (data || []) as Assignment[];
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
    <div className="flex flex-col gap-10 py-8 max-w-5xl mx-auto">
      <PageHeader 
        icon={ClipboardList} 
        title="Assignments" 
        description="Manage your coursework, projects, and evaluative materials in one place."
        action={HeaderAction}
      />

      {assignments.length === 0 ? (
        <div className="mt-4">
          <EmptyState 
            icon={ClipboardList}
            title="No assignments yet"
            description={isTeacher 
              ? "Start by creating your first assignment. You can include attachments, set deadlines, and assign rubrics." 
              : "Your teacher has not posted any assignments yet. Check back later for updates."}
            actionLabel={isTeacher ? "Create first assignment" : undefined}
            onAction={isTeacher ? () => {} : undefined}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <AssignmentGroup
            label="Upcoming"
            assignments={upcoming}
            classId={classId}
          />
          <AssignmentGroup
            label="Past"
            assignments={past}
            classId={classId}
            muted
          />
        </div>
      )}
    </div>
  );
}
