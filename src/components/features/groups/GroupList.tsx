"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGroupsWithMembers, getAllClassMembers } from "@/lib/db_data_fetching/groups";
import { saveGroup, deleteGroup, removeGroupMember } from "@/actions/ClassActions";
import GroupCard from "./GroupCard";
import GroupModal from "./GroupModal";
import { GroupHeader, GroupEmptyState } from "./GroupListComponents";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { ErrorState } from "@/components/ui/ErrorState";

interface GroupListProps {
  classId: string;
  isTeacher: boolean;
}

export default function GroupList({ classId, isTeacher }: GroupListProps) {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { data: groups = [], isLoading: loadingGroups, error: errorGroups, refetch: refetchGroups } = useQuery({
    queryKey: ["groups", classId],
    queryFn: async () => {
      const { groups: data, error } = await getGroupsWithMembers(classId);
      if (error) throw new Error(error);
      return (data || []) as any[];
    },
  });

  const { data: allMembers = [], isLoading: loadingMembers } = useQuery({
    queryKey: ["allClassMembers", classId],
    queryFn: async () => {
      const { members: data, error } = await getAllClassMembers(classId);
      if (error) throw new Error(error);
      return (data || []) as any[];
    },
  });

  const handleSave = async (title: string, selectedIds: string[]) => {
    if (!title.trim()) { setLocalError("Group name is required"); return; }
    setSubmitting(true);
    setLocalError(null);
    try {
      await saveGroup(classId, title, editingGroup?.id, selectedIds);
      queryClient.invalidateQueries({ queryKey: ["groups", classId] });
      closeModal();
      toast.success(editingGroup ? "Group updated" : "Group created");
    } catch (err: any) {
      setLocalError(err.message || "Failed to save group");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Dissolve this group? Members will become unassigned.")) return;
    try {
      await deleteGroup(id, classId);
      queryClient.invalidateQueries({ queryKey: ["groups", classId] });
      toast.success("Group dissolved");
    } catch {
      toast.error("Error deleting group");
    }
  };

  const handleRemoveMember = async (groupId: string, userId: string) => {
    try {
      await removeGroupMember(groupId, userId, classId);
      queryClient.invalidateQueries({ queryKey: ["groups", classId] });
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
    }
  };

  const openEdit = (group: any) => {
    setEditingGroup(group);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGroup(null);
    setLocalError(null);
  };

  if (loadingGroups || loadingMembers) {
    return <div className="py-6"><SkeletonLoader variant="list" count={3} /></div>;
  }

  if (errorGroups) {
     return <ErrorState message="Failed to load groups." onRetry={() => refetchGroups()} />;
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <GroupHeader isTeacher={isTeacher} onNewGroup={() => setShowModal(true)} />

      {groups.length === 0 ? (
        <GroupEmptyState isTeacher={isTeacher} onNewGroup={() => setShowModal(true)} />
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isTeacher={isTeacher}
              onEdit={openEdit}
              onDelete={handleDelete}
              onRemoveMember={handleRemoveMember}
            />
          ))}
        </div>
      )}

      {showModal && (
        <GroupModal
          editingGroup={editingGroup}
          allMembers={allMembers}
          onClose={closeModal}
          onSave={handleSave}
          submitting={submitting}
          error={localError}
        />
      )}
    </div>
  );
}
