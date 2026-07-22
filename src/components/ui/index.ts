/**
 * Barrel export for UI primitives.
 * Re-exports all reusable UI components (maps, buttons, inputs, cards, etc.)
 */

// Movie Components
export {
  MovieCard,
  MovieCardSkeleton,
  type Movie,
  type MovieCardProps,
} from "./movie-card";

export {
  FeaturedMovieCard,
  FeaturedMovieCardSkeleton,
  type FeaturedMovieCardProps,
} from "./featured-movie-card";

export {
  CompactMovieCard,
  CompactMovieCardSkeleton,
  type CompactMovieCardProps,
} from "./compact-movie-card";

export {
  MovieGrid,
  type MovieGridProps,
} from "./movie-grid";

// Map Components (mapcn-map-arc)
export {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MarkerLabel,
  MapControls,
  MapPopup,
  MapRoute,
  MapArc,
  MapClusterLayer,
  useMap,
  type MapViewport,
  type MapStyleOption,
  type MapRef,
  type MapProps,
  type MapMarkerProps,
  type MarkerContentProps,
  type MarkerPopupProps,
  type MarkerTooltipProps,
  type MarkerLabelProps,
  type MapControlsProps,
  type MapPopupProps,
  type MapRouteProps,
  type MapArcDatum,
  type MapArcEvent,
  type MapArcProps,
  type MapClusterLayerProps,
} from "./mapcn-map-arc";

// Visual Effects Components
export { ShaderBackground } from "./shader-background";
export { FilmGrain } from "./film-grain";
export { CursorGlow } from "./cursor-glow";

// Log Components
export { LogModal } from "./log-modal";

// Mood Components
export { MoodProfile } from "./mood-profile";

// Toast Components
export { ToastContainer, toast } from "./toast";
