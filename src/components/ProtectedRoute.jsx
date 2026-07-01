"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Film } from "lucide-react";

/**
 * A protected route layout wrapper that authenticates users client-side,
 * displaying a premium loading spinner before rendering protected pages.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirection trigger once authentication completes and user is null
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Loading representation with cinematic pulsing film logo
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0A0A] text-[#f4f2ed]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border border-t-[#e8d5b0] border-[#e8d5b0]/20 animate-spin flex items-center justify-center">
            <Film size={24} className="text-[#e8d5b0] animate-pulse" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-stone-500 font-semibold mt-4">
            Opening Vault...
          </span>
        </div>
      </div>
    );
  }

  // Hide page content if user is missing and page is loading redirect
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
