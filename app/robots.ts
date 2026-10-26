import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://sarynhealth.com";
const IV_MODE = process.env.SITE_MODE === "iv";

export default function robots(): MetadataRoute.Robots {
  if (IV_MODE) {
    return {
      rules: [
        {
          userAgent: "*",
          allow: ["/iv", "/about"],
          disallow: ["/"],
        },
        // Re-allow /iv and /about explicitly so the disallow "/" doesn't block them
        {
          userAgent: "*",
          allow: "/iv",
        },
        {
          userAgent: "*",
          allow: "/about",
        },
      ],
      sitemap: `${base}/sitemap.xml`,
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
  };
}
