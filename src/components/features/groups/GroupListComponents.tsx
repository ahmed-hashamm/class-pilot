"use client";

import { Users2, Plus } from "lucide-react";

export function GroupHeader({
  isTeacher,
  onNewGroup,
}: {
  isTeacher: boolean;
  onNewGroup: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-xl bg-navy flex items-center justify-center">
          <Users2 size={17} className="text-yellow" />
        </div>
        <div>
          <h2 className="font-black text-[18px] tracking-tight">Collaboration Groups</h2>
          <p className="text-[13px] text-muted-foreground">Manage student teams</p>
        </div>
      </div>
      {isTeacher && (
        <button
          onClick={onNewGroup}
          className="inline-flex items-center gap-2 bg-navy text-white font-semibold
            text-[13px] px-5 py-2.5 rounded-xl shadow-sm hover:bg-navy/90
            hover:-translate-y-0.5 transition-all border-none cursor-pointer">
          <Plus size={14} /> New group
        </button>
      )}
    </div>
  );
}

export function GroupEmptyState({
  isTeacher,
  onNewGroup,
}: {
  isTeacher: boolean;
  onNewGroup: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3
      py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
      <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
        flex items-center justify-center">
        <Users2 size={24} className="text-navy/40" />
      </div>
      <p className="font-bold text-[16px] tracking-tight">No groups yet</p>
      <p className="text-[13px] text-muted-foreground max-w-xs leading-relaxed">
        {isTeacher
          ? "Create a group and assign students to collaborate on projects."
          : "Your teacher hasn't created any groups yet."}
      </p>
      {isTeacher && (
        <button
          onClick={onNewGroup}
          className="mt-2 inline-flex items-center gap-2 bg-navy text-white
            font-semibold text-[13px] px-5 py-2.5 rounded-xl
            hover:bg-navy/90 transition border-none cursor-pointer">
          <Plus size={14} /> Create first group
        </button>
      )}
    </div>
  );
}
