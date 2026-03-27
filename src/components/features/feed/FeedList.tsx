"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { getStreamFeed } from "@/lib/db_data_fetching/stream";
import { useStreamRealtime } from "@/lib/hooks/useStreamRealtime";
import FeedCard from "./FeedCard";
import AnnouncementInput from "@/components/features/classes/Feed/AnnouncementInput";
import MaterialUpload from "@/components/features/classes/Feed/MaterialUpload";
import PollInput from "@/components/features/classes/Feed/PollInput";
import AttendanceInput from "@/components/features/classes/Feed/AttendanceInput";
import FeedActions from "./FeedActions";
import PollBody from "./PollBody";
import AttendanceBody from "./AttendanceBody";
import { useCountdown } from "@/lib/hooks/useCountdown"; // Need this if I move it
import StatusBadge from "./StatusBadge";

interface FeedListProps {
  classId: string;
  userId: string;
  isTeacher: boolean;
}

const EMPTY_ARRAY: any[] = [];

export default function FeedList({ classId, userId, isTeacher }: FeedListProps) {
  const [activeAction, setActiveAction] = useState<any>("none");

  const { data: initialFeed = EMPTY_ARRAY, isLoading: isInitialLoad } = useQuery({
    queryKey: ["streamFeed", classId],
    queryFn: () => getStreamFeed(classId),
  });

  const feedItems = useStreamRealtime(classId, initialFeed);

  if (isInitialLoad) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-5 flex gap-4 animate-pulse">
            <div className="h-12 w-12 rounded-xl bg-muted shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {isTeacher && (
        <FeedActions
          classId={classId}
          userId={userId}
          activeAction={activeAction}
          setActiveAction={setActiveAction}
        />
      )}

      <div className="flex flex-col gap-3">
        {feedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 border-2 border-dashed border-border rounded-2xl bg-white text-center">
            <Inbox size={28} className="text-muted-foreground/40" />
            <p className="text-[14px] text-muted-foreground font-medium">The feed is empty</p>
          </div>
        ) : (
          feedItems.map((item) => (
            <FeedCard key={`${item.type}-${item.id}`} item={item} classId={classId} userId={userId} isTeacher={isTeacher}>
              {item.type === "poll" && <PollBodyWrapper item={item} userId={userId} isTeacher={isTeacher} />}
              {item.type === "attendance" && <AttendanceBodyWrapper item={item} userId={userId} isTeacher={isTeacher} />}
            </FeedCard>
          ))
        )}
      </div>
    </div>
  );
}

// Wrapper to use countdown logic per item
function PollBodyWrapper({ item, userId, isTeacher }: any) {
  const { isActive } = useCountdown(item.deadline, item.closed_at);
  return <PollBody item={item} userId={userId} isTeacher={isTeacher} isActive={isActive} />;
}

function AttendanceBodyWrapper({ item, userId, isTeacher }: any) {
  const { isActive } = useCountdown(item.deadline, item.closed_at);
  return <AttendanceBody item={item} userId={userId} isTeacher={isTeacher} isActive={isActive} />;
}
