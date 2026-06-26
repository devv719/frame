"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getCinemaLogs, CinemaLog } from "@/lib/supabase";
import { Calendar, Film, Star, Plus } from "lucide-react";
import { LogModal } from "@/components/ui";
import { getPosterUrl } from "@/services/tmdb";

interface GroupedLogs {
  year: number;
  months: {
    monthName: string;
    logs: CinemaLog[];
  }[];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MOOD_COLORS: Record<string, string> = {
  Inspired: "bg-[#d8b973]",
  Heartbroken: "bg-[#e0a397]",
  Nostalgic: "bg-[#ebdcb9]",
  Disturbed: "bg-[#a8a29e]",
  Happy: "bg-[#fda4af]",
  Thoughtful: "bg-[#e8d5b0]",
  Tense: "bg-red-400",
  "In awe": "bg-amber-300",
};

const MOOD_TEXTS: Record<string, string> = {
  Inspired: "text-[#d8b973] border-[#d8b973]/30",
  Heartbroken: "text-[#e0a397] border-[#e0a397]/30",
  Nostalgic: "text-[#ebdcb9] border-[#ebdcb9]/30",
  Disturbed: "text-[#a8a29e] border-[#a8a29e]/30",
  Happy: "text-[#fda4af] border-[#fda4af]/30",
  Thoughtful: "text-[#e8d5b0] border-[#e8d5b0]/30",
  Tense: "text-red-400 border-red-400/30",
  "In awe": "text-amber-300 border-amber-300/30",
};

export default function TimelinePage() {
  const [logs, setLogs] = useState<CinemaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getCinemaLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    if (typeof window !== "undefined") {
      window.addEventListener("cinema-log-updated", fetchLogs);
      return () => window.removeEventListener("cinema-log-updated", fetchLogs);
    }
  }, []);

  const grouped = useMemo((): GroupedLogs[] => {
    const groups: Record<number, Record<number, CinemaLog[]>> = {};

    logs.forEach((log) => {
      const date = new Date(log.watched_at);
      if (isNaN(date.getTime())) return;
      const year = date.getFullYear();
      const month = date.getMonth();

      if (!groups[year]) groups[year] = {};
      if (!groups[year][month]) groups[year][month] = [];
      groups[year][month].push(log);
    });

    return Object.keys(groups)
      .map(Number)
      .sort((a, b) => b - a)
      .map((year) => {
        const monthsData = Object.keys(groups[year])
          .map(Number)
          .sort((a, b) => b - a)
          .map((month) => ({
            monthName: MONTH_NAMES[month],
            logs: groups[year][month].sort(
              (a, b) => new Date(b.watched_at).getTime() - new Date(a.watched_at).getTime()
            ),
          }));
        return { year, months: monthsData };
      });
  }, [logs]);

  return (
    <main className="min-h-screen bg-[#0e0d0b] text-[#f4f2ed] pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-[#292524] pb-8">
          <div>
            <span className="text-[0.6875rem] font-bold tracking-[0.2em] text-[#e8d5b0] block mb-2 uppercase">
              Chronology
            </span>
            <h1 className="text-[2.25rem] md:text-[3rem] font-display italic tracking-tight text-[#f4f2ed]">
              The Timeline
            </h1>
          </div>
          <button
            onClick={() => setIsLogOpen(true)}
            className="px-5 py-3 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-bold uppercase tracking-wider transition-colors active:scale-[0.98] cursor-pointer"
          >
            <Plus size={14} />
            Log a Memory
          </button>
        </div>

        {/* Empty State */}
        {!loading && logs.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-[#292524] bg-[#151412]/50">
            <Calendar className="text-[#3e3a38] mb-4" size={36} />
            <h3 className="text-[1.125rem] font-sans font-medium text-[#f4f2ed] uppercase tracking-wider mb-2">
              Timeline is blank
            </h3>
            <p className="text-[0.75rem] text-[#a8a29e] max-w-xs mb-6 tracking-wide uppercase">
              There are no film records to display in your timeline. Log your watches to start archiving.
            </p>
            <button
              onClick={() => setIsLogOpen(true)}
              className="px-5 py-3 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0e0d0b] text-[0.75rem] font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Log Movie Watch
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-8 pl-6 border-l border-[#292524]">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="flex gap-4 relative animate-pulse">
                <div className="w-10 aspect-[2/3] bg-[#151412] border border-[#292524]" />
                <div className="flex-grow flex flex-col gap-2 pt-1">
                  <div className="h-4 bg-[#151412] w-1/2 rounded" />
                  <div className="h-3 bg-[#151412] w-1/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timeline */}
        {!loading && logs.length > 0 && (
          <div className="relative">
            {grouped.map((yearGroup) => (
              <div key={yearGroup.year} className="mb-14">
                {/* Year Header in large faded serif */}
                <h2 className="text-[2.75rem] md:text-[3.5rem] font-display italic font-bold text-[#f4f2ed]/10 tracking-widest uppercase mb-8 select-none">
                  {yearGroup.year}
                </h2>

                {yearGroup.months.map((monthGroup, mIdx) => (
                  <div key={monthGroup.monthName} className="mb-10 last:mb-0">
                    {/* Month Section Title */}
                    <h3 className="text-[0.75rem] font-sans font-semibold tracking-[0.2em] text-[#e8d5b0] uppercase mb-4 pl-8 select-none">
                      {monthGroup.monthName}
                    </h3>

                    {/* Month entries with vertical line on the left */}
                    <div className="border-l border-[#292524] pl-8 flex flex-col gap-6 relative ml-3.5">
                      {monthGroup.logs.map((log) => {
                        const dotColor = MOOD_COLORS[log.mood] || "bg-[#e8d5b0]";
                        const chipStyle = MOOD_TEXTS[log.mood] || "text-[#a8a29e] border-[#292524]";
                        const watchedDay = new Date(log.watched_at).getDate().toString().padStart(2, "0");

                        return (
                          <div key={log.id} className="flex items-center gap-4 relative group select-none">
                            {/* Colored mood dot on the left timeline axis */}
                            <div className={`absolute left-[-38.5px] top-[14px] w-[9px] h-[9px] rounded-full border-2 border-[#0e0d0b] ${dotColor} z-10`} />

                            {/* Mini poster thumbnail (w92) */}
                            <Link href={`/movie/${log.movie_id}`} className="shrink-0">
                              <div className="relative w-9 aspect-[2/3] overflow-hidden bg-black border border-[#292524] group-hover:border-[#e8d5b0]/60 transition-colors">
                                {log.poster_path ? (
                                  <Image
                                    src={getPosterUrl(log.poster_path, "w92")}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="36px"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center text-[#57534e]">
                                    <Film size={12} />
                                  </div>
                                )}
                              </div>
                            </Link>

                            {/* Info */}
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between gap-4">
                                <Link href={`/movie/${log.movie_id}`}>
                                  {/* Italic Playfair title */}
                                  <h4 className="text-[0.875rem] md:text-[0.9375rem] font-display italic text-[#f4f2ed] truncate group-hover:text-[#e8d5b0] transition-colors leading-snug">
                                    {log.title}
                                  </h4>
                                </Link>
                                <span className="text-[0.6875rem] font-sans font-semibold text-[#a8a29e] tracking-widest">
                                  DAY {watchedDay}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 mt-1.5">
                                {/* Stars */}
                                <div className="flex items-center gap-0.5 shrink-0">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      size={9}
                                      className={`${
                                        log.rating >= i + 1
                                          ? "text-[#e8d5b0] fill-[#e8d5b0]"
                                          : log.rating === i + 0.5
                                          ? "text-[#e8d5b0] fill-[#e8d5b0]/50"
                                          : "text-transparent fill-none stroke-[#292524]"
                                      }`}
                                    />
                                  ))}
                                </div>

                                <span className="w-1 h-1 rounded-full bg-[#292524] shrink-0" />

                                {/* Small mood chip */}
                                <span className={`text-[0.625rem] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${chipStyle}`}>
                                  {log.mood}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Faded Divider between months */}
                    {mIdx < yearGroup.months.length - 1 && (
                      <div className="border-b border-[#292524]/20 my-8 mx-3.5" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <LogModal isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} />
    </main>
  );
}
