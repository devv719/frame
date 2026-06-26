"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Film, Star } from "lucide-react";
import { CinemaLog } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface MoodProfileProps {
  logs: CinemaLog[];
}

const MOODS_META = [
  { id: "Inspired", label: "Inspired", color: "#e8d5b0" },
  { id: "Heartbroken", label: "Heartbroken", color: "#93a8c5" },
  { id: "Nostalgic", label: "Nostalgic", color: "#c4a882" },
  { id: "Disturbed", label: "Disturbed", color: "#9e8fa8" },
  { id: "Happy", label: "Happy", color: "#c8a96e" },
  { id: "Thoughtful", label: "Thoughtful", color: "#8fa89e" },
];

export function MoodProfile({ logs }: MoodProfileProps) {
  const [activeMoodFilter, setActiveMoodFilter] = useState<string | null>(null);

  // Compute counts
  const moodCounts: Record<string, number> = {
    Inspired: 0,
    Heartbroken: 0,
    Nostalgic: 0,
    Disturbed: 0,
    Happy: 0,
    Thoughtful: 0,
  };

  logs.forEach((log) => {
    if (moodCounts[log.mood] !== undefined) {
      moodCounts[log.mood] += 1;
    } else {
      moodCounts.Thoughtful = (moodCounts.Thoughtful || 0) + 1;
    }
  });

  const totalLogs = logs.length || 1;

  const maxCount = Math.max(...Object.values(moodCounts), 1);
  const blobValues = MOODS_META.map((meta) => {
    const count = moodCounts[meta.id];
    return count === 0 ? 0.08 : 0.2 + (count / maxCount) * 0.8;
  });

  const generateBlobPath = (values: number[]) => {
    const cx = 150;
    const cy = 150;
    const points = [];
    const numPoints = 6;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
      const val = values[i];
      const radius = 50 + val * 80;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      points.push({ x, y });
    }

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < numPoints; i++) {
      const current = points[i];
      const next = points[(i + 1) % numPoints];
      const prev = points[(i - 1 + numPoints) % numPoints];
      const nextNext = points[(i + 2) % numPoints];

      const cp1x = current.x + (next.x - prev.x) * 0.2;
      const cp1y = current.y + (next.y - prev.y) * 0.2;
      const cp2x = next.x - (nextNext.x - current.x) * 0.2;
      const cp2y = next.y - (nextNext.y - current.y) * 0.2;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  const pathString = generateBlobPath(blobValues);

  const filteredLogs = activeMoodFilter
    ? logs.filter((log) => log.mood === activeMoodFilter)
    : [];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
      {/* Visual Canvas (Col: 5) */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center bg-[#161410] border border-white/5 p-6 md:p-8 select-none relative overflow-hidden">
        <h3 className="text-[0.6875rem] font-sans font-medium uppercase tracking-[0.18em] text-[rgba(232,226,217,0.45)] mb-5 flex items-center gap-2 self-start">
          <Sparkles size={14} className="text-[#e8d5b0]" />
          Mood Spectrum
        </h3>

        {/* Blob SVG */}
        <div className="relative w-[280px] h-[280px] flex items-center justify-center">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <defs>
              <linearGradient id="blobGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8d5b0" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#c4a882" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#8fa89e" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            {/* Outer rings */}
            <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(232,226,217,0.06)" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx="150" cy="150" r="90" fill="none" stroke="rgba(232,226,217,0.06)" strokeWidth="1" strokeDasharray="4 5" />
            <circle cx="150" cy="150" r="50" fill="none" stroke="rgba(232,226,217,0.06)" strokeWidth="1" />

            {/* Blob Path */}
            <motion.path
              d={pathString}
              fill="url(#blobGradientDark)"
              animate={{ d: pathString }}
              transition={{ type: "spring", stiffness: 70, damping: 15 }}
            />

            {/* Labels overlay */}
            {MOODS_META.map((meta, i) => {
              const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
              const radius = 135;
              const x = 150 + Math.cos(angle) * radius;
              const y = 150 + Math.sin(angle) * radius;
              const anchor = i === 0 || i === 3 ? "middle" : i === 1 || i === 2 ? "start" : "end";

              return (
                <text
                  key={meta.id}
                  x={x}
                  y={y}
                  textAnchor={anchor}
                  alignmentBaseline="middle"
                  fontSize="8"
                  fontFamily="Inter, sans-serif"
                  fontWeight="500"
                  fill="rgba(232,226,217,0.35)"
                  textLength={undefined}
                  className="uppercase tracking-wider select-none"
                >
                  {meta.label}
                </text>
              );
            })}
          </svg>

          {/* Core count */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-display italic font-normal text-[2rem] text-[#e8e2d9] leading-none">
              {logs.length}
            </span>
            <span className="text-[0.5625rem] font-sans font-medium text-[rgba(232,226,217,0.35)] uppercase tracking-[0.2em] mt-1">
              Logged
            </span>
          </div>
        </div>

        <p className="text-[0.6875rem] font-sans text-[rgba(232,226,217,0.3)] text-center leading-relaxed mt-5 max-w-[220px] uppercase tracking-wide">
          Shape updates as you log new watches
        </p>
      </div>

      {/* Details & Filters (Col: 7) */}
      <div className="lg:col-span-7 flex flex-col gap-5">
        <div className="p-6 md:p-8 bg-[#161410] border border-white/5">
          <h4 className="text-[0.6875rem] font-sans font-medium uppercase tracking-[0.2em] text-[rgba(232,226,217,0.4)] mb-6">
            Mood Distribution
          </h4>

          <div className="flex flex-col gap-3 select-none">
            {MOODS_META.map((meta) => {
              const count = moodCounts[meta.id];
              const pct = logs.length > 0 ? (count / totalLogs) * 100 : 0;
              const isSelected = activeMoodFilter === meta.id;

              return (
                <div
                  key={meta.id}
                  onClick={() => setActiveMoodFilter(isSelected ? null : meta.id)}
                  className={`flex flex-col gap-1.5 p-3 border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1e1c17] border-[#e8d5b0]/30"
                      : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[0.8125rem] font-sans font-medium text-[#e8e2d9]">
                      {meta.label}
                    </span>
                    <span className="text-[0.75rem] font-sans text-[rgba(232,226,217,0.4)]">
                      {count} {count === 1 ? "log" : "logs"} · {Math.round(pct)}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-px w-full bg-white/8 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="h-full"
                      style={{ backgroundColor: meta.color, opacity: 0.7 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Results */}
        <AnimatePresence>
          {activeMoodFilter && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="p-6 bg-[#161410] border border-white/5 max-h-[40vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <span className="text-[0.6875rem] font-sans font-medium uppercase tracking-[0.18em] text-[rgba(232,226,217,0.5)]">
                  {activeMoodFilter} · {filteredLogs.length} {filteredLogs.length === 1 ? "entry" : "entries"}
                </span>
                <button
                  onClick={() => setActiveMoodFilter(null)}
                  className="text-[0.6875rem] font-sans font-medium text-[#e8d5b0] hover:text-[#e8e2d9] cursor-pointer uppercase tracking-wide transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <Link
                      href={`/movie/${log.movie_id}`}
                      key={log.id}
                      className="flex items-center gap-3.5 p-2 hover:bg-white/[0.03] transition-colors group"
                    >
                      <div className="relative w-8 aspect-[2/3] overflow-hidden bg-[#0e0d0b] border border-white/5 shrink-0">
                        {log.poster_path ? (
                          <Image
                            src={log.poster_path}
                            alt={log.title}
                            fill
                            className="object-cover"
                            sizes="32px"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-[rgba(232,226,217,0.2)]">
                            <Film size={10} />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h5 className="font-display italic font-normal text-[0.875rem] text-[#e8e2d9] truncate group-hover:text-[#e8d5b0] transition-colors">
                          {log.title}
                        </h5>
                        <p className="text-[0.6875rem] font-sans text-[rgba(232,226,217,0.35)] truncate mt-0.5">
                          {log.director} · {log.release_year}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 select-none">
                        <Star size={10} className="fill-amber-400 text-amber-400" />
                        <span className="text-[0.75rem] font-sans font-medium text-[rgba(232,226,217,0.6)]">
                          {log.rating.toFixed(1)}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-6 text-[rgba(232,226,217,0.3)] text-[0.8125rem] font-sans italic">
                    No films logged under this mood.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
