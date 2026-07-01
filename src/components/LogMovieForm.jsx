"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Tag, X, Loader2, Calendar, Film } from "lucide-react";
import Image from "next/image";
import { getPosterUrl } from "../services/tmdb";
import { logToArchive } from "../services/archiveService";

/**
 * A premium, minimalist dark-mode form built with Tailwind CSS
 * for logging movies and reflective journals to the digital scrapbook.
 *
 * @param {object} props
 * @param {object} props.selectedMovie - Selected TMDB movie object (with title, poster_path, etc.)
 * @param {string} [props.userId="guest_cinephile"] - Unique identifier of the authenticated user
 * @param {function} [props.onSuccess] - Callback when the logging succeeds
 * @param {function} [props.onCancel] - Callback to handle cancel or backing out
 */
export default function LogMovieForm({
  selectedMovie,
  userId = "guest_cinephile",
  onSuccess,
  onCancel,
}) {
  // Form state fields
  const [rating, setRating] = useState(4.0);
  const [hoveredRating, setHoveredRating] = useState(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [locationWatched, setLocationWatched] = useState("");
  const [watchedDate, setWatchedDate] = useState(() => {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD format for local date inputs
  });
  
  // Tagging system state
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Suggest tags for quick addition
  const SUGGESTED_TAGS = ["Masterpiece", "First Watch", "Atmospheric", "Noir", "Criterion", "Visual Feast"];

  // Destructure TMDB movie details with robust fallback handling
  const title = selectedMovie?.title || selectedMovie?.name || "Untitled";
  const poster = selectedMovie?.poster_path || selectedMovie?.poster || null;
  const releaseYear = selectedMovie?.release_date
    ? new Date(selectedMovie.release_date).getFullYear().toString()
    : selectedMovie?.first_air_date
    ? new Date(selectedMovie.first_air_date).getFullYear().toString()
    : selectedMovie?.year || selectedMovie?.releaseYear || "N/A";
  const director = selectedMovie?.director || "Unknown Director";

  // Handle adding tag from input
  const addTag = (rawTag) => {
    const trimmed = rawTag.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMovie) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    // Format final journal data object to match logToArchive structure
    const userJournal = {
      userRating: rating,
      journalEntry,
      tags,
      locationWatched,
      watchedDate: new Date(watchedDate).toISOString(),
    };

    try {
      await logToArchive(userId, selectedMovie, userJournal);
      
      // Visual feedback timing: show success state, then run success callback
      setIsSuccessState(true);
      
      // Reset form states
      setJournalEntry("");
      setLocationWatched("");
      setTags([]);
      setRating(4.0);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
    } catch (err) {
      console.error("Error archiving movie log:", err);
      setErrorMsg("Failed to archive your story. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto bg-[#0A0A0A] border border-[#292524] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-[#f4f2ed] overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {isSuccessState ? (
          /* Premium Success State Screen */
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center p-12 text-center min-h-[480px] bg-[#0A0A0A]"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: [0, 1.15, 1], rotate: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-20 h-20 rounded-full border border-[#e8d5b0]/60 flex items-center justify-center mb-8 bg-[#121212] text-[#e8d5b0]"
            >
              <Film size={32} className="text-[#e8d5b0] animate-pulse" />
            </motion.div>
            
            <h3 className="text-2xl font-serif italic text-[#e8d5b0] tracking-wide mb-3">
              Memory Preserved
            </h3>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed tracking-wider mb-8 font-sans font-light">
              Your reflective journal for <span className="text-[#f4f2ed] italic font-serif">&ldquo;{title}&rdquo;</span> has been safely written into the digital atlas.
            </p>

            <span className="inline-block border-t border-[#292524] pt-4 px-6 text-[0.7rem] uppercase tracking-[0.25em] font-sans font-semibold text-[#e8d5b0]/60">
              Story successfully archived
            </span>
          </motion.div>
        ) : (
          /* Main Logging Form */
          <motion.form
            key="form-screen"
            onSubmit={handleSubmit}
            className="p-6 md:p-8 flex flex-col gap-6"
          >
            {/* Form Header / Close / Back */}
            <div className="flex items-center justify-between border-b border-[#292524] pb-4">
              <div>
                <h3 className="text-[1.1rem] font-sans font-medium uppercase tracking-[0.18em] text-[#e8d5b0]">
                  Log Cinema Memory
                </h3>
                <p className="text-[0.7rem] text-stone-500 tracking-wide mt-1 uppercase">
                  Log reflective journal entries and tag watch locations.
                </p>
              </div>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="p-1.5 text-stone-500 hover:text-[#e8d5b0] transition-colors rounded-full"
                  aria-label="Cancel"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Selected Film Preview Banner */}
            <div className="flex gap-5 p-4 bg-[#121212] border border-[#292524] relative overflow-hidden group">
              <div className="relative w-16 aspect-[2/3] overflow-hidden bg-black shrink-0 border border-[#292524] shadow-lg">
                {poster ? (
                  <Image
                    src={getPosterUrl(poster, "w342")}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="64px"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-700 bg-neutral-900">
                    <Film size={20} />
                  </div>
                )}
              </div>
              <div className="flex-grow min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[0.625rem] font-sans font-bold px-2 py-0.5 border border-[#e8d5b0]/30 text-[#e8d5b0] uppercase tracking-wider rounded-none">
                    Selected Film
                  </span>
                  <span className="text-[0.7rem] text-stone-500 tracking-wider font-semibold">{releaseYear}</span>
                </div>
                <h4 className="text-[1.25rem] font-serif italic text-stone-100 truncate pr-4">
                  {title}
                </h4>
                <p className="text-[0.75rem] text-stone-400 mt-0.5 font-sans font-light truncate">
                  Directed by <span className="font-medium text-stone-300">{director}</span>
                </p>
              </div>
            </div>

            {/* Form Fields Container */}
            <div className="flex flex-col gap-5">
              {/* Star Rating Selector */}
              <div>
                <div className="flex justify-between items-baseline mb-2">
                  <label className="block text-[0.75rem] font-sans font-bold tracking-widest text-[#a8a29e] uppercase">
                    Your Rating
                  </label>
                  <span className="text-[0.75rem] font-sans font-medium text-[#e8d5b0] tracking-widest">
                    {(hoveredRating !== null ? hoveredRating : rating).toFixed(1)} / 5.0
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <div
                        key={index}
                        className="relative cursor-pointer w-9 h-9 flex items-center justify-center"
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
                        {/* Background Empty Star */}
                        <Star
                          size={26}
                          className="text-[#1c1917] fill-[#1c1917] stroke-[#292524] transition-colors"
                        />
                        {/* Highlighted Fill Layer */}
                        <div
                          className="absolute top-0 left-0 overflow-hidden h-full pointer-events-none transition-all duration-75"
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
                            size={26}
                            className="text-[#e8d5b0] fill-[#e8d5b0] stroke-[#e8d5b0]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Journal Entry Textarea */}
              <div>
                <label className="block text-[0.75rem] font-sans font-bold tracking-widest text-[#a8a29e] uppercase mb-2">
                  Journal Reflection
                </label>
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder="Record your thoughts. How did this film impact you? Where did it take your mind?"
                  rows={5}
                  className="w-full px-4 py-3 bg-[#121212] border border-[#292524] focus:border-[#e8d5b0]/60 focus:ring-1 focus:ring-[#e8d5b0]/40 focus:outline-none text-[0.9rem] leading-relaxed text-[#f4f2ed] font-serif italic placeholder-stone-600 rounded-none transition-all"
                  required
                />
              </div>

              {/* Location Watched & Watched Date Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Location */}
                <div>
                  <label className="block text-[0.75rem] font-sans font-bold tracking-widest text-[#a8a29e] uppercase mb-2">
                    Location Watched
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="text"
                      value={locationWatched}
                      onChange={(e) => setLocationWatched(e.target.value)}
                      placeholder="e.g. Cinema Paris, Home"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#121212] border border-[#292524] focus:border-[#e8d5b0]/60 focus:ring-1 focus:ring-[#e8d5b0]/40 focus:outline-none text-[0.8rem] text-stone-100 placeholder-stone-600 rounded-none transition-all"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="watched-date" className="block text-[0.75rem] font-sans font-bold tracking-widest text-[#a8a29e] uppercase mb-2">
                    Date Watched
                  </label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="date"
                      id="watched-date"
                      value={watchedDate}
                      onChange={(e) => setWatchedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-[#121212] border border-[#292524] focus:border-[#e8d5b0]/60 focus:ring-1 focus:ring-[#e8d5b0]/40 focus:outline-none text-[0.8rem] text-stone-100 uppercase tracking-wider rounded-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tagging System */}
              <div>
                <label className="block text-[0.75rem] font-sans font-bold tracking-widest text-[#a8a29e] uppercase mb-2">
                  Tags & Moods
                </label>
                
                {/* Active Tags list */}
                <div className="flex flex-wrap gap-1.5 mb-3 min-h-[30px] items-center">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.65rem] bg-[#121212] border border-[#292524] text-stone-300 font-sans uppercase tracking-wider transition-colors hover:border-red-950/60"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-stone-500 hover:text-red-400 transition-colors"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-[0.7rem] text-stone-600 italic tracking-wider font-light">
                      No tags attached yet.
                    </span>
                  )}
                </div>

                {/* Input for new tag */}
                <div className="relative flex items-center">
                  <Tag size={14} className="absolute left-3.5 text-stone-500" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Type tag and press Enter or comma..."
                    className="w-full pl-10 pr-4 py-2 bg-[#121212] border border-[#292524] focus:border-[#e8d5b0]/60 focus:outline-none text-[0.8rem] text-stone-100 placeholder-stone-600 rounded-none transition-all"
                  />
                </div>

                {/* Quick Add Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[0.65rem] text-stone-500 uppercase tracking-widest self-center mr-1">
                    Quick add:
                  </span>
                  {SUGGESTED_TAGS.map((sTag) => {
                    const isAdded = tags.includes(sTag);
                    return (
                      <button
                        key={sTag}
                        type="button"
                        onClick={() => isAdded ? handleRemoveTag(sTag) : addTag(sTag)}
                        className={`px-2 py-0.5 text-[0.6rem] font-sans uppercase tracking-widest border transition-all ${
                          isAdded
                            ? "bg-[#e8d5b0]/10 border-[#e8d5b0] text-[#e8d5b0]"
                            : "bg-transparent border-[#292524]/60 text-stone-500 hover:border-stone-700 hover:text-stone-300"
                        }`}
                      >
                        + {sTag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-red-400 text-xs tracking-wide p-3 border border-red-900/40 bg-red-950/20 text-center font-sans font-light">
                {errorMsg}
              </div>
            )}

            {/* Footer Form Controls */}
            <div className="flex items-center justify-end gap-4 border-t border-[#292524] pt-5 mt-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-stone-400 hover:text-stone-100 text-[0.72rem] uppercase tracking-[0.18em] font-sans font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !selectedMovie}
                className="px-6 py-3 bg-[#e8d5b0] hover:bg-[#d6c096] text-[#0A0A0A] text-[0.72rem] font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-40 flex items-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-[#0A0A0A]" />
                    <span>Archiving...</span>
                  </>
                ) : (
                  <span>Archive to Vault</span>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
