"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getGroupsWithMembers, getAllClassMembers } from "@/lib/db_data_fetching/groups"
import { saveGroup, deleteGroup, removeGroupMember } from "@/actions/ClassActions"
import GroupModal from "./GroupModal"
import { Group } from "@/lib/types/schema"
import { SkeletonLoader, ErrorState, ConfirmModal } from "@/components/ui"
import { GroupListHeader } from "./GroupListHeader"
import { GroupGrid } from "./GroupGrid"

interface GroupListProps {
  classId: string
  isTeacher: boolean
}

export default function GroupList({ classId, isTeacher }: GroupListProps) {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)

  const { data: groups = [], isLoading: loadingGroups, error: errorGroups, refetch: refetchGroups } = useQuery({
    queryKey: ["groups", classId],
    queryFn: async () => {
      const { groups: data, error } = await getGroupsWithMembers(classId)
      if (error) throw new Error(error)
      return (data || []) as Group[]
    },
  })

  const { data: allMembers = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["allClassMembers", classId],
    queryFn: async () => {
      const { members: data, error } = await getAllClassMembers(classId)
      if (error) throw new Error(error)
      return (data || []) as any[]
    },
  })

  const onSave = async (title: string, selectedIds: string[]) => {
    if (!title.trim()) { setLocalError("Group name is required"); return }
    setSubmitting(true)
    try {
      await saveGroup(classId, title, editingGroup?.id, selectedIds)
      queryClient.invalidateQueries({ queryKey: ["groups", classId] })
      setShowModal(false); setEditingGroup(null); setLocalError(null)
      toast.success(editingGroup ? "Group updated" : "Group created")
    } catch (err: any) { setLocalError(err.message || "Failed to save group") } finally { setSubmitting(false) }
  }

  const onDeleteConfirm = async () => {
    if (!groupToDelete) return; setSubmitting(true)
    try {
      await deleteGroup(groupToDelete.id, classId);
      queryClient.invalidateQueries({ queryKey: ["groups", classId] });
      setGroupToDelete(null); toast.success("Group dissolved")
    } catch { toast.error("Error deleting group") } finally { setSubmitting(false) }
  }

  const onRemoveMember = async (groupId: string, userId: string) => {
    try {
      await removeGroupMember(groupId, userId, classId)
      queryClient.invalidateQueries({ queryKey: ["groups", classId] })
      toast.success("Member removed")
    } catch { toast.error("Failed to remove member") }
  }

  if (loadingGroups || loadingMembers) {
    return (
      <div className="flex flex-col gap-10 py-8">
        <SkeletonLoader variant="header" /><SkeletonLoader variant="card" count={4} />
      </div>
    )
  }

  if (errorGroups) return <ErrorState message="Failed to load groups." onRetry={() => refetchGroups()} />

  return (
    <div className="flex flex-col gap-10 py-8">
      <GroupListHeader isTeacher={isTeacher} onAddClick={() => setShowModal(true)} />
      <GroupGrid 
        groups={groups} 
        isTeacher={isTeacher} 
        onEdit={(g) => { setEditingGroup(g); setShowModal(true) }} 
        onDelete={setGroupToDelete} 
        onRemoveMember={onRemoveMember} 
        onAddClick={() => setShowModal(true)} 
      />

      {groupToDelete && (
        <ConfirmModal
          isOpen={!!groupToDelete} onClose={() => setGroupToDelete(null)}
          onConfirm={onDeleteConfirm} title="Dissolve group?" confirmLabel="Dissolve" variant="danger" isLoading={submitting}
          message={`Are you sure you want to dissolve "${groupToDelete.title}"? Members will become unassigned.`}
        />
      )}
      {showModal && (
        <GroupModal
          editingGroup={editingGroup} groups={groups} allMembers={allMembers}
          onClose={() => { setShowModal(false); setEditingGroup(null); setLocalError(null) }}
          onSave={onSave} submitting={submitting} error={localError}
        />
      )}
    </div>
  )
}
