import { NextResponse } from "next/server";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  searchMovies,
  getGenres,
  getMoviesByGenre,
  getMovieDetails,
  getMoodMovies,
  getMoodCounts,
  getCuratedDirectors,
  getDirectorProfile,
  isTMDBConfigured,
  getLocationFilmCount,
  getSimilarMovies,
  getMoviesByCountry,
} from "@/services/tmdb";
import { FEATURED_DIRECTORS } from "@/services/curated-collections";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "trending";
  const limitStr = searchParams.get("limit");
  const limit = limitStr ? parseInt(limitStr, 10) : 10;
  const query = searchParams.get("query") || "";
  const genreId = searchParams.get("genreId") || "";
  const id = searchParams.get("id") || "";
  const moodId = searchParams.get("moodId") || "";
  const personId = searchParams.get("personId") || "";

  // Check API configuration for endpoints that require TMDB
  if (!isTMDBConfigured() && type !== "genres") {
    return NextResponse.json(
      { error: "TMDB API key is not configured. Set TMDB_API_KEY in .env.local" },
      { status: 503 }
    );
  }

  try {
    if (type === "trending") {
      const movies = await getTrendingMovies(limit);
      return NextResponse.json(movies);
    } else if (type === "popular") {
      const movies = await getPopularMovies(limit);
      return NextResponse.json(movies);
    } else if (type === "top-rated") {
      const movies = await getTopRatedMovies(limit);
      return NextResponse.json(movies);
    } else if (type === "now-playing") {
      const movies = await getNowPlayingMovies(limit);
      return NextResponse.json(movies);
    } else if (type === "search") {
      const movies = await searchMovies(query, limit);
      return NextResponse.json(movies);
    } else if (type === "genres") {
      const genres = await getGenres();
      return NextResponse.json(genres);
    } else if (type === "genre") {
      if (!genreId) {
        return NextResponse.json(
          { error: "genreId query parameter is required for genre type." },
          { status: 400 }
        );
      }
      const movies = await getMoviesByGenre(genreId, limit);
      return NextResponse.json(movies);
    } else if (type === "detail") {
      if (!id) {
        return NextResponse.json(
          { error: "id query parameter is required for detail type." },
          { status: 400 }
        );
      }
      const movie = await getMovieDetails(id);
      return NextResponse.json(movie);
    } else if (type === "similar") {
      if (!id) {
        return NextResponse.json(
          { error: "id query parameter is required for similar type." },
          { status: 400 }
        );
      }
      const movies = await getSimilarMovies(id, limit);
      return NextResponse.json(movies);
    } else if (type === "mood") {
      if (!moodId) {
        return NextResponse.json(
          { error: "moodId query parameter is required for mood type." },
          { status: 400 }
        );
      }
      const result = await getMoodMovies(moodId, limit);
      return NextResponse.json(result);
    } else if (type === "mood-counts") {
      const counts = await getMoodCounts();
      return NextResponse.json(counts);
    } else if (type === "curated-directors") {
      const directors = await getCuratedDirectors();
      return NextResponse.json(directors);
    } else if (type === "director") {
      if (!personId) {
        return NextResponse.json(
          { error: "personId query parameter is required for director type." },
          { status: 400 }
        );
      }
      const director = FEATURED_DIRECTORS.find(
        (d) => d.tmdbPersonId === parseInt(personId, 10)
      );
      const profile = await getDirectorProfile(
        parseInt(personId, 10),
        director?.gradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      );
      return NextResponse.json(profile);
    } else if (type === "location-count") {
      const city = searchParams.get("city") || "";
      if (!city) {
        return NextResponse.json(
          { error: "city query parameter is required for location-count type." },
          { status: 400 }
        );
      }
      const count = await getLocationFilmCount(city);
      return NextResponse.json({ city, count });
    } else if (type === "country") {
      const code = searchParams.get("code") || "";
      if (!code) {
        return NextResponse.json(
          { error: "code query parameter is required for country type." },
          { status: 400 }
        );
      }
      const pageStr = searchParams.get("page") || "1";
      const page = parseInt(pageStr, 10) || 1;
      const movies = await getMoviesByCountry(code, limit, page);
      return NextResponse.json(movies);
    } else {
      return NextResponse.json(
        { error: "Invalid movie type. Use: trending, popular, top-rated, now-playing, search, genres, genre, detail, mood, mood-counts, curated-directors, director, location-count, country." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error(`API route error for type ${type}:`, error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch data from TMDB." },
      { status: 500 }
    );
  }
}
