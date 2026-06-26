"use client";

import { motion } from "framer-motion";
import { Globe, Film, Languages, Star } from "lucide-react";

interface StatsData {
  countriesExplored: number;
  filmsLogged: number;
  languages: number;
  avgRating: number;
}

const CARD_CONFIGS = [
  { key: "countries", icon: Globe, label: "Countries", color: "#e8d5b0" },
  { key: "films", icon: Film, label: "Films Logged", color: "#75d6ff" },
  { key: "languages", icon: Languages, label: "Languages", color: "#b5a3f7" },
  { key: "rating", icon: Star, label: "Avg Rating", color: "#f7c873" },
] as const;

export function FloatingStatsCards({ stats }: { stats: StatsData }) {
  const values: Record<string, string> = {
    countries: String(stats.countriesExplored),
    films: String(stats.filmsLogged),
    languages: String(stats.languages),
    rating: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—",
  };

  return (
    <div className="pointer-events-none absolute bottom-6 left-4 right-4 z-10 sm:bottom-8 sm:left-6 sm:right-6">
      <div className="mx-auto max-w-3xl">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {CARD_CONFIGS.map((config, index) => (
            <motion.div
              key={config.key}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.0 + index * 0.15,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="pointer-events-auto group relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#101018]/72 p-3.5 backdrop-blur-2xl transition-all duration-300 hover:border-white/15 hover:bg-[#101018]/85 sm:p-4"
            >
              {/* Subtle top-edge glow */}
              <div
                className="absolute inset-x-0 top-0 h-px opacity-40"
                style={{
                  background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
                }}
              />

              <config.icon
                className="mb-2.5 size-4 opacity-60 transition-opacity group-hover:opacity-90"
                style={{ color: config.color }}
              />
              <p className="font-display text-[1.5rem] font-semibold leading-none text-white sm:text-[1.75rem]">
                {values[config.key]}
              </p>
              <p className="mt-1.5 text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-white/40">
                {config.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
