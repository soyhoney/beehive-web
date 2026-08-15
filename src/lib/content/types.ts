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

/**
 * 서비스 카드 콘텐츠. 언니가 제안서에 준 6개 카테고리 각각의 카드 문구.
 * 사진은 SHARED.categoryPhotos 의 같은 id로 매핑됩니다.
 */
export interface ServiceCard {
  /** 견적 폼 카테고리와 매칭되는 id (A~F). SHARED.categoryPhotos 및 CATEGORIES와 공유. */
  id: string;
  /** 카드 제목 — 카테고리 라벨. 예: "동행·수행 출장" */
  title: string;
  /** 헤드카피 — 카드에서 굵게 보여줄 한 줄. */
  headline: string;
  /** 본문 — 카드 하단 설명, 2~3줄 권장. */
  body: string;
  /**
   * 이 서비스에 해당하는 대표 사례 — 카드 하단에 작게 노출됩니다.
   * 별도 "대표 사례" 섹션 대신 각 서비스 카드 안에서 신뢰 시그널을 준다는 취지.
   */
  cases?: readonly ServiceCaseRef[];
  /**
   * 이 분야에서 실제로 수행하는 업무 범위.
   * 2026-08-15 대표가 6개 분야별로 직접 작성해 전달한 목록입니다.
   * 사례처럼 개별 건을 드러내지 않으면서 업무 폭을 보여주는 용도입니다.
   */
  scope?: string;
}

/** 서비스 카드 안에서 짧게 노출되는 대표 사례 한 줄. */
export interface ServiceCaseRef {
  /** 사례 제목 (예: "ICCR 국제화장품규제조화협의체 운영사무국") */
  title: string;
  /** 클라이언트 · 기간 등 짧은 부가 정보 */
  meta: string;
}

export interface Social {
  name: string;
  url: string;
  desc: string;
}

export interface Testimonial {
  /** 시트에서 온 경우 채워짐. dummy fallback은 비어 있어도 됩니다. */
  id?: string;
  /** 성함 */
  name: string;
  /** 직함 (예: 팀장 / 큐레이터 / PD) */
  title: string;
  /** 소속 (예: OO기관 / OO스튜디오) */
  affiliation: string;
  /** 리뷰 본문. 200자 내외 권장 */
  review: string;
  /** yyyy-MM-dd. 있으면 최신순 정렬에 사용됩니다. */
  date?: string;
}

/** 화면에 반복해서 쓰이는 짧은 문구들 */
export interface UiStrings {
  navAbout: string;
  navServices: string;
  navNews: string;
  /** 모바일 메뉴 버튼 aria-label (열기 / 닫기) 과 언어 구획 제목 */
  menuOpen: string;
  menuClose: string;
  menuLanguage: string;
  ctaQuote: string;
  ctaExplore: string;
  ctaCompanyProfile: string;
  ctaAndroidApp: string;
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
  sectionCasesSub: string;
  sectionAbout: string;
  sectionMilestones: string;
  sectionMilestonesEn: string;
  sectionNews: string;
  sectionNewsSub: string;
  sectionSocial: string;
  sectionTestimonials: string;
  sectionTestimonialsSub: string;
  testimonialsFormCta: string;
  finalCtaTitle: string;
  finalCtaSub: string;
  cardCta: string;
  privacyLink: string;
  ceoLabel: string;
  businessNumberLabel: string;
  businessAreasLabel: string;
  labelFeaturedCase: string;
  /** 서비스 카드의 업무 범위 목록 제목 */
  labelScope: string;
  labelAlsoMobile: string;
  labelAlsoMobileSub: string;
  labelNoticesSub: string;
  labelUpdatesSub: string;
  labelVisitLink: string;
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
  socials: readonly Social[];
  testimonials: readonly Testimonial[];
  serviceCards: readonly ServiceCard[];
}

/**
 * 언어와 무관한 자산.
 * 클라이언트 로고와 사진은 번역 대상이 아니므로 한 곳에서만 관리합니다.
 */
export interface SharedAssets {
  clients: readonly Client[];
  categoryPhotos: Record<
    string,
    {
      src: string;
      alt: string;
      /**
       * object-cover 크롭 기준점. CSS `object-position` 값 그대로.
       * 예: "center", "center 30%". 생략 시 브라우저 기본값(50% 50%).
       */
      objectPosition?: string;
    }
  >;
  /** 후기 수집용 Google Form URL. 없으면 CTA 자체가 숨겨집니다. */
  testimonialFormUrl?: string;
}
