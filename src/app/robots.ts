import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    // 기준 URL 은 src/lib/site.ts 한 곳에서 관리합니다.
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
