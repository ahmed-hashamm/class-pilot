"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { profile, signOut, isAuthenticated } = useAuth();

  /* Close profile dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 h-16 bg-navy text-primary-foreground mb-[1px]">
      <div className="w-full max-w-[1600px] mx-auto h-full flex items-center justify-between px-8 md:px-12 lg:px-20">


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

        {/* Desktop Navigation */}
        {/* <nav className="hidden md:flex items-center gap-8">
          {["Solutions", "Resources", "Pricing"].map((item) => (
            <div
              key={item}
              className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors"
            >
              <span>{item}</span>
              <ChevronDown size={16} />
            </div>
          ))}
        </nav> */}

        {/* Right Section */}
        <div className="flex items-center  gap-4 relative">
          {!isAuthenticated ? (
            <Link
              href="/login"
              className="bg-yellow text-navy font-semibold px-5 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              Sign in to Class Pilot
            </Link>
          ) : (
            <div ref={profileRef} className="relative">
              {/* Profile Button with Avatar */}
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-accent hover:border-accent/80 transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-navy"
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
                  <div className="w-full  h-full bg-accent flex items-center justify-center">
                    <User className="text-accent-foreground" size={20} />
                  </div>
                )}
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute top-12 w-screen h-screen -right-6 md:top-12 md:w-72 md:h-max bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50  ">
                  {/* User Info Header */}
                  <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center gap-3">
                      {profile?.avatar_url ? (
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                          <Image
                            src={profile.avatar_url}
                            alt={profile.name || 'User'}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                          <User className="text-accent-foreground" size={24} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {profile?.name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {profile?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                    >
                      <User size={18} />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-gray-700 transition-colors"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>

                    <div className="border-t border-gray-200 my-1"></div>

                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        signOut()
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 text-sm w-full transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        {/* <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button> */}
      </div>


    </header>
  );
};

export default Navbar;
