"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { fadeDown, fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

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
        "fixed top-0 left-0 right-0 z-[200]",
        "transition-all duration-[400ms]",
        scrolled
          ? "glass-heavy shadow-sm"
          : "bg-transparent"
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
          className="flex items-center gap-2 group"
          aria-label={`${SITE_CONFIG.name} — home`}
        >
          <span className="relative flex items-center justify-center w-8 h-8 rounded-lg gradient-lavender">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
              aria-hidden="true"
            >
              <path
                d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
              <path
                d="M6 10L8 7.5L10.5 10.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-heading text-[1.125rem] tracking-tight text-text-primary group-hover:text-lavender-600 transition-colors duration-[250ms]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg",
                  "text-[0.875rem] font-medium tracking-normal",
                  "text-text-secondary",
                  "hover:text-text-primary hover:bg-neutral-100/60",
                  "transition-all duration-[250ms]"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className={cn(
              "px-4 py-2 rounded-lg",
              "text-[0.875rem] font-medium",
              "text-text-secondary hover:text-text-primary",
              "transition-colors duration-[250ms]"
            )}
          >
            Sign in
          </Link>
          <Link
            href="/get-started"
            className={cn(
              "px-5 py-2.5 rounded-xl",
              "text-[0.875rem] font-medium text-white",
              "gradient-lavender",
              "hover:shadow-glow-lavender",
              "transition-shadow duration-[400ms]",
              "active:scale-[0.97] transform"
            )}
          >
            Get started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-neutral-100/60 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="relative w-5 h-4 flex flex-col justify-between">
            <span
              className={cn(
                "block w-full h-[1.5px] bg-text-primary rounded-full transition-all duration-300 origin-center",
                mobileMenuOpen && "rotate-45 translate-y-[5px]"
              )}
            />
            <span
              className={cn(
                "block w-full h-[1.5px] bg-text-primary rounded-full transition-all duration-200",
                mobileMenuOpen && "opacity-0 scale-x-0"
              )}
            />
            <span
              className={cn(
                "block w-full h-[1.5px] bg-text-primary rounded-full transition-all duration-300 origin-center",
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
              "glass-heavy border-t border-border-secondary",
              "px-6 py-6"
            )}
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <motion.li key={link.href} variants={staggerItem}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block px-4 py-3 rounded-xl",
                      "text-[1rem] font-medium",
                      "text-text-secondary hover:text-text-primary",
                      "hover:bg-neutral-100/60",
                      "transition-all duration-[250ms]"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              variants={fadeUp}
              className="mt-4 pt-4 border-t border-border-secondary flex flex-col gap-2"
            >
              <Link
                href="/sign-in"
                className={cn(
                  "block text-center px-4 py-3 rounded-xl",
                  "text-[0.9375rem] font-medium",
                  "text-text-secondary hover:text-text-primary",
                  "hover:bg-neutral-100/60",
                  "transition-all duration-[250ms]"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/get-started"
                className={cn(
                  "block text-center px-5 py-3 rounded-xl",
                  "text-[0.9375rem] font-medium text-white",
                  "gradient-lavender",
                  "transition-shadow duration-[400ms]"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get started
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
