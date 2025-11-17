import { cn } from "@/lib/utils";

interface ResponsiveTableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Responsive table wrapper that:
 * - Enables horizontal scrolling on mobile
 * - Maintains touch-friendly scrolling
 * - Shows scroll hint for mobile users
 */
export function ResponsiveTableWrapper({ 
  children, 
  className 
}: ResponsiveTableWrapperProps) {
  return (
    <div className="relative">
      {/* Scroll hint for mobile */}
      <div className="md:hidden text-xs text-muted-foreground mb-2 flex items-center gap-2" aria-live="polite">
        <svg 
          className="h-4 w-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        Swipe to see more / مرر لرؤية المزيد
      </div>
      
      {/* Table container with horizontal scroll */}
      <div 
        className={cn(
          "overflow-x-auto mobile-scroll rounded-lg border border-border",
          "md:overflow-visible",
          className
        )}
        role="region"
        aria-label="Data table"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Mobile-optimized card view for table data
 * Use this as an alternative to tables on mobile devices
 */
interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileCard({ children, className }: MobileCardProps) {
  return (
    <div 
      className={cn(
        "md:hidden p-4 space-y-3 border border-border rounded-lg hover-elevate tap-target",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Desktop table row (hidden on mobile)
 */
interface DesktopTableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function DesktopTableRow({ children, className }: DesktopTableRowProps) {
  return (
    <tr className={cn("hidden md:table-row", className)}>
      {children}
    </tr>
  );
}
