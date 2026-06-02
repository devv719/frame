"use client";

import { motion } from "framer-motion";
import { DIRECTORS } from "@/lib/data/mock";
import { cn } from "@/lib/utils";

/**
 * DirectorsSection — Featured directors showcase.
 *
 * Features:
 * - Large landscape cards with gradient monogram avatars
 * - Director metadata: nationality, film count, style
 * - Notable films list
 * - Accolade badges
 * - Scroll-staggered reveal
 */
export function DirectorsSection() {
  return (
    <section
      className="relative section-padding overflow-hidden"
      aria-label="Featured directors"
    >
      <div className="container-frame">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="text-overline-style block mb-3">
            Visionaries
          </span>
          <h2>
            The minds behind the{" "}
            <span className="gradient-text">magic</span>
          </h2>
          <p className="mt-4 max-w-md mx-auto text-text-secondary">
            Explore the filmographies of directors who shape how we see the
            world.
          </p>
        </motion.div>

        {/* Director Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {DIRECTORS.map((director, index) => (
            <DirectorCard key={director.id} director={director} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DirectorCard({
  director,
  index,
}: {
  director: (typeof DIRECTORS)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer",
        "bg-surface-primary border border-border-secondary",
        "hover:shadow-xl hover:border-lavender-200 hover:-translate-y-1",
        "transition-all duration-500"
      )}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Avatar / Monogram */}
        <div className="relative sm:w-[200px] md:w-[220px] flex-shrink-0 h-[160px] sm:h-auto overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: director.gradient }}
          />
          {/* Film grain */}
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />
          {/* Initials */}
          <div className="relative h-full flex items-center justify-center">
            <span className="text-[3rem] md:text-[3.5rem] font-display font-bold text-white/90 tracking-tighter select-none">
              {director.initial}
            </span>
          </div>
          {/* Accolade badge */}
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md">
            <span className="text-[0.6875rem] font-medium text-white/90 tracking-wide">
              {director.accolade}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[1.25rem] md:text-[1.375rem] font-display font-semibold text-text-primary tracking-tight group-hover:text-lavender-600 transition-colors duration-300">
                  {director.name}
                </h3>
                <span className="text-[0.8125rem] text-text-tertiary block mt-0.5">
                  {director.nationality}
                </span>
              </div>
              <span className="flex-shrink-0 px-3 py-1 rounded-full bg-lavender-50 text-[0.75rem] font-medium text-lavender-600">
                {director.filmCount} films
              </span>
            </div>

            <p className="mt-4 text-[0.875rem] text-text-secondary leading-relaxed italic">
              &ldquo;{director.style}&rdquo;
            </p>
          </div>

          {/* Notable Films */}
          <div className="mt-5 pt-4 border-t border-border-secondary">
            <span className="text-[0.6875rem] text-text-muted tracking-wider uppercase block mb-2.5">
              Notable Films
            </span>
            <div className="flex flex-wrap gap-2">
              {director.notableFilms.map((film) => (
                <span
                  key={film}
                  className={cn(
                    "px-3 py-1.5 rounded-lg",
                    "text-[0.75rem] font-medium",
                    "bg-bg-secondary text-text-secondary",
                    "group-hover:bg-lavender-50 group-hover:text-lavender-700",
                    "transition-colors duration-300"
                  )}
                >
                  {film}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
