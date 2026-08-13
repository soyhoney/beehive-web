import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.beehivecorp.co.kr"),
  title: {
    default: "비하이브코퍼레이션",
    template: "%s · 비하이브코퍼레이션",
  },
  description:
    "단순한 언어의 통역 및 번역을 넘어 자유로운 소통과 성공적인 의사결정을 추구하는 프로젝트 전문 업체입니다.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "비하이브코퍼레이션",
    description: "통번역부터 행사 운영, 문서화, 교육까지 — 언어와 경계를 넘어",
    locale: "ko_KR",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "비하이브코퍼레이션" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "비하이브코퍼레이션",
    description: "통번역부터 행사 운영, 문서화, 교육까지 — 언어와 경계를 넘어",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link rel="stylesheet" href="/fonts/pretendard.css" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
