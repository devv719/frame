"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getArchiveLogs, deleteArchiveLog } from "@/services/archiveService";
import { type CinemaLog } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Star, Trash2, Calendar, Sparkles, BookOpen, Quote, Film } from "lucide-react";
import { LogModal } from "@/components/ui";
import { getPosterUrl } from "@/services/tmdb";

const MOOD_PILLS: Record<string, string> = {
  Inspired: "border-[#d8b973] text-[#d8b973] bg-[#d8b973]/5",
  Heartbroken: "border-[#e0a397] text-[#e0a397] bg-[#e0a397]/5",
  Nostalgic: "border-[#ebdcb9] text-[#ebdcb9] bg-[#ebdcb9]/5",
  Disturbed: "border-[#a8a29e] text-[#a8a29e] bg-[#a8a29e]/5",
  Happy: "border-[#fda4af] text-[#fda4af] bg-[#fda4af]/5",
  Thoughtful: "border-[#e8d5b0] text-[#e8d5b0] bg-[#e8d5b0]/5",
  Tense: "border-red-400 text-red-400 bg-red-400/5",
  "In awe": "border-amber-300 text-amber-300 bg-amber-300/5",
};

export default function JournalPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<CinemaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const fetchLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getArchiveLogs(user.uid);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this cinema memory?")) {
      const success = await deleteArchiveLog(id);
      if (success) {
        setLogs((prev) => prev.filter((log) => log.id !== id));
        window.dispatchEvent(new CustomEvent("cinema-log-updated"));
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchLogs();
    }

    if (typeof window !== "undefined") {
      window.addEventListener("cinema-log-updated", fetchLogs);
      return () => window.removeEventListener("cinema-log-updated", fetchLogs);
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", options).toUpperCase();
  };

  return (
    <ProtectedRoute>
    <main className="min-h-screen bg-[#0e0d0b] text-[#f4f2ed] pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#292524] pb-8">
          <div>
            <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-[#e8d5b0] block mb-2 uppercase">
              Private Chronicle
            </span>
            <h1 className="text-[2.25rem] md:text-[3rem] font-display italic tracking-tight text-[#f4f2ed]">
              Cinema Journal
            </h1>
          </div>
          <button
            onClick={() => setIsLogOpen(true)}
            className="px-5 py-3 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-bold uppercase tracking-wider transition-colors active:scale-[0.98] cursor-pointer"
          >
            Log a Memory
          </button>
        </div>

        {/* Empty State */}
        {!loading && logs.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-[#292524] bg-[#151412]/50">
            <BookOpen className="text-[#3e3a38] mb-4" size={36} />
            <h3 className="text-[1.125rem] font-sans font-medium text-[#f4f2ed] uppercase tracking-wider mb-2">
              Journal is vacant
            </h3>
            <p className="text-[0.75rem] text-[#a8a29e] max-w-xs mb-6 tracking-wide uppercase">
              Write down your personal reflections on movies and series you have watched.
            </p>
            <button
              onClick={() => setIsLogOpen(true)}
              className="px-5 py-3 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Start Your Chronicle
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-12">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="flex gap-6 border-b border-[#292524]/40 pb-12">
                <div className="w-24 aspect-[2/3] bg-[#151412] border border-[#292524]/60 animate-pulse shrink-0" />
                <div className="flex-grow flex flex-col gap-3">
                  <div className="h-6 bg-[#151412] w-1/2 rounded animate-pulse" />
                  <div className="h-4 bg-[#151412] w-1/4 rounded animate-pulse" />
                  <div className="h-16 bg-[#151412]/50 w-full rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Journal Entries List */}
        {!loading && logs.length > 0 && (
          <div className="flex flex-col gap-14">
            <AnimatePresence>
              {logs.map((log, index) => {
                const moodStyle = MOOD_PILLS[log.mood] || "border-[#292524] text-[#a8a29e] bg-[#151412]/30";
                return (
                  <motion.article
                    key={log.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-6 border-b border-[#292524]/40 pb-12 last:border-b-0"
                  >
                    {/* Movie Poster Thumbnail (w342) on left */}
                    <Link href={`/movie/${log.movie_id}`} className="shrink-0 group">
                      <div className="relative w-24 md:w-28 aspect-[2/3] overflow-hidden bg-[#151412] border border-[#292524] shadow-md group-hover:border-[#e8d5b0]/50 transition-colors duration-300">
                        {log.poster_path ? (
                          <Image
                            src={getPosterUrl(log.poster_path, "w342")}
                            alt=""
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-102"
                            sizes="112px"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[#3e3a38]">
                            <Film size={20} />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Entry Information on right */}
                    <div className="flex-grow min-w-0 flex flex-col justify-start">
                      {/* Meta: Date & Delete */}
                      <div className="flex items-center justify-between select-none">
                        <span className="text-[0.6875rem] font-sans font-semibold uppercase tracking-[0.18em] text-[#a8a29e]">
                          {formatDate(log.watched_at)}
                        </span>
                        <button
                          onClick={() => handleDelete(log.id)}
                          className="p-1 text-[#57534e] hover:text-red-500 hover:bg-red-500/5 transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Italic serif title */}
                      <Link href={`/movie/${log.movie_id}`} className="mt-2 group">
                        <h2 className="text-[1.125rem] md:text-[1.3125rem] font-display italic text-[#f4f2ed] tracking-tight leading-snug group-hover:text-[#e8d5b0] transition-colors duration-300">
                          {log.title}
                          <span className="text-[0.8125rem] font-sans font-medium text-[#a8a29e] tracking-normal not-italic ml-2">
                            ({log.release_year})
                          </span>
                        </h2>
                      </Link>

                      <p className="text-[0.75rem] text-[#a8a29e] mt-1 tracking-wide uppercase font-semibold">
                        Directed by {log.director}
                      </p>

                      {/* Star Rating and Mood Tag */}
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 select-none">
                        {/* Rating stars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={`${
                                log.rating >= i + 1
                                  ? "text-[#e8d5b0] fill-[#e8d5b0]"
                                  : log.rating === i + 0.5
                                  ? "text-[#e8d5b0] fill-[#e8d5b0]/50"
                                  : "text-[#1c1917] fill-[#1c1917] stroke-[#292524]"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Mood Tag pill in soft color */}
                        <div className={`px-2.5 py-0.5 rounded-full border text-[0.625rem] font-bold uppercase tracking-wider ${moodStyle}`}>
                          {log.mood}
                        </div>
                      </div>

                      {/* Quoted personal note in bordered blockquote */}
                      {log.notes && (
                        <blockquote className="mt-5 border-l border-[#e8d5b0]/40 pl-4 py-1 text-[0.875rem] font-display italic text-[#a8a29e] leading-relaxed">
                          &ldquo;{log.notes}&rdquo;
                        </blockquote>
                      )}

                      {/* Scene highlight */}
                      {log.favorite_scene && (
                        <div className="mt-3 text-[0.6875rem] tracking-wide text-[#78716c] uppercase font-semibold flex items-center gap-1.5 select-none">
                          <span>Key Moment:</span>
                          <span className="text-[#a8a29e] italic not-uppercase font-sans font-medium">{log.favorite_scene}</span>
                        </div>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <LogModal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </main>
    </ProtectedRoute>
  );
}
