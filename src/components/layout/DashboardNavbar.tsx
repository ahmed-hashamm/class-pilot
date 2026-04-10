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

const DashboardNavbar = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();
  const { profile, signOut, isAuthenticated } = useAuth();

  return (
    <nav className="border-b border-gray-200 bg-navy text-primary-foreground sticky top-0 z-50">
      <div className="w-full max-w-[1600px] mx-auto flex h-16 items-center justify-between px-8 md:px-12 lg:px-16">

        {/* Logo */}
        <Link href="/" className="flex items-center group shrink-0">
          <div className="relative w-14 h-14">
            <Image
              src="/logo.png"
              alt="Class Pilot"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-xl font-bold tracking-tight">Class <span className="text-navy-light">Pilot</span></p>
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
