"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtEncode from "jwt-encode";
import { jwtDecode } from "jwt-decode";

const SECRET = "fake_super_secret"; // ⚠️ à ne pas utiliser en prod !

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error("Token invalide");
        logout();
      }
    }

    setLoading(false);
  }, []);

  const login = (userData: any) => {
    const payload = {
      id: userData.id,
      email: userData.fields.email,
      password: userData.fields.password,
      name: userData.fields.last_name + " " + userData.fields.first_name,
    };
  
    const token = jwtEncode(payload, SECRET);
    localStorage.setItem("token", token);
    setUser(payload);
    router.push("/pages/admin");
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
