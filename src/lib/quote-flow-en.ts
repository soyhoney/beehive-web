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
  "Humanities / social sciences / history / philosophy / literature",
  "Fine arts / arts",
  "Culture / tourism / sports",
  "Business / trade / marketing",
  "IT / telecommunications",
  "Medicine / healthcare / pharmaceuticals / bio",
  "Beauty / cosmetics",
  "Compliance / legal / regulatory / licensing / governance",
  "Entertainment / broadcasting / film / content",
  "Publishing / education",
  "Other",
] as const;

export const FIELDS_SUB = [
  "Economics / management",
  "Ports / logistics / distribution",
  "Construction / architecture",
  "Environment / climate / water resources",
  "Food / consumer goods / agriculture",
  "Electrical / electronics",
  "Automotive / machinery / chemicals",
  "Games / media",
  "Finance / insurance / tax and accounting",
  "Physics / chemistry / marine",
  "Apparel / textiles / fashion",
] as const;

// ---------------------------------------------------------------------------
// 공통 선택지
//
// 자유 입력 대신 구간으로 받습니다. 입력 부담이 줄어 이탈이 적고,
// 정형화된 값이라 나중에 견적 자동 산출의 근거로 쓸 수 있습니다.
// 마지막 "직접 입력"을 고르면 따로 적을 수 있게 열어둡니다.
// ---------------------------------------------------------------------------

export const DIRECT_INPUT = "Enter manually";

/** 수행 인원 규모 */
export const HEADCOUNT_OPTIONS = [
  "1 person",
  "2-3 people",
  "4-6 people",
  "7-10 people",
  "11 or more",
] as const;

/** 예산 구간 */
export const BUDGET_OPTIONS = [
  "Under 1M KRW",
  "1M-3M KRW",
  "3M-5M KRW",
  "5M-10M KRW",
  "10M-30M KRW",
  "30M KRW or more",
] as const;

/** 과업 기간 구간 */
export const PERIOD_OPTIONS = [
  "Within 1 month",
  "1-3 months",
  "3-6 months",
  "6 months - 1 year",
  "1 year or more",
  "Undecided",
  DIRECT_INPUT,
] as const;

/** 행사 투입 시간 */
export const DURATION_OPTIONS = [
  "Half day (within 4 hours)",
  "1 day (within 8 hours)",
  "2-3 days",
  "1 week or more",
] as const;

/** 번역 분량 구간 */
export const VOLUME_OPTIONS = [
  "Up to 10 A4 pages",
  "10-30 A4 pages",
  "30-100 A4 pages",
  "100+ A4 pages",
  "Up to 30 minutes of video",
  "30-120 minutes of video",
  "120+ minutes of video",
  "Not sure yet",
  DIRECT_INPUT,
] as const;

/** "기타"(마지막 항목)를 고르면 세부 분야 목록을 다시 보여준다. */
const fieldQ = (): Question =>
  q("field", "choice", "Please select a field.", {
    options: FIELDS_MAIN,
    subChoice: {
      when: FIELDS_MAIN.length - 1,
      options: FIELDS_SUB,
      textLabel: "Enter manually",
      textPh: "Please describe the field",
    },
  });

const budgetQ = (): Question =>
  q("budget", "choice", "Do you have a target budget range?", {
    options: ["Undecided — I'd like to receive a quote first", "I have a budget range"],
    followInput: {
      when: 1,
      label: "Budget range",
      ph: "e.g., 3M-5M KRW",
      options: BUDGET_OPTIONS,
    },
  });

const ndaQ = (title?: string): Question =>
  q("nda", "choice", title ?? "Do you require a non-disclosure agreement (NDA)?", {
    options: ["Yes, required", "Not required", "Not sure yet"],
  });

// ---------------------------------------------------------------------------
// 카테고리
// ---------------------------------------------------------------------------

export const CATEGORIES: readonly Category[] = [
  {
    id: "A",
    title: "Executive escort & business trips",
    desc: "Private escort interpretation you can rely on without falling back on personal networks",
  },
  {
    id: "B",
    title: "Projects",
    desc: "Your project should keep moving forward, even when your point of contact changes",
  },
  {
    id: "C",
    title: "Broadcast, events & specialist interpretation",
    desc: "Because the field is where it really counts",
  },
  {
    id: "D",
    title: "Media & publishing translation",
    desc: "Fast turnaround without compromising on quality",
  },
  {
    id: "E",
    title: "Training & education",
    desc: "Lowering language barriers in English-language presentations, meetings, communications and training",
  },
  {
    id: "F",
    title: "Other projects",
    desc: "Beehive steps in wherever formal procedures are required",
  },
] as const;

