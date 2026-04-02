"use client"

import { useState, useMemo } from "react"
import { Search, AlertCircle } from "lucide-react"
import { Group, BaseUser } from "@/lib/types/schema"
import { GroupModalHeader } from "./GroupModalHeader"
import { GroupModalFooter } from "./GroupModalFooter"
import { GroupMemberSelectItem } from "./GroupMemberSelectItem"

interface GroupModalProps {
  editingGroup: Group | null
  groups: Group[]
  allMembers: { user_id: string; role: string; users: BaseUser | null }[]
  onClose: () => void
  onSave: (title: string, selectedIds: string[]) => void
  submitting: boolean
  error?: string | null
}

export default function GroupModal({
  editingGroup,
  groups,
  allMembers,
  onClose,
  onSave,
  submitting,
  error,
}: GroupModalProps) {
  const [title, setTitle] = useState(editingGroup?.title || "")
  const [selectedIds, setSelectedIds] = useState<string[]>(
    editingGroup?.project_members?.map((m: { user_id: string }) => m.user_id) || []
  )
  const [searchQuery, setSearchQuery] = useState("")

  const alreadyAssignedIds = useMemo(() => {
    const ids = new Set<string>()
    groups.forEach(g => {
      if (!editingGroup || g.id !== editingGroup.id) {
        g.project_members?.forEach((m: { user_id: string }) => {
          if (m.user_id) ids.add(m.user_id);
        })
      }
    })
    return ids
  }, [groups, editingGroup])

  const filteredMembers = useMemo(() => {
    return allMembers
      .filter((m) => m.role !== "teacher" && m.role !== "owner")
      .filter((m) =>
        (m.users?.full_name || "Unknown").toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [allMembers, searchQuery])

  const handleToggle = (id: string, isAssignedElsewhere: boolean) => {
    if (isAssignedElsewhere) return
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
        
        <GroupModalHeader editingGroup={editingGroup} onClose={onClose} />

        <div className="p-6 flex flex-col gap-6">
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-600 text-[13px] font-bold px-4 py-3.5 rounded-2xl">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-2 text-left">
            <label className="text-[11px] font-black tracking-[.2em] uppercase text-navy/40 pl-1">Team Name</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Team Alpha"
              className="w-full px-4 py-3.5 bg-secondary/40 border border-border rounded-2xl text-[14px] font-bold focus:ring-4 focus:ring-navy/5 focus:border-navy outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-black tracking-[.2em] uppercase text-navy/40">Assign Students</label>
              {selectedIds.length > 0 && (
                <span className="text-[10px] font-black text-navy bg-yellow border border-yellow/20 rounded-full px-2.5 py-0.5 shadow-sm">
                  {selectedIds.length} SELECTED
                </span>
              )}
            </div>
            
            <div className="relative group">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-navy transition-colors" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students…"
                className="w-full pl-10 pr-4 py-3 bg-secondary/40 border border-border rounded-2xl text-[13px] font-semibold outline-none focus:border-navy transition"
              />
            </div>

            <div className="max-h-60 overflow-y-auto flex flex-col gap-1.5 pr-1 custom-scrollbar">
              {filteredMembers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                  <Search size={24} className="mb-2" />
                  <p className="text-[13px] font-bold italic">No students found</p>
                </div>
              ) : (
                filteredMembers.map((s) => (
                  <GroupMemberSelectItem
                    key={s.user_id}
                    user={s}
                    isSelected={selectedIds.includes(s.user_id)}
                    isAssignedElsewhere={alreadyAssignedIds.has(s.user_id)}
                    onToggle={handleToggle}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <GroupModalFooter 
          onCancel={onClose} 
          onSave={() => onSave(title, selectedIds)} 
          submitting={submitting} 
          isEditing={!!editingGroup} 
        />
      </div>
    </div>
  )
}
