import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EnhancedSkeletonProps {
  variant?: "card" | "table" | "list" | "stat";
  count?: number;
  className?: string;
}

export function EnhancedSkeleton({ 
  variant = "card", 
  count = 1,
  className 
}: EnhancedSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === "card") {
    return (
      <>
        {skeletons.map((i) => (
          <div key={i} className={cn("space-y-3 p-6 border border-border rounded-lg skeleton-shimmer", className)}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ))}
      </>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        {skeletons.map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg skeleton-shimmer">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-2", className)}>
        {skeletons.map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg skeleton-shimmer">
            <Skeleton className="h-6 w-6 rounded flex-shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "stat") {
    return (
      <>
        {skeletons.map((i) => (
          <div key={i} className={cn("space-y-2 p-6 border border-border rounded-lg skeleton-shimmer", className)}>
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </>
    );
  }

  return null;
}

// Table skeleton with proper responsive layout
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" role="status" aria-live="polite" aria-label="Loading table data">
      <div className="hidden md:block">
        {/* Header */}
        <div className="flex gap-4 p-4 border-b border-border">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b border-border skeleton-shimmer">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        <EnhancedSkeleton variant="table" count={rows} />
      </div>
    </div>
  );
}

// Stats grid skeleton
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="status" aria-live="polite" aria-label="Loading statistics">
      <EnhancedSkeleton variant="stat" count={count} />
    </div>
  );
}
