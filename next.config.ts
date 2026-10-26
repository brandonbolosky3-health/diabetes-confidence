import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Expose SITE_MODE to client components as NEXT_PUBLIC_SITE_MODE
    NEXT_PUBLIC_SITE_MODE: process.env.SITE_MODE ?? "full",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
