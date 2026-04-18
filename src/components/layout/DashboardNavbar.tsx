/**
 * @file DashboardNavbar.tsx
 * @description Main navigation bar for the dashboard layout.
 * Includes branding, class switcher (desktop), and user profile dropdown.
 */
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
 * - Proper loading skeleton for profile area while auth state is resolving
 */
const DashboardNavbar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();
  const { profile, signOut, isAuthenticated, loading } = useAuth();

  /** Render the appropriate profile area based on auth state */
  const renderProfileArea = () => {
    // Auth is still loading — show animated skeleton
    if (loading) {
      return (
        <div className="flex items-center gap-2 animate-pulse">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15" />
        </div>
      );
    }

    // Authenticated with profile — show full dropdown
    if (isAuthenticated && profile) {
      return <UserProfileDropdown profile={profile} onSignOut={signOut} />;
    }

    // Authenticated but profile not loaded yet (rare race) — show avatar placeholder
    if (isAuthenticated) {
      return (
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 flex items-center justify-center">
          <User size={18} className="text-white/60" />
        </div>
      );
    }

    // Explicitly not authenticated — redirect to login
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm border border-white/20 transition-all"
      >
        <User size={18} className="text-white/60" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  };

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
          {renderProfileArea()}
        </div>
      </div>

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
