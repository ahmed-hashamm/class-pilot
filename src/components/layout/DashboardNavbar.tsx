// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Menu, X, ChevronDown, User, LogOut, Settings, Plus } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { createClient } from "@/lib/supabase/client";
// import CreateClassModal from "@/components/class/Modals/CreateClassModal";

// const DashboardNavbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);
//   const profileRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const supabase = createClient();

//   const { profile, signOut, isAuthenticated } = useAuth();

//   useEffect(() => {
//     // Get user ID when component mounts or auth state/profile changes
//     const getUserId = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         setUserId(user.id);
//       }
//     };
//     // Check when authenticated or when profile is available
//     if (isAuthenticated || profile) {
//       getUserId();
//     }
//   }, [isAuthenticated, profile]);

//   /* Close profile dropdown on outside click */
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(e.target as Node)
//       ) {
//         setProfileOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   return (
//     <nav className="border-b border-gray-200 bg-navy text-primary-foreground sticky top-0 z-50">
//       <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-20">
//         <div className="flex items-center space-x-8">
//           <Link href="/dashboard" className="flex items-center space-x-2">
//             <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
//               <span className=" font-bold">CP</span>
//             </div>
//             <span className="text-xl font-bold">Class Pilot</span>
//           </Link>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-4 relative">
//           {/* Action Icons */}
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className="p-2 transition-colors"
//             title="Create"
//           >
//             <Plus size={20} />
//           </button>
//           <Link
//             href="/dashboard/profile"
//             className="p-2 transition-colors"
//             title="Settings"
//           >
//             <Settings size={20} />
//           </Link>
          
//           {isAuthenticated && profile ? (
//             <div ref={profileRef} className="relative">
//               {/* Profile Button with Avatar */}
//               <button
//                 onClick={() => setProfileOpen((p) => !p)}
//                 className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               >
//                 {profile.avatar_url ? (
//                   <Image
//                     src={profile.avatar_url}
//                     alt={profile.name || 'User'}
//                     width={40}
//                     height={40}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-blue-600 flex items-center justify-center">
//                     <User className="text-white" size={20} />
//                   </div>
//                 )}
//               </button>

//               {/* Profile Dropdown */}
//               {profileOpen && (
//                 <div className="absolute right-0 top-12 w-72 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
//                   {/* User Info Header */}
//                   <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
//                     <div className="flex items-center gap-3">
//                       {profile.avatar_url ? (
//                         <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
//                           <Image
//                             src={profile.avatar_url}
//                             alt={profile.name || 'User'}
//                             width={48}
//                             height={48}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
//                       ) : (
//                         <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
//                           <User className="text-white" size={24} />
//                         </div>
//                       )}
//                       <div className="flex-1 min-w-0">
//                         <p className="font-semibold text-gray-900 truncate">
//                           {profile.name || 'User'}
//                         </p>
//                         <p className="text-sm text-gray-500 truncate">
//                           {profile.email}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Menu Items */}
//                   <div className="p-2">
//                     <Link
//                       href="/dashboard"
//                       onClick={() => setProfileOpen(false)}
//                       className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
//                     >
//                       <User size={18} />
//                       <span>Dashboard</span>
//                     </Link>
                    
//                     <Link
//                       href="/dashboard/profile"
//                       onClick={() => setProfileOpen(false)}
//                       className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
//                     >
//                       <Settings size={18} />
//                       <span>Settings</span>
//                     </Link>

//                     <div className="border-t border-gray-200 my-1"></div>

//                     <button
//                       onClick={() => {
//                         setProfileOpen(false)
//                         signOut()
//                       }}
//                       className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-sm w-full transition-colors"
//                     >
//                       <LogOut size={18} />
//                       <span>Sign Out</span>
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//               <User className="text-gray-600" size={20} />
//             </div>
//           )}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           className="md:hidden"
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         >
//           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
//           <nav className="flex flex-col gap-4">
//             <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
//               Dashboard
//             </Link>
//             <Link href="/dashboard/classes" className="text-gray-700 hover:text-gray-900">
//               Classes
//             </Link>
//             <Link href="/dashboard/rubrics" className="text-gray-700 hover:text-gray-900">
//               Rubrics
//             </Link>
//             <Link href="/dashboard/calendar" className="text-gray-700 hover:text-gray-900">
//               Calendar
//             </Link>
//             {isAuthenticated && profile && (
//               <div className="pt-4 border-t border-gray-200">
//                 <div className="px-3 py-2 text-sm">
//                   <p className="font-semibold text-gray-900">{profile.name}</p>
//                   <p className="text-sm text-gray-500">{profile.email}</p>
//                 </div>
//                 <button
//                   onClick={signOut}
//                   className="mt-2 bg-red-600 text-white px-5 py-2 rounded-lg w-full"
//                 >
//                   Sign Out
//                 </button>
//               </div>
//             )}
//           </nav>
//         </div>
//       )}

//       {showCreateModal && userId && (
//         <CreateClassModal
//           userId={userId}
//           onClose={() => setShowCreateModal(false)}
//           onSuccess={() => {
//             router.refresh();
//           }}
//         />
//       )}
//     </nav>
//   );
// };

// export default DashboardNavbar;


"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import CreateClassModal from "@/components/class/Modals/CreateClassModal";

const DashboardNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const { profile, signOut, isAuthenticated } = useAuth();

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    if (isAuthenticated || profile) getUserId();
  }, [isAuthenticated, profile]);

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="border-b border-gray-200 bg-navy text-primary-foreground sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-20">
        
        {/* Left Section: Logo */}
           {/* Logo */}
           <Link href="/" className="flex items-center  group">
          <div className="relative w-14 h-14"> {/* Added a wrapper with specific dimensions */}
            <Image
              src="/logo.png"
              alt="Class Pilot"
              fill
              className="object-contain" // object-contain ensures the logo isn't cropped
              priority
            />
          </div>
          <p className="text-xl font-bold tracking-tight">Class <span className="text-navy-light">Pilot</span></p>
        </Link>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Quick Action: Create Class */}
          {/* <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Create Class"
          >
            <Plus size={22} />
          </button> */}

          {isAuthenticated && profile ? (
            <div ref={profileRef} className="relative">
              {/* Profile Avatar Button */}
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-400 transition-all focus:outline-none flex items-center justify-center bg-blue-600"
              >
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.name || 'User'}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-white" size={20} />
                )}
              </button>

              {/* Profile Dropdown: Positioned for both Mobile & Desktop */}
              {profileOpen && (
                <div className="absolute right-0 top-12 w-screen sm:w-72 max-w-sm bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 overflow-hidden text-white">
                        {profile.avatar_url ? (
                           <Image src={profile.avatar_url} alt="Avatar" width={40} height={40} />
                        ) : <User size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                          {profile.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                    >
                      <User size={18} className="text-gray-400" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                    >
                      <Settings size={18} className="text-gray-400" />
                      <span>Settings</span>
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 text-sm w-full transition-colors text-left"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <User className="text-white/60" size={20} />
            </div>
          )}
        </div>
      </div>

      {/* Modal - The full-width logic is usually handled inside CreateClassModal via Tailwind 'w-full max-w-md' etc. */}
      {showCreateModal && userId && (
        <CreateClassModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            router.refresh();
          }}
        />
      )}
    </nav>
  );
};

export default DashboardNavbar;