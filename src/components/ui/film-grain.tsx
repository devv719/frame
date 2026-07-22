"use client";

export function FilmGrain() {
  // Inline SVG noise — no external CDN dependency, works offline
  const svgNoise = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.028]"
      style={{ backgroundImage: svgNoise }}
      aria-hidden="true"
    />
  );
}
