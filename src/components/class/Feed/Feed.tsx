// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { Card, CardContent } from "@/components/ui/card";
// import AttachmentButton from "@/components/class/Buttons/AttachmentButton";
// import {
//   Clock,
//   Megaphone,
//   PlusCircle,
//   FileUp,
//   ArrowRight
// } from "lucide-react";
// import {
//   useRealtimeAnnouncements,
//   useRealtimeAssignments,
//   useRealtimeMaterials,
// } from "@/hooks/useRealtime";
// import AnnouncementInput from "./AnnouncementInput";
// import MaterialUpload from "./MaterialUpload";
// import { getFeedIconConfig } from "./FeedItemIcon";
// import Loader from "@/components/layout/Loader";

// interface FeedProps {
//   classId: string;
//   userId: string;
//   isTeacher: boolean;
// }

// type TeacherAction = "none" | "announcement" | "material";

// export default function Feed({ classId, userId, isTeacher }: FeedProps) {
//   const announcements = useRealtimeAnnouncements(classId, userId);
//   const assignments = useRealtimeAssignments(classId, userId);
//   const materials = useRealtimeMaterials(classId, userId);

//   const [activeAction, setActiveAction] = useState<TeacherAction>("none");
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsInitialLoad(false), 800);
//     return () => clearTimeout(timer);
//   }, [announcements, assignments, materials]);

//   const feedItems = useMemo(() => {
//     const combined = [
//       ...announcements.map((a) => ({ ...a, type: "announcement" as const })),
//       ...assignments.map((a) => ({ ...a, type: "assignment" as const })),
//       ...materials.map((m) => ({ ...m, type: "material" as const })),
//     ];

//     return [...combined].sort((a, b) => {
//       const aPinned = a.type === 'announcement' && (a as any).pinned ? 1 : 0;
//       const bPinned = b.type === 'announcement' && (b as any).pinned ? 1 : 0;
//       if (aPinned !== bPinned) return bPinned - aPinned;
//       return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
//     });
//   }, [announcements, assignments, materials]);

//   return (
//     <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
//       {isTeacher && (
//         <div className="space-y-4">
//           {/* TEACHER ACTIONS BAR - Responsive horizontal scroll/flex */}
//           <div className="flex items-center border-b border-gray-200 bg-white rounded-t-2xl overflow-x-auto no-scrollbar">
//             <button
//               onClick={() => setActiveAction(activeAction === "announcement" ? "none" : "announcement")}
//               className={`flex-1 min-w-fit relative flex items-center justify-center gap-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors hover:text-purple-600 ${activeAction === "announcement" ? "text-purple-600" : "text-gray-500"
//                 }`}
//             >
//               <Megaphone size={16} className="sm:w-[18px]" />
//               <span className="whitespace-nowrap">Announcement</span>
//               {activeAction === "announcement" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
//               )}
//             </button>

//             <button
//               onClick={() => setActiveAction(activeAction === "material" ? "none" : "material")}
//               className={`flex-1 min-w-fit relative flex items-center justify-center gap-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors hover:text-emerald-600 ${activeAction === "material" ? "text-emerald-600" : "text-gray-500"
//                 }`}
//             >
//               <FileUp size={16} className="sm:w-[18px]" />
//               <span className="whitespace-nowrap">Material</span>
//               {activeAction === "material" && (
//                 <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
//               )}
//             </button>

//             <Link href={`/classes/${classId}/assignments/create`} className="flex-1 min-w-fit">
//               <button className="w-full flex items-center justify-center gap-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
//                 <PlusCircle size={16} className="sm:w-[18px]" />
//                 <span className="whitespace-nowrap">Assignment</span>
//               </button>
//             </Link>
//           </div>

