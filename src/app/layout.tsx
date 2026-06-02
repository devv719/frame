import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { Navbar, Footer } from "@/components";
import "./globals.css";

/* ── Font Configuration ── */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ── Metadata ── */

export const metadata: Metadata = {
  title: {
    default: "Frame — Cinema, Reimagined",
    template: "%s | Frame",
  },
  description:
    "A cinematic movie discovery platform focused on aesthetics, visual storytelling, and exploration. Discover films through maps, curated collections, and stories.",
  keywords: [
    "movies",
    "cinema",
    "film discovery",
    "movie map",
    "film locations",
    "curated collections",
    "A24",
    "visual storytelling",
  ],
  authors: [{ name: "Frame Studio" }],
  creator: "Frame Studio",
  metadataBase: new URL("https://frame.film"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Frame",
    title: "Frame — Cinema, Reimagined",
    description:
      "Discover films through aesthetics, maps, and visual storytelling.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frame — Cinema, Reimagined",
    description:
      "Discover films through aesthetics, maps, and visual storytelling.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9fc",
  width: "device-width",
  initialScale: 1,
};

/* ── Root Layout ── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${geistMono.variable}`}
    >
      <body>
        <Navbar />
        <main className="flex-1 pt-16 md:pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
