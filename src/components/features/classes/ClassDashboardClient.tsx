"use client";

import { useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import TabContent from "./TabContent";
import ClassChatModal from "@/components/features/ai/ClassChatModal";
import ClassHero from "./ClassHero";

/**
 * Orchestrator for the classroom view.
 * 
 * Responsibilities:
 * - Manages the active tab state (Stream, Classwork, People, etc.)
 * - Synchronizes tab state with the URL search parameters for link sharing
 * - Hosts the persistent AI Chat modal for the classroom
 * - Composes the ClassHero and TabContent layouts
 */
export default function ClassDashboardClient({
  classId,
  isTeacher,
  classCode,
  className,
  classDescription,
  userId,
  classSettings,
}: any) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialTab = searchParams.get("tab") || "stream";
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <ClassChatModal classId={classId} />

      <ClassHero
        className={className}
        classDescription={classDescription}
        isTeacher={isTeacher}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        classId={classId}
        classSettings={classSettings}
      />

      <div className="bg-background min-h-screen w-full pt-8">
        <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16">
          <div className="w-full">
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
