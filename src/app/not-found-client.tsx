"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Film } from "lucide-react";

export function NotFoundClient() {
  return (
    <div className="min-h-[75dvh] flex flex-col items-center justify-center bg-[#0e0d0b] text-[#e8e2d9] text-center px-6 select-none">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center max-w-md"
      >
        <div className="flex items-center gap-1.5 mb-6 text-stone-500">
          <Film size={20} className="text-[#e8d5b0]/60 animate-pulse" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-semibold font-sans">
            Scene Lost
          </span>
        </div>

        <h1 className="font-display italic text-[3.5rem] md:text-[4.5rem] font-light leading-none tracking-tight text-[#e8d5b0] mb-4">
          404
        </h1>

        <h2 className="text-[1.25rem] font-sans font-light tracking-wide text-stone-300 mb-6">
          This reel appears to be missing.
        </h2>

        <p className="text-stone-400 font-sans font-light text-xs max-w-xs leading-relaxed tracking-wider mb-10">
          The page you are looking for has been moved, deleted, or never existed in the catalog.
        </p>

        <Link
          href="/discover"
          className="px-6 py-3.5 border border-[#e8d5b0]/30 hover:border-[#e8d5b0] bg-transparent hover:bg-[#e8d5b0] text-[#e8d5b0] hover:text-[#0e0d0b] transition-all duration-300 font-sans font-medium uppercase tracking-[0.2em] text-[0.75rem]"
        >
          Return to Discover
        </Link>
      </motion.div>
    </div>
  );
}
