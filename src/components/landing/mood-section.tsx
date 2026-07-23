"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MOOD_DEFINITIONS } from "@/services/curated-collections";
import { MovieCard, type Movie } from "@/components/ui";
import { Film } from "lucide-react";

/* ── Shared animation variants ── */

const easing = [0.16, 1, 0.3, 1] as const;

const headingVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easing },
  },
};

const moodGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.15,
    },
  },
};

const moodCardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing },
  },
};

const collectionGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const collectionItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing },
  },
};

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
      className="relative section-padding overflow-hidden bg-[#0e0d0b]"
      aria-label="Explore by mood"
    >
      <div className="container-frame relative">
        {/* Header — slide from left */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={headingVariants}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <span className="text-overline-style block mb-3 text-[rgba(232,226,217,0.4)]">
            Mood Discovery
          </span>
          <h2 className="font-display italic font-normal text-[2.25rem] sm:text-[3rem] text-[#e8e2d9] tracking-tight leading-tight mb-4">
            How do you want to feel tonight?
          </h2>
          <p className="mt-4 font-sans text-xs md:text-sm tracking-wider uppercase text-[rgba(232,226,217,0.4)]">
            Every emotion has a film. Let your mood guide the archive.
          </p>
        </motion.div>

        {/* Mood Cards Grid — staggerChildren + hover lift */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={moodGridVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16 md:mb-20"
        >
          {MOOD_DEFINITIONS.map((mood) => {
            const filmCount = counts[mood.id] || 350;
            const isSelected = mood.id === selectedMoodId;

            return (
              <motion.div
                key={mood.id}
                variants={moodCardVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.25, ease: easing },
                }}
                className="flex h-full w-full"
              >
                <button
                  onClick={() => setSelectedMoodId(mood.id)}
                  className="w-full text-left focus:outline-none cursor-pointer h-full flex flex-col"
                >
                  <div
                    className={`group flex flex-col justify-between p-5 bg-[#161410] border transition-all duration-300 min-h-[140px] rounded-none w-full h-full ${
                      isSelected
                        ? "border-[#e8d5b0]/60 bg-[#1e1c18] shadow-[0_0_30px_rgba(232,213,176,0.08)]"
                        : "border-white/5 hover:border-[#e8d5b0]/20 hover:bg-[#1b1915] hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                    }`}
                  >
                    <div>
                      <span className="text-[0.625rem] font-sans font-normal text-[rgba(232,226,217,0.3)] tracking-[0.15em] uppercase block mb-1">
                        {loadingCounts ? "..." : `${filmCount} FILMS`}
                      </span>
                      <h3
                        className={`font-display italic font-normal text-[1.25rem] leading-tight transition-colors ${
                          isSelected ? "text-[#e8d5b0]" : "text-[#e8d5b0]/80 group-hover:text-[#e8d5b0]"
                        }`}
                      >
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
        </motion.div>

        {/* Dynamic Movie Posters Grid for Selected Mood */}
        <div className="relative border border-white/5 bg-[#12100d]/50 p-6 md:p-8 mb-8">
          {/* Section sub-header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={headingVariants}
            className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-white/5 pb-4 mb-6"
          >
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
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMoodId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: easing }}
            >
              {loadingMovies ? (
                /* Skeleton — responsive: 1 col mobile, 2 tablet, 4 desktop */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={`skeleton-${idx}`}
                      className="aspect-[2/3] w-full bg-[#161410]/70 shimmer border border-white/5"
                    />
                  ))}
                </div>
              ) : movies.length > 0 ? (
                /* Stagger-reveal grid — responsive columns */
                <motion.div
                  variants={collectionGridVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  {movies.slice(0, 8).map((movie) => (
                    <motion.div
                      key={movie.id}
                      variants={collectionItemVariants}
                      whileHover={{
                        scale: 1.04,
                        rotate: 0.5,
                        boxShadow: "0 20px 45px rgba(0,0,0,0.65)",
                        transition: { duration: 0.3, ease: easing },
                      }}
                      className="flex flex-col h-full"
                    >
                      <Link href={`/movie/${movie.id}`} className="block group h-full">
                        <MovieCard movie={movie} className="w-full h-full" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
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
