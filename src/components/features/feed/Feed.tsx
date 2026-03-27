"use client";

import FeedList from "@/components/features/feed/FeedList";

interface FeedProps {
  classId: string;
  userId: string;
  isTeacher: boolean;
}

export default function Feed({ classId, userId, isTeacher }: FeedProps) {
  return <FeedList classId={classId} userId={userId} isTeacher={isTeacher} />;
}
