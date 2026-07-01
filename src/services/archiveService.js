import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

/**
 * Logs a movie or show watch memory to the 'logs' collection in Firestore.
 *
 * @param {string} userId - The unique identifier of the user logging the media.
 * @param {object} tmdbData - Movie/media details fetched from TMDB.
 * @param {object} userJournal - User annotations, ratings, and memory details.
 * @param {number} userJournal.userRating - User rating (typically 0.5 to 5.0).
 * @param {string} userJournal.journalEntry - Reflective diary entry or thoughts.
 * @param {string[]} userJournal.tags - Categorized elements, moods, or themes.
 * @param {string} userJournal.locationWatched - The theater, home, or place of watch.
 * @param {string} userJournal.watchedDate - The ISO date of viewing.
 * @returns {Promise<string>} Resolves to the auto-generated Firestore document ID.
 */
export async function logToArchive(userId, tmdbData, userJournal) {
  if (!userId) {
    throw new Error("Cannot archive without a valid user ID.");
  }
  if (!tmdbData || !tmdbData.id) {
    throw new Error("Cannot archive without valid TMDB media details.");
  }
  if (!userJournal) {
    throw new Error("Cannot archive without journal entry details.");
  }

  // Deconstruct inputs with safe defaults
  const {
    userRating = 0,
    journalEntry = "",
    tags = [],
    locationWatched = "",
    watchedDate = new Date().toISOString()
  } = userJournal;

  // Extract release year from various possible fields in TMDB data structure
  let releaseYear = "";
  if (tmdbData.release_date) {
    releaseYear = new Date(tmdbData.release_date).getFullYear().toString();
  } else if (tmdbData.first_air_date) {
    releaseYear = new Date(tmdbData.first_air_date).getFullYear().toString();
  } else if (tmdbData.releaseYear) {
    releaseYear = String(tmdbData.releaseYear);
  } else if (tmdbData.year) {
    releaseYear = String(tmdbData.year);
  }

  // Map to document schema matching the instructions
  const logDocument = {
    userId,
    mediaId: String(tmdbData.id),
    title: tmdbData.title || tmdbData.name || "Untitled",
    posterPath: tmdbData.poster_path || tmdbData.poster || "",
    releaseYear,
    userRating: Number(userRating),
    journalEntry,
    tags: Array.isArray(tags) ? tags : [],
    locationWatched,
    watchedDate,
    createdAt: serverTimestamp() // serverTimestamp field
  };

  try {
    const logsCollection = collection(db, "logs");
    const docRef = await addDoc(logsCollection, logDocument);
    return docRef.id;
  } catch (error) {
    console.error("Firestore logging failed in archiveService:", error);
    throw error;
  }
}

/**
 * Fetches all archived logs belonging specifically to the authenticated user from Firestore.
 * Automatically maps Firestore schema fields back to the frontend's expected properties
 * to maintain complete compatibility.
 *
 * @param {string} userId - The unique identifier of the current user.
 * @returns {Promise<object[]>} List of mapped movie logs sorted by watched date descending.
 */
export async function getArchiveLogs(userId) {
  if (!userId) return [];
  try {
    const logsRef = collection(db, "logs");
    const q = query(logsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const logs = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      logs.push({
        id: docSnap.id,
        movie_id: Number(data.mediaId) || 0,
        title: data.title || "Untitled",
        poster_path: data.posterPath || "",
        backdrop_path: data.posterPath ? `https://image.tmdb.org/t/p/w1280${data.posterPath}` : "",
        release_year: Number(data.releaseYear) || 0,
        director: data.director || "Unknown Director",
        genres: data.tags || [],
        watched_at: data.watchedDate ? data.watchedDate.split("T")[0] : "",
        rating: data.userRating || 0,
        mood: (data.tags && data.tags[0]) || "Thoughtful",
        notes: data.journalEntry || "",
        location: data.locationWatched || "",
        // Retain Firestore-native structures for subcomponents
        userId: data.userId,
        mediaId: data.mediaId,
        posterPath: data.posterPath,
        releaseYear: data.releaseYear,
        userRating: data.userRating,
        journalEntry: data.journalEntry,
        tags: data.tags || [],
        locationWatched: data.locationWatched,
        watchedDate: data.watchedDate,
        createdAt: data.createdAt,
      });
    });

    // In-memory sorting to avoid requiring composite indexes in Firestore
    return logs.sort((a, b) => {
      const dateA = a.watchedDate ? new Date(a.watchedDate) : new Date(a.createdAt?.toDate() || 0);
      const dateB = b.watchedDate ? new Date(b.watchedDate) : new Date(b.createdAt?.toDate() || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Firestore retrieval failed in archiveService:", error);
    throw error;
  }
}

/**
 * Deletes a log from the Firestore vault.
 *
 * @param {string} logId - The ID of the document to delete.
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
export async function deleteArchiveLog(logId) {
  if (!logId) return false;
  try {
    const docRef = doc(db, "logs", logId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Firestore deletion failed in archiveService:", error);
    throw error;
  }
}

/**
 * Processes logs to generate stats in memory for the Wrapped page.
 *
 * @param {object[]} logs - Mapped movie log objects.
 * @returns {object} Calculated statistics.
 */
export function computeArchiveStats(logs) {
  if (!logs || logs.length === 0) {
    return {
      totalCount: 0,
      movieCount: 0,
      seriesCount: 0,
      averageRating: 0,
      favoriteGenre: "None",
      mostWatchedDirector: "None",
      mostActiveMonth: "None",
    };
  }

  const movieCount = logs.filter((l) => l.media_type === "movie" || l.mediaType === "movie").length;
  const seriesCount = logs.filter((l) => l.media_type === "series" || l.mediaType === "series").length;
  const averageRating =
    logs.reduce((acc, curr) => acc + (curr.rating || curr.userRating || 0), 0) / logs.length;

  // Favorite Genre calculation
  const genresMap = {};
  logs.forEach((log) => {
    const genres = log.genres || log.tags || [];
    genres.forEach((genre) => {
      genresMap[genre] = (genresMap[genre] || 0) + 1;
    });
  });
  let favoriteGenre = "None";
  let maxGenreCount = 0;
  Object.entries(genresMap).forEach(([genre, count]) => {
    if (count > maxGenreCount) {
      maxGenreCount = count;
      favoriteGenre = genre;
    }
  });

  // Most Watched Director calculation
  const directorsMap = {};
  logs.forEach((log) => {
    if (log.director && log.director !== "Unknown Director") {
      directorsMap[log.director] = (directorsMap[log.director] || 0) + 1;
    }
  });
  let mostWatchedDirector = "None";
  let maxDirectorCount = 0;
  Object.entries(directorsMap).forEach(([director, count]) => {
    if (count > maxDirectorCount) {
      maxDirectorCount = count;
      mostWatchedDirector = director;
    }
  });

  // Most Active Month
  const monthsMap = {};
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  logs.forEach((log) => {
    const dateStr = log.watched_at || log.watchedDate;
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        const monthName = monthNames[date.getMonth()];
        monthsMap[monthName] = (monthsMap[monthName] || 0) + 1;
      }
    }
  });
  let mostActiveMonth = "None";
  let maxMonthCount = 0;
  Object.entries(monthsMap).forEach(([month, count]) => {
    if (count > maxMonthCount) {
      maxMonthCount = count;
      mostActiveMonth = month;
    }
  });

  return {
    totalCount: logs.length,
    movieCount,
    seriesCount,
    averageRating,
    favoriteGenre,
    mostWatchedDirector,
    mostActiveMonth,
  };
}

