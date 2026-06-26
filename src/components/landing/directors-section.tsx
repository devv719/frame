"use client";
 
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type DirectorProfile } from "@/services/tmdb";
 
export function DirectorsSection() {
  const [directors, setDirectors] = useState<DirectorProfile[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const res = await fetch("/api/movies?type=curated-directors");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setDirectors(data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch curated directors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectors();
  }, []);
 
  return (
    <section
      className="relative section-padding overflow-hidden bg-[#0e0d0b]"
      aria-label="Featured directors"
    >
      <div className="container-frame">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-overline-style block mb-3 text-[rgba(232,226,217,0.4)]">
            Visionaries
          </span>
          <h2 className="font-display italic font-normal text-[2.25rem] sm:text-[3rem] text-[#e8e2d9] tracking-tight leading-tight">
            The minds behind the magic
          </h2>
          <p className="mt-4 max-w-md mx-auto text-[rgba(232,226,217,0.4)] text-[0.875rem] leading-relaxed font-sans">
            Explore the filmographies of directors who shape how we see the world.
          </p>
        </div>
 
        {/* Director Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <DirectorSkeleton key={idx} />
            ))
          ) : directors.length > 0 ? (
            directors.map((director, index) => (
              <DirectorCard key={director.id} director={director} index={index} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-[rgba(232,226,217,0.4)]">
              Unable to load directors.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
 
function DirectorSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-none bg-[#161410] border border-white/5 h-[260px] animate-pulse">
      <div className="flex flex-col sm:flex-row h-full">
        <div className="sm:w-[200px] md:w-[220px] h-[160px] sm:h-full bg-black flex-shrink-0" />
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="w-[120px] h-4 bg-[#1e1c18] rounded-none" />
                <div className="w-[80px] h-3 bg-[#1e1c18] rounded-none" />
              </div>
              <div className="w-16 h-5 bg-[#1e1c18] rounded-none" />
            </div>
            <div className="mt-4 w-full h-10 bg-[#1e1c18] rounded-none" />
          </div>
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="flex gap-2">
              <div className="w-20 h-6 bg-[#1e1c18] rounded-none" />
              <div className="w-20 h-6 bg-[#1e1c18] rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
 
function getCountry(place?: string | null) {
  if (!place) return "International";
  const parts = place.split(",");
  return parts[parts.length - 1].trim();
}
 
function DirectorCard({
  director,
  index,
}: {
  director: DirectorProfile;
  index: number;
}) {
  const shortBio = director.biography
    ? director.biography.split(/[.!?]/).slice(0, 2).join(".") + "."
    : "Renowned filmmaker crafting acclaimed cinematic masterworks.";
 
  return (
    <Link href={`/director/${director.id}`} className="block h-full">
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.5,
          delay: index * 0.05,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          "group relative overflow-hidden rounded-none cursor-pointer h-full",
          "bg-[#161410] border border-white/5",
          "hover:border-[#e8d5b0]/25 hover:bg-[#1e1c18]",
          "transition-all duration-300"
        )}
      >
      <div className="flex flex-col sm:flex-row h-full">
        {/* Profile Image / Monogram */}
        <div className="relative sm:w-[180px] md:w-[200px] flex-shrink-0 h-[200px] sm:h-auto overflow-hidden bg-black border-r border-white/5">
          {director.profileImage ? (
            <Image
              src={director.profileImage}
              alt={director.name}
              fill
              className="object-cover group-hover:scale-101 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, 200px"
              unoptimized
            />
          ) : (
            <div className="relative h-full flex items-center justify-center bg-[#161410]">
              <span className="text-[2.5rem] font-display font-light text-[rgba(232,226,217,0.2)] tracking-tighter select-none">
                {getInitials(director.name)}
              </span>
            </div>
          )}
        </div>
 
        {/* Info */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[1.25rem] font-display italic font-normal text-text-primary tracking-tight group-hover:text-[#e8d5b0] transition-colors duration-300">
                  {director.name}
                </h3>
                <span className="text-[0.75rem] font-sans text-text-tertiary block mt-0.5 uppercase tracking-wider font-light">
                  {getCountry(director.placeOfBirth)}
                </span>
              </div>
              <span className="flex-shrink-0 px-2.5 py-1 border border-[#e8d5b0]/20 text-[0.6875rem] font-sans font-light text-[#e8d5b0] uppercase tracking-wider">
                {director.totalFilmCount} films
              </span>
            </div>
 
            <p className="mt-4 text-[0.8125rem] text-[rgba(232,226,217,0.4)] leading-relaxed font-sans font-light italic line-clamp-3">
              &ldquo;{shortBio}&rdquo;
            </p>
          </div>
 
          {/* Notable Films */}
          {director.knownForMovies && director.knownForMovies.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/5">
              <span className="text-[0.625rem] text-text-muted tracking-[0.15em] uppercase block mb-2 font-sans font-medium">
                Notable Works
              </span>
              <div className="flex flex-wrap gap-2">
                {director.knownForMovies.slice(0, 2).map((film) => (
                  <span
                    key={film.id}
                    className={cn(
                      "px-2.5 py-1 text-[0.6875rem] font-sans font-light uppercase tracking-wider rounded-none",
                      "bg-black/35 text-text-secondary border border-white/5",
                      "group-hover:border-[#e8d5b0]/20 group-hover:text-[#e8d5b0]",
                      "transition-colors duration-300"
                    )}
                  >
                    {film.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  </Link>
  );
}
