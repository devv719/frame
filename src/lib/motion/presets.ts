/**
 * Framer Motion animation presets.
 * Centralized motion variants for consistent animation language
 * throughout the application.
 */

import type { Variants, Transition } from "framer-motion";
import { easings, durations } from "@/lib/constants/design-tokens";

/* ── Shared Transitions ── */

export const springTransition: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

export const smoothTransition: Transition = {
  duration: durations.normal,
  ease: easings.outExpo,
};

export const slowTransition: Transition = {
  duration: durations.slower,
  ease: easings.outExpo,
};

/* ── Fade Variants ── */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: smoothTransition,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

/* ── Scale Variants ── */

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: smoothTransition,
  },
};

/* ── Slide Variants ── */

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: smoothTransition,
  },
};

/* ── Blur Variants ── */

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: slowTransition,
  },
};

/* ── Stagger Container ── */

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easings.outExpo,
    },
  },
};

/* ── Page Transition ── */

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.outExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: durations.fast,
      ease: easings.inOutSmooth,
    },
  },
};

/* ── Hover presets (for whileHover) ── */

export const hoverLift = {
  y: -2,
  transition: { duration: durations.normal, ease: easings.outExpo },
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: durations.normal, ease: easings.outExpo },
};

export const tapScale = {
  scale: 0.98,
};
