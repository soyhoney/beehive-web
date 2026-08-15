/**
 * 견적 문의 플로우 정의.
 *
 * 기존 운영 중인 견적 폼(zippy-medovik-0a8761.netlify.app, beehivecorp.co.kr/page/?11 에
 * iframe으로 삽입)의 질문 구조를 그대로 옮긴 것입니다. 문항을 바꾸려면 이 파일만 고치면
 * 폼 렌더링 · 유효성 검사 · 저장 · 견적 계산이 모두 따라옵니다.
 *
 * 한 화면에 한 질문씩 보여주는 단계형(wizard) 폼입니다.
 */

export type QuestionType =
  /** 보기 중 선택 */
  | "choice"
  /** 여러 줄 서술 */
  | "text"
  /** 한 줄 입력 */
  | "text1"
  /** 시작일·종료일 (+ 미정 처리) */
  | "dates";

/** 특정 보기를 고르면 이어서 노출되는 2차 선택지 */
export interface SubChoice {
  /** 이 인덱스의 보기를 골랐을 때 노출 */
  when: number;
  options: readonly string[];
  /** 직접 입력을 허용할 경우의 라벨 */
  textLabel?: string;
  textPh?: string;
}

/**
 * 특정 보기를 고르면 이어서 노출되는 추가 입력.
 * options를 주면 직접 타이핑 대신 선택지로 표시합니다.
 */
export interface FollowInput {
  when: number;
  label: string;
  ph: string;
  options?: readonly string[];
}

/** 특정 보기를 고르면 노출되는 안내 문구 */
export interface HintWhen {
  when: number;
  text: string;
}

/** 일정 미정 처리 */
export interface TbdConfig {
  hint: string;
  label: string;
  ph: string;
}

/** dates 질문에 덧붙는 추가 입력 (총 시간·일수 등). options를 주면 선택지로 표시합니다. */
export interface ExtraInput {
  label: string;
  ph: string;
  options?: readonly string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  /** 제목 아래 보조 설명 */
  sub?: string;
  ph?: string;
  /** "라벨|보조설명" 형식을 허용한다. parseOption() 으로 분리한다. */
  options?: readonly string[];
  subChoice?: SubChoice;
  followInput?: FollowInput;
  hint?: HintWhen;
  tbd?: TbdConfig;
  extraInput?: ExtraInput;
  /** 파일 첨부 허용 */
  file?: boolean;
  fileNote?: string;
}

export interface Category {
  id: string;
  title: string;
  desc: string;
}

const q = (
  id: string,
  type: QuestionType,
  title: string,
  opts: Partial<Question> = {},
): Question => ({ id, type, title, ...opts });

// ---------------------------------------------------------------------------
// 분야
// ---------------------------------------------------------------------------

export const FIELDS_MAIN = [
  "인문/사회/역사/철학/문학",
  "미술/예술",
  "문화/관광/스포츠",
  "비즈니스/무역/마케팅",
  "IT/정보통신",
  "의학/의료/제약/바이오",
  "뷰티/미용",
  "컴플라이언스/법률/법무/인허가/거버넌스",
  "엔터테인먼트/방송/영상/콘텐츠",
  "출판/교육",
  "기타",
] as const;

export const FIELDS_SUB = [
  "경제/경영",
  "항만/물류/유통",
  "건설/건축",
  "환경/기후/수자원",
  "식품/생필품/농림",
  "전기/전자",
  "자동차/기계/화학",
  "게임/미디어",
  "금융/보험/세무회계",
  "물리/화학/해양",
  "의류/섬유/패션",
] as const;

// ---------------------------------------------------------------------------
// 공통 선택지
//
// 자유 입력 대신 구간으로 받습니다. 입력 부담이 줄어 이탈이 적고,
// 정형화된 값이라 나중에 견적 자동 산출의 근거로 쓸 수 있습니다.
// 마지막 "직접 입력"을 고르면 따로 적을 수 있게 열어둡니다.
// ---------------------------------------------------------------------------

