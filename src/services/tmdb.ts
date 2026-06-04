import { Movie } from "@/components/ui/movie-card";
import { TRENDING_MOVIES } from "@/lib/data/mock";

const TMDB_API_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

/**
 * Check if TMDB API is properly configured.
 */
export function isTMDBConfigured(): boolean {
  const apiKey = process.env.TMDB_API_KEY;
  return !!apiKey && apiKey !== "YOUR_TMDB_API_KEY_HERE" && apiKey.trim() !== "";
}

/**
 * Base fetcher for TMDB API endpoints.
 */
async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!isTMDBConfigured()) {
    throw new Error("TMDB API key is not configured. Set TMDB_API_KEY in .env.local");
  }

  const queryParams = new URLSearchParams({
    api_key: apiKey!,
    ...params,
  });

  const url = `${TMDB_API_URL}${endpoint}?${queryParams.toString()}`;
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`TMDB API call failed: ${response.statusText} (${response.status})`);
  }

  return response.json();
}

/**
 * Hydrates a list movie with details (runtime, tagline) and credits (director).
 */
async function hydrateMovie(tmdbMovie: any): Promise<Movie> {
  const movieId = tmdbMovie.id;
  try {
    // Fetch details and credits in one call
    const details = await tmdbFetch(`/movie/${movieId}`, {
      append_to_response: "credits",
    });

    const directorObj = details.credits?.crew?.find(
      (c: any) => c.job === "Director"
    );

    const runtime = details.runtime || 120;
    const genres = details.genres || [];
    const genreName = genres.length > 0 ? genres[0].name : "Drama";

    return {
      id: details.id,
      title: details.title,
      year: details.release_date ? new Date(details.release_date).getFullYear() : 2024,
      rating: details.vote_average || 0,
      genre: genreName,
      director: directorObj?.name || "Unknown Director",
      tagline: details.tagline || details.overview || "",
      poster: details.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${details.poster_path}`
        : "/images/posters/placeholder.png",
      duration: `${Math.floor(runtime / 60)}h ${runtime % 60}m`,
    };
  } catch (error) {
    console.error(`Error hydrating TMDB movie ID ${movieId}:`, error);
    // Return a partial object based on the list result as fallback
    const releaseYear = tmdbMovie.release_date
      ? new Date(tmdbMovie.release_date).getFullYear()
      : 2024;
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      year: releaseYear,
      rating: tmdbMovie.vote_average || 0,
      genre: "Drama",
      director: "Unknown Director",
      tagline: tmdbMovie.overview || "",
      poster: tmdbMovie.poster_path
        ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`
        : "/images/posters/placeholder.png",
      duration: "2h 00m",
    };
  }
}

/**
 * Fetch and hydrate trending movies.
 */
export async function getTrendingMovies(limit = 10): Promise<Movie[]> {
  if (!isTMDBConfigured()) {
    console.warn("TMDB API key not configured. Returning mock trending movies.");
    return TRENDING_MOVIES.slice(0, limit);
  }

  try {
    const data = await tmdbFetch("/trending/movie/day");
    const results = data.results?.slice(0, limit) || [];
    return await Promise.all(results.map(hydrateMovie));
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
}

/**
 * Fetch and hydrate popular movies.
 */
export async function getPopularMovies(limit = 10): Promise<Movie[]> {
  if (!isTMDBConfigured()) {
    console.warn("TMDB API key not configured. Returning mock popular movies as fallback.");
    // Return a shifted subset of mock data so it looks different
    return [...TRENDING_MOVIES.slice(2), ...TRENDING_MOVIES.slice(0, 2)].slice(0, limit);
  }

  try {
    const data = await tmdbFetch("/movie/popular");
    const results = data.results?.slice(0, limit) || [];
    return await Promise.all(results.map(hydrateMovie));
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    throw error;
  }
}

/**
 * Fetch and hydrate top rated movies.
 */
export async function getTopRatedMovies(limit = 10): Promise<Movie[]> {
  if (!isTMDBConfigured()) {
    console.warn("TMDB API key not configured. Returning mock top rated movies as fallback.");
    // Return a shifted subset of mock data so it looks different
    return [...TRENDING_MOVIES.slice(4), ...TRENDING_MOVIES.slice(0, 4)].slice(0, limit);
  }

  try {
    const data = await tmdbFetch("/movie/top_rated");
    const results = data.results?.slice(0, limit) || [];
    return await Promise.all(results.map(hydrateMovie));
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    throw error;
  }
}
