"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Role = "ADMIN" | "USUARIO";
export type CityPolicy = "MEDELLIN" | "BOGOTA" | "OTRO";

export interface User {
  sub: string;
  username: string;
  rol: Role;
  compania_id: string | null;
  ciudad: CityPolicy; // MOCKED
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, mockCiudad: CityPolicy) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const parseToken = (t: string, city: CityPolicy): User | null => {
    try {
      const base64Url = t.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const parsed = JSON.parse(jsonPayload);
      return {
        ...parsed,
        ciudad: city, 
      };
    } catch (e) {
      console.error("Failed to parse JWT", e);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedCity = localStorage.getItem("mock_ciudad") as CityPolicy;
    
    if (storedToken) {
      const parsedUser = parseToken(storedToken, storedCity || "BOGOTA");
      if (parsedUser && parsedUser.exp * 1000 > Date.now()) {
        setToken(storedToken);
        setUser(parsedUser);
      } else {
        // Expired
        localStorage.removeItem("token");
        localStorage.removeItem("mock_ciudad");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, mockCity: CityPolicy) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("mock_ciudad", mockCity);
    const parsedUser = parseToken(newToken, mockCity);
    setToken(newToken);
    setUser(parsedUser);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mock_ciudad");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
