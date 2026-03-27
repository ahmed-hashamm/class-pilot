"use client";

import { Users2, Pencil, Trash2, UserMinus } from "lucide-react";

interface GroupCardProps {
  group: any;
  isTeacher: boolean;
  onEdit: (group: any) => void;
  onDelete: (id: string) => void;
  onRemoveMember: (groupId: string, userId: string) => void;
}

export default function GroupCard({
  group,
  isTeacher,
  onEdit,
  onDelete,
  onRemoveMember,
}: GroupCardProps) {
  const getName = (profiles: any) =>
    (Array.isArray(profiles) ? profiles[0] : profiles)?.full_name ?? "Unknown";

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-sm transition-all">
      <div className="flex flex-col md:flex-row">
        {/* Left panel */}
        <div className="md:w-56 shrink-0 p-5 bg-secondary/50 border-b md:border-b-0 md:border-r border-border flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-navy/8 border border-navy/15 flex items-center justify-center">
              <Users2 size={14} className="text-navy" />
            </div>
            <h3 className="font-bold text-[14px] text-foreground truncate">
              {group.title}
            </h3>
          </div>

          <span className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">
            {group.project_members.length} member{group.project_members.length !== 1 ? "s" : ""}
          </span>

          {isTeacher && (
            <div className="flex gap-2 mt-auto pt-1">
              <button
                onClick={() => onEdit(group)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px]
                  font-semibold px-3 py-1.5 bg-white border border-border rounded-lg
                  text-foreground hover:text-navy hover:border-navy/30 transition cursor-pointer"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => onDelete(group.id)}
                className="px-3 py-1.5 bg-white border border-border rounded-lg
                  text-muted-foreground hover:text-red-500 hover:border-red-200 transition cursor-pointer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Right panel — members */}
        <div className="flex-1 p-5">
          {group.project_members.length === 0 ? (
            <p className="text-[12px] text-muted-foreground italic py-2">
              No members assigned yet
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {group.project_members.map((m: any) => (
                <div key={m.user_id} className="group/member flex items-center justify-between px-3 py-2 rounded-xl hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-lg bg-navy/8 border border-navy/15 flex items-center justify-center text-[11px] font-black text-navy">
                      {getName(m.profiles).charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[13px] font-medium text-foreground">
                      {getName(m.profiles)}
                    </span>
                  </div>
                  {isTeacher && (
                    <button
                      onClick={() => onRemoveMember(group.id, m.user_id)}
                      className="opacity-0 group-hover/member:opacity-100 text-muted-foreground/40 hover:text-red-500 transition-all cursor-pointer bg-transparent border-none"
                    >
                      <UserMinus size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
