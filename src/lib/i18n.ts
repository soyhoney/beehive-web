/**
 * 다국어 설정.
 *
 * 한국어는 루트(`/`), 영어는 `/en/` 아래에 둡니다.
 * 정적 빌드라 언어별로 실제 페이지가 각각 생성되므로,
 * 검색엔진이 영문 페이지를 따로 색인하고 영문 링크를 그대로 공유할 수 있습니다.
 */

export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "ko";

/**
 * 영문 사이트 공개 여부.
 *
 * false인 동안에는 /en/ 경로가 아예 생성되지 않고 언어 토글도 숨겨집니다.
 * 한국어 사이트를 확정하고 영문 번역·검수가 끝나면 true로 바꾸세요.
 * (src/lib/content/en.ts 참고)
 */
export const EN_ENABLED = false;

/** 실제로 페이지를 생성할 언어 목록 */
export const ACTIVE_LOCALES: readonly Locale[] = EN_ENABLED ? LOCALES : ["ko"];

export const LOCALE_LABEL: Record<Locale, string> = {
  ko: "KO",
  en: "EN",
};

/** <html lang="..."> 에 들어갈 값 */
export const HTML_LANG: Record<Locale, string> = {
  ko: "ko",
  en: "en",
};

/**
 * 영문 번역이 끝난 경로만 적습니다.
 * 여기 없는 경로에서는 언어 토글이 홈으로 보내, 반쯤 번역된 화면이 노출되지 않게 합니다.
 *
 * 1차(8/24)는 홈과 견적 폼까지, 나머지는 검수 후 순차 추가합니다.
 */
export const EN_READY_PREFIXES = ["/", "/quote"] as const;

export function isEnglishReady(path: string): boolean {
  const clean = normalize(path);
  return EN_READY_PREFIXES.some(
    (prefix) => clean === prefix || clean.startsWith(prefix === "/" ? "/" : `${prefix}/`),
  );
}

/** 앞뒤 슬래시를 정리해 비교하기 쉬운 형태로 만든다. */
function normalize(path: string): string {
  const withoutLocale = path.replace(/^\/en(?=\/|$)/, "") || "/";
  return withoutLocale.length > 1 ? withoutLocale.replace(/\/$/, "") : "/";
}

/** 현재 경로를 다른 언어의 같은 경로로 바꾼다. */
export function switchLocalePath(path: string, to: Locale): string {
  const base = normalize(path);

  if (to === "ko") return base === "/" ? "/" : `${base}/`;

  // 영문이 아직 준비되지 않은 페이지는 영문 홈으로 보낸다.
  if (!isEnglishReady(base)) return "/en/";
  return base === "/" ? "/en/" : `/en${base}/`;
}

/** 로케일에 맞는 링크를 만든다. (ko는 접두사 없음) */
export function href(locale: Locale, path: string): string {
  if (locale === "ko") return path;
  return path === "/" ? "/en/" : `/en${path}`;
}
