import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 flex flex-col gap-10 min-h-screen">
      {/* Top action bar placeholder */}
      <div className="flex items-center justify-between shrink-0">
        <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start flex-1 min-h-0">
        {/* Left Column (Header & Instructions) */}
        <div className="flex-1 flex flex-col gap-8 min-w-0 w-full">
          <SkeletonLoader variant="header" />
          <SkeletonLoader variant="form" />
        </div>

        {/* Right Sidebar (Status & Config) */}
        <aside className="hidden lg:flex w-full lg:w-80 shrink-0 flex-col gap-6">
          <div className="h-3 w-40 bg-secondary/80 rounded animate-pulse" />
          <SkeletonLoader variant="card" />
        </aside>
      </div>
    </div>
  )
}
