export function PropertyCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex gap-4 pt-2">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
        <div className="h-10 bg-muted rounded mt-4" />
      </div>
    </div>
  );
}
