/**
 * Site-wide constants and metadata configuration.
 * Single source of truth for branding, navigation, and SEO defaults.
 */

export const SITE_CONFIG = {
  name: "Frame",
  tagline: "Cinema, Reimagined",
  description:
    "A cinematic movie discovery platform focused on aesthetics, visual storytelling, and exploration.",
  url: "https://frame.film",
  locale: "en-US",
  author: "Frame Studio",
} as const;

export const NAV_LINKS = [
  { label: "Discover", href: "/discover" },
  { label: "Collections", href: "/collections" },
  { label: "Map", href: "/map" },
  { label: "Stories", href: "/stories" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { label: "Discover", href: "/discover" },
    { label: "Collections", href: "/collections" },
    { label: "Film Map", href: "/map" },
    { label: "Stories", href: "/stories" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;

export const SOCIAL_LINKS = [
  { label: "Twitter", href: "https://twitter.com/frame", icon: "twitter" },
  {
    label: "Instagram",
    href: "https://instagram.com/frame",
    icon: "instagram",
  },
  { label: "Letterboxd", href: "https://letterboxd.com/frame", icon: "film" },
] as const;
