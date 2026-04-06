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
    <div className="group relative flex flex-col border-b-4 rounded-2xl overflow-hidden shadow-md border border-navy hover:shadow-xl hover:-translate-y-1 hover:border-navy transition-all duration-300 ">
      <div className="relative z-10 flex flex-col h-full overflow-hidden bg-navy/5 hover:bg-white transition-all duration-300 ">
        <GroupHeader
          group={group}
          isTeacher={isTeacher}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <div className="border-t border-navy/[0.08]" />

        <div className="p-6 flex-1">
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
