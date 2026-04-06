"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GroupModalHeaderProps {
  editingGroup: any
  onClose: () => void
}

export function GroupModalHeader({ editingGroup, onClose }: GroupModalHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-secondary/20">
      <div className="text-left">
        <h3 className="font-black text-[18px] tracking-tight text-foreground">
          {editingGroup ? "Update Group" : "Create New Group"}
        </h3>
        <p className="text-[11px] text-muted-foreground font-medium">Assignment collaboration team</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="p-2 h-auto w-auto"
      >
        <X size={18} />
      </Button>
    </div>
  )
}
