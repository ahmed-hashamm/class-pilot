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
  hideHeader?: boolean
  externalModal?: boolean
  onCloseModal?: (val: boolean) => void
}

export default function GroupList({ classId, isTeacher, hideHeader = false, externalModal, onCloseModal }: GroupListProps) {
  const queryClient = useQueryClient()
  const [internalModal, setInternalModal] = useState(false)
  const showModal = externalModal ?? internalModal;
  const setShowModal = (val: boolean) => {
    if (onCloseModal) onCloseModal(val);
    setInternalModal(val);
  }
  const [editingGroup, setEditingGroup] = useState<Group | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null)

  const {
    data: groups = [],
    isLoading: loadingGroups,
    isFetching: fetchingGroups,
    error: errorGroups,
    refetch: refetchGroups,
  } = useQuery({
    queryKey: ["groups", classId],
    queryFn: async () => {
      const { groups: data, error } = await getGroupsWithMembers(classId)
      if (error) throw new Error(error)
      return (data || []) as Group[]
    },
    retry: 2,
    staleTime: 30 * 1000,
  })

  const {
    data: allMembers = [],
    isLoading: loadingMembers,
    error: errorMembers,
    refetch: refetchMembers,
  } = useQuery({
    queryKey: ["allClassMembers", classId],
    queryFn: async () => {
      const { members: data, error } = await getAllClassMembers(classId)
      if (error) throw new Error(error)
      return (data || []) as any[]
    },
    retry: 2,
    staleTime: 30 * 1000,
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

  // Show loading skeleton only on initial load, not on background refetch
  if (loadingGroups || loadingMembers) {
    return (
      <div className="flex flex-col gap-10 py-8">
        <SkeletonLoader variant="header" />
        <SkeletonLoader variant="card" count={4} />
      </div>
    )
  }

  // Handle errors for both queries with retry
  if (errorGroups || errorMembers) {
    const message = errorGroups
      ? "Failed to load groups."
      : "Failed to load class members."
    return (
      <ErrorState
        message={message}
        onRetry={() => {
          if (errorGroups) refetchGroups()
          if (errorMembers) refetchMembers()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-10 py-8">
      {!hideHeader && (
        <GroupListHeader isTeacher={isTeacher} onAddClick={() => setShowModal(true)} />
      )}
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
          key={editingGroup?.id || "new"}
          editingGroup={editingGroup} groups={groups} allMembers={allMembers}
          onClose={() => { setShowModal(false); setEditingGroup(null); setLocalError(null) }}
          onSave={onSave} submitting={submitting} error={localError}
        />
      )}
    </div>
  )
}
