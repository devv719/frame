"use client";
 
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogModal, type Movie } from "@/components/ui";
 
export function HeroSection() {
  const [posters, setPosters] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);
 
  useEffect(() => {
    const loadPosters = async () => {
      try {
        const res = await fetch("/api/movies?type=trending&limit=8");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setPosters(data.filter(movie => movie.poster));
          }
        }
      } catch (err) {
        console.error("Failed to load hero posters from TMDB", err);
      } finally {
        setLoading(false);
      }
    };
    loadPosters();
  }, []);
 
  return (
    <section
      className="relative min-h-[85vh] flex flex-col items-center justify-center bg-[#0e0d0b] text-[#e8e2d9] py-20 md:py-32"
      aria-label="Hero"
    >
      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative z-10 container-frame flex flex-col items-center text-center"
      >
        
        {/* Understated Literary Headline */}
        <h1 className="leading-[1.15] font-display italic font-normal text-[2.25rem] sm:text-[3rem] md:text-[4rem] text-[#e8e2d9] tracking-tight max-w-3xl">
          A personal archive for every story you&apos;ve watched.
        </h1>
 
        {/* Subtitle in Small Muted Inter */}
        <p className="mt-6 max-w-xl text-[0.875rem] font-sans font-light text-[rgba(232,226,217,0.4)] tracking-wide leading-relaxed">
          A quiet space for cinema lovers to record, organize, remember, and rediscover everything they&apos;ve watched. Not a social network. Not a discovery platform.
        </p>
 
        {/* Interactive shelf of upright TMDB movie posters */}
        <div className="w-full mt-12 mb-10 select-none overflow-hidden">
          <div className="flex gap-4 items-center justify-start md:justify-center flex-nowrap overflow-x-auto pb-4 scrollbar-hide">
            {loading ? (
              Array.from({ length: 7 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="relative w-[110px] sm:w-[130px] md:w-[150px] aspect-[2/3] rounded-none bg-[#161410] border border-white/5 animate-pulse flex-shrink-0"
                />
              ))
            ) : posters.length > 0 ? (
              posters.map((movie) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                  whileHover={{
                    scale: 1.04,
                    rotate: 0.5,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.65)",
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
                  }}
                  className="flex-shrink-0"
                >
                  <Link href={`/movie/${movie.id}`} className="block group">
                    <div className="relative w-[110px] sm:w-[130px] md:w-[150px] aspect-[2/3] rounded-none bg-[#161410] border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-[#e8d5b0]/40">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 110px, 150px"
                        unoptimized={movie.poster.startsWith("http")}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="h-[200px] flex items-center justify-center text-text-muted">
                No active showcase movies.
              </div>
            )}
          </div>
        </div>
 
        {/* Three Stat Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <span className="px-5 py-2 bg-[#161410] border border-white/5 rounded-full text-[0.75rem] font-sans font-light text-[#e8d5b0] uppercase tracking-[0.12em]">
            12,400+ films catalogued
          </span>
          <span className="px-5 py-2 bg-[#161410] border border-white/5 rounded-full text-[0.75rem] font-sans font-light text-[#e8d5b0] uppercase tracking-[0.12em]">
            2,800+ filming locations
          </span>
          <span className="px-5 py-2 bg-[#161410] border border-white/5 rounded-full text-[0.75rem] font-sans font-light text-[#e8d5b0] uppercase tracking-[0.12em]">
            340+ curated collections
          </span>
        </div>
 
        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/shelf"
            className="px-6 py-3.5 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-sans font-medium uppercase tracking-[0.15em] transition-colors duration-300"
          >
            Open Your Vault
          </Link>
          <button
            onClick={() => setIsLogOpen(true)}
            className="px-6 py-3.5 border border-white/10 hover:border-white/20 text-[#e8e2d9] hover:bg-white/5 text-[0.75rem] font-sans font-medium uppercase tracking-[0.15em] transition-colors duration-300"
          >
            Log a Watch
          </button>
        </div>
      </motion.div>
 
      <LogModal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </section>
  );
}
