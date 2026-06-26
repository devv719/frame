import { notFound } from "next/navigation";
import { getDirectorProfile } from "@/services/tmdb";
import { FEATURED_DIRECTORS } from "@/services/curated-collections";
import { DirectorDetailPage } from "./director-page";

interface DirectorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DirectorPageProps) {
  const { id } = await params;
  const directorId = parseInt(id, 10);

  try {
    const featured = FEATURED_DIRECTORS.find((d) => d.tmdbPersonId === directorId);
    const gradient = featured?.gradient || "linear-gradient(135deg, #a78bfa, #818cf8)";
    const profile = await getDirectorProfile(directorId, gradient);
    return {
      title: `${profile.name} — Filmmaker Profile`,
      description: profile.biography ? profile.biography.slice(0, 160) : `Filmography and works of auteur ${profile.name}.`,
    };
  } catch {
    return {
      title: "Filmmaker Profile — Frame",
    };
  }
}

export default async function Page({ params }: DirectorPageProps) {
  const { id } = await params;
  const directorId = parseInt(id, 10);

  if (isNaN(directorId)) {
    notFound();
  }

  try {
    const featured = FEATURED_DIRECTORS.find((d) => d.tmdbPersonId === directorId);
    const gradient = featured?.gradient || "linear-gradient(135deg, #a78bfa, #818cf8)";
    const profile = await getDirectorProfile(directorId, gradient);
    return <DirectorDetailPage profile={profile} />;
  } catch (error) {
    console.error("Failed to load director page details:", error);
    notFound();
  }
}