//           <div className="bg-gray-50/50 p-1 rounded-b-2xl border-x border-b border-gray-100">
//             {activeAction === "announcement" && (
//               <div className="animate-in fade-in slide-in-from-top-1 duration-300">
//                 <AnnouncementInput classId={classId} userId={userId} />
//               </div>
//             )}
//             {activeAction === "material" && (
//               <div className="animate-in fade-in slide-in-from-top-1 duration-300">
//                 <MaterialUpload classId={classId} userId={userId} onSuccess={() => setActiveAction("none")} />
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="space-y-4">
//         {isInitialLoad ? (
//           <Loader text="Loading feed" border="border-navy" />
//         ) : feedItems.length === 0 ? (
//           <Card className="rounded-2xl shadow-sm border-dashed border-2">
//             <CardContent className="py-12 text-center text-gray-500 italic">The feed is empty.</CardContent>
//           </Card>
//         ) : (
//           feedItems.map((item) => (
//             <FeedCard key={`${item.type}-${item.id}`} item={item} classId={classId} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// function FeedCard({ item, classId }: { item: any; classId: string }) {
//   const { icon, color, bg, textColor } = getFeedIconConfig(item);
//   const isAssignment = item.type === "assignment";
//   const isPinned = item.type === "announcement" && item.pinned;

//   const getDisplayName = (path: string) => {
//     const fileName = path.split('/').pop() || "File";
//     const parts = fileName.split('-');
//     return parts.length > 1 ? parts.slice(1).join('-') : fileName;
//   };

//   const CardContentUI = (
//     <CardContent className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 relative">
//       <div className="min-w-0 flex-1 absolute right-7 top-7">
//         {isPinned && <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase block mb-0.5 sm:mb-1">📌 Pinned</span>}
//       </div>
//       {/* Icon - Smaller on mobile */}
//       <div className={` flex items-center justify-start gap-4`}>
//         <div className={` flex items-center justify-center text-white ${color} h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl  shrink-0 shadow-sm`}>{icon}</div>
//         <h4 className="font-bold text-gray-900 truncate text-base sm:text-lg leading-tight">
//           {item.title || (item.type === "material" ? "Class Material" : "Post")}
//         </h4>
//       </div>

//       <div className="flex-1 min-w-0">

//         <div className="flex items-start justify-between gap-2 mt-1">
//           <p className="text-[11px] sm:text-xs text-gray-400  flex items-center gap-1">
//             <span className="truncate max-w-[100px] sm:max-w-none">{item.users?.full_name || "Teacher"}</span> • <Clock size={10} className="sm:w-[12px]" />
//             {new Date(item.created_at).toLocaleDateString()}
//           </p>
//           <span className={`shrink-0 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-full uppercase self-start ${bg} ${textColor}`}>
//             {item.type}
//           </span>
//         </div>

//         <div className="mt-3 sm:mt-4 text-gray-700 text-sm whitespace-pre-wrap break-words">
//           {item.content || item.description}
//         </div>

//         {/* ATTACHMENTS - Wrap nicely on mobile */}
//         {(item.attachment_paths || item.file_url) && (
//           <div className="flex flex-wrap gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
//             {Array.isArray(item.attachment_paths) ? (
//               item.attachment_paths.map((path: string) => (
//                 <div key={path} className="max-w-full">
//                   <AttachmentButton
//                     path={path}
//                     type={item.type}
//                     label={getDisplayName(path)}
//                   />
//                 </div>
//               ))
//             ) : (
//               item.file_url && (
//                 <div className="max-w-full">
//                   <AttachmentButton
//                     path={item.file_url}
//                     type={item.type}
//                     label={getDisplayName(item.file_url)}
//                   />
//                 </div>
//               )
//             )}
//           </div>
//         )}

//         {isAssignment && (
//           <Link href={`/classes/${classId}/assignments/${item.id}`} className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex justify-end">
//             <div className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer font-bold text-blue-600 hover:text-blue-700">
//               View Assignment <ArrowRight size={14} className="sm:w-[16px]" />
//             </div>
//           </Link>
//         )}
//       </div>
//     </CardContent>
//   );

