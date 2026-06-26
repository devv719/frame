import type { CinemaLog } from "@/lib/supabase";

/* ═══════════════════════════════════════════════════════════
   YOUR CINEMA ATLAS — Type Definitions
   ═══════════════════════════════════════════════════════════ */

/** Aggregated stats for a single country in the user's watch map */
export interface CountryStats {
  code: string;
  name: string;
  count: number;
  topGenres: string[];
  favoriteFilm: {
    title: string;
    rating: number;
    posterPath: string;
    movieId: number;
  } | null;
  avgRating: number;
  films: CinemaLog[];
}

/** A single Indian cinema industry breakdown */
export interface IndianIndustry {
  id: string;
  name: string;       // "Hindi Cinema (Bollywood)"
  shortName: string;  // "Bollywood"
  language: string;   // "Hindi"
  langCode: string;   // "hi"
  count: number;
  highestRated: { title: string; rating: number; posterPath: string } | null;
  films: CinemaLog[];
}

/** Aggregated Indian cinema stats */
export interface IndianCinemaStats {
  industries: IndianIndustry[];
  totalIndustries: number;
  totalLanguages: number;
  mostWatchedIndustry: string;
  favoriteDirector: string;
  totalFilms: number;
}

/** Achievement badge definition */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;       // 0–1
  threshold: number;
  currentCount: number;
  category: "region" | "genre" | "milestone";
}

/** A passport stamp for a single country */
export interface PassportStamp {
  countryCode: string;
  countryName: string;
  flag: string;
  filmCount: number;
  firstWatched: string;   // ISO date string
}

/** Timeline filter period */
export type TimelinePeriod = "month" | "year" | "all-time";

/** Insight — a generated sentence about the user's viewing habits */
export interface Insight {
  id: string;
  text: string;
  icon: string;
  category: "country" | "language" | "industry" | "milestone";
}
