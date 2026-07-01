import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Force Next.js Turbopack to treat the project folder as the root
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;


