"use client";

import { useQuery } from "@tanstack/react-query";
import { getClassMembers } from "@/lib/db_data_fetching/members";
import StudentRow from "./StudentRow";
import {
  MemberSectionHeader,
  StudentsEmptyState,
  MembersLoadingSkeleton,
} from "./StudentListComponents";
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

  if (isLoading) return <MembersLoadingSkeleton />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center gap-4
        border-2 border-dashed border-border rounded-2xl bg-white text-center">
        <Users size={32} className="text-muted-foreground/40" />
        <p className="text-[14px] font-medium text-muted-foreground">Error loading members</p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 bg-navy text-white font-semibold
            text-[13px] px-5 py-2.5 rounded-xl hover:bg-navy/90 transition cursor-pointer border-none">
          <RefreshCw size={14} /> Retry
        </button>
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
          <StudentsEmptyState isTeacher={isTeacher} />
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