export const DIRECT_INPUT = "직접 입력";

/** 수행 인원 규모 */
export const HEADCOUNT_OPTIONS = [
  "1명",
  "2~3명",
  "4~6명",
  "7~10명",
  "11명 이상",
] as const;

/** 예산 구간 */
export const BUDGET_OPTIONS = [
  "100만원 미만",
  "100~300만원",
  "300~500만원",
  "500~1,000만원",
  "1,000~3,000만원",
  "3,000만원 이상",
] as const;

/** 과업 기간 구간 */
export const PERIOD_OPTIONS = [
  "1개월 이내",
  "1~3개월",
  "3~6개월",
  "6개월~1년",
  "1년 이상",
  "미정",
  DIRECT_INPUT,
] as const;

/** 행사 투입 시간 */
export const DURATION_OPTIONS = [
  "반일 (4시간 이내)",
  "1일 (8시간 이내)",
  "2~3일",
  "1주일 이상",
] as const;

/** 번역 분량 구간 */
/*
 * 분량 선택지. (2026-08-15 회의 및 대표 요청 반영)
 *
 * 바뀐 점 두 가지 —
 * ① 영상 분량(30분 이내 / 30~120분 / 120분 이상)을 뺐습니다. 번역 문의에서
 *    영상은 실제로 거의 들어오지 않아 선택지만 늘리고 있었습니다.
 * ② 단위를 "A4" 에서 "장" 으로 바꿨습니다. 실무에서 가장 많이 들어오는 것이
 *    PPT 인데 A4 라고 물으면 슬라이드 수를 어디에 적을지 알 수 없었습니다.
 *    "장" 은 페이지와 슬라이드를 함께 받습니다.
 */
export const VOLUME_OPTIONS = [
  "10장 이내",
  "10~30장",
  "30~100장",
  "100장 이상",
  "아직 모름",
  DIRECT_INPUT,
] as const;

/** "기타"(마지막 항목)를 고르면 세부 분야 목록을 다시 보여준다. */
const fieldQ = (): Question =>
  q("field", "choice", "분야를 선택해 주세요.", {
    options: FIELDS_MAIN,
    subChoice: {
      when: FIELDS_MAIN.length - 1,
      options: FIELDS_SUB,
      textLabel: "직접 입력",
      textPh: "분야를 적어주세요",
    },
  });

const budgetQ = (): Question =>
  q("budget", "choice", "예산 범위가 있으신가요?", {
    options: ["미정 — 견적을 받아보고 싶어요", "예산 범위가 있어요"],
    followInput: {
      when: 1,
      label: "예산 범위",
      ph: "예: 300~500만원",
      options: BUDGET_OPTIONS,
    },
  });

const ndaQ = (title?: string): Question =>
  q("nda", "choice", title ?? "기밀유지계약(NDA)이 필요한가요?", {
    options: ["필요합니다", "필요하지 않습니다", "아직 모르겠습니다"],
  });

// ---------------------------------------------------------------------------
// 카테고리
// ---------------------------------------------------------------------------

export const CATEGORIES: readonly Category[] = [
  {
    id: "A",
    title: "동행·수행 출장",
    desc: "매번 인맥에 기대지 않아도 되는 프라이빗 동행 서비스",
  },
  {
    id: "B",
    title: "프로젝트",
    desc: "담당자가 바뀌어도 프로젝트는 계속되어야 합니다",
  },
  {
    id: "C",
    title: "방송·행사·전문 통역",
    desc: "현장은 실전이니까요",
  },
  {
    id: "D",
    title: "미디어·출판 번역",
    desc: "빠른 납기에도, 격을 잃지 않습니다",
  },
  {
    id: "E",
    title: "교육 양성",
    desc: "영어로 진행되는 발표·회의·소통·교육의 언어 장벽을 낮춥니다",
  },
  {
    id: "F",
    title: "기타 프로젝트",
    desc: "절차가 필요한 곳에서 비하이브가 대신 움직입니다",
  },
] as const;

