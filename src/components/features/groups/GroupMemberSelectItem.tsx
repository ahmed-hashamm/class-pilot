"use client"

import { Check, Plus, UserX } from "lucide-react"
import StudentAvatar from "./GroupCard/StudentAvatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GroupMemberSelectItemProps {
  user: any
  isSelected: boolean
  isAssignedElsewhere: boolean
  onToggle: (id: string, isAssignedElsewhere: boolean) => void
}

export function GroupMemberSelectItem({
  user,
  isSelected,
  isAssignedElsewhere,
  onToggle
}: GroupMemberSelectItemProps) {
  const name = user.users?.full_name || user.users?.email || "Unknown"

  return (
    <Button
      variant="ghost"
      onClick={() => onToggle(user.user_id, isAssignedElsewhere)}
      disabled={isAssignedElsewhere}
      className={cn(
        "w-full h-auto flex items-center justify-between px-3.5 py-2.5 rounded-2xl border-2 text-[13px] font-bold transition-all group/item",
        isSelected
          ? "bg-navy text-white border-navy shadow-md shadow-navy/10 hover:bg-navy/90 hover:text-white"
          : isAssignedElsewhere
            ? "bg-secondary/20 border-border/10 text-muted-foreground/40 cursor-not-allowed opacity-50"
            : "bg-white border-border/50 hover:bg-secondary/50 hover:border-border text-foreground hover:text-navy"
      )}
    >
      <div className="flex items-center gap-3">
        <StudentAvatar
          name={name}
          src={user.users?.avatar_url}
          className={`size-8 ${isSelected ? 'border-white/20' : ''}`}
        />
        <div className="flex flex-col items-start gap-0.5">
          <span className={isSelected ? "text-white" : "text-foreground group-hover/item:text-navy"}>
            {name}
          </span>
          {isAssignedElsewhere && (
            <span className="text-[10px] font-black uppercase tracking-tight text-muted-foreground/40">Already in a group</span>
          )}
        </div>
      </div>
      <div className={`size-5 rounded-lg flex items-center justify-center transition-all
        ${isSelected
          ? "bg-white/20 text-white"
          : isAssignedElsewhere
            ? "bg-transparent text-muted-foreground/20"
            : "bg-secondary text-muted-foreground/30 group-hover/item:bg-navy/10"}`}>
        {isSelected ? <Check size={12} /> : isAssignedElsewhere ? <UserX size={12} /> : <Plus size={12} />}
      </div>
    </Button>
  )
}
