"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Clapperboard,
  Earth,
  Film,
  Globe,
  Layers,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  X,
  Loader2,
} from "lucide-react";
import type { MapRef, MapViewport } from "@/components/ui";
import {
  Map,
  MapArc,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  useMap,
  CompactMovieCard,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { CURATED_MOVIE_LOCATIONS } from "./curated-locations";
import type { MovieLocation, MovieLocationKind } from "./types";
import { getCinemaLogs, type CinemaLog } from "@/lib/supabase";

const INITIAL_VIEWPORT: MapViewport = {
  center: [24, 30],
  zoom: 1.45,
  bearing: -18,
  pitch: 58,
};

const KIND_LABELS: Record<MovieLocationKind, string> = {
  primary: "Primary shoot",
  landmark: "Landmark",
  studio: "Studio",
  landscape: "Landscape",
};

const KIND_STYLES: Record<MovieLocationKind, string> = {
  primary: "border-[#e8d5b0] bg-[#e8d5b0]",
  landmark: "border-[#e8d5b0] bg-[#e8d5b0]/80",
  studio: "border-[#e8d5b0] bg-[#e8d5b0]/60",
  landscape: "border-[#e8d5b0] bg-[#e8d5b0]/40",
};

// Popular cinema regions for quick-access exploration
const POPULAR_CINEMA_REGIONS: { code: string; name: string; label: string }[] = [
  { code: "US", name: "United States", label: "Hollywood" },
  { code: "IN", name: "India", label: "Bollywood / Indian Cinema" },
  { code: "KR", name: "South Korea", label: "Korean Cinema" },
  { code: "JP", name: "Japan", label: "Japanese Cinema" },
  { code: "FR", name: "France", label: "French Cinema" },
  { code: "GB", name: "United Kingdom", label: "British Cinema" },
  { code: "IT", name: "Italy", label: "Italian Cinema" },
  { code: "DE", name: "Germany", label: "German Cinema" },
  { code: "ES", name: "Spain", label: "Spanish Cinema" },
  { code: "MX", name: "Mexico", label: "Mexican Cinema" },
  { code: "BR", name: "Brazil", label: "Brazilian Cinema" },
  { code: "CN", name: "China", label: "Chinese Cinema" },
  { code: "HK", name: "Hong Kong", label: "Hong Kong Cinema" },
  { code: "AU", name: "Australia", label: "Australian Cinema" },
  { code: "IR", name: "Iran", label: "Iranian Cinema" },
  { code: "NG", name: "Nigeria", label: "Nollywood" },
  { code: "SE", name: "Sweden", label: "Swedish Cinema" },
  { code: "DK", name: "Denmark", label: "Danish Cinema" },
  { code: "TH", name: "Thailand", label: "Thai Cinema" },
  { code: "AR", name: "Argentina", label: "Argentine Cinema" },
  { code: "RU", name: "Russia", label: "Russian Cinema" },
  { code: "TW", name: "Taiwan", label: "Taiwanese Cinema" },
  { code: "PL", name: "Poland", label: "Polish Cinema" },
  { code: "TR", name: "Turkey", label: "Turkish Cinema" },
];

/** Convert ISO 3166-1 alpha-2 code to flag emoji */
function codeToFlag(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...Array.from(upper).map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );
}

