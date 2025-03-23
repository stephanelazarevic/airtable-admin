"use client";

import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedRoute.tsx")
    console.log('user')
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  return user ? children : null;
};

export default ProtectedRoute;
