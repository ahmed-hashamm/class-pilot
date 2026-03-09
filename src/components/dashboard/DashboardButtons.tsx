// "use client";

// import { Calendar, Home, Link as LinkIcon, ListTodo, Plus, FileText } from "lucide-react"; 
// import Link from "next/link"; 
// import { useState } from "react";
// import CreateClassModal from "../class/Modals/CreateClassModal";
// import JoinClassModal from "../class/Modals/JoinClassModal"; 
// import { useRouter } from "next/navigation";

// export default function DashboardButtons({ userId, role }: { userId: any, role: string }) {
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showJoinModal, setShowJoinModal] = useState(false); 
//   const router = useRouter();

//   const handleSuccess = () => {
//     router.refresh();
//   };

//   // Improved role check: handles potential casing issues
//   const isTeacher = role?.toLowerCase() === 'teacher';

//   const buttonStyle = "bg-white text-navy text-sm font-bold px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 shadow-sm border border-gray-100 whitespace-nowrap";

//   return (
//     <>
//       {/* Reduced mt-14 to mt-8 for better mobile spacing, kept flex-wrap */}
//       <div className="flex flex-wrap gap-3 mt-8 sm:mt-14">
        
//         {/* Create Classroom - Usually for Teachers only, but kept as per your logic */}
//         <button onClick={() => setShowCreateModal(true)} className={buttonStyle}>
//           <Plus size={18} className="text-navy-light" />
//           <span>Create Classroom</span>
//         </button>

//         <button onClick={() => setShowJoinModal(true)} className={buttonStyle}>
//           <LinkIcon size={18} className="text-navy-light" />
//           <span>Join Classroom</span>
//         </button>

//         {/* --- RUBRICS LINK --- */}

//           <Link href="/rubrics" className={buttonStyle}>
//             <FileText size={18} className="text-navy-light" />
//             <span>Rubrics</span>
//           </Link>

//         <Link href="/dashboard" className={buttonStyle}>
//           <Home size={18} className="text-navy-light" />
//           <span>Home</span>
//         </Link>

//         <Link href="/todo" className={buttonStyle}>
//           <ListTodo size={18} className="text-navy-light" />
//           <span>To-do</span>
//         </Link>

//         <Link href="/calendar" className={buttonStyle}>
//           <Calendar size={18} className="text-navy-light" />
//           <span>Calendar</span>
//         </Link>
//       </div>

//       {showCreateModal && userId && (
//         <CreateClassModal
//           userId={userId}
//           onClose={() => setShowCreateModal(false)}
//           onSuccess={handleSuccess}
//         />
//       )}

//       {showJoinModal && userId && (
//         <JoinClassModal
//           userId={userId}
//           onClose={() => setShowJoinModal(false)}
//           onSuccess={handleSuccess}
//         />
//       )}
//     </>
//   );
// }

"use client";

import { Calendar, Home, ListTodo, Plus, FileText, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreateClassModal from "../class/Modals/CreateClassModal";
import JoinClassModal from "../class/Modals/JoinClassModal";
import { useRouter } from "next/navigation";

export default function DashboardButtons({
  userId,
  role,
}: {
  userId: any;
  role: string;
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal,   setShowJoinModal]   = useState(false);
  const router = useRouter();

  const handleSuccess = () => router.refresh();

  // Yellow = primary CTAs, white ghost = nav links
  const primaryBtn =
    "inline-flex items-center gap-2 bg-yellow text-navy text-[13px] font-bold " +
    "px-4 py-2.5 rounded-lg hover:bg-yellow/90 hover:-translate-y-0.5 " +
    "transition-all shadow-sm whitespace-nowrap cursor-pointer border-none";

  const ghostBtn =
    "inline-flex items-center gap-2 bg-white/10 border border-white/20 " +
    "text-white/80 text-[13px] font-semibold px-4 py-2.5 rounded-lg " +
    "hover:bg-white/15 hover:text-white transition-all whitespace-nowrap";

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        <button onClick={() => setShowCreateModal(true)} className={primaryBtn}>
          <Plus size={15} />
          Create class
        </button>

        <button onClick={() => setShowJoinModal(true)} className={primaryBtn}>
          <LinkIcon size={15} />
          Join class
        </button>

        <Link href="/dashboard" className={ghostBtn}>
          <Home size={15} />
          Home
        </Link>

        <Link href="/rubrics" className={ghostBtn}>
          <FileText size={15} />
          Rubrics
        </Link>

        <Link href="/todo" className={ghostBtn}>
          <ListTodo size={15} />
          To-do
        </Link>

        <Link href="/calendar" className={ghostBtn}>
          <Calendar size={15} />
          Calendar
        </Link>
      </div>

      {showCreateModal && userId && (
        <CreateClassModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      {showJoinModal && userId && (
        <JoinClassModal
          userId={userId}
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}