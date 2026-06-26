/**
 * Site-wide constants and metadata configuration.
 * Single source of truth for branding, navigation, and SEO defaults.
 */

export const SITE_CONFIG = {
  name: "Frame",
  tagline: "A personal archive for every story you've watched",
  description:
    "A personal memory archive and digital scrapbook for cinema lovers to record, organize, remember, and rediscover everything they've watched.",
  url: "https://frame.film",
  locale: "en-US",
  author: "Frame Studio",
} as const;

export const NAV_LINKS = [
  { label: "Discover", href: "/discover" },
  { label: "Atlas", href: "/atlas" },
  { label: "Journal", href: "/journal" },
  { label: "Timeline", href: "/timeline" },
  { label: "Shelf", href: "/shelf" },
  { label: "Wrapped", href: "/wrapped" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { label: "Discover", href: "/discover" },
    { label: "Collections", href: "/collections" },
    { label: "Atlas", href: "/atlas" },
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
