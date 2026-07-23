"use client";

import { usePathname } from "next/navigation";
import { Footer, Navbar } from "@/components/layout";
import { cn } from "@/lib/utils";
import { ShaderBackground, FilmGrain, CursorGlow } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { pageTransition } from "@/lib/motion";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreenRoute = pathname?.startsWith("/atlas") || pathname === "/login";

  return (
    <>
      {!isFullscreenRoute && <Navbar />}
      <FilmGrain />
      <CursorGlow />
      <main className={cn("flex-1", !isFullscreenRoute && "pt-16 md:pt-[72px]")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full flex flex-col h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isFullscreenRoute && <Footer />}
    </>
  );
}

