// "use client";

// import { useState } from "react";
// import ClassTabs from "./ClassTabs";
// import TabContent from "./TabContent";
// import WavePattern from "../layout/WavePattern";
// import ClassChatModal from '@/components/chat/ClassChatModal'


// export default function ClassDashboardClient({
//   classId,
//   isTeacher,
//   classCode,
//   className,
//   classDescription,
//   userId,
//   classSettings,
// }: any) {
//   const [activeTab, setActiveTab] = useState("stream");

//   return (
//     <>

//       {/* HERO SECTION */}
//       <ClassChatModal classId={classId} />
//       <div className="relative bg-navy text-primary-foreground w-full py-16 pb-0">
//         {/* Wave decoration */}
//         <WavePattern />
//         <div className="container  px-6 lg:px-20 relative mx-auto  pb-6">
//           <div className="max-w-7xl">
//             <h1 className="text-4xl font-bold text-white mb-2">{className}</h1>
//             <p className="text-primary-foreground mb-6 font-medium">
//               {classDescription}
//             </p>
//             <p className="text-primary-foreground mb-6 font-medium">
//               [{isTeacher ? "Teacher" : "Student"}]
//             </p>
//             {/* Class Tabs */}
//             <ClassTabs
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//               isTeacher={isTeacher}
//               classId={classId}
//               classData={{
//                 name: className,
//                 description: classDescription,
//                 // Ensure the modal receives the current toggle state from the parent
//                 settings: classSettings,
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* CONTENT SECTION */}
//       <div className="bg-[#f8fafc] min-h-screen w-full pt-10">
//         <div className="container mx-auto px-6 lg:px-20">
//           <div className="max-w-7xl mx-auto">
//             <TabContent
//               key={classId}
//               activeTab={activeTab}
//               classId={classId}
//               isTeacher={isTeacher}
//               classCode={classCode}
//               userId={userId}
//               classSettings={classSettings}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import ClassTabs from "./ClassTabs";
import TabContent from "./TabContent";
import WavePattern from "../layout/WavePattern";
import ClassChatModal from "@/components/chat/ClassChatModal";

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
      <ClassChatModal classId={classId} />

      {/* HERO */}
      <div className="relative bg-navy text-white w-full pt-10 pb-0 overflow-hidden">
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% -10%, rgba(79,156,249,.18) 0%, transparent 70%)",
          }}
        />

        <WavePattern />

        <div className="container px-6 lg:px-20 relative mx-auto pb-8">
          <div className="max-w-7xl">

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
              setActiveTab={setActiveTab}
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

      {/* CONTENT */}
      <div className="bg-background min-h-screen w-full pt-8">
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