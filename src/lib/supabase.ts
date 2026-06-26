import { createClient } from "@supabase/supabase-js";

export interface CinemaLog {
  id: string;
  movie_id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_year: number;
  director: string;
  genres: string[];
  watched_at: string; // YYYY-MM-DD
  rating: number; // 0.5 to 5.0
  mood: string; // Inspired, Heartbroken, Nostalgic, Disturbed, Happy, Thoughtful
  favorite_scene: string;
  notes: string;
  rewatched: boolean;
  media_type: string; // movie, series, documentary, anime
  created_at: string;
  production_countries?: string[];
  original_language?: string; // ISO 639-1 language code (e.g., "en", "hi", "ta")
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    !!SUPABASE_URL &&
    !!SUPABASE_ANON_KEY &&
    SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
    SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY"
  );
};

// Initialize Supabase Client if configured
const supabase = isSupabaseConfigured()
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// LocalStorage key for fallback
const LOCAL_STORAGE_KEY = "frame_cinema_archive_logs";

// Mock data to initialize localStorage if empty
const DEFAULT_LOGS: CinemaLog[] = [
  // ── United States ──
  {
    id: "mock-1",
    movie_id: 157336,
    title: "Interstellar",
    poster_path: "/gEU2Qv6157Pt7fi9HbxN2bq9In5.jpg",
    backdrop_path: "/xJHokMbljvjADYUr5k2f2VmiF1P.jpg",
    release_year: 2014,
    director: "Christopher Nolan",
    genres: ["Adventure", "Drama", "Science Fiction"],
    watched_at: "2026-06-13",
    rating: 5.0,
    mood: "Inspired",
    favorite_scene: "The docking sequence with Cooper and TARS.",
    notes: "Hans Zimmer's organ score vibrating the entire room.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-06-13T10:00:00Z").toISOString(),
    production_countries: ["United States of America", "United Kingdom"],
    original_language: "en",
  },
  {
    id: "mock-2",
    movie_id: 244786,
    title: "Whiplash",
    poster_path: "/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
    backdrop_path: "/6bbZ6z6vjU8V2wN1n3r2B2v3v5.jpg",
    release_year: 2014,
    director: "Damien Chazelle",
    genres: ["Drama", "Music"],
    watched_at: "2026-05-20",
    rating: 4.5,
    mood: "Thoughtful",
    favorite_scene: "The final drum solo duel between Andrew and Fletcher.",
    notes: "Terrifyingly brilliant performance by J.K. Simmons.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-05-20T14:30:00Z").toISOString(),
    production_countries: ["United States of America"],
    original_language: "en",
  },
  {
    id: "mock-4",
    movie_id: 807,
    title: "Se7en",
    poster_path: "/69CzZg0WD52v4w8EsFBZsueDmj4.jpg",
    backdrop_path: "/qd4Ddg12U9V09ZcT4wH3r0A97j.jpg",
    release_year: 1995,
    director: "David Fincher",
    genres: ["Crime", "Mystery", "Thriller"],
    watched_at: "2026-03-02",
    rating: 4.0,
    mood: "Disturbed",
    favorite_scene: "The library scene with Bach playing in the background.",
    notes: "Grimy, rain-soaked, and utterly bleak.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-03-02T22:00:00Z").toISOString(),
    production_countries: ["United States of America"],
    original_language: "en",
  },
  {
    id: "mock-us-4",
    movie_id: 680,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    release_year: 1994,
    director: "Quentin Tarantino",
    genres: ["Thriller", "Crime"],
    watched_at: "2026-01-10",
    rating: 5.0,
    mood: "Inspired",
    favorite_scene: "The Royale with Cheese conversation.",
    notes: "Non-linear storytelling at its absolute finest.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-01-10T21:00:00Z").toISOString(),
    production_countries: ["United States of America"],
    original_language: "en",
  },
  {
    id: "mock-us-5",
    movie_id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdrop_path: "/hZkgoQYus5dXo3H8T7CYV0XpBvE.jpg",
    release_year: 1999,
    director: "David Fincher",
    genres: ["Drama", "Thriller"],
    watched_at: "2025-12-28",
    rating: 4.5,
    mood: "Disturbed",
    favorite_scene: "The reveal.",
    notes: "Still hits different on every rewatch.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2025-12-28T23:00:00Z").toISOString(),
    production_countries: ["United States of America", "Germany"],
    original_language: "en",
  },

  // ── South Korea ──
  {
    id: "mock-3",
    movie_id: 496243,
    title: "Parasite",
    poster_path: "/7IiTT05EXLYuHZEccBNjChCcxJu.jpg",
    backdrop_path: "/hiKazoR94sJ2IS44v3uSll17clq.jpg",
    release_year: 2019,
    director: "Bong Joon Ho",
    genres: ["Comedy", "Thriller", "Drama"],
    watched_at: "2026-04-15",
    rating: 5.0,
    mood: "Disturbed",
    favorite_scene: "The former housekeeper's return in the rain.",
    notes: "Pitch perfect architectural details.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-04-15T20:15:00Z").toISOString(),
    production_countries: ["South Korea"],
    original_language: "ko",
  },
  {
    id: "mock-kr-2",
    movie_id: 346646,
    title: "Oldboy",
    poster_path: "/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg",
    backdrop_path: "/2aMcAMBRFOQhf5fP0rpxFOfl5my.jpg",
    release_year: 2003,
    director: "Park Chan-wook",
    genres: ["Thriller", "Mystery", "Drama"],
    watched_at: "2026-03-20",
    rating: 4.5,
    mood: "Disturbed",
    favorite_scene: "The corridor fight in a single take.",
    notes: "Visceral and unforgettable.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-03-20T20:00:00Z").toISOString(),
    production_countries: ["South Korea"],
    original_language: "ko",
  },
  {
    id: "mock-kr-3",
    movie_id: 587996,
    title: "Decision to Leave",
    poster_path: "/vxK2nfSDJfP4mPMTmPmzEQ3MFyN.jpg",
    backdrop_path: "/j2gGDKxfbFkxCgY9vCq3pqEE6VH.jpg",
    release_year: 2022,
    director: "Park Chan-wook",
    genres: ["Romance", "Thriller", "Mystery"],
    watched_at: "2026-02-14",
    rating: 4.0,
    mood: "Heartbroken",
    favorite_scene: "The mountain fog scene.",
    notes: "A love story told through surveillance and obsession.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-02-14T19:00:00Z").toISOString(),
    production_countries: ["South Korea"],
    original_language: "ko",
  },

  // ── France ──
  {
    id: "mock-5",
    movie_id: 11082,
    title: "La Haine",
    poster_path: "/6pZg356F4L8uG6A2sF1H3t1I4X.jpg",
    backdrop_path: "/w5p6Z6A2sF1H3t1I4X.jpg",
    release_year: 1995,
    director: "Mathieu Kassovitz",
    genres: ["Drama"],
    watched_at: "2026-02-18",
    rating: 4.5,
    mood: "Nostalgic",
    favorite_scene: "The DJ scene with Bob Marley mixed with Edith Piaf.",
    notes: "Raw and modern black-and-white cinematography.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-02-18T19:00:00Z").toISOString(),
    production_countries: ["France"],
    original_language: "fr",
  },
  {
    id: "mock-fr-2",
    movie_id: 194,
    title: "Amélie",
    poster_path: "/nSxDa3ppafHAPnPJof3EdqyhBnG.jpg",
    backdrop_path: "/bfGo5VkAnMrevSjIjx77gfk2Gni.jpg",
    release_year: 2001,
    director: "Jean-Pierre Jeunet",
    genres: ["Comedy", "Romance"],
    watched_at: "2026-01-05",
    rating: 4.5,
    mood: "Happy",
    favorite_scene: "The skip-stone sequence on the canal.",
    notes: "Pure cinematic joy in every frame.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-01-05T18:00:00Z").toISOString(),
    production_countries: ["France", "Germany"],
    original_language: "fr",
  },

  // ── Japan ──
  {
    id: "mock-jp-1",
    movie_id: 129,
    title: "Spirited Away",
    poster_path: "/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdrop_path: "/6oaL4DP75yABrd5EbC4H2zq3wOR.jpg",
    release_year: 2001,
    director: "Hayao Miyazaki",
    genres: ["Animation", "Family", "Fantasy"],
    watched_at: "2026-05-02",
    rating: 5.0,
    mood: "Inspired",
    favorite_scene: "The train ride over the water.",
    notes: "Miyazaki's imagination is boundless.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-05-02T14:00:00Z").toISOString(),
    production_countries: ["Japan"],
    original_language: "ja",
  },
  {
    id: "mock-jp-2",
    movie_id: 372058,
    title: "Your Name.",
    poster_path: "/q719jXXEzOoYaps6babgKnONONX.jpg",
    backdrop_path: "/dIWwZW7dJJtqC6CgWzYkNVKIUm2.jpg",
    release_year: 2016,
    director: "Makoto Shinkai",
    genres: ["Animation", "Romance", "Drama"],
    watched_at: "2026-04-20",
    rating: 4.5,
    mood: "Heartbroken",
    favorite_scene: "The twilight meeting on the crater.",
    notes: "Breathtaking visuals, devastating emotional payoff.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-04-20T20:00:00Z").toISOString(),
    production_countries: ["Japan"],
    original_language: "ja",
  },

  // ── India — Hindi Cinema (Bollywood) ──
  {
    id: "mock-in-hi-1",
    movie_id: 19404,
    title: "Dilwale Dulhania Le Jayenge",
    poster_path: "/2CAL2433ZeIihfX1Hb2139CX0pW.jpg",
    backdrop_path: "/90ez6ArvpO8bvpyIngBuwXOqJm5.jpg",
    release_year: 1995,
    director: "Aditya Chopra",
    genres: ["Comedy", "Drama", "Romance"],
    watched_at: "2026-06-01",
    rating: 4.5,
    mood: "Happy",
    favorite_scene: "The mustard field reunion.",
    notes: "The definitive Bollywood romance. SRK at his peak.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-06-01T19:00:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "hi",
  },
  {
    id: "mock-in-hi-2",
    movie_id: 20453,
    title: "3 Idiots",
    poster_path: "/66A9MqXOyVFCssoloscw79z8Tew.jpg",
    backdrop_path: "/rVV8YfPsb42gKIBTzBO0bJMPuXP.jpg",
    release_year: 2009,
    director: "Rajkumar Hirani",
    genres: ["Comedy", "Drama"],
    watched_at: "2026-05-15",
    rating: 5.0,
    mood: "Inspired",
    favorite_scene: "The Rancho silencer speech.",
    notes: "All is well. A film that makes you rethink everything about education.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-05-15T17:00:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "hi",
  },
  {
    id: "mock-in-hi-3",
    movie_id: 429422,
    title: "Tumbbad",
    poster_path: "/29Hk5TDJDfkuEIdNvRyJhqOvbPv.jpg",
    backdrop_path: "/kHnBVpk0oHKxnHsEGcdCWy3F2pM.jpg",
    release_year: 2018,
    director: "Rahi Anil Barve",
    genres: ["Horror", "Fantasy", "Thriller"],
    watched_at: "2026-04-08",
    rating: 4.5,
    mood: "Disturbed",
    favorite_scene: "The descent into the womb of Hastar.",
    notes: "Masterpiece of Indian folk horror. Greed visualized.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-04-08T22:00:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "hi",
  },
  {
    id: "mock-in-hi-4",
    movie_id: 424694,
    title: "Gangs of Wasseypur",
    poster_path: "/ry8Czr3jjwGEFN56VNv3DdYjr05.jpg",
    backdrop_path: "/gWtdXf3qZ3p7G0JjYhqLLKtlsss.jpg",
    release_year: 2012,
    director: "Anurag Kashyap",
    genres: ["Crime", "Action", "Drama"],
    watched_at: "2026-03-12",
    rating: 4.5,
    mood: "Thoughtful",
    favorite_scene: "The coal mafia power shift montage.",
    notes: "Indian cinema's answer to The Godfather, but rawer.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-03-12T20:30:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "hi",
  },

  // ── India — Tamil Cinema (Kollywood) ──
  {
    id: "mock-in-ta-1",
    movie_id: 634492,
    title: "Vikram",
    poster_path: "/74w0JjcTgRCp9bEBkU2K16rNrOo.jpg",
    backdrop_path: "/6PEYHA8DfCPC1ESj9fxIYP3q3FH.jpg",
    release_year: 2022,
    director: "Lokesh Kanagaraj",
    genres: ["Action", "Thriller"],
    watched_at: "2026-05-28",
    rating: 4.0,
    mood: "Inspired",
    favorite_scene: "The Kamal Haasan reveal.",
    notes: "Lokesh Cinematic Universe is incredible.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-05-28T21:00:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "ta",
  },
  {
    id: "mock-in-ta-2",
    movie_id: 505642,
    title: "Super Deluxe",
    poster_path: "/5FqZxKFJJXfCe4p0jJb7XQ3DuSX.jpg",
    backdrop_path: "/j1gQj1r4S3FbKjJ0sMIhhBNqp8Z.jpg",
    release_year: 2019,
    director: "Thiagarajan Kumararaja",
    genres: ["Drama", "Comedy", "Thriller"],
    watched_at: "2026-04-25",
    rating: 4.5,
    mood: "Thoughtful",
    favorite_scene: "The intersecting storylines reveal.",
    notes: "Tamil cinema pushing boundaries of narrative structure.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-04-25T19:30:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "ta",
  },

  // ── India — Telugu Cinema (Tollywood) ──
  {
    id: "mock-in-te-1",
    movie_id: 505948,
    title: "RRR",
    poster_path: "/nEufeZYoDBLCsWsVP8E1HedlFMe.jpg",
    backdrop_path: "/4Y1WNkd88JoWJPd6UVOvpGZj8SG.jpg",
    release_year: 2022,
    director: "S.S. Rajamouli",
    genres: ["Action", "Drama"],
    watched_at: "2026-06-05",
    rating: 4.5,
    mood: "Inspired",
    favorite_scene: "Naatu Naatu dance sequence.",
    notes: "Pure spectacle and emotion. Rajamouli operates on a different level.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-06-05T20:00:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "te",
  },

  // ── India — Malayalam Cinema ──
  {
    id: "mock-in-ml-1",
    movie_id: 856289,
    title: "Drishyam",
    poster_path: "/2L4bIk4PhdpG4UMSzbMfkYSWPjR.jpg",
    backdrop_path: "/dTFjaiVWjk5X3h4HIT9sWvPxPaG.jpg",
    release_year: 2013,
    director: "Jeethu Joseph",
    genres: ["Thriller", "Crime", "Drama"],
    watched_at: "2026-03-28",
    rating: 5.0,
    mood: "Thoughtful",
    favorite_scene: "The final revelation of the burial.",
    notes: "Mohanlal's performance is masterclass. Malayalam cinema is unmatched.",
    rewatched: true,
    media_type: "movie",
    created_at: new Date("2026-03-28T21:00:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "ml",
  },

  // ── India — Kannada Cinema ──
  {
    id: "mock-in-kn-1",
    movie_id: 936000,
    title: "Kantara",
    poster_path: "/qD1nJRZMlU3TM3LqF5xUqTiBvbu.jpg",
    backdrop_path: "/7rXpBp5JB3Btkb9LN4lT5mSTGP0.jpg",
    release_year: 2022,
    director: "Rishab Shetty",
    genres: ["Action", "Drama", "Thriller"],
    watched_at: "2026-02-10",
    rating: 4.0,
    mood: "Inspired",
    favorite_scene: "The Bhoota Kola climax.",
    notes: "Raw, rooted, and primal. Kannada cinema's roar.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-02-10T19:00:00Z").toISOString(),
    production_countries: ["India"],
    original_language: "kn",
  },

  // ── Mexico ──
  {
    id: "mock-mx-1",
    movie_id: 7326,
    title: "Pan's Labyrinth",
    poster_path: "/s57E4AfPIU1fxwPPNji0YHSsGBl.jpg",
    backdrop_path: "/sIr5TiTsNJhQMrcIjDMPylSNIGR.jpg",
    release_year: 2006,
    director: "Guillermo del Toro",
    genres: ["Fantasy", "Drama", "War"],
    watched_at: "2026-01-22",
    rating: 5.0,
    mood: "Heartbroken",
    favorite_scene: "Ofelia's final choice.",
    notes: "Dark fairy tale perfection.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-01-22T21:00:00Z").toISOString(),
    production_countries: ["Mexico", "Spain"],
    original_language: "es",
  },

  // ── Iran ──
  {
    id: "mock-ir-1",
    movie_id: 60243,
    title: "A Separation",
    poster_path: "/hzGh2wBFBiPz6ixg9u2T23eR4mR.jpg",
    backdrop_path: "/qJ9Gy79GYnLP9hzM6pNBgFe2fJj.jpg",
    release_year: 2011,
    director: "Asghar Farhadi",
    genres: ["Drama"],
    watched_at: "2025-12-15",
    rating: 5.0,
    mood: "Thoughtful",
    favorite_scene: "The courtroom confrontation.",
    notes: "Every character is right. Every character is wrong. Devastating.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2025-12-15T20:00:00Z").toISOString(),
    production_countries: ["Iran"],
    original_language: "fa",
  },

  // ── Spain ──
  {
    id: "mock-es-1",
    movie_id: 1396,
    title: "The Sea Inside",
    poster_path: "/8YRYKZfXrP9cJkJmbOq7PUVFedp.jpg",
    backdrop_path: "/8f3sVhJW4YGkLqzKuWj8pF0m8QP.jpg",
    release_year: 2004,
    director: "Alejandro Amenábar",
    genres: ["Drama"],
    watched_at: "2025-11-30",
    rating: 4.0,
    mood: "Heartbroken",
    favorite_scene: "The imagined flight to the sea.",
    notes: "Javier Bardem in one of his most restrained, powerful performances.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2025-11-30T18:00:00Z").toISOString(),
    production_countries: ["Spain"],
    original_language: "es",
  },

  // ── United Kingdom ──
  {
    id: "mock-gb-1",
    movie_id: 508442,
    title: "Soul",
    poster_path: "/hm58Jw2Sz9qWnGYLbH3hFVhM5JW.jpg",
    backdrop_path: "/kf456ZqeC45XTvo6W9pW5clYKfQ.jpg",
    release_year: 2020,
    director: "Pete Docter",
    genres: ["Animation", "Comedy", "Drama"],
    watched_at: "2026-06-10",
    rating: 4.5,
    mood: "Inspired",
    favorite_scene: "The walk through New York after coming back.",
    notes: "Pixar asking the biggest questions.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-06-10T16:00:00Z").toISOString(),
    production_countries: ["United States of America"],
    original_language: "en",
  },
  {
    id: "mock-gb-2",
    movie_id: 530385,
    title: "Midsommar",
    poster_path: "/7LEI8ulZKFTaokJ0rpVsraB9J0y.jpg",
    backdrop_path: "/lkInRiMtLgl9u0xBB7Vo6FHGV3s.jpg",
    release_year: 2019,
    director: "Ari Aster",
    genres: ["Horror", "Drama", "Mystery"],
    watched_at: "2026-01-28",
    rating: 4.0,
    mood: "Disturbed",
    favorite_scene: "The maypole dance.",
    notes: "Horror in broad daylight. Florence Pugh is extraordinary.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2026-01-28T22:00:00Z").toISOString(),
    production_countries: ["United States of America", "Sweden"],
    original_language: "en",
  },

  // ── Germany ──
  {
    id: "mock-de-1",
    movie_id: 582,
    title: "Run Lola Run",
    poster_path: "/sMrYpJl7rlGhWKBXMmZ8CSCbJvM.jpg",
    backdrop_path: "/xFcw2Hih8pf3gxVmvkDSZs4MxPh.jpg",
    release_year: 1998,
    director: "Tom Tykwer",
    genres: ["Action", "Thriller"],
    watched_at: "2025-11-12",
    rating: 4.0,
    mood: "Inspired",
    favorite_scene: "Each run's diverging consequences.",
    notes: "Relentless energy. German cinema at its most inventive.",
    rewatched: false,
    media_type: "movie",
    created_at: new Date("2025-11-12T20:00:00Z").toISOString(),
    production_countries: ["Germany"],
    original_language: "de",
  },
];

