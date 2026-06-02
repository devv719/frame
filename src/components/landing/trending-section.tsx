"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { TRENDING_MOVIES } from "@/lib/data/mock";
import { cn } from "@/lib/utils";

/**
 * TrendingSection — Horizontal movie showcase carousel.
 *
 * Features:
 * - Scroll-triggered reveal
 * - Hover-driven poster zoom + glass overlay
 * - Rating badge with star
 * - Genre tags
 * - Horizontal scrollable row
 */
export function TrendingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
      aria-label="Trending movies"
    >
      {/* Section Header */}
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="container-frame mb-12 md:mb-16"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-overline-style block mb-3">
              Trending Now
            </span>
            <h2>
              What the world is{" "}
              <span className="gradient-text">watching</span>
            </h2>
          </div>
          <button
            type="button"
            className={cn(
              "hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl",
              "text-[0.8125rem] font-medium text-text-secondary",
              "border border-border-primary",
              "hover:border-lavender-300 hover:text-lavender-600",
              "transition-all duration-250"
            )}
          >
            View all
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Movie Carousel */}
      <div className="container-frame">
        <div className="flex gap-5 md:gap-7 overflow-x-auto pb-6 -mx-6 px-6 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16 scrollbar-hide snap-x snap-mandatory">
          {TRENDING_MOVIES.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MovieCard({
  movie,
  index,
}: {
  movie: (typeof TRENDING_MOVIES)[number];
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group flex-shrink-0 w-[240px] md:w-[280px] lg:w-[300px] snap-start cursor-pointer"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-neutral-100">
        <Image
          src={movie.poster}
          alt={`${movie.title} movie poster`}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          sizes="(max-width: 768px) 240px, (max-width: 1024px) 280px, 300px"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
          <p className="text-[0.8125rem] text-white/80 font-light italic leading-relaxed">
            &ldquo;{movie.tagline}&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[0.75rem] text-white/60">{movie.duration}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[0.75rem] text-white/60">{movie.genre}</span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="#fbbf24"
            className="flex-shrink-0"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[0.75rem] font-semibold text-white">
            {movie.rating}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <h3 className="text-[1.0625rem] font-medium text-text-primary tracking-tight leading-snug group-hover:text-lavender-600 transition-colors duration-300">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[0.8125rem] text-text-tertiary">{movie.year}</span>
          <span className="w-1 h-1 rounded-full bg-neutral-300" />
          <span className="text-[0.8125rem] text-text-tertiary">
            {movie.director}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
