'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { NavLogo } from './NavLogo'
import { NavProfile } from './NavProfile'

/**
 * Navbar is the main navigation container for Class Pilot.
 * It handles the responsive layout and differentiates between authenticated and guest views.
 * 
 * @module layout/Navbar
 */
export default function Navbar() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 h-[72px] bg-navy text-white shadow-lg border-b border-white/5 backdrop-blur-md">
      <div className="w-full max-w-[1600px] mx-auto h-full flex items-center justify-between px-6 md:px-10 lg:px-12">
        {/* Branding & Logo */}
        <NavLogo />

        {/* Dynamic Navigation/Profile Section */}
        <div className="flex items-center gap-6">
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="bg-yellow text-navy font-black text-[13px] tracking-wider uppercase px-6 py-2.5 rounded-xl hover:bg-white transition-all transform active:scale-95 shadow-sm no-underline"
            >
              Sign In
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              {/* Profile component handles its own dropdown logic */}
              <NavProfile />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
