"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  FileText,
  Clock,
  MoreVertical,
  Pencil,
  Trash2,
  Sparkles,
  Loader2,
  FileCode,
  FileImage,
  Globe,
  File,
  CheckCircle2,
  User
} from "lucide-react";
import Image from "next/image";
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
  const [imgError, setImgError] = useState(false);
  const isSyncing = syncingId === material.id;
  const teacher = material.users;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' };
    if (['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext || '')) return { icon: FileImage, color: 'text-purple-500', bg: 'bg-purple-50' };
    if (['js', 'ts', 'tsx', 'py', 'json', 'html', 'css'].includes(ext || '')) return { icon: FileCode, color: 'text-orange-500', bg: 'bg-orange-50' };
    if (fileName.startsWith('http')) return { icon: Globe, color: 'text-emerald-500', bg: 'bg-emerald-50' };
    return { icon: File, color: 'text-navy', bg: 'bg-secondary' };
  };

  const firstFilePath = material.attachment_paths?.[0] || material.file_url || "";
  const fileInfo = getFileIcon(firstFilePath);
  const Icon = fileInfo.icon;

  return (
    <div className={`group relative flex items-start gap-4 p-6 bg-white border border-border rounded-2xl transition-all duration-300
      hover:shadow-xl hover:shadow-navy/5 hover:-translate-y-1 active:scale-[0.99]`}>

      {/* Visual Accent */}
      <div className="absolute left-0 top-6 bottom-6 w-1 bg-navy/10 rounded-r-full group-hover:bg-navy transition-colors" />

      {/* Icon Box */}
      <div className={`shrink-0 size-12 rounded-xl flex items-center justify-center border border-transparent transition-all
        ${fileInfo.bg} ${fileInfo.color} group-hover:shadow-inner`}>
        <Icon size={22} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <h3 className="font-black text-[16px] text-foreground break-words
              group-hover:text-navy transition-colors tracking-tight line-clamp-2">
              {material.title}
            </h3>
          </div>

          {/* Actions & Status - Desktop & Mobile aligned */}
          <div className="flex items-center gap-1 shrink-0">
            {material.ai_synced && (
              <div className="flex items-center gap-1.5 sm:px-2 sm:py-0.5 sm:rounded-full sm:bg-emerald-50 sm:border sm:border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-wider ">
                <CheckCircle2 size={12} className="sm:size-2.5" />
                <span className="hidden sm:inline">AI Synced</span>
              </div>
            )}

            {isTeacher && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-1 text-muted-foreground hover:text-navy hover:bg-secondary
                    rounded-lg transition-all cursor-pointer bg-transparent border-none">
                  {isSyncing ? <Loader2 size={16} className="animate-spin" /> : <MoreVertical size={18} />}
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 outline-none" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-10 z-50 bg-white border border-border
                      rounded-2xl shadow-2xl shadow-navy/10 overflow-hidden min-w-[160px] animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-3 py-2 border-b border-border bg-secondary/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Actions</p>
                      </div>
                      <button
                        onClick={() => { setMenuOpen(false); onSync(material.id); }}
                        disabled={isSyncing}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[13px]
                          font-black text-navy hover:bg-secondary transition-all
                          cursor-pointer bg-transparent border-none text-left disabled:opacity-50">
                        <Sparkles size={14} className="text-navy/60" />
                        {isSyncing ? "Syncing…" : "Sync for AI"}
                      </button>
                      <button
                        onClick={() => { setMenuOpen(false); onEdit(material); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[13px]
                          font-black text-navy hover:bg-secondary transition-all
                          cursor-pointer bg-transparent border-none text-left">
                        <Pencil size={14} className="text-navy/60" />
                        Edit Detail
                      </button>
                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={() => { setMenuOpen(false); onDelete(material.id); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-[13px]
                            font-black text-red-500 hover:bg-red-50 transition-all
                            cursor-pointer bg-transparent border-none text-left">
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 mt-0.5">
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground font-semibold">
            <Clock size={12} className="opacity-40" />
            <span>{format(new Date(material.created_at), "MMM d, yyyy")}</span>
          </div>
          {/* Mobile-only teacher name */}
          <div className="sm:hidden flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/50 mt-0.5 uppercase tracking-wide">
            <User size={10} className="opacity-40" />
            <span className="truncate max-w-[180px]">{teacher?.full_name || "Teacher"}</span>
          </div>
        </div>

        {material.description && (
          <p className="text-[13px] text-muted-foreground/70 line-clamp-2 leading-relaxed mt-3 break-words max-w-2xl">
            {material.description}
          </p>
        )}

        {/* Attachments & Creator Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-secondary/50">
          <div className="flex flex-wrap gap-2 min-w-0">
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

          <div className="hidden sm:flex items-center gap-2 group/author shrink-0 sm:ml-auto sm:pr-1.5">
            <div className="size-6 rounded-lg overflow-hidden border border-border bg-secondary flex items-center justify-center text-[10px] font-black text-navy shrink-0 relative">
              {teacher?.avatar_url && !imgError ? (
                <Image
                  src={teacher.avatar_url.startsWith('http') ? teacher.avatar_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${teacher.avatar_url}`}
                  alt={teacher.full_name}
                  fill
                  className="object-cover"
                  onError={() => setImgError(true)}
                />
              ) : teacher?.full_name?.charAt(0)}
            </div>
            <span className="text-[11px] font-bold text-muted-foreground/60 transition-colors group-hover/author:text-navy truncate max-w-[150px]">
              {teacher?.full_name || "Teacher"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
