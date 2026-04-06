"use client"

import GroupCard from "./GroupCard/GroupCard"
import { Group } from "@/lib/types/schema"
import { EmptyState } from "@/components/ui"
import { Users2 } from "lucide-react"

interface GroupGridProps {
  groups: Group[]
  isTeacher: boolean
  onEdit: (group: Group) => void
  onDelete: (group: Group) => void
  onRemoveMember: (groupId: string, userId: string) => void
  onAddClick: () => void
}

export function GroupGrid({
  groups,
  isTeacher,
  onEdit,
  onDelete,
  onRemoveMember,
  onAddClick
}: GroupGridProps) {
  if (groups.length === 0) {
    return (
      <div className="mt-4">
        <EmptyState
          icon={Users2}
          title="No groups yet"
          description={isTeacher
            ? "Create a group and assign students to collaborate on projects."
            : "Your teacher hasn't created any groups yet."}
          actionLabel={isTeacher ? "Create first group" : undefined}
          onAction={isTeacher ? onAddClick : undefined}
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          isTeacher={isTeacher}
          onEdit={onEdit}
          onDelete={() => onDelete(group)}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </div>
  )
}
