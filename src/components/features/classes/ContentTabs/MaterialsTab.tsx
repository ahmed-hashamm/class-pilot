"use client";

import MaterialsList from "@/components/features/materials/MaterialsList";
import { DiscussionPanel } from "@/components/features/discussions";

interface MaterialsTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function MaterialsTab({ classId, isTeacher, userId }: MaterialsTabProps) {
  return (
    <div className="flex gap-6 items-start">
      {/* Content Column */}
      <div className="flex-1 min-w-0">
        <MaterialsList
          classId={classId}
          isTeacher={isTeacher}
          userId={userId}
        />
      </div>

      {/* Discussion Sidebar */}
      <div className="hidden lg:block w-[340px] shrink-0 sticky top-8">
        <DiscussionPanel
          classId={classId}
          topic="materials"
          userId={userId}
          isTeacher={isTeacher}
        />
      </div>
    </div>
  );
}
