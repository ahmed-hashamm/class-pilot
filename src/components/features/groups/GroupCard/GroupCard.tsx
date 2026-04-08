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
    <div className="group relative flex flex-col bg-navy/5 hover:bg-white overflow-hidden
      items-stretch transition-all duration-500
      border  rounded-md hover:shadow-lg hover:-translate-y-1 border-b-4 border-navy/90"
    >
      {/* Top glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full transition-all duration-300 py-6">
        <GroupHeader
          group={group}
          isTeacher={isTeacher}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <div className="px-6 mt-4 flex-1">
          <GroupMemberList
            group={group}
            isTeacher={isTeacher}
            onRemoveMember={onRemoveMember}
          />
        </div>
      </div>
    </div>
  );
}

