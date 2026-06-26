import { Movie } from "@/components/ui/movie-card";
import {
  MOOD_DEFINITIONS,
  FEATURED_DIRECTORS,
  type MoodDefinition,
} from "./curated-collections";

const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280";

const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN || "";

export interface MovieCastMember {
  id: number;
  name: string;
  character: string;
  profile: string | null;
}

export interface MovieTrailer {
  key: string;
  name: string;
  site: string;
}

export interface MovieDetail extends Movie {
  overview: string;
  runtime: number;
  genres: { id: number; name: string }[];
  backdrop: string;
  cast: MovieCastMember[];
  trailer: MovieTrailer | null;
  production_countries?: string[];
}

export interface DirectorProfile {
  id: number;
  name: string;
  biography: string;
  profileImage: string | null;
  placeOfBirth: string | null;
  knownForMovies: Movie[];
  totalFilmCount: number;
  gradient: string;
}

/**
 * Check if TMDB API is properly configured.
 */
export function isTMDBConfigured(): boolean {
  return !!TMDB_READ_ACCESS_TOKEN && TMDB_READ_ACCESS_TOKEN !== "YOUR_TMDB_READ_ACCESS_TOKEN_HERE";
}

/**
 * Helper to obtain variable poster sizes: w92, w342, w500
 */
export function getPosterUrl(path: string | null, size: "w92" | "w342" | "w500" = "w342"): string {
  if (!path) return "";
  if (path.startsWith("http")) {
    return path.replace(/\/w342\/|\/w500\/|\/w92\//, `/${size}/`);
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Base fetcher for TMDB API endpoints.
 */
async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const queryParams = new URLSearchParams({
    ...params,
  });

  const url = `${TMDB_API_URL}${endpoint}?${queryParams.toString()}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_READ_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`TMDB API call failed: ${response.statusText} (${response.status})`);
  }

  return response.json();
}

/**
 * Hydrates a TMDB list movie with details (runtime, tagline) and credits (director).
 */
async function hydrateMovie(tmdbMovie: any): Promise<Movie> {
  const movieId = tmdbMovie.id;
  try {
    const details = await tmdbFetch(`/movie/${movieId}`, {
      append_to_response: "credits",
    });

    const directorObj = details.credits?.crew?.find(
      (c: any) => c.job === "Director"
    );

    const runtime = details.runtime || 0;
    const genres = details.genres || [];
    const genreName = genres.length > 0 ? genres[0].name : "Drama";

    return {
      id: details.id,
      title: details.title,
      year: details.release_date ? new Date(details.release_date).getFullYear() : 0,
      rating: details.vote_average || 0,
      genre: genreName,
      director: directorObj?.name || "Unknown Director",
      tagline: details.tagline || details.overview?.slice(0, 100) || "",
      poster: details.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${details.poster_path}`
        : "",
      duration: runtime > 0 ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : "",
    };
  } catch (error) {
    console.error(`Error hydrating TMDB movie ID ${movieId}:`, error);
    // Return a partial object based on the list result
    const releaseYear = tmdbMovie.release_date
      ? new Date(tmdbMovie.release_date).getFullYear()
      : 0;
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title || "Untitled",
      year: releaseYear,
      rating: tmdbMovie.vote_average || 0,
      genre: "",
      director: "",
      tagline: tmdbMovie.overview?.slice(0, 100) || "",
      poster: tmdbMovie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`
        : "",
      duration: "",
    };
  }
}

/**
 * Lightweight movie transform — no extra API calls, uses data from list endpoints.
 */
function transformListMovie(tmdbMovie: any): Movie {
  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || "Untitled",
    year: tmdbMovie.release_date
      ? new Date(tmdbMovie.release_date).getFullYear()
      : 0,
    rating: tmdbMovie.vote_average || 0,
    genre: "",
    director: "",
    tagline: tmdbMovie.overview?.slice(0, 120) || "",
    poster: tmdbMovie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`
      : "",
    duration: "",
  };
}

function formatRuntime(runtime: number): string {
  if (runtime <= 0) return "";
  return `${Math.floor(runtime / 60)}h ${runtime % 60}m`;
}

/**
 * Fetch one movie with credits, videos, and cinematic imagery.
 */
