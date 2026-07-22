export type { CinemaLog } from "@/lib/supabase";

/**
 * Type declarations for archiveService.js.
 * Provides proper TypeScript return types for all service functions
 * without converting the file to TypeScript.
 */

export type ArchiveStat = {
  totalCount: number;
  avgRating: number;
  topGenre: string;
  topDirector: string;
  averageRating: number;
};

export function logToArchive(
  userId: string,
  tmdbData: Record<string, unknown>,
  userJournal: Record<string, unknown>
): Promise<string>;

export function logMovie(data: {
  movie_id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_year: number;
  director: string;
  genres: string[];
  watched_at: string;
  rating: number;
  mood: string;
  favorite_scene: string;
  notes: string;
  rewatched: boolean;
  media_type: string;
  production_countries?: string[];
}): Promise<string>;

export function getArchiveLogs(userId: string): Promise<CinemaLog[]>;

export function deleteArchiveLog(logId: string): Promise<boolean>;

export function computeArchiveStats(logs: CinemaLog[]): ArchiveStat;
