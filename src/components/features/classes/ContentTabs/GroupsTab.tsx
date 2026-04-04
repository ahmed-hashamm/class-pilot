"use client";

import GroupList from "@/components/features/groups/GroupList";
import { DiscussionPanel } from "@/components/features/discussions";

interface GroupsTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function GroupsTab({ classId, isTeacher, userId }: GroupsTabProps) {
  return (
    <div className="flex gap-6 items-start">
      {/* Content Column */}
      <div className="flex-1 min-w-0">
        <GroupList classId={classId} isTeacher={isTeacher} />
      </div>

      {/* Discussion Sidebar */}
      <div className="hidden lg:block w-[340px] shrink-0 sticky top-8">
        <DiscussionPanel
          classId={classId}
          topic="groups"
          userId={userId}
          isTeacher={isTeacher}
        />
      </div>
    </div>
  );
}
