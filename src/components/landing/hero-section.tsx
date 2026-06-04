"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { TRENDING_MOVIES, HERO_STATS } from "@/lib/data/mock";
import { cn } from "@/lib/utils";
import { type Movie } from "@/components/ui/movie-card";

/**
 * HeroSection — Full-viewport cinematic introduction.
 *
 * Features:
 * - Massive fluid typography with gradient text
 * - Floating movie poster cards with parallax drift
 * - Animated decorative orbs
 * - Stats bar
 * - Scroll-linked parallax on background elements
 */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const floatY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const floatY3 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Load live TMDB posters client-side with mock fallback
  const [posters, setPosters] = useState<Movie[]>([]);

  useEffect(() => {
    const loadPosters = async () => {
      try {
        const res = await fetch("/api/movies?type=trending&limit=3");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length >= 3) {
            setPosters(data);
          }
        }
      } catch (err) {
        console.error("Failed to load hero background posters from TMDB", err);
      }
    };
    loadPosters();
  }, []);

  // Select 3 posters for floating cards (use live TMDB data if loaded, otherwise mock data)
  const floatingPosters = posters.length >= 3 ? posters : (TRENDING_MOVIES.slice(0, 3) as any[] as Movie[]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* ── Background Orbs ── */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Large lavender orb */}
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-[0.18]"
          style={{
            background:
              "radial-gradient(circle, var(--color-lavender-300) 0%, transparent 70%)",
          }}
        />
        {/* Pink orb */}
        <div
          className="absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{
            background:
              "radial-gradient(circle, var(--color-pink-300) 0%, transparent 70%)",
          }}
        />
        {/* Warm orb bottom right */}
        <div
          className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.1]"
          style={{
            background:
              "radial-gradient(circle, var(--color-warm-200) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* ── Floating Movie Posters (Desktop only) ── */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block" aria-hidden="true">
        {/* Poster 1 - Top left */}
        <motion.div
          style={{ y: floatY1 }}
          initial={{ opacity: 0, x: -40, rotate: -8 }}
          animate={{ opacity: 1, x: 0, rotate: -8 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[15%] left-[5%] xl:left-[8%]"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[140px] xl:w-[170px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20"
          >
            <Image
              src={floatingPosters[0].poster}
              alt=""
              fill
              className="object-cover"
              sizes="170px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Poster 2 - Right mid */}
        <motion.div
          style={{ y: floatY2 }}
          initial={{ opacity: 0, x: 40, rotate: 6 }}
          animate={{ opacity: 1, x: 0, rotate: 6 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-[20%] right-[5%] xl:right-[8%]"
        >
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="w-[130px] xl:w-[155px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20"
          >
            <Image
              src={floatingPosters[1].poster}
              alt=""
              fill
              className="object-cover"
              sizes="155px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Poster 3 - Bottom left */}
        <motion.div
          style={{ y: floatY3 }}
          initial={{ opacity: 0, y: 40, rotate: -4 }}
          animate={{ opacity: 1, y: 0, rotate: -4 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-[22%] left-[12%] xl:left-[15%]"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="w-[115px] xl:w-[135px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20"
          >
            <Image
              src={floatingPosters[2].poster}
              alt=""
              fill
              className="object-cover"
              sizes="135px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Main Content ── */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container-frame flex flex-col items-center text-center px-4"
      >
        {/* Overline badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lavender-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-lavender-500" />
          </span>
          <span className="text-[0.8125rem] font-medium text-text-secondary tracking-wide">
            Now streaming 12,400+ films
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl leading-[1.05] tracking-[-0.04em]"
          style={{
            fontSize: "clamp(2.75rem, 7vw + 0.5rem, 5.5rem)",
          }}
        >
          Discover cinema
          <br />
          through a{" "}
          <span className="relative inline-block">
            <span className="gradient-text">new lens</span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full gradient-lavender-pink"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left" }}
            />
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 max-w-xl text-[1.125rem] md:text-[1.25rem] text-text-secondary leading-[1.65] tracking-[-0.01em]"
        >
          Explore films by mood, location, and visual storytelling.
          <br className="hidden sm:block" />
          A curated experience for the modern cinephile.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            type="button"
            className={cn(
              "group relative px-8 py-4 rounded-2xl overflow-hidden",
              "text-[0.9375rem] font-medium text-white",
              "gradient-lavender",
              "shadow-lg shadow-lavender-500/20",
              "hover:shadow-xl hover:shadow-lavender-500/30",
              "active:scale-[0.97]",
              "transition-all duration-300"
            )}
          >
            <span className="relative z-10">Start exploring</span>
            <div className="absolute inset-0 bg-gradient-to-r from-lavender-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
          <button
            type="button"
            className={cn(
              "group flex items-center gap-2 px-8 py-4 rounded-2xl",
              "text-[0.9375rem] font-medium text-text-secondary",
              "border border-border-primary",
              "hover:border-lavender-300 hover:text-text-primary hover:bg-lavender-50/50",
              "active:scale-[0.97]",
              "transition-all duration-300"
            )}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-lavender-500 group-hover:text-lavender-600 transition-colors"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch trailer
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 flex items-center gap-8 md:gap-14"
        >
          {HERO_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col items-center gap-1",
                i > 0 && "border-l border-border-secondary pl-8 md:pl-14"
              )}
            >
              <span className="text-[1.5rem] md:text-[1.75rem] font-semibold text-text-primary tracking-tight font-display">
                {stat.value}
              </span>
              <span className="text-[0.75rem] text-text-tertiary tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[0.6875rem] text-text-muted tracking-[0.15em] uppercase">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-neutral-300 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-neutral-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
