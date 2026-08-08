/**
 * 사이트에 노출되는 회사 정보 · 문구.
 *
 * 내용은 「비하이브코퍼레이션 회사소개서 (2026-07)」에서 옮겼습니다.
 * 코드를 건드리지 않고 이 파일만 고치면 사이트 문구가 바뀝니다.
 */

export const COMPANY = {
  name: "주식회사 비하이브코퍼레이션",
  nameEn: "Beehive Corp",
  tagline: "No one achieves anything alone.",
  /** 처음 방문한 사람이 3초 안에 "무슨 회사인지" 알 수 있어야 하는 한 줄 */
  serviceLine: "통역 · 번역 · 출장 수행 · 국제행사 운영",
  /** 어떤 건으로 견적을 받을 수 있는지 구체적으로 알려주는 문장 */
  heroSub:
    "동시 · 순차 통역부터 문서 · 도록 번역, 국빈 수행 출장, 정부 · 공공기관 사무국 운영까지. 필요한 서비스를 고르시면 1~2분 만에 견적 문의가 완료됩니다.",
  /** 브랜드의 출발점이 되는 문장 */
  philosophy:
    "벌들의 일사불란한 움직임이 벌집을 만들 듯, 비하이브는 서로 다른 언어와 시차, 이해관계 속에서 하나의 목표를 향한 소통을 설계합니다.",
  address: "서울시 영등포구 국제금융로2길 17, 629호 (07327)",
  addressEn:
    "#629, 17, Gukjegeumyung-ro 2-gil, Yeongdeungpo-gu, Seoul, (07327) Republic of Korea",
  tel: "010-6854-2019",
  email: "info@beehivecorp.co.kr",
  businessNumber: "430-86-03070",
  businessAreas:
    "데이터베이스 및 온라인 정보제공업, 번역 및 통역 서비스업, 국제회의 기획 및 대행업, 외국어 교육업, 여행사업",
  /** 통번역 활동 시작 연도 (법인 전환은 2024년) */
  since: 2016,
  incorporatedYear: 2024,
} as const;

/** 히어로 하단에 노출되는 핵심 성과 */
export const HIGHLIGHTS = [
  { value: "10년", label: "통번역 경력", note: "2016~" },
  { value: "800+", label: "수행 프로젝트" },
  { value: "100+", label: "누적 클라이언트" },
  { value: "6년 연속", label: "식약처 ICCR 운영사무국", note: "2021~현재" },
] as const;

/** 성과를 조금 더 자세히 풀어낸 목록 */
export const ACHIEVEMENTS = [
  "6년 연속 식약처 ICCR 국제화장품규제조화협의체 운영사무국 (2021~현재)",
  "37회 이상 식품의약품안전처 · 대한화장품협회 전담 웨비나 통역",
  "5년 연속 화랑미술제 개막식 동시통역 (2022~2026)",
  "그라운드시소 전시회 텍스트 및 도록 번역",
  "인터브랜드 사내 회의 · 인터뷰 · 행사 동시통역",
] as const;

export const REPRESENTATIVE = {
  name: "임선희",
  nameEn: "Sunhee Yim",
  title: "대표이사",
  intro:
    "국빈 의전과 생방송 동시통역, 글로벌 브랜드 촬영 현장처럼 대본 밖 상황이 이어지는 자리에서 10년간 통역해 왔습니다. 정부기관 사무국 운영부터 글로벌 캠페인 촬영까지, 언어와 절차를 함께 설계합니다.",
  career: [
    "성균관대학교 독어독문학 / 경제학과 졸업",
    "서울외국어대학원대학교 한영과 졸업",
    "이화여자대학교 국제컨퍼런스 전문가 과정 수료",
    "US FDA 인허가 대행사 Registrar Corp 한국사무소 대표 역임 (2023–2025)",
  ],
} as const;

export const MILESTONES = [
  {
    year: "2016",
    title: "영어 통역 · 번역 프로젝트 활동 시작",
    desc: "KOTRA 수출상담회, MBC 방송 통역, 부산국제영화제 공식 통역사, 하이디스테크놀로지 법무팀 인하우스 통번역",
  },
  {
    year: "2019",
    title: "‘비하이브’ 개인사업자 설립",
    desc: "Apple–LG U+ · MAC · Tiffany · Chopard 글로벌 캠페인, 대한항공 접근성 감사 통역",
  },
  {
    year: "2021",
    title: "식약처 ICCR 국제협의체 운영사무국 수주",
    desc: "식품의약품안전처 · 대한화장품협회 — 현재까지 6년 연속 운영",
  },
  {
    year: "2024",
    title: "주식회사 비하이브코퍼레이션 법인 전환",
    desc: "스페인 교육부 장관 사절단 수행통역, 수출입은행 ODA, 국제 전시 도록 번역",
  },
] as const;

