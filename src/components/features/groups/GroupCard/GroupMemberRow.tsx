import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";
import StudentAvatar from "./StudentAvatar";
import { BaseUser } from "@/lib/types/schema";

interface GroupMemberRowProps {
  groupId: string;
  member: {
    user_id: string;
    users: BaseUser | null;
  };
  isTeacher: boolean;
  onRemoveMember: (groupId: string, userId: string) => void;
}

export default function GroupMemberRow({
  groupId,
  member,
  isTeacher,
  onRemoveMember,
}: GroupMemberRowProps) {
  const name = member.users?.full_name || "Unknown";

  return (
    <div className="group/member w-full flex items-center gap-4 pl-1.5 pr-2 py-1.5 rounded-2xl bg-navy/[0.03] border border-navy/[0.06] hover:bg-white hover:border-navy/20 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-2 min-w-0">
        <StudentAvatar
          name={name}
          src={member.users?.avatar_url}
          className="size-7 text-[11px] shrink-0"
        />
        <span className="text-[13px] font-bold text-navy/80 whitespace-nowrap truncate">{name}</span>
      </div>
      {isTeacher && (
        <button
          onClick={() => onRemoveMember(groupId, member.user_id)}
          title="Remove member"
          className="ml-auto size-6 flex items-center justify-center rounded-lg text-navy/20 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
        >
          <UserMinus size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
