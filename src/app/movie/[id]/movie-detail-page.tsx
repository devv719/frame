"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Play, Star, Users, Film } from "lucide-react";
import { type MovieDetail } from "@/services/tmdb";
import { type Movie } from "@/components/ui/movie-card";
import { cn } from "@/lib/utils";

interface MovieDetailPageProps {
  movie: MovieDetail;
  similarMovies?: Movie[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export function MovieDetailPage({ movie, similarMovies }: MovieDetailPageProps) {
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);

  const trailerUrl = movie.trailer
    ? `https://www.youtube.com/embed/${movie.trailer.key}?rel=0&modestbranding=1`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease }}
      className="min-h-screen bg-[#0e0d0b] text-[#e8e2d9]"
    >
      <section className="relative min-h-[calc(100dvh-4rem)] overflow-hidden md:min-h-[calc(100dvh-72px)]">
        <div className="absolute inset-0">
          <div
            className={cn(
              "absolute inset-0 bg-neutral-900 shimmer transition-opacity duration-700",
              backdropLoaded ? "opacity-0" : "opacity-100"
            )}
          />
          {movie.backdrop ? (
            <Image
              src={movie.backdrop}
              alt={`${movie.title} backdrop`}
              fill
              priority
              className={cn(
                "object-cover transition duration-1000",
                backdropLoaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-md"
              )}
              sizes="100vw"
              unoptimized={movie.backdrop.startsWith("http")}
              onLoad={() => setBackdropLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#161410]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0d0b] via-[#0e0d0b]/80 to-[#0e0d0b]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d0b] via-[#0e0d0b]/20 to-transparent" />
        </div>
 
        <div className="container-frame relative z-10 grid min-h-[calc(100dvh-4rem)] items-end gap-10 pb-14 pt-10 md:min-h-[calc(100dvh-72px)] md:grid-cols-[minmax(220px,320px),1fr] md:items-center md:pb-20 md:pt-16 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
            className="order-2 md:order-1"
          >
            <div className="relative aspect-[2/3] max-w-[210px] overflow-hidden border border-white/10 bg-[#161410] shadow-2xl md:max-w-none">
              {movie.poster ? (
                <>
                  <div
                    className={cn(
                      "absolute inset-0 shimmer transition-opacity duration-500",
                      posterLoaded ? "opacity-0" : "opacity-100"
                    )}
                  />
                  <Image
                    src={movie.poster}
                    alt={`${movie.title} poster`}
                    fill
                    className={cn(
                      "object-cover transition duration-700",
                      posterLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                    )}
                    sizes="(max-width: 768px) 210px, 320px"
                    unoptimized={movie.poster.startsWith("http")}
                    onLoad={() => setPosterLoaded(true)}
                  />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#161410]">
                  <span className="text-[1.125rem] font-display italic text-white/40 text-center leading-snug">
                    {movie.title}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.08, ease }}
            className="order-1 max-w-3xl md:order-2"
          >
            <Link
              href="/explore"
              className="mb-8 inline-flex items-center gap-2 border border-white/10 bg-white/8 px-4 py-2 text-[0.75rem] font-sans font-medium uppercase tracking-[0.16em] text-[rgba(232,226,217,0.55)] backdrop-blur-md transition-colors hover:text-[#e8e2d9]"
            >
              <ArrowLeft className="size-4" />
              Explore
            </Link>

            {movie.tagline && (
              <p className="mb-3 text-[0.8125rem] font-sans font-light uppercase tracking-[0.18em] text-[#e8d5b0]">
                {movie.tagline}
              </p>
            )}
            <h1 className="max-w-4xl text-white">{movie.title}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.875rem] text-white/78">
              <span>{movie.year}</span>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" />
                {movie.duration}
              </span>
              <span className="h-1 w-1 rounded-full bg-white/35" />
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                {movie.rating.toFixed(1)}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="border border-white/10 bg-white/6 px-3 py-1.5 text-[0.6875rem] font-sans font-medium uppercase tracking-[0.14em] text-[rgba(232,226,217,0.55)] backdrop-blur-md"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="mt-7 max-w-2xl text-[1rem] leading-relaxed text-white/74 md:text-[1.0625rem]">
              {movie.overview}
            </p>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.65, ease }}
        className="border-t border-white/5 bg-[#0e0d0b] py-14 md:py-20"
      >
        <div className="container-frame grid gap-12 lg:grid-cols-[1fr,0.9fr]">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Users className="size-5 text-[#e8d5b0]" />
              <h2 className="text-[1.5rem] text-[#e8e2d9] md:text-[1.875rem] font-display italic font-normal">Cast</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {movie.cast.map((member, index) => (
                <motion.article
                  key={`${member.id}-${member.character}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.04, ease }}
                  className="overflow-hidden rounded-none border border-white/5 bg-[#161410]"
                >
                  <div className="relative aspect-[3/4] bg-white/8">
                    {member.profile ? (
                      <Image
                        src={member.profile}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 180px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl font-semibold text-white/35">
                        {member.name.slice(0, 1)}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="truncate text-[0.875rem] font-semibold text-white">{member.name}</h3>
                    <p className="truncate text-[0.75rem] text-white/52">{member.character}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-2">
              <Play className="size-5 fill-[#e8d5b0] text-[#e8d5b0]" />
              <h2 className="text-[1.5rem] text-[#e8e2d9] md:text-[1.875rem] font-display italic font-normal">Trailer</h2>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-none border border-white/5 bg-[#161410] shadow-2xl">
              {trailerUrl ? (
                <iframe
                  src={trailerUrl}
                  title={movie.trailer?.name || `${movie.title} trailer`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                  <Play className="mb-4 size-10 text-white/28" />
                  <h3 className="text-[1rem] font-semibold text-white">Trailer coming soon</h3>
                  <p className="mt-2 max-w-sm text-[0.875rem] text-white/54">
                    This film does not have an embeddable trailer in the current catalog.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Similar Movies Section */}
      {similarMovies && similarMovies.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.65, ease }}
          className="border-t border-white/5 bg-[#0e0d0b] pb-24 pt-14 md:pb-32 md:pt-20"
        >
          <div className="container-frame">
            <div className="mb-10 flex items-center gap-3 border-b border-white/5 pb-5">
              <Film className="size-4 text-[#e8d5b0]" />
              <h2 className="font-display italic font-normal text-[1.5rem] md:text-[1.875rem] text-[#e8e2d9]">Similar Films</h2>
            </div>
            
            <div className="flex gap-5 md:gap-6 overflow-x-auto pb-6 -mx-6 px-6 md:-mx-8 md:px-8 snap-x snap-mandatory scrollbar-hide">
              {similarMovies.map((similarMovie) => (
                <article key={similarMovie.id} className="w-[180px] sm:w-[220px] md:w-[240px] flex-shrink-0 snap-start">
                  <Link href={`/movie/${similarMovie.id}`} className="group block">
                    <div className="relative aspect-[2/3] overflow-hidden border border-white/5 bg-[#161410] transition-all duration-500 group-hover:border-[#e8d5b0]/30 group-hover:-translate-y-1">
                      {similarMovie.poster ? (
                        <Image
                          src={similarMovie.poster}
                          alt={similarMovie.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 180px, 240px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl font-semibold text-white/35">
                          Film
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-2 py-0.5 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-[0.6875rem] font-bold">
                        <Star className="size-3 text-amber-400 fill-amber-400" />
                        <span>{similarMovie.rating.toFixed(1)}</span>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4 backdrop-blur-[1px]">
                        <h4 className="text-[0.875rem] font-semibold text-white truncate">{similarMovie.title}</h4>
                        <p className="text-[0.75rem] text-white/60 mt-1 font-medium">{similarMovie.year}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-display italic font-normal text-[0.9375rem] text-[#e8e2d9] truncate group-hover:text-[#e8d5b0] transition-colors duration-300">
                        {similarMovie.title}
                      </h4>
                      <p className="text-[0.75rem] text-white/40 mt-0.5 font-medium">{similarMovie.year}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
