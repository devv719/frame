import type { MovieLocation, MovieLocationRepository } from "./types";
import { CURATED_LOCATIONS } from "@/services/curated-collections";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const CURATED_MOVIE_LOCATIONS: MovieLocation[] = CURATED_LOCATIONS.map((loc) => ({
  id: loc.id,
  movieId: loc.tmdbMovieId,
  movieTitle: loc.movieTitle,
  year: loc.year,
  director: loc.director,
  genre: loc.genre,
  locationName: loc.locationName,
  city: loc.city,
  country: loc.country,
  coordinates: loc.coordinates,
  kind: loc.kind,
  scene: loc.scene,
  synopsis: loc.synopsis,
  mood: loc.mood,
  productionWindow: loc.productionWindow,
  poster: loc.posterPath ? `${TMDB_IMAGE_BASE_URL}${loc.posterPath}` : "",
  datasetSource: "tmdb",
}));

export const curatedMovieLocationRepository: MovieLocationRepository = {
  async listLocations() {
    return CURATED_MOVIE_LOCATIONS;
  },
};
