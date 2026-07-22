"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MOOD_DEFINITIONS } from "@/services/curated-collections";
import { MovieCard, type Movie } from "@/components/ui";
import { Film } from "lucide-react";

export function MoodSection() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [selectedMoodId, setSelectedMoodId] = useState<string>("melancholic");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  // Fetch counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/movies?type=mood-counts");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const countMap: Record<string, number> = {};
            data.forEach((item: { id: string; count: number }) => {
              countMap[item.id] = item.count;
            });
            setCounts(countMap);
          }
        }
      } catch (err) {
        console.error("Failed to fetch mood counts", err);
      } finally {
        setLoadingCounts(false);
      }
    };
    fetchCounts();
  }, []);

  // Fetch movies for selected mood
  useEffect(() => {
    const fetchMovies = async () => {
      setLoadingMovies(true);
      try {
        const res = await fetch(`/api/movies?type=mood&moodId=${selectedMoodId}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.movies)) {
            setMovies(data.movies);
          }
        }
      } catch (err) {
        console.error(`Failed to fetch movies for mood ${selectedMoodId}`, err);
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchMovies();
  }, [selectedMoodId]);

  const activeMoodName = MOOD_DEFINITIONS.find((m) => m.id === selectedMoodId)?.name || "";

  return (
    <section
      className="relative py-16 md:py-24 overflow-hidden bg-[#0e0d0b]"
      aria-label="Explore by mood"
    >
      <div className="container-frame relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-overline-style block mb-3 text-[rgba(232,226,217,0.4)]">
            Mood Discovery
          </span>
          <h2 className="font-display italic font-normal text-[2.25rem] sm:text-[3rem] text-[#e8e2d9] tracking-tight leading-tight mb-4">
            How do you want to feel tonight?
          </h2>
          <p className="mt-4 font-sans text-xs md:text-sm tracking-wider uppercase text-[rgba(232,226,217,0.4)]">
            Every emotion has a film. Let your mood guide the archive.
          </p>
        </div>

        {/* Grid of Flat Dark Rectangular Tiles for Mood Selection */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {MOOD_DEFINITIONS.map((mood, index) => {
            const filmCount = counts[mood.id] || 350;
            const isSelected = mood.id === selectedMoodId;

            return (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <button
                  onClick={() => setSelectedMoodId(mood.id)}
                  className="w-full text-left focus:outline-none cursor-pointer h-full"
                >
                  <div
                    className={`group flex flex-col justify-between p-4 bg-[#161410] border transition-all duration-300 min-h-[130px] rounded-none h-full ${
                      isSelected
                        ? "border-[#e8d5b0]/60 bg-[#1e1c18] shadow-[0_0_20px_rgba(232,213,176,0.05)]"
                        : "border-white/5 hover:border-[#e8d5b0]/20 hover:bg-[#1b1915]"
                    }`}
                  >
                    <div>
                      <span className="text-[0.625rem] font-sans font-normal text-[rgba(232,226,217,0.3)] tracking-[0.15em] uppercase block mb-1">
                        {loadingCounts ? "..." : `${filmCount} FILMS`}
                      </span>
                      <h3 className={`font-display italic font-normal text-[1.25rem] leading-tight transition-colors ${
                        isSelected ? "text-[#e8d5b0]" : "text-[#e8d5b0]/80 group-hover:text-[#e8d5b0]"
                      }`}>
                        {mood.name}
                      </h3>
                    </div>
                    <p className="text-[0.6875rem] font-sans font-light text-[rgba(232,226,217,0.4)] group-hover:text-[rgba(232,226,217,0.5)] transition-colors mt-2 leading-snug">
                      {mood.description}
                    </p>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Dynamic Movie Posters Grid for Selected Mood */}
        <div className="relative border border-white/5 bg-[#12100d]/50 p-6 md:p-8 mb-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <h3 className="font-display italic text-lg text-[#e8d5b0] flex items-center gap-2">
              <span className="text-stone-500 font-sans text-xs not-italic uppercase tracking-[0.2em] font-semibold">
                Curated:
              </span>
              {activeMoodName} Films
            </h3>
            <Link
              href={`/discover?mood=${selectedMoodId}`}
              className="text-[0.6875rem] font-sans font-medium uppercase tracking-[0.15em] text-[rgba(232,226,217,0.5)] hover:text-[#e8d5b0] transition-colors"
            >
              Explore Full Collection →
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMoodId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {loadingMovies ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={`skeleton-${idx}`}
                      className="aspect-[2/3] w-full bg-[#161410]/70 shimmer border border-white/5"
                    />
                  ))}
                </div>
              ) : movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <Link href={`/movie/${movie.id}`} key={movie.id} className="block group">
                      <MovieCard movie={movie} className="w-full" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center text-[rgba(232,226,217,0.3)]">
                  <Film className="size-6 mb-2 opacity-50" />
                  <span className="text-xs uppercase tracking-widest font-sans font-light">
                    No posters retrieved from the archive.
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
