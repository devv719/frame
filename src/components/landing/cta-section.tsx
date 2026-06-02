"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * CtaSection — Final conversion section.
 *
 * Features:
 * - Large gradient background with floating decorative elements
 * - Massive headline with gradient text
 * - Dual CTA buttons
 * - Parallax orbs
 * - Film grain texture
 */
export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orbY1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
      aria-label="Get started"
    >
      <div className="container-frame">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] py-20 md:py-28 lg:py-32 px-6 md:px-12">
          {/* Background gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #1a1625 0%, #2d2844 30%, #4c1d95 60%, #6d28d9 85%, #7c3aed 100%)",
            }}
          />

          {/* Grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />

          {/* Floating orbs */}
          <motion.div
            style={{ y: orbY1 }}
            className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--color-lavender-400), transparent 70%)",
              }}
            />
          </motion.div>

          <motion.div
            style={{ y: orbY2 }}
            className="absolute -bottom-16 -left-16 w-[250px] h-[250px] rounded-full opacity-15 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--color-pink-400), transparent 70%)",
              }}
            />
          </motion.div>

          {/* Decorative lines */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent to-white/10" aria-hidden="true" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-16 bg-gradient-to-t from-transparent to-white/10" aria-hidden="true" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm mb-8"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-[0.8125rem] text-white/70 tracking-wide">
                Free to explore, forever
              </span>
            </motion.div>

            <h2
              className="text-white font-display font-semibold tracking-tighter leading-[1.08]"
              style={{
                fontSize: "clamp(2rem, 4.5vw + 0.5rem, 3.5rem)",
              }}
            >
              Your next favorite film
              <br />
              is one scroll away
            </h2>

            <p className="mt-6 text-[1.0625rem] text-white/60 leading-relaxed max-w-md mx-auto">
              Join thousands of cinephiles discovering films they never knew existed.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                type="button"
                className={cn(
                  "group relative px-8 py-4 rounded-2xl overflow-hidden",
                  "text-[0.9375rem] font-medium",
                  "bg-white text-neutral-900",
                  "shadow-lg shadow-black/20",
                  "hover:shadow-xl hover:shadow-lavender-500/30",
                  "active:scale-[0.97]",
                  "transition-all duration-300"
                )}
              >
                <span className="relative z-10">Start exploring — it&apos;s free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-lavender-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-2 px-8 py-4 rounded-2xl",
                  "text-[0.9375rem] font-medium text-white/80",
                  "border border-white/15",
                  "hover:border-white/30 hover:text-white hover:bg-white/5",
                  "active:scale-[0.97]",
                  "transition-all duration-300"
                )}
              >
                Learn more
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
