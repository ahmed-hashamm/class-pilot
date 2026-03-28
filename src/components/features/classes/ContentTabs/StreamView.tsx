"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssignmentsByClass } from "@/lib/db_data_fetching/assignments";
import Feed from "@/components/features/feed/Feed";
import StickyNotes from "@/components/features/classes/sidebar/StickyNotes";
import ClassCodeCard from "@/components/features/classes/sidebar/ClassCodeCard";
import DueSoonCard from "@/components/features/classes/sidebar/DueSoonCard";

interface StreamViewProps {
  classId: string;
  classCode: string;
  isTeacher: boolean;
  userId: string;
  settings?: {
    showClassCode?: boolean;
  };
}

export default function StreamView({
  classId,
  classCode,
  isTeacher,
  userId,
  settings,
}: StreamViewProps) {
  const { data: assignments = [] } = useQuery({
    queryKey: ["classAssignments", classId],
    queryFn: async () => {
      const { assignments: data, error } = await getAssignmentsByClass(classId);
      if (error) throw new Error("Failed to load assignments.");
      return (data || []) as { id: string; title: string; due_date: string | null }[];
    },
  });

  const isCodeHidden = settings?.showClassCode === false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full mx-auto py-4">
      {/* Sidebar */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <ClassCodeCard
          classCode={classCode}
          isTeacher={isTeacher}
          isCodeHidden={isCodeHidden}
        />
        <DueSoonCard assignments={assignments} />
        <StickyNotes classId={classId} />
      </div>

      {/* Feed */}
      <div className="lg:col-span-9">
        <Feed classId={classId} isTeacher={isTeacher} userId={userId} />
      </div>
    </div>
  );
}