export type CategoryId = "A" | "B" | "C" | "D" | "E" | "F";

// ---------------------------------------------------------------------------
// 카테고리별 문항
// ---------------------------------------------------------------------------

export const FLOW_A: readonly Question[] = [
  q("dates", "dates", "Please share your trip schedule.", {
    sub: "An approximate schedule is fine.",
    tbd: {
      hint: "Let us know your rough schedule and duration, and we'll propose available dates.",
      label: "Approximate schedule & duration",
      ph: "e.g., mid-October, 3-4 days",
    },
  }),
  q("region", "choice", "Which region?", {
    options: ["Domestic (Korea)", "Overseas"],
    subChoice: { when: 0, options: ["Seoul metropolitan area", "Regional"] },
    followInput: { when: 1, label: "Country & city", ph: "e.g., Las Vegas, USA" },
  }),
  q("target", "choice", "Who will the interpreter accompany?", {
    options: ["Individual", "Group"],
    followInput: {
      when: 1,
      label: "Number of people",
      ph: "e.g., 6 people",
      options: HEADCOUNT_OPTIONS,
    },
  }),
  q("logis", "choice", "Will transportation and accommodation be provided?", {
    sub: "This refers to travel and lodging for our interpreter(s).",
    options: ["Both transportation and accommodation will be provided", "They need to be arranged separately"],
    hint: {
      when: 1,
      text: "Please include details such as date, time, and venue in the agenda section below, or attach a file.",
    },
  }),
  fieldQ(),
  q("detail", "text", "Please describe the agenda.", {
    sub: "The more detail you share, the more accurate the quote will be.",
    ph: "e.g., Escort interpretation for executives at CES 2026 conference (Las Vegas, February, 3 people, 4 nights 5 days, includes speaker presentation)",
    file: true,
    fileNote:
      "If you selected that transportation and accommodation must be arranged separately, please include details such as date, time, and venue, or attach a file.",
  }),
  ndaQ(),
  budgetQ(),
];

export const FLOW_B: readonly Question[] = [
  q("period", "choice", "Please share the project duration.", {
    sub: "If the detailed schedule is not fixed, you may choose an approximate duration.",
    options: PERIOD_OPTIONS,
    followInput: {
      when: PERIOD_OPTIONS.indexOf(DIRECT_INPUT),
      label: "Project duration",
      ph: "e.g., September 2026 - May 2027 (9 months)",
    },
  }),
  q("mode", "choice", "Please select the working arrangement.", {
    options: ["Remote", "On-site (designated location)", "Hybrid"],
  }),
  q("detail", "text", "Please describe the project.", {
    sub: "For bid opportunities, you may share the tender notice link.",
    ph: "e.g., Simultaneous interpretation and meeting minutes for 2027 new brand launch and manufacturing plant setup meetings (9 months)",
    file: true,
  }),
  fieldQ(),
  ndaQ("Do you require a non-disclosure agreement (NDA) or security pledge?"),
  budgetQ(),
];

export const FLOW_C: readonly Question[] = [
  q("dates", "dates", "Please share the date and scale of the event.", {
    sub: "An approximate schedule is fine.",
    tbd: {
      hint: "Let us know your rough schedule and duration, and we'll propose available dates.",
      label: "Approximate schedule & duration",
      ph: "e.g., early November, half-day event",
    },
    extraInput: {
      label: "Total hours or number of days",
      ph: "e.g., 1 day 6 hours / mornings only over 2 days",
      options: DURATION_OPTIONS,
    },
  }),
  q("mode", "choice", "Please select the delivery format.", {
    options: ["Offline", "Online", "Hybrid"],
  }),
  fieldQ(),
  q("type", "choice", "Please select the type of interpretation.", {
    options: [
      "Simultaneous interpretation - booth",
      "Simultaneous interpretation - whispering",
      "Consecutive interpretation",
      "Not sure",
    ],
    hint: {
      when: 3,
      text: "Tell us about the nature of the event in the next question, and we'll recommend the right format.",
    },
  }),
  q("detail", "text", "Please describe the event and agenda.", {
    ph: "e.g., Press conference for a global brand's new product launch, including Q&A with foreign press",
    file: true,
  }),
  budgetQ(),
];

