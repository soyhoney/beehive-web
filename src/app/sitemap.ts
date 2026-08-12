import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/quote-flow";

export const dynamic = "force-static";

const BASE = "https://www.beehivecorp.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, priority: 1 },
    { url: `${BASE}/quote/`, lastModified: now, priority: 0.9 },
    { url: `${BASE}/privacy/`, lastModified: now, priority: 0.3 },
    ...CATEGORIES.map((c) => ({
      url: `${BASE}/quote/${c.id}/`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
