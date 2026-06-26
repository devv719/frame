/**
 * Atlas Data Utilities
 * Pure functions to compute all Cinema Atlas statistics from CinemaLog data.
 * No React, no components — just data transformations.
 */

import type { CinemaLog } from "@/lib/supabase";
import type {
  CountryStats,
  IndianIndustry,
  IndianCinemaStats,
  Achievement,
  PassportStamp,
  Insight,
  TimelinePeriod,
} from "./types";

/* ═══════════════════════════════════════════════════════════
   MAPPINGS
   ═══════════════════════════════════════════════════════════ */

/** Map country display names → ISO 3166-1 alpha-2 codes */
export const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  "United States of America": "US",
  "United States": "US",
  "United Kingdom": "GB",
  "South Korea": "KR",
  "Korea (Republic of)": "KR",
  Korea: "KR",
  Japan: "JP",
  France: "FR",
  India: "IN",
  Germany: "DE",
  Canada: "CA",
  Italy: "IT",
  Spain: "ES",
  Australia: "AU",
  Mexico: "MX",
  Brazil: "BR",
  China: "CN",
  "Hong Kong": "HK",
  Taiwan: "TW",
  Denmark: "DK",
  Sweden: "SE",
  Norway: "NO",
  Netherlands: "NL",
  "New Zealand": "NZ",
  Russia: "RU",
  "Russian Federation": "RU",
  Ireland: "IE",
  Belgium: "BE",
  Austria: "AT",
  Switzerland: "CH",
  Poland: "PL",
  Iran: "IR",
  "Iran (Islamic Republic of)": "IR",
  Turkey: "TR",
  Argentina: "AR",
  Chile: "CL",
  Colombia: "CO",
  "South Africa": "ZA",
  Nigeria: "NG",
  Thailand: "TH",
  Vietnam: "VN",
  Singapore: "SG",
  Philippines: "PH",
  Mongolia: "MN",
};

/** Map ISO 639-1 language codes → Indian cinema industries */
export const INDIAN_LANGUAGE_TO_INDUSTRY: Record<
  string,
  { name: string; shortName: string; language: string }
> = {
  hi: {
    name: "Hindi Cinema (Bollywood)",
    shortName: "Bollywood",
    language: "Hindi",
  },
  ta: {
    name: "Tamil Cinema (Kollywood)",
    shortName: "Kollywood",
    language: "Tamil",
  },
  te: {
    name: "Telugu Cinema (Tollywood)",
    shortName: "Tollywood",
    language: "Telugu",
  },
  ml: { name: "Malayalam Cinema", shortName: "Malayalam", language: "Malayalam" },
  kn: { name: "Kannada Cinema", shortName: "Kannada", language: "Kannada" },
  bn: { name: "Bengali Cinema", shortName: "Bengali", language: "Bengali" },
  pa: { name: "Punjabi Cinema", shortName: "Punjabi", language: "Punjabi" },
  mr: { name: "Marathi Cinema", shortName: "Marathi", language: "Marathi" },
};

/** Map ISO 639-1 language codes → human-readable names */
export const LANGUAGE_CODE_TO_NAME: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
  kn: "Kannada",
  bn: "Bengali",
  pa: "Punjabi",
  mr: "Marathi",
  ko: "Korean",
  ja: "Japanese",
  fr: "French",
  de: "German",
  es: "Spanish",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  ar: "Arabic",
  fa: "Persian",
  tr: "Turkish",
  th: "Thai",
  vi: "Vietnamese",
  sv: "Swedish",
  da: "Danish",
  no: "Norwegian",
  nl: "Dutch",
  pl: "Polish",
  yo: "Yoruba",
  ha: "Hausa",
  ig: "Igbo",
};

/** Country center coordinates [lng, lat] for map fly-to */
export const COUNTRY_CENTERS: Record<string, [number, number]> = {
  US: [-98, 38], CA: [-95, 60], MX: [-102, 23], BR: [-55, -10],
  AR: [-64, -34], CL: [-71, -30], CO: [-74, 4],
  GB: [-2, 54], FR: [2, 46], DE: [10, 51], IT: [12, 42],
  ES: [-3, 40], PT: [-8, 39], NL: [5, 52], BE: [4, 51],
  CH: [8, 47], AT: [14, 47], PL: [20, 52], SE: [18, 62],
  NO: [8, 60], DK: [10, 56], FI: [26, 64], IE: [-8, 53],
  RU: [95, 60],
  JP: [138, 36], KR: [127, 36], CN: [104, 35], IN: [78, 21],
  TW: [121, 24], HK: [114, 22], SG: [104, 1], TH: [100, 15],
  VN: [108, 16], PH: [122, 12], IR: [53, 32],
  ZA: [25, -29], NG: [8, 10], EG: [30, 27],
  AU: [133, -25], NZ: [172, -41],
  TR: [35, 39],
};

