"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Clock } from "lucide-react";
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

export interface MovieCardProps {
  movie?: Movie;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function MovieCard({ movie, isLoading, className, onClick }: MovieCardProps) {
  if (isLoading || !movie) {
    return <MovieCardSkeleton className={className} />;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn(
        "group relative flex-shrink-0 w-full snap-start cursor-pointer overflow-hidden rounded-2xl bg-bg-secondary border border-border-secondary",
        "hover:shadow-xl hover:border-lavender-200 hover:-translate-y-1",
        "transition-all duration-500",
        className
      )}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-100">
        <Image
          src={movie.poster}
          alt={`${movie.title} movie poster`}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Hover Glassmorphism Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 backdrop-blur-[2px]">
          {movie.tagline && (
            <p className="text-[0.8125rem] text-white/90 font-light italic leading-relaxed mb-3">
              &ldquo;{movie.tagline}&rdquo;
            </p>
          )}
          
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[0.75rem] text-white/70 font-medium">
              <Clock className="size-3" />
              {movie.duration}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-[0.75rem] text-white/70 font-medium">{movie.genre}</span>
          </div>
        </div>

        {/* Floating Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
          <Star className="size-3 text-amber-400 fill-amber-400" />
          <span className="text-[0.75rem] font-semibold text-white">
            {movie.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Basic Info (Visible below poster) */}
      <div className="p-4 bg-surface-primary">
        <h3 className="text-[1rem] font-display font-semibold text-text-primary tracking-tight truncate group-hover:text-lavender-600 transition-colors duration-300">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[0.8125rem] text-text-secondary">{movie.year}</span>
          <span className="w-1 h-1 rounded-full bg-neutral-300" />
          <span className="text-[0.8125rem] text-text-secondary truncate max-w-[120px]">
            {movie.director}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function MovieCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl overflow-hidden bg-surface-primary border border-border-secondary shadow-sm",
        className
      )}
    >
      {/* Poster Skeleton */}
      <div className="relative w-full aspect-[2/3] bg-neutral-100 shimmer overflow-hidden" />
      
      {/* Text Skeleton */}
      <div className="p-4 flex flex-col gap-2">
        <div className="h-4 bg-neutral-200 rounded-full w-3/4 shimmer" />
        <div className="flex items-center gap-2">
          <div className="h-3 bg-neutral-150 rounded-full w-1/4 shimmer" />
          <div className="size-1 rounded-full bg-neutral-200" />
          <div className="h-3 bg-neutral-150 rounded-full w-1/3 shimmer" />
        </div>
      </div>
    </div>
  );
}
