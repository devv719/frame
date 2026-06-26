"use client";

import { usePathname } from "next/navigation";
import { Footer, Navbar } from "@/components/layout";
import { cn } from "@/lib/utils";
import { ShaderBackground, FilmGrain, CursorGlow } from "@/components/ui";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreenRoute = pathname?.startsWith("/atlas");

  return (
    <>
      {!isFullscreenRoute && <Navbar />}
      <FilmGrain />
      <CursorGlow />
      <main className={cn("flex-1", !isFullscreenRoute && "pt-16 md:pt-[72px]")}>
        {children}
      </main>
      {!isFullscreenRoute && <Footer />}
    </>
  );
}

