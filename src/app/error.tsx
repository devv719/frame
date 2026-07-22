"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Application Error Boundary captured:", error);
  }, [error]);

  return (
    <div className="min-h-[75dvh] flex flex-col items-center justify-center bg-[#0e0d0b] text-[#e8e2d9] text-center px-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-md"
      >
        <div className="flex items-center gap-1.5 mb-6 text-red-400">
          <AlertCircle size={20} className="animate-pulse" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-semibold font-sans">
            Transmission Error
          </span>
        </div>

        <h1 className="font-display italic text-[2.25rem] md:text-[3rem] font-light leading-none tracking-tight text-[#e8d5b0] mb-4">
          Playback Stalled
        </h1>

        <p className="text-stone-400 font-sans font-light text-xs max-w-xs leading-relaxed tracking-wider mb-10">
          An unexpected error interrupted the transmission. We were unable to project the requested scene.
        </p>

        <button
          onClick={unstable_retry}
          className="px-6 py-3.5 border border-[#e8d5b0]/30 hover:border-[#e8d5b0] bg-transparent hover:bg-[#e8d5b0] text-[#e8d5b0] hover:text-[#0e0d0b] transition-all duration-300 font-sans font-medium uppercase tracking-[0.2em] text-[0.75rem] cursor-pointer"
        >
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
