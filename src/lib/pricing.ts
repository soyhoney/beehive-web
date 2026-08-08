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
  /** 진행 방식 계수 — 오프라인은 이동 비용 반영 */
  lessonMode: {
    온라인: 1,
    오프라인: 1.1,
    혼합: 1.05,
  } as Record<string, number>,
} as const;

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

const AUTO_NOTE =
  "선택하신 조건으로 산출한 1회차 기준 예상 금액입니다. 정식 견적이 아니며, 담당자 확인 후 확정 견적서를 보내드립니다.";

const MANUAL_NOTE =
  "접수가 완료되었습니다. 보내주신 내용은 조건에 따라 금액 편차가 커서 자동 산출 대상이 아닙니다. 담당자가 확인 후 영업일 기준 1~2일 내에 정식 견적서를 보내드립니다.";

function manual(note = MANUAL_NOTE): QuoteEstimate {
  return { auto: false, lines: [], subtotal: 0, vat: 0, total: 0, note };
}

function finalize(lines: QuoteLine[], note = AUTO_NOTE): QuoteEstimate {
  const subtotal = Math.round(lines.reduce((sum, l) => sum + l.amount, 0));
  const vat = Math.round(subtotal * VAT_RATE);
  return { auto: true, lines, subtotal, vat, total: subtotal + vat, note };
}

/** 교육(E) 개인·그룹 수업 갈래의 예상 금액 */
function estimateLesson(answers: Answers): QuoteEstimate {
  const lessonIdx = answers["lesson"]?.idx;

  const base =
    lessonIdx === 0
      ? { amount: RATES.lesson.online, label: "화상 영어 수업", unit: "50분" }
      : lessonIdx === 1
        ? { amount: RATES.lesson.privateOffline, label: "대면 개인 수업", unit: "100분" }
        : lessonIdx === 2
          ? { amount: RATES.lesson.groupOffline, label: "대면 단체 수업", unit: "100분" }
          : null;

  // "커스텀 서비스 — 별도 문의" 또는 미선택
  if (!base) {
    return manual(
      "커스텀 서비스는 요구사항에 따라 구성이 달라져 자동 산출하지 않습니다. 담당자가 확인 후 별도로 견적을 보내드립니다.",
    );
  }

  const periodIdx = answers["period"]?.idx;
  const periodFactor =
    periodIdx === 1 ? RATES.lessonPeriod.long : RATES.lessonPeriod.short;

  const modeIdx = answers["mode"]?.idx;
  const modeLabel = modeIdx === 0 ? "온라인" : modeIdx === 1 ? "오프라인" : "혼합";
  const modeFactor = RATES.lessonMode[modeLabel] ?? 1;

  const lines: QuoteLine[] = [
    {
      label: `${base.label} (${base.unit} 1회 기준)`,
      detail: `기본 단가 · ${modeLabel} 계수 ${modeFactor.toFixed(2)}`,
      amount: base.amount * modeFactor,
    },
  ];

  if (periodFactor < 1) {
    lines.push({
      label: "장기 등록 할인",
      detail: `3개월 이상 · ${Math.round((1 - periodFactor) * 100)}% 할인`,
      amount: -(base.amount * modeFactor * (1 - periodFactor)),
    });
  }

  return finalize(lines);
}

/**
 * 카테고리와 답변으로 예상 견적을 산출한다.
 * 자동 산출이 불가능한 카테고리는 auto: false 로 반환한다.
 */
export function calculateEstimate(
  categoryId: CategoryId,
  answers: Answers,
): QuoteEstimate {
  // 교육 중 "개인·그룹 영어 수업"(etype idx 0)만 자동 산출 대상
  if (categoryId === "E" && answers["etype"]?.idx === 0) {
    return estimateLesson(answers);
  }

  if (categoryId === "E") {
    return manual(
      "기업·기관 교육은 커리큘럼과 기간을 확인한 뒤 견적을 드립니다. 담당자가 곧 연락드리겠습니다.",
    );
  }

  if (categoryId === "B") {
    return manual(
      "공공기관 프로젝트는 과업 범위와 기간에 따라 견적이 결정됩니다. 담당자가 확인 후 제안서와 함께 연락드리겠습니다.",
    );
  }

  return manual();
}

export function formatKRW(amount: number): string {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded).toLocaleString("ko-KR")}원`;
}
