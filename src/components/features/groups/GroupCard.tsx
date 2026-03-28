"use client";

import { Pencil, Trash2, UserMinus, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GroupCardProps {
  group: any;
  isTeacher: boolean;
  onEdit: (group: any) => void;
  onDelete: (group: any) => void;
  onRemoveMember: (groupId: string, userId: string) => void;
}

export default function GroupCard({
  group,
  isTeacher,
  onEdit,
  onDelete,
  onRemoveMember,
}: GroupCardProps) {
  const getProfile = (profiles: any) => (Array.isArray(profiles) ? profiles[0] : profiles);

  return (
    <div className="group relative flex flex-col bg-white border border-border rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1">
      {/* Visual Accent */}
      <div className="absolute left-0 top-8 bottom-8 w-1 bg-navy/10 rounded-r-full group-hover:bg-navy transition-colors" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:px-8 border-b border-secondary/50 bg-secondary/10">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-navy flex items-center justify-center text-yellow shadow-lg shadow-navy/10 shrink-0">
            <Users size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-black text-[18px] text-foreground tracking-tight group-hover:text-navy transition-colors">{group.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              {/* <span className="text-[10px] font-black uppercase tracking-widest text-navy/40">Collaborative Team</span> */}
              <span className="text-border">·</span>
              <span className="text-[10px] font-bold text-muted-foreground/60">{group.project_members?.length || 0} Members</span>
            </div>
          </div>
        </div>

        {isTeacher && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(group)}
              className="inline-flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest text-navy bg-white border border-border rounded-xl hover:bg-navy hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={() => onDelete(group)}
              className="inline-flex items-center justify-center size-9 text-red-500 bg-white border border-border rounded-xl hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Members Area */}
      <div className="px-6 pt-4 pb-8 sm:px-8 sm:pt-6 sm:pb-10">
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-navy/30 pl-1">Members</p>

          {!group.project_members || group.project_members.length === 0 ? (
            <div className="py-8 px-4 border-2 border-dashed border-secondary rounded-2xl flex flex-col items-center justify-center bg-secondary/5">
              <p className="text-[12px] text-muted-foreground font-medium italic">No members assigned to this team yet</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {group.project_members.map((m: any) => {
                const profile = getProfile(m.profiles);
                const name = profile?.full_name || "Unknown";
                return (
                  <div key={m.user_id} className="group/member flex items-center justify-between pl-3 pr-2 py-2 rounded-2xl bg-secondary/30 border border-transparent hover:border-navy/10 hover:bg-white hover:shadow-lg hover:shadow-navy/5 transition-all min-w-[220px] flex-1">
                    <div className="flex items-center gap-3">
                      <StudentAvatar
                        name={name}
                        src={profile?.avatar_url}
                        initial={name.charAt(0).toUpperCase()}
                      />
                      <span className="text-[13px] font-black text-foreground group-hover/member:text-navy transition-colors">{name}</span>
                    </div>
                    {isTeacher && (
                      <button
                        onClick={() => onRemoveMember(group.id, m.user_id)}
                        title="Remove member"
                        className="p-2 text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer bg-transparent border-none"
                      >
                        <UserMinus size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudentAvatar({ name, src, initial }: { name: string; src?: string; initial: string }) {
  const [imgError, setImgError] = useState(false);
  const avatarSrc = src?.startsWith('http') ? src : src ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${src}` : null;

  return (
    <div className="shrink-0 size-8 rounded-xl bg-navy text-yellow flex items-center justify-center text-[11px] font-black border border-white/10 shadow-inner relative overflow-hidden">
      {avatarSrc && !imgError ? (
        <Image
          src={avatarSrc}
          alt={name}
          fill
          sizes="32px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : initial}
    </div>
  );
}
