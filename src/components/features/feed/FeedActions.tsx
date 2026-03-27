"use client";

import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Megaphone, FileUp, BarChart2, CheckSquare, PlusCircle } from "lucide-react";
import AnnouncementInput from "@/components/features/classes/Feed/AnnouncementInput";
import MaterialUpload from "@/components/features/classes/Feed/MaterialUpload";
import PollInput from "@/components/features/classes/Feed/PollInput";
import AttendanceInput from "@/components/features/classes/Feed/AttendanceInput";
import { FEED_ACTIONS } from "@/lib/data/feed";

// FEED_ACTIONS is imported from @/lib/data/feed

export default function FeedActions({ classId, userId, activeAction, setActiveAction }: any) {
  return (
    <Card className="rounded-2xl shadow-sm bg-white overflow-hidden border-border">
      <CardHeader className="p-0 border-b border-border">
        <div className="flex items-center overflow-x-auto no-scrollbar">
          {FEED_ACTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = activeAction === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveAction(activeAction === id ? "none" : id)}
                className={`relative flex-1 min-w-fit flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all border-none bg-transparent cursor-pointer ${isActive ? "text-navy bg-navy-light/5" : "text-muted-foreground hover:text-navy hover:bg-secondary/30"}`}
              >
                <Icon size={16} />
                {label}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-1 bg-navy" />}
              </button>
            );
          })}
          <Link href={`/classes/${classId}/assignments/create`} className="flex-1 min-w-fit">
            <button className="w-full h-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold text-muted-foreground hover:text-navy hover:bg-secondary/30 transition-all cursor-pointer border-none bg-transparent">
              <PlusCircle size={16} />
              Assignment
            </button>
          </Link>
        </div>
      </CardHeader>
      {activeAction !== "none" && (
        <CardContent className="p-6">
          {activeAction === "announcement" && <AnnouncementInput classId={classId} userId={userId} />}
          {activeAction === "material" && <MaterialUpload classId={classId} userId={userId} onSuccess={() => setActiveAction("none")} />}
          {activeAction === "poll" && <PollInput classId={classId} onSuccess={() => setActiveAction("none")} />}
          {activeAction === "attendance" && <AttendanceInput classId={classId} onSuccess={() => setActiveAction("none")} />}
        </CardContent>
      )}
    </Card>
  );
}
