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
    <div className="group relative flex flex-col bg-white border border-navy/[0.08] rounded-[32px] transition-all duration-500
      hover:-translate-y-2 shadow-[0_8px_30px_rgb(20,30,60,0.04),0_4px_8px_rgb(20,30,60,0.02)] 
      hover:shadow-[0_20px_40px_rgba(20,30,60,0.1),0_10px_20px_rgba(20,30,60,0.05)] active:scale-[0.98]">

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <GroupHeader
          group={group}
          isTeacher={isTeacher}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <hr className="border-navy/15 mx-6 sm:mx-8" />

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex-1">
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
