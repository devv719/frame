import { NextResponse } from "next/server";
import { getTrendingMovies, getPopularMovies, getTopRatedMovies } from "@/services/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "trending";
  const limitStr = searchParams.get("limit");
  const limit = limitStr ? parseInt(limitStr, 10) : 10;

  try {
    let movies;
    if (type === "trending") {
      movies = await getTrendingMovies(limit);
    } else if (type === "popular") {
      movies = await getPopularMovies(limit);
    } else if (type === "top-rated") {
      movies = await getTopRatedMovies(limit);
    } else {
      return NextResponse.json(
        { error: "Invalid movie category. Use: trending, popular, top-rated." },
        { status: 400 }
      );
    }

    return NextResponse.json(movies);
  } catch (error: any) {
    console.error(`API route error for type ${type}:`, error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch data from TMDB." },
      { status: 500 }
    );
  }
}
