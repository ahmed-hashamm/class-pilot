"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import AttachmentButton from "@/components/class/Buttons/AttachmentButton";
import {
  Clock,
  Megaphone,
  PlusCircle,
  FileUp,
  ArrowRight
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

export default function Feed({ classId, userId, isTeacher }: FeedProps) {
  const announcements = useRealtimeAnnouncements(classId, userId);
  const assignments = useRealtimeAssignments(classId, userId);
  const materials = useRealtimeMaterials(classId, userId);

  const [activeAction, setActiveAction] = useState<TeacherAction>("none");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoad(false), 800);
    return () => clearTimeout(timer);
  }, [announcements, assignments, materials]);

  const feedItems = useMemo(() => {
    const combined = [
      ...announcements.map((a) => ({ ...a, type: "announcement" as const })),
      ...assignments.map((a) => ({ ...a, type: "assignment" as const })),
      ...materials.map((m) => ({ ...m, type: "material" as const })),
    ];

    return [...combined].sort((a, b) => {
      const aPinned = a.type === 'announcement' && (a as any).pinned ? 1 : 0;
      const bPinned = b.type === 'announcement' && (b as any).pinned ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [announcements, assignments, materials]);

  return (
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
      {isTeacher && (
        <div className="space-y-4">
          {/* TEACHER ACTIONS BAR - Responsive horizontal scroll/flex */}
          <div className="flex items-center border-b border-gray-200 bg-white rounded-t-2xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveAction(activeAction === "announcement" ? "none" : "announcement")}
              className={`flex-1 min-w-fit relative flex items-center justify-center gap-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors hover:text-purple-600 ${activeAction === "announcement" ? "text-purple-600" : "text-gray-500"
                }`}
            >
              <Megaphone size={16} className="sm:w-[18px]" />
              <span className="whitespace-nowrap">Announcement</span>
              {activeAction === "announcement" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
              )}
            </button>

            <button
              onClick={() => setActiveAction(activeAction === "material" ? "none" : "material")}
              className={`flex-1 min-w-fit relative flex items-center justify-center gap-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium transition-colors hover:text-emerald-600 ${activeAction === "material" ? "text-emerald-600" : "text-gray-500"
                }`}
            >
              <FileUp size={16} className="sm:w-[18px]" />
              <span className="whitespace-nowrap">Material</span>
              {activeAction === "material" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
              )}
            </button>

            <Link href={`/classes/${classId}/assignments/create`} className="flex-1 min-w-fit">
              <button className="w-full flex items-center justify-center gap-2 px-3 sm:px-6 py-4 text-xs sm:text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
                <PlusCircle size={16} className="sm:w-[18px]" />
                <span className="whitespace-nowrap">Assignment</span>
              </button>
            </Link>
          </div>

          <div className="bg-gray-50/50 p-1 rounded-b-2xl border-x border-b border-gray-100">
            {activeAction === "announcement" && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                <AnnouncementInput classId={classId} userId={userId} />
              </div>
            )}
            {activeAction === "material" && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                <MaterialUpload classId={classId} userId={userId} onSuccess={() => setActiveAction("none")} />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {isInitialLoad ? (
          <Loader text="Loading feed" border="border-navy" />
        ) : feedItems.length === 0 ? (
          <Card className="rounded-2xl shadow-sm border-dashed border-2">
            <CardContent className="py-12 text-center text-gray-500 italic">The feed is empty.</CardContent>
          </Card>
        ) : (
          feedItems.map((item) => (
            <FeedCard key={`${item.type}-${item.id}`} item={item} classId={classId} />
          ))
        )}
      </div>
    </div>
  );
}

function FeedCard({ item, classId }: { item: any; classId: string }) {
  const { icon, color, bg, textColor } = getFeedIconConfig(item);
  const isAssignment = item.type === "assignment";
  const isPinned = item.type === "announcement" && item.pinned;

  const getDisplayName = (path: string) => {
    const fileName = path.split('/').pop() || "File";
    const parts = fileName.split('-');
    return parts.length > 1 ? parts.slice(1).join('-') : fileName;
  };

  const CardContentUI = (
    <CardContent className="p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 relative">
      <div className="min-w-0 flex-1 absolute right-7 top-7">
        {isPinned && <span className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase block mb-0.5 sm:mb-1">📌 Pinned</span>}
      </div>
      {/* Icon - Smaller on mobile */}
      <div className={` flex items-center justify-start gap-4`}>
        <div className={` flex items-center justify-center text-white ${color} h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl  shrink-0 shadow-sm`}>{icon}</div>
        <h4 className="font-bold text-gray-900 truncate text-base sm:text-lg leading-tight">
          {item.title || (item.type === "material" ? "Class Material" : "Post")}
        </h4>
      </div>

      <div className="flex-1 min-w-0">

        <div className="flex items-start justify-between gap-2 mt-1">
          <p className="text-[11px] sm:text-xs text-gray-400  flex items-center gap-1">
            <span className="truncate max-w-[100px] sm:max-w-none">{item.users?.full_name || "Teacher"}</span> • <Clock size={10} className="sm:w-[12px]" />
            {new Date(item.created_at).toLocaleDateString()}
          </p>
          <span className={`shrink-0 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-full uppercase self-start ${bg} ${textColor}`}>
            {item.type}
          </span>
        </div>

        <div className="mt-3 sm:mt-4 text-gray-700 text-sm whitespace-pre-wrap break-words">
          {item.content || item.description}
        </div>

        {/* ATTACHMENTS - Wrap nicely on mobile */}
        {(item.attachment_paths || item.file_url) && (
          <div className="flex flex-wrap gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
            {Array.isArray(item.attachment_paths) ? (
              item.attachment_paths.map((path: string) => (
                <div key={path} className="max-w-full">
                  <AttachmentButton
                    path={path}
                    type={item.type}
                    label={getDisplayName(path)}
                  />
                </div>
              ))
            ) : (
              item.file_url && (
                <div className="max-w-full">
                  <AttachmentButton
                    path={item.file_url}
                    type={item.type}
                    label={getDisplayName(item.file_url)}
                  />
                </div>
              )
            )}
          </div>
        )}

        {isAssignment && (
          <Link href={`/classes/${classId}/assignments/${item.id}`} className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex justify-end">
            <div className="flex items-center gap-2 text-xs sm:text-sm cursor-pointer font-bold text-blue-600 hover:text-blue-700">
              View Assignment <ArrowRight size={14} className="sm:w-[16px]" />
            </div>
          </Link>
        )}
      </div>
    </CardContent>
  );

  return (
    <Card className={`rounded-2xl transition-all border shadow-sm ${isPinned ? "border-blue-500 ring-1 ring-blue-500/10" : "border-gray-200"
      } ${isAssignment ? "hover:border-blue-300 hover:shadow-md" : ""}`}>
      {CardContentUI}
    </Card>
  );
}