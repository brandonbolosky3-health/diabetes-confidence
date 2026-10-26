import type { NextConfig } from "next";

const IV_MODE = process.env.SITE_MODE === "iv";

// All marketing/app routes to redirect to /iv when in iv mode.
// /login, /api/*, /auth/*, /iv, /about are always allowed.
const IV_REDIRECT_SOURCES = [
  "/",
  "/membership",
  "/pricing",
  "/consultation",
  "/consultation-form",
  "/quiz",
  "/cookbook",
  "/signup",
  "/dashboard",
  "/onboarding",
  "/lessons",
  "/learn",
  "/ai",
  "/videos",
  "/guides",
  "/community",
  "/admin",
  "/book",
  "/member",
  "/welcome",
  "/work-with-me",
  "/test",
];

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_SITE_MODE: process.env.SITE_MODE ?? "full",
  },
  async redirects() {
    if (!IV_MODE) return [];
    return [
      // Exact routes
      ...IV_REDIRECT_SOURCES.map((source) => ({
        source,
        destination: "/iv",
        permanent: true,
      })),
      // Sub-paths (e.g. /dashboard/*, /admin/*)
      ...IV_REDIRECT_SOURCES.filter((s) => s !== "/").map((source) => ({
        source: `${source}/:path*`,
        destination: "/iv",
        permanent: true,
      })),
    ];
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
