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
    50: "#1e1c18",
    100: "#e8d5b0",
    200: "#e8d5b0",
    300: "#e8d5b0",
    400: "#d6c096",
    500: "#e8d5b0",
    600: "#d6c096",
    700: "#bda57b",
    800: "#a38c62",
    900: "#8a7249",
  },
  pink: {
    50: "#1e1c18",
    100: "#e8d5b0",
    200: "#e8d5b0",
    300: "#d6c096",
    400: "#bda57b",
    500: "#e8d5b0",
    600: "#a84634",
  },
  warm: {
    50: "#fffcf9",
    100: "#fef9f3",
    200: "#fdf3e7",
    300: "#fce8d0",
  },
  neutral: {
    100: "#1e1c18",
    200: "#161410",
    300: "rgba(232, 213, 176, 0.15)",
    400: "rgba(232, 213, 176, 0.25)",
    500: "#8a7249",
    600: "#78716c",
    700: "#57534e",
    800: "#292524",
    900: "#0e0d0b",
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
