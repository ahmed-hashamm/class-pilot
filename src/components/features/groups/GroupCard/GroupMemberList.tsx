import GroupMemberRow from "./GroupMemberRow";
import { Group } from "@/lib/types/schema";

interface GroupMemberListProps {
  group: Group;
  isTeacher: boolean;
  onRemoveMember: (groupId: string, userId: string) => void;
}

export default function GroupMemberList({
  group,
  isTeacher,
  onRemoveMember,
}: GroupMemberListProps) {
  const members = group.project_members || [];

  return (
    <div className="px-6 pt-2 pb-8 sm:px-8 sm:pt-4 sm:pb-10">
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-navy/30 pl-1">Members</p>

        {members.length === 0 ? (
          <div className="py-8 px-4 border-2 border-dashed border-secondary rounded-2xl flex flex-col items-center justify-center bg-secondary/5">
            <p className="text-[12px] text-muted-foreground font-medium italic">No members assigned to this team yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((m: any) => (
              <GroupMemberRow
                key={m.user_id}
                groupId={group.id}
                member={m}
                isTeacher={isTeacher}
                onRemoveMember={onRemoveMember}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
