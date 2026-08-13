import type { Metadata } from "next";
import "../globals.css";
import { HTML_LANG } from "@/lib/i18n";
import { ROOT_METADATA } from "@/lib/metadata";

/**
 * 영문 루트 레이아웃. lang="en" 을 붙이기 위해 존재합니다.
 * 왜 루트 레이아웃을 둘로 나눴는지는 (ko)/layout.tsx 주석 참고.
 */
export const metadata: Metadata = ROOT_METADATA.en;

export default function EnRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={HTML_LANG.en}>
      <head>
        <link rel="stylesheet" href="/fonts/pretendard.css" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