export const FLOW_D: readonly Question[] = [
  q("doctype", "choice", "Please select the document type.", {
    options: [
      "Documents requiring notarized translation",
      "Books, exhibition catalogues, brochures",
      "Technical documents, papers, general documents",
      "Websites, promotional materials",
      "Video subtitles / scripts",
      "Translation review (of existing translation)",
      "Other",
    ],
  }),
  q("due", "choice", "Please select your desired turnaround.", {
    options: [
      "Rush (within 24 hours)",
      "Within 1 week",
      "Within 2 weeks",
      "1 month or more",
      "Flexible / open to discussion",
    ],
  }),
  fieldQ(),
  q("detail", "text", "Please briefly describe the content.", {
    sub: "You may submit an inquiry even without a file at hand.",
    ph: "e.g., Exhibition catalogue Korean to English, must be completed within 3 weeks due to print schedule",
  }),
  q("volume", "choice", "Please give us a rough idea of the volume.", {
    sub: "An approximate figure is fine. If you have a file, please attach it.",
    options: VOLUME_OPTIONS,
    followInput: {
      when: VOLUME_OPTIONS.indexOf(DIRECT_INPUT),
      label: "Volume",
      ph: "e.g., 30 A4 pages / 40 minutes of video",
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
  "What type of training do you need?",
  {
    sub: "Standard lessons can be booked directly; custom services are handled through a separate inquiry.",
    options: [
      "Individual or group English lessons",
      "Corporate or institutional training|In-house training, leadership training, certification audits, ODA, etc.",
    ],
  },
);

export const FLOW_E_PERSONAL: readonly Question[] = [
  q("lesson", "choice", "Please select the lesson format.", {
    sub: "A pre-lesson video consultation (25 min) is also available — we'll send a booking link after we receive your inquiry.",
    options: [
      "Online English lessons — from KRW 70,000 / 50 min (individual or group)|Choose a native-speaker or Korean expert instructor",
      "In-person one-on-one lessons (private tutoring) — from KRW 200,000 / 100 min|Seoul metropolitan area only · FASTFIVE office lessons available",
      "In-person group lessons (custom classes / on-site) — from KRW 600,000 / 100 min|Custom-built for institutions and groups",
      "Custom service — separate inquiry",
    ],
  }),
  q("period", "choice", "Please select the duration.", {
    sub: "Group and long-term lessons receive discounts.",
    options: ["Short-term (within 3 months)", "Long-term (3 months or more)", "Undecided"],
  }),
  q("mode", "choice", "Please select the format.", {
    options: ["Online", "Offline", "Hybrid"],
  }),
  q("detail", "text", "Please describe the target audience and goals.", {
    ph: "e.g., 2x weekly Mon/Wed 7-8am for 1 year / preparation of a 40-minute lecture and script delivery guidance for next month's academic conference",
  }),
  q("pay", "choice", "Please select the payment method.", {
    options: [
      "Credit card payment link",
      "Bank transfer",
      "Bank transfer after tax invoice issuance",
      "On-site credit card payment",
    ],
  }),
];

export const FLOW_E_CORP: readonly Question[] = [
  fieldQ(),
  q("detail", "text", "Please describe the target audience and goals.", {
    sub: "Please include details such as the training content, number of participants, availability of presentation materials, and whether interpretation or translation is required.",
    ph: "e.g., ISO 13485 certification course including interpretation/translation, 30-hour training program, 8 participants",
    file: true,
  }),
  q("period", "choice", "Please select the duration.", {
    options: ["Short-term (within 2 weeks)", "Long-term (1 month or more)", "Undecided"],
  }),
  q("mode", "choice", "Please select the format.", {
    sub: "After reviewing the details, we'll confirm the curriculum, format, and duration, and provide a quote.",
    options: ["Online", "Offline", "Hybrid"],
  }),
];

export const FLOW_F: readonly Question[] = [
  q("detail", "text", "Please share your inquiry in your own words.", {
    sub: "We'll confirm details by email or phone, then confirm the curriculum, format, and duration and provide a quote.",
    ph: "Please enter your inquiry.",
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
  { id: "org", label: "Company / organization", type: "text", ph: "e.g., OO Corporation" },
  { id: "name", label: "Contact name", type: "text", ph: "Name" },
  { id: "email", label: "Email", type: "email", ph: "name@company.com" },
  { id: "phone", label: "Mobile", type: "tel", ph: "+82-10-0000-0000" },
] as const;

export const ROUTES = [
  "Existing client",
  "Referral",
  "Naver search",
  "Google search",
  "Instagram",
  "LinkedIn",
  "YouTube",
  "Blog / community",
  "Other",
] as const;

/** "지인 추천"을 고르면 추천인 입력을 받는다. */
export const ROUTE_REFERRAL = "Referral";
/** "기타"를 고르면 직접 입력을 받는다. */
export const ROUTE_ETC = "Other";

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