export function AtlasPage() {
  const mapRef = useRef<MapRef | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MovieLocation>(
    CURATED_MOVIE_LOCATIONS[0],
  );
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [viewport, setViewport] = useState<MapViewport>(INITIAL_VIEWPORT);
  const [logs, setLogs] = useState<CinemaLog[]>([]);
  const [activeTab, setActiveTab] = useState<"curated" | "explore">("curated");

  // Country Exploration States
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(null);
  const [countryMovies, setCountryMovies] = useState<any[]>([]);
  const [loadingCountryMovies, setLoadingCountryMovies] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  const cacheRef = useRef<Record<string, any[]>>({});

  useEffect(() => {
    getCinemaLogs().then(setLogs).catch(console.error);
  }, []);

  const watchedCountryCodes = useMemo(() => {
    const codes = new Set<string>();
    logs.forEach((log) => {
      if (log.production_countries) {
        log.production_countries.forEach((countryName) => {
          const iso = COUNTRY_NAME_TO_ISO[countryName];
          if (iso) {
            codes.add(iso);
          } else if (countryName.length === 2) {
            codes.add(countryName.toUpperCase());
          }
        });
      }
    });
    return codes;
  }, [logs]);

  const userCountryMovies = useMemo(() => {
    if (!selectedCountryName && !selectedCountryCode) return [];
    return logs.filter((log) => {
      if (!log.production_countries) return false;
      return log.production_countries.some((cName) => {
        const iso = COUNTRY_NAME_TO_ISO[cName];
        return iso === selectedCountryCode || cName.toLowerCase() === selectedCountryName?.toLowerCase();
      });
    });
  }, [logs, selectedCountryCode, selectedCountryName]);

  // Filter popular cinema regions by search query
  const filteredRegions = useMemo(() => {
    if (!countrySearch.trim()) return POPULAR_CINEMA_REGIONS;
    const q = countrySearch.toLowerCase();
    return POPULAR_CINEMA_REGIONS.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  const handleCountryClick = useCallback(async (code: string, name: string) => {
    setSelectedCountryCode(code);
    setSelectedCountryName(name);
    setLoadingCountryMovies(true);

    // Zoom/pan to country center
    const center = COUNTRY_CENTERS[code];
    if (center) {
      mapRef.current?.flyTo({
        center,
        zoom: 3.5,
        pitch: 45,
        bearing: 0,
        duration: 1500,
        essential: true,
      });
    }

    if (cacheRef.current[code]) {
      setCountryMovies(cacheRef.current[code]);
      setLoadingCountryMovies(false);
      return;
    }

    try {
      const res = await fetch(`/api/movies?type=country&code=${code}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        cacheRef.current[code] = data;
        setCountryMovies(data);
      } else {
        setCountryMovies([]);
      }
    } catch (err) {
      console.error("Failed to fetch country movies", err);
      setCountryMovies([]);
    } finally {
      setLoadingCountryMovies(false);
    }
  }, []);

  const arcs = useMemo(
    () =>
      CURATED_MOVIE_LOCATIONS.map((location) => ({
        id: location.id,
        from: [0, 20] as [number, number],
        to: location.coordinates,
        movieTitle: location.movieTitle,
      })),
    [],
  );

  const activeLocation =
    CURATED_MOVIE_LOCATIONS.find((location) => location.id === hoveredLocation) ??
    selectedLocation;

  const flyToLocation = (location: MovieLocation) => {
    setSelectedLocation(location);
    mapRef.current?.flyTo({
      center: location.coordinates,
      zoom: 9.7,
      pitch: 64,
      bearing: -24,
      duration: 1800,
      essential: true,
    });
  };

  return (
    <section className="relative h-dvh min-h-[620px] overflow-hidden bg-[#0e0d0b] text-[#e8e2d9]">
      <div className="absolute inset-0">
        <Map
          ref={mapRef}
          theme="dark"
          className="h-full w-full"
          viewport={INITIAL_VIEWPORT}
          onViewportChange={setViewport}
          projection={{ type: "globe" }}
          maxZoom={16}
          minZoom={1}
          pitchWithRotate
          dragRotate
          doubleClickZoom
          attributionControl={false}
        >
          {activeTab === "curated" && (
            <MapArc
              id="atlas-storylines"
              data={arcs}
              curvature={0.16}
              paint={{
                "line-color": "#f7c873",
                "line-width": 1.5,
                "line-opacity": 0.36,
              }}
              hoverPaint={{
                "line-color": "#ffffff",
                "line-width": 3,
                "line-opacity": 0.86,
              }}
            />
          )}

          {activeTab === "curated" &&
            CURATED_MOVIE_LOCATIONS.map((location) => {
              const isSelected = selectedLocation.id === location.id;
              const isHovered = hoveredLocation === location.id;

              return (
                <MapMarker
                  key={location.id}
                  longitude={location.coordinates[0]}
                  latitude={location.coordinates[1]}
                  onClick={() => flyToLocation(location)}
                  onMouseEnter={() => setHoveredLocation(location.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  <MarkerContent>
                    <button
                      type="button"
                      aria-label={`Open ${location.movieTitle} location panel`}
                      className="group relative grid size-11 place-items-center"
                    >
                      <span
                        className={cn(
                          "absolute size-11 rounded-full border opacity-30 blur-[1px] transition duration-500 group-hover:scale-125",
                          KIND_STYLES[location.kind],
                          (isSelected || isHovered) && "scale-125 opacity-50",
                        )}
                      />
                      <span
                        className={cn(
                          "relative grid size-5 place-items-center rounded-full border-2 border-white shadow-[0_0_28px_rgba(255,255,255,0.42)] transition duration-300",
                          KIND_STYLES[location.kind],
                          (isSelected || isHovered) && "scale-125",
                        )}
                      >
                        <span className="size-1.5 rounded-full bg-[#101018]" />
                      </span>
                    </button>
                  </MarkerContent>
                  <MarkerTooltip className="border border-white/10 bg-[#101018]/90 px-3 py-2 text-white shadow-2xl backdrop-blur-xl">
                    <span className="block text-[11px] font-semibold">
                      {location.movieTitle}
                    </span>
                    <span className="block text-[10px] text-white/60">
                      {location.locationName}
                    </span>
                  </MarkerTooltip>
                </MapMarker>
              );
            })}

          <CountryLayer
            active={activeTab === "explore"}
            onCountryClick={handleCountryClick}
            watchedCountries={watchedCountryCodes}
            selectedCountryCode={selectedCountryCode}
            hoveredCountryCode={hoveredCountryCode}
            setHoveredCountryCode={setHoveredCountryCode}
          />

          <MapControls
            position="bottom-right"
            showCompass
            showFullscreen
            className="right-4 bottom-5 [&_button]:bg-[#12131d]/85 [&_button]:text-white [&_button]:backdrop-blur-xl [&>div]:border-white/15 [&>div]:bg-transparent"
          />
        </Map>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0%,rgba(8,8,18,0.14)_44%,rgba(8,8,18,0.76)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#080812]/85 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#080812]/70 via-transparent to-[#080812]/55 md:w-2/3" />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-20 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3">
          <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-white/12 bg-[#101018]/70 px-3 py-2 shadow-2xl backdrop-blur-2xl">
            <div className="grid size-9 place-items-center rounded-md bg-white text-[#101018]">
              <Earth className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/50">
                Frame
              </p>
              <h1 className="font-display text-[1.15rem] font-semibold leading-none tracking-normal text-white">
                Atlas
              </h1>
            </div>
          </div>

          <div className="pointer-events-auto hidden items-center gap-2 rounded-lg border border-white/12 bg-[#101018]/62 px-3 py-2 text-sm text-white/72 shadow-2xl backdrop-blur-2xl md:flex">
            <Search className="size-4 text-white/45" />
            <span>Cinematic locations</span>
            <span className="h-4 w-px bg-white/12" />
            <Globe className="size-4 text-[#f8d36a]" />
            <span>All countries · Click to explore</span>
          </div>
        </div>
      </header>

      <aside className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 sm:bottom-5 sm:left-6 sm:right-auto sm:w-[360px] lg:top-24 lg:bottom-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto rounded-lg border border-white/12 bg-[#101018]/76 p-3 shadow-2xl backdrop-blur-2xl"
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3 shrink-0">
            <Sparkles className="size-4 text-[#f8d36a]" />
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/56">
              Cinematic coordinates
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex p-0.5 rounded-none bg-white/5 border border-white/10 mb-3 select-none">
            <button
              type="button"
              onClick={() => setActiveTab("curated")}
              className={cn(
                "flex-1 py-1.5 rounded-none text-[9px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer",
                activeTab === "curated"
                  ? "bg-[#1e1c18] border border-[#e8d5b0]/20 text-[#e8d5b0]"
                  : "text-white/60 hover:text-white"
              )}
            >
              Shoot Locations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("explore")}
              className={cn(
                "flex-1 py-1.5 rounded-none text-[9px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer",
                activeTab === "explore"
                  ? "bg-[#1e1c18] border border-[#e8d5b0]/20 text-[#e8d5b0]"
                  : "text-white/60 hover:text-white"
              )}
            >
              Explore Countries
            </button>
          </div>

          {activeTab === "curated" ? (
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
              {CURATED_MOVIE_LOCATIONS.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => flyToLocation(location)}
                  onMouseEnter={() => setHoveredLocation(location.id)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-md border p-2 text-left transition duration-300",
                    selectedLocation.id === location.id
                      ? "border-white/24 bg-white/12"
                      : "border-transparent hover:border-white/12 hover:bg-white/8",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-md text-[#101018]",
                      KIND_STYLES[location.kind],
                    )}
                  >
                    <MapPin className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">
                      {location.movieTitle}
                    </span>
                    <span className="block truncate text-xs text-white/52">
                      {location.city}, {location.country}
                    </span>
                  </span>
                  <ChevronRight className="size-4 text-white/35 transition group-hover:translate-x-0.5 group-hover:text-white/80" />
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
              {/* Country Search Input */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search countries..."
                  className="w-full bg-white/5 border border-white/10 rounded-none py-2 pl-8 pr-3 text-[12px] text-white placeholder:text-white/30 outline-none focus:border-[#e8d5b0]/40 transition-colors"
                />
              </div>

              {/* Selected country indicator */}
              {selectedCountryCode && (
                <div className="flex items-center gap-2 px-2 py-1.5 bg-[#1e1c18] border border-[#e8d5b0]/20 text-[11px]">
                  <span className="text-sm">{codeToFlag(selectedCountryCode)}</span>
                  <span className="font-semibold text-[#e8d5b0] flex-1 truncate">
                    {selectedCountryName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCountryCode(null);
                      setSelectedCountryName(null);
                      setCountryMovies([]);
                    }}
                    className="text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}

              {/* Quick hint */}
              <p className="text-[10px] text-white/35 uppercase tracking-wider font-sans px-0.5">
                Click any country on the map · or choose below
              </p>

              {/* Popular Cinema Regions */}
              <div className="space-y-1">
                {filteredRegions.map((region) => {
                  const isSelected = selectedCountryCode === region.code;
                  return (
                    <button
                      key={region.code}
                      type="button"
                      onClick={() => handleCountryClick(region.code, region.name)}
                      className={cn(
                        "w-full text-left flex items-center gap-2.5 p-2 rounded-none bg-white/[0.03] border transition-all cursor-pointer group",
                        isSelected
                          ? "border-[#e8d5b0]/40 bg-[#1e1c18]"
                          : "border-white/5 hover:border-[#e8d5b0]/20 hover:bg-white/[0.06]"
                      )}
                    >
                      <span className="text-sm leading-none">{codeToFlag(region.code)}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[12px] font-semibold text-white truncate">
                          {region.name}
                        </span>
                        <span className="block text-[10px] text-white/40 truncate">
                          {region.label}
                        </span>
                      </span>
                      <ChevronRight className="size-3.5 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/60" />
                    </button>
                  );
                })}

                {filteredRegions.length === 0 && countrySearch.trim() && (
                  <p className="text-[11px] text-white/35 text-center py-4 font-display italic">
                    No matching regions — try clicking the map directly
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </aside>

      <AnimatePresence mode="wait">
        {activeTab === "curated" ? (
          <motion.aside
            key={selectedLocation.id}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute right-4 top-[86px] z-20 hidden w-[390px] lg:block"
          >
            <MovieInfoPanel
              location={selectedLocation}
              onClose={() => {
                mapRef.current?.flyTo({
                  ...INITIAL_VIEWPORT,
                  duration: 1500,
                  essential: true,
                });
              }}
            />
          </motion.aside>
        ) : (
          <motion.aside
            key={selectedCountryCode || "empty-country"}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 18 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute right-4 top-[86px] z-20 hidden w-[390px] lg:block"
          >
            <CountryInfoPanel
              countryCode={selectedCountryCode}
              countryName={selectedCountryName}
              movies={countryMovies}
              userMovies={userCountryMovies}
              loading={loadingCountryMovies}
              onClose={() => {
                setSelectedCountryCode(null);
                setSelectedCountryName(null);
                setCountryMovies([]);
                mapRef.current?.flyTo({
                  ...INITIAL_VIEWPORT,
                  duration: 1500,
                  essential: true,
                });
              }}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="pointer-events-auto absolute bottom-4 right-4 z-20 hidden rounded-lg border border-white/12 bg-[#101018]/72 px-3 py-2 text-xs text-white/58 shadow-2xl backdrop-blur-2xl sm:block lg:right-[430px]">
        <div className="flex items-center gap-2">
          <Navigation className="size-3.5 text-[#75d6ff]" />
          <span>{viewport.zoom.toFixed(2)}x</span>
          <span className="h-3 w-px bg-white/12" />
          <span>Pitch {Math.round(viewport.pitch)} deg</span>
          <span className="h-3 w-px bg-white/12" />
          <span>Bearing {Math.round(viewport.bearing)} deg</span>
        </div>
      </div>

      <div className="pointer-events-auto absolute inset-x-4 top-[86px] z-20 lg:hidden">
        {activeTab === "curated" ? (
          <MovieInfoPanel location={activeLocation} compact />
        ) : (
          <CountryInfoPanel
            countryCode={selectedCountryCode}
            countryName={selectedCountryName}
            movies={countryMovies}
            userMovies={userCountryMovies}
            loading={loadingCountryMovies}
            compact
            onClose={() => {
              setSelectedCountryCode(null);
              setSelectedCountryName(null);
              setCountryMovies([]);
            }}
          />
        )}
      </div>
    </section>
  );
}

function MovieInfoPanel({
  location,
  compact = false,
  onClose,
}: {
  location: MovieLocation;
  compact?: boolean;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "pointer-events-auto overflow-hidden rounded-lg border border-white/12 bg-[#101018]/78 shadow-2xl backdrop-blur-2xl",
        compact ? "max-h-[188px]" : "min-h-[560px]",
      )}
    >
      <div className={cn("relative", compact ? "hidden" : "block h-56")}>
        <Image
          src={location.poster}
          alt={`${location.movieTitle} poster`}
          fill
          sizes="390px"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#101018] via-[#101018]/20 to-transparent" />
        {onClose && (
          <button
            type="button"
            aria-label="Reset Atlas view"
            onClick={onClose}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-md border border-white/15 bg-[#101018]/60 text-white backdrop-blur-xl transition hover:bg-white/15"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className={cn("p-4", compact ? "space-y-3" : "space-y-5")}>
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-md px-2 py-1 text-[11px] font-semibold text-[#101018]",
                KIND_STYLES[location.kind],
              )}
            >
              {KIND_LABELS[location.kind]}
            </span>
            <span className="rounded-md border border-white/12 px-2 py-1 text-[11px] text-white/58">
              CURATED
            </span>
          </div>
          <h2 className="font-display text-2xl font-semibold leading-tight tracking-normal text-white">
            {location.movieTitle}
          </h2>
          <p className="mt-1 text-sm text-white/58">
            {location.year} / {location.genre} / {location.director}
          </p>
        </div>

        {!compact && (
          <>
            <p className="text-sm leading-6 text-white/68">{location.synopsis}</p>
            <div className="grid grid-cols-2 gap-2">
              <Metric icon={MapPin} label="Location" value={location.city} />
              <Metric icon={Film} label="Mood" value={location.mood} />
              <Metric
                icon={Clapperboard}
                label="Production"
                value={location.productionWindow}
              />
              <Metric
                icon={Earth}
                label="Coords"
                value={`${location.coordinates[1].toFixed(2)}, ${location.coordinates[0].toFixed(2)}`}
              />
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/42">
                Scene note
              </p>
              <p className="mt-2 text-sm leading-6 text-white/72">
                {location.scene}
              </p>
            </div>
          </>
        )}

        {compact && (
          <p className="line-clamp-2 text-sm leading-6 text-white/66">
            {location.locationName} / {location.scene}
          </p>
        )}
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-3">
      <Icon className="mb-3 size-4 text-[#f8d36a]" />
      <p className="text-[11px] uppercase tracking-[0.14em] text-white/38">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-white/82">{value}</p>
    </div>
  );
}

// ============================================================
// COUNTRY EXPLORATION EXTENSION
// ============================================================

export const getCountryName = (code: string): string => {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
};

export const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  "United States of America": "US",
  "United States": "US",
  "United Kingdom": "GB",
  "South Korea": "KR",
  "Korea (Republic of)": "KR",
  "Korea": "KR",
  "Japan": "JP",
  "France": "FR",
  "India": "IN",
  "Germany": "DE",
  "Canada": "CA",
  "Italy": "IT",
  "Spain": "ES",
  "Australia": "AU",
  "Mexico": "MX",
  "Brazil": "BR",
  "China": "CN",
  "Hong Kong": "HK",
  "Taiwan": "TW",
  "Denmark": "DK",
  "Sweden": "SE",
  "Norway": "NO",
  "Netherlands": "NL",
  "New Zealand": "NZ",
  "Russia": "RU",
  "Russian Federation": "RU",
  "Ireland": "IE",
  "Belgium": "BE",
  "Austria": "AT",
  "Switzerland": "CH",
  "Poland": "PL",
  "Iran": "IR",
  "Iran (Islamic Republic of)": "IR",
  "Turkey": "TR",
  "Argentina": "AR",
  "Chile": "CL",
  "Colombia": "CO",
  "South Africa": "ZA",
  "Nigeria": "NG",
  "Thailand": "TH",
  "Vietnam": "VN",
  "Singapore": "SG",
  "Philippines": "PH",
  "Mongolia": "MN",
};

export const COUNTRY_CENTERS: Record<string, [number, number]> = {
  // Americas
  "US": [-98, 38], "CA": [-95, 60], "MX": [-102, 23], "BR": [-55, -10],
  "AR": [-64, -34], "CL": [-71, -30], "CO": [-74, 4], "PE": [-76, -10],
  "VE": [-66, 8], "EC": [-78, -2], "BO": [-65, -17], "PY": [-58, -23],
  "UY": [-56, -33], "GY": [-59, 5], "SR": [-56, 4], "CU": [-80, 22],
  "JM": [-77, 18], "HT": [-72, 19], "DO": [-70, 19], "PR": [-66, 18],
  "TT": [-61, 10], "PA": [-80, 9], "CR": [-84, 10], "GT": [-90, 15],
  "HN": [-87, 15], "SV": [-89, 14], "NI": [-85, 13], "BZ": [-89, 17],
  // Europe
  "GB": [-2, 54], "FR": [2, 46], "DE": [10, 51], "IT": [12, 42],
  "ES": [-3, 40], "PT": [-8, 39], "NL": [5, 52], "BE": [4, 51],
  "CH": [8, 47], "AT": [14, 47], "PL": [20, 52], "CZ": [15, 50],
  "SK": [19, 49], "HU": [19, 47], "RO": [25, 46], "BG": [25, 43],
  "HR": [16, 45], "RS": [21, 44], "BA": [18, 44], "ME": [19, 43],
  "MK": [22, 41], "AL": [20, 41], "SI": [15, 46], "GR": [22, 39],
  "SE": [18, 62], "NO": [8, 60], "DK": [10, 56], "FI": [26, 64],
  "IS": [-19, 65], "IE": [-8, 53], "LT": [24, 56], "LV": [25, 57],
  "EE": [26, 59], "RU": [95, 60], "UA": [32, 49], "BY": [28, 54],
  "MD": [29, 47], "LU": [6, 50], "MT": [14, 36], "CY": [33, 35],
  // Asia
  "JP": [138, 36], "KR": [127, 36], "CN": [104, 35], "IN": [78, 21],
  "TW": [121, 24], "HK": [114, 22], "SG": [104, 1], "TH": [100, 15],
  "VN": [108, 16], "PH": [122, 12], "MY": [102, 4], "ID": [117, -2],
  "MM": [96, 22], "KH": [105, 13], "LA": [103, 18], "BD": [90, 24],
  "LK": [81, 7], "NP": [84, 28], "PK": [69, 30], "AF": [67, 34],
  "IR": [53, 32], "IQ": [44, 33], "SA": [45, 24], "AE": [54, 24],
  "QA": [51, 25], "KW": [48, 29], "OM": [56, 21], "YE": [48, 16],
  "JO": [36, 31], "LB": [36, 34], "SY": [38, 35], "IL": [35, 31],
  "PS": [35, 32], "TR": [35, 39], "GE": [44, 42], "AM": [45, 40],
  "AZ": [50, 41], "KZ": [67, 48], "UZ": [64, 41], "TM": [59, 39],
  "KG": [75, 42], "TJ": [69, 39], "MN": [104, 47], "BN": [115, 5],
  "KP": [127, 40], "BT": [90, 27],
  // Africa
  "ZA": [25, -29], "NG": [8, 10], "EG": [30, 27], "KE": [38, 1],
  "ET": [40, 9], "TZ": [35, -6], "GH": [-2, 8], "MA": [-5, 32],
  "DZ": [3, 28], "TN": [9, 34], "LY": [17, 27], "SD": [30, 16],
  "UG": [32, 1], "RW": [30, -2], "SN": [-14, 14], "CI": [-5, 7],
  "CM": [12, 6], "CD": [24, -3], "AO": [18, -12], "MZ": [35, -18],
  "MG": [47, -19], "ZW": [30, -20], "ZM": [28, -15], "BW": [24, -22],
  "NA": [19, -22], "MW": [34, -14], "ML": [-4, 17], "BF": [-2, 12],
  "NE": [8, 16], "TD": [19, 15], "GA": [12, -1], "CG": [16, -1],
  "MR": [-11, 20], "BJ": [2, 10], "TG": [1, 8], "LR": [-10, 6],
  "SL": [-12, 9], "GN": [-10, 11], "ER": [39, 15], "DJ": [43, 12],
  "SO": [46, 6], "MU": [57, -20], "LS": [29, -29], "SZ": [31, -27],
  "GM": [-16, 13], "GW": [-15, 12], "GQ": [10, 2], "ST": [7, 0],
  "CV": [-24, 16], "KM": [44, -12], "SC": [55, -5],
  // Oceania
  "AU": [133, -25], "NZ": [172, -41], "FJ": [178, -18], "PG": [147, -6],
  "WS": [-172, -14], "TO": [-175, -21], "VU": [167, -16],
};

interface CountryLayerProps {
  active: boolean;
  onCountryClick: (code: string, name: string) => void;
  watchedCountries: Set<string>;
  selectedCountryCode: string | null;
  hoveredCountryCode: string | null;
  setHoveredCountryCode: (code: string | null) => void;
}

function CountryLayer({
  active,
  onCountryClick,
  watchedCountries,
  selectedCountryCode,
  hoveredCountryCode,
  setHoveredCountryCode,
}: CountryLayerProps) {
  const { map, isLoaded } = useMap();

  // Store callbacks in refs so event handlers always access the latest version
  const onCountryClickRef = useRef(onCountryClick);
  const setHoveredRef = useRef(setHoveredCountryCode);
  useEffect(() => { onCountryClickRef.current = onCountryClick; }, [onCountryClick]);
  useEffect(() => { setHoveredRef.current = setHoveredCountryCode; }, [setHoveredCountryCode]);

  useEffect(() => {
    if (!map || !isLoaded) return;

    // Load source once
    if (!map.getSource("world-countries")) {
      map.addSource("world-countries", {
        type: "geojson",
        data: "https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson",
      });
    }

    // Add layers once
    if (!map.getLayer("countries-fill")) {
      map.addLayer({
        id: "countries-fill",
        type: "fill",
        source: "world-countries",
        paint: {
          "fill-color": [
            "case",
            ["==", ["get", "ISO3166-1-Alpha-2"], selectedCountryCode || ""],
            "#e8d5b0",
            ["in", ["get", "ISO3166-1-Alpha-2"], ["literal", Array.from(watchedCountries)]],
            "#d6c096",
            "#ffffff",
          ],
          "fill-opacity": [
            "case",
            ["==", ["get", "ISO3166-1-Alpha-2"], selectedCountryCode || ""],
            0.35,
            ["==", ["get", "ISO3166-1-Alpha-2"], hoveredCountryCode || ""],
            0.18,
            ["in", ["get", "ISO3166-1-Alpha-2"], ["literal", Array.from(watchedCountries)]],
            0.12,
            0.03,
          ],
        },
      });

      map.addLayer({
        id: "countries-line",
        type: "line",
        source: "world-countries",
        paint: {
          "line-color": [
            "case",
            ["==", ["get", "ISO3166-1-Alpha-2"], selectedCountryCode || ""],
            "#e8d5b0",
            ["==", ["get", "ISO3166-1-Alpha-2"], hoveredCountryCode || ""],
            "#ffffff",
            ["in", ["get", "ISO3166-1-Alpha-2"], ["literal", Array.from(watchedCountries)]],
            "#d6c096",
            "rgba(255, 255, 255, 0.08)",
          ],
          "line-width": [
            "case",
            ["==", ["get", "ISO3166-1-Alpha-2"], selectedCountryCode || ""],
            1.5,
            ["==", ["get", "ISO3166-1-Alpha-2"], hoveredCountryCode || ""],
            1.0,
            ["in", ["get", "ISO3166-1-Alpha-2"], ["literal", Array.from(watchedCountries)]],
            1.0,
            0.5,
          ],
        },
      });

      // Click event — uses ref so closure always has latest callback
      map.on("click", "countries-fill", (e) => {
        if (!e.features || e.features.length === 0) return;
        const feature = e.features[0];
        const code = feature.properties?.["ISO3166-1-Alpha-2"];
        const name = feature.properties?.name;
        if (code && name) {
          onCountryClickRef.current(code, name);
        }
      });

      // Mouse move/leave events for hover — uses ref
      map.on("mousemove", "countries-fill", (e) => {
        if (!e.features || e.features.length === 0) return;
        const code = e.features[0].properties?.["ISO3166-1-Alpha-2"];
        if (code) {
          setHoveredRef.current(code);
          map.getCanvas().style.cursor = "pointer";
        }
      });

      map.on("mouseleave", "countries-fill", () => {
        setHoveredRef.current(null);
        map.getCanvas().style.cursor = "";
      });
    }

    // Toggle layer visibility
    const visibility = active ? "visible" : "none";
    if (map.getLayer("countries-fill")) {
      map.setLayoutProperty("countries-fill", "visibility", visibility);
    }
    if (map.getLayer("countries-line")) {
      map.setLayoutProperty("countries-line", "visibility", visibility);
    }
  }, [map, isLoaded, active]);

  // Sync state changes with paint properties
  useEffect(() => {
    if (!map || !isLoaded || !map.getLayer("countries-fill")) return;

    map.setPaintProperty("countries-fill", "fill-color", [
      "case",
      ["==", ["get", "ISO3166-1-Alpha-2"], selectedCountryCode || ""],
      "#e8d5b0",
      ["in", ["get", "ISO3166-1-Alpha-2"], ["literal", Array.from(watchedCountries)]],
      "#d6c096",
      "#ffffff",
    ]);

    map.setPaintProperty("countries-fill", "fill-opacity", [
      "case",
      ["==", ["get", "ISO3166-1-Alpha-2"], selectedCountryCode || ""],
      0.35,
      ["==", ["get", "ISO3166-1-Alpha-2"], hoveredCountryCode || ""],
      0.18,
      ["in", ["get", "ISO3166-1-Alpha-2"], ["literal", Array.from(watchedCountries)]],
      0.12,
      0.03,
    ]);

    map.setPaintProperty("countries-line", "line-color", [
      "case",
      ["==", ["get", "ISO3166-1-Alpha-2"], selectedCountryCode || ""],
      "#e8d5b0",
      ["==", ["get", "ISO3166-1-Alpha-2"], hoveredCountryCode || ""],
      "#ffffff",
      ["in", ["get", "ISO3166-1-Alpha-2"], ["literal", Array.from(watchedCountries)]],
      "#d6c096",
      "rgba(255, 255, 255, 0.08)",
    ]);

    map.setPaintProperty("countries-line", "line-width", [
      "case",
      ["==", ["get", "ISO3166-1-Alpha-2"], selectedCountryCode || ""],
      1.5,
      ["==", ["get", "ISO3166-1-Alpha-2"], hoveredCountryCode || ""],
      1.0,
      ["in", ["get", "ISO3166-1-Alpha-2"], ["literal", Array.from(watchedCountries)]],
      1.0,
      0.5,
    ]);
  }, [map, isLoaded, selectedCountryCode, hoveredCountryCode, watchedCountries]);

  return null;
}

interface CountryInfoPanelProps {
  countryCode: string | null;
  countryName: string | null;
  movies: any[];
  userMovies: CinemaLog[];
  loading: boolean;
  compact?: boolean;
  onClose: () => void;
}

function CountryInfoPanel({
  countryCode,
  countryName,
  movies,
  userMovies,
  loading,
  compact = false,
  onClose,
}: CountryInfoPanelProps) {
  if (!countryCode || !countryName) {
    return (
      <div
        className={cn(
          "pointer-events-auto overflow-hidden rounded-lg border border-white/12 bg-[#101018]/78 p-6 shadow-2xl backdrop-blur-2xl text-center flex flex-col items-center justify-center",
          compact ? "max-h-[188px]" : "min-h-[560px]"
        )}
      >
        <Earth className="size-8 text-[#e8d5b0]/60 mb-3 animate-pulse" />
        <p className="font-display italic text-[#e8e2d9]/60 text-[0.9375rem] leading-relaxed">
          Select a country on the map to explore its cinematic vault
        </p>
      </div>
    );
  }

  // Format logged movies for compact card display
  const loggedMoviesFormatted: any[] = userMovies.map((log) => ({
    id: log.movie_id,
    title: log.title,
    year: log.release_year,
    rating: log.rating,
    genre: log.genres[0] || "Drama",
    director: log.director,
    poster: log.poster_path ? `https://image.tmdb.org/t/p/w342${log.poster_path}` : "",
    duration: "",
  }));

  const hasArchive = loggedMoviesFormatted.length > 0;
  const hasTrending = movies.length > 0;

  return (
    <div
      className={cn(
        "pointer-events-auto overflow-hidden rounded-lg border border-white/12 bg-[#101018]/78 shadow-2xl backdrop-blur-2xl flex flex-col",
        compact ? "max-h-[300px]" : "min-h-[560px] max-h-[75vh]"
      )}
    >
      {/* Header */}
      <div className="relative p-5 border-b border-white/10 shrink-0 select-none">
        <h2 className="font-display italic text-[1.5rem] font-normal leading-tight text-[#e8d5b0]">
          Films from {countryName}
        </h2>
        <p className="text-[10px] text-white/50 uppercase tracking-[0.16em] mt-1 font-sans">
          {countryCode} · {userMovies.length} ARCHIVED
        </p>
        <button
          type="button"
          aria-label="Close panel"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-md border border-white/15 bg-[#101018]/60 text-white backdrop-blur-xl transition hover:bg-white/15 cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="overflow-y-auto flex-grow p-5 space-y-6 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="size-6 text-[#e8d5b0] animate-spin mb-3" />
            <p className="text-xs text-white/50 uppercase tracking-widest font-sans">
              Fetching archive...
            </p>
          </div>
        ) : !hasArchive && !hasTrending ? (
          <div className="py-12 text-center select-none">
            <p className="font-display italic text-white/40 text-sm">
              No films found from this country yet
            </p>
          </div>
        ) : (
          <>
            {/* Archive Section */}
            {hasArchive && (
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 border-b border-white/5 pb-1.5 flex items-center gap-1.5 font-sans select-none">
                  <span className="text-[#e8d5b0]">✦</span> From your archive
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {loggedMoviesFormatted.map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
                      <CompactMovieCard movie={movie} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Section */}
            {hasTrending && (
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60 border-b border-white/5 pb-1.5 flex items-center gap-1.5 font-sans select-none">
                  <span className="text-[#e8d5b0]">✦</span> Trending now
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {movies.map((movie) => (
                    <Link key={movie.id} href={`/movie/${movie.id}`} className="block">
                      <CompactMovieCard movie={movie} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
