import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireRole?: string;
}

export function ProtectedRoute({ children, requireAdmin = false, requireRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/login");
    } else if (!isLoading && requireAdmin && user?.role !== "admin") {
      setLocation("/");
    } else if (!isLoading && requireRole && user?.role !== requireRole) {
      setLocation("/");
    }
  }, [user, isLoading, setLocation, requireAdmin, requireRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-protected">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== "admin") {
    return null;
  }

  if (requireRole && user.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}
