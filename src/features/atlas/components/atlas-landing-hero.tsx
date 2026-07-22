"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const wordVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: 0.3 + i * 0.12,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function AtlasLandingHero({ totalCountries }: { totalCountries: number }) {
  const titleWords = ["Your", "Cinema", "Atlas"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
    >
      <div className="relative text-center px-6 max-w-2xl">
        {/* Ambient glow behind title */}
        <div className="absolute inset-0 -inset-x-20 -inset-y-10 bg-[radial-gradient(ellipse_at_center,rgba(232,213,176,0.08)_0%,transparent_70%)]" />

        {/* Overline */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-2 mb-5"
        >
          <Sparkles className="size-3.5 text-[#e8d5b0]/60" />
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-[#e8d5b0]/50">
            Frame
          </span>
          <span className="h-px w-8 bg-[#e8d5b0]/20" />
        </motion.div>

        {/* Title — staggered word reveal */}
        <h1 className="font-display italic text-[clamp(2.5rem,7vw,5rem)] font-normal leading-[1.05] tracking-tight text-white mb-4">
          {titleWords.map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="inline-block mr-[0.3em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display italic text-[clamp(0.875rem,2vw,1.125rem)] text-[#e8e2d9]/60 leading-relaxed"
        >
          A map of every story you&apos;ve experienced.
        </motion.p>

        {/* Country count badge */}
        {totalCountries > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 1.3,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#101018]/60 px-4 py-2 backdrop-blur-xl"
          >
            <span className="size-1.5 rounded-full bg-[#e8d5b0] animate-pulse" />
            <span className="text-[11px] font-sans font-medium text-white/60 tracking-wide">
              {totalCountries} {totalCountries === 1 ? "country" : "countries"} explored
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