//   return (
//     <Card className={`rounded-2xl transition-all border shadow-sm ${isPinned ? "border-blue-500 ring-1 ring-blue-500/10" : "border-gray-200"
//       } ${isAssignment ? "hover:border-blue-300 hover:shadow-md" : ""}`}>
//       {CardContentUI}
//     </Card>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AttachmentButton from "@/components/class/Buttons/AttachmentButton";
import {
  Clock, Megaphone, PlusCircle, FileUp, ArrowRight, Pin, Inbox,
  MoreVertical, Pencil, Trash2, BarChart2, CheckSquare,
  Timer, Lock, XCircle
} from "lucide-react";
import {
  useRealtimeAnnouncements,
  useRealtimeAssignments,
  useRealtimeMaterials,
  useRealtimePolls,
  useRealtimeAttendances
} from "@/hooks/useRealtime";
import AnnouncementInput from "./AnnouncementInput";
import MaterialUpload from "./MaterialUpload";
import PollInput from "./PollInput";
import AttendanceInput from "./AttendanceInput";
import FeedItemIcon from "./FeedItemIcon";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import EditAnnouncementModal from "./EditAnnouncementModal";
import { deleteAnnouncement } from "../../../actions/ClassActions";
import {
  markAttendancePresent, submitPollResponse,
  closePoll, closeAttendance
} from "@/actions/ClassFeaturesActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/* ── Countdown hook ── */
function useCountdown(deadline: string | null, closedAt: string | null) {
  const getRemaining = useCallback(() => {
    if (closedAt) return -1;
    if (!deadline) return Infinity;
    return Math.max(0, Math.floor((new Date(deadline).getTime() - Date.now()) / 1000));
  }, [deadline, closedAt]);

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    setRemaining(getRemaining());
    if (closedAt || !deadline) return;
    const id = setInterval(() => {
      const r = getRemaining();
      setRemaining(r);
      if (r <= 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [deadline, closedAt, getRemaining]);

  const isClosed = closedAt !== null && closedAt !== undefined;
  const isExpired = remaining <= 0 && !isClosed && deadline !== null;
  const isActive = !isClosed && !isExpired;

  return { remaining, isClosed, isExpired, isActive };
}

function formatCountdown(seconds: number) {
  if (seconds === Infinity) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m left`;
  if (m > 0) return `${m}m ${s}s left`;
  return `${s}s left`;
}

function StatusBadge({ deadline, closedAt }: { deadline: string | null; closedAt: string | null }) {
  const { remaining, isClosed, isExpired, isActive } = useCountdown(deadline, closedAt);

  if (isClosed) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide
        uppercase bg-red-500/10 text-red-600 border border-red-500/25 rounded-full px-2 py-0.5">
        <Lock size={9} /> Closed
      </span>
    );
  }
  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide
        uppercase bg-gray-500/10 text-gray-600 border border-gray-500/25 rounded-full px-2 py-0.5">
        <XCircle size={9} /> Expired
      </span>
    );
  }
  if (isActive && deadline) {
    const label = formatCountdown(remaining);
    const isUrgent = remaining < 300; // under 5 min
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide
        uppercase border rounded-full px-2 py-0.5
        ${isUrgent
          ? "bg-red-500/10 text-red-600 border-red-500/25 animate-pulse"
          : "bg-blue-500/10 text-blue-600 border-blue-500/25"
        }`}>
        <Timer size={9} /> {label}
      </span>
    );
  }
  return null;
}

interface FeedProps {
  classId: string;
  userId: string;
  isTeacher: boolean;
}

type TeacherAction = "none" | "announcement" | "material" | "poll" | "attendance";

