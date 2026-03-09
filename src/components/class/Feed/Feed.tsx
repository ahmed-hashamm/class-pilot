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

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AttachmentButton from "@/components/class/Buttons/AttachmentButton";
import {
  Clock, Megaphone, PlusCircle, FileUp, ArrowRight, Pin, Inbox
} from "lucide-react";
import {
  useRealtimeAnnouncements,
  useRealtimeAssignments,
  useRealtimeMaterials,
} from "@/hooks/useRealtime";
import AnnouncementInput from "./AnnouncementInput";
import MaterialUpload from "./MaterialUpload";
import { getFeedIconConfig } from "./FeedItemIcon";
import Loader from "@/components/layout/Loader";

interface FeedProps {
  classId: string;
  userId: string;
  isTeacher: boolean;
}

type TeacherAction = "none" | "announcement" | "material";

/* ─────────────────────────────────────────────────────────────────────────────
   TEACHER ACTION BAR
───────────────────────────────────────────────────────────────────────────── */
const ACTIONS = [
  {
    id: "announcement" as TeacherAction,
    label: "Announcement",
    icon: Megaphone,
    activeClass: "text-navy border-navy",
  },
  {
    id: "material" as TeacherAction,
    label: "Material",
    icon: FileUp,
    activeClass: "text-navy border-navy",
  },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   FEED
───────────────────────────────────────────────────────────────────────────── */
export default function Feed({ classId, userId, isTeacher }: FeedProps) {
  const announcements = useRealtimeAnnouncements(classId, userId);
  const assignments   = useRealtimeAssignments(classId, userId);
  const materials     = useRealtimeMaterials(classId, userId);

  const [activeAction, setActiveAction] = useState<TeacherAction>("none");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsInitialLoad(false), 800);
    return () => clearTimeout(t);
  }, [announcements, assignments, materials]);

  const feedItems = useMemo(() => {
    const combined = [
      ...announcements.map((a) => ({ ...a, type: "announcement" as const })),
      ...assignments.map((a)  => ({ ...a, type: "assignment"   as const })),
      ...materials.map((m)    => ({ ...m, type: "material"     as const })),
    ];
    return [...combined].sort((a, b) => {
      const aPinned = a.type === "announcement" && (a as any).pinned ? 1 : 0;
      const bPinned = b.type === "announcement" && (b as any).pinned ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [announcements, assignments, materials]);

  return (
    <div className="flex flex-col gap-4">

      {/* Teacher action bar */}
      {isTeacher && (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center border-b border-border">
            {ACTIONS.map(({ id, label, icon: Icon }) => {
              const isActive = activeAction === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveAction(activeAction === id ? "none" : id)}
                  className={`relative flex-1 flex items-center justify-center gap-2
                    px-4 py-3.5 text-[13px] font-semibold transition-colors cursor-pointer
                    border-none bg-transparent
                    ${isActive ? "text-navy" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Icon size={15} />
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-navy" />
                  )}
                </button>
              );
            })}

            {/* Assignment — links away, never sets activeAction */}
            <Link href={`/classes/${classId}/assignments/create`} className="flex-1">
              <button className="w-full flex items-center justify-center gap-2
                px-4 py-3.5 text-[13px] font-semibold text-muted-foreground
                hover:text-foreground transition-colors cursor-pointer
                border-none bg-transparent">
                <PlusCircle size={15} />
                Assignment
              </button>
            </Link>
          </div>

          {/* Expanded panel */}
          {activeAction !== "none" && (
            <div className="p-4 bg-secondary/50 animate-in fade-in slide-in-from-top-1 duration-200">
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
            </div>
          )}
        </div>
      )}

      {/* Feed list */}
      <div className="flex flex-col gap-3">
        {isInitialLoad ? (
          <Loader text="Loading feed" border="border-navy" />
        ) : feedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3
            py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
            <Inbox size={28} className="text-muted-foreground/40" />
            <p className="text-[14px] text-muted-foreground font-medium">
              The feed is empty
            </p>
            {isTeacher && (
              <p className="text-[12px] text-muted-foreground">
                Post an announcement or upload a material to get started.
              </p>
            )}
          </div>
        ) : (
          feedItems.map((item) => (
            <FeedCard key={`${item.type}-${item.id}`} item={item} classId={classId} />
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FEED CARD
───────────────────────────────────────────────────────────────────────────── */
function FeedCard({ item, classId }: { item: any; classId: string }) {
  const { icon, color } = getFeedIconConfig(item);
  const isAssignment = item.type === "assignment";
  const isPinned     = item.type === "announcement" && item.pinned;

  const typeLabel: Record<string, string> = {
    announcement: "Announcement",
    assignment:   "Assignment",
    material:     "Material",
  };

  const typePill: Record<string, string> = {
    announcement: "bg-navy/8 text-navy border-navy/15",
    assignment:   "bg-yellow/20 text-navy border-yellow/40",
    material:     "bg-navy-light/12 text-navy-light border-navy-light/25",
  };

  const getDisplayName = (path: string) => {
    const fileName = path.split("/").pop() || "File";
    const parts = fileName.split("-");
    return parts.length > 1 ? parts.slice(1).join("-") : fileName;
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200
      ${isPinned
        ? "border-navy/30 ring-1 ring-navy/10"
        : "border-border hover:border-border/80 hover:shadow-sm"
      }
      ${isAssignment ? "hover:shadow-md" : ""}`}>

      <div className="p-5 flex flex-col gap-4">

        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`shrink-0 size-10 rounded-xl flex items-center
            justify-center text-white shadow-sm ${color}`}>
            {icon}
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-[15px] text-foreground leading-snug truncate">
                {item.title || (item.type === "material" ? "Class Material" : "Post")}
              </h4>

              <div className="flex items-center gap-1.5 shrink-0">
                {isPinned && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold
                    tracking-wide uppercase bg-yellow/20 text-navy border border-yellow/40
                    rounded-full px-2 py-0.5">
                    <Pin size={9} />
                    Pinned
                  </span>
                )}
                <span className={`text-[10px] font-bold tracking-wide uppercase
                  border rounded-full px-2.5 py-0.5 ${typePill[item.type]}`}>
                  {typeLabel[item.type]}
                </span>
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
        {(item.content || item.description) && (
          <p className="text-[14px] text-foreground/80 leading-relaxed
            whitespace-pre-wrap break-words pl-[52px]">
            {item.content || item.description}
          </p>
        )}

        {/* Attachments */}
        {(item.attachment_paths || item.file_url) && (
          <div className="flex flex-wrap gap-2 pl-[52px]"
            onClick={(e) => e.stopPropagation()}>
            {Array.isArray(item.attachment_paths) ? (
              item.attachment_paths.map((path: string) => (
                <AttachmentButton
                  key={path}
                  path={path}
                  type={item.type}
                  label={getDisplayName(path)}
                />
              ))
            ) : (
              item.file_url && (
                <AttachmentButton
                  path={item.file_url}
                  type={item.type}
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
              href={`/classes/${classId}/assignments/${item.id}`}
              className="inline-flex items-center gap-2 text-[13px] font-bold
                text-navy hover:gap-3 transition-all duration-200">
              View Assignment
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}