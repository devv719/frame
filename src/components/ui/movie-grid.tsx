"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MovieCard, MovieCardSkeleton, type Movie } from "./movie-card";
import { CompactMovieCard, CompactMovieCardSkeleton } from "./compact-movie-card";
import { staggerContainer, staggerItem } from "@/lib/motion";

export interface MovieGridProps {
  movies?: Movie[];
  isLoading?: boolean;
  skeletonCount?: number;
  className?: string;
  cardType?: "normal" | "compact";
  onMovieClick?: (movie: Movie) => void;
  children?: React.ReactNode;
}

export function MovieGrid({
  movies,
  isLoading = false,
  skeletonCount = 8,
  className,
  cardType = "normal",
  onMovieClick,
  children,
}: MovieGridProps) {
  
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-6 md:gap-8",
          cardType === "compact"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          className
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`skeleton-${index}`}>
            {cardType === "compact" ? (
              <CompactMovieCardSkeleton />
            ) : (
              <MovieCardSkeleton />
            )}
          </div>
        ))}
      </div>
    );
  }

  // If children are supplied directly, render children in a basic grid layout
  if (children) {
    return (
      <div
        className={cn(
          "grid gap-6 md:gap-8",
          cardType === "compact"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
          className
        )}
      >
        {children}
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border-secondary rounded-2xl bg-surface-primary">
        <p className="text-text-secondary text-[0.9375rem]">No movies found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
      className={cn(
        "grid gap-6 md:gap-8",
        cardType === "compact"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        className
      )}
    >
      {movies.map((movie, index) => (
        <motion.div key={movie.id} variants={staggerItem}>
          {cardType === "compact" ? (
            <CompactMovieCard
              movie={movie}
              onClick={() => onMovieClick?.(movie)}
            />
          ) : (
            <MovieCard
              movie={movie}
              onClick={() => onMovieClick?.(movie)}
            />
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
