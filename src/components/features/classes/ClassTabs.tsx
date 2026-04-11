"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TAB_INDICATOR_TRANSITION } from "@/lib/animations";
import ClassSettingsModal from "./modals/ClassSettingsModal";
import { CLASS_TABS } from "@/lib/data/classes";
import ClassSwitcher from "@/components/layout/ClassSwitcher";

interface ClassTabsProps {
  isTeacher: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  classData: Record<string, unknown>;
  classId: string;
}

/**
 * Horizontal navigation menu for the classroom.
 * 
 * Features:
 * - Tab switching with active state indicators
 * - Dynamic tab generation (hiding specific tabs for students)
 * - Class Settings trigger (Teachers only)
 * - Global ClassSwitcher integration for quick context jumping
 */
export default function ClassTabs({
  isTeacher,
  activeTab,
  setActiveTab,
  classData,
  classId,
}: ClassTabsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = CLASS_TABS(isTeacher, () => setIsModalOpen(true));

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full relative z-10">
        {tabs.map((tab) => {
          if (tab.hide) return null;
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !tab.onClick;

          return (
            <Button
              key={tab.id}
              variant={isActive ? "yellow" : "ghost"}
              size="sm"
              onClick={() => tab.onClick ? tab.onClick() : setActiveTab(tab.id)}
              className={`relative inline-flex items-center gap-2 px-3.5 py-2
                rounded-md text-[13px] font-bold transition-all duration-200 h-auto
                ${isActive
                  ? "shadow-sm"
                  : "bg-white/10 border border-white/15 text-white/75 hover:bg-white/18 hover:text-white"
                }`}
            >
              <Icon size={14} className={`shrink-0 ${isActive ? "text-navy" : "text-white/60"}`} />
              {tab.label}
            </Button>
          );
        })}

        <div className="shrink-0 ml-auto">
          <ClassSwitcher />
        </div>
      </div>

      <ClassSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classData={{ ...classData, id: classId }}
      />
    </>
  );
}