export type CategoryId = "A" | "B" | "C" | "D" | "E" | "F";

// ---------------------------------------------------------------------------
// 카테고리별 문항
// ---------------------------------------------------------------------------

export const FLOW_A: readonly Question[] = [
  q("dates", "dates", "출장 일정을 알려주세요.", {
    sub: "대략적인 일정도 괜찮습니다.",
    tbd: {
      hint: "대략적인 일정과 기간을 알려주시면, 가능한 일정을 제안드립니다.",
      label: "대략적인 일정·기간",
      ph: "예: 10월 중순경, 3~4일",
    },
  }),
  q("region", "choice", "어느 지역인가요?", {
    options: ["국내", "해외"],
    subChoice: { when: 0, options: ["수도권", "지방"] },
    followInput: { when: 1, label: "국가·도시", ph: "예: 미국 라스베거스" },
  }),
  q("target", "choice", "수행 대상을 알려주세요.", {
    options: ["개인", "그룹"],
    followInput: {
      when: 1,
      label: "인원수",
      ph: "예: 6명",
      options: HEADCOUNT_OPTIONS,
    },
  }),
  q("logis", "choice", "교통편·숙소 제공 여부를 알려주세요.", {
    sub: "수행 인력의 이동·체류 기준입니다.",
    options: ["교통편·숙소 모두 제공됩니다", "별도로 제공되어야 합니다"],
    hint: {
      when: 1,
      text: "일시, 행사 장소 등 세부 내역을 안건 항목에서 기재 또는 첨부해 주세요.",
    },
  }),
  fieldQ(),
  q("detail", "text", "안건을 알려주세요.", {
    sub: "자세할수록 정확한 견적이 가능합니다.",
    ph: "예: 2026 CES 컨퍼런스 대표 및 임원진 출장 수행통역 (2월 라스베거스, 3인 총 4박 5일, 연사 발표 있음)",
    file: true,
    fileNote:
      "교통편, 숙소 별도 제공 체크해주신 분들은 일시, 행사 장소 등 세부 내역을 기재 또는 첨부해주세요.",
  }),
  ndaQ(),
  budgetQ(),
];

export const FLOW_B: readonly Question[] = [
  q("period", "choice", "과업 기간을 알려주세요.", {
    sub: "세부 일정이 미정이면 대략적인 기간으로 골라주셔도 됩니다.",
    options: PERIOD_OPTIONS,
    followInput: {
      when: PERIOD_OPTIONS.indexOf(DIRECT_INPUT),
      label: "과업 기간",
      ph: "예: 2026년 9월 ~ 2027년 5월 (9개월)",
    },
  }),
  q("mode", "choice", "수행 방식을 선택해 주세요.", {
    options: ["재택", "지정 장소", "하이브리드(혼합)"],
  }),
  q("detail", "text", "과업 내용을 알려주세요.", {
    sub: "입찰 건은 공고 링크를 남겨주셔도 됩니다.",
    ph: "예: 2027 신규 브랜드 런칭 및 제조공장 설립 회의 동시통역, 회의록 작성 (9개월)",
    file: true,
  }),
  fieldQ(),
  ndaQ("기밀유지계약(NDA)·보안서약이 필요한가요?"),
  budgetQ(),
];

