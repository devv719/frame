"use client";

import { motion } from "framer-motion";
import { LOCATIONS } from "@/lib/data/mock";
import { cn } from "@/lib/utils";

/**
 * LocationSection — Explore films by filming location.
 *
 * Features:
 * - Asymmetric masonry-style grid
 * - Location cards with gradient backgrounds & coordinate labels
 * - Hover parallax effect on inner content
 * - Animated map pin icons
 * - Staggered entrance animations
 */
export function LocationSection() {
  return (
    <section
      className="relative section-padding overflow-hidden bg-bg-secondary"
      aria-label="Explore by location"
    >
      {/* Subtle radial gradient accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, var(--color-lavender-300), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container-frame relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14 md:mb-20"
        >
          <div>
            <span className="text-overline-style block mb-3">
              Film Geography
            </span>
            <h2>
              Cinema has no{" "}
              <span className="gradient-text">borders</span>
            </h2>
          </div>
          <p className="max-w-sm text-text-secondary text-[0.9375rem] leading-relaxed md:text-right">
            Trace the footsteps of your favorite films across continents and
            cultures.
          </p>
        </motion.div>

        {/* Location Grid — Asymmetric */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {LOCATIONS.map((location, index) => (
            <LocationCard
              key={location.id}
              location={location}
              index={index}
              isTall={index === 1 || index === 4}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationCard({
  location,
  index,
  isTall,
}: {
  location: (typeof LOCATIONS)[number];
  index: number;
  isTall: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(isTall && "sm:row-span-2")}
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer",
          "transition-all duration-500",
          "hover:shadow-xl hover:-translate-y-1",
          isTall ? "h-[280px] sm:h-full min-h-[280px]" : "h-[280px]"
        )}
        style={{ background: location.gradient }}
      >
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={`grid-${location.id}`}
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${location.id})`} />
          </svg>
        </div>

        {/* Hover shift */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
          {/* Top */}
          <div className="flex items-start justify-between">
            {/* Map pin */}
            <motion.div
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </motion.div>
            <span className="text-[0.6875rem] font-mono text-white/50 tracking-wider">
              {location.coordinates}
            </span>
          </div>

          {/* Bottom */}
          <div>
            <span className="text-[0.75rem] text-white/60 font-medium tracking-wider uppercase block mb-1">
              {location.country}
            </span>
            <h3
              className={cn(
                "font-display font-semibold text-white tracking-tight",
                isTall ? "text-[2rem] md:text-[2.5rem]" : "text-[1.75rem] md:text-[2rem]"
              )}
            >
              {location.city}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2" />
                  <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5" />
                </svg>
                <span className="text-[0.8125rem] text-white/70">
                  {location.filmCount} films
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Explore arrow */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
