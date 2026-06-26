"use client";
 
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MOOD_DEFINITIONS } from "@/services/curated-collections";
 
export function MoodSection() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/movies?type=mood-counts");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const countMap: Record<string, number> = {};
            data.forEach((item: { id: string; count: number }) => {
              countMap[item.id] = item.count;
            });
            setCounts(countMap);
          }
        }
      } catch (err) {
        console.error("Failed to fetch mood counts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);
 
  return (
    <section
      className="relative section-padding overflow-hidden bg-[#0e0d0b]"
      aria-label="Explore by mood"
    >
      <div className="container-frame relative">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-overline-style block mb-3 text-[rgba(232,226,217,0.4)]">
            Mood Discovery
          </span>
          <h2 className="font-display italic font-normal text-[2.25rem] sm:text-[3rem] text-[#e8e2d9] tracking-tight leading-tight mb-4">
            How do you want to feel tonight?
          </h2>
          <p className="mt-4 font-sans text-xs md:text-sm tracking-wider uppercase text-[rgba(232,226,217,0.4)]">
            Every emotion has a film. Let your mood guide the archive.
          </p>
        </div>
 
        {/* Grid of Flat Dark Rectangular Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {MOOD_DEFINITIONS.map((mood, index) => {
            const filmCount = counts[mood.id] || 350;
            return (
              <motion.div
                key={mood.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link href={`/discover?mood=${mood.id}`} className="block h-full">
                  <div className="group flex flex-col justify-between p-6 bg-[#161410] border border-white/5 rounded-none text-left transition-all duration-300 hover:border-[#e8d5b0]/25 hover:bg-[#1e1c18] min-h-[160px] cursor-pointer">
                    <div>
                      {/* Film count in small uppercase tracking */}
                      <span className="text-[0.6875rem] font-sans font-normal text-[rgba(232,226,217,0.4)] tracking-[0.2em] uppercase block mb-3">
                        {loading ? "Counting..." : `${filmCount} FILMS`}
                      </span>
                      {/* Mood name in Playfair italic */}
                      <h3 className="font-display italic font-normal text-[1.5rem] md:text-[1.75rem] text-[#e8d5b0] leading-none mb-2">
                        {mood.name}
                      </h3>
                    </div>
                    {/* Descriptor */}
                    <p className="text-[0.8125rem] font-sans font-light text-[rgba(232,226,217,0.4)] group-hover:text-[rgba(232,226,217,0.6)] transition-colors">
                      {mood.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
