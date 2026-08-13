/**
 * 견적 산출 엔진.
 *
 * ⚠️ 금액은 전부 더미 값입니다. 실제 단가표가 확정되면 RATES 의 숫자만 교체하면 됩니다.
 *
 * ── 자동 산출의 한계 (중요) ─────────────────────────────────────────────
 * 현재 문항 구조에서 금액 계산에 쓸 수 있는 "정량 데이터"는 교육(E) - 개인·그룹
 * 영어 수업 갈래뿐입니다. 이 갈래만 수업 형태별 시작 단가가 문항에 명시되어 있습니다.
 *
 * 나머지 카테고리(A·B·C·D·F)는 분량·시간·인원이 모두 자유 서술로 들어와서
 * 기계적으로 금액을 뽑을 근거가 없습니다. 억지로 계산하면 실제 단가와 어긋난
 * 금액이 고객에게 나가므로, 이 경우는 auto: false 로 두고 접수 확인만 자동 발송한 뒤
 * 담당자가 확정 견적을 내도록 합니다.
 *
 * 전 카테고리 자동 견적을 원하시면 각 플로우에 정량 문항(예: 번역 분량 매수,
 * 통역 투입 시간, 출장 일수·인원)을 선택형으로 추가해야 합니다.
 * ────────────────────────────────────────────────────────────────────
 */

import type { CategoryId } from "./quote-flow";
import type { Locale } from "./i18n";

export const VAT_RATE = 0.1;

/** 단계형 폼의 답변 한 칸. 질문 유형에 따라 채워지는 키가 다릅니다. */
export interface Answer {
  /** choice 선택 인덱스 */
  idx?: number;
  /** text / text1 입력값 */
  val?: string;
  /** subChoice 선택 인덱스 */
  sub?: number;
  /** subChoice 직접 입력값 */
  subCustom?: string;
  /** followInput 입력값 (지역의 국가·도시, 그룹 인원수 등) */
  extra?: string;
  /** dates: 시작일 / 종료일 */
  d1?: string;
  d2?: string;
  /** dates: 일정 미정 여부와 대략적인 일정 서술 */
  tbd?: boolean;
  tbdText?: string;
  /** 첨부 파일명 목록 */
  files?: string[];
}

export type Answers = Record<string, Answer>;

/** ⚠️ 더미 단가표 — 실제 값으로 교체 필요 */
export const RATES = {
  /** 교육(E) 개인·그룹 수업: 문항에 노출된 "~원부터" 시작가 */
  lesson: {
    /** 화상 영어 수업 — 50분 */
    online: 70_000,
    /** 대면 개인 수업(과외) — 100분 */
    privateOffline: 200_000,
    /** 대면 단체 수업(맞춤 강의·출장) — 100분 */
    groupOffline: 600_000,
  },
  /** 기간별 계수 — 장기 등록 시 할인 */
  lessonPeriod: {
    /** 단기 (3개월 이내) */
    short: 1,
    /** 장기 (3개월 이상) */
    long: 0.9,
    /** 미정 */
    unknown: 1,
  },
  /**
   * 진행 방식 계수 — 오프라인은 이동 비용 반영.
   *
   * 키를 한글("온라인")로 두면 화면에 표시할 라벨과 계수 조회 키가 같아져서,
   * 영문 화면을 만드는 순간 계수 조회가 조용히 실패합니다(undefined → 1).
   * 그래서 조회 키는 언어와 무관한 값으로 두고 라벨은 따로 번역합니다.
   */
  lessonMode: {
    online: 1,
    offline: 1.1,
    hybrid: 1.05,
  } as Record<LessonMode, number>,
} as const;

/** 수업 진행 방식. 계수 조회와 라벨 번역의 공통 키입니다. */
export type LessonMode = "online" | "offline" | "hybrid";

export interface QuoteLine {
  label: string;
  detail?: string;
  amount: number;
}

export interface QuoteEstimate {
  /** true면 예상 금액을 자동 산출함. false면 담당자 확정 견적 대상 */
  auto: boolean;
  lines: QuoteLine[];
  subtotal: number;
  vat: number;
  total: number;
  /** 고객에게 함께 노출할 안내 문구 */
  note: string;
}

