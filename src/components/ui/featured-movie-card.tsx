"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Clock, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Movie } from "./movie-card";

export interface FeaturedMovieCardProps {
  movie?: Movie;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
  onPlayClick?: (e: React.MouseEvent) => void;
  onListClick?: (e: React.MouseEvent) => void;
}

export function FeaturedMovieCard({
  movie,
  isLoading,
  className,
  onClick,
  onPlayClick,
  onListClick,
}: FeaturedMovieCardProps) {
  if (isLoading || !movie) {
    return <FeaturedMovieCardSkeleton className={className} />;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-3xl overflow-hidden cursor-pointer border border-border-secondary shadow-lg",
        "bg-neutral-950 min-h-[360px] md:min-h-[460px] flex flex-col justify-end",
        className
      )}
    >
      {/* Cinematic Backdrop Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={movie.poster} // Using poster as placeholder; in production, this would be movie.backdrop
          alt={`${movie.title} backdrop`}
          fill
          className="object-cover object-top opacity-80 transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          sizes="100vw"
          priority
        />
        {/* Soft dark vignette gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent hidden md:block" />
      </div>

      {/* Floating Info Overlay */}
      <div className="relative z-10 p-6 md:p-10 lg:p-12 w-full max-w-2xl text-white">
        {/* Genre Pill & Rating */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[0.75rem] font-medium tracking-wide uppercase border border-white/10">
            {movie.genre}
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/5">
            <Star className="size-3 text-amber-400 fill-amber-400" />
            <span className="text-[0.75rem] font-semibold">{movie.rating.toFixed(1)}</span>
          </div>
          <span className="text-white/60 text-[0.75rem] font-medium flex items-center gap-1">
            <Clock className="size-3" />
            {movie.duration}
          </span>
        </div>

        {/* Title & Tagline */}
        <h2 className="text-display text-[2rem] md:text-[3rem] lg:text-[3.5rem] font-semibold leading-tight tracking-tight text-white mb-3">
          {movie.title}
        </h2>
        
        {movie.tagline && (
          <p className="text-[1rem] md:text-[1.125rem] text-white/80 font-light italic leading-relaxed mb-6">
            &ldquo;{movie.tagline}&rdquo;
          </p>
        )}

        {/* Director Details */}
        <div className="flex items-center gap-2 mb-8 text-[0.875rem] text-white/60">
          <span>Directed by</span>
          <span className="font-semibold text-white">{movie.director}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>{movie.year}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayClick?.(e);
            }}
            className={cn(
              "flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium",
              "bg-white text-neutral-900 shadow-lg transition-transform active:scale-95 duration-200",
              "hover:bg-neutral-100"
            )}
          >
            <Play className="size-4 fill-current" />
            Watch Now
          </button>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onListClick?.(e);
            }}
            className={cn(
              "flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium",
              "border border-white/20 bg-white/10 backdrop-blur-md text-white shadow-lg transition-colors active:scale-95 duration-200",
              "hover:bg-white/20 hover:border-white/35"
            )}
          >
            <Plus className="size-4" />
            Add to List
          </button>
        </div>
      </div>

      {/* Subtle bottom line gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-lavender-500 via-pink-400 to-transparent opacity-70"
        aria-hidden="true"
      />
    </motion.article>
  );
}

export function FeaturedMovieCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full rounded-3xl overflow-hidden bg-neutral-900 min-h-[360px] md:min-h-[460px] relative flex flex-col justify-end p-6 md:p-10 lg:p-12 border border-border-secondary shadow-lg overflow-hidden",
        className
      )}
    >
      {/* Background Shimmer */}
      <div className="absolute inset-0 shimmer opacity-25" />

      {/* Content Skeleton */}
      <div className="relative z-10 max-w-2xl flex flex-col gap-4">
        {/* Pills skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-6 w-20 rounded-full bg-neutral-800/80 shimmer" />
          <div className="h-6 w-16 rounded-full bg-neutral-800/80 shimmer" />
          <div className="h-4 w-12 rounded-full bg-neutral-800/80" />
        </div>

        {/* Title skeleton */}
        <div className="h-10 md:h-14 w-3/4 rounded-2xl bg-neutral-800 shimmer" />

        {/* Subtitle skeleton */}
        <div className="h-5 w-1/2 rounded-lg bg-neutral-850 shimmer" />

        {/* Director info skeleton */}
        <div className="h-4 w-1/3 rounded-lg bg-neutral-850/60" />

        {/* Buttons skeleton */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-12 w-32 rounded-xl bg-neutral-800 shimmer" />
          <div className="h-12 w-32 rounded-xl bg-neutral-850/70" />
        </div>
      </div>
    </div>
  );
}
