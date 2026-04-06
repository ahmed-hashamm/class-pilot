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
    <div className="group relative flex flex-col transition-colors duration-500 hover:bg-navy/5">
      <div className="relative z-10 flex flex-col h-full overflow-hidden truncate">
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
