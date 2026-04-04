"use client";

import { Material } from "@/lib/types/schema";
import { getFileIcon } from "@/lib/utils/fileIcons";
import { CheckCircle2, Clock, User, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const isSyncing = syncingId === material.id;
  const firstFilePath = material.attachment_paths?.[0] || material.file_url || "";
  const fileInfo = getFileIcon(firstFilePath);

  return (
    <div className="group relative z-0 bg-white border border-navy/[0.08] rounded-[24px] transition-all duration-500
      hover:-translate-y-2 shadow-[0_8px_30px_rgb(20,30,60,0.04),0_4px_8px_rgb(20,30,60,0.02)] 
      hover:shadow-[0_20px_40px_rgba(20,30,60,0.1),0_10px_20px_rgba(20,30,60,0.05)] active:scale-[0.99] flex flex-col min-h-[140px]">

      <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full gap-4">
        {/* Header Block */}
        <div className="flex items-start justify-between gap-4 w-full">
          <div className="flex flex-col gap-1.5 flex-1">
            <h3 className="font-black text-[18px] sm:text-[20px] text-foreground tracking-tighter leading-tight group-hover:text-navy transition-colors">
              {material.title}
            </h3>
            
            {/* Posted Date Info */}
            <div className="flex items-center gap-1.5 text-muted-foreground/40 text-[11px] font-medium italic">
              <Clock size={11} className="shrink-0 opacity-50" />
              <span>Posted {material.created_at ? format(new Date(material.created_at), "MMM d") : "Recently"}</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 z-10">
            {material.ai_synced && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                <CheckCircle2 size={10} className="shrink-0" />
                <span>Synced</span>
              </div>
            )}
            
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

        {/* Body Content - Expandable */}
        {material.description && (
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer group/desc"
          >
            <p className={`text-[14px] leading-relaxed text-muted-foreground/60 tracking-tight transition-all duration-300 ${!isExpanded ? 'line-clamp-1' : ''}`}>
              {material.description}
            </p>
            <button className="mt-1 flex items-center gap-1 text-[10px] font-bold text-navy/40 group-hover/desc:text-navy transition-colors">
              {isExpanded ? (
                <><ChevronUp size={15} /></>
              ) : (
                <><ChevronDown size={15} /></>
              )}
            </button>
          </div>
        )}

        <hr className="border-navy/15 mt-2" />

        {/* Footer */}
        <div className="mt-auto">
          <MaterialFooter material={material} getDisplayName={getDisplayName} />
        </div>
      </div>
    </div>
  );
}
