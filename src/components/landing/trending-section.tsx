"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { type Movie } from "@/components/ui/movie-card";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "trending", label: "Trending" },
  { id: "popular", label: "Popular" },
  { id: "top-rated", label: "Top Rated" },
] as const;

type MovieCategory = (typeof TABS)[number]["id"];

/**
 * TrendingSection — Dynamic movie showcase carousel with category tabs.
 *
 * Features:
 * - Tab-based category switching (Trending, Popular, Top Rated)
 * - Smooth Framer Motion sliding indicators
 * - Client-side state hydration via API proxy routes
 * - Skeleton loader states using native CSS shimmer utility
 * - Unified error handling with retry support
 * - Scroll-triggered reveal and hover poster effect
 */
export function TrendingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start 0.3"],
  });
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  // Tab State & Fetching State
  const [activeTab, setActiveTab] = useState<MovieCategory>("trending");
  const [moviesCache, setMoviesCache] = useState<Record<MovieCategory, Movie[] | null>>({
    trending: null,
    popular: null,
    "top-rated": null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryMovies = async (category: MovieCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/movies?type=${category}&limit=10`);
      if (!response.ok) {
        throw new Error(`Failed to load ${category} movies (${response.status})`);
      }
      const data = await response.json();
      setMoviesCache((prev) => ({ ...prev, [category]: data }));
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!moviesCache[activeTab]) {
      fetchCategoryMovies(activeTab);
    } else {
      setLoading(false);
      setError(null);
    }
  }, [activeTab]);

  const handleRetry = () => {
    fetchCategoryMovies(activeTab);
  };

  const currentMovies = moviesCache[activeTab] || [];

  return (
    <section
      ref={sectionRef}
      className="relative section-padding overflow-hidden"
      aria-label="Movie showcase"
    >
      {/* Section Header */}
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="container-frame mb-12"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-overline-style block mb-3">
              Discover Cinema
            </span>
            <h2>
              What the world is{" "}
              <span className="gradient-text">watching</span>
            </h2>
          </div>

          {/* Elegant Sliding Tab Selector */}
          <div className="flex p-1 rounded-xl bg-neutral-100/80 border border-neutral-200/50 backdrop-blur-md self-start sm:self-auto select-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative px-4 py-2.5 rounded-lg text-[0.8125rem] font-medium transition-all duration-300",
                    isActive
                      ? "text-text-primary font-semibold"
                      : "text-text-secondary hover:text-text-primary"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Movie Showcase Carousel */}
      <div className="container-frame">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full py-14 px-6 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/30"
            >
              <div className="p-3.5 rounded-full bg-red-50 text-red-500 mb-4 border border-red-100">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h4 className="text-[1.125rem] font-semibold text-text-primary mb-2">
                Unable to load movies
              </h4>
              <p className="text-[0.875rem] text-text-secondary max-w-md mb-6">
                {error}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="px-6 py-3 rounded-xl bg-lavender-500 hover:bg-lavender-600 text-white text-[0.875rem] font-medium shadow-md shadow-lavender-500/10 active:scale-[0.97] transition-all duration-200"
              >
                Try again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex gap-5 md:gap-7 overflow-x-auto pb-6 -mx-6 px-6 md:-mx-8 md:px-8 lg:-mx-12 lg:px-12 xl:-mx-16 xl:px-16 scrollbar-hide snap-x snap-mandatory"
            >
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <MovieCardSkeleton key={`skeleton-${index}`} />
                  ))
                : currentMovies.map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index} />
                  ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group flex-shrink-0 w-[240px] md:w-[280px] lg:w-[300px] snap-start cursor-pointer select-none"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-neutral-100 shadow-sm border border-neutral-200/40">
        <Image
          src={movie.poster}
          alt={`${movie.title} movie poster`}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          sizes="(max-width: 768px) 240px, (max-width: 1024px) 280px, 300px"
          unoptimized={movie.poster.startsWith("http")} // Bypass next/image optimization for external live images to improve responsiveness
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 backdrop-blur-[2px]">
          {movie.tagline && (
            <p className="text-[0.8125rem] text-white/90 font-light italic leading-relaxed mb-3 line-clamp-3">
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="text-[0.75rem] text-white/70 font-medium">{movie.duration}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[0.75rem] text-white/70 font-medium">{movie.genre}</span>
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
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
            {typeof movie.rating === "number" ? movie.rating.toFixed(1) : movie.rating}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-1">
        <h3 className="text-[1rem] font-display font-semibold text-text-primary tracking-tight leading-snug truncate group-hover:text-lavender-600 transition-colors duration-300">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[0.8125rem] text-text-secondary">{movie.year}</span>
          <span className="w-1 h-1 rounded-full bg-neutral-300" />
          <span className="text-[0.8125rem] text-text-secondary truncate max-w-[150px]">
            {movie.director}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

function MovieCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-[240px] md:w-[280px] lg:w-[300px] snap-start select-none">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-neutral-100 shimmer" />
      <div className="px-1 flex flex-col gap-2">
        <div className="h-5 bg-neutral-200 rounded-lg w-3/4 shimmer" />
        <div className="flex items-center gap-2">
          <div className="h-4 bg-neutral-150 rounded-md w-12 shimmer" />
          <div className="size-1 rounded-full bg-neutral-200" />
          <div className="h-4 bg-neutral-150 rounded-md w-24 shimmer" />
        </div>
      </div>
    </div>
  );
}
