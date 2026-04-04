"use client";

import { useState } from "react";
import GroupList from "@/components/features/groups/GroupList";
import { DiscussionPanel, DiscussionDrawer } from "@/components/features/discussions";
import { PageHeader, FeatureButton } from "@/components/ui";
import { Users2, Plus } from "lucide-react";

interface GroupsTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function GroupsTab({ classId, isTeacher, userId }: GroupsTabProps) {
  const [showGroupModal, setShowGroupModal] = useState(false);

  return (
    <div className="flex flex-col ">
      <PageHeader
        icon={Users2}
        title="Student Groups"
        description="Organize students into collaborative teams."
        action={isTeacher ? (
          <FeatureButton
            label="New group"
            icon={Plus}
            onClick={() => setShowGroupModal(true)}
          />
        ) : null}
      />

      {/* Mobile Discussion Drawer - Contextual placement below header */}
      <DiscussionDrawer
        classId={classId}
        topic="groups"
        userId={userId}
        isTeacher={isTeacher}
      />

      <div className="flex gap-10 items-start">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <GroupList
            classId={classId}
            isTeacher={isTeacher}
            hideHeader={true}
            externalModal={showGroupModal}
            onCloseModal={() => setShowGroupModal(false)}
          />
        </div>

        {/* Desktop Sidebar Discussion */}
        <div className="hidden lg:block w-[450px] shrink-0 sticky top-8 pt-6">
          <DiscussionPanel
            classId={classId}
            topic="groups"
            userId={userId}
            isTeacher={isTeacher}
          />
        </div>
      </div>
    </div>
  );
}