export const FLOW_C: readonly Question[] = [
  q("dates", "dates", "행사 일시와 규모를 알려주세요.", {
    sub: "대략적인 일정도 괜찮습니다.",
    tbd: {
      hint: "대략적인 일정과 기간을 알려주시면, 가능한 일정을 제안드립니다.",
      label: "대략적인 일정·기간",
      ph: "예: 11월 초, 반나절 행사",
    },
    extraInput: {
      label: "총 시간 또는 일수",
      ph: "예: 1일 6시간 / 2일간 오전만",
      options: DURATION_OPTIONS,
    },
  }),
  q("mode", "choice", "진행 방식을 선택해 주세요.", {
    options: ["오프라인", "온라인", "하이브리드(혼합)"],
  }),
  fieldQ(),
  q("type", "choice", "통역 유형을 선택해 주세요.", {
    options: [
      "동시통역 — 부스",
      "동시통역 — 위스퍼링",
      "순차통역",
      "잘 모르겠어요",
    ],
    hint: {
      when: 3,
      text: "다음 항목에서 행사 성격을 알려주시면 저희가 적합한 유형을 제안드립니다.",
    },
  }),
  q("detail", "text", "행사·안건을 알려주세요.", {
    ph: "예: 글로벌 브랜드 신제품 런칭 기자간담회, 외신 Q&A 포함",
    file: true,
  }),
  budgetQ(),
];

export const FLOW_D: readonly Question[] = [
  q("doctype", "choice", "문서 유형을 선택해 주세요.", {
    options: [
      "번역공증이 필요한 서류",
      "서적·도록·브로슈어",
      "기술문서·논문·일반문서",
      "웹사이트·홍보물",
      "영상 자막·스크립트",
      "번역 감수(기번역물)",
      "기타",
    ],
  }),
  q("due", "choice", "희망 납기를 선택해 주세요.", {
    options: [
      "급행 (24시간 이내)",
      "1주일 이내",
      "2주일 이내",
      "한 달 이상",
      "협의 가능",
    ],
  }),
  fieldQ(),
  q("detail", "text", "내용을 간단히 알려주세요.", {
    sub: "지금 파일이 없어도 문의 가능합니다.",
    ph: "예: 전시 도록 국문→영문, 인쇄 일정상 3주 내 완료 필요",
  }),
  q("volume", "choice", "분량을 대략 알려주세요.", {
    sub: "페이지 또는 슬라이드 기준입니다. 정확하지 않아도 되고, 파일이 있으면 첨부해 주세요.",
    options: VOLUME_OPTIONS,
    followInput: {
      when: VOLUME_OPTIONS.indexOf(DIRECT_INPUT),
      label: "분량",
      ph: "예: 30페이지 / PPT 50슬라이드",
    },
    file: true,
  }),
  ndaQ(),
  budgetQ(),
];

/** E는 교육 유형에 따라 이후 문항이 갈린다. */
export const E_TYPE: Question = q(
  "etype",
  "choice",
  "어떤 교육이 필요하세요?",
  {
    sub: "표준 수업은 바로 신청 가능하며, 커스텀 서비스는 별도 문의로 진행됩니다.",
    options: [
      "개인·그룹 영어 수업",
      "기업·기관 교육|사내교육, 리더십교육, 인증감사, ODA 등",
    ],
  },
);

export const FLOW_E_PERSONAL: readonly Question[] = [
  q("lesson", "choice", "수업 형태를 선택해 주세요.", {
    sub: "사전 화상 상담(25분)도 가능합니다 — 접수 후 예약 링크를 보내드립니다.",
    options: [
      "화상 영어 수업 — 70,000원부터 / 50분 (개인·단체)|원어민 또는 한국인 전문가 중 선택",
      "대면 개인 수업(과외) — 200,000원부터 / 100분|수도권 한정 · FASTFIVE 사무실 수업 가능",
      "대면 단체 수업(맞춤 강의·출장) — 600,000원부터 / 100분|기관·그룹 대상 맞춤형",
      "커스텀 서비스 — 별도 문의",
    ],
  }),
  q("period", "choice", "기간을 선택해 주세요.", {
    sub: "단체·장기 수업은 할인율이 적용됩니다.",
    options: ["단기 (3개월 이내)", "장기 (3개월 이상)", "미정"],
  }),
  q("mode", "choice", "방식을 선택해 주세요.", {
    options: ["온라인", "오프라인", "혼합"],
  }),
  q("detail", "text", "대상과 목적을 알려주세요.", {
    ph: "예: 월·수 오전 7시부터 8시까지 주 2회 1년 / 다음달 학회 발표를 위한 40분짜리 강의 준비 및 스크립트 발표 가이드",
  }),
  q("pay", "choice", "결제 방법을 선택해 주세요.", {
    options: [
      "신용카드 결제링크",
      "통장 입금",
      "전자계산서 발행 후 통장입금",
      "현장 신용카드 결제",
    ],
  }),
];

