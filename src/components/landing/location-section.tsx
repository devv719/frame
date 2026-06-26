"use client";
 
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LOCATION_CARDS, type LocationCard as LocationCardType } from "@/services/curated-collections";
import { cn } from "@/lib/utils";
 
export function LocationSection() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const promises = LOCATION_CARDS.map(async (loc) => {
          try {
            const res = await fetch(`/api/movies?type=location-count&city=${encodeURIComponent(loc.city)}`);
            if (res.ok) {
              const data = await res.json();
              return { city: loc.city, count: data.count };
            }
          } catch (e) {
            console.error(`Error fetching count for ${loc.city}`, e);
          }
          return { city: loc.city, count: 0 };
        });
 
        const results = await Promise.all(promises);
        const countMap: Record<string, number> = {};
        results.forEach((item) => {
          countMap[item.city] = item.count;
        });
        setCounts(countMap);
      } catch (err) {
        console.error("Failed to fetch location counts", err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchCounts();
  }, []);
 
  return (
    <section
      className="relative section-padding overflow-hidden bg-[#0e0d0b]"
      aria-label="Explore by location"
    >
      <div className="container-frame relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 max-w-5xl mx-auto">
          <div>
            <span className="text-overline-style block mb-3 text-[rgba(232,226,217,0.4)]">
              Film Geography
            </span>
            <h2 className="font-display italic font-normal text-[2.25rem] sm:text-[3rem] text-[#e8e2d9] tracking-tight leading-tight">
              Cinema has no borders
            </h2>
          </div>
          <p className="max-w-sm text-[rgba(232,226,217,0.4)] text-[0.875rem] leading-relaxed font-sans">
            Trace the footsteps of your favorite films across continents and cultures.
          </p>
        </div>
 
        {/* Location Grid — Flat Dark Rectangular Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {LOCATION_CARDS.map((location, index) => (
            <LocationCard
              key={location.id}
              location={location}
              index={index}
              isTall={index === 1 || index === 4}
              filmCount={counts[location.city]}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
 
function LocationCard({
  location,
  index,
  isTall,
  filmCount,
  loading,
}: {
  location: LocationCardType;
  index: number;
  isTall: boolean;
  filmCount?: number;
  loading: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(isTall && "sm:row-span-2")}
    >
      <Link href="/atlas" className="block w-full h-full">
        <div
          className={cn(
            "group relative overflow-hidden rounded-none cursor-pointer p-6 md:p-8 flex flex-col justify-between text-left",
            "bg-[#161410] border border-white/5",
            "hover:border-[#e8d5b0]/25 hover:bg-[#1e1c18]",
            "transition-all duration-300",
            isTall ? "h-[280px] sm:h-full min-h-[280px]" : "h-[280px]"
          )}
        >
          {/* Top */}
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-none border border-white/5 flex items-center justify-center text-[#e8d5b0] bg-black/20">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <span className="text-[0.6875rem] font-mono text-[#e8d5b0] tracking-wider font-light">
              {location.coordinates}
            </span>
          </div>
 
          {/* Bottom */}
          <div>
            <span className="text-[0.6875rem] text-[rgba(232,226,217,0.4)] font-sans font-light tracking-[0.15em] uppercase block mb-1">
              {location.country}
            </span>
            <h3 className="font-display italic font-normal text-[#e8e2d9] text-[1.5rem] md:text-[1.75rem] leading-none mb-3">
              {location.city}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[0.75rem] font-sans font-light text-[rgba(232,226,217,0.4)]">
                {loading ? "Counting..." : filmCount !== undefined ? `${filmCount.toLocaleString()} FILMS` : "Explore"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