export async function getMovieDetails(id: string): Promise<MovieDetail> {
  const details = await tmdbFetch(`/movie/${id}`, {
    append_to_response: "credits,videos",
  });

  const directorObj = details.credits?.crew?.find(
    (crewMember: any) => crewMember.job === "Director"
  );
  const runtime = details.runtime || 0;
  const genres = details.genres || [];
  const trailer =
    details.videos?.results?.find(
      (video: any) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official
    ) ||
    details.videos?.results?.find(
      (video: any) => video.site === "YouTube" && video.type === "Trailer"
    ) ||
    null;

  return {
    id: details.id,
    title: details.title,
    year: details.release_date ? new Date(details.release_date).getFullYear() : 0,
    rating: details.vote_average || 0,
    genre: genres.length > 0 ? genres[0].name : "Drama",
    director: directorObj?.name || "Unknown Director",
    tagline: details.tagline || "",
    poster: details.poster_path
      ? getPosterUrl(details.poster_path, "w500")
      : "",
    duration: formatRuntime(runtime),
    overview: details.overview || "No overview is available for this film yet.",
    runtime,
    genres,
    backdrop: details.backdrop_path
      ? `${TMDB_BACKDROP_BASE_URL}${details.backdrop_path}`
      : details.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${details.poster_path}`
        : "",
    cast:
      details.credits?.cast?.slice(0, 8).map((castMember: any) => ({
        id: castMember.id,
        name: castMember.name,
        character: castMember.character,
        profile: castMember.profile_path
          ? `${TMDB_IMAGE_BASE_URL}${castMember.profile_path}`
          : null,
      })) || [],
    trailer: trailer
      ? {
          key: trailer.key,
          name: trailer.name,
          site: trailer.site,
        }
      : null,
    production_countries: details.production_countries
      ? details.production_countries.map((c: any) => c.name)
      : [],
  };
}

/**
 * Fetch and hydrate trending movies.
 */
export async function getTrendingMovies(limit = 10): Promise<Movie[]> {
  const data = await tmdbFetch("/trending/movie/day");
  const results = data.results?.slice(0, limit) || [];
  return await Promise.all(results.map(hydrateMovie));
}

/**
 * Fetch and hydrate popular movies.
 */
export async function getPopularMovies(limit = 10): Promise<Movie[]> {
  const data = await tmdbFetch("/movie/popular");
  const results = data.results?.slice(0, limit) || [];
  return await Promise.all(results.map(hydrateMovie));
}

/**
 * Fetch and hydrate top rated movies.
 */
export async function getTopRatedMovies(limit = 10): Promise<Movie[]> {
  const data = await tmdbFetch("/movie/top_rated");
  const results = data.results?.slice(0, limit) || [];
  return await Promise.all(results.map(hydrateMovie));
}

/**
 * Fetch now playing movies (currently in theaters).
 */
export async function getNowPlayingMovies(limit = 10): Promise<Movie[]> {
  const data = await tmdbFetch("/movie/now_playing");
  const results = data.results?.slice(0, limit) || [];
  return await Promise.all(results.map(hydrateMovie));
}

/**
 * Fetch similar movies for a movie ID.
 */
export async function getSimilarMovies(id: string, limit = 10): Promise<Movie[]> {
  const data = await tmdbFetch(`/movie/${id}/similar`);
  const results = data.results?.slice(0, limit) || [];
  return results.map(transformListMovie);
}


/**
 * Search movies by text query.
 */
export async function searchMovies(query: string, limit = 15): Promise<Movie[]> {
  if (!query || query.trim() === "") return [];

  const data = await tmdbFetch("/search/movie", {
    query,
    include_adult: "false",
    language: "en-US",
  });
  const results = data.results?.slice(0, limit) || [];
  return results.map(transformListMovie);
}

/**
 * Fetch movie genre list.
 */
export async function getGenres(): Promise<{ id: number; name: string }[]> {
  if (!isTMDBConfigured()) {
    // Genres are stable, standardized data — safe to use as static fallback
    return [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Sci-Fi" },
      { id: 10770, name: "TV Movie" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" },
    ];
  }

  try {
    const data = await tmdbFetch("/genre/movie/list");
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

/**
 * Discover movies by genre ID.
 */
export async function getMoviesByGenre(genreId: string, limit = 15): Promise<Movie[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
  });
  const results = data.results?.slice(0, limit) || [];
  return await Promise.all(results.map(hydrateMovie));
}

/**
 * Discover movies matching a curated mood.
 * Uses TMDB Discover API with genre + keyword filtering.
 */
export async function getMoodMovies(
  moodId: string,
  limit = 12
): Promise<{ mood: MoodDefinition; movies: Movie[]; totalResults: number }> {
  const mood = MOOD_DEFINITIONS.find((m) => m.id === moodId);
  if (!mood) {
    throw new Error(`Unknown mood: ${moodId}`);
  }

  const params: Record<string, string> = {
    sort_by: mood.tmdbSortBy,
    "vote_count.gte": "100",
    "vote_average.gte": "7",
  };

  if (mood.tmdbGenreIds.length > 0) {
    params.with_genres = mood.tmdbGenreIds.join(",");
  }
  if (mood.tmdbKeywordIds.length > 0) {
    params.with_keywords = mood.tmdbKeywordIds.join("|");
  }

  const data = await tmdbFetch("/discover/movie", params);
  const results = data.results?.slice(0, limit) || [];
  const movies = results.map(transformListMovie);

  return {
    mood,
    movies,
    totalResults: data.total_results || 0,
  };
}

/**
 * Fetch total movie count for each mood (for film count badges).
 */
export async function getMoodCounts(): Promise<
  { id: string; count: number }[]
> {
  const results = await Promise.allSettled(
    MOOD_DEFINITIONS.map(async (mood) => {
      const params: Record<string, string> = {
        sort_by: mood.tmdbSortBy,
        "vote_count.gte": "50",
        "vote_average.gte": "6.5",
      };
      if (mood.tmdbGenreIds.length > 0) {
        params.with_genres = mood.tmdbGenreIds.join(",");
      }
      if (mood.tmdbKeywordIds.length > 0) {
        params.with_keywords = mood.tmdbKeywordIds.join("|");
      }

      const data = await tmdbFetch("/discover/movie", params);
      return { id: mood.id, count: data.total_results || 0 };
    })
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<{ id: string; count: number }> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

/**
 * Fetch a director's profile and filmography from TMDB People API.
 */
export async function getDirectorProfile(
  personId: number,
  gradient: string
): Promise<DirectorProfile> {
  const [personData, credits] = await Promise.all([
    tmdbFetch(`/person/${personId}`),
    tmdbFetch(`/person/${personId}/movie_credits`),
  ]);

  // Get directed films sorted by vote average
  const directedFilms = (credits.crew || [])
    .filter((c: any) => c.job === "Director" && c.poster_path)
    .sort((a: any, b: any) => (b.vote_average || 0) - (a.vote_average || 0));

  const totalFilmCount = directedFilms.length;
  const topFilms = directedFilms.slice(0, 4).map(transformListMovie);

  return {
    id: personData.id,
    name: personData.name,
    biography: personData.biography || "",
    profileImage: personData.profile_path
      ? `${TMDB_IMAGE_BASE_URL}${personData.profile_path}`
      : null,
    placeOfBirth: personData.place_of_birth || null,
    knownForMovies: topFilms,
    totalFilmCount,
    gradient,
  };
}

/**
 * Fetch all curated director profiles.
 */
export async function getCuratedDirectors(): Promise<DirectorProfile[]> {
  const results = await Promise.allSettled(
    FEATURED_DIRECTORS.map((d) =>
      getDirectorProfile(d.tmdbPersonId, d.gradient)
    )
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<DirectorProfile> =>
        r.status === "fulfilled"
    )
    .map((r) => r.value);
}

/**
 * Fetch movie counts for a location (city) using keyword search.
 * Returns approximate count of films associated with a location.
 */
export async function getLocationFilmCount(city: string): Promise<number> {
  try {
    // Search for keyword matching the city name
    const keywordSearch = await tmdbFetch("/search/keyword", { query: city });
    const keyword = keywordSearch.results?.[0];
    if (!keyword) return 0;

    const discover = await tmdbFetch("/discover/movie", {
      with_keywords: String(keyword.id),
      sort_by: "popularity.desc",
    });

    return discover.total_results || 0;
  } catch {
    return 0;
  }
}

/**
 * Discover movies by country code.
 */
export async function getMoviesByCountry(countryCode: string, limit = 20, page = 1): Promise<Movie[]> {
  const data = await tmdbFetch("/discover/movie", {
    with_origin_country: countryCode,
    sort_by: "popularity.desc",
    language: "en-US",
    page: String(page),
  });
  const results = data.results?.slice(0, limit) || [];
  return results.map(transformListMovie);
}
