"use client";

import GroupList from "@/components/features/groups/GroupList";

interface GroupsTabProps {
  classId: string;
  isTeacher: boolean;
}

export default function GroupsTab({ classId, isTeacher }: GroupsTabProps) {
  return <GroupList classId={classId} isTeacher={isTeacher} />;
}
