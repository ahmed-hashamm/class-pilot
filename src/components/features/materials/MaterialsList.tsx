"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database, RefreshCw } from "lucide-react";
import { getMaterialsByClass } from "@/lib/db_data_fetching/materials";
import { deleteMaterial } from "@/actions/ClassActions";
import MaterialRow from "./MaterialRow";
import {
  MaterialsHeader,
  MaterialsEmptyState,
  MaterialsLoadingSkeleton
} from "./MaterialsListComponents";
import MaterialUpload from "@/components/features/classes/Feed/MaterialUpload";
import EditMaterialModal from "@/components/features/classes/ContentTabs/EditMaterialModal";

interface MaterialsListProps {
  classId: string;
  isTeacher: boolean;
  userId: string;
}

export default function MaterialsList({ classId, isTeacher, userId }: MaterialsListProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const { data: materials = [], isLoading, error, refetch } = useQuery({
    queryKey: ["classMaterials", classId],
    queryFn: async () => {
      const { materials: data, error } = await getMaterialsByClass(classId);
      if (error) throw new Error("Failed to load materials.");
      return (data || []) as any[];
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this material? This cannot be undone.")) return;
    try {
      await deleteMaterial(id, classId);
      refetch();
      toast.success("Material deleted");
    } catch {
      toast.error("Failed to delete material");
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

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 py-6">
        <MaterialsHeader isTeacher={isTeacher} isUploading={false} onToggleUpload={() => {}} />
        <MaterialsLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col py-16 gap-4 items-center justify-center border-2 border-dashed border-border rounded-2xl bg-white text-center">
         <Database size={32} className="text-muted-foreground/40" />
         <p className="text-[14px] font-medium text-muted-foreground">Error loading materials</p>
         <button onClick={() => refetch()} className="inline-flex items-center gap-2 bg-navy text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl border-none cursor-pointer">
           <RefreshCw size={14} /> Retry
         </button>
       </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <MaterialsHeader
        isTeacher={isTeacher}
        isUploading={isUploading}
        onToggleUpload={() => setIsUploading(!isUploading)}
      />

      {isUploading && (
        <div className="bg-white border border-border rounded-2xl p-5 animate-in fade-in slide-in-from-top-1 duration-200">
          <MaterialUpload
            classId={classId}
            userId={userId}
            onSuccess={() => { setIsUploading(false); refetch(); }}
          />
        </div>
      )}

      {materials.length === 0 && !isUploading ? (
        <MaterialsEmptyState isTeacher={isTeacher} onToggleUpload={() => setIsUploading(true)} />
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
          {materials.map((material, i) => (
            <MaterialRow
              key={material.id}
              material={material}
              isTeacher={isTeacher}
              isLast={i === materials.length - 1}
              syncingId={syncingId}
              onSync={handleSyncForAI}
              onEdit={setEditing}
              onDelete={handleDelete}
              getDisplayName={getDisplayName}
            />
          ))}
        </div>
      )}

      {editing && (
        <EditMaterialModal
          material={{ ...editing, classId, files: editing.attachment_paths || [] }}
          onClose={() => setEditing(null)}
          onSuccess={() => { setEditing(null); refetch(); }}
        />
      )}
    </div>
  );
}
