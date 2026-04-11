/**
 * @file DashboardNavbar.tsx
 * @description Main navigation bar for the dashboard layout.
 * Includes branding, class switcher (desktop), and user profile dropdown.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import CreateClassModal from "@/components/features/classes/modals/CreateClassModal";
import { UserProfileDropdown } from "@/components/ui/UserProfileDropdown";

/**
 * Specialized navigation bar for the authenticated Dashboard.
 * 
 * Features:
 * - Persistent branding with quick return-to-home functionality
 * - Integrated Class Switcher for seamless classroom hopping
 * - Global "Create Class" modal orchestration
 * - Standardized UserProfileDropdown for profile and session management
 */
const DashboardNavbar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();
  const { profile, signOut, isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 h-14 bg-navy text-primary-foreground mb-[1px]">
      <div className="w-full max-w-[1600px] mx-auto h-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-16 gap-2 sm:gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group text-white decoration-0 no-underline shrink-0">
          <div className="relative w-8 h-8 sm:w-12 sm:h-12 shrink-0">
            <Image
              src="/logo.png"
              alt="Class Pilot"
              fill
              sizes="(max-width: 640px) 32px, 48px"
              className="object-contain"
              priority
            />
          </div>
          <p className="text-base sm:text-xl font-bold tracking-tight whitespace-nowrap hidden min-[350px]:block">Class <span className="text-navy-light">Pilot</span></p>
        </Link>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-6">

          {/* Class Switcher */}
          <div className="hidden md:flex items-center transition-all">
            {/* <ClassSwitcher /> */}
          </div>

          {/* Quick Action: Create Class */}
          {/* <button
            onClick={() => setShowCreateModal(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            title="Create Class"
          >
            <Plus size={22} />
          </button> */}

          {isAuthenticated ? (
            <UserProfileDropdown profile={profile} onSignOut={signOut} />
          ) : (
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-white/80 text-sm border border-white/20 transition-all"
              title="Click to Logout if profile is not loading"
            >
              <User size={18} className="text-white/60" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal - The full-width logic is usually handled inside CreateClassModal via Tailwind 'w-full max-w-md' etc. */}
      {showCreateModal && profile && (
        <CreateClassModal
          userId={profile.id}
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
