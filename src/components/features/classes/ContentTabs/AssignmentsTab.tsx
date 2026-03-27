"use client";

import AssignmentsList from "@/components/features/assignments/AssignmentsList";

interface AssignmentsTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function AssignmentsTab({ classId, isTeacher }: AssignmentsTabProps) {
  return (
    <AssignmentsList
      classId={classId}
      isTeacher={isTeacher}
    />
  );
}
