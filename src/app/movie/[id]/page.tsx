import { notFound } from "next/navigation";
import { getMovieDetails, getSimilarMovies } from "@/services/tmdb";
import { MovieDetailPage } from "./movie-detail-page";

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MoviePageProps) {
  const { id } = await params;

  try {
    const movie = await getMovieDetails(id);
    return {
      title: `${movie.title} - Frame`,
      description: movie.overview,
    };
  } catch {
    return {
      title: "Movie - Frame",
    };
  }
}

export default async function Page({ params }: MoviePageProps) {
  const { id } = await params;

  try {
    const [movie, similarMovies] = await Promise.all([
      getMovieDetails(id),
      getSimilarMovies(id, 8),
    ]);
    return <MovieDetailPage movie={movie} similarMovies={similarMovies} />;
  } catch (error) {
    console.error("Failed to load movie page details:", error);
    notFound();
  }
}

