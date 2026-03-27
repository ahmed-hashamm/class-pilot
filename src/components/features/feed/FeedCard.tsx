"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Pin, MoreVertical, Pencil, Trash2, ArrowRight } from "lucide-react";
import FeedItemIcon from "@/components/features/classes/Feed/FeedItemIcon";
import AttachmentButton from "@/components/features/classes/Buttons/AttachmentButton";
import { deleteAnnouncement } from "@/actions/ClassActions";
import EditAnnouncementModal from "@/components/features/classes/Feed/EditAnnouncementModal";

interface FeedCardProps {
  item: any;
  classId: string;
  userId: string;
  isTeacher: boolean;
  children?: React.ReactNode;
}

export default function FeedCard({ item, classId, userId, isTeacher, children }: FeedCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAssignment = item.type === "assignment";
  const isAnnouncement = item.type === "announcement";
  const isPinned = isAnnouncement && item.pinned;

  const typeLabel: Record<string, string> = {
    announcement: "Announcement",
    assignment: "Assignment",
    material: "Material",
    poll: "Poll",
    attendance: "Attendance",
  };

  const typePill: Record<string, string> = {
    announcement: "bg-navy/8 text-navy border-navy/15",
    assignment: "bg-yellow/20 text-navy border-yellow/40",
    material: "bg-navy-light/12 text-navy-light border-navy-light/25",
    poll: "bg-purple-500/10 text-purple-600 border-purple-500/25",
    attendance: "bg-green-500/10 text-green-600 border-green-500/25",
  };

  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    return fileName.includes("-") ? fileName.split("-").slice(1).join("-") : fileName;
  };

  const handleDelete = async () => {
    if (!confirm("Delete this announcement? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await deleteAnnouncement(item.id, classId);
    } catch {
      alert("Failed to delete announcement");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className={`bg-white rounded-xl border transition-all duration-200
        ${isPinned ? "border-navy/30 ring-1 ring-navy/10" : "border-border hover:border-border/80 hover:shadow-sm"}
        ${isAssignment ? "hover:shadow-md" : ""}`}>
        <div className="p-4 flex flex-col gap-3.5">
          <div className="flex items-start gap-3">
            <div className={`shrink-0 size-9 rounded-lg flex items-center justify-center text-white shadow-sm
              ${item.type === "announcement" ? "bg-navy" : item.type === "assignment" ? "bg-yellow" : item.type === "poll" ? "bg-purple-500" : item.type === "attendance" ? "bg-green-500" : "bg-navy-light"}`}>
              <FeedItemIcon type={item.type} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-[14px] text-foreground leading-snug truncate">
                  {item.title || item.question || (item.type === "material" ? "Class Material" : "Post")}
                </h4>
                <div className="flex items-center gap-1.5 shrink-0">
                  {isPinned && <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-yellow/20 text-navy border border-yellow/40 rounded-full px-2 py-0.5"><Pin size={9} /> Pinned</span>}
                  <span className={`text-[10px] font-bold tracking-wide uppercase border rounded-full px-2.5 py-0.5 ${typePill[item.type]}`}>{typeLabel[item.type]}</span>
                  {isTeacher && isAnnouncement && (
                    <div className="relative">
                      <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all cursor-pointer bg-transparent border-none"><MoreVertical size={14} /></button>
                      {menuOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                          <div className="absolute right-0 top-8 z-50 bg-white border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                            <button onClick={() => { setMenuOpen(false); setEditOpen(true); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-foreground hover:bg-secondary transition cursor-pointer bg-transparent border-none text-left">
                              <Pencil size={13} className="text-navy" /> Edit
                            </button>
                            <button onClick={() => { setMenuOpen(false); handleDelete(); }} disabled={deleting} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-red-500 hover:bg-red-50 transition cursor-pointer bg-transparent border-none text-left disabled:opacity-50">
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
