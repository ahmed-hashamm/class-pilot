interface SkeletonLoaderProps {
  variant?: 'card' | 'list' | 'table' | 'header'
  count?: number
}

/**
 * Premium Skeleton Loader for various UI patterns.
 * Optimized for visibility with increased contrast for modern displays.
 */
export function SkeletonLoader({ variant = 'list', count = 3 }: SkeletonLoaderProps) {
  // Page Header Skeleton (Icon box + Titles)
  if (variant === 'header') {
    return (
      <div className="flex items-center justify-between mb-8 animate-pulse">
        <div className="flex items-center gap-3 flex-1">
          <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0 shadow-sm" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-1/4 min-w-[120px] bg-muted rounded-lg" />
            <div className="h-3.5 w-1/2 max-w-[300px] bg-muted rounded-md" />
          </div>
        </div>
        <div className="h-9 w-28 bg-muted/40 rounded-xl" />
      </div>
    )
  }

  // Card view (e.g. for Groups or Grid layouts)
  if (variant === 'card') {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-border/80 rounded-3xl p-6 flex flex-col gap-5 animate-pulse shadow-sm">
            <div className="flex items-start gap-4">
              <div className="shrink-0 size-12 rounded-2xl bg-muted shadow-sm" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-5 bg-muted rounded-lg w-3/4" />
                <div className="h-3.5 bg-muted rounded-md w-1/2" />
              </div>
            </div>
            <div className="pt-4 border-t border-border/60 flex justify-between items-center">
              <div className="h-3.5 bg-muted/60 rounded-md w-1/4" />
              <div className="flex -space-x-2 shrink-0">
                {[1, 2, 3].map(j => (
                  <div key={j} className="size-7 rounded-full border-2 border-white bg-muted/70 shrink-0" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // List view (e.g. for Stream, Feed, or Materials)
  return (
    <div className="bg-white border border-border/80 rounded-3xl overflow-hidden animate-pulse shadow-sm">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`flex items-start gap-5 p-6 ${i > 0 ? "border-t border-border/60" : ""}`}>
          <div className="shrink-0 size-11 rounded-2xl bg-muted shadow-sm" />
          <div className="flex-1 space-y-2.5 py-1">
            <div className="h-4.5 bg-muted rounded-lg w-2/3" />
            <div className="h-3.5 bg-muted rounded-md w-1/2" />
            <div className="flex gap-4 mt-3">
              <div className="h-3.5 bg-muted rounded-md w-24" />
              <div className="h-3.5 bg-muted rounded-md w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
