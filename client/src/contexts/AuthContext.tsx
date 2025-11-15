import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
  phone?: string;
  fullName?: string;
  companyName?: string;
  credits?: string;
  accuracyScore?: string;
}

interface RegisterData {
  email?: string;
  phone?: string;
  fullName?: string;
  role?: string;
  companyName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, additionalData?: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isAgent: boolean;
  isDeveloper: boolean;
  isClient: boolean;
  isDataContributor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    retry: false,
    staleTime: Infinity
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return await response.json() as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { username: string; password: string; email?: string; phone?: string; fullName?: string; role?: string; companyName?: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return await response.json() as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear();
    }
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const register = async (username: string, password: string, additionalData?: RegisterData) => {
    await registerMutation.mutateAsync({ 
      username, 
      password,
      ...additionalData
    });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agent";
  const isDeveloper = user?.role === "developer";
  const isClient = user?.role === "client";
  const isDataContributor = user?.role === "data_contributor";

  return (
    <AuthContext.Provider value={{ 
      user: user || null, 
      isLoading, 
      login, 
      register, 
      logout, 
      isAdmin,
      isAgent,
      isDeveloper,
      isClient,
      isDataContributor
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
