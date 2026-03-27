"use client";

import SidebarCard from "./Sidebar";

interface DueSoonCardProps {
  assignments: { id: string; title: string; due_date: string | null }[];
}

export default function DueSoonCard({ assignments }: DueSoonCardProps) {
  const dueSoon = assignments
    .filter((a) => a.due_date && new Date(a.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  return (
    <SidebarCard title="Due Soon">
      {dueSoon.length === 0 ? (
        <div className="flex items-center gap-2 py-1">
          <span className="text-[16px]">🎉</span>
          <p className="text-[12px] text-muted-foreground font-medium">
            Nothing due — all clear!
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {dueSoon.map((a: any) => (
            <li key={a.id}
              className="flex items-center justify-between gap-2
                 border border-border/60 rounded-lg px-3 py-2">
              <span className="text-[11px] font-medium text-foreground truncate">
                {a.title}
              </span>
              <span className="shrink-0 text-[10px] text-muted-foreground font-medium">
                {new Date(a.due_date!).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SidebarCard>
  );
}
