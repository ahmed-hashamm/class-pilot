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
    <div className="group relative flex flex-col bg-white border border-navy/[0.1] rounded-xl overflow-hidden
      transition-all duration-300 hover:-translate-y-1
      shadow-[0_2px_12px_rgb(20,30,60,0.03)]
      hover:shadow-[0_12px_32px_rgba(20,30,60,0.08),0_4px_12px_rgba(20,30,60,0.04)]
      hover:border-navy/[0.12]">

      {/* Top glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <GroupHeader
          group={group}
          isTeacher={isTeacher}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <div className="border-t border-dashed border-navy/[0.06] mx-5 sm:mx-6" />

        <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex-1">
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
