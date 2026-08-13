/**
 * 사이트의 기준 절대 URL.
 *
 * OG 이미지 · canonical · hreflang · sitemap · robots 가 모두 이 값을 씁니다.
 * 이전에는 layout.tsx 는 workers.dev 를, sitemap.ts · robots.ts 는
 * www.beehivecorp.co.kr 을 각각 하드코딩해서 두 갈래로 갈라져 있었습니다.
 * 그 결과 sitemap 이 아직 옛 사이트를 서비스하는 도메인의 URL 을 광고했습니다.
 *
 * ── 지금 workers.dev 인 이유 ─────────────────────────────────────────
 * 가비아 도메인의 DNS 가 아직 옛 임대형 홈페이지를 가리킵니다.
 * 확인 결과 https://www.beehivecorp.co.kr 은 HTTPS 자체가 응답하지 않습니다.
 * 이 시점에 기준 URL 을 실제 도메인으로 적으면
 *   · 카톡 · 슬랙 공유 시 OG 이미지가 깨지고 (해당 도메인에 /og.png 가 없음)
 *   · sitemap 이 열리지 않는 URL 목록을 검색엔진에 제출합니다
 * 지금은 검수용으로 workers.dev 링크를 공유하는 단계이므로 이 값이 맞습니다.
 *
 * ── 정식 오픈(DNS 전환) 시 할 일 ──────────────────────────────────────
 * 빌드 환경변수 NEXT_PUBLIC_SITE_URL 에 https://www.beehivecorp.co.kr 을 넣거나,
 * 아래 기본값을 바꾸고 다시 빌드합니다.
 *
 * 주의 — NEXT_PUBLIC_* 은 빌드 시점에 박힙니다. 값만 바꾸고 재빌드하지 않으면
 * 예전 값이 그대로 나갑니다. (NEXT_PUBLIC_QUOTE_ENDPOINT 와 같은 성질)
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://beehive-web.service-117.workers.dev";

/** 경로를 기준 URL 기준의 절대 URL 로 만든다. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
