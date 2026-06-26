"use client";
 
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
 
export function CtaSection() {
  return (
    <section
      className="relative section-padding bg-[#0e0d0b]"
      aria-label="Get started"
    >
      <div className="container-frame">
        <div className="relative overflow-hidden rounded-none py-16 md:py-24 px-6 md:px-12 bg-[#161410] border border-white/5">
          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />
 
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center max-w-2xl mx-auto flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/5 bg-black/15 mb-8">
              <span className="text-[0.6875rem] text-[#e8d5b0] tracking-[0.15em] uppercase font-sans font-light">
                Free to explore, forever
              </span>
            </div>
 
            <h2
              className="text-[#e8e2d9] font-display italic font-normal tracking-tight leading-[1.15]"
              style={{
                fontSize: "clamp(2rem, 4.5vw + 0.5rem, 3.25rem)",
              }}
            >
              Your next favorite film
              <br />
              is one scroll away.
            </h2>
 
            <p className="mt-6 text-[0.875rem] text-[rgba(232,226,217,0.4)] leading-relaxed max-w-md mx-auto font-sans font-light">
              Join thousands of cinephiles discovering films they never knew existed.
            </p>
 
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/discover"
                className={cn(
                  "px-6 py-3.5 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-sans font-medium uppercase tracking-[0.15em] transition-colors duration-300 rounded-none"
                )}
              >
                Start exploring
              </Link>
              <Link
                href="/atlas"
                className={cn(
                  "flex items-center gap-2 px-6 py-3.5 border border-white/10 hover:border-white/20 text-[#e8e2d9] hover:bg-white/5 text-[0.75rem] font-sans font-medium uppercase tracking-[0.15em] transition-colors duration-300 rounded-none"
                )}
              >
                Explore Atlas
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
