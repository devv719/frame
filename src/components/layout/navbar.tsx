"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { fadeDown, fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { LogModal } from "@/components/ui";

/**
 * Navbar — Primary site navigation.
 *
 * Features:
 * - Glass morphism background on scroll
 * - Smooth animated appearance
 * - Responsive mobile menu
 * - Active link tracking (placeholder)
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={fadeDown}
      className={cn(
        "fixed top-0 left-0 right-0 z-[200] border-b transition-colors duration-[300ms]",
        scrolled
          ? "bg-[#0e0d0b]/95 backdrop-blur-md border-[#292524]/60"
          : "bg-[#0e0d0b] border-transparent"
      )}
    >
      <nav
        className="container-frame flex items-center justify-between h-16 md:h-[72px]"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group select-none"
          aria-label={`${SITE_CONFIG.name} — home`}
        >
          <span className="font-display italic text-[1.5rem] font-normal tracking-tight text-[#e8d5b0]">
            frame
          </span>
        </Link>
 
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-[12px] font-sans font-medium tracking-[0.18em] uppercase transition-colors duration-[200ms]",
                    isActive
                      ? "text-[#e8d5b0]"
                      : "text-[#e8e2d9]/60 hover:text-[#e8d5b0]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          {/* Add Log a Watch directly in nav links */}
          <li>
            <button
              type="button"
              onClick={() => setIsLogOpen(true)}
              className="text-[12px] font-sans font-medium tracking-[0.18em] uppercase text-[#e8d5b0] hover:text-[#d6c096] transition-colors duration-[200ms]"
            >
              Log a Watch
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-none hover:bg-white/5 transition-colors text-[#e8e2d9]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-5 h-4 flex flex-col justify-between">
            <span
              className={cn(
                "block w-full h-[1.5px] bg-current transition-all duration-300 origin-center",
                mobileMenuOpen && "rotate-45 translate-y-[5px]"
              )}
            />
            <span
              className={cn(
                "block w-full h-[1.5px] bg-current transition-all duration-200",
                mobileMenuOpen && "opacity-0 scale-x-0"
              )}
            />
            <span
              className={cn(
                "block w-full h-[1.5px] bg-current transition-all duration-300 origin-center",
                mobileMenuOpen && "-rotate-45 -translate-y-[5px]"
              )}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={staggerContainer}
            className={cn(
              "md:hidden",
              "absolute top-full left-0 right-0",
              "bg-[#0e0d0b] border-t border-[#292524]",
              "px-6 py-6"
            )}
          >
            <ul className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <motion.li key={link.href} variants={staggerItem}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-4 py-3 text-[12px] font-sans font-medium tracking-[0.18em] uppercase transition-colors",
                        isActive
                          ? "text-[#e8d5b0]"
                          : "text-[#e8e2d9]/60 hover:text-[#e8d5b0]"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <motion.div
              variants={fadeUp}
              className="mt-4 pt-4 border-t border-[#292524] flex flex-col gap-2 animate-none"
            >
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsLogOpen(true);
                }}
                className="block text-center w-full py-3 text-[12px] font-sans font-medium tracking-[0.18em] uppercase text-[#e8d5b0] hover:text-[#d6c096] transition-colors cursor-pointer"
              >
                Log a Watch
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        onSuccess={() => {
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("cinema-log-updated"));
          }
        }}
      />
    </motion.header>
  );
}
