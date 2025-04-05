"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
  }, [router]);

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      logout();
      return;
    }

    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        logout();
      }
    } catch (error) {
      console.error("Invalid token:", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      logout();
      return;
    }

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 60000); // check every minute
    return () => clearInterval(interval);
  }, [checkTokenExpiration, logout]);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
