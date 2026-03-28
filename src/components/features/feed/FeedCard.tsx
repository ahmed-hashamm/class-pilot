"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, Pin, MoreVertical, Pencil, Trash2, ArrowRight } from "lucide-react";
import FeedItemIcon from "@/components/features/feed/FeedItemIcon";
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";
import { deleteAnnouncement, deleteAssignment, deleteMaterial } from "@/actions/ClassActions";
import EditAnnouncementModal from "@/components/features/feed/EditAnnouncementModal";
import { 
  FEED_TYPE_LABELS, 
  FEED_TYPE_PILLS, 
  FEED_ITEM_THEMES 
} from "@/lib/data/feed";
import { ConfirmModal } from "@/components/ui";

interface FeedCardProps {
  item: any;
  classId: string;
  userId: string;
  isTeacher: boolean;
  children?: React.ReactNode;
}

const FeedCard = ({ item, classId, userId, isTeacher, children }: FeedCardProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const isAssignment = item.type === "assignment";
  const isAnnouncement = item.type === "announcement";
  const isPinned = isAnnouncement && item.pinned;

  const theme = FEED_ITEM_THEMES[item.type] || FEED_ITEM_THEMES.announcement;

  // Labels and pill styles are imported from @/lib/data/feed

  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    return fileName.includes("-") ? fileName.split("-").slice(1).join("-") : fileName;
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (item.type === "announcement") {
        await deleteAnnouncement(item.id, classId);
      } else if (item.type === "assignment") {
        await deleteAssignment(item.id, classId);
        await queryClient.invalidateQueries({ queryKey: ["classAssignments", classId] });
      } else if (item.type === "material") {
        await deleteMaterial(item.id, classId);
        await queryClient.invalidateQueries({ queryKey: ["classMaterials", classId] });
      }

      await queryClient.invalidateQueries({ queryKey: ["streamFeed", classId] });
      setShowDeleteConfirm(false);
    } catch {
      alert(`Failed to delete ${item.type}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete announcement?"
        message="This action cannot be undone. All students will lose access to this post."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleting}
      />
      <div className={`bg-white rounded-xl border transition-all duration-200
        ${isPinned ? "border-navy/30 ring-1 ring-navy/10" : "border-border hover:border-border/80 hover:shadow-sm"}
        ${isAssignment ? "hover:shadow-md" : ""}`}>
        <div className="p-4 flex flex-col gap-3.5">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 size-10 rounded-xl flex items-center justify-center shadow-sm ${theme.bgColor} ${theme.iconColor}`}>
              <FeedItemIcon type={item.type} size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-[14px] text-foreground leading-snug break-words">
                  {item.title || item.question || (item.type === "material" ? "Class Material" : "Post")}
                </h4>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isPinned && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-yellow/20 text-navy border border-yellow/40 rounded-full px-2 py-0.5"><Pin size={9} /> Pinned</span>}
                  <span className={`text-[10px] font-bold tracking-wide uppercase border rounded-full px-2.5 py-0.5 ${FEED_TYPE_PILLS[item.type]}`}>{FEED_TYPE_LABELS[item.type]}</span>
                  {isTeacher && (item.type === "announcement" || item.type === "assignment" || item.type === "material") && (
                    <div className="relative">
                      <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all cursor-pointer bg-transparent border-none"><MoreVertical size={14} /></button>
                      {menuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                          <div className="absolute right-0 top-8 z-50 bg-white border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                            {item.type === "announcement" && (
                              <button onClick={() => { setMenuOpen(false); setEditOpen(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-foreground hover:bg-secondary transition cursor-pointer bg-transparent border-none text-left">
                                <Pencil size={13} className="text-navy" /> Edit
                              </button>
                            )}
                            <button onClick={() => { setMenuOpen(false); setShowDeleteConfirm(true); }} disabled={deleting} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer bg-transparent border-none text-left disabled:opacity-50">
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="font-medium">{item.users?.full_name || "Teacher"}</span>
                <span className="text-border">·</span>
                <Clock size={11} />
                {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>

          {(item.content || item.description) && !item.question && (
            <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap break-words pl-[48px]">{item.content || item.description}</p>
          )}

          {children}

          {(item.attachment_paths || item.file_url) && (
            <div className="flex flex-wrap gap-2 pl-[48px]" onClick={(e) => e.stopPropagation()}>
              {Array.isArray(item.attachment_paths) ? item.attachment_paths.map((path: string) => <AttachmentButton key={path} path={path} type={item.type} label={getDisplayName(path)} />) : item.file_url && <AttachmentButton path={item.file_url} type={item.type} label={getDisplayName(item.file_url)} />}
            </div>
          )}

          {isAssignment && (
            <div className="pl-[48px] pt-2.5 border-t border-border">
              <Link href={`/classes/${classId}/assignments/${item.id}?from=stream`} className="inline-flex items-center gap-2 text-[13px] font-bold text-navy hover:gap-3 transition-all duration-200">View Assignment <ArrowRight size={14} /></Link>
            </div>
          )}
        </div>
      </div>
      {editOpen && (
        <EditAnnouncementModal
          announcement={{ id: item.id, title: item.title || "", content: item.content || "", pinned: item.pinned || false, classId, attachment_paths: Array.isArray(item.attachment_paths) ? item.attachment_paths : item.file_url ? [item.file_url] : [] }}
          onClose={() => setEditOpen(false)}
          onSuccess={() => setEditOpen(false)}
        />
      )}
    </>
  );
}

export default FeedCard;
