"use client";

import StudentList from "@/components/features/students/StudentList";

interface MembersTabProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function MembersTab({ classId, isTeacher }: MembersTabProps) {
  return <StudentList classId={classId} isTeacher={isTeacher} />;
}
