"use client";

import { useState } from "react";
import ClassTabs from "./ClassTabs";
import TabContent from "./TabContent";
import WavePattern from "../layout/WavePattern";
import ClassChatModal from '@/components/chat/ClassChatModal'


export default function ClassDashboardClient({
  classId,
  isTeacher,
  classCode,
  className,
  classDescription,
  userId,
  classSettings,
}: any) {
  const [activeTab, setActiveTab] = useState("stream");

  return (
    <>

      {/* HERO SECTION */}
      <ClassChatModal classId={classId} />
      <div className="relative bg-navy text-primary-foreground w-full py-16 pb-0">
        {/* Wave decoration */}
        <WavePattern />
        <div className="container  px-6 lg:px-20 relative mx-auto  pb-6">
          <div className="max-w-7xl">
            <h1 className="text-4xl font-bold text-white mb-2">{className}</h1>
            <p className="text-primary-foreground mb-6 font-medium">
              {classDescription}
            </p>
            <p className="text-primary-foreground mb-6 font-medium">
              [{isTeacher ? "Teacher" : "Student"}]
            </p>
            {/* Class Tabs */}
            <ClassTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isTeacher={isTeacher}
              classId={classId}
              classData={{
                name: className,
                description: classDescription,
                // Ensure the modal receives the current toggle state from the parent
                settings: classSettings,
              }}
            />
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="bg-[#f8fafc] min-h-screen w-full pt-10">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <TabContent
              key={classId}
              activeTab={activeTab}
              classId={classId}
              isTeacher={isTeacher}
              classCode={classCode}
              userId={userId}
              classSettings={classSettings}
            />
          </div>
        </div>
      </div>
    </>
  );
}
