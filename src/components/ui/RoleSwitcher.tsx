"use client";

import { LucideIcon, BookOpen, GraduationCap } from "lucide-react";

export type RoleTabKey = "student" | "teacher";

interface RoleSwitcherProps {
  activeTab: RoleTabKey;
  onTabChange: (tab: RoleTabKey) => void;
  className?: string;
}

const TABS: { key: RoleTabKey; label: string; icon: LucideIcon }[] = [
  { key: "student", label: "My Work", icon: BookOpen },
  { key: "teacher", label: "My Classes", icon: GraduationCap },
];

export function RoleSwitcher({ activeTab, onTabChange, className }: RoleSwitcherProps) {
  return (
    <div className={`flex gap-1 p-1 bg-navy/[0.04] rounded-xl border border-navy/[0.06] w-fit h-fit ${className || ''}`}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[13px] font-bold
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
  );
}
