"use client";

import { Material } from "@/lib/types/schema";
import { getFileIcon } from "@/lib/utils/fileIcons";
import { CheckCircle2, Clock, User } from "lucide-react";
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
    <div className="group relative z-0 hover:z-10 focus-within:z-10 flex items-start gap-3.5 p-4 sm:p-5 bg-white border border-border rounded-2xl transition-all duration-300
      hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1 active:scale-[0.99]">

      {/* Visual Accent */}
      <div className="absolute left-0 top-4 bottom-4 w-1 bg-navy/10 rounded-r-full group-hover:bg-navy transition-colors" />

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

        <div className="flex flex-col mt-0.5">
          {/* Metadata Row */}
          <div className="flex items-center text-[12px] text-muted-foreground font-semibold h-5">
            <div className="flex items-center gap-1.5 shrink-0">
              <Clock size={12} className="opacity-40 shrink-0" />
              <span>{material.created_at ? format(new Date(material.created_at), "MMM d, yyyy") : "No date"}</span>
            </div>

            {material.ai_synced && (
              <>
                <span className="text-border font-extrabold mx-1.5 shrink-0">·</span>
                <div className="flex items-center text-emerald-600 shrink-0" title="AI Synced">
                  <CheckCircle2 size={12} className="opacity-80 shrink-0" />
                </div>
              </>
            )}

            <span className="hidden sm:inline text-border font-extrabold mx-1.5">·</span>
            <span className="hidden sm:inline text-muted-foreground/70 truncate max-w-[150px]">
              {material.users?.full_name || "Teacher"}
            </span>
          </div>

          {/* Teacher Section - Mobile Only */}
          <div className="sm:hidden flex items-center gap-1.5 text-muted-foreground/60 text-[11px] font-bold uppercase tracking-wide mt-1">
            <User size={10} className="shrink-0 opacity-40" />
            <span className="truncate max-w-[150px]">{material.users?.full_name || "Teacher"}</span>
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
