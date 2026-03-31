'use client'

import WavePattern from "@/components/layout/WavePattern"
import { SkeletonLoader } from "@/components/ui/SkeletonLoader"

/**
 * High-fidelity skeleton for the Class Dashboard page.
 * Mimics ClassHero and StreamView layout to prevent layout shifts.
 */
export default function ClassPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Skeleton (Navy Header) */}
      <div className="relative z-40 bg-navy text-white w-full pt-10 pb-0 overflow-hidden">
        {/* Mirroring ClassHero's background patterns */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,_rgba(79,156,249,.18)_0%,_transparent_70%)]" />
        <WavePattern />
        
        <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 relative pb-8">
          <div className="w-full">
            {/* Role badge skeleton */}
            <div className="h-5 w-20 rounded-full bg-white/10 animate-pulse mb-4 border border-white/10" />
            
            {/* Class name skeleton (Dynamic width) */}
            <div className="h-9 w-1/3 min-w-[200px] bg-white/10 rounded-xl animate-pulse mb-3" />
            
            {/* Description skeleton */}
            <div className="space-y-2.5 mb-8">
              <div className="h-3.5 w-1/2 max-w-[400px] bg-white/5 rounded-md animate-pulse" />
              <div className="h-3.5 w-1/3 max-w-[300px] bg-white/5 rounded-md animate-pulse" />
            </div>

            {/* Tabs skeleton - Matching ClassTabs spacing */}
            <div className="flex gap-8 border-b border-white/5">
              {['Stream', 'Assignments', 'People', 'Materials'].map((tab) => (
                <div key={tab} className="pb-4 border-b-2 border-transparent">
                  <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton (Matching ClassDashboardClient layout) */}
      <div className="w-full max-w-[1600px] mx-auto px-8 md:px-12 lg:px-16 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Skeleton (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Class Code Card skeleton */}
            <div className="h-32 bg-white border border-border/60 rounded-2xl animate-pulse shadow-sm" />
            {/* Due Soon Card skeleton */}
            <div className="h-56 bg-white border border-border/60 rounded-2xl animate-pulse shadow-sm" />
            {/* Sticky Notes skeleton */}
            <div className="h-44 bg-white border border-border/60 rounded-2xl animate-pulse shadow-sm" />
          </div>

          {/* Feed Skeleton (lg:col-span-9) */}
          <div className="lg:col-span-9">
            <SkeletonLoader variant="list" count={5} />
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Trigger skeleton */}
      <div className="fixed bottom-6 right-6 z-40 h-12 w-40 rounded-xl bg-navy/20 animate-pulse border border-navy/10 flex items-center px-4 gap-2">
         <div className="size-4 rounded bg-white/20" />
         <div className="h-3 w-16 bg-white/20 rounded" />
      </div>
    </div>
  )
}
