interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'table'
  count?: number
}

export function SkeletonLoader({ variant = 'list', count = 3 }: SkeletonLoaderProps) {
  if (variant === 'card') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="shrink-0 size-10 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
            <div className="pt-3 border-t border-border flex justify-between">
              <div className="h-3 bg-muted rounded w-1/4" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // list view
  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex items-start gap-4 p-5 ${i > 0 ? "border-t border-border" : ""}`}>
          <div className="shrink-0 size-11 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="flex gap-3 mt-2">
              <div className="h-3 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