/** 회사소개서의 Work Scope 6개 영역 */
export const WORK_SCOPE = [
  {
    title: "정부 · 공공기관",
    desc: "통역, 번역, 국제회의, 사무국 운영에서 입찰 · 계약 · 행정 서류까지, 담당자가 바뀌어도 흔들리지 않는 프로젝트 파트너",
  },
  {
    title: "방송 · 행사 통역",
    desc: "방송 · 촬영 · 행사 · CF · 영화 · 인터뷰 — 시나리오와 대본 밖 상황에도 유연하게 대응하며 매끄럽게 진행하는 현장 통역과 실시간 번역",
  },
  {
    title: "동행 · 수행 출장",
    desc: "기획부터 의전 · 수송 · 보고서까지, 성공적인 국내 국빈 수행 및 해외 출장을 믿고 맡길 수 있는 수행 서비스",
  },
  {
    title: "번역 · 출판",
    desc: "전시회 텍스트 · 도록 · 영화 자막 · 기고문 · 서적 — 정확한 의도 파악과 일정안을 시작으로, 클라이언트 피드백과 전문가 검수로 완성되는 번역",
  },
  {
    title: "산업 · 전문분야 통역",
    desc: "ISO · GMP 인증 감사, 기술 교류, 국제 컨소시엄, 비즈니스, 기업 내부 회의, 입찰 등 전문적인 수준의 통역 및 네트워크 제공",
  },
  {
    title: "교육 양성",
    desc: "영어 발표 · 회의 · 교육의 언어 장벽을 낮추고 트레이닝이 효율적으로 전달 · 학습되도록 비하이브코퍼레이션이 함께합니다.",
  },
] as const;

/** 작업 방식 — 3가지 약속 */
export const PRINCIPLES = [
  {
    title: "실적으로 검증합니다",
    desc: "정부기관 연속 수주와 높은 재계약 체결을 기반으로 정확하고 효율적인 기획 및 계약을 자부합니다.",
  },
  {
    title: "행정까지 책임집니다",
    desc: "과업 외의 절차가 프로젝트의 품질을 저하시키거나 지연시키지 않도록 법인 단위로 매끄럽게 처리합니다.",
  },
  {
    title: "현장에서 완성합니다",
    desc: "국빈 의전, 생방송 동시통역, 글로벌 브랜드 촬영 현장, 인터뷰 등 대본 밖 상황에 대응하는 것이 실력입니다.",
  },
] as const;

/** 견적 문의부터 정산까지의 진행 단계 */
export const PROCESS = [
  "견적 문의",
  "상담 · 계약 · NDA",
  "사전 브리핑",
  "과업 수행",
  "결과 보고",
  "정산 · 세금계산서 발행",
] as const;

/**
 * 견적 카테고리(A~F)별 대표 사진.
 * 기존 사이트에 올라와 있던 실제 현장 사진을 웹용으로 축소해 가져왔습니다.
 * 기타 문의(F)는 대응하는 사진이 없어 비워 둡니다.
 */
export const CATEGORY_PHOTOS: Record<string, { src: string; alt: string }> = {
  A: {
    src: "/photos/business-trip.jpg",
    alt: "호텔 연회장에서 진행된 국제회의 현장",
  },
  B: {
    src: "/photos/public-project.jpg",
    alt: "KIST에서 열린 스페인 마드리드 사절단 회의",
  },
  C: {
    src: "/photos/interpretation.jpg",
    alt: "미디어아트 전시 행사장 전경",
  },
  D: {
    src: "/photos/translation.jpg",
    alt: "그라운드시소 〈우연히 웨스 앤더슨 2〉 전시 전경",
  },
  E: {
    src: "/photos/training.jpg",
    alt: "대강당에서 진행된 교육 프로그램",
  },
};