/**
 * 견적 결과에 실려 고객 화면에 그대로 노출되는 문구들.
 *
 * 이 문자열들이 한국어로 하드코딩되어 있어서 /en/ 완료 화면의 제목과 안내는
 * 영어인데 가운데 안내 문단만 한국어로 나갔습니다. 어떤 문구를 쓸지는 금액을
 * 자동 산출할 수 있는지 판단하는 분기와 붙어 있으므로, 분기와 같은 파일에 둡니다.
 *
 * ※ manualDefault 에서 "자동 산출 대상이 아니다" 는 사실은 뺐습니다.
 *   우리 쪽 처리 방식일 뿐이고, 문의가 반려된 것처럼 읽힐 수 있습니다.
 *   고객이 알아야 하는 건 "접수됐고 언제 견적을 받는지" 뿐입니다.
 */
const STRINGS = {
  ko: {
    autoDefault:
      "선택하신 조건으로 산출한 1회차 기준 예상 금액입니다. 정식 견적이 아니며, 담당자 확인 후 확정 견적서를 보내드립니다.",
    manualDefault:
      "접수가 완료되었습니다. 담당자가 확인 후 영업일 기준 1~2일 내에 정식 견적서를 보내드립니다.",
    customLesson:
      "커스텀 서비스는 요구사항에 따라 구성이 달라져 자동 산출하지 않습니다. 담당자가 확인 후 별도로 견적을 보내드립니다.",
    corpTraining:
      "기업·기관 교육은 커리큘럼과 기간을 확인한 뒤 견적을 드립니다. 담당자가 곧 연락드리겠습니다.",
    publicProject:
      "공공기관 프로젝트는 과업 범위와 기간에 따라 견적이 결정됩니다. 담당자가 확인 후 제안서와 함께 연락드리겠습니다.",
    lessonOnline: "화상 영어 수업",
    lessonPrivate: "대면 개인 수업",
    lessonGroup: "대면 단체 수업",
    minutes: (n: number) => `${n}분`,
    perSession: (base: string, unit: string) => `${base} (${unit} 1회 기준)`,
    baseRate: (mode: string, factor: string) => `기본 단가 · ${mode} 계수 ${factor}`,
    modeOnline: "온라인",
    modeOffline: "오프라인",
    modeHybrid: "혼합",
    longTermDiscount: "장기 등록 할인",
    longTermDetail: (percent: number) => `3개월 이상 · ${percent}% 할인`,
  },
  en: {
    autoDefault:
      "This is an estimate for a single session based on the options you selected. It is not a formal quote — our team will review your inquiry and send a confirmed quote.",
    manualDefault:
      "Your inquiry has been received. Our team will review it and send a formal quote within 1–2 business days.",
    customLesson:
      "Custom programs vary by requirement, so we do not estimate them automatically. Our team will review your inquiry and send a separate quote.",
    corpTraining:
      "For corporate and institutional training, we prepare a quote after reviewing the curriculum and schedule. Our team will contact you shortly.",
    publicProject:
      "For public sector projects, the quote depends on the scope of work and schedule. Our team will review your inquiry and follow up with a proposal.",
    lessonOnline: "Online English lesson",
    lessonPrivate: "In-person private lesson",
    lessonGroup: "In-person group lesson",
    minutes: (n: number) => `${n} min`,
    perSession: (base: string, unit: string) => `${base} (per ${unit} session)`,
    baseRate: (mode: string, factor: string) => `Base rate · ${mode} factor ${factor}`,
    modeOnline: "Online",
    modeOffline: "In person",
    modeHybrid: "Hybrid",
    longTermDiscount: "Long-term enrollment discount",
    longTermDetail: (percent: number) => `3 months or more · ${percent}% off`,
  },
} as const satisfies Record<Locale, unknown>;

type PricingStrings = (typeof STRINGS)[Locale];

/*
 * note 를 string 으로 명시합니다. STRINGS 가 as const 라서 기본값에서 타입을
 * 추론하게 두면 파라미터가 그 문구 리터럴로 좁혀져, 다른 안내 문구를 넘길 때
 * 타입 에러가 납니다.
 */
