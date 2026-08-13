import type { Metadata } from "next";
import { EN_ENABLED, type Locale } from "./i18n";
import { SITE_URL } from "./site";

/**
 * canonical · hreflang 을 한 곳에서 만듭니다.
 *
 * ── hreflang 은 양방향이어야 합니다 ──────────────────────────────────
 * 구글은 A가 B를 alternate 로 가리키면 B도 A를 가리킬 것을 요구합니다.
 * 한쪽만 선언하면 주석이 무시될 수 있습니다.
 * 이전에는 /en/ 계열에만 alternates 가 있고 국문 페이지에는 없어서
 * 단방향이었습니다. 그래서 모든 페이지가 이 함수를 쓰게 했습니다.
 *
 * x-default 는 "어느 언어도 맞지 않는 방문자에게 보낼 곳"입니다.
 * 국내 기업이므로 국문을 기본으로 둡니다.
 */
export function alternatesFor(
  koPath: string,
  locale: Locale,
  options: { hasEn?: boolean } = {},
): Metadata["alternates"] {
  const { hasEn = true } = options;
  const self = locale === "ko" ? koPath : enPath(koPath);

  // 영문 페이지가 없는 경로(개인정보처리방침 등)는 canonical 만 붙입니다.
  if (!EN_ENABLED || !hasEn) return { canonical: self };

  return {
    canonical: self,
    languages: {
      ko: koPath,
      en: enPath(koPath),
      "x-default": koPath,
    },
  };
}

/** 국문 경로에 대응하는 영문 경로. trailingSlash: true 라 끝 슬래시를 유지합니다. */
export function enPath(koPath: string): string {
  return koPath === "/" ? "/en/" : `/en${koPath}`;
}

/**
 * 두 루트 레이아웃이 공유하는 값.
 *
 * 언어별로 <html lang> 이 달라야 해서 루트 레이아웃을 (ko)/(en) 로 나눴고,
 * 그 과정에서 아이콘·metadataBase 가 양쪽에 복사되는 것을 막기 위해 여기 둡니다.
 */
export const SHARED_METADATA = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
} satisfies Metadata;

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630 };

/** 언어별 루트 레이아웃 기본 메타데이터 */
export const ROOT_METADATA: Record<Locale, Metadata> = {
  ko: {
    ...SHARED_METADATA,
    title: {
      default: "비하이브코퍼레이션",
      template: "%s · 비하이브코퍼레이션",
    },
    description:
      "단순한 언어의 통역 및 번역을 넘어 자유로운 소통과 성공적인 의사결정을 추구하는 프로젝트 전문 업체입니다.",
    openGraph: {
      title: "비하이브코퍼레이션",
      description: "통번역부터 행사 운영, 문서화, 교육까지 — 언어와 경계를 넘어",
      locale: "ko_KR",
      type: "website",
      images: [{ ...OG_IMAGE, alt: "비하이브코퍼레이션" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "비하이브코퍼레이션",
      description: "통번역부터 행사 운영, 문서화, 교육까지 — 언어와 경계를 넘어",
      images: ["/og.png"],
    },
  },
  en: {
    ...SHARED_METADATA,
    title: {
      default: "Beehive Corporation · Interpretation, Translation, International Events",
      template: "%s · Beehive Corporation",
    },
    description:
      "Beyond language and cultural boundaries — we drive communication and execution. Interpretation, translation, international conference planning, on-site and online events, documentation, and English training.",
    openGraph: {
      title: "Beehive Corporation",
      description:
        "Interpretation, translation, international events — beyond language and cultural boundaries.",
      locale: "en_US",
      type: "website",
      images: [{ ...OG_IMAGE, alt: "Beehive Corporation" }],
    },
    /*
     * twitter 는 openGraph 를 자동으로 물려받지 않습니다.
     * 이전에 /en/ 에서 openGraph 만 영문으로 덮고 twitter 를 빠뜨려
     * 트위터·일부 메신저 미리보기에 한국어 제목이 나갔습니다.
     */
    twitter: {
      card: "summary_large_image",
      title: "Beehive Corporation",
      description:
        "Interpretation, translation, international events — beyond language and cultural boundaries.",
      images: ["/og.png"],
    },
  },
};
