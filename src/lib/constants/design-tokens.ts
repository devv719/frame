/**
 * Design tokens as TypeScript constants.
 * Mirrors the CSS custom properties for use in JS/TS contexts
 * (e.g., Framer Motion animations, dynamic styles).
 */

export const colors = {
  bg: {
    primary: "#0e0d0b",
    secondary: "#161410",
    tertiary: "#161410",
    elevated: "#1e1c18",
    inverse: "#e8e2d9",
    overlay: "rgba(14, 13, 11, 0.95)",
  },
  surface: {
    primary: "#161410",
    secondary: "#1e1c18",
    tertiary: "#242220",
    glass: "rgba(22, 20, 16, 0.95)",
  },
  text: {
    primary: "#e8e2d9",
    secondary: "rgba(232, 226, 217, 0.7)",
    tertiary: "rgba(232, 226, 217, 0.5)",
    inverse: "#0e0d0b",
    muted: "rgba(232, 226, 217, 0.4)",
  },
  lavender: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
  },
  warm: {
    50: "#fffcf9",
    100: "#fef9f3",
    200: "#fdf3e7",
    300: "#fce8d0",
  },
  neutral: {
    100: "#f1eff6",
    200: "#e5e2ed",
    300: "#d4d0df",
    400: "#b8b2cc",
    500: "#9d96b3",
    600: "#6b6480",
    700: "#4a4460",
    800: "#2d2844",
    900: "#1a1625",
  },
} as const;

export const easings = {
  outExpo: [0.16, 1, 0.3, 1] as const,
  outQuart: [0.25, 1, 0.5, 1] as const,
  inOutSmooth: [0.4, 0, 0.2, 1] as const,
};

export const durations = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
};

export const spacing = {
  section: {
    sm: "4rem",
    md: "6rem",
    lg: "8rem",
  },
  container: {
    px: {
      sm: "1.5rem",
      md: "2rem",
      lg: "3rem",
      xl: "4rem",
    },
  },
} as const;

export type ColorToken = typeof colors;
export type EasingToken = typeof easings;
