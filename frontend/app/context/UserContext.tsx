"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {jwtDecode} from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isExpired: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();

  const login = (user: User, token: string) => {
    localStorage.setItem("token", token);
    setUser(user);
    setIsExpired(false);
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setIsExpired(true);
    router.push("/login");
  }, [router]);

  const checkToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsExpired(true);
      return;
    }

    try {
      const decoded: { exp: number; id: string; name: string; email: string } = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        console.warn("Token expired");
        logout();
      } else {
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
        });
        setIsExpired(false);
      }
    } catch (error) {
      console.error("Invalid token", error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    checkToken();
    const interval = setInterval(() => {
      checkToken();
    }, 60000); // every 60s
    return () => clearInterval(interval);
  }, [checkToken]);

  return (
    <AuthContext.Provider value={{ user, isExpired, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
