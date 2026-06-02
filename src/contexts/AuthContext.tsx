"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

export type Role = "ADMIN" | "USUARIO";
export type CityPolicy = "MEDELLIN" | "BOGOTA" | "OTRO";

export interface User {
  sub: string;
  username: string;
  rol: Role;
  compania_id: string | null;
  ciudad: CityPolicy; // MOCKED
}

interface AuthContextType {
  user: User | null;
  login: (mockCiudad: CityPolicy) => Promise<void>;
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

  const fetchUser = async (mockCity: CityPolicy) => {
    try {
      const res = await api.get("/auth/perfil");
      const backendUser = res.data;
      setUser({
        sub: backendUser.id,
        username: backendUser.correo,
        rol: backendUser.rol,
        compania_id: backendUser.compania_id,
        ciudad: mockCity,
      });
    } catch(e) {
      setUser(null);
    }
  }

  useEffect(() => {
    const storedCity = localStorage.getItem("mock_ciudad") as CityPolicy;
    fetchUser(storedCity || "BOGOTA").finally(() => setIsLoading(false));
  }, []);

  const login = async (mockCity: CityPolicy) => {
    localStorage.setItem("mock_ciudad", mockCity);
    await fetchUser(mockCity);
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch(e) {}
    localStorage.removeItem("mock_ciudad");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
