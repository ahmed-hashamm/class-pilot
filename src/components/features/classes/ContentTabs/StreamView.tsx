"use client";

import { useQuery } from "@tanstack/react-query";
import { getAssignmentsByClass } from "@/lib/db_data_fetching/assignments";
import Feed from "@/components/features/feed/Feed";
import StickyNotes from "@/components/features/classes/sidebar/StickyNotes";
import ClassCodeCard from "@/components/features/classes/sidebar/ClassCodeCard";
import DueSoonCard from "@/components/features/classes/sidebar/DueSoonCard";
import StreamSidebarMobile from "@/components/features/classes/sidebar/StreamSidebarMobile";

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
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 w-full mx-auto pt-0 lg:pt-4 pb-4">
      {/* Mobile-Only Toggleable Sidebar */}
      <StreamSidebarMobile
        classId={classId}
        classCode={classCode}
        isTeacher={isTeacher}
        isCodeHidden={isCodeHidden}
        assignments={assignments}
      />

      {/* Desktop Sidebar (lg and above) */}
      <div className="hidden lg:col-span-3 lg:flex lg:flex-col gap-6">
        <ClassCodeCard
          classCode={classCode}
          isTeacher={isTeacher}
          isCodeHidden={isCodeHidden}
        />
        <DueSoonCard assignments={assignments} />
        <StickyNotes classId={classId} />
      </div>

      {/* Main Feed */}
      <div className="flex-1 lg:col-span-9">
        <Feed classId={classId} isTeacher={isTeacher} userId={userId} />
      </div>
    </div>
  );
}
