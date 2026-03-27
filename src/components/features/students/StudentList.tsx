"use client";

import { useQuery } from "@tanstack/react-query";
import { getClassMembers } from "@/lib/db_data_fetching/members";
import StudentRow from "./StudentRow";
import { MemberSectionHeader } from "./StudentListComponents";
import { EmptyState, SkeletonLoader } from "@/components/ui";
import { Users, RefreshCw } from "lucide-react";

interface StudentListProps {
  classId: string;
  isTeacher: boolean;
}

export default function StudentList({ classId, isTeacher }: StudentListProps) {
  const { data: members = [], isLoading, error, refetch } = useQuery({
    queryKey: ["classMembers", classId],
    queryFn: async () => {
      const { members: data, error } = await getClassMembers(classId);
      if (error) throw new Error("Failed to load members.");
      return (data || []) as any[];
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <SkeletonLoader variant="list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <EmptyState 
          icon={RefreshCw}
          title="Error loading members"
          description="We couldn't load the members for this class. Please try again."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  const teachers = members.filter((m) => m.role === "teacher");
  const students = members.filter((m) => m.role === "student");

  return (
    <div className="max-w-3xl mx-auto py-6 flex flex-col gap-8">
      {/* Teachers */}
      {teachers.length > 0 && (
        <section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          <MemberSectionHeader role="teacher" count={teachers.length} />
          <div className="divide-y divide-border">
            {teachers.map((member) => (
              <StudentRow key={member.id} member={member} role="teacher" />
            ))}
          </div>
        </section>
      )}

      {/* Students */}
      <section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <MemberSectionHeader role="student" count={students.length} />
        {students.length === 0 ? (
          <EmptyState 
            icon={Users}
            title="No students yet"
            description={isTeacher ? "Share the class code to invite students." : "Your teacher has not added any students yet."}
          />
        ) : (
          <div className="divide-y divide-border">
            {students.map((member) => (
              <StudentRow key={member.id} member={member} role="student" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
