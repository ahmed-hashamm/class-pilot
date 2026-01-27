"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardNavbar from "./DashboardNavbar";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardNavbarClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Always check auth on mount
    checkAuth();

    // If we have auth=success param, refresh after a brief delay to ensure session is set
    if (searchParams.get("auth") === "success") {
      const timer = setTimeout(() => {
        checkAuth();
        router.refresh();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, checkAuth, router]);

  return <DashboardNavbar />;
}

