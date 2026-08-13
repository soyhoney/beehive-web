import type { Metadata } from "next";
import "../globals.css";
import { HTML_LANG } from "@/lib/i18n";
import { ROOT_METADATA } from "@/lib/metadata";

/**
 * 국문 루트 레이아웃.
 *
 * ── 루트 레이아웃이 두 개인 이유 ─────────────────────────────────────
 * <html lang> 은 루트 레이아웃에서만 지정할 수 있고, App Router 의 레이아웃은
 * 현재 경로를 알 수 없습니다. 루트 레이아웃이 하나였을 때는 lang="ko" 가
 * 하드코딩되어 /en/ 페이지도 자기 언어를 한국어라고 선언했습니다.
 * 영문 본문에 lang="ko" 가 붙으면 스크린리더가 한국어 발음 규칙으로 읽고,
 * 검색엔진의 언어 타겟팅도 틀어집니다.
 *
 * 그래서 route group 으로 (ko) · (en) 두 루트 레이아웃을 두었습니다.
 * 괄호 이름은 URL 에 나타나지 않으므로 경로는 그대로입니다.
 *
 * 주의 — 두 루트 레이아웃 사이를 오갈 때는 클라이언트 전환이 아니라
 * 전체 페이지 로드가 일어납니다. 언어 전환은 원래 전체 이동이라 문제되지 않습니다.
 */
export const metadata: Metadata = ROOT_METADATA.ko;

export default function KoRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={HTML_LANG.ko}>
      <head>
        <link rel="stylesheet" href="/fonts/pretendard.css" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
