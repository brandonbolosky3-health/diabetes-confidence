import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_APP_URL || "https://sarynhealth.com";
const IV_MODE = process.env.SITE_MODE === "iv";

export default function sitemap(): MetadataRoute.Sitemap {
  if (IV_MODE) {
    return [
      { url: `${base}/iv`,    lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
      { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ];
  }

  return [
    { url: `${base}/`,                  lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/iv`,                lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/about`,             lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/consultation-form`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/membership`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];
}
