/**
 * Curated Collections — Real movie data configurations for Frame.
 *
 * All movie references are real films sourced via TMDB.
 * Curated selections are inspired by Letterboxd community favorites.
 * No mock, placeholder, or fictional content.
 */

/* ── Mood Definitions ── */

export interface MoodDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  gradient: string;
  /** TMDB genre IDs to filter by */
  tmdbGenreIds: number[];
  /** TMDB keyword IDs for additional filtering */
  tmdbKeywordIds: number[];
  /** Sort strategy for TMDB Discover API */
  tmdbSortBy: string;
}

export const MOOD_DEFINITIONS: MoodDefinition[] = [
  {
    id: "melancholic",
    name: "Melancholic",
    description: "Films that ache beautifully",
    emoji: "🌧",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    tmdbGenreIds: [18],
    tmdbKeywordIds: [3713, 9673, 4565], // grief, loneliness, melancholy
    tmdbSortBy: "vote_average.desc",
  },
  {
    id: "euphoric",
    name: "Euphoric",
    description: "Pure cinematic joy",
    emoji: "✨",
    gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    tmdbGenreIds: [35, 18],
    tmdbKeywordIds: [9840, 4344], // feel-good, friendship
    tmdbSortBy: "vote_average.desc",
  },
  {
    id: "nostalgic",
    name: "Nostalgic",
    description: "Warmth of fading memories",
    emoji: "📼",
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    tmdbGenreIds: [18],
    tmdbKeywordIds: [5340, 9672, 156218], // nostalgia, childhood, coming of age
    tmdbSortBy: "vote_average.desc",
  },
  {
    id: "surreal",
    name: "Surreal",
    description: "Beyond the edges of reality",
    emoji: "🪞",
    gradient:
      "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 50%, #d4fc79 100%)",
    tmdbGenreIds: [14, 878],
    tmdbKeywordIds: [6054, 9882], // surrealism, dream
    tmdbSortBy: "vote_average.desc",
  },
  {
    id: "intimate",
    name: "Intimate",
    description: "Quietly devastating closeness",
    emoji: "🕯",
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    tmdbGenreIds: [10749, 18],
    tmdbKeywordIds: [9799, 818], // love, relationship
    tmdbSortBy: "vote_average.desc",
  },
  {
    id: "unsettled",
    name: "Unsettled",
    description: "Lingers long after credits roll",
    emoji: "🌑",
    gradient: "linear-gradient(135deg, #161410 0%, #1e1c18 100%)",
    tmdbGenreIds: [53, 27],
    tmdbKeywordIds: [10349, 12332], // atmospheric, psychological
    tmdbSortBy: "vote_average.desc",
  },
];

/* ── Featured Directors ── */

export interface FeaturedDirector {
  tmdbPersonId: number;
  /** Fallback gradient for avatar area before profile photo loads */
  gradient: string;
}

export const FEATURED_DIRECTORS: FeaturedDirector[] = [
  {
    tmdbPersonId: 137427, // Denis Villeneuve
    gradient: "linear-gradient(135deg, #c4b5fd, #f9a8d4)",
  },
  {
    tmdbPersonId: 21684, // Bong Joon-ho
    gradient: "linear-gradient(135deg, #a78bfa, #818cf8)",
  },
  {
    tmdbPersonId: 45400, // Greta Gerwig
    gradient: "linear-gradient(135deg, #fbbf24, #f472b6)",
  },
  {
    tmdbPersonId: 12453, // Wong Kar-wai
    gradient: "linear-gradient(135deg, #34d399, #3b82f6)",
  },
];

/* ── Filming Locations (for Atlas & Landing) ── */

export interface CuratedLocation {
  id: string;
  tmdbMovieId: number;
  movieTitle: string;
  year: number;
  director: string;
  genre: string;
  locationName: string;
  city: string;
  country: string;
  coordinates: [longitude: number, latitude: number];
  kind: "primary" | "landmark" | "studio" | "landscape";
  scene: string;
  synopsis: string;
  mood: string;
  productionWindow: string;
  posterPath: string; // TMDB poster_path — will be resolved to full URL
  datasetSource: "tmdb";
}

