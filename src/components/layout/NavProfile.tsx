'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, LogOut, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { DROPDOWN_VARIANTS } from '@/lib/animations'

/**
 * NavProfile manages the authenticated user's profile trigger and dropdown menu.
 */
export function NavProfile() {
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { profile, signOut } = useAuth()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={profileRef} className="relative">
      <button
        onClick={() => setProfileOpen((p) => !p)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-white transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-navy cursor-pointer bg-transparent"
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
          <div className="w-full h-full bg-accent flex items-center justify-center">
            <User className="text-accent-foreground" size={20} />
          </div>
        )}
      </button>

      <AnimatePresence>
        {profileOpen && (
          <motion.div
            variants={DROPDOWN_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-12 -right-2 w-72 bg-white text-gray-800 rounded-2xl shadow-2xl border border-border overflow-hidden z-50 origin-top-right"
          >
            <div className="px-6 py-5 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-4">
                {profile?.avatar_url ? (
                  <div className="size-12 rounded-full overflow-hidden border-2 border-border shadow-sm">
                    <Image
                      src={profile.avatar_url}
                      alt={profile.name || 'User'}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="size-12 rounded-full bg-accent flex items-center justify-center">
                    <User className="text-accent-foreground" size={24} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[15px] tracking-tight text-navy truncate">
                    {profile?.name || 'User'}
                  </p>
                  <p className="text-[12px] text-muted-foreground truncate font-medium">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <Link
                href="/dashboard"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-[14px] font-bold text-navy transition-all hover:translate-x-1"
              >
                <User size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/dashboard/profile"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-[14px] font-bold text-navy transition-all hover:translate-x-1"
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>

              <div className="border-t border-border my-2 mx-2"></div>

              <button
                onClick={() => {
                  setProfileOpen(false)
                  signOut()
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-[14px] font-bold w-full transition-all hover:translate-x-1 bg-transparent border-none cursor-pointer"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
