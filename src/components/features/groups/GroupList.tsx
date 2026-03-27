"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getGroupsWithMembers, getAllClassMembers } from "@/lib/db_data_fetching/groups";
import { saveGroup, deleteGroup, removeGroupMember } from "@/actions/ClassActions";
import GroupCard from "./GroupCard";
import GroupModal from "./GroupModal";
import { 
  PageHeader, 
  EmptyState, 
  SkeletonLoader, 
  FeatureButton,
  ErrorState,
  ConfirmModal 
} from "@/components/ui";
import { Users2, Plus } from "lucide-react";

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
  const [groupToDelete, setGroupToDelete] = useState<any>(null);

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

  const handleDelete = async () => {
    if (!groupToDelete) return;
    setSubmitting(true);
    try {
      await deleteGroup(groupToDelete.id, classId);
      queryClient.invalidateQueries({ queryKey: ["groups", classId] });
      setGroupToDelete(null);
      toast.success("Group dissolved");
    } catch {
      toast.error("Error deleting group");
    } finally {
      setSubmitting(false);
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

  const HeaderAction = isTeacher ? (
    <FeatureButton 
      label="New group" 
      icon={Plus} 
      onClick={() => setShowModal(true)} 
    />
  ) : null;
 
   return (
     <div className="flex flex-col gap-6 py-6">
      <PageHeader 
        icon={Users2}
        title="Collaboration Groups"
        description="Manage student teams and project pairs"
        action={HeaderAction}
      />

      {groups.length === 0 ? (
        <EmptyState 
          icon={Users2}
          title="No groups yet"
          description={isTeacher 
            ? "Create a group and assign students to collaborate on projects." 
            : "Your teacher hasn't created any groups yet."}
          actionLabel={isTeacher ? "Create first group" : undefined}
          onAction={isTeacher ? () => setShowModal(true) : undefined}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              isTeacher={isTeacher}
              onEdit={openEdit}
              onDelete={() => setGroupToDelete(group)}
              onRemoveMember={handleRemoveMember}
            />
          ))}
        </div>
      )}

      {groupToDelete && (
        <ConfirmModal
          isOpen={!!groupToDelete}
          onClose={() => setGroupToDelete(null)}
          onConfirm={handleDelete}
          title="Dissolve group?"
          message={`Are you sure you want to dissolve "${groupToDelete.title}"? Members will become unassigned.`}
          confirmLabel="Dissolve"
          variant="danger"
          isLoading={submitting}
        />
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