/* ═══════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════ */

/** Convert ISO 3166-1 alpha-2 code to flag emoji */
export function codeToFlag(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...Array.from(upper).map((c) => 0x1f1e6 - 65 + c.charCodeAt(0)),
  );
}

/** Get country name from ISO code */
export function getCountryName(code: string): string {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
}

/** Resolve production_countries strings to ISO codes */
function resolveCountryCodes(
  countries: string[],
): { code: string; name: string }[] {
  const result: { code: string; name: string }[] = [];
  for (const c of countries) {
    const iso = COUNTRY_NAME_TO_ISO[c];
    if (iso) {
      result.push({ code: iso, name: c });
    } else if (c.length === 2) {
      result.push({ code: c.toUpperCase(), name: getCountryName(c) });
    }
  }
  return result;
}

/** Filter logs by timeline period */
export function filterByPeriod(
  logs: CinemaLog[],
  period: TimelinePeriod,
): CinemaLog[] {
  if (period === "all-time") return logs;

  const now = new Date();
  return logs.filter((log) => {
    const d = new Date(log.watched_at);
    if (isNaN(d.getTime())) return false;
    if (period === "month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    // year
    return d.getFullYear() === now.getFullYear();
  });
}

/* ═══════════════════════════════════════════════════════════
   CORE COMPUTATIONS
   ═══════════════════════════════════════════════════════════ */

/** Compute per-country stats from cinema logs */
export function computeCountryStats(
  logs: CinemaLog[],
): Map<string, CountryStats> {
  const map = new Map<string, CountryStats>();

  for (const log of logs) {
    if (!log.production_countries) continue;
    const resolved = resolveCountryCodes(log.production_countries);

    for (const { code, name } of resolved) {
      let stats = map.get(code);
      if (!stats) {
        stats = {
          code,
          name,
          count: 0,
          topGenres: [],
          favoriteFilm: null,
          avgRating: 0,
          films: [],
        };
        map.set(code, stats);
      }
      stats.count++;
      stats.films.push(log);
    }
  }

  // Post-process: compute derived stats
  for (const stats of map.values()) {
    // Average rating
    const totalRating = stats.films.reduce((sum, f) => sum + f.rating, 0);
    stats.avgRating = Math.round((totalRating / stats.films.length) * 10) / 10;

    // Top genres
    const genreCount: Record<string, number> = {};
    for (const f of stats.films) {
      for (const g of f.genres) {
        genreCount[g] = (genreCount[g] || 0) + 1;
      }
    }
    stats.topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g]) => g);

    // Favorite film (highest rated)
    const best = [...stats.films].sort((a, b) => b.rating - a.rating)[0];
    if (best) {
      stats.favoriteFilm = {
        title: best.title,
        rating: best.rating,
        posterPath: best.poster_path,
        movieId: best.movie_id,
      };
    }
  }

  return map;
}

