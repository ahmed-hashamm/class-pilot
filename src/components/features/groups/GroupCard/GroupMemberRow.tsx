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
    <div className="group/member flex items-center justify-between pl-2.5 pr-2 py-1.5 rounded-xl bg-secondary/30 border border-transparent hover:border-navy/10 hover:bg-white hover:shadow-sm hover:shadow-navy/5 transition-all min-w-[220px] flex-1">
      <div className="flex items-center gap-2.5">
        <StudentAvatar
          name={name}
          src={member.users?.avatar_url}
          className="size-6 text-[9px]"
        />
        <span className="text-[12px] font-bold text-foreground group-hover/member:text-navy transition-colors">{name}</span>
      </div>
      {isTeacher && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemoveMember(groupId, member.user_id)}
          title="Remove member"
          className="p-2 h-auto w-auto text-muted-foreground/40 hover:text-red-500 hover:bg-red-50"
        >
          <UserMinus size={14} />
        </Button>
      )}
    </div>
  );
}
