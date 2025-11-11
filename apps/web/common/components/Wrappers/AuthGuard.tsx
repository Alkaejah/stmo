"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LINK_HOME } from "@/common/constants/links";
import useDriverSessionStore from "@/common/store/useDriverSessionStore";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const session = useDriverSessionStore((state) => state);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false); // Track session loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate session loading (if asynchronous)
    if (session.id !== undefined) {
      setIsSessionLoaded(true); // Session is loaded when `session.id` is defined
    }
  }, [session.id]);

  useEffect(() => {
    if (isSessionLoaded) {
      // Check session and role after session is loaded
      const redirectToLogin = () => {
        const redirect =
          pathname !== LINK_HOME ? `?redirect_to=${pathname}` : ``;
        router.push(`/${redirect}`);
      };

      if (!session.id) {
        redirectToLogin();
      } else if (session.role !== "Driver" && pathname !== "/") {
        router.push(`/`);
      } else {
        setLoading(false); // Set loading to false when all checks pass
      }
    }
  }, [isSessionLoaded, session.id, session.role, pathname, router]);

  if (loading || !isSessionLoaded) return null; // Render nothing while session is loading or being validated

  return <>{children}</>;
};

export default AuthGuard;
