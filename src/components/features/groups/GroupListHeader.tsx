"use client"

import { Plus, Users2 } from "lucide-react"
import { PageHeader, FeatureButton } from "@/components/ui"

interface GroupListHeaderProps {
  isTeacher: boolean
  onAddClick: () => void
}

export function GroupListHeader({ isTeacher, onAddClick }: GroupListHeaderProps) {
  const HeaderAction = isTeacher ? (
    <FeatureButton 
      label="New group" 
      icon={Plus} 
      onClick={onAddClick} 
    />
  ) : null;

  return (
    <PageHeader 
      icon={Users2}
      title="Collaboration Groups"
      description="Organize your class into vibrant teams, project pairs, and study groups."
      action={HeaderAction}
    />
  )
}
