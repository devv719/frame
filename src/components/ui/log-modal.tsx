"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, Calendar, Loader2, Film } from "lucide-react";
import Image from "next/image";
import { logMovie } from "@/lib/supabase";
import { getPosterUrl } from "@/services/tmdb";

const MOODS = [
  { id: "Inspired", label: "✦ Inspired" },
  { id: "Heartbroken", label: "✦ Heartbroken" },
  { id: "Nostalgic", label: "✦ Nostalgic" },
  { id: "Disturbed", label: "✦ Disturbed" },
  { id: "Thoughtful", label: "✦ Thoughtful" },
  { id: "Happy", label: "✦ Happy" },
  { id: "Tense", label: "✦ Tense" },
  { id: "In awe", label: "✦ In awe" },
];

const MEDIA_TYPES = [
  { id: "movie", label: "Film" },
  { id: "series", label: "Series" },
  { id: "documentary", label: "Doc" },
  { id: "anime", label: "Anime" },
];

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LogModal({ isOpen, onClose, onSuccess }: LogModalProps) {
  const [step, setStep] = useState<"search" | "form">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Form State
  const [rating, setRating] = useState<number>(4.0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [selectedMood, setSelectedMood] = useState<string>("Thoughtful");
  const [favoriteScene, setFavoriteScene] = useState("");
  const [notes, setNotes] = useState("");
  const [watchedDate, setWatchedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [isRewatched, setIsRewatched] = useState(false);
  const [mediaType, setMediaType] = useState("movie");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(`/api/movies?type=search&query=${encodeURIComponent(query)}&limit=8`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setSearchError("Failed to search movies. Please try again.");
      }
    } catch (err) {
      console.error("Error searching movies:", err);
      setSearchError("Failed to search movies. Please check your connection.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 350);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const handleSelectMovie = async (movie: any) => {
    setIsLoadingDetails(true);
    try {
      const response = await fetch(`/api/movies?type=detail&id=${movie.id}`);
      if (response.ok) {
        const detail = await response.json();
        setSelectedMovie(detail);
        setStep("form");
      } else {
        setSelectedMovie({
          id: movie.id,
          title: movie.title,
          year: movie.year,
          director: movie.director || "Unknown Director",
          genre: movie.genre || "Drama",
          genres: [{ id: 0, name: movie.genre || "Drama" }],
          poster: movie.poster,
          backdrop: movie.backdrop || "",
        });
        setStep("form");
      }
    } catch (err) {
      console.error("Error fetching movie info:", err);
      setSelectedMovie(movie);
      setStep("form");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMovie) return;

    setIsSubmitting(true);
    try {
      const genreNames = selectedMovie.genres
        ? selectedMovie.genres.map((g: any) => g.name)
        : [selectedMovie.genre || "Drama"];

      // Extract raw path for Supabase storage
      const posterPath = selectedMovie.poster
        ? selectedMovie.poster.includes("/t/p/")
          ? "/" + selectedMovie.poster.split("/t/p/")[1].split("/").slice(1).join("/")
          : selectedMovie.poster
        : "";

      const backdropPath = selectedMovie.backdrop
        ? selectedMovie.backdrop.includes("/t/p/")
          ? "/" + selectedMovie.backdrop.split("/t/p/")[1].split("/").slice(1).join("/")
          : selectedMovie.backdrop
        : "";

      await logMovie({
        movie_id: selectedMovie.id,
        title: selectedMovie.title,
        poster_path: posterPath,
        backdrop_path: backdropPath,
        release_year: selectedMovie.year,
        director: selectedMovie.director || "Unknown Director",
        genres: genreNames,
        watched_at: watchedDate,
        rating: rating,
        mood: selectedMood,
        favorite_scene: favoriteScene,
        notes: notes,
        rewatched: isRewatched,
        media_type: mediaType,
        production_countries: selectedMovie.production_countries || [],
      });

      // Clear states
      setSearchQuery("");
      setSearchResults([]);
      setFavoriteScene("");
      setNotes("");
      setIsRewatched(false);
      setStep("search");
      setSelectedMovie(null);
      
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to log watch:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep("search");
    setSelectedMovie(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 select-none">
          {/* Flat Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80"
          />

          {/* Modal Container (Criterion Charcoal Booklet) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-hidden bg-[#0e0d0b] border border-[#292524] rounded-none shadow-2xl flex flex-col z-[1010]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#292524] shrink-0">
              <div>
                <h3 className="text-[1.125rem] font-sans font-medium uppercase tracking-[0.15em] text-[#e8d5b0]">
                  {step === "search" ? "Archive a Watch" : "Document Memory"}
                </h3>
                <p className="text-[0.75rem] text-[#a8a29e] mt-1 tracking-wide">
                  {step === "search"
                    ? "Log a film, series, or documentary in your private vault."
                    : `Directed by ${selectedMovie?.director || "Unknown Director"} (${selectedMovie?.year})`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 text-[#a8a29e] hover:text-[#e8d5b0] transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-grow p-6">
              {step === "search" ? (
                <div className="flex flex-col gap-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716c]" size={16} />
                    <input
                      type="text"
                      placeholder="SEARCH FILMS BY TITLE..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-10 py-3 bg-[#151412] border border-[#292524] focus:border-[#e8d5b0] focus:outline-none text-[0.8125rem] tracking-wider text-[#f4f2ed] uppercase transition-all placeholder-[#78716c]"
                      autoFocus
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#e8d5b0]" size={16} />
                    )}
                  </div>

                  {/* Dropdown list of results showing w92 images */}
                  <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto pr-1">
                    <AnimatePresence mode="popLayout">
                      {searchResults.length > 0 ? (
                        searchResults.map((movie) => (
                          <motion.button
                            key={movie.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            onClick={() => handleSelectMovie(movie)}
                            disabled={isLoadingDetails}
                            className="flex items-center gap-4 p-2.5 border border-[#292524]/40 bg-[#151412]/50 hover:bg-[#1c1a18] hover:border-[#e8d5b0]/40 transition-all text-left w-full group"
                          >
                            <div className="relative w-10 aspect-[2/3] overflow-hidden bg-black shrink-0 border border-[#292524]">
                              {movie.poster ? (
                                <Image
                                  src={getPosterUrl(movie.poster, "w92")}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  unoptimized
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[#78716c]">
                                  <Film size={14} />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-[0.875rem] font-sans font-medium text-[#f4f2ed] truncate group-hover:text-[#e8d5b0] transition-colors">
                                {movie.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1.5 text-[0.75rem] text-[#a8a29e] tracking-wide">
                                <span>{movie.year || "N/A"}</span>
                                {movie.director && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-[#3e3a38]" />
                                    <span className="truncate">Dir: {movie.director}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        ))
                      ) : searchError ? (
                        <div className="text-center py-8 flex flex-col items-center gap-3">
                          <p className="text-red-400/80 text-[0.8125rem] font-sans">
                            {searchError}
                          </p>
                          <button
                            type="button"
                            onClick={() => performSearch(searchQuery)}
                            className="px-3.5 py-1.5 border border-[#e8d5b0]/20 hover:border-[#e8d5b0]/40 text-[#e8d5b0] hover:text-[#f4f2ed] text-[0.75rem] uppercase tracking-wider font-sans font-medium transition-colors"
                          >
                            Retry Search
                          </button>
                        </div>
                      ) : searchQuery.trim() && !isSearching ? (
                        <div className="text-center py-8 text-[#a8a29e] text-[0.8125rem]">
                          No records found matching &ldquo;{searchQuery}&rdquo;.
                        </div>
                      ) : !searchQuery.trim() ? (
                        <div className="text-center py-16 text-[#78716c] flex flex-col items-center gap-3">
                          <Film size={28} className="text-[#3e3a38]" />
                          <p className="text-[0.75rem] max-w-xs leading-relaxed uppercase tracking-wider">
                            Enter a title to search and log a watched film.
                          </p>
                        </div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Selected Film Preview Card (uses w342) */}
                  <div className="flex gap-4 p-4 bg-[#151412] border border-[#292524]">
                    <div className="relative w-16 aspect-[2/3] overflow-hidden bg-black shrink-0 border border-[#292524] shadow-md">
                      {selectedMovie.poster ? (
                        <Image
                          src={getPosterUrl(selectedMovie.poster, "w342")}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[#78716c]">
                          <Film size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 select-none">
                        <span className="text-[0.625rem] font-bold px-2 py-0.5 border border-[#e8d5b0]/30 text-[#e8d5b0] uppercase tracking-wider">
                          {mediaType}
                        </span>
                        <span className="text-[0.75rem] text-[#a8a29e] tracking-wider">{selectedMovie.year}</span>
                      </div>
                      <h4 className="text-[1.0625rem] font-display italic text-[#f4f2ed] truncate mt-1">
                        {selectedMovie.title}
                      </h4>
                      <p className="text-[0.75rem] text-[#a8a29e] truncate mt-0.5">
                        Directed by {selectedMovie.director}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[0.75rem] text-[#e8d5b0] hover:underline uppercase tracking-widest font-semibold self-center"
                    >
                      Change
                    </button>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Media Type */}
                    <div>
                      <label className="block text-[0.75rem] font-semibold tracking-wider text-[#a8a29e] uppercase mb-2">
                        Media Type
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {MEDIA_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setMediaType(type.id)}
                            className={`py-2 text-[0.6875rem] font-medium tracking-wider uppercase border transition-all ${
                              mediaType === type.id
                                ? "bg-[#e8d5b0] border-[#e8d5b0] text-[#0e0d0b]"
                                : "bg-transparent border-[#292524] text-[#a8a29e] hover:border-[#78716c]"
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label htmlFor="watchedDate" className="block text-[0.75rem] font-semibold tracking-wider text-[#a8a29e] uppercase mb-2">
                        Date Watched
                      </label>
                      <input
                        type="date"
                        id="watchedDate"
                        value={watchedDate}
                        onChange={(e) => setWatchedDate(e.target.value)}
                        className="w-full px-3 py-2.5 bg-[#151412] border border-[#292524] focus:border-[#e8d5b0] focus:outline-none text-[0.75rem] text-[#f4f2ed] tracking-wider uppercase"
                      />
                    </div>
                  </div>

                  {/* Star Rating Input */}
                  <div>
                    <label className="block text-[0.75rem] font-semibold tracking-wider text-[#a8a29e] uppercase mb-2">
                      Star Rating ({rating.toFixed(1)} / 5.0)
                    </label>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const starValue = index + 1;
                        return (
                          <div
                            key={index}
                            className="relative cursor-pointer w-8 h-8 flex items-center justify-center"
                            onClick={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = e.clientX - rect.left;
                              const value = x < rect.width / 2 ? starValue - 0.5 : starValue;
                              setRating(value);
                            }}
                            onMouseMove={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = e.clientX - rect.left;
                              const value = x < rect.width / 2 ? starValue - 0.5 : starValue;
                              setHoveredRating(value);
                            }}
                            onMouseLeave={() => setHoveredRating(null)}
                          >
                            <Star
                              size={24}
                              className="text-[#1c1917] fill-[#1c1917] stroke-[#292524]"
                            />
                            <div
                              className="absolute top-0 left-0 overflow-hidden h-full pointer-events-none"
                              style={{
                                width: `${
                                  (hoveredRating !== null ? hoveredRating : rating) >= starValue
                                    ? 100
                                    : (hoveredRating !== null ? hoveredRating : rating) === starValue - 0.5
                                    ? 50
                                    : 0
                                }%`,
                              }}
                            >
                              <Star
                                size={24}
                                className="text-[#e8d5b0] fill-[#e8d5b0] stroke-[#e8d5b0]"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mood Selector (Flat pill buttons with ✦ prefix) */}
                  <div>
                    <label className="block text-[0.75rem] font-semibold tracking-wider text-[#a8a29e] uppercase mb-2">
                      Mood Profile Tag
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {MOODS.map((mood) => {
                        const isSelected = selectedMood === mood.id;
                        return (
                          <button
                            key={mood.id}
                            type="button"
                            onClick={() => setSelectedMood(mood.id)}
                            className={`px-3.5 py-1.5 text-[0.75rem] tracking-wider uppercase border transition-all ${
                              isSelected
                                ? "bg-[#e8d5b0] border-[#e8d5b0] text-[#0e0d0b] font-medium"
                                : "bg-transparent border-[#292524] text-[#a8a29e] hover:border-[#e8d5b0]/40 hover:text-[#f4f2ed]"
                            }`}
                          >
                            {mood.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Favorite Scene */}
                  <div>
                    <label htmlFor="favoriteScene" className="block text-[0.75rem] font-semibold tracking-wider text-[#a8a29e] uppercase mb-2">
                      Key Moment / Notable Scene
                    </label>
                    <input
                      type="text"
                      id="favoriteScene"
                      value={favoriteScene}
                      onChange={(e) => setFavoriteScene(e.target.value)}
                      placeholder="e.g. The library segment..."
                      className="w-full px-3 py-2.5 bg-[#151412] border border-[#292524] focus:border-[#e8d5b0] focus:outline-none text-[0.8125rem] text-[#f4f2ed]"
                    />
                  </div>

                  {/* Journal Note (Italic serif freeform textarea) */}
                  <div>
                    <label htmlFor="notes" className="block text-[0.75rem] font-semibold tracking-wider text-[#a8a29e] uppercase mb-2">
                      Private Reflection Note
                    </label>
                    <textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Write your personal annotations. Let your memories frame the page..."
                      rows={4}
                      className="w-full px-4 py-3 bg-[#151412] border border-[#292524] focus:border-[#e8d5b0] focus:outline-none text-[0.875rem] leading-relaxed text-[#f4f2ed] font-display italic"
                    />
                  </div>

                  {/* Rewatch */}
                  <div className="flex items-center gap-2 select-none self-start">
                    <input
                      type="checkbox"
                      id="rewatched"
                      checked={isRewatched}
                      onChange={(e) => setIsRewatched(e.target.checked)}
                      className="rounded border-[#292524] text-[#e8d5b0] focus:ring-[#e8d5b0] bg-[#151412] w-4 h-4 accent-[#e8d5b0]"
                    />
                    <label htmlFor="rewatched" className="text-[0.75rem] text-[#a8a29e] font-semibold uppercase tracking-wider cursor-pointer">
                      Mark as Rewatch
                    </label>
                  </div>

                  {/* Submit / Back */}
                  <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 text-[#a8a29e] hover:text-[#f4f2ed] text-[0.75rem] uppercase tracking-wider font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-3 bg-[#e8d5b0] text-[#0e0d0b] hover:bg-[#d6c096] text-[0.75rem] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Archiving...
                        </>
                      ) : (
                        "Archive this film"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
