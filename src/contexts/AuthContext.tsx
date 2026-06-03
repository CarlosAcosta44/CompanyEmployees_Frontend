"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export type Role = "ADMIN" | "USUARIO";
export type CityPolicy = "MEDELLIN" | "BOGOTA" | string;

export interface User {
  sub: string;
  username: string;
  rol: Role;
  compania_id: string | null;
  ciudad: CityPolicy;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/perfil");
      const d = res.data;
      setUser({
        sub: d.id,
        username: d.username,
        rol: d.rol,
        compania_id: d.compania_id,
        ciudad: (d.ciudad || "").toUpperCase(),
        first_name: d.first_name,
        last_name: d.last_name,
      });
      return true;
    } catch (e: any) {
      if (e.response?.status === 401) {
        // Attempt silent refresh
        try {
          await api.post("/auth/refresh");
          // If refresh succeeds, try fetching profile again
          const retryRes = await api.get("/auth/perfil");
          const d = retryRes.data;
          setUser({
            sub: d.id,
            username: d.username,
            rol: d.rol,
            compania_id: d.compania_id,
            ciudad: (d.ciudad || "").toUpperCase(),
            first_name: d.first_name,
            last_name: d.last_name,
          });
          return true;
        } catch {
          // If refresh fails, user is completely logged out
        }
      }
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    fetchUser().finally(() => setIsLoading(false));
  }, []);

  const login = async () => {
    await fetchUser();
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
