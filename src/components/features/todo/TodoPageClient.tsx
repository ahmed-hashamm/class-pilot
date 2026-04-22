"use client";

import { useState } from "react";
import {
  CheckCircle2, Inbox, Clock, AlertCircle,
  BookOpen, GraduationCap, XCircle,
} from "lucide-react";
import { TodoSection, SummaryPill } from "@/components/features/todo";
import { TeacherTodoItem } from "@/components/features/todo/TeacherTodoItem";
import { TodoAssignment } from "@/lib/db_data_fetching/todo";

interface TodoPageClientProps {
  done: TodoAssignment[];
  missing: TodoAssignment[];
  assigned: TodoAssignment[];
  userId: string;
  myGroupIds: string[];
  teacherActive: TodoAssignment[];
  teacherEnded: TodoAssignment[];
  hasTeacherClasses: boolean;
}

const TABS = [
  { key: "student", label: "My Work", icon: BookOpen },
  { key: "teacher", label: "My Classes", icon: GraduationCap },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function TodoPageClient({
  done,
  missing,
  assigned,
  userId,
  myGroupIds,
  teacherActive,
  teacherEnded,
  hasTeacherClasses,
}: TodoPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("student");

  return (
    <>
      {/* Tab switcher — only show if user has teacher classes */}
      {hasTeacherClasses && (
        <div className="flex gap-1 p-1 bg-navy/[0.04] rounded-xl border border-navy/[0.06] w-fit">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold
                  transition-all duration-300
                  ${isActive
                    ? "bg-navy text-white shadow-md"
                    : "text-navy/50 hover:text-navy hover:bg-navy/5"
                  }`}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Student tab content */}
      {activeTab === "student" && (
        <>
          {/* Summary badges */}
          <div className="flex gap-3 flex-wrap">
            <SummaryPill label="Assigned" count={assigned.length} variant="navy" />
            <SummaryPill label="Missing" count={missing.length} variant="red" />
            <SummaryPill label="Done" count={done.length} variant="green" />
          </div>

          <div className="flex flex-col gap-12">
            <TodoSection
              title="Assigned"
              icon={<Clock size={16} />}
              items={assigned}
              emptyIcon={<Inbox size={32} />}
              emptyTitle="All caught up!"
              emptyDesc="No upcoming deadlines."
              status="assigned"
              userId={userId}
              myGroupIds={myGroupIds}
            />

            {missing.length > 0 && (
              <TodoSection
                title="Missing"
                icon={<AlertCircle size={16} />}
                items={missing}
                emptyIcon={<CheckCircle2 size={32} />}
                emptyTitle="Nothing missing"
                emptyDesc="Great job!"
                status="missing"
                userId={userId}
                myGroupIds={myGroupIds}
              />
            )}

            <TodoSection
              title="Done"
              icon={<CheckCircle2 size={16} />}
              items={done}
              emptyIcon={<Inbox size={32} />}
              emptyTitle="No completed work yet"
              emptyDesc="Submit an assignment to see it here."
              status="done"
              userId={userId}
              myGroupIds={myGroupIds}
            />
          </div>
        </>
      )}

      {/* Teacher tab content */}
      {activeTab === "teacher" && (
        <>
          {/* Summary badges */}
          <div className="flex gap-3 flex-wrap">
            <SummaryPill label="Active" count={teacherActive.length} variant="green" />
            <SummaryPill label="Ended" count={teacherEnded.length} variant="navy" />
          </div>

          <div className="flex flex-col gap-12">
            {/* Active assignments */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <p className="text-[12px] font-black tracking-[.25em] uppercase text-navy/40
                  flex items-center gap-2">
                  <Clock size={16} /> <span>Active</span>
                </p>
                <span className="text-[11px] font-bold bg-navy/5 text-navy/40 px-2 py-0.5 rounded-lg border border-navy/5">
                  {teacherActive.length} {teacherActive.length === 1 ? "Item" : "Items"}
                </span>
              </div>
              {teacherActive.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-20
                  border-2 border-dashed border-border/40 rounded-3xl bg-white/40 text-center shadow-sm">
                  <div className="text-navy/20 mb-2"><Inbox size={32} /></div>
                  <p className="font-black text-[16px] text-navy tracking-tight">No active assignments</p>
                  <p className="text-[13px] text-muted-foreground font-medium">Create an assignment in one of your classes.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {teacherActive.map((a) => (
                    <TeacherTodoItem key={a.id} assignment={a} />
                  ))}
                </div>
              )}
            </div>

            {/* Ended assignments */}
            {teacherEnded.length > 0 && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <p className="text-[12px] font-black tracking-[.25em] uppercase text-navy/40
                    flex items-center gap-2">
                    <XCircle size={16} /> <span>Ended</span>
                  </p>
                  <span className="text-[11px] font-bold bg-navy/5 text-navy/40 px-2 py-0.5 rounded-lg border border-navy/5">
                    {teacherEnded.length} {teacherEnded.length === 1 ? "Item" : "Items"}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {teacherEnded.map((a) => (
                    <TeacherTodoItem key={a.id} assignment={a} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
