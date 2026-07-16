import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import { AppChrome } from "@/components/layout/app-chrome";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

/* ── Font Configuration ── */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
  themeColor: "#0e0d0b",
  width: "device-width",
  initialScale: 1,
};

import { ToastContainer } from "@/components/ui/toast";

/* ── Root Layout ── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${geistMono.variable}`}
    >
      <body>
        <AuthProvider>
          <AppChrome>{children}</AppChrome>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
