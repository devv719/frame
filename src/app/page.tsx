"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Home page — Foundation placeholder.
 * Demonstrates the design system tokens, typography scale,
 * and animation presets in action.
 */
export default function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-[calc(100dvh-4rem)]"
    >
      {/* Hero Section */}
      <section className="container-frame section-padding flex flex-col items-center justify-center text-center">
        <motion.div variants={staggerItem}>
          <span className="text-overline-style inline-block mb-6">
            Cinematic Discovery
          </span>
        </motion.div>

        <motion.h1
          variants={staggerItem}
          className="max-w-3xl"
        >
          Cinema through a{" "}
          <span className="gradient-text">new lens</span>
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="mt-6 max-w-xl text-body-lg text-text-secondary leading-relaxed"
        >
          Discover films through visual storytelling, curated collections,
          and the places where they were made.
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            type="button"
            className="px-8 py-3.5 rounded-2xl text-[0.9375rem] font-medium text-white gradient-lavender hover:shadow-glow-lavender transition-shadow duration-[400ms] active:scale-[0.97] transform"
          >
            Start exploring
          </button>
          <button
            type="button"
            className="px-8 py-3.5 rounded-2xl text-[0.9375rem] font-medium text-text-secondary border border-border-primary hover:border-lavender-300 hover:text-text-primary transition-all duration-[250ms]"
          >
            Watch trailer
          </button>
        </motion.div>
      </section>

      {/* Design System Preview */}
      <section className="container-frame section-padding">
        <motion.div
          variants={fadeUp}
          className="card-surface p-8 md:p-12"
        >
          <h6 className="mb-8">Design System Active</h6>

          {/* Color Swatches */}
          <div className="mb-10">
            <p className="text-caption-style mb-4">Color Palette</p>
            <div className="flex flex-wrap gap-3">
              {[
                { name: "Lavender 50", cls: "bg-lavender-50" },
                { name: "Lavender 100", cls: "bg-lavender-100" },
                { name: "Lavender 200", cls: "bg-lavender-200" },
                { name: "Lavender 300", cls: "bg-lavender-300" },
                { name: "Lavender 400", cls: "bg-lavender-400" },
                { name: "Lavender 500", cls: "bg-lavender-500" },
                { name: "Lavender 600", cls: "bg-lavender-600" },
                { name: "Pink 200", cls: "bg-pink-200" },
                { name: "Pink 400", cls: "bg-pink-400" },
                { name: "Warm 100", cls: "bg-warm-100" },
              ].map((swatch) => (
                <div key={swatch.name} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-xl ${swatch.cls} shadow-xs border border-white/40`}
                    title={swatch.name}
                  />
                  <span className="text-[0.625rem] text-text-muted">
                    {swatch.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="mb-10">
            <p className="text-caption-style mb-4">Typography Scale</p>
            <div className="space-y-3">
              <h1 className="text-display-2xl">Display 2XL</h1>
              <h2>Heading H2</h2>
              <h3>Heading H3</h3>
              <h4>Heading H4</h4>
              <p className="text-body-lg">Body large — The quick brown fox jumps over the lazy dog.</p>
              <p>Body medium — Film is a powerful medium for visual storytelling.</p>
              <small>Small caption text for metadata and labels.</small>
            </div>
          </div>

          {/* Spacing & Components */}
          <div>
            <p className="text-caption-style mb-4">Interactive Elements</p>
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-6 py-3 rounded-xl gradient-lavender text-white text-[0.875rem] font-medium hover-glow cursor-pointer">
                Primary Action
              </div>
              <div className="px-6 py-3 rounded-xl border border-border-primary text-text-secondary text-[0.875rem] font-medium hover:border-lavender-300 transition-base cursor-pointer">
                Secondary
              </div>
              <div className="px-6 py-3 rounded-xl glass text-text-secondary text-[0.875rem] font-medium cursor-pointer">
                Glass
              </div>
              <div className="w-48 h-10 rounded-xl shimmer" />
            </div>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
