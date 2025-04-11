"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("user", user);
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if(loading) return null;

  return user ? children : null;
};

export default ProtectedRoute;
