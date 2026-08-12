/**
 * 언어와 무관한 자산 — 클라이언트 로고, 현장 사진.
 * 번역 대상이 아니므로 한 곳에서만 관리합니다.
 */

import type { SharedAssets } from "./types";

/**
 * 견적 카테고리(A~F)별 대표 사진.
 * 기존 사이트에 올라와 있던 실제 현장 사진을 웹용으로 축소해 가져왔습니다.
 * 기타 문의(F)는 대응하는 사진이 없어 비워 둡니다.
 */
const categoryPhotos: SharedAssets["categoryPhotos"] = {
  A: { src: "/photos/business-trip.jpg", alt: "호텔 연회장에서 진행된 국제회의 현장" },
  B: { src: "/photos/public-project.jpg", alt: "KIST에서 열린 스페인 마드리드 사절단 회의" },
  C: { src: "/photos/interpretation.jpg", alt: "미디어아트 전시 행사장 전경" },
  D: { src: "/photos/translation.jpg", alt: "그라운드시소 〈우연히 웨스 앤더슨 2〉 전시 전경" },
  E: { src: "/photos/training.jpg", alt: "대강당에서 진행된 교육 프로그램" },
};

/**
 * 주요 클라이언트.
 * 로고 이미지는 기존 사이트(홈 Clients 섹션)에 올라와 있던 300×100 원본입니다.
 */
/*
 * 우선순위는 회사소개서(2026-07) '핵심 성과 · 주요 이력' 언급 빈도와 프로젝트 규모를 기준으로
 * 정렬했습니다. 첫 줄(5×2=10)에 정부·공공기관 및 6년 연속 파트너를,
 * 그다음 줄들에 글로벌 브랜드·방송·예술·기업 순으로 이어집니다.
 */
const clients: SharedAssets["clients"] = [
  // Tier 1 — 6년 연속 ICCR 파트너 (Key Highlights)
  { name: "식품의약품안전처", logo: "/clients/mfds.jpg" },
  { name: "대한화장품협회", logo: "/clients/kcia.jpg" },
  // Tier 2 — 정부·공공기관 (반복 수주)
  { name: "KOTRA", logo: "/clients/kotra.jpg" },
  { name: "한국수출입은행", logo: "/clients/koreaexim.jpg" },
  { name: "KOICA", logo: "/clients/koica.jpg" },
  { name: "주한미국대사관", logo: "/clients/us-embassy.jpg" },
  { name: "주스페인 대한민국대사관", logo: "/clients/embassy-spain.jpg" },
  { name: "주포르투갈 대한민국대사관", logo: "/clients/embassy-portugal.jpg" },
  { name: "농림축산검역본부", logo: "/clients/qia.jpg" },
  { name: "충남테크노파크", logo: "/clients/ctp.jpg" },
  // Tier 3 — 글로벌 캠페인 · 대형 산업
  { name: "대한항공", logo: "/clients/korean-air.jpg" },
  { name: "LG U+", logo: "/clients/lg-uplus.jpg" },
  { name: "현대로템", logo: "/clients/hyundai-rotem.jpg" },
  { name: "SPC", logo: "/clients/spc.jpg" },
  { name: "SK", logo: "/clients/sk.jpg" },
  // Tier 4 — 방송·미디어
  { name: "MBC", logo: "/clients/mbc.jpg" },
  { name: "KBS", logo: "/clients/kbs.jpg" },
  { name: "EBS", logo: "/clients/ebs.jpg" },
  { name: "부산국제영화제", logo: "/clients/biff.jpg" },
  { name: "국민일보", logo: "/clients/kmib.jpg" },
  { name: "문화일보", logo: "/clients/munhwa.jpg" },
  // Tier 5 — 예술·문화
  { name: "그라운드시소", logo: "/clients/groundseesaw.jpg" },
  { name: "한국화랑협회", logo: "/clients/galleries-association.jpg" },
  { name: "한국관광공사", logo: "/clients/kto.jpg" },
  { name: "ARTPOINT", logo: "/clients/artpoint.jpg" },
  // Tier 6 — 기업·기타
  { name: "롯데월드", logo: "/clients/lotte-world.jpg" },
  { name: "대한적십자사", logo: "/clients/korean-red-cross.jpg" },
  { name: "Lutronic", logo: "/clients/lutronic.jpg" },
  { name: "SNU Medicine", logo: "/clients/snu-medicine.jpg" },
  { name: "AdQUA Interactive", logo: "/clients/adqua.jpg" },
  { name: "ikp", logo: "/clients/ikp.jpg" },
  { name: "DL", logo: "/clients/dl.jpg" },
  { name: "KMA", logo: "/clients/kma.jpg" },
];

/*
 * 후기 수집용 Google Form URL.
 * 언니가 폼을 만들면 여기에 URL을 채웁니다. 비어 있으면 화면에서 CTA 자체가 숨겨집니다.
 */
const testimonialFormUrl = "";

export const SHARED: SharedAssets = { clients, categoryPhotos, testimonialFormUrl };
