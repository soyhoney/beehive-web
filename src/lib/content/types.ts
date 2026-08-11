/**
 * 사이트 콘텐츠의 형태 정의.
 *
 * 한국어(ko.ts)와 영어(en.ts)가 이 타입을 똑같이 구현하므로,
 * 한쪽에 항목을 추가하면 다른 쪽도 채우지 않으면 타입 오류가 납니다.
 * 번역 누락을 컴파일 단계에서 잡기 위한 장치입니다.
 */

export interface Company {
  name: string;
  nameEn: string;
  tagline: string;
  /** 처음 방문한 사람이 3초 안에 "무슨 회사인지" 알 수 있어야 하는 한 줄 */
  serviceLine: string;
  /** 어떤 건으로 견적을 받을 수 있는지 알려주는 문장 */
  heroSub: string;
  philosophy: string;
  address: string;
  tel: string;
  email: string;
  businessNumber: string;
  businessAreas: string;
  since: number;
}

export interface Highlight {
  value: string;
  label: string;
  note?: string;
}

export interface Representative {
  name: string;
  nameEn: string;
  title: string;
  intro: string;
  career: readonly string[];
}

export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export interface TitleDesc {
  title: string;
  desc: string;
}

export interface CaseStudy {
  title: string;
  client: string;
  period: string;
  photo?: string;
  photoFit?: "cover" | "contain";
  points: readonly string[];
}

export interface Client {
  name: string;
  logo: string;
}

/** 화면에 반복해서 쓰이는 짧은 문구들 */
export interface UiStrings {
  navServices: string;
  navScope: string;
  navCases: string;
  navAbout: string;
  ctaQuote: string;
  ctaExplore: string;
  heroHeadline: readonly string[];
  sectionClients: string;
  sectionClientsSub: string;
  sectionServices: string;
  sectionServicesSub: string;
  sectionScope: string;
  sectionScopeEn: string;
  sectionHow: string;
  sectionHowEn: string;
  sectionCases: string;
  sectionCasesEn: string;
  sectionAbout: string;
  sectionMilestones: string;
  sectionMilestonesEn: string;
  finalCtaTitle: string;
  finalCtaSub: string;
  cardCta: string;
  privacyLink: string;
  ceoLabel: string;
  businessNumberLabel: string;
  businessAreasLabel: string;
}

export interface SiteContent {
  company: Company;
  ui: UiStrings;
  highlights: readonly Highlight[];
  achievements: readonly string[];
  representative: Representative;
  milestones: readonly Milestone[];
  workScope: readonly TitleDesc[];
  principles: readonly TitleDesc[];
  process: readonly string[];
  caseStudies: readonly CaseStudy[];
}

/**
 * 언어와 무관한 자산.
 * 클라이언트 로고와 사진은 번역 대상이 아니므로 한 곳에서만 관리합니다.
 */
export interface SharedAssets {
  clients: readonly Client[];
  categoryPhotos: Record<string, { src: string; alt: string }>;
}
