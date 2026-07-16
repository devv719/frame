"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getArchiveLogs, type CinemaLog } from "@/services/archiveService";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Film, Plus, Star, Award, Layers, Hash } from "lucide-react";
import { LogModal } from "@/components/ui";
import { getPosterUrl } from "@/services/tmdb";

export default function ShelfPage() {
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

  useEffect(() => {
    if (user) fetchLogs();

    if (typeof window !== "undefined") {
      window.addEventListener("cinema-log-updated", fetchLogs);
      return () => window.removeEventListener("cinema-log-updated", fetchLogs);
    }
  }, [user]);

  // Compute stats pills
  const stats = useMemo(() => {
    if (logs.length === 0) {
      return { total: 0, avgRating: 0, series: 0 };
    }
    const total = logs.length;
    const avgRating = logs.reduce((acc, c) => acc + c.rating, 0) / total;
    const series = logs.filter((c) => c.media_type === "series").length;
    return { total, avgRating, series };
  }, [logs]);

  // Compute top directors dynamically
  const topDirectors = useMemo(() => {
    const counts: Record<string, { count: number; poster: string; ratingSum: number }> = {};
    logs.forEach((log) => {
      if (log.director && log.director !== "Unknown Director") {
        if (!counts[log.director]) {
          counts[log.director] = { count: 0, poster: log.poster_path, ratingSum: 0 };
        }
        counts[log.director].count += 1;
        counts[log.director].ratingSum += log.rating;
        // Keep the latest poster
        if (log.poster_path) {
          counts[log.director].poster = log.poster_path;
        }
      }
    });

    return Object.entries(counts)
      .map(([name, data]) => ({
        name,
        count: data.count,
        poster: data.poster,
        avgRating: data.ratingSum / data.count,
      }))
      .sort((a, b) => b.count - a.count || b.avgRating - a.avgRating)
      .slice(0, 4);
  }, [logs]);

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#0e0d0b] text-[#f4f2ed] pt-8 md:pt-12 pb-20 px-6 md:px-12 relative">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#292524] pb-8">
          <div>
            <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-[#e8d5b0] block mb-2 uppercase">
              Private Memory Vault
            </span>
            <h1 className="text-[2.25rem] md:text-[3rem] font-display italic tracking-tight text-[#f4f2ed]">
              The Shelf
            </h1>
          </div>
          <button
            onClick={() => setIsLogOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-none bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-bold uppercase tracking-wider transition-colors active:scale-[0.98] cursor-pointer"
          >
            <Plus size={14} />
            Log a Memory
          </button>
        </div>

        {/* Stats Pills Bar */}
        <div className="grid grid-cols-3 gap-4 mb-12 select-none">
          <div className="bg-[#151412] border border-[#292524] p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[1.5rem] md:text-[2rem] font-sans font-medium text-[#e8d5b0] tracking-tight">
              {stats.total}
            </span>
            <span className="text-[0.625rem] font-bold text-[#a8a29e] uppercase tracking-[0.18em] mt-1">
              Watched
            </span>
          </div>
          <div className="bg-[#151412] border border-[#292524] p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[1.5rem] md:text-[2rem] font-sans font-medium text-[#e8d5b0] tracking-tight">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "0.0"}
            </span>
            <span className="text-[0.625rem] font-bold text-[#a8a29e] uppercase tracking-[0.18em] mt-1">
              Avg Score
            </span>
          </div>
          <div className="bg-[#151412] border border-[#292524] p-4 flex flex-col items-center justify-center text-center">
            <span className="text-[1.5rem] md:text-[2rem] font-sans font-medium text-[#e8d5b0] tracking-tight">
              {stats.series}
            </span>
            <span className="text-[0.625rem] font-bold text-[#a8a29e] uppercase tracking-[0.18em] mt-1">
              Series Count
            </span>
          </div>
        </div>

        {/* Empty State */}
        {!loading && logs.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-[#292524] bg-[#151412]/50">
            <Film className="text-[#3e3a38] mb-4" size={36} />
            <h3 className="text-[1.125rem] font-sans font-medium text-[#f4f2ed] uppercase tracking-wider mb-2">
              Shelf is vacant
            </h3>
            <p className="text-[0.75rem] text-[#a8a29e] max-w-xs mb-6 tracking-wide uppercase">
              No films or series have been recorded. Log a movie watch to populate your scrapbook.
            </p>
            <button
              onClick={() => setIsLogOpen(true)}
              className="px-5 py-3 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Add Your First Record
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="aspect-[2/3] bg-[#151412] border border-[#292524] animate-pulse" />
            ))}
          </div>
        )}

        {/* Pinterest style grid */}
        {!loading && logs.length > 0 && (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-6 space-y-6">
            {logs.map((log) => (
              <div
                key={log.id}
                className="break-inside-avoid bg-[#151412] border border-[#292524] group hover:border-[#e8d5b0]/50 transition-colors duration-300"
              >
                <Link href={`/movie/${log.movie_id}`}>
                  {/* w342 poster image */}
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0e0d0b] border-b border-[#292524]">
                    {log.poster_path ? (
                      <Image
                        src={getPosterUrl(log.poster_path, "w342")}
                        alt={log.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-102"
                        sizes="(max-width: 640px) 180px, (max-width: 1024px) 250px, 300px"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-[#57534e]">
                        <Film size={24} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5 select-none">
                    <h3 className="text-[1rem] font-display italic text-[#f4f2ed] tracking-tight leading-snug group-hover:text-[#e8d5b0] transition-colors duration-300">
                      {log.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-[0.6875rem] text-[#a8a29e] tracking-wider uppercase font-semibold">
                      <span>{log.release_year}</span>
                      <span className="w-1 h-1 rounded-full bg-[#3e3a38]" />
                      <span className="truncate max-w-[100px]">{log.director}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Top Directors List Below */}
        {!loading && topDirectors.length > 0 && (
          <div className="mt-20 border-t border-[#292524] pt-12">
            <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-[#e8d5b0] block mb-6 uppercase select-none">
              Most Logged Directors
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topDirectors.map((director, index) => (
                <div
                  key={director.name}
                  className="flex items-center gap-4 p-4 bg-[#151412] border border-[#292524] select-none"
                >
                  {/* Rank indicator */}
                  <span className="text-[0.875rem] font-bold text-[#e8d5b0] w-6 text-center">
                    0{index + 1}
                  </span>

                  {/* Mini thumbnail */}
                  <div className="relative w-10 aspect-[2/3] overflow-hidden bg-black shrink-0 border border-[#292524]/60">
                    {director.poster ? (
                      <Image
                        src={getPosterUrl(director.poster, "w92")}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-neutral-600">
                        <Film size={12} />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h4 className="text-[0.9375rem] font-sans font-medium text-[#f4f2ed] truncate">
                      {director.name}
                    </h4>
                    <span className="text-[0.75rem] text-[#a8a29e] block mt-0.5 tracking-wider uppercase font-semibold">
                      {director.count} logged {director.count === 1 ? "entry" : "entries"}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 select-none">
                    <Star size={12} className="fill-[#e8d5b0] text-[#e8d5b0]" />
                    <span className="text-[0.8125rem] font-bold text-[#f4f2ed]">
                      {director.avgRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <LogModal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </div>
    </ProtectedRoute>
  );
}
