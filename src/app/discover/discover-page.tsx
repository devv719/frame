"use client";
 
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Movie } from "@/components/ui/movie-card";
import { MOOD_DEFINITIONS } from "@/services/curated-collections";
 
interface Genre {
  id: number;
  name: string;
}
 
export function DiscoverPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedMoodId, setSelectedMoodId] = useState<string | null>(null);
  
  // Data State
  const [genres, setGenres] = useState<Genre[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [moodCounts, setMoodCounts] = useState<Record<string, number>>({});
  
  // Loading & Error States
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchQuery]);
 
  // Listen to search parameter updates from navigation
  useEffect(() => {
    const mood = searchParams.get("mood");
    if (mood) {
      setSelectedMoodId(mood);
      setSearchQuery("");
      setSelectedGenre(null);
    } else {
      setSelectedMoodId(null);
    }
  }, [searchParams]);
 
  // Initial Fetch: Genres and Mood Counts
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [genresRes, countsRes] = await Promise.all([
          fetch("/api/movies?type=genres"),
          fetch("/api/movies?type=mood-counts"),
        ]);
 
        if (!genresRes.ok) throw new Error("Failed to load genres.");
 
        const genresData = await genresRes.json();
        setGenres(genresData);
 
        if (countsRes.ok) {
          const countsData = await countsRes.json();
          if (Array.isArray(countsData)) {
            const countMap: Record<string, number> = {};
            countsData.forEach((item: { id: string; count: number }) => {
              countMap[item.id] = item.count;
            });
            setMoodCounts(countMap);
          }
        }
      } catch (err: any) {
        console.error(err);
        setError("Unable to load initial data.");
      } finally {
        setIsLoading(false);
      }
    };
 
    fetchInitialData();
  }, []);
 
  // Fetch search results, genre-filtered movies, or mood-filtered movies
  useEffect(() => {
    const fetchFilteredData = async () => {
      if (!debouncedQuery && !selectedGenre && !selectedMoodId) {
        setFilteredMovies([]);
        setIsFiltering(false);
        return;
      }
 
      setIsFiltering(true);
      setError(null);
 
      try {
        let endpoint = "";
        if (debouncedQuery) {
          endpoint = `/api/movies?type=search&query=${encodeURIComponent(debouncedQuery)}&limit=24`;
        } else if (selectedGenre) {
          endpoint = `/api/movies?type=genre&genreId=${selectedGenre.id}&limit=24`;
        } else if (selectedMoodId) {
          endpoint = `/api/movies?type=mood&moodId=${selectedMoodId}&limit=24`;
        }
 
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Failed to fetch movies.");
        
        const data = await res.json();
        if (selectedMoodId && !debouncedQuery && !selectedGenre) {
          setFilteredMovies(data.movies || []);
        } else {
          setFilteredMovies(data);
        }
      } catch (err: any) {
        console.error(err);
        setError("Error loading search results.");
      } finally {
        setIsFiltering(false);
      }
    };
 
    fetchFilteredData();
  }, [debouncedQuery, selectedGenre, selectedMoodId]);
 
  const handleGenreClick = (genre: Genre) => {
    setSearchQuery("");
    setSelectedMoodId(null);
    if (selectedGenre?.id === genre.id) {
      setSelectedGenre(null);
    } else {
      setSelectedGenre(genre);
    }
  };
 
  const handleMoodClick = (moodId: string) => {
    setSearchQuery("");
    setSelectedGenre(null);
    router.push(`/discover?mood=${moodId}`);
  };
 
  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedGenre(null);
    setSelectedMoodId(null);
    setFilteredMovies([]);
    router.push("/discover");
  };
 
  const isFilterActive = searchQuery || selectedGenre || selectedMoodId;
 
  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#e8e2d9] pb-24 pt-12 md:pt-16">
      <div className="container-frame">
        <AnimatePresence mode="wait">
          {!isFilterActive ? (
            <motion.div
              key="mood-grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              {/* Headline */}
              <h1 className="font-display italic font-normal text-center text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] tracking-tight max-w-3xl leading-tight mb-3">
                How do you want to feel tonight?
              </h1>
              
              <p className="font-sans text-[0.75rem] md:text-[0.8125rem] tracking-[0.15em] uppercase text-[rgba(232,226,217,0.4)] mb-12">
                A curated portal into the archives of cinema
              </p>
 
              {/* Minimal Dark Search Bar */}
              <div className="w-full max-w-xl mb-8 px-4">
                <div className="relative flex items-center bg-[#161410] border border-white/5 rounded-none focus-within:border-[#e8d5b0]/30 transition-colors">
                  <Search className="absolute left-4 size-4 text-[rgba(232,226,217,0.4)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search films, directors..."
                    aria-label="Search films by title or director"
                    className="w-full pl-11 pr-10 py-3.5 bg-transparent text-[0.875rem] text-[#e8e2d9] placeholder-[rgba(232,226,217,0.3)] focus:outline-none font-sans"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 p-1 text-[rgba(232,226,217,0.4)] hover:text-[#e8d5b0]"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>
 
              {/* Minimal Genre Pills */}
              <div className="w-full max-w-4xl mb-12 px-4 overflow-hidden">
                <div className="flex gap-2 justify-center flex-wrap">
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => handleGenreClick(genre)}
                      className={cn(
                        "px-4 py-2 text-[0.75rem] font-sans transition-all duration-300 border rounded-none",
                        (selectedGenre as Genre | null)?.id === genre.id
                          ? "border-[#e8d5b0] bg-[#e8d5b0] text-[#0e0d0b]"
                          : "border-white/5 bg-[#161410] text-[rgba(232,226,217,0.6)] hover:border-white/10 hover:text-[#e8e2d9]"
                      )}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* 6 Mood Cards As Dark Rectangular Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                {MOOD_DEFINITIONS.map((mood) => {
                  const count = moodCounts[mood.id] || 350;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodClick(mood.id)}
                      className="group flex flex-col justify-between p-6 bg-[#161410] border border-white/5 rounded-none text-left transition-all duration-300 hover:border-[#e8d5b0]/25 hover:bg-[#1e1c18] min-h-[160px] cursor-pointer"
                    >
                      <div>
                        {/* Film count badge in small uppercase tracking */}
                        <span className="text-[0.6875rem] font-sans font-normal text-[rgba(232,226,217,0.4)] tracking-[0.2em] uppercase block mb-3">
                          {count} films
                        </span>
                        {/* Mood Name in Playfair italic */}
                        <h3 className="font-display italic font-normal text-[1.5rem] md:text-[1.75rem] text-[#e8d5b0] leading-none mb-2">
                          {mood.name}
                        </h3>
                      </div>
                      {/* Small muted descriptor below */}
                      <p className="text-[0.8125rem] font-sans font-light text-[rgba(232,226,217,0.4)] group-hover:text-[rgba(232,226,217,0.6)] transition-colors">
                        {mood.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Results grid view when filter is active */
            <motion.div
              key="results-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5 max-w-5xl mx-auto">
                <h2 className="font-display italic font-normal text-[1.5rem] md:text-[2rem] text-[#e8e2d9]">
                  {debouncedQuery ? (
                    <>Search: <span className="text-[#e8d5b0]">{debouncedQuery}</span></>
                  ) : selectedGenre ? (
                    <>Category: <span className="text-[#e8d5b0]">{selectedGenre.name}</span></>
                  ) : (
                    <>Mood: <span className="text-[#e8d5b0]">{selectedMoodId ? selectedMoodId.charAt(0).toUpperCase() + selectedMoodId.slice(1) : ""}</span></>
                  )}
                </h2>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[0.75rem] font-sans font-medium text-[#e8d5b0] hover:text-[#d6c096] uppercase tracking-[0.15em] transition-colors"
                >
                  Clear filters
                </button>
              </div>
 
              {isFiltering ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="size-8 text-[#e8d5b0] animate-spin mb-4" />
                  <p className="text-[rgba(232,226,217,0.4)] text-[0.875rem]">Compiling visual archive...</p>
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center max-w-sm mx-auto">
                  <h4 className="text-[1.125rem] font-display italic text-[#e8e2d9] mb-2">No matching archive pieces</h4>
                  <p className="text-[rgba(232,226,217,0.4)] text-[0.875rem] mb-6 leading-relaxed">
                    We couldn&apos;t find anything matching your requirements. Try refining your selection.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="px-5 py-2.5 border border-white/10 hover:border-white/20 text-[#e8d5b0] font-sans text-[0.75rem] uppercase tracking-wider transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="max-w-5xl mx-auto">
                  <MasonryGrid movies={filteredMovies} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
 
function MasonryGrid({ movies }: { movies: Movie[] }) {
  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 gap-6 space-y-6 select-none">
      {movies.map((movie) => (
        <div key={movie.id} className="break-inside-avoid">
          <MasonryCard movie={movie} />
        </div>
      ))}
    </div>
  );
}
 
function MasonryCard({ movie }: { movie: Movie }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <motion.article
      layout
      className="group relative flex flex-col bg-[#161410] border border-white/5 hover:border-[#e8d5b0]/25 transition-all duration-300"
    >
      <Link href={`/movie/${movie.id}`} className="flex h-full flex-col">
        {/* Poster Image Container - upright, flat */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              className={cn(
                "object-cover transition-transform duration-700 group-hover:scale-101",
                loaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setLoaded(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#161410]">
              <span className="text-[1rem] font-display italic text-white/40 text-center leading-snug">
                {movie.title}
              </span>
            </div>
          )}
 
          {/* Flat Rating Badge */}
          {movie.poster && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 px-2 py-0.5 rounded-none bg-black/60 border border-white/10 text-[#e8e2d9] text-[0.6875rem] font-sans">
              <span className="text-amber-400">★</span>
              <span className="font-semibold">
                {typeof movie.rating === "number" ? movie.rating.toFixed(1) : movie.rating}
              </span>
            </div>
          )}
        </div>
 
        {/* Info Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h4 className="text-[0.9375rem] font-display italic font-normal text-[#e8e2d9] tracking-tight leading-snug group-hover:text-[#e8d5b0] transition-colors duration-250">
              {movie.title}
            </h4>
            <p className="text-[0.75rem] text-[rgba(232,226,217,0.4)] mt-1 font-sans">
              Directed by <span className="text-[rgba(232,226,217,0.7)]">{movie.director || "Unknown"}</span>
            </p>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <span className="text-[0.75rem] text-[#e8d5b0] font-sans font-light uppercase tracking-wider">{movie.year || "Unknown"}</span>
            <span className="text-[0.6875rem] text-[rgba(232,226,217,0.4)] font-sans uppercase tracking-widest">{movie.genre || "Drama"}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
