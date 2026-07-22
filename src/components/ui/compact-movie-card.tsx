"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Movie } from "./movie-card";

export interface CompactMovieCardProps {
  movie?: Movie;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
}

export function CompactMovieCard({
  movie,
  isLoading,
  className,
  onClick,
}: CompactMovieCardProps) {
  if (isLoading || !movie) {
    return <CompactMovieCardSkeleton className={className} />;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-4 p-3 cursor-pointer bg-[#161410] border border-white/5",
        "hover:border-[#e8d5b0]/30 hover:-translate-y-0.5",
        "transition-all duration-300",
        className
      )}
    >
      {/* Small Poster Thumbnail */}
      <div className="relative w-16 md:w-20 aspect-[2/3] overflow-hidden flex-shrink-0 bg-[#0e0d0b]">
        {movie.poster ? (
          <Image
            src={movie.poster}
            alt={`${movie.title} thumbnail`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="80px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-1 bg-[#161410] border border-white/5">
            <span className="text-[0.55rem] font-display italic text-white/30 text-center leading-tight truncate">
              {movie.title}
            </span>
          </div>
        )}
      </div>

      {/* Info Details */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[0.6875rem] font-sans font-medium text-[#e8d5b0] uppercase tracking-[0.14em]">
            {movie.genre}
          </span>
          <span className="text-[rgba(232,226,217,0.3)] text-[0.75rem]">·</span>
          <span className="text-[0.6875rem] font-sans text-[rgba(232,226,217,0.45)]">{movie.year}</span>
        </div>

        <h4 className="font-display italic font-normal text-[0.9375rem] text-[#e8e2d9] tracking-tight truncate leading-snug group-hover:text-[#e8d5b0] transition-colors duration-200">
          {movie.title}
        </h4>

        <p className="text-[0.75rem] font-sans text-[rgba(232,226,217,0.4)] truncate mt-0.5">
          Dir: {movie.director}
        </p>

        {/* Rating and Duration */}
        <div className="flex items-center gap-2.5 mt-2">
          <div className="flex items-center gap-0.5">
            <Star className="size-3 text-amber-400 fill-amber-400" />
            <span className="text-[0.75rem] font-sans font-medium text-[#e8e2d9]">
              {movie.rating.toFixed(1)}
            </span>
          </div>
          <span className="w-1 h-1 bg-[rgba(232,226,217,0.2)]" />
          <span className="text-[0.75rem] font-sans text-[rgba(232,226,217,0.4)]">{movie.duration}</span>
        </div>
      </div>

      {/* Hover arrow indicator */}
      <div className="w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#e8d5b0]"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </motion.article>
  );
}

export function CompactMovieCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-3 bg-[#161410] border border-white/5 overflow-hidden",
        className
      )}
    >
      {/* Thumbnail Skeleton */}
      <div className="w-16 md:w-20 aspect-[2/3] bg-white/5 shimmer flex-shrink-0 overflow-hidden" />

      {/* Info Skeleton */}
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-2">
          <div className="h-2.5 bg-white/8 w-12 shimmer" />
          <div className="h-2.5 bg-white/8 w-8 shimmer" />
        </div>
        <div className="h-3.5 bg-white/8 w-3/4 shimmer" />
        <div className="h-3 bg-white/6 w-1/2 shimmer" />
        <div className="flex items-center gap-2 mt-1">
          <div className="h-2.5 bg-white/8 w-8 shimmer" />
          <div className="h-2.5 bg-white/8 w-12 shimmer" />
        </div>
      </div>
    </div>
  );
}
