"use client";

import AssignmentsList from "@/components/features/assignments/AssignmentsList";
import { DiscussionPanel, DiscussionDrawer } from "@/components/features/discussions";
import { PageHeader, FeatureButton } from "@/components/ui";
import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";

interface AssignmentsTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function AssignmentsTab({ classId, isTeacher, userId }: AssignmentsTabProps) {
  const HeaderAction = isTeacher ? (
    <Link href={`/classes/${classId}/assignments/create`}>
      <FeatureButton
        label="Create assignment"
        icon={Plus}
      />
    </Link>
  ) : null;

  return (
    <div className="flex flex-col">
      <PageHeader
        icon={ClipboardList}
        title="Assignments"
        description="Coursework, projects, and evaluative materials."
        action={HeaderAction}
      />

      {/* Mobile Discussion Drawer - Placed below header actions on mobile */}
      <DiscussionDrawer
        classId={classId}
        topic="assignments"
        userId={userId}
        isTeacher={isTeacher}
      />

      <div className="flex gap-10 items-start">
        <div className="flex-1 min-w-0">
          <AssignmentsList
            classId={classId}
            isTeacher={isTeacher}
            hideHeader={true}
          />
        </div>

        {/* Desktop Sidebar Discussion */}
        <div className="hidden lg:block w-[450px] shrink-0 sticky top-8 pt-6">
          <DiscussionPanel
            classId={classId}
            topic="assignments"
            userId={userId}
            isTeacher={isTeacher}
          />
        </div>
      </div>
    </div>
  );
}
