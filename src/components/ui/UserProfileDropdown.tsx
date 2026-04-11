/**
 * @file UserProfileDropdown.tsx
 * @description A generic, reusable profile dropdown for navigation bars.
 * Handles user avatar display, dropdown state, and generic user actions like settings and sign out.
 */
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, Settings } from "lucide-react";

interface UserProfile {
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
}

interface UserProfileDropdownProps {
  profile: UserProfile | null;
  onSignOut: () => void;
}

/**
 * A sophisticated, interactive user menu for the authenticated header.
 * 
 * Features:
 * - Dynamic avatar resolution with fallback to letter-based UI
 * - Accessible dropdown state management with outside-click detection
 * - Standardized navigation links to Dashboard and Profile settings
 * - Integrated session termination via the onSignOut callback
 */
export function UserProfileDropdown({ profile, onSignOut }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:border-blue-400 transition-all focus:outline-none flex items-center justify-center bg-blue-600"
      >
        {profile?.avatar_url ? (
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

      {/* Profile Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[calc(100vw-4rem)] sm:w-72 max-w-sm bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User Info Header */}
          <div className="px-4 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0 overflow-hidden text-white">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" width={40} height={40} />
                ) : (
                  <User size={20} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                  {profile?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
            >
              <User size={18} className="text-gray-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
            >
              <Settings size={18} className="text-gray-400" />
              <span>Settings</span>
            </Link>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
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
  );
}
