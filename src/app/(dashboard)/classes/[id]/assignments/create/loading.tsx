import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-8 w-full">
      {/* Back button placeholder */}
      <div className="h-4 w-24 bg-secondary rounded animate-pulse" />

      {/* Header placeholder (title and icon) */}
      <div className="flex items-center gap-3 animate-pulse">
        <div className="size-10 rounded-xl bg-secondary" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-secondary rounded" />
          <div className="h-3 w-64 bg-secondary/80 rounded" />
        </div>
      </div>

      {/* Form placeholder */}
      <SkeletonLoader variant="form" />
    </div>
  )
}
