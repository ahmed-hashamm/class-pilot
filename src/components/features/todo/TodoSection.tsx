import { ReactNode } from "react";
import { TodoAssignment } from "@/lib/db_data_fetching/todo";
import { TodoItem } from "./TodoItem";

interface TodoSectionProps {
  title: string
  icon: ReactNode
  items: TodoAssignment[]
  emptyIcon: ReactNode
  emptyTitle: string
  emptyDesc: string
  status: 'assigned' | 'missing' | 'done'
  userId: string
  myGroupIds: string[]
}

export function TodoSection({
  title,
  icon,
  items,
  emptyIcon,
  emptyTitle,
  emptyDesc,
  status,
  userId,
  myGroupIds,
}: TodoSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <p className="text-[12px] font-black tracking-[.25em] uppercase text-navy/40
          flex items-center gap-2">
          {icon} <span>{title}</span>
        </p>
        <span className="text-[11px] font-bold bg-navy/5 text-navy/40 px-2 py-0.5 rounded-lg border border-navy/5">
          {items.length} {items.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20
          border-2 border-dashed border-border/40 rounded-3xl bg-white/40 text-center shadow-sm">
          <div className="text-navy/20 mb-2">{emptyIcon}</div>
          <p className="font-black text-[16px] text-navy tracking-tight">{emptyTitle}</p>
          <p className="text-[13px] text-muted-foreground font-medium">{emptyDesc}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((a: TodoAssignment) => (
            <TodoItem
              key={a.id}
              assignment={a}
              status={status}
              userId={userId}
              myGroupIds={myGroupIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}
