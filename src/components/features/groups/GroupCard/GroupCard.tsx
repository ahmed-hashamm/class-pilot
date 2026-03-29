"use client";

import { Group } from "@/lib/types/schema";
import GroupHeader from "./GroupHeader";
import GroupMemberList from "./GroupMemberList";

interface GroupCardProps {
  group: Group;
  isTeacher: boolean;
  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
  onRemoveMember: (groupId: string, userId: string) => void;
}

export default function GroupCard({
  group,
  isTeacher,
  onEdit,
  onDelete,
  onRemoveMember,
}: GroupCardProps) {
  return (
    <div className="group relative flex flex-col bg-white border border-border rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1">
      {/* Visual Accent */}
      <div className="absolute left-0 top-8 bottom-8 w-1 bg-navy/10 rounded-r-full group-hover:bg-navy transition-colors" />

      <GroupHeader 
        group={group} 
        isTeacher={isTeacher} 
        onEdit={onEdit} 
        onDelete={onDelete} 
      />

      <GroupMemberList 
        group={group} 
        isTeacher={isTeacher} 
        onRemoveMember={onRemoveMember} 
      />
    </div>
  );
}