function manual(T: PricingStrings, note: string = T.manualDefault): QuoteEstimate {
  return { auto: false, lines: [], subtotal: 0, vat: 0, total: 0, note };
}

function finalize(
  T: PricingStrings,
  lines: QuoteLine[],
  note: string = T.autoDefault,
): QuoteEstimate {
  const subtotal = Math.round(lines.reduce((sum, l) => sum + l.amount, 0));
  const vat = Math.round(subtotal * VAT_RATE);
  return { auto: true, lines, subtotal, vat, total: subtotal + vat, note };
}

/** 교육(E) 개인·그룹 수업 갈래의 예상 금액 */
function estimateLesson(answers: Answers, T: PricingStrings): QuoteEstimate {
  const lessonIdx = answers["lesson"]?.idx;

  const base =
    lessonIdx === 0
      ? { amount: RATES.lesson.online, label: T.lessonOnline, unit: T.minutes(50) }
      : lessonIdx === 1
        ? { amount: RATES.lesson.privateOffline, label: T.lessonPrivate, unit: T.minutes(100) }
        : lessonIdx === 2
          ? { amount: RATES.lesson.groupOffline, label: T.lessonGroup, unit: T.minutes(100) }
          : null;

  // "커스텀 서비스 — 별도 문의" 또는 미선택
  if (!base) return manual(T, T.customLesson);

  const periodIdx = answers["period"]?.idx;
  const periodFactor =
    periodIdx === 1 ? RATES.lessonPeriod.long : RATES.lessonPeriod.short;

  const modeIdx = answers["mode"]?.idx;
  // 계수는 언어와 무관한 키로 찾고, 화면에 쓸 라벨만 번역합니다.
  const modeKey: LessonMode =
    modeIdx === 0 ? "online" : modeIdx === 1 ? "offline" : "hybrid";
  const modeLabel =
    modeKey === "online"
      ? T.modeOnline
      : modeKey === "offline"
        ? T.modeOffline
        : T.modeHybrid;
  const modeFactor = RATES.lessonMode[modeKey] ?? 1;

  const lines: QuoteLine[] = [
    {
      label: T.perSession(base.label, base.unit),
      detail: T.baseRate(modeLabel, modeFactor.toFixed(2)),
      amount: base.amount * modeFactor,
    },
  ];

  if (periodFactor < 1) {
    lines.push({
      label: T.longTermDiscount,
      detail: T.longTermDetail(Math.round((1 - periodFactor) * 100)),
      amount: -(base.amount * modeFactor * (1 - periodFactor)),
    });
  }

  return finalize(T, lines);
}

/**
 * 카테고리와 답변으로 예상 견적을 산출한다.
 * 자동 산출이 불가능한 카테고리는 auto: false 로 반환한다.
 *
 * locale 은 결과에 담기는 안내 문구·항목 라벨의 언어를 결정합니다.
 * 금액 계산 자체는 언어와 무관합니다.
 */
export function calculateEstimate(
  categoryId: CategoryId,
  answers: Answers,
  locale: Locale = "ko",
): QuoteEstimate {
  const T = STRINGS[locale];

  // 교육 중 "개인·그룹 영어 수업"(etype idx 0)만 자동 산출 대상
  if (categoryId === "E" && answers["etype"]?.idx === 0) {
    return estimateLesson(answers, T);
  }

  if (categoryId === "E") return manual(T, T.corpTraining);
  if (categoryId === "B") return manual(T, T.publicProject);

  return manual(T);
}

/**
 * 금액 표기.
 *
 * 통화는 항상 원화입니다. 다만 영문 화면에서 "원" 을 쓰면 읽을 수 없으므로
 * 국제 통화 코드 KRW 를 앞에 붙입니다. 해외 고객이 금액 단위를 오해하는 것을
 * 막는 쪽이 중요합니다.
 */
export function formatKRW(amount: number, locale: Locale = "ko"): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toLocaleString("ko-KR");
  return locale === "en" ? `${sign}KRW ${digits}` : `${sign}${digits}원`;
}
