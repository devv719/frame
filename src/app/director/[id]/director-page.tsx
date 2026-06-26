"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Film, MapPin } from "lucide-react";
import { type DirectorProfile } from "@/services/tmdb";
import { MovieCard } from "@/components/ui/movie-card";
import { cn } from "@/lib/utils";

interface DirectorDetailPageProps {
  profile: DirectorProfile;
}

const ease = [0.16, 1, 0.3, 1] as const;

export function DirectorDetailPage({ profile }: DirectorDetailPageProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease }}
      className="min-h-screen bg-[#0e0d0b] pb-24 text-[#e8e2d9]"
    >
      {/* Director Header */}
      <section className="relative overflow-hidden border-b border-white/5 bg-[#0e0d0b] py-16 md:py-24">
        {/* Subtle film grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container-frame relative z-10">
          <Link
            href="/explore"
            className="mb-10 inline-flex items-center gap-2 text-[0.75rem] font-sans font-medium uppercase tracking-[0.18em] text-[rgba(232,226,217,0.4)] hover:text-[#e8d5b0] transition-colors duration-200"
          >
            <ArrowLeft className="size-3.5" />
            Back to Explore
          </Link>

          <div className="grid gap-10 md:grid-cols-[220px,1fr] lg:grid-cols-[260px,1fr] lg:gap-20 items-start">
            {/* Left side: Profile image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
            >
              <div
                className="relative aspect-[4/5] w-full overflow-hidden border border-white/5 bg-[#161410]"
              >
                {/* Fallback initials */}
                <div className="absolute inset-0 flex items-center justify-center font-display text-[3.5rem] italic font-normal text-[rgba(232,226,217,0.12)]">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                {profile.profileImage && (
                  <Image
                    src={profile.profileImage}
                    alt={profile.name}
                    fill
                    priority
                    className={cn(
                      "object-cover transition duration-700",
                      imgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                    )}
                    sizes="(max-width: 768px) 220px, 260px"
                    onLoad={() => setImgLoaded(true)}
                    unoptimized
                  />
                )}
              </div>

              {/* Meta below photo */}
              <div className="mt-6 flex flex-col gap-3">
                {profile.placeOfBirth && (
                  <div className="flex items-start gap-2.5 text-[0.8125rem] text-[rgba(232,226,217,0.45)]">
                    <MapPin className="size-3.5 shrink-0 mt-0.5" />
                    <span>{profile.placeOfBirth}</span>
                  </div>
                )}
                <div className="flex items-center gap-2.5 text-[0.8125rem] text-[rgba(232,226,217,0.45)]">
                  <Film className="size-3.5 shrink-0" />
                  <span>{profile.totalFilmCount} directed films</span>
                </div>
              </div>
            </motion.div>

            {/* Right side: Director bio */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease }}
              className="max-w-3xl"
            >
              <span className="text-[0.6875rem] font-sans font-medium uppercase tracking-[0.22em] text-[#e8d5b0] block mb-3">
                Visionary Auteur
              </span>
              <h1 className="font-display italic font-normal text-[2.5rem] md:text-[3.25rem] leading-[1.1] tracking-tight text-[#e8e2d9] mb-8">
                {profile.name}
              </h1>

              <div className="text-[#e8e2d9]/60 leading-[1.85] text-[0.9375rem] font-sans font-light">
                {profile.biography ? (
                  <p className="whitespace-pre-line">{profile.biography}</p>
                ) : (
                  <p className="italic text-[rgba(232,226,217,0.3)]">
                    No biography data is available for this filmmaker yet.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filmography Section */}
      <section className="container-frame mt-16 md:mt-24">
        <div className="mb-10 flex items-center justify-between border-b border-white/5 pb-5">
          <div className="flex items-center gap-3">
            <Film className="size-4 text-[#e8d5b0]" />
            <h2 className="font-display italic font-normal text-[1.5rem] md:text-[1.875rem] text-[#e8e2d9]">
              Notable Works
            </h2>
          </div>
          <span className="text-[0.6875rem] font-sans font-medium uppercase tracking-[0.16em] text-[rgba(232,226,217,0.3)]">
            Curated filmography
          </span>
        </div>

        {profile.knownForMovies && profile.knownForMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {profile.knownForMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease }}
              >
                <Link href={`/movie/${movie.id}`} className="block h-full">
                  <MovieCard movie={movie} />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-[rgba(232,226,217,0.3)] italic font-display text-[1.125rem]">
            No films registered in their profile filmography.
          </div>
        )}
      </section>
    </motion.div>
  );
}
