"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database, Plus, RefreshCw, X } from "lucide-react";
import { getMaterialsByClass } from "@/lib/db_data_fetching/materials";
import { deleteMaterial } from "@/actions/ClassActions";
import MaterialRow from "./MaterialRow/MaterialRow";
import { Material } from "@/lib/types/schema";
import {
  PageHeader,
  EmptyState,
  SkeletonLoader,
  FeatureButton,
  ConfirmModal
} from "@/components/ui";
import { MaterialUpload } from "@/components/features/feed";
import EditMaterialModal from "./EditMaterialModal";

interface MaterialsListProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function MaterialsList({ classId, isTeacher, userId }: MaterialsListProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading, error, refetch } = useQuery({
    queryKey: ["classMaterials", classId],
    queryFn: async () => {
      const { materials: data, error } = await getMaterialsByClass(classId);
      if (error) throw new Error("Failed to load materials.");
      return (data || []) as Material[];
    },
  });

  const handleDelete = async () => {
    if (!materialToDelete) return;
    setIsDeleting(true);
    try {
      await deleteMaterial(materialToDelete.id, classId);
      refetch();
      await queryClient.invalidateQueries({ queryKey: ["streamFeed", classId] });
      setMaterialToDelete(null);
      toast.success("Material deleted");
    } catch {
      toast.error("Failed to delete material");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSyncForAI = async (materialId: string) => {
    setSyncingId(materialId);
    try {
      const res = await fetch("/api/materials/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Synced for AI (${data.chunks} chunks)`);
        refetch();
      } else {
        toast.error(data.message || "Failed to sync");
      }
    } catch {
      toast.error("Failed to sync material for AI");
    } finally {
      setSyncingId(null);
    }
  };

  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    return fileName.includes("-") ? fileName.split("-").slice(1).join("-") : fileName;
  };

  const HeaderAction = isTeacher ? (
    <FeatureButton
      label={isUploading ? "Close" : "Upload material"}
      icon={isUploading ? X : Plus}
      variant={isUploading ? "outline" : "primary"}
      onClick={() => setIsUploading(!isUploading)}
      className={isUploading ? "bg-muted" : ""}
    />
  ) : null;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10 py-8">
        <SkeletonLoader variant="header" />
        <SkeletonLoader variant="list" count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <PageHeader
          icon={Database}
          title="Class Materials"
          description="Shared documents and resources"
          action={HeaderAction}
        />
        <EmptyState
          icon={RefreshCw}
          title="Error loading materials"
          description="We couldn't load the materials for this class. Please try again."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 py-8">
      <PageHeader
        icon={Database}
        title="Class Materials"
        description="Access lecture notes, project resources, and shared documents."
        action={HeaderAction}
      />

      {isUploading && (
        <div className="bg-white border border-border rounded-3xl p-8 animate-in fade-in slide-in-from-top-2 duration-300 shadow-xl shadow-navy/5">
          <MaterialUpload
            classId={classId}
            userId={userId}
            onSuccess={() => { setIsUploading(false); refetch(); }}
          />
        </div>
      )}

      {materials.length === 0 && !isUploading ? (
        <div className="mt-4">
          <EmptyState
            icon={Database}
            title="No materials yet"
            description={isTeacher
              ? "Upload documents, slides, or files for your students to access."
              : "Your teacher has not uploaded any materials yet."}
            actionLabel={isTeacher ? "Upload first material" : undefined}
            onAction={isTeacher ? () => setIsUploading(true) : undefined}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {materials.map((material, i) => (
            <MaterialRow
              key={material.id}
              material={material}
              isTeacher={isTeacher}
              isLast={i === materials.length - 1}
              syncingId={syncingId}
              onSync={handleSyncForAI}
              onEdit={setEditing}
              onDelete={(id) => {
                const m = materials.find(mat => mat.id === id);
                if (m) setMaterialToDelete(m);
              }}
              getDisplayName={getDisplayName}
            />
          ))}
        </div>
      )}

      {materialToDelete && (
        <ConfirmModal
          isOpen={!!materialToDelete}
          onClose={() => setMaterialToDelete(null)}
          onConfirm={handleDelete}
          title="Delete material?"
          message={`Are you sure you want to delete "${getDisplayName(materialToDelete.attachment_paths?.[0] || "")}"? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          isLoading={isDeleting}
        />
      )}
      {editing && (
        <EditMaterialModal
          material={{
            ...editing,
            classId,
            files: (editing.attachment_paths || []).map((path: string) => ({
              name: getDisplayName(path),
              url: path
            }))
          }}
          onClose={() => setEditing(null)}
          onSuccess={() => { setEditing(null); refetch(); }}
        />
      )}
    </div>
  );
}
