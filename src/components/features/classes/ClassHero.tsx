"use client";

import WavePattern from "@/components/layout/WavePattern";
import ClassTabs from "./ClassTabs";

interface ClassHeroProps {
  className: string;
  classDescription: string | null;
  isTeacher: boolean;
  activeTab: string;
  onTabChange: (newTab: string) => void;
  classId: string;
  classSettings: any;
}

/**
 * The visual header for a specific class room.
 * 
 * Features:
 * - High-impact title and description display
 * - Dynamic "Teacher" or "Student" role badge with themed colors
 * - Animated WavePattern background
 * - Integrates the ClassTabs navigation component
 */
export default function ClassHero({
  className,
  classDescription,
  isTeacher,
  activeTab,
  onTabChange,
  classId,
  classSettings,
}: ClassHeroProps) {
  return (
    <div className="relative z-40 bg-navy text-white w-full pt-10 pb-0">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,_rgba(79,156,249,.18)_0%,_transparent_70%)]"
      />

      <WavePattern />

      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 relative pb-8">
        <div className="w-full">
          {/* Role badge */}
          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold
            tracking-widest uppercase rounded-full px-2.5 py-1 mb-4 border
            ${isTeacher
              ? "bg-yellow/15 text-yellow border-yellow/30"
              : "bg-navy-light/20 text-navy-light border-navy-light/30"
            }`}>
            <span className={`size-1.5 rounded-full inline-block
              ${isTeacher ? "bg-yellow" : "bg-navy-light"}`} />
            {isTeacher ? "Teacher" : "Student"}
          </span>

          {/* Class name */}
          <h1 className="font-black text-[clamp(22px,4vw,40px)] tracking-tight
            leading-tight text-white mb-2">
            {className}
          </h1>

          {/* Description */}
          {classDescription && (
            <p className="text-white/55 text-[14px] font-light leading-relaxed
              max-w-xl mb-6">
              {classDescription}
            </p>
          )}

          {/* Tabs */}
          <ClassTabs
            activeTab={activeTab}
            setActiveTab={onTabChange}
            isTeacher={isTeacher}
            classId={classId}
            classData={{
              name: className,
              description: classDescription,
              settings: classSettings,
            }}
          />
        </div>
      </div>
    </div>
  );
}
