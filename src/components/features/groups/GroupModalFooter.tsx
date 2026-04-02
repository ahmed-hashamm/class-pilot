"use client"

import { Loader2 } from "lucide-react"

interface GroupModalFooterProps {
  onCancel: () => void
  onSave: () => void
  submitting: boolean
  isEditing: boolean
}

export function GroupModalFooter({
  onCancel,
  onSave,
  submitting,
  isEditing
}: GroupModalFooterProps) {
  return (
    <div className="p-6 pt-2 flex gap-3 bg-secondary/10 border-t border-border">
      <button 
        onClick={onCancel} 
        className="flex-1 py-3.5 text-muted-foreground font-black text-[12px] uppercase tracking-widest hover:bg-secondary rounded-2xl transition cursor-pointer bg-transparent border-none"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={submitting}
        className="flex-1 bg-navy text-white font-black text-[12px] uppercase tracking-widest py-3.5 rounded-2xl shadow-xl shadow-navy/20 hover:bg-navy/90 hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all flex items-center justify-center border-none cursor-pointer"
      >
        {submitting ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          isEditing ? "Update" : "Create"
        )}
      </button>
    </div>
  )
}
