"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FileText, Clock, CheckCircle2, MoreVertical, Pencil, Trash2, Sparkles, Loader2 } from "lucide-react";
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";

interface MaterialRowProps {
  material: any;
  isTeacher: boolean;
  isLast: boolean;
  syncingId: string | null;
  onSync: (id: string) => void;
  onEdit: (material: any) => void;
  onDelete: (id: string) => void;
  getDisplayName: (path: string) => string;
}

export default function MaterialRow({
  material,
  isTeacher,
  isLast,
  syncingId,
  onSync,
  onEdit,
  onDelete,
  getDisplayName,
}: MaterialRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`group flex items-start gap-4 p-5 transition-colors
      hover:bg-secondary/40 ${!isLast ? "border-b border-border" : ""}`}>

      {/* Icon */}
      <div className="shrink-0 size-11 rounded-xl bg-navy/8 border border-navy/15
        flex items-center justify-center group-hover:bg-navy/12 transition-colors">
        <FileText size={18} className="text-navy" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[15px] text-foreground truncate
          group-hover:text-navy transition-colors mb-1">
          {material.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-1 w-full overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <Clock size={11} />
            <span className="hidden sm:inline">
              {format(new Date(material.created_at), "MMM d, yyyy")}
            </span>
            <span className="sm:hidden">
              {format(new Date(material.created_at), "MMM d")}
            </span>
          </div>
          
          <span className="text-border shrink-0">·</span>
          
          <span className="font-medium truncate min-w-0 flex-1 sm:flex-none sm:max-w-none max-w-[100px]">
            {material.users?.full_name || "Teacher"}
          </span>

          {material.ai_synced && (
            <>
              <span className="text-border shrink-0">·</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium shrink-0">
                <CheckCircle2 size={10} />
                <span className="hidden sm:inline">AI synced</span>
              </span>
            </>
          )}
        </div>

        {material.description && (
          <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed mt-2">
            {material.description}
          </p>
        )}

        {/* Attachments */}
        {(material.attachment_paths || material.file_url) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Array.isArray(material.attachment_paths) ? (
              material.attachment_paths.map((path: string) => (
                <AttachmentButton
                  key={path}
                  path={path}
                  type="material"
                  label={getDisplayName(path)}
                />
              ))
            ) : material.file_url ? (
              <AttachmentButton
                path={material.file_url}
                type="material"
                label={getDisplayName(material.file_url)}
              />
            ) : null}
          </div>
        )}
      </div>

      {isTeacher && (
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary
              rounded-lg transition cursor-pointer bg-transparent border-none">
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-50 bg-white border border-border
                rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                <button
                  onClick={() => { setMenuOpen(false); onSync(material.id); }}
                  disabled={syncingId === material.id}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px]
                    font-semibold text-foreground hover:bg-secondary transition-all
                    cursor-pointer bg-transparent border-none text-left disabled:opacity-50">
                  {syncingId === material.id
                    ? <><Loader2 size={13} className="animate-spin text-navy" /> Syncing…</>
                    : <><Sparkles size={13} className="text-navy" /> Sync for AI</>}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onEdit(material); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px]
                    font-semibold text-foreground hover:bg-secondary transition-all
                    cursor-pointer bg-transparent border-none text-left">
                  <Pencil size={13} className="text-navy" /> Edit
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(material.id); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px]
                    font-semibold text-red-500 hover:bg-red-50 transition-all
                    cursor-pointer bg-transparent border-none text-left">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
