"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, animate } from "framer-motion";
import { Star, Clock, Film, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Movie {
  id: string | number;
  title: string;
  year: number;
  rating: number;
  genre: string;
  director: string;
  tagline?: string;
  poster: string;
  duration: string;
}

export function TrendingSection() {
  const [movies, setMovies] = useState<{
    trending: Movie[];
    popular: Movie[];
    topRated: Movie[];
  }>({
    trending: [],
    popular: [],
    topRated: [],
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trendingRes, popularRes, topRatedRes] = await Promise.all([
        fetch("/api/movies?type=trending&limit=15"),
        fetch("/api/movies?type=popular&limit=15"),
        fetch("/api/movies?type=top-rated&limit=15"),
      ]);

      if (!trendingRes.ok || !popularRes.ok || !topRatedRes.ok) {
        throw new Error("Failed to load cinema data");
      }

      const [trendingData, popularData, topRatedData] = await Promise.all([
        trendingRes.json(),
        popularRes.json(),
        topRatedRes.json(),
      ]);

      setMovies({
        trending: trendingData,
        popular: popularData,
        topRated: topRatedData,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred loading the archive.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  return (
    <section
      className="relative section-padding overflow-hidden bg-[#0e0d0b]"
      aria-label="Cinematic orbital showcase"
    >
      {/* Film Grain Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-20 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
        aria-hidden="true"
      />

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#e8d5b0]/[0.02] blur-[120px] pointer-events-none -z-10 animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#ebdcb9]/[0.015] blur-[150px] pointer-events-none -z-10 animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="container-frame mb-12 relative z-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="text-overline-style block mb-3 text-[rgba(232,226,217,0.4)]">
              Discover Cinema
            </span>
            <h2 className="font-display italic font-normal text-[2.25rem] sm:text-[3rem] text-[#e8e2d9] tracking-tight leading-tight">
              What the world is watching
            </h2>
          </div>
          <div className="hidden md:block text-right max-w-[280px]">
            <p className="text-[0.8125rem] text-[rgba(232,226,217,0.4)] font-sans leading-relaxed">
              Explore three orbiting tiers of trending, popular, and critically acclaimed masterworks.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Marquee Rows Container */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Edge Gradients Fades */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-[#0e0d0b] via-[#0e0d0b]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-[#0e0d0b] via-[#0e0d0b]/80 to-transparent z-20 pointer-events-none" />

        {error ? (
          <div className="container-frame my-12">
            <div className="w-full py-14 px-6 flex flex-col items-center justify-center text-center border border-white/5 bg-[#161410]/50">
              <h4 className="text-[1.125rem] font-display italic text-[#e8e2d9] mb-2">
                Unable to load the showcase
              </h4>
              <p className="text-[0.875rem] text-[rgba(232,226,217,0.4)] max-w-md mb-6 font-sans">
                {error}
              </p>
              <button
                type="button"
                onClick={fetchAllMovies}
                className="px-6 py-3 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.875rem] font-sans font-medium transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="space-y-8 py-4">
            <div className="container-frame">
              <div className="h-3 bg-[#161410] w-24 shimmer mb-4" />
            </div>
            <MarqueeSkeletonRow />
            <div className="container-frame">
              <div className="h-3 bg-[#161410] w-24 shimmer mb-4" />
            </div>
            <MarqueeSkeletonRow />
            <div className="container-frame">
              <div className="h-3 bg-[#161410] w-24 shimmer mb-4" />
            </div>
            <MarqueeSkeletonRow />
          </div>
        ) : (
          <div className="space-y-10 py-4 relative z-10">
            {/* Top Row - Trending (Right to Left) */}
            <div>
              <div className="container-frame mb-3">
                <span className="text-overline-style text-[#e8d5b0]/40 font-mono text-[0.6875rem] tracking-[0.2em] block select-none">
                  I. Trending Archive
                </span>
              </div>
              <MarqueeRow movies={movies.trending} speed={48} direction="left" />
            </div>

            {/* Middle Row - Popular (Left to Right) */}
            <div>
              <div className="container-frame mb-3">
                <span className="text-overline-style text-[#e8d5b0]/40 font-mono text-[0.6875rem] tracking-[0.2em] block select-none">
                  II. Global Favorites
                </span>
              </div>
              <MarqueeRow movies={movies.popular} speed={58} direction="right" />
            </div>

            {/* Bottom Row - Top Rated (Right to Left) */}
            <div>
              <div className="container-frame mb-3">
                <span className="text-overline-style text-[#e8d5b0]/40 font-mono text-[0.6875rem] tracking-[0.2em] block select-none">
                  III. Critically Acclaimed
                </span>
              </div>
              <MarqueeRow movies={movies.topRated} speed={42} direction="left" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   MARQUEE ROW COMPONENT
   ──────────────────────────────────────────────────────────── */

interface MarqueeRowProps {
  movies: Movie[];
  speed: number; // Animation duration in seconds
  direction: "left" | "right";
}

function MarqueeRow({ movies, speed, direction }: MarqueeRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  // Pad the movies array to ensure seamless looping without visual gaps on wider monitors.
  // We double it at the end to support the 0% to -50% translateX marquee shift.
  const prepareMovies = (list: Movie[]) => {
    if (!list || list.length === 0) return [];
    let output = [...list];
    while (output.length < 12) {
      output = [...output, ...list];
    }
    return [...output, ...output];
  };

  const duplicatedList = prepareMovies(movies);

  useEffect(() => {
    if (!containerRef.current || duplicatedList.length === 0) return;

    // Use direct Framer Motion animate loop to trigger fully GPU-composited translation.
    // Animating 0% to -50% (or -50% to 0%) produces a mathematically perfect loop.
    controlsRef.current = animate(
      containerRef.current,
      { x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] },
      {
        ease: "linear",
        duration: speed,
        repeat: Infinity,
        repeatType: "loop",
      }
    );

    return () => {
      controlsRef.current?.stop();
    };
  }, [speed, direction, duplicatedList.length]);

  const handleMouseEnter = () => {
    controlsRef.current?.pause();
  };

  const handleMouseLeave = () => {
    controlsRef.current?.play();
  };

  if (movies.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-4">
      <div
        ref={containerRef}
        className="flex gap-6 w-max will-change-transform"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {duplicatedList.map((movie, idx) => (
          <MarqueeMovieCard key={`${movie.id}-${direction}-${idx}`} movie={movie} />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   MARQUEE MOVIE CARD COMPONENT
   ──────────────────────────────────────────────────────────── */

interface MarqueeMovieCardProps {
  movie: Movie;
}

function MarqueeMovieCard({ movie }: MarqueeMovieCardProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative block flex-shrink-0 cursor-pointer py-4 select-none z-0 hover:z-30 transition-all duration-300"
      style={{ width: "260px" }}
    >
      {/* Ambient background glow beneath card on hover */}
      <div 
        className="absolute -inset-4 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(232,213,176,0.14)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10 blur-xl scale-110" 
      />

      {/* Main card viewport */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-[#161410] border border-white/5 shadow-xl group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.65)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:border-[#e8d5b0]/35 group-hover:-translate-y-2">
        {/* Poster Image */}
        {movie.poster ? (
          <Image
            src={movie.poster}
            alt={`${movie.title} poster`}
            fill
            className={cn(
              "object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] brightness-[0.8] group-hover:brightness-105 group-hover:scale-102",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setLoaded(true)}
            sizes="260px"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#161410]">
            <Film className="size-8 text-white/20 mb-2" />
            <span className="text-[0.875rem] font-display italic text-white/40 text-center leading-snug">
              {movie.title}
            </span>
          </div>
        )}

        {/* Shimmer element before load */}
        {!loaded && movie.poster && (
          <div className="absolute inset-0 bg-[#161410] shimmer" />
        )}

        {/* Float rating badge */}
        {movie.poster && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-none bg-black/70 backdrop-blur-md border border-white/10 shadow-lg select-none">
            <Star className="size-3.5 text-[#e8d5b0] fill-[#e8d5b0]" />
            <span className="text-[0.75rem] font-medium text-[#e8e2d9] font-sans">
              {typeof movie.rating === "number" ? movie.rating.toFixed(1) : movie.rating}
            </span>
          </div>
        )}

        {/* Float year badge */}
        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-none bg-black/60 backdrop-blur-md border border-white/5 text-[0.75rem] text-[rgba(232,226,217,0.7)] font-mono select-none">
          {movie.year}
        </div>

        {/* Default Title block (visible initially, fades on hover) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/55 to-transparent p-5 pt-14 flex flex-col justify-end transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="text-[1.1rem] font-display italic font-normal text-[#e8e2d9] leading-tight tracking-tight truncate">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between mt-2.5 text-[0.75rem] text-[rgba(232,226,217,0.5)] font-sans font-light uppercase tracking-wider">
            <span className="truncate max-w-[130px]">{movie.director || "Director"}</span>
            <span className="flex items-center gap-1">
              <Clock className="size-3 text-[rgba(232,226,217,0.4)]" />
              {movie.duration}
            </span>
          </div>
        </div>

        {/* Detailed Cinematic Slide-Up Overlay on Hover */}
        <div className="absolute inset-0 bg-[#0e0d0b]/90 backdrop-blur-md p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-10">
          {/* Header */}
          <div>
            <span className="text-[0.625rem] font-mono text-[#e8d5b0] tracking-[0.2em] uppercase block mb-1">
              {movie.genre || "Cinema"}
            </span>
            <h4 className="text-[1.25rem] font-display italic font-normal text-[#e8e2d9] leading-tight tracking-tight">
              {movie.title}
            </h4>
            <div className="flex items-center gap-2 mt-2 select-none">
              <span className="text-[0.75rem] text-[rgba(232,226,217,0.6)] font-mono">{movie.year}</span>
              <span className="size-1 rounded-full bg-white/20" />
              <span className="text-[0.75rem] text-[rgba(232,226,217,0.6)] font-sans">{movie.duration}</span>
            </div>
          </div>

          {/* Director & Tagline */}
          <div className="my-auto py-2">
            {movie.director && (
              <p className="text-[0.75rem] text-[#e8d5b0] font-sans font-light uppercase tracking-wider mb-2">
                Directed by <span className="font-normal text-[#e8e2d9]">{movie.director}</span>
              </p>
            )}
            {movie.tagline && (
              <p className="text-[0.8125rem] text-[rgba(232,226,217,0.7)] font-sans font-light italic leading-relaxed line-clamp-3">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}
          </div>

          {/* Navigation Action */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 select-none">
            <div className="flex items-center gap-1.5">
              <Star className="size-3.5 text-[#e8d5b0] fill-[#e8d5b0]" />
              <span className="text-[0.8125rem] font-semibold text-[#e8e2d9] font-sans">
                {typeof movie.rating === "number" ? movie.rating.toFixed(1) : movie.rating}
              </span>
            </div>
            <span className="text-[0.75rem] font-sans font-medium text-[#e8d5b0] uppercase tracking-wider flex items-center gap-0.5 group-hover:text-white transition-colors duration-300">
              Explore Film <ChevronRight className="size-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────
   MARQUEE SKELETON ROW COMPONENT
   ──────────────────────────────────────────────────────────── */

function MarqueeSkeletonRow() {
  return (
    <div className="flex gap-6 overflow-hidden py-4 -mx-6 px-6 md:-mx-8 md:px-8">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="flex-shrink-0 bg-[#161410] border border-white/5 rounded-xl aspect-[2/3] overflow-hidden shimmer"
          style={{ width: "260px" }}
        />
      ))}
    </div>
  );
}
