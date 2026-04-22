"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { SummaryPill } from "@/components/features/todo";
import CalenderView from "@/components/features/dashboard/CalenderView";
import { RoleSwitcher, RoleTabKey } from "@/components/ui";

interface CalendarPageClientProps {
  done: any[];
  missing: any[];
  assigned: any[];
  teacherActive: any[];
  teacherEnded: any[];
  hasTeacherClasses: boolean;
  studentAssignments: any[];
  teacherAssignments: any[];
}

export default function CalendarPageClient({
  done,
  missing,
  assigned,
  teacherActive,
  teacherEnded,
  hasTeacherClasses,
  studentAssignments,
  teacherAssignments,
}: CalendarPageClientProps) {
  const [activeTab, setActiveTab] = useState<RoleTabKey>("student");

  const currentTabAssignments = activeTab === "student" ? studentAssignments : teacherAssignments;

  return (
    <div className="flex flex-col gap-8">
      {/* Top Bar: Tabs & Summary Pills */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Tab switcher — only show if user has teacher classes */}
        {hasTeacherClasses ? (
          <RoleSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
        ) : (
          <div className="flex items-center gap-2 text-navy/40">
             <CalendarIcon size={18} />
             <span className="text-[13px] font-bold uppercase tracking-widest">Schedule</span>
          </div>
        )}

        {/* Dynamic Summary Pills */}
        <div className="flex gap-3 flex-wrap items-center">
          {activeTab === "student" ? (
            <>
              <SummaryPill label="Assigned" count={assigned.length} variant="navy" />
              <SummaryPill label="Missing" count={missing.length} variant="red" />
              <SummaryPill label="Done" count={done.length} variant="green" />
            </>
          ) : (
            <>
              <SummaryPill label="Active" count={teacherActive.length} variant="green" />
              <SummaryPill label="Ended" count={teacherEnded.length} variant="navy" />
            </>
          )}
        </div>
      </div>

      {/* Calendar View Container */}
      <div className="bg-white border border-border/60 rounded-3xl overflow-hidden shadow-xl
        ring-8 ring-navy/[0.02]">
        <CalenderView 
          assignments={currentTabAssignments} 
          isTeacher={activeTab === "teacher"} 
        />
      </div>
    </div>
  );
}
