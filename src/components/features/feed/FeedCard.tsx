"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Clock, Pin, MoreVertical, Pencil, Trash2, ArrowRight, Users, PinOff, PinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import FeedItemIcon from "@/components/features/feed/FeedItemIcon";
import AttachmentButton from "@/components/features/classes/buttons/AttachmentButton";
import { deleteAnnouncement, deleteAssignment, deleteMaterial, togglePinAction } from "@/actions/ClassActions";
import { deleteAttendance, deletePoll } from "@/actions/ClassFeaturesActions";
import { toast } from "sonner";
import EditAnnouncementModal from "@/components/features/feed/EditAnnouncementModal";
import {
  FEED_TYPE_LABELS,
  FEED_TYPE_MESSAGES,
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
  const isPinned = !!item.pinned;

  const theme = FEED_ITEM_THEMES[item.type] || FEED_ITEM_THEMES.announcement;

  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    return fileName.includes("-") ? fileName.split("-").slice(1).join("-") : fileName;
  };

  const handleDelete = async () => {
    setDeleting(true);
    const label = FEED_TYPE_LABELS[item.type] || "item";
    try {
      if (item.type === "announcement") {
        await deleteAnnouncement(item.id, classId);
      } else if (item.type === "assignment") {
        await deleteAssignment(item.id, classId);
        await queryClient.invalidateQueries({ queryKey: ["classAssignments", classId] });
      } else if (item.type === "material") {
        await deleteMaterial(item.id, classId);
        await queryClient.invalidateQueries({ queryKey: ["classMaterials", classId] });
      } else if (item.type === "poll") {
        await deletePoll(item.id, classId);
      } else if (item.type === "attendance") {
        await deleteAttendance(item.id, classId);
      }

      await queryClient.invalidateQueries({ queryKey: ["streamFeed", classId] });
      toast.success(`${label} deleted successfully`);
      setShowDeleteConfirm(false);
    } catch {
      toast.error(`Failed to delete ${label.toLowerCase()}`);
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
        title={`Delete ${FEED_TYPE_LABELS[item.type] || "item"}`}
        message={FEED_TYPE_MESSAGES[item.type] || "This action cannot be undone."}
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleting}
      />
      <div className={`bg-navy/5 hover:bg-white border rounded-md  hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 border-b-4 border-navy/90`}>
        {/* Top glow on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-navy/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="p-4 flex flex-col gap-3.5">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 size-10 rounded-xl flex items-center justify-center shadow-sm ${theme.bgColor} ${theme.iconColor}`}>
              <FeedItemIcon type={item.type} size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1 w-full">
                <h4 className="font-bold text-[14px] text-foreground leading-tight flex-1 break-all overflow-hidden">
                  {item.title || item.question || (item.type === "material" ? "Class Material" : "Post")}
                </h4>
                {isPinned && <Pin size={11} fill="currentColor" />}
                {isTeacher && (
                  <div className="shrink-0 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="p-1.5 h-auto w-auto text-muted-foreground hover:text-foreground hover:bg-secondary"
                    >
                      <MoreVertical size={14} />
                    </Button>
                    {menuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                        <div className="absolute right-0 top-8 z-50 bg-white border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-foreground hover:bg-secondary h-auto rounded-none"
                            onClick={async () => {
                              setMenuOpen(false);
                              const res = await togglePinAction({
                                id: item.id,
                                classId,
                                pinned: !isPinned,
                                type: item.type === "announcement" ? "announcements" :
                                  item.type === "assignment" ? "assignments" :
                                    item.type === "material" ? "materials" :
                                      item.type === "poll" ? "polls" : "attendances",
                              });
                              if (!res.error) {
                                toast.success(isPinned ? "Item unpinned" : "Item pinned");
                                await queryClient.invalidateQueries({ queryKey: ["streamFeed", classId] });
                              } else {
                                toast.error(res.error);
                              }
                            }}
                          >
                            {isPinned ? (
                              <><PinOff size={13} className="text-navy" /> Unpin</>
                            ) : (
                              <><Pin size={13} className="text-navy" /> Pin</>
                            )}
                          </Button>

                          {item.type === "announcement" && (
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-foreground hover:bg-secondary h-auto rounded-none"
                              onClick={() => { setMenuOpen(false); setEditOpen(true); }}
                            >
                              <Pencil size={13} className="text-navy" /> Edit
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 h-auto rounded-none"
                            onClick={() => { setMenuOpen(false); setShowDeleteConfirm(true); }}
                            disabled={deleting}
                          >
                            <Trash2 size={13} /> Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center flex-wrap gap-1 sm:gap-0 text-[11px] text-muted-foreground mt-0.5">
                {/* Name and Date Row */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-medium truncate max-w-[120px]">{item.users?.full_name || "Teacher"}</span>
                  <span className="text-border font-extrabold">·</span>
                  <div className="flex items-center gap-1.5">
                    <Clock size={11} className="shrink-0" />
                    {item.created_at ? format(new Date(item.created_at), "MMM d") : "Recently"}
                  </div>
                </div>

                {/* Badges Row (Inline on Desktop, Stacked on Mobile) */}
                <div className="flex flex-row items-center gap-1.5 sm:gap-1.5 flex-wrap">
                  <span className="text-border font-extrabold hidden sm:inline ml-1.5">·</span>

                  {item.is_group_project && (
                    <div className="flex items-center text-navy sm:ml-1.5" title="Group Project">
                      <Users size={12} className="opacity-80" />
                    </div>
                  )}

                  {isAssignment && item.due_date && (
                    <div className="flex items-center gap-1.5 text-navy font-bold sm:ml-1.5" title={`Due: ${format(new Date(item.due_date), "MMM d, h:mm a")}`}>
                      {item.is_group_project && <span className="text-border font-extrabold mr-1.5">·</span>}
                      <Clock size={12} className="text-rose-500" />
                      <span>{format(new Date(item.due_date), "MMM d, h:mm a")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {(item.content || item.description) && !item.question && (
            <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap break-all overflow-hidden pl-[48px]">
              {item.content || item.description}
            </p>
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