export const FLOW_E_CORP: readonly Question[] = [
  fieldQ(),
  q("detail", "text", "대상과 목적을 알려주세요.", {
    sub: "교육이 필요한 콘텐츠, 수강생 인원, 발표 자료 유무, 통역·번역 필요 여부 등 세부사항을 적어주세요.",
    ph: "예: ISO13485 인증수료 통역·번역 포함, 교육 이수 30시간 과정, 수강생 8명",
    file: true,
  }),
  q("period", "choice", "기간을 선택해 주세요.", {
    options: ["단기 (2주 이내)", "장기 (1달 이상)", "미정"],
  }),
  q("mode", "choice", "방식을 선택해 주세요.", {
    sub: "세부 내역 확인 후 커리큘럼·형태·기간을 컨펌하고 견적을 드립니다.",
    options: ["온라인", "오프라인", "혼합"],
  }),
];

export const FLOW_F: readonly Question[] = [
  q("detail", "text", "문의 내용을 자유롭게 알려주세요.", {
    sub: "이메일 또는 통화로 세부 내역을 확인한 뒤, 커리큘럼·형태·기간을 컨펌하고 견적을 드립니다.",
    ph: "문의 내용을 입력해 주세요.",
    file: true,
  }),
];

// ---------------------------------------------------------------------------
// 연락처 · 유입경로
// ---------------------------------------------------------------------------

export interface ContactField {
  id: string;
  label: string;
  type: "text" | "email" | "tel";
  ph: string;
}

export const CONTACT_FIELDS: readonly ContactField[] = [
  { id: "org", label: "업체·기관명", type: "text", ph: "예: 주식회사 OO" },
  { id: "name", label: "담당자명", type: "text", ph: "이름" },
  { id: "email", label: "이메일", type: "email", ph: "name@company.com" },
  { id: "phone", label: "휴대폰", type: "tel", ph: "010-0000-0000" },
] as const;

export const ROUTES = [
  "기존 고객",
  "지인 추천",
  "네이버 검색",
  "구글 검색",
  "인스타그램",
  "링크드인",
  "유튜브",
  "블로그·카페",
  "기타",
] as const;

/** "지인 추천"을 고르면 추천인 입력을 받는다. */
export const ROUTE_REFERRAL = "지인 추천";
/** "기타"를 고르면 직접 입력을 받는다. */
export const ROUTE_ETC = "기타";

// ---------------------------------------------------------------------------
// 헬퍼
// ---------------------------------------------------------------------------

/** "라벨|보조설명" 형식의 보기를 분리한다. */
export function parseOption(option: string): { label: string; desc?: string } {
  const [label, desc] = option.split("|");
  return { label, desc: desc || undefined };
}

/**
 * 카테고리와 지금까지의 답변으로 문항 목록을 만든다.
 * E는 첫 문항(etype) 답변에 따라 이후 문항이 달라진다.
 */
export function getFlow(
  categoryId: CategoryId,
  answers: Record<string, { idx?: number }> = {},
): readonly Question[] {
  switch (categoryId) {
    case "A":
      return FLOW_A;
    case "B":
      return FLOW_B;
    case "C":
      return FLOW_C;
    case "D":
      return FLOW_D;
    case "F":
      return FLOW_F;
    case "E": {
      const etype = answers["etype"];
      if (!etype || etype.idx === undefined) return [E_TYPE, ...FLOW_E_PERSONAL];
      return [E_TYPE, ...(etype.idx === 0 ? FLOW_E_PERSONAL : FLOW_E_CORP)];
    }
  }
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