const ACTIONS = [
  { id: "announcement" as TeacherAction, label: "Announcement", icon: Megaphone },
  { id: "material" as TeacherAction, label: "Material", icon: FileUp },
  { id: "poll" as TeacherAction, label: "Poll", icon: BarChart2 },
  { id: "attendance" as TeacherAction, label: "Attendance", icon: CheckSquare },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   FEED
───────────────────────────────────────────────────────────────────────────── */
export default function Feed({ classId, userId, isTeacher }: FeedProps) {
  const { announcements, hasSettled: annSettled } = useRealtimeAnnouncements(classId, userId);
  const { assignments, hasSettled: asnSettled } = useRealtimeAssignments(classId, userId);
  const { materials, hasSettled: matSettled } = useRealtimeMaterials(classId, userId);
  const { polls, hasSettled: pollSettled } = useRealtimePolls(classId, userId);
  const { attendances, hasSettled: attSettled } = useRealtimeAttendances(classId, userId);

  const [activeAction, setActiveAction] = useState<TeacherAction>("none");
  const isInitialLoad = !(annSettled && asnSettled && matSettled && pollSettled && attSettled);

  const feedItems = useMemo(() => {
    const combined = [
      ...announcements.map((a) => ({ ...a, type: "announcement" as const })),
      ...assignments.map((a) => ({ ...a, type: "assignment" as const })),
      ...materials.map((m) => ({ ...m, type: "material" as const })),
      ...polls.map((p) => ({ ...p, type: "poll" as const })),
      ...attendances.map((a) => ({ ...a, type: "attendance" as const })),
    ];
    return [...combined].sort((a, b) => {
      const aPinned = a.type === "announcement" && (a as any).pinned ? 1 : 0;
      const bPinned = b.type === "announcement" && (b as any).pinned ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
  }, [announcements, assignments, materials, polls, attendances]);

  return (
    <div className="flex flex-col gap-4">

      {/* Teacher Action Module */}
      {isTeacher && (
        <Card className="rounded-2xl shadow-sm bg-white overflow-hidden border-border">
          <CardHeader className="p-0 border-b border-border">
            <div className="flex items-center overflow-x-auto no-scrollbar">
              {ACTIONS.map(({ id, label, icon: Icon }) => {
                const isActive = activeAction === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveAction(activeAction === id ? "none" : id)}
                    className={`relative flex-1 min-w-fit flex items-center justify-center gap-2
                      px-5 py-4 text-[13px] font-bold transition-all cursor-pointer
                      border-none bg-transparent
                      ${isActive 
                        ? "text-navy bg-navy-light/5" 
                        : "text-muted-foreground hover:text-navy hover:bg-secondary/30"}`}
                  >
                    <Icon size={16} className={isActive ? "text-navy" : "text-muted-foreground"} />
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-yellow" />
                    )}
                  </button>
                );
              })}

              <Link href={`/classes/${classId}/assignments/create`} className="flex-1 min-w-fit">
                <button className="w-full flex items-center justify-center gap-2
                  px-5 py-4 text-[13px] font-bold text-muted-foreground
                  hover:text-navy hover:bg-secondary/30 transition-all cursor-pointer border-none bg-transparent">
                  <PlusCircle size={16} />
                  Assignment
                </button>
              </Link>
            </div>
          </CardHeader>

          {activeAction !== "none" && (
            <CardContent className="p-0 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="p-6">
                {activeAction === "announcement" && (
                  <AnnouncementInput classId={classId} userId={userId} />
                )}
                {activeAction === "material" && (
                  <MaterialUpload
                    classId={classId}
                    userId={userId}
                    onSuccess={() => setActiveAction("none")}
                  />
                )}
                {activeAction === "poll" && (
                  <PollInput
                    classId={classId}
                    onSuccess={() => setActiveAction("none")}
                  />
                )}
                {activeAction === "attendance" && (
                  <AttendanceInput
                    classId={classId}
                    onSuccess={() => setActiveAction("none")}
                  />
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Feed list */}
      <div className="flex flex-col gap-3">
        {isInitialLoad ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i}
                className="bg-white border border-border rounded-2xl p-4 sm:p-5 flex gap-4 animate-pulse">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 sm:h-5 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="h-6 w-20 bg-muted rounded-full" />
                    <div className="h-6 w-16 bg-muted rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : feedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3
            py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
            <Inbox size={28} className="text-muted-foreground/40" />
            <p className="text-[14px] text-muted-foreground font-medium">The feed is empty</p>
            {isTeacher && (
              <p className="text-[12px] text-muted-foreground">
                Post an announcement or upload a material to get started.
              </p>
            )}
          </div>
        ) : (
          feedItems.map((item) => (
            <FeedCard
              key={`${item.type}-${item.id}`}
              item={item}
              classId={classId}
              userId={userId}
              isTeacher={isTeacher}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEED CARD
───────────────────────────────────────────────────────────────────────────── */
function FeedCard({
  item, classId, userId, isTeacher,
}: {
  item: any
  classId: string
  userId: string
  isTeacher: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAssignment = item.type === "assignment";
  const isAnnouncement = item.type === "announcement";
  const isPoll = item.type === "poll";
  const isAttendance = item.type === "attendance";
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
    const parts = fileName.split("-");
    return parts.length > 1 ? parts.slice(1).join("-") : fileName;
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
      <div className={`bg-white rounded-2xl border transition-all duration-200
        ${isPinned
          ? "border-navy/30 ring-1 ring-navy/10"
          : "border-border hover:border-border/80 hover:shadow-sm"
        }
        ${isAssignment ? "hover:shadow-md" : ""}`}>

        <div className="p-5 flex flex-col gap-4">

          {/* Header */}
          <div className="flex items-start gap-3">
            <div className={`shrink-0 size-10 rounded-xl flex items-center
              justify-center text-white shadow-sm
              ${item.type === "announcement" ? "bg-navy"
                : item.type === "assignment" ? "bg-yellow"
                  : item.type === "poll" ? "bg-purple-500"
                    : item.type === "attendance" ? "bg-green-500"
                      : "bg-navy-light"}`}>
              {item.type === "poll" ? <BarChart2 size={20} /> :
               item.type === "attendance" ? <CheckSquare size={20} /> :
               <FeedItemIcon type={item.type} />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-[15px] text-foreground leading-snug truncate">
                  {item.title || item.question || (item.type === "material" ? "Class Material" : "Post")}
                </h4>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isPinned && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold
                      tracking-wide uppercase bg-yellow/20 text-navy border border-yellow/40
                      rounded-full px-2 py-0.5">
                      <Pin size={9} /> Pinned
                    </span>
                  )}
                  {(isPoll || isAttendance) && (
                    <StatusBadge deadline={item.deadline ?? null} closedAt={item.closed_at ?? null} />
                  )}
                  <span className={`text-[10px] font-bold tracking-wide uppercase
                    border rounded-full px-2.5 py-0.5 ${typePill[item.type]}`}>
                    {typeLabel[item.type]}
                  </span>

                  {/* ⋯ menu — teacher + announcements only */}
                  {isTeacher && isAnnouncement && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-1.5 text-muted-foreground hover:text-foreground
                          hover:bg-secondary rounded-lg transition cursor-pointer
                          bg-transparent border-none">
                        <MoreVertical size={14} />
                      </button>

                      {menuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setMenuOpen(false)}
                          />
                          <div className="absolute right-0 top-8 z-50 bg-white border
                            border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                            <button
                              onClick={() => { setMenuOpen(false); setEditOpen(true); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5
                                text-[13px] font-semibold text-foreground hover:bg-secondary
                                transition cursor-pointer bg-transparent border-none text-left">
                              <Pencil size={13} className="text-navy" /> Edit
                            </button>
                            <button
                              onClick={() => { setMenuOpen(false); handleDelete(); }}
                              disabled={deleting}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5
                                text-[13px] font-semibold text-red-500 hover:bg-red-50
                                transition cursor-pointer bg-transparent border-none text-left
                                disabled:opacity-50">
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <p className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <span className="font-medium">{item.users?.full_name || "Teacher"}</span>
                <span className="text-border">·</span>
                <Clock size={11} />
                {new Date(item.created_at).toLocaleDateString("en-US", {
                  month: "short", day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Body */}
          {(item.content || item.description) && !isPoll && !isAttendance && (
            <p className="text-[14px] text-foreground/80 leading-relaxed
              whitespace-pre-wrap break-words pl-[52px]">
              {item.content || item.description}
            </p>
          )}

          {/* Special rendering for Polls */}
          {isPoll && (
            <PollBody item={item} userId={userId} isTeacher={isTeacher} />
          )}

          {/* Special rendering for Attendance */}
          {isAttendance && (
            <AttendanceBody item={item} userId={userId} isTeacher={isTeacher} />
          )}

          {/* Attachments */}
          {(item.attachment_paths || item.file_url) && (
            <div className="flex flex-wrap gap-2 pl-[52px]"
              onClick={(e) => e.stopPropagation()}>
              {Array.isArray(item.attachment_paths) ? (
                item.attachment_paths.map((path: string) => (
                  <AttachmentButton
                    key={path} path={path} type={item.type}
                    label={getDisplayName(path)}
                  />
                ))
              ) : (
                item.file_url && (
                  <AttachmentButton
                    path={item.file_url} type={item.type}
                    label={getDisplayName(item.file_url)}
                  />
                )
              )}
            </div>
          )}

          {/* Assignment CTA */}
          {isAssignment && (
            <div className="pl-[52px] pt-3 border-t border-border">
              <Link
                href={`/classes/${classId}/assignments/${item.id}?from=stream`}
                className="inline-flex items-center gap-2 text-[13px] font-bold
                  text-navy hover:gap-3 transition-all duration-200">
                View Assignment <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editOpen && (
        <EditAnnouncementModal
          announcement={{
            id: item.id,
            title: item.title || "",
            content: item.content || "",
            pinned: item.pinned || false,
            classId,
            attachment_paths: Array.isArray(item.attachment_paths)
              ? item.attachment_paths
              : item.file_url ? [item.file_url] : [],
          }}
          onClose={() => setEditOpen(false)}
          onSuccess={() => setEditOpen(false)}
        />
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   POLL BODY (with countdown + close)
───────────────────────────────────────────────────────────────────────────── */
function PollBody({ item, userId, isTeacher }: { item: any; userId: string; isTeacher: boolean }) {
  const { isActive } = useCountdown(item.deadline ?? null, item.closed_at ?? null);
  const [closing, setClosing] = useState(false);
  const router = useRouter();

  const handleClose = async () => {
    if (!confirm('Close this poll? Students will no longer be able to vote.')) return;
    setClosing(true);
    try {
      const res = await closePoll(item.id);
      if (!res.success) toast.error(res.error || 'Failed to close poll');
    } finally {
      setClosing(false);
    }
  };

  const handleVote = async (idx: number) => {
    const res = await submitPollResponse(item.id, idx);
    if (!res.success) {
      toast.error(res.error || 'Could not submit vote');
    } else {
      toast.success('Vote submitted successfully');
      router.refresh();
    }
  };

  return (
    <div className="pl-[52px] flex flex-col gap-2">
      {item.options.map((opt: string, idx: number) => {
        const totalVotes = item.poll_responses?.length || 0;
        const optionVotes = item.poll_responses?.filter((r: any) => r.selected_option_index === idx).length || 0;
        const percent = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
        const hasVoted = item.poll_responses?.some((r: any) => r.user_id === userId);
        const isMyVote = item.poll_responses?.some((r: any) => r.user_id === userId && r.selected_option_index === idx);

        if (hasVoted || isTeacher || !isActive) {
          return (
            <div key={idx} className="relative overflow-hidden rounded-lg border border-border bg-secondary/30">
              <div
                className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${isMyVote ? 'bg-purple-500/20' : 'bg-muted'}`}
                style={{ width: `${percent}%` }}
              />
              <div className="relative z-10 flex justify-between px-4 py-2 text-[14px]">
                <span className={isMyVote ? 'font-bold text-purple-700' : 'font-medium'}>{opt} {isMyVote && '(You)'}</span>
                <span className="text-muted-foreground">{percent}%</span>
              </div>
            </div>
          );
        }

        return (
          <button
            key={idx}
            onClick={() => handleVote(idx)}
            className="flex justify-between w-full px-4 py-2 border border-border rounded-lg text-left text-[14px] font-medium hover:bg-secondary hover:border-border/80 transition-all cursor-pointer bg-transparent"
          >
            {opt}
          </button>
        );
      })}
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground">{item.poll_responses?.length || 0} vote(s)</p>
        {isTeacher && isActive && (
          <button
            onClick={handleClose}
            disabled={closing}
            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600
              hover:text-red-700 bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            <Lock size={12} /> {closing ? 'Closing…' : 'Close Poll'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ATTENDANCE BODY (with countdown + close)
───────────────────────────────────────────────────────────────────────────── */
function AttendanceBody({ item, userId, isTeacher }: { item: any; userId: string; isTeacher: boolean }) {
  const { isActive } = useCountdown(item.deadline ?? null, item.closed_at ?? null);
  const [closing, setClosing] = useState(false);
  const router = useRouter();
  const alreadyPresent = item.attendance_records?.some((r: any) => r.user_id === userId);

  const handleClose = async () => {
    if (!confirm('Close this attendance session? Students will no longer be able to mark present.')) return;
    setClosing(true);
    try {
      const res = await closeAttendance(item.id);
      if (!res.success) toast.error(res.error || 'Failed to close attendance');
    } finally {
      setClosing(false);
    }
  };

  const handleMark = async () => {
    const res = await markAttendancePresent(item.id);
    if (!res.success) {
      toast.error(res.error || 'Could not mark attendance');
    } else {
      toast.success('Attendance marked successfully');
      router.refresh();
    }
  };

  return (
    <div className="pl-[52px]">
      <div className="bg-secondary/30 rounded-lg p-4 flex items-center justify-between border border-border/50">
        <div>
          <p className="font-semibold text-sm mb-0.5">
            Attendance: {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          {isTeacher ? (
            <p className="text-xs text-muted-foreground">{item.attendance_records?.length || 0} student(s) marked present</p>
          ) : !isActive ? (
            <p className="text-xs text-muted-foreground">This attendance session is no longer accepting responses.</p>
          ) : (
            <p className="text-xs text-muted-foreground">Please mark yourself present.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isTeacher && (
            alreadyPresent ? (
              <div className="flex items-center gap-1 text-sm font-bold text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full">
                <CheckSquare size={16} /> Present
              </div>
            ) : isActive ? (
              <button
                onClick={handleMark}
                className="text-sm font-semibold bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-full transition-colors cursor-pointer border-none"
              >
                Mark Present
              </button>
            ) : (
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                Unavailable
              </span>
            )
          )}
          {isTeacher && isActive && (
            <button
              onClick={handleClose}
              disabled={closing}
              className="inline-flex items-center gap-1 text-xs font-semibold text-red-600
                hover:text-red-700 bg-transparent border-none cursor-pointer disabled:opacity-50"
            >
              <Lock size={12} /> {closing ? 'Closing…' : 'Close'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
// 'use client'

// import { useState } from 'react'
// import { format } from 'date-fns'
// import {
//   Pin, MoreVertical, Pencil, Trash2,
//   Paperclip, ExternalLink,
// } from 'lucide-react'
// import FeedItemIcon from './FeedItemIcon'
// import EditAnnouncementModal from './EditAnnouncementModal'
// import { deleteAnnouncement } from '../ClassActions'

// interface FeedItem {
//   id: string
//   type: 'announcement' | 'assignment' | 'material'
//   title: string
//   content?: string
//   created_at: string
//   pinned?: boolean
//   attachments?: { name: string; url: string }[]
//   classId: string
// }

// interface FeedProps {
//   items: FeedItem[]
//   isTeacher: boolean
//   onRefresh: () => void
// }

// export default function Feed({ items, isTeacher, onRefresh }: FeedProps) {
//   if (items.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-3 py-16
//         border-2 border-dashed border-border rounded-2xl bg-white text-center">
//         <div className="size-14 rounded-2xl bg-navy/8 border border-navy/15
//           flex items-center justify-center">
//           <Paperclip size={24} className="text-navy/40" />
//         </div>
//         <p className="font-bold text-[16px] tracking-tight">No activity yet</p>
//         <p className="text-[13px] text-muted-foreground">
//           Announcements and assignments will appear here.
//         </p>
//       </div>
//     )
//   }

//   const sorted = [...items].sort((a, b) => {
//     if (a.pinned && !b.pinned) return -1
//     if (!a.pinned && b.pinned) return 1
//     return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//   })

//   return (
//     <div className="flex flex-col gap-3">
//       {sorted.map((item) => (
//         <FeedCard key={item.id} item={item} isTeacher={isTeacher} onRefresh={onRefresh} />
//       ))}
//     </div>
//   )
// }

// function FeedCard({ item, isTeacher, onRefresh }: {
//   item: FeedItem
//   isTeacher: boolean
//   onRefresh: () => void
// }) {
//   const [menuOpen, setMenuOpen] = useState(false)
//   const [editOpen, setEditOpen] = useState(false)
//   const [deleting, setDeleting] = useState(false)

//   const handleDelete = async () => {
//     if (!confirm('Delete this announcement? This cannot be undone.')) return
//     setDeleting(true)
//     try {
//       await deleteAnnouncement(item.id, item.classId)
//       onRefresh()
//     } catch {
//       alert('Failed to delete')
//     } finally {
//       setDeleting(false)
//     }
//   }

//   return (
//     <>
//       <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-sm transition-all">
//         {item.pinned && (
//           <div className="flex items-center gap-2 px-5 py-2 bg-yellow/15 border-b border-yellow/30">
//             <Pin size={11} className="text-navy fill-navy" />
//             <span className="text-[10px] font-bold uppercase tracking-widest text-navy">Pinned</span>
//           </div>
//         )}

//         <div className="p-5">
//           <div className="flex items-start gap-3">
//             <FeedItemIcon type={item.type} />

//             <div className="flex-1 min-w-0">
//               <div className="flex items-start justify-between gap-2">
//                 <div>
//                   <p className="font-bold text-[15px] text-foreground leading-tight">{item.title}</p>
//                   <p className="text-[12px] text-muted-foreground mt-0.5">
//                     {format(new Date(item.created_at), 'MMM d, yyyy · h:mm a')}
//                   </p>
//                 </div>

//                 {isTeacher && item.type === 'announcement' && (
//                   <div className="relative shrink-0">
//                     <button
//                       onClick={() => setMenuOpen(!menuOpen)}
//                       className="p-1.5 text-muted-foreground hover:text-foreground
//                         hover:bg-secondary rounded-lg transition cursor-pointer bg-transparent border-none">
//                       <MoreVertical size={15} />
//                     </button>

//                     {menuOpen && (
//                       <>
//                         <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
//                         <div className="absolute right-0 top-8 z-50 bg-white border border-border
//                           rounded-xl shadow-lg overflow-hidden min-w-[140px]">
//                           <button
//                             onClick={() => { setMenuOpen(false); setEditOpen(true) }}
//                             className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px]
//                               font-semibold text-foreground hover:bg-secondary transition
//                               cursor-pointer bg-transparent border-none text-left">
//                             <Pencil size={13} className="text-navy" /> Edit
//                           </button>
//                           <button
//                             onClick={() => { setMenuOpen(false); handleDelete() }}
//                             disabled={deleting}
//                             className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px]
//                               font-semibold text-red-500 hover:bg-red-50 transition
//                               cursor-pointer bg-transparent border-none text-left disabled:opacity-50">
//                             <Trash2 size={13} /> Delete
//                           </button>
//                         </div>
//                       </>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {item.content && (
//                 <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">
//                   {item.content}
//                 </p>
//               )}

//               {item.attachments && item.attachments.length > 0 && (
//                 <div className="flex flex-wrap gap-2 mt-3">
//                   {item.attachments.map((att, i) => (
//                     <a key={i} href={att.url} target="_blank" rel="noopener noreferrer"
//                       className="inline-flex items-center gap-2 bg-secondary border border-border
//                         rounded-lg px-3 py-1.5 text-[12px] font-medium text-foreground
//                         hover:text-navy hover:border-navy/30 transition">
//                       <Paperclip size={11} className="text-navy" />
//                       <span className="truncate max-w-[140px]">{att.name}</span>
//                       <ExternalLink size={10} className="text-muted-foreground shrink-0" />
//                     </a>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {editOpen && (
//         <EditAnnouncementModal
//           announcement={{
//             id: item.id, title: item.title,
//             content: item.content || '', pinned: item.pinned || false, classId: item.classId,
//           }}
//           onClose={() => setEditOpen(false)}
//           onSuccess={onRefresh}
//         />
//       )}
//     </>
//   )
// }