// Helper to get logs from localStorage
const getLocalLogs = (): CinemaLog[] => {
  if (typeof window === "undefined") return DEFAULT_LOGS;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_LOGS));
    return DEFAULT_LOGS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_LOGS;
  }
};

// Helper to save logs to localStorage
const saveLocalLogs = (logs: CinemaLog[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logs));
};

/**
 * Fetch all cinema logs.
 */
export async function getCinemaLogs(): Promise<CinemaLog[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("cinema_logs")
      .select("*")
      .order("watched_at", { ascending: false });

    if (error) {
      console.error("Error fetching from Supabase:", error);
      return getLocalLogs(); // Fallback to localStorage on error
    }
    return data || [];
  }

  // Fallback
  return getLocalLogs().sort(
    (a, b) => new Date(b.watched_at).getTime() - new Date(a.watched_at).getTime()
  );
}

/**
 * Add a new movie log.
 */
export async function logMovie(log: Omit<CinemaLog, "id" | "created_at">): Promise<CinemaLog> {
  const newLog: CinemaLog = {
    ...log,
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { data, error } = await supabase
      .from("cinema_logs")
      .insert([newLog])
      .select();

    if (error) {
      console.error("Error inserting to Supabase:", error);
      // Fallback save locally
      const local = getLocalLogs();
      local.unshift(newLog);
      saveLocalLogs(local);
      return newLog;
    }
    return data[0];
  }

  const local = getLocalLogs();
  local.unshift(newLog);
  saveLocalLogs(local);
  return newLog;
}

