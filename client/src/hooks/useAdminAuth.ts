import { useQuery } from "@tanstack/react-query";

interface AdminSession {
  username: string;
  mustChangePassword: boolean;
}

export function useAdminAuth() {
  const { data: adminSession, isLoading, error } = useQuery<AdminSession>({
    queryKey: ["/api/admin/session"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    adminSession,
    isAdminAuthenticated: !!adminSession && !adminSession.mustChangePassword,
    isLoading,
    isError: !!error,
  };
}
