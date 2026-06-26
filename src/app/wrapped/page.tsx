"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getCinemaLogs, getCinemaStats, CinemaLog } from "@/lib/supabase";
import { ChevronLeft, Film, Star } from "lucide-react";

export default function WrappedPage() {
  const [logs, setLogs] = useState<CinemaLog[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const logsData = await getCinemaLogs();
      const statsData = await getCinemaStats();
      setLogs(logsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    if (typeof window !== "undefined") {
      window.addEventListener("cinema-log-updated", loadData);
      return () => window.removeEventListener("cinema-log-updated", loadData);
    }
  }, []);

  // Compute mood counts for the bar chart
  const moodCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Inspired: 0,
      Heartbroken: 0,
      Nostalgic: 0,
      Disturbed: 0,
      Thoughtful: 0,
      Happy: 0,
      Tense: 0,
      "In awe": 0,
    };
    logs.forEach((log) => {
      if (counts[log.mood] !== undefined) {
        counts[log.mood] += 1;
      } else {
        counts.Thoughtful = (counts.Thoughtful || 0) + 1;
      }
    });
    return counts;
  }, [logs]);

  const totalLogs = logs.length || 1;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0e0d0b] text-[#f4f2ed] flex flex-col items-center justify-center select-none">
        <Film size={32} className="animate-spin text-[#e8d5b0] mb-4" />
        <p className="text-[0.6875rem] font-bold tracking-[0.2em] uppercase text-[#a8a29e]">
          Compiling Retrospective...
        </p>
      </main>
    );
  }

  if (!stats || stats.totalCount === 0) {
    return (
      <main className="min-h-screen bg-[#0e0d0b] text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <Film size={36} className="text-[#3e3a38] mb-6" />
        <h1 className="text-[1.5rem] font-display italic text-[#f4f2ed] mb-2">
          Nothing to wrap yet
        </h1>
        <p className="text-[0.75rem] text-[#a8a29e] max-w-xs mb-8 uppercase tracking-wide">
          Log some watches first, then return here to view your annual retrospective.
        </p>
        <Link
          href="/shelf"
          className="px-6 py-3 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Open Your Shelf
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0d0b] text-[#f4f2ed] pt-24 pb-20 px-6 md:px-12 relative">
      <div className="absolute top-6 left-6 z-50 select-none">
        <Link
          href="/shelf"
          className="text-[0.6875rem] font-bold uppercase tracking-widest text-[#a8a29e] hover:text-[#e8d5b0] transition-colors flex items-center gap-1.5"
        >
          <ChevronLeft size={16} />
          Back to Vault
        </Link>
      </div>

      <div className="max-w-xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12 select-none">
          <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-[#e8d5b0] block mb-2 uppercase">
            Retrospective
          </span>
          <h1 className="text-[2.25rem] md:text-[3rem] font-display italic tracking-tight text-[#f4f2ed]">
            Cinema Wrapped
          </h1>
          <p className="text-[0.75rem] text-[#a8a29e] mt-1.5 uppercase tracking-wider leading-relaxed">
            Your screen footprint, summarized.
          </p>
        </div>

        {/* Hero watches count number */}
        <div className="flex flex-col items-center justify-center py-10 select-none text-center">
          <span className="text-[5.5rem] md:text-[8rem] font-sans font-medium text-[#e8d5b0] tracking-tighter leading-none">
            {stats.totalCount}
          </span>
          <span className="text-[0.6875rem] font-bold text-[#a8a29e] uppercase tracking-[0.2em] mt-2">
            Stories Logged & Archived
          </span>
        </div>

        {/* 2-column key metric cards */}
        <div className="grid grid-cols-2 gap-4 mb-8 select-none">
          <div className="bg-[#151412] border border-[#292524] p-4 text-center">
            <span className="text-[0.625rem] font-bold text-[#a8a29e] uppercase tracking-[0.15em] block mb-1">
              Top Genre
            </span>
            <span className="text-[1rem] font-display italic text-[#e8d5b0] block truncate">
              {stats.favoriteGenre}
            </span>
          </div>
          <div className="bg-[#151412] border border-[#292524] p-4 text-center">
            <span className="text-[0.625rem] font-bold text-[#a8a29e] uppercase tracking-[0.15em] block mb-1">
              Top Director
            </span>
            <span className="text-[1rem] font-display italic text-[#e8d5b0] block truncate">
              {stats.mostWatchedDirector}
            </span>
          </div>
          <div className="bg-[#151412] border border-[#292524] p-4 text-center">
            <span className="text-[0.625rem] font-bold text-[#a8a29e] uppercase tracking-[0.15em] block mb-1">
              Peak Month
            </span>
            <span className="text-[1rem] font-sans font-semibold text-[#e8d5b0] block">
              {stats.mostActiveMonth}
            </span>
          </div>
          <div className="bg-[#151412] border border-[#292524] p-4 text-center">
            <span className="text-[0.625rem] font-bold text-[#a8a29e] uppercase tracking-[0.15em] block mb-1">
              Avg Rating
            </span>
            <span className="text-[1rem] font-sans font-semibold text-[#e8d5b0] block">
              {stats.averageRating.toFixed(1)} / 5.0
            </span>
          </div>
        </div>

        {/* Mood profile distribution bar chart */}
        <div className="bg-[#151412] border border-[#292524] p-6 select-none">
          <h3 className="text-[0.6875rem] font-bold text-[#e8d5b0] uppercase tracking-[0.2em] mb-6">
            Cinema Mood Profile
          </h3>
          <div className="space-y-4">
            {Object.entries(moodCounts).map(([mood, count]) => {
              const pct = (count / totalLogs) * 100;
              return (
                <div key={mood} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[0.6875rem] text-[#a8a29e] uppercase tracking-wider font-semibold">
                    <span>✦ {mood}</span>
                    <span>{count} watches</span>
                  </div>
                  {/* Flat horizontal line */}
                  <div className="h-1 bg-[#1c1917] w-full">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-[#e8d5b0] transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
