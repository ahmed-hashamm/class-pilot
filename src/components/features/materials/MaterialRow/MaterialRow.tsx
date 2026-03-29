"use client";

import { Material } from "@/lib/types/schema";
import { getFileIcon } from "@/lib/utils/fileIcons";
import { CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import MaterialIcon from "./MaterialIcon";
import MaterialActions from "./MaterialActions";
import MaterialFooter from "./MaterialFooter";

interface MaterialRowProps {
  material: Material;
  isTeacher: boolean;
  isLast?: boolean;
  syncingId: string | null;
  onSync: (id: string) => void;
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  getDisplayName: (path: string) => string;
}

export default function MaterialRow({
  material,
  isTeacher,
  syncingId,
  onSync,
  onEdit,
  onDelete,
  getDisplayName,
}: MaterialRowProps) {
  const isSyncing = syncingId === material.id;
  const firstFilePath = material.attachment_paths?.[0] || material.file_url || "";
  const fileInfo = getFileIcon(firstFilePath);

  return (
    <div className="group relative flex items-start gap-4 p-6 bg-white border border-border rounded-2xl transition-all duration-300
      hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1 active:scale-[0.99]">

      {/* Visual Accent */}
      <div className="absolute left-0 top-6 bottom-6 w-1 bg-navy/10 rounded-r-full group-hover:bg-navy transition-colors" />

      <MaterialIcon fileInfo={fileInfo} />

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center justify-between gap-3 mb-1 w-full">
          <h3 className="font-black text-[16px] text-foreground flex-1 break-all overflow-hidden group-hover:text-navy transition-colors tracking-tight leading-tight">
            {material.title}
          </h3>

          <div className="shrink-0">
            {isTeacher && (
              <MaterialActions
                material={material}
                isSyncing={isSyncing}
                onSync={onSync}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 mt-0.5">
          {/* Metadata Row */}
          <div className="flex items-center text-[12px] text-muted-foreground font-semibold">
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="opacity-40" />
              <span>{material.created_at ? format(new Date(material.created_at), "MMM d, yyyy") : "No date"}</span>
            </div>

            <div className="flex flex-row items-center">
              <span className="text-border font-extrabold hidden sm:inline ml-1.5">·</span>

              {material.ai_synced && (
                <div className="flex items-center text-emerald-600 ml-1.5 sm:ml-1.5" title="AI Synced">
                  <CheckCircle2 size={12} className="opacity-80" />
                </div>
              )}

              <span className="sm:hidden text-border font-extrabold ml-1.5">·</span>
              <div className="flex items-center gap-1.5 ml-1.5">
                <span className="sm:hidden font-medium text-muted-foreground/70 truncate max-w-[150px]">
                  {material.users?.full_name || "Teacher"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {material.description && (
          <p className="text-[13px] text-muted-foreground/70 line-clamp-2 leading-relaxed mt-3 break-all overflow-hidden max-w-2xl">
            {material.description}
          </p>
        )}

        <MaterialFooter material={material} getDisplayName={getDisplayName} />
      </div>
    </div>
  );
}
