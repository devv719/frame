"use client";
 
import Image from "next/image";
import { Star, Clock, Film } from "lucide-react";
import { motion } from "framer-motion";
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
      onClick={onClick}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      whileHover={{
        scale: 1.04,
        rotate: 0.5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
      }}
      className={cn(
        "group relative flex-shrink-0 w-full cursor-pointer bg-[#161410] border border-white/5 flex flex-col h-full",
        "hover:border-[#e8d5b0]/25 transition-all duration-300",
        className
      )}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
        {movie.poster ? (
          <>
            <Image
              src={movie.poster}
              alt={`${movie.title} movie poster`}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-101"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
 
            {/* Hover Glassmorphism Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5 backdrop-blur-[1px]">
              {movie.tagline && (
                <p className="text-[0.8125rem] text-white/90 font-light italic leading-relaxed mb-3">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}
              
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[0.75rem] text-white/70 font-light font-sans">
                  <Clock className="size-3" />
                  {movie.duration}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-[0.75rem] text-white/70 font-light font-sans uppercase tracking-wider">{movie.genre}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#161410] border border-white/5">
            <Film className="size-8 text-white/15 mb-3" />
            <span className="text-[0.875rem] font-display italic text-white/40 text-center leading-snug">
              {movie.title}
            </span>
          </div>
        )}
 
        {/* Floating Rating Badge */}
        {movie.poster && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-none bg-black/60 border border-white/10 text-[0.75rem]">
            <Star className="size-3 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-white font-sans">
              {movie.rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
  
      {/* Info */}
      <div className="p-4 bg-[#161410] select-none flex-grow flex flex-col justify-between">
        <h3 className="text-[1rem] font-display italic font-normal text-[#e8e2d9] tracking-tight truncate group-hover:text-[#e8d5b0] transition-colors duration-300">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <span className="text-[0.75rem] text-[#e8d5b0] font-sans font-light uppercase tracking-wider">{movie.year}</span>
          <span className="text-[0.75rem] text-[rgba(232,226,217,0.4)] truncate max-w-[140px] font-sans font-light uppercase tracking-wider">
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
        "w-full bg-[#161410] border border-white/5 flex flex-col h-full",
        className
      )}
    >
      <div className="relative w-full aspect-[2/3] bg-black shimmer overflow-hidden" />
      <div className="p-4 flex flex-col gap-2 flex-grow justify-between">
        <div className="h-4 bg-[#1e1c18] rounded-none w-3/4 shimmer" />
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
          <div className="h-3 bg-[#1e1c18] rounded-none w-1/4 shimmer" />
          <div className="h-3 bg-[#1e1c18] rounded-none w-1/3 shimmer" />
        </div>
      </div>
    </div>
  );
}
