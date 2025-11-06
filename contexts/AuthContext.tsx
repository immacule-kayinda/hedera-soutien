"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

import {
  AuthUser,
  LoginPayload,
  registerUser as registerService,
  loginUser as loginService,
  RegisterPayload,
  getCurrentUser,
} from "@/services/auth";

interface AuthContextType {
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("[AUTH_CONTEXT] Failed to fetch session", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user: authenticatedUser } = await loginService(payload);
    setUser(authenticatedUser);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const { user: registeredUser } = await registerService(payload);
    setUser(registeredUser);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/session", { method: "DELETE" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isLoading,
        refreshUser,
      }}
    >
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
