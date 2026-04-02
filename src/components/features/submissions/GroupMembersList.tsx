"use client"

import { StudentAvatar } from '@/components/features/students/StudentAvatar'

interface GroupMembersListProps {
  members: any[]
  getAvatarSrc: (path?: string) => string | undefined
}

export function GroupMembersList({ members, getAvatarSrc }: GroupMembersListProps) {
  if (members.length === 0) return null;

  return (
    <div className="ml-0 sm:ml-[56px] border-l-2 border-border/40 pl-4 py-1 flex flex-col gap-2.5 min-w-0 flex-1">
      <p className="text-[10px] font-black uppercase tracking-[.15em] text-navy/30">Group Members</p>
      <div className="flex flex-wrap gap-x-6 gap-y-3 w-full">
        {members.map((m: any, idx: number) => {
          const mName = m.users?.full_name || m.users?.email || "Member";
          return (
            <div key={idx} className="flex items-center gap-2.5 group/m">
              <StudentAvatar
                name={mName}
                src={getAvatarSrc(m.users?.avatar_url)}
                size="size-7"
              />
              <span className="text-[12px] font-bold text-foreground/70 group-hover/m:text-navy transition-colors truncate max-w-[120px]">
                {mName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  )
}