/** 대표 사례 */
export const CASE_STUDIES = [
  {
    title: "ICCR 국제화장품규제조화협의체 운영사무국",
    client: "식품의약품안전처 · 대한화장품협회",
    period: "2021 ~ 현재 (6년 연속)",
    photo: "/photos/public-project.jpg",
    points: [
      "16회기 사무국 · 공동의장 — 정부부처와 국제기구 간 협의체 운영 전반",
      "분기 · 연례 · Working Group 회의 영–한 2채널 동시통역, 회의록 작성 및 번역",
      "규제 조항 · 기술문서 · 위해성 평가 · SCCS 의견서 등 규제 전문 번역",
      "세미나 · 웨비나 통역 37회 이상 (2022~2026)",
    ],
  },
  {
    title: "글로벌 캠페인 촬영 동시통역",
    client: "MAC · Chopard",
    period: "2020 ~ 2021",
    photo: "/photos/interpretation.jpg",
    points: [
      "국내 최초 촬영장 Zoom 실시간 중계 통역 도입",
      "해외 광고주 · 아트디렉터 팀과 한국 제작팀 간 촬영 전 과정 생중계 동시통역",
      "MAC 아태지역 캠페인 3차에 걸친 기획회의 · 프리라이팅 · 본촬영 통역",
      "Chopard ‘Happy Project’ 촬영 및 사후 편집회의 동시통역",
    ],
  },
  {
    title: "그라운드시소 전시회 텍스트 및 도록 번역",
    client: "그라운드시소",
    period: "2020 ~ 2025",
    photo: "/photos/translation.jpg",
    points: [
      "〈무민 75주년〉 전시 영상 자막 및 텍스트 번역",
      "〈모네 인사이드〉 도록 번역 (한→영)",
      "〈우연히 웨스 앤더슨 2〉 전시 텍스트 · 도록 번역 (영→한)",
      "〈조나단 베르탱〉 전시 텍스트 · 도록 번역 (한↔영)",
    ],
  },
  {
    title: "다큐멘터리 〈옥순로그〉 장기 번역 프로젝트",
    client: "EIDF · 전주국제영화제",
    period: "2021 ~ 2023",
    photo: "/photos/oksun-log.jpg",
    // 세로 포스터라 잘라내지 않고 전체가 보이도록 합니다.
    photoFit: "contain" as const,
    points: [
      "제작부터 국제영화제 출품까지 2년의 과정을 함께한 장기 번역",
      "EIDF 사전제작 멘토링 세션 통역, 트레일러 자막 번역",
      "내레이션 대본 · 출품 피칭 스크립트 · 카탈로그 번역",
      "EIDF 서울산업진흥원 다큐멘터리 부문 최우수상 · 2023 전주국제영화제 출품작",
    ],
  },
] as const;

/**
 * 주요 클라이언트.
 * 로고 이미지는 기존 사이트(홈 Clients 섹션)에 올라와 있던 300×100 원본입니다.
 */
export const CLIENTS = [
  { name: "식품의약품안전처", logo: "/clients/mfds.jpg" },
  { name: "대한화장품협회", logo: "/clients/kcia.jpg" },
  { name: "현대로템", logo: "/clients/hyundai-rotem.jpg" },
  { name: "그라운드시소", logo: "/clients/groundseesaw.jpg" },
  { name: "AdQUA Interactive", logo: "/clients/adqua.jpg" },
  { name: "KOTRA", logo: "/clients/kotra.jpg" },
  { name: "주한미국대사관", logo: "/clients/us-embassy.jpg" },
  { name: "KBS", logo: "/clients/kbs.jpg" },
  { name: "국민일보", logo: "/clients/kmib.jpg" },
  { name: "대한적십자사", logo: "/clients/korean-red-cross.jpg" },
  { name: "DL", logo: "/clients/dl.jpg" },
  { name: "한국화랑협회", logo: "/clients/galleries-association.jpg" },
  { name: "한국관광공사", logo: "/clients/kto.jpg" },
  { name: "부산국제영화제", logo: "/clients/biff.jpg" },
  { name: "ARTPOINT", logo: "/clients/artpoint.jpg" },
  { name: "ikp", logo: "/clients/ikp.jpg" },
  { name: "SPC", logo: "/clients/spc.jpg" },
  { name: "Lutronic", logo: "/clients/lutronic.jpg" },
  { name: "한국수출입은행", logo: "/clients/koreaexim.jpg" },
  { name: "KOICA", logo: "/clients/koica.jpg" },
  { name: "주스페인 대한민국대사관", logo: "/clients/embassy-spain.jpg" },
  { name: "MBC", logo: "/clients/mbc.jpg" },
  { name: "롯데월드", logo: "/clients/lotte-world.jpg" },
  { name: "SK", logo: "/clients/sk.jpg" },
  { name: "대한항공", logo: "/clients/korean-air.jpg" },
  { name: "LG U+", logo: "/clients/lg-uplus.jpg" },
  { name: "주포르투갈 대한민국대사관", logo: "/clients/embassy-portugal.jpg" },
  { name: "농림축산검역본부", logo: "/clients/qia.jpg" },
  { name: "SNU Medicine", logo: "/clients/snu-medicine.jpg" },
  { name: "EBS", logo: "/clients/ebs.jpg" },
  { name: "충남테크노파크", logo: "/clients/ctp.jpg" },
  { name: "문화일보", logo: "/clients/munhwa.jpg" },
  { name: "KMA", logo: "/clients/kma.jpg" },
] as const;
