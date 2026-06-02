"use client";

import { motion } from "framer-motion";
import { MOODS } from "@/lib/data/mock";
import { cn } from "@/lib/utils";

/**
 * MoodSection — Explore films by emotional tone.
 *
 * Features:
 * - Bento-style asymmetric grid
 * - Each mood has a unique gradient backdrop
 * - Hover state intensifies gradient + scale
 * - Film count badges
 * - Staggered scroll reveal
 */
export function MoodSection() {
  return (
    <section
      className="relative section-padding overflow-hidden"
      aria-label="Explore by mood"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 50%, var(--color-lavender-400), transparent 50%), radial-gradient(circle at 70% 80%, var(--color-pink-300), transparent 40%)",
        }}
        aria-hidden="true"
      />

      <div className="container-frame relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <span className="text-overline-style block mb-3">
            Mood Discovery
          </span>
          <h2 className="max-w-lg mx-auto">
            How do you want to{" "}
            <span className="gradient-text">feel</span> tonight?
          </h2>
          <p className="mt-4 max-w-md mx-auto text-text-secondary">
            Every emotion has a film. Let your mood guide the journey.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {MOODS.map((mood, index) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              index={index}
              isLarge={index === 0 || index === 5}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MoodCard({
  mood,
  index,
  isLarge,
}: {
  mood: (typeof MOODS)[number];
  index: number;
  isLarge: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        isLarge && "md:col-span-2 md:row-span-1"
      )}
    >
      <div
        className={cn(
          "group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer",
          "transition-all duration-500",
          "hover:shadow-xl hover:-translate-y-1",
          isLarge ? "h-[200px] md:h-[260px]" : "h-[200px] md:h-[260px]"
        )}
        style={{ background: mood.gradient }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        {/* Hover glow */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-between p-6 md:p-8">
          <div className="flex items-start justify-between">
            <span className="text-[2rem] md:text-[2.5rem] filter drop-shadow-sm">
              {mood.emoji}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[0.6875rem] font-medium text-white/90 tracking-wide">
              {mood.filmCount} films
            </span>
          </div>

          <div>
            <h3
              className={cn(
                "font-display font-semibold text-white tracking-tight",
                isLarge
                  ? "text-[1.75rem] md:text-[2rem]"
                  : "text-[1.375rem] md:text-[1.5rem]"
              )}
            >
              {mood.name}
            </h3>
            <p className="mt-1 text-[0.8125rem] text-white/70 leading-relaxed">
              {mood.description}
            </p>
          </div>
        </div>

        {/* Arrow on hover */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-400">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
