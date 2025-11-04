"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "beneficiary" | "donor";
  hederaAccount?: string;
  balance?: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: "beneficiary" | "donor";
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulation de login (frontend seulement)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Utilisateur de démo
    setUser({
      id: "demo-user-1",
      name: "Marie Dubois",
      email,
      role: "donor",
      hederaAccount: "0.0.7144230",
      balance: 1000,
    });
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: "beneficiary" | "donor";
  }) => {
    // Simulation de register (frontend seulement)
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUser({
      id: `demo-user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      hederaAccount: data.role === "donor" ? "0.0.7144230" : undefined,
      balance: data.role === "donor" ? 1000 : undefined,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isAuthenticated: !!user }}
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
