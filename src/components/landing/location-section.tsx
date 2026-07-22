"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CURATED_LOCATIONS, type CuratedLocation } from "@/services/curated-collections";
import { cn } from "@/lib/utils";
import { MapPin, Film } from "lucide-react";

export function LocationSection() {
  const [locations, setLocations] = useState<(CuratedLocation & { posterUrl?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocationPosters = async () => {
      setLoading(true);
      try {
        const hydrated = await Promise.all(
          CURATED_LOCATIONS.map(async (loc) => {
            try {
              const res = await fetch(`/api/movies?type=detail&id=${loc.tmdbMovieId}`);
              if (res.ok) {
                const details = await res.json();
                return {
                  ...loc,
                  posterUrl: details.poster || `https://image.tmdb.org/t/p/w342${loc.posterPath}`,
                };
              }
            } catch (err) {
              console.error(`Failed to fetch details for movie ID ${loc.tmdbMovieId}`, err);
            }
            return {
              ...loc,
              posterUrl: `https://image.tmdb.org/t/p/w342${loc.posterPath}`,
            };
          })
        );
        setLocations(hydrated);
      } catch (err) {
        console.error("Failed to load locations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocationPosters();
  }, []);

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden bg-[#0e0d0b]"
      aria-label="Explore by location"
    >
      <div className="container-frame relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 border-b border-white/5 pb-8">
          <div>
            <span className="text-overline-style block mb-3 text-[rgba(232,226,217,0.4)]">
              Film Geography
            </span>
            <h2 className="font-display italic font-normal text-[2.25rem] sm:text-[3rem] text-[#e8e2d9] tracking-tight leading-tight">
              Cinema has no borders
            </h2>
          </div>
          <p className="max-w-sm text-[rgba(232,226,217,0.4)] text-[0.8125rem] leading-relaxed font-sans uppercase tracking-wider">
            Trace the footsteps of your favorite films across continents and cultures.
          </p>
        </div>

        {/* Location Grid — Flat Dark Rectangular Tiles with Posters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="bg-[#161410] border border-white/5 aspect-[3/4] w-full shimmer"
                />
              ))
            : locations.map((loc, index) => (
                <motion.div
                  key={loc.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-full"
                >
                  <Link href={`/movie/${loc.tmdbMovieId}`} className="block h-full group">
                    <div className="flex flex-col bg-[#161410] border border-white/5 transition-all duration-300 hover:border-[#e8d5b0]/25 hover:bg-[#1e1c18] h-full">
                      {/* Top Poster Area */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                        {loc.posterUrl ? (
                          <Image
                            src={loc.posterUrl}
                            alt={`${loc.movieTitle} poster`}
                            fill
                            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-103 brightness-[0.75] group-hover:brightness-90"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized={loc.posterUrl.startsWith("http")}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-white/20">
                            <Film className="size-8" />
                          </div>
                        )}
                        {/* Coordinates Badge */}
                        <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/75 backdrop-blur-md border border-white/10 text-[0.625rem] font-mono text-[#e8d5b0] tracking-wider">
                          {loc.coordinates[0].toFixed(4)}° {loc.coordinates[0] >= 0 ? "E" : "W"}, {loc.coordinates[1].toFixed(4)}° {loc.coordinates[1] >= 0 ? "N" : "S"}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-6 flex flex-col flex-grow justify-between text-left">
                        <div>
                          <div className="flex items-center gap-1.5 text-[0.6875rem] text-[rgba(232,226,217,0.4)] font-sans font-light tracking-[0.15em] uppercase mb-2">
                            <MapPin className="size-3 text-[#e8d5b0]/60" />
                            <span>{loc.city}, {loc.country}</span>
                          </div>

                          <h3 className="font-display italic font-normal text-[#e8e2d9] text-[1.35rem] leading-snug mb-1">
                            {loc.movieTitle}
                          </h3>
                          <span className="text-[0.75rem] font-sans font-light text-[rgba(232,226,217,0.4)] block mb-4">
                            {loc.year} • Directed by {loc.director}
                          </span>

                          <p className="text-[0.8125rem] font-sans font-light text-[rgba(232,226,217,0.5)] group-hover:text-[rgba(232,226,217,0.7)] transition-colors leading-relaxed line-clamp-3">
                            {loc.scene}
                          </p>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[0.6875rem] font-sans font-medium uppercase tracking-wider text-[#e8d5b0] group-hover:text-white transition-colors">
                          <span>Explore Scene</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
