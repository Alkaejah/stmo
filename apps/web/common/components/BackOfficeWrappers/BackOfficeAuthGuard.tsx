"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useBackOfficeSessionStore from "@/common/store/useBackOfficeSessionStore";

const DEFAULT_REDIRECT_URL = "/stmo/officers"; // Default for non-authenticated users

// Define role-based allowed routes
const ROLE_BASED_ROUTES: Record<string, string[]> = {
  Treasurer: ["/treasurer/dashboard", "/treasurer"], // Allow entire module
  Officer: ["/officer"],
  Admin: ["/admin/dashboard", "/admin"],
};

const BackOfficeAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const session = useBackOfficeSessionStore((state) => state);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    console.log("Session Store - ID:", session.id, "Role:", session.role);
    if (session.id !== undefined) {
      setIsChecking(false); // Session is loaded, stop checking
    } else {
      console.log("❌ Session not loaded! Redirecting to login...");
      router.replace(DEFAULT_REDIRECT_URL);
    }
  }, [session.id, router]);

  useEffect(() => {
    if (!isChecking) {
      console.log("🔍 Checking authentication...");
      console.log("🔹 Session ID:", session.id);
      console.log("🔹 Session Role:", session.role);
      console.log("🔹 Current Pathname:", pathname);

      // If no session ID, redirect to login
      if (!session.id) {
        console.log("❌ Not authenticated! Redirecting to login...");
        // Temporarily comment out the redirect for debugging
        // router.replace(DEFAULT_REDIRECT_URL);
        return;
      }

      // Get allowed paths for the user's role
      const role = session.role ?? "";
      const allowedPaths: string[] = ROLE_BASED_ROUTES[role] || [];

      console.log("✅ Allowed Paths for Role:", role, allowedPaths);

      // Check if the current path is allowed
      const isAllowed = allowedPaths.some((basePath) =>
        pathname.startsWith(basePath),
      );

      console.log("🔹 Is Allowed:", isAllowed);

      // If not allowed, redirect to the first allowed path
      if (!isAllowed && allowedPaths.length > 0) {
        console.log(
          `🚨 Unauthorized! Redirecting ${session.role} to ${allowedPaths[0]}...`,
        );
        // Temporarily comment out the redirect for debugging
        router.replace(allowedPaths[0] || "/");
      }
    }
  }, [isChecking, session.id, session.role, pathname, router]);

  if (isChecking) return <p>Loading...</p>; // Show loading while checking session

  return <>{children}</>;
};

export default BackOfficeAuthGuard;