/**
 * Delete a movie log.
 */
export async function deleteCinemaLog(id: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.from("cinema_logs").delete().eq("id", id);
    if (error) {
      console.error("Error deleting from Supabase:", error);
      return false;
    }
    return true;
  }

  const local = getLocalLogs();
  const filtered = local.filter((l) => l.id !== id);
  saveLocalLogs(filtered);
  return true;
}

/**
 * Calculate Cinema Wrapped stats.
 */
export async function getCinemaStats() {
  const logs = await getCinemaLogs();
  if (logs.length === 0) {
    return {
      totalCount: 0,
      movieCount: 0,
      seriesCount: 0,
      averageRating: 0,
      favoriteGenre: "None",
      mostWatchedDirector: "None",
      mostActiveMonth: "None",
    };
  }

  const movieCount = logs.filter((l) => l.media_type === "movie").length;
  const seriesCount = logs.filter((l) => l.media_type === "series").length;
  const averageRating =
    logs.reduce((acc, curr) => acc + curr.rating, 0) / logs.length;

  // Favorite Genre calculation
  const genresMap: Record<string, number> = {};
  logs.forEach((log) => {
    log.genres.forEach((genre) => {
      genresMap[genre] = (genresMap[genre] || 0) + 1;
    });
  });
  let favoriteGenre = "None";
  let maxGenreCount = 0;
  Object.entries(genresMap).forEach(([genre, count]) => {
    if (count > maxGenreCount) {
      maxGenreCount = count;
      favoriteGenre = genre;
    }
  });

  // Most Watched Director calculation
  const directorsMap: Record<string, number> = {};
  logs.forEach((log) => {
    if (log.director && log.director !== "Unknown Director") {
      directorsMap[log.director] = (directorsMap[log.director] || 0) + 1;
    }
  });
  let mostWatchedDirector = "None";
  let maxDirectorCount = 0;
  Object.entries(directorsMap).forEach(([director, count]) => {
    if (count > maxDirectorCount) {
      maxDirectorCount = count;
      mostWatchedDirector = director;
    }
  });

  // Most Active Month
  const monthsMap: Record<string, number> = {};
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  logs.forEach((log) => {
    const date = new Date(log.watched_at);
    if (!isNaN(date.getTime())) {
      const monthName = monthNames[date.getMonth()];
      monthsMap[monthName] = (monthsMap[monthName] || 0) + 1;
    }
  });
  let mostActiveMonth = "None";
  let maxMonthCount = 0;
  Object.entries(monthsMap).forEach(([month, count]) => {
    if (count > maxMonthCount) {
      maxMonthCount = count;
      mostActiveMonth = month;
    }
  });

  return {
    totalCount: logs.length,
    movieCount,
    seriesCount,
    averageRating,
    favoriteGenre,
    mostWatchedDirector,
    mostActiveMonth,
  };
}