export const CURATED_LOCATIONS: CuratedLocation[] = [
  {
    id: "tokyo-lost-in-translation",
    tmdbMovieId: 153,
    movieTitle: "Lost in Translation",
    year: 2003,
    director: "Sofia Coppola",
    genre: "Drama",
    locationName: "Park Hyatt Tokyo, Shinjuku",
    city: "Tokyo",
    country: "Japan",
    coordinates: [139.6917, 35.6895],
    kind: "primary",
    scene:
      "Bob and Charlotte share sleepless nights above the neon skyline of Shinjuku, drifting through a city that feels both alien and achingly familiar.",
    synopsis:
      "Two Americans stranded in a Tokyo hotel discover an unexpected connection amid jet lag and existential malaise.",
    mood: "Bittersweet solitude",
    productionWindow: "Autumn 2002",
    posterPath: "/wXsQvli6tWqja5Jag9cMoEBJBaR.jpg",
    datasetSource: "tmdb",
  },
  {
    id: "paris-amelie",
    tmdbMovieId: 194,
    movieTitle: "Amélie",
    year: 2001,
    director: "Jean-Pierre Jeunet",
    genre: "Romance",
    locationName: "Café des Deux Moulins, Montmartre",
    city: "Paris",
    country: "France",
    coordinates: [2.3334, 48.8847],
    kind: "landmark",
    scene:
      "Amélie serves crème brûlée and orchestrates small miracles from behind the counter of a Montmartre café.",
    synopsis:
      "A shy waitress discovers the power of spreading joy through elaborate, anonymous acts of kindness across Paris.",
    mood: "Whimsical delight",
    productionWindow: "Summer 2000",
    posterPath: "/nSxDa3ppafYYIt0hbsYYoBN4gUQ.jpg",
    datasetSource: "tmdb",
  },
  {
    id: "new-york-taxi-driver",
    tmdbMovieId: 103,
    movieTitle: "Taxi Driver",
    year: 1976,
    director: "Martin Scorsese",
    genre: "Crime",
    locationName: "Times Square & Columbus Circle",
    city: "New York",
    country: "United States",
    coordinates: [-73.9857, 40.758],
    kind: "primary",
    scene:
      "Travis Bickle prowls the steam-slicked streets of 1970s Manhattan, a lone wolf circling through neon and decay.",
    synopsis:
      "A mentally unstable Vietnam War veteran works as a nighttime taxi driver in New York City, where the perceived decadence and sleaze fuels his urge for violent action.",
    mood: "Nocturnal unease",
    productionWindow: "Summer 1975",
    posterPath: "/ekstpH614fwDX8DUln1a2Opz0N8.jpg",
    datasetSource: "tmdb",
  },
  {
    id: "iceland-interstellar",
    tmdbMovieId: 157336,
    movieTitle: "Interstellar",
    year: 2014,
    director: "Christopher Nolan",
    genre: "Sci-Fi",
    locationName: "Svínafellsjökull Glacier",
    city: "Vík",
    country: "Iceland",
    coordinates: [-16.878, 64.01],
    kind: "landscape",
    scene:
      "Dr. Mann's icy planet stretches endlessly — a frozen wasteland standing in for the edge of human survival.",
    synopsis:
      "A team of explorers travels through a wormhole near Saturn in search of a new home for humanity as Earth faces ecological collapse.",
    mood: "Cosmic awe",
    productionWindow: "Late 2013",
    posterPath: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    datasetSource: "tmdb",
  },
  {
    id: "morocco-gladiator",
    tmdbMovieId: 98,
    movieTitle: "Gladiator",
    year: 2000,
    director: "Ridley Scott",
    genre: "Action",
    locationName: "Aït Benhaddou",
    city: "Ouarzazate",
    country: "Morocco",
    coordinates: [-7.131, 31.0472],
    kind: "landmark",
    scene:
      "The ancient ksar doubles as the Roman province of Zucchabar, where Maximus first fights as a gladiator slave.",
    synopsis:
      "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.",
    mood: "Savage grandeur",
    productionWindow: "Early 1999",
    posterPath: "/ty8TGRuvJLPUmAR1H1nRIsgpvim.jpg",
    datasetSource: "tmdb",
  },
  {
    id: "kyoto-memoirs-geisha",
    tmdbMovieId: 1904,
    movieTitle: "Memoirs of a Geisha",
    year: 2005,
    director: "Rob Marshall",
    genre: "Drama",
    locationName: "Fushimi Inari Taisha",
    city: "Kyoto",
    country: "Japan",
    coordinates: [135.7727, 34.9671],
    kind: "landmark",
    scene:
      "Young Chiyo runs through the vermillion torii gates, the crimson tunnels framing her desperate bid for freedom.",
    synopsis:
      "A young girl is sold to a geisha house where she endures hardship, trains as a geisha, and ultimately becomes one of the most celebrated in Japan.",
    mood: "Elegant yearning",
    productionWindow: "Autumn 2004",
    posterPath: "/mXp1VfrjhyyDxbFidMpoSvD8clc.jpg",
    datasetSource: "tmdb",
  },
];

/* ── Location Cards (Landing Page) ── */

export interface LocationCard {
  id: number;
  city: string;
  country: string;
  gradient: string;
  coordinates: string;
}

export const LOCATION_CARDS: LocationCard[] = [
  {
    id: 1,
    city: "Tokyo",
    country: "Japan",
    gradient: "linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)",
    coordinates: "35.6762° N",
  },
  {
    id: 2,
    city: "Paris",
    country: "France",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    coordinates: "48.8566° N",
  },
  {
    id: 3,
    city: "New York",
    country: "United States",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    coordinates: "40.7128° N",
  },
  {
    id: 4,
    city: "Marrakech",
    country: "Morocco",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    coordinates: "31.6295° N",
  },
  {
    id: 5,
    city: "Reykjavík",
    country: "Iceland",
    gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    coordinates: "64.1466° N",
  },
  {
    id: 6,
    city: "Buenos Aires",
    country: "Argentina",
    gradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    coordinates: "34.6037° S",
  },
];

/* ── Hero Stats ── */

export const HERO_STATS = [
  { label: "Films Catalogued", value: "12,400+" },
  { label: "Filming Locations", value: "2,800+" },
  { label: "Curated Collections", value: "340+" },
] as const;
