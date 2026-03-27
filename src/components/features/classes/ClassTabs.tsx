// "use client";

// import {
//   PlayCircle,
//   Users,
//   ClipboardList,
//   Users2,
//   Settings,
//   Database,
// } from "lucide-react";
// import { useState } from "react";
// import ClassSettingsModal from "./Modals/ClassSettingsModal";

// export default function ClassTabs({
//   isTeacher,
//   activeTab,
//   setActiveTab,
//   classData,
//   classId,
// }: any) {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const tabs = [
//     { id: "stream", label: "Stream", icon: PlayCircle },
//     { id: "people", label: "People", icon: Users },
//     { id: "work", label: "Work", icon: ClipboardList },
//     { id: "groups", label: "Groups", icon: Users2 },
//     {
//       id: "manage",
//       label: "Manage",
//       icon: Settings,
//       hide: !isTeacher,
//       onClick: () => setIsModalOpen(true),
//     },
//   ];

//   return (
//     <>
//       {/* Changed justify-between to justify-start (default) 
//           Used gap-2 for mobile and sm:gap-3 for larger screens
//       */}
//       <div className="flex flex-wrap items-center md:justify-between gap-2 sm:gap-3 w-full relative z-10">
        
//         {/* Navigation Tabs */}
//         <div className="flex flex-wrap gap-2 sm:gap-3">

//         {tabs.map((tab) => {
//           if (tab.hide) return null;
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.id;
          
//           return (
//             <button
//             key={tab.id}
//             onClick={() =>
//               tab.onClick ? tab.onClick() : setActiveTab(tab.id)
//             }
//             className={`relative inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all overflow-hidden
//               ${
//                 isActive
//                 ? "bg-navy text-accent scale-105 shadow-sm"
//                 : "bg-primary-foreground text-navy hover:bg-white/90 shadow-sm"
//               }`}
//               >
//               <Icon
//                 size={18}
//                 className={isActive ? "text-accent" : "text-navy-light"}
//               />
//               {tab.label}
//               {isActive && (
//                 <span className="absolute bottom-0 left-0 w-full h-1 bg-accent animate-in fade-in slide-in-from-bottom-1 duration-300" />
//               )}
//             </button>
//           );
//         })}

// </div>
//         <button
//           onClick={() => setActiveTab("materials")}
//           className={`group relative inline-flex items-center gap-2 sm:gap-0 hover:space-x-2  px-4 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all duration-300 overflow-hidden
//             ${
//               activeTab === "materials"
//                 ? "bg-navy text-accent scale-105 shadow-sm"
//                 : "bg-primary-foreground text-navy hover:bg-white/90 shadow-sm"
//             }`}
//         >
//           <Database
//             size={18}
//             className={activeTab === "materials" ? "text-accent" : "text-navy-light"}
//           />

//           <span className="inline-block  sm:max-w-0 sm:overflow-hidden sm:group-hover:max-w-xs transition-all duration-500 ease-in-out">
//             <span className="text-xs  sm:text-sm font-bold sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
//               Materials
//             </span>
//           </span>

//           {activeTab === "materials" && (
//             <span className="absolute bottom-0 left-0 w-full h-1 bg-accent animate-in fade-in slide-in-from-bottom-1 duration-300" />
//           )}
//         </button>
//       </div>

//       <ClassSettingsModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         classData={{
//           ...classData,
//           id: classId,
//         }}
//       />
//     </>
//   );
// }

"use client";

import {
  PlayCircle,
  Users,
  ClipboardList,
  Users2,
  Settings,
  Database,
} from "lucide-react";
import { useState } from "react";
import ClassSettingsModal from "./Modals/ClassSettingsModal";

interface ClassTabsProps {
  isTeacher: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  classData: Record<string, unknown>;
  classId: string;
}

export default function ClassTabs({
  isTeacher,
  activeTab,
  setActiveTab,
  classData,
  classId,
}: ClassTabsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: "stream",    label: "Stream",    icon: PlayCircle    },
    { id: "people",    label: "People",    icon: Users         },
    { id: "work",      label: "Work",      icon: ClipboardList },
    { id: "groups",    label: "Groups",    icon: Users2        },
    { id: "materials", label: "Materials", icon: Database      },
    {
      id: "manage",
      label: "Manage",
      icon: Settings,
      hide: !isTeacher,
      onClick: () => setIsModalOpen(true),
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 w-full relative z-10">
        {tabs.map((tab) => {
          if (tab.hide) return null;
          const Icon     = tab.icon;
          const isActive = activeTab === tab.id && !tab.onClick;

          return (
            <button
              key={tab.id}
              onClick={() => tab.onClick ? tab.onClick() : setActiveTab(tab.id)}
              className={`relative inline-flex items-center gap-2 px-3.5 py-2
                rounded-md text-[13px] font-bold transition-all duration-200
                ${isActive
                  ? "bg-yellow text-navy shadow-sm"
                  : "bg-white/10 border border-white/15 text-white/75 hover:bg-white/18 hover:text-white"
                }`}
            >
              <Icon size={14} className={isActive ? "text-navy" : "text-white/60"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <ClassSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classData={{ ...classData, id: classId }}
      />
    </>
  );
}
