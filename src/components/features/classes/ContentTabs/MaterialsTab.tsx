"use client";

import MaterialsList from "@/components/features/materials/MaterialsList";

interface MaterialsTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function MaterialsTab({ classId, isTeacher, userId }: MaterialsTabProps) {
  return (
    <MaterialsList
      classId={classId}
      isTeacher={isTeacher}
      userId={userId}
    />
  );
}
