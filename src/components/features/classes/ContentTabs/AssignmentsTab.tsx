"use client";

import AssignmentsList from "@/components/features/assignments/AssignmentsList";
import { DiscussionPanel } from "@/components/features/discussions";

interface AssignmentsTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function AssignmentsTab({ classId, isTeacher, userId }: AssignmentsTabProps) {
  return (
    <div className="flex gap-6 items-start">
      {/* Content Column */}
      <div className="flex-1 min-w-0">
        <AssignmentsList
          classId={classId}
          isTeacher={isTeacher}
        />
      </div>

      {/* Discussion Sidebar */}
      <div className="hidden lg:block w-[340px] shrink-0 sticky top-8">
        <DiscussionPanel
          classId={classId}
          topic="assignments"
          userId={userId}
          isTeacher={isTeacher}
        />
      </div>
    </div>
  );
}
