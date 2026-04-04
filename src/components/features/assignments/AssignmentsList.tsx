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
  hideHeader?: boolean;
}

export default function AssignmentsList({ classId, isTeacher, hideHeader = false }: AssignmentsListProps) {
  const { data: assignments = [], isLoading, error, refetch } = useQuery({
    queryKey: ["classAssignments", classId],
    queryFn: async () => {
      const { assignments: data, error } = await getAssignmentsByClass(classId);
      if (error) throw new Error("Failed to load assignments.");
      return (data || []) as Assignment[];
    },
  });

  const now = new Date();
  const upcoming = assignments.filter((a) => !a.due_date || new Date(a.due_date) >= now);
  const past = assignments.filter((a) => a.due_date && new Date(a.due_date) < now);

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
      <div className="flex flex-col gap-10 py-8">
        {!hideHeader && <SkeletonLoader variant="header" />}
        <SkeletonLoader variant="list" count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 py-6">
        {!hideHeader && (
          <PageHeader 
            icon={ClipboardList} 
            title="Assignments" 
            description="Manage and track class assignments."
            action={HeaderAction}
          />
        )}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
          <div className="size-12 rounded-xl bg-red-100 flex items-center justify-center">
            <RefreshCw className="size-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-red-900">Failed to load assignments</h3>
          <p className="text-red-600 max-w-sm">
            There was an error loading the assignments. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col gap-6 py-6">
        {!hideHeader && (
          <PageHeader 
            icon={ClipboardList} 
            title="Assignments" 
            description="Manage and track class assignments."
            action={HeaderAction}
          />
        )}
        <EmptyState
          icon={ClipboardList}
          title="No assignments yet"
          description={isTeacher 
            ? "Create your first assignment to start tracking student progress." 
            : "Your teacher has not posted any assignments yet."}
          actionLabel={isTeacher ? "Create first assignment" : undefined}
          onAction={isTeacher ? () => window.location.href = `/classes/${classId}/assignments/create` : undefined}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 py-6">
      {!hideHeader && (
        <PageHeader 
          icon={ClipboardList} 
          title="Assignments" 
          description="Manage and track class assignments."
          action={HeaderAction}
        />
      )}

      <div className="flex flex-col gap-12">
        {upcoming.length > 0 && (
          <AssignmentGroup
            label="Upcoming"
            assignments={upcoming}
            classId={classId}
          />
        )}
        {past.length > 0 && (
          <AssignmentGroup
            label="Past"
            assignments={past}
            classId={classId}
            muted
          />
        )}
      </div>
    </div>
  );
}
