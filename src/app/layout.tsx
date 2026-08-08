import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
