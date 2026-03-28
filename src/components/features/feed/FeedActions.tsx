"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import AnnouncementInput from "./AnnouncementInput";
import MaterialUpload from "./MaterialUpload";
import PollInput from "./PollInput";
import AttendanceInput from "./AttendanceInput";
import { FEED_ACTIONS } from "@/lib/data/feed";
import { HEIGHT_TRANSITION, TAB_INDICATOR_TRANSITION } from "@/lib/animations";

// FEED_ACTIONS is imported from @/lib/data/feed

export default function FeedActions({ classId, userId, activeAction, setActiveAction }: any) {
  return (
    <Card className="rounded-2xl shadow-sm bg-white overflow-hidden border-border">
      <CardHeader className="p-0 border-b border-border">
        <div className="flex items-center overflow-x-auto no-scrollbar relative">
          {FEED_ACTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = activeAction === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveAction(activeAction === id ? "none" : id)}
                className={`relative flex-1 min-w-fit flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold transition-all border-none bg-transparent cursor-pointer ${isActive ? "text-navy" : "text-muted-foreground hover:text-navy hover:bg-secondary/30"}`}
              >
                <Icon size={16} />
                <span className="relative z-10">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeFeedAction"
                    className="absolute inset-0 bg-navy-light/5 -z-0"
                    transition={TAB_INDICATOR_TRANSITION}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="feedUnderline"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-navy z-10"
                    transition={TAB_INDICATOR_TRANSITION}
                  />
                )}
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
      <AnimatePresence mode="wait">
        {activeAction !== "none" && (
          <motion.div
            key={activeAction}
            variants={HEIGHT_TRANSITION}
            initial="initial"
            animate="animate"
            exit="exit"
            className="overflow-hidden"
          >
            <CardContent className="p-6">
              {activeAction === "announcement" && <AnnouncementInput classId={classId} userId={userId} onSuccess={() => setActiveAction("none")} />}
              {activeAction === "material" && <MaterialUpload classId={classId} userId={userId} onSuccess={() => setActiveAction("none")} />}
              {activeAction === "poll" && <PollInput classId={classId} onSuccess={() => setActiveAction("none")} />}
              {activeAction === "attendance" && <AttendanceInput classId={classId} onSuccess={() => setActiveAction("none")} />}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