/** Compute Indian cinema industry stats */
export function computeIndianCinemaStats(
  logs: CinemaLog[],
): IndianCinemaStats {
  const indianLogs = logs.filter((log) =>
    log.production_countries?.some(
      (c) =>
        c === "India" || COUNTRY_NAME_TO_ISO[c] === "IN",
    ),
  );

  const industryMap = new Map<string, CinemaLog[]>();

  for (const log of indianLogs) {
    const lang = log.original_language || "hi"; // default to Hindi
    const industry = INDIAN_LANGUAGE_TO_INDUSTRY[lang];
    if (industry) {
      const key = lang;
      if (!industryMap.has(key)) industryMap.set(key, []);
      industryMap.get(key)!.push(log);
    }
  }

  const industries: IndianIndustry[] = [];
  for (const [langCode, films] of industryMap.entries()) {
    const meta = INDIAN_LANGUAGE_TO_INDUSTRY[langCode];
    if (!meta) continue;
    const best = [...films].sort((a, b) => b.rating - a.rating)[0];
    industries.push({
      id: langCode,
      name: meta.name,
      shortName: meta.shortName,
      language: meta.language,
      langCode,
      count: films.length,
      highestRated: best
        ? { title: best.title, rating: best.rating, posterPath: best.poster_path }
        : null,
      films,
    });
  }

  // Sort by count descending
  industries.sort((a, b) => b.count - a.count);

  // Favorite director (most frequent among Indian films)
  const dirCount: Record<string, number> = {};
  for (const log of indianLogs) {
    if (log.director) dirCount[log.director] = (dirCount[log.director] || 0) + 1;
  }
  const favoriteDirector =
    Object.entries(dirCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  // Unique languages
  const uniqueLangs = new Set(
    indianLogs.map((l) => l.original_language).filter(Boolean),
  );

  return {
    industries,
    totalIndustries: industries.length,
    totalLanguages: uniqueLangs.size,
    mostWatchedIndustry: industries[0]?.shortName || "—",
    favoriteDirector,
    totalFilms: indianLogs.length,
  };
}

/** Get all unique languages from logs */
export function getUniqueLanguages(logs: CinemaLog[]): string[] {
  const langs = new Set<string>();
  for (const log of logs) {
    if (log.original_language) {
      const name =
        LANGUAGE_CODE_TO_NAME[log.original_language] || log.original_language;
      langs.add(name);
    }
  }
  return Array.from(langs);
}

/** Compute passport stamps from country stats */
export function computePassportStamps(
  countryStats: Map<string, CountryStats>,
): PassportStamp[] {
  const stamps: PassportStamp[] = [];
  for (const stats of countryStats.values()) {
    // Find earliest watched date
    const earliest = stats.films.reduce((min, f) => {
      const d = new Date(f.watched_at);
      return d < min ? d : min;
    }, new Date());

    stamps.push({
      countryCode: stats.code,
      countryName: stats.name,
      flag: codeToFlag(stats.code),
      filmCount: stats.count,
      firstWatched: earliest.toISOString().split("T")[0],
    });
  }
  return stamps.sort((a, b) => b.filmCount - a.filmCount);
}

/** Compute glow intensity for a country (0 to 1) */
export function getCountryHeatIntensity(
  count: number,
  maxCount: number,
): number {
  if (maxCount === 0) return 0;
  // Use logarithmic scale to prevent huge gaps
  return Math.min(1, Math.log(count + 1) / Math.log(maxCount + 1));
}

/* ═══════════════════════════════════════════════════════════
   ACHIEVEMENTS
   ═══════════════════════════════════════════════════════════ */

const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, "unlocked" | "progress" | "currentCount">[] = [
  {
    id: "world-cinema",
    title: "World Cinema Enthusiast",
    description: "Watch films from 15 different countries",
    icon: "🌍",
    threshold: 15,
    category: "region",
  },
  {
    id: "asian-explorer",
    title: "Asian Cinema Explorer",
    description: "Watch films from 5 Asian countries",
    icon: "🌏",
    threshold: 5,
    category: "region",
  },
  {
    id: "bollywood-buff",
    title: "Bollywood Buff",
    description: "Watch 10 Hindi-language films",
    icon: "🇮🇳",
    threshold: 10,
    category: "region",
  },
  {
    id: "korean-lover",
    title: "Korean Cinema Lover",
    description: "Watch 10 Korean films",
    icon: "🇰🇷",
    threshold: 10,
    category: "region",
  },
  {
    id: "festival-explorer",
    title: "Festival Film Explorer",
    description: "Watch films from 5 European countries",
    icon: "🎬",
    threshold: 5,
    category: "region",
  },
  {
    id: "century-club",
    title: "Century Club",
    description: "Log 100 films in your archive",
    icon: "💯",
    threshold: 100,
    category: "milestone",
  },
  {
    id: "polyglot",
    title: "Polyglot Viewer",
    description: "Watch films in 8 different languages",
    icon: "🌐",
    threshold: 8,
    category: "milestone",
  },
  {
    id: "indian-industries",
    title: "Indian Cinema Connoisseur",
    description: "Explore 4 Indian film industries",
    icon: "🎥",
    threshold: 4,
    category: "region",
  },
];

const ASIAN_COUNTRIES = new Set([
  "JP", "KR", "CN", "IN", "TW", "HK", "SG", "TH", "VN", "PH", "MY", "ID",
  "MM", "KH", "LA", "BD", "LK", "NP", "PK", "AF", "IR", "MN",
]);

const EUROPEAN_COUNTRIES = new Set([
  "GB", "FR", "DE", "IT", "ES", "PT", "NL", "BE", "CH", "AT", "PL", "CZ",
  "SK", "HU", "RO", "BG", "HR", "RS", "GR", "SE", "NO", "DK", "FI", "IS",
  "IE", "RU", "UA",
]);

export function computeAchievements(
  logs: CinemaLog[],
  countryStats: Map<string, CountryStats>,
  indianStats: IndianCinemaStats,
): Achievement[] {
  const countryCodes = new Set(countryStats.keys());
  const languages = getUniqueLanguages(logs);
  const asianCountries = [...countryCodes].filter((c) => ASIAN_COUNTRIES.has(c));
  const europeanCountries = [...countryCodes].filter((c) => EUROPEAN_COUNTRIES.has(c));
  const hindiCount = logs.filter((l) => l.original_language === "hi").length;
  const koreanCount = countryStats.get("KR")?.count || 0;

  const countMap: Record<string, number> = {
    "world-cinema": countryCodes.size,
    "asian-explorer": asianCountries.length,
    "bollywood-buff": hindiCount,
    "korean-lover": koreanCount,
    "festival-explorer": europeanCountries.length,
    "century-club": logs.length,
    polyglot: languages.length,
    "indian-industries": indianStats.totalIndustries,
  };

  return ACHIEVEMENT_DEFINITIONS.map((def) => {
    const current = countMap[def.id] || 0;
    return {
      ...def,
      currentCount: current,
      progress: Math.min(1, current / def.threshold),
      unlocked: current >= def.threshold,
    };
  });
}

/* ═══════════════════════════════════════════════════════════
   INSIGHTS
   ═══════════════════════════════════════════════════════════ */

export function computeInsights(
  logs: CinemaLog[],
  countryStats: Map<string, CountryStats>,
  indianStats: IndianCinemaStats,
): Insight[] {
  const insights: Insight[] = [];
  const languages = getUniqueLanguages(logs);
  const countryCodes = [...countryStats.keys()];

  // Country count
  if (countryCodes.length > 0) {
    insights.push({
      id: "countries",
      text: `Your stories came from ${countryCodes.length} ${countryCodes.length === 1 ? "country" : "countries"}.`,
      icon: "🌍",
      category: "country",
    });
  }

  // Most-watched country
  const sorted = [...countryStats.values()].sort((a, b) => b.count - a.count);
  if (sorted[0]) {
    insights.push({
      id: "top-country",
      text: `${sorted[0].name} was your most explored cinema.`,
      icon: codeToFlag(sorted[0].code),
      category: "country",
    });
  }

  // Language count
  if (languages.length > 1) {
    insights.push({
      id: "languages",
      text: `You watched films in ${languages.length} languages.`,
      icon: "🗣️",
      category: "language",
    });
  }

  // Indian cinema
  if (indianStats.totalFilms > 0) {
    insights.push({
      id: "indian-industries",
      text: `You explored ${indianStats.totalIndustries} Indian film ${indianStats.totalIndustries === 1 ? "industry" : "industries"}.`,
      icon: "🇮🇳",
      category: "industry",
    });

    if (indianStats.totalFilms > 2) {
      insights.push({
        id: "indian-top",
        text: `${indianStats.mostWatchedIndustry} was your most watched Indian cinema.`,
        icon: "🎬",
        category: "industry",
      });
    }
  }

  // Korean cinema
  const krStats = countryStats.get("KR");
  if (krStats && krStats.count > 0) {
    insights.push({
      id: "korean",
      text: `You discovered ${krStats.count} Korean ${krStats.count === 1 ? "film" : "films"}.`,
      icon: "🇰🇷",
      category: "country",
    });
  }

  // Total films
  if (logs.length > 0) {
    insights.push({
      id: "total",
      text: `${logs.length} ${logs.length === 1 ? "story" : "stories"} in your cinema archive.`,
      icon: "📽️",
      category: "milestone",
    });
  }

  return insights;
}
