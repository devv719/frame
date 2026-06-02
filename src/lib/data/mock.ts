/**
 * Mock data for Frame landing page.
 * Replaces API calls during the design/build phase.
 */

/* ── Trending Movies ── */

export interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  genre: string;
  director: string;
  tagline: string;
  poster: string;
  duration: string;
}

export const TRENDING_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Eternal Bloom",
    year: 2024,
    rating: 8.7,
    genre: "Drama",
    director: "Sofia Chen",
    tagline: "Some gardens grow in silence",
    poster: "/images/posters/eternal-bloom.png",
    duration: "2h 14m",
  },
  {
    id: 2,
    title: "Midnight Whispers",
    year: 2024,
    rating: 8.4,
    genre: "Mystery",
    director: "Lars Mikkelson",
    tagline: "The walls remember everything",
    poster: "/images/posters/midnight-whispers.png",
    duration: "1h 58m",
  },
  {
    id: 3,
    title: "Violet Hours",
    year: 2025,
    rating: 9.1,
    genre: "Romance",
    director: "Amara Obi",
    tagline: "Between dusk and dawn, we existed",
    poster: "/images/posters/violet-hours.png",
    duration: "2h 06m",
  },
  {
    id: 4,
    title: "Lost Meridian",
    year: 2024,
    rating: 8.2,
    genre: "Adventure",
    director: "Yuki Tanaka",
    tagline: "Every horizon hides another",
    poster: "/images/posters/lost-meridian.png",
    duration: "2h 31m",
  },
  {
    id: 5,
    title: "Paper Lanterns",
    year: 2025,
    rating: 8.9,
    genre: "Fantasy",
    director: "Yuki Tanaka",
    tagline: "Light rises when you let go",
    poster: "/images/posters/paper-lanterns.png",
    duration: "1h 52m",
  },
  {
    id: 6,
    title: "The Weight of Light",
    year: 2024,
    rating: 8.6,
    genre: "Drama",
    director: "Sofia Chen",
    tagline: "Grace is the heaviest thing to carry",
    poster: "/images/posters/weight-of-light.png",
    duration: "2h 20m",
  },
];

/* ── Mood Exploration ── */

export interface Mood {
  id: number;
  name: string;
  description: string;
  filmCount: number;
  gradient: string;
  emoji: string;
}

export const MOODS: Mood[] = [
  {
    id: 1,
    name: "Melancholic",
    description: "Films that ache beautifully",
    filmCount: 142,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    emoji: "🌧",
  },
  {
    id: 2,
    name: "Euphoric",
    description: "Pure cinematic joy",
    filmCount: 98,
    gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    emoji: "✨",
  },
  {
    id: 3,
    name: "Nostalgic",
    description: "Warmth of fading memories",
    filmCount: 176,
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    emoji: "📼",
  },
  {
    id: 4,
    name: "Surreal",
    description: "Beyond the edges of reality",
    filmCount: 67,
    gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #d4fc79 100%)",
    emoji: "🪞",
  },
  {
    id: 5,
    name: "Intimate",
    description: "Quietly devastating closeness",
    filmCount: 213,
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    emoji: "🕯",
  },
  {
    id: 6,
    name: "Haunting",
    description: "Lingers long after credits roll",
    filmCount: 89,
    gradient: "linear-gradient(135deg, #0c3547 0%, #204b6e 50%, #3a7ca5 100%)",
    emoji: "🌑",
  },
];

/* ── Locations ── */

export interface Location {
  id: number;
  city: string;
  country: string;
  filmCount: number;
  gradient: string;
  coordinates: string;
}

export const LOCATIONS: Location[] = [
  {
    id: 1,
    city: "Tokyo",
    country: "Japan",
    filmCount: 284,
    gradient: "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
    coordinates: "35.6762° N",
  },
  {
    id: 2,
    city: "Paris",
    country: "France",
    filmCount: 412,
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    coordinates: "48.8566° N",
  },
  {
    id: 3,
    city: "New York",
    country: "United States",
    filmCount: 567,
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    coordinates: "40.7128° N",
  },
  {
    id: 4,
    city: "Marrakech",
    country: "Morocco",
    filmCount: 73,
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    coordinates: "31.6295° N",
  },
  {
    id: 5,
    city: "Reykjavík",
    country: "Iceland",
    filmCount: 41,
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    coordinates: "64.1466° N",
  },
  {
    id: 6,
    city: "Buenos Aires",
    country: "Argentina",
    filmCount: 156,
    gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    coordinates: "34.6037° S",
  },
];

/* ── Featured Directors ── */

export interface Director {
  id: number;
  name: string;
  nationality: string;
  filmCount: number;
  style: string;
  notableFilms: string[];
  accolade: string;
  initial: string;
  gradient: string;
}

export const DIRECTORS: Director[] = [
  {
    id: 1,
    name: "Sofia Chen",
    nationality: "Taiwanese-American",
    filmCount: 7,
    style: "Poetic realism with dreamlike transitions",
    notableFilms: ["Eternal Bloom", "The Weight of Light", "Still Water"],
    accolade: "Palme d'Or Winner",
    initial: "SC",
    gradient: "linear-gradient(135deg, #c4b5fd, #f9a8d4)",
  },
  {
    id: 2,
    name: "Lars Mikkelson",
    nationality: "Danish",
    filmCount: 12,
    style: "Cold minimalism with emotional depth",
    notableFilms: ["Midnight Whispers", "Northern Silence", "Glass Kingdom"],
    accolade: "Venice Golden Lion",
    initial: "LM",
    gradient: "linear-gradient(135deg, #a78bfa, #818cf8)",
  },
  {
    id: 3,
    name: "Amara Obi",
    nationality: "Nigerian-British",
    filmCount: 5,
    style: "Vibrant intimacy and cultural tapestry",
    notableFilms: ["Violet Hours", "Lagos Rising", "The Color Between"],
    accolade: "TIFF People's Choice",
    initial: "AO",
    gradient: "linear-gradient(135deg, #fbbf24, #f472b6)",
  },
  {
    id: 4,
    name: "Yuki Tanaka",
    nationality: "Japanese",
    filmCount: 9,
    style: "Contemplative landscapes and spiritual quietude",
    notableFilms: ["Paper Lanterns", "Lost Meridian", "Temple of Rain"],
    accolade: "Cannes Grand Prix",
    initial: "YT",
    gradient: "linear-gradient(135deg, #34d399, #3b82f6)",
  },
];

/* ── Hero Stats ── */

export const HERO_STATS = [
  { label: "Films Catalogued", value: "12,400+" },
  { label: "Filming Locations", value: "2,800+" },
  { label: "Curated Collections", value: "340+" },
] as const;
