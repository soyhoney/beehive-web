import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/quote-flow";
import { EN_ENABLED } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * 색인 대상 경로 표.
 *
 * `hasEn` 은 영문 페이지가 실제로 존재하는지를 뜻합니다.
 * src/app/en/ 아래에 있는 것만 true 로 둡니다 — 없는 URL 을 sitemap 에 올리면
 * 검색엔진이 404 를 받습니다. (privacy 는 아직 국문만 있습니다)
 *
 * 새 페이지를 추가하면 여기에도 한 줄 넣어야 합니다.
 */
const ROUTES: readonly { path: string; priority: number; hasEn: boolean }[] = [
  { path: "/", priority: 1, hasEn: true },
  { path: "/quote/", priority: 0.9, hasEn: true },
  ...CATEGORIES.map((c) => ({
    path: `/quote/${c.id}/`,
    priority: 0.8,
    hasEn: true,
  })),
  { path: "/privacy/", priority: 0.3, hasEn: false },
];

/** 국문 경로에 대응하는 영문 경로 (`/` → `/en/`, `/quote/` → `/en/quote/`) */
function enPath(path: string): string {
  return path === "/" ? "/en/" : `/en${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    const bilingual = EN_ENABLED && route.hasEn;

    /*
     * 양쪽 언어가 있는 경로는 sitemap 안에서도 서로를 alternate 로 가리킵니다.
     * (xhtml:link hreflang 으로 출력됩니다 — HTML <head> 의 hreflang 과 함께
     *  두 곳에서 선언해 두는 것이 구글 권장 방식입니다)
     */
    const alternates = bilingual
      ? {
          languages: {
            ko: `${SITE_URL}${route.path}`,
            en: `${SITE_URL}${enPath(route.path)}`,
            "x-default": `${SITE_URL}${route.path}`,
          },
        }
      : undefined;

    entries.push({
      url: `${SITE_URL}${route.path}`,
      lastModified: now,
      priority: route.priority,
      alternates,
    });

    if (bilingual) {
      entries.push({
        url: `${SITE_URL}${enPath(route.path)}`,
        lastModified: now,
        // 영문은 같은 내용의 번역이므로 국문보다 한 단계 낮게 둡니다.
        priority: Math.max(route.priority - 0.1, 0.1),
        alternates,
      });
    }
  }

  return entries;
}
