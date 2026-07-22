"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Film, LogIn, Disc } from "lucide-react";
import { motion } from "framer-motion";

/**
 * A cinematic, dark-mode login page for Frame.
 * Designed with a subtle radial glow resembling a film projector,
 * elegant golden typography, and transitions.
 */
export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);

  // Redirection when the user is already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push("/journal");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    setError(null);
    setAuthenticating(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google authentication failed:", err);
      setError("Failed to sign in. Please verify your credentials and try again.");
    } finally {
      setAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-[#f4f2ed] select-none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-none border border-t-[#e8d5b0] border-[#e8d5b0]/20 animate-spin flex items-center justify-center">
            <Film size={24} className="text-[#e8d5b0] animate-pulse" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-sans text-stone-500 font-semibold mt-4">
            Securing Vault...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050505] text-[#f4f2ed] overflow-hidden select-none">
      
      {/* Immersive Cinematic Background (Projector Light Cone Glow) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-radial from-amber-500/5 via-transparent to-transparent blur-[120px]" />
        <div className="absolute top-[40%] left-1/3 w-[50vw] h-[50vw] rounded-full bg-radial from-stone-900/40 via-transparent to-transparent blur-[100px]" />
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8 md:p-12 text-center flex flex-col items-center"
      >
        {/* Cinematic Logo */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-1.5 mb-6"
        >
          <Disc size={20} className="text-[#e8d5b0] animate-spin" style={{ animationDuration: "12s" }} />
          <span className="text-[10px] tracking-[0.4em] uppercase text-stone-500 font-semibold font-sans">
            Cinema Archive
          </span>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-display italic text-[4.5rem] md:text-[5.5rem] font-light leading-none tracking-tight text-[#e8d5b0] mb-4"
        >
          frame
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-stone-400 font-sans font-light text-sm max-w-xs leading-relaxed tracking-wider mb-10"
        >
          A private, digital scrapbook for your reflective cinema journal and locations watched.
        </motion.p>

        {/* Sign In Trigger Button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full"
        >
          <button
            onClick={handleLogin}
            disabled={authenticating}
            className="group relative w-full flex items-center justify-center gap-3.5 px-6 py-4 border border-[#e8d5b0]/30 hover:border-[#e8d5b0] bg-transparent hover:bg-[#e8d5b0] text-[#e8d5b0] hover:text-[#050505] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] font-sans font-medium uppercase tracking-[0.2em] text-[0.75rem] rounded-none shadow-[0_4px_20px_rgba(0,0,0,0.4)] disabled:opacity-40"
          >
            {authenticating ? (
              <>
                <Disc size={15} className="animate-spin text-current" />
                <span>Entering...</span>
              </>
            ) : (
              <>
                <LogIn size={15} className="text-current transition-transform group-hover:translate-x-0.5" />
                <span>Enter Your Vault with Google</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Error Feedback */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-red-400 text-xs tracking-wider p-3.5 border border-red-950/40 bg-red-950/10 font-sans font-light w-full"
          >
            {error}
          </motion.div>
        )}

        {/* Footer Accent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-[9px] text-stone-600 uppercase tracking-[0.3em] font-sans font-medium"
        >
          Vault Secured by Firebase Auth
        </motion.div>
      </motion.div>
    </div>
  );
}
