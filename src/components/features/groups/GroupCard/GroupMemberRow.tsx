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
    <div className="group/member flex items-center justify-between pl-3 pr-2 py-2 rounded-2xl bg-secondary/30 border border-transparent hover:border-navy/10 hover:bg-white hover:shadow-lg hover:shadow-navy/5 transition-all min-w-[220px] flex-1">
      <div className="flex items-center gap-3">
        <StudentAvatar
          name={name}
          src={member.users?.avatar_url}
        />
        <span className="text-[13px] font-black text-foreground group-hover/member:text-navy transition-colors">{name}</span>
      </div>
      {isTeacher && (
        <button
          onClick={() => onRemoveMember(groupId, member.user_id)}
          title="Remove member"
          className="p-2 text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer bg-transparent border-none"
        >
          <UserMinus size={14} />
        </button>
      )}
    </div>
  );
}
