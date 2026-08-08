/**
 * 견적 요청 제출 데이터의 계약(contract).
 *
 * 구글 시트에 두 갈래로 쌓습니다.
 *  1) "전체" 탭  — 모든 문의를 공통 컬럼으로 한 줄씩 (클라이언트 DB · 영업 현황용)
 *  2) 카테고리 탭 — 구분별로 그 카테고리의 문항이 그대로 컬럼이 되는 상세 표
 *
 * 나중에 Supabase 같은 실제 DB로 옮길 때도 이 구조가 그대로 테이블이 됩니다.
 * RAW_JSON 컬럼 하나만 있으면 전체 응답을 복원할 수 있습니다.
 */

import {
  getFlow,
  parseOption,
  type CategoryId,
  type Question,
} from "./quote-flow";
import type { Answer, Answers, QuoteEstimate } from "./pricing";

export interface ContactInfo {
  org: string;
  name: string;
  email: string;
  phone: string;
}

/** 시트·RAW_JSON에 남는 첨부파일 정보. 파일 본문은 담지 않습니다. */
export interface AttachedFile {
  questionId: string;
  fileName: string;
  size: number;
  type: string;
}

/**
 * 실제로 전송되는 파일. base64로 인코딩해 보냅니다.
 *
 * RAW_JSON이 시트 셀 한도(5만 자)를 넘지 않도록 Submission과는 분리해서
 * payload 최상위에 따로 실어 보냅니다.
 */
export interface FileUpload extends AttachedFile {
  /** base64 문자열 (data URL 접두사 없음) */
  data: string;
}

/** 파일 1개당 최대 크기 */
export const MAX_FILE_BYTES = 8 * 1024 * 1024;
/** 전체 첨부 합계 최대 크기 — base64는 약 33% 커지므로 여유를 둡니다. */
export const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

export interface Submission {
  /** 폼 문항이 개편돼도 과거 데이터를 해석할 수 있도록 버전을 남깁니다. */
  schemaVersion: number;
  submittedAt: string;
  categoryId: CategoryId;
  categoryLabel: string;
  answers: Answers;
  contact: ContactInfo;
  routes: string[];
  routeReferral: string;
  routeEtc: string;
  privacyAgreed: boolean;
  privacyAgreedAt: string;
  estimate: QuoteEstimate;
  files: AttachedFile[];
}

export const SCHEMA_VERSION = 1;

// ---------------------------------------------------------------------------
// 답변 → 사람이 읽을 수 있는 문자열
// ---------------------------------------------------------------------------

function chosenLabel(question: Question, answer: Answer): string {
  if (answer.idx === undefined || !question.options) return "";
  const option = question.options[answer.idx];
  return option ? parseOption(option).label : "";
}

/** 한 문항의 답변을 한 줄 문자열로 만든다. 시트에서 바로 읽기 위한 용도. */
export function describeAnswer(question: Question, answer: Answer | undefined): string {
  if (!answer) return "";

  switch (question.type) {
    case "dates": {
      // 일정 미정이면 대략적인 서술을 대신 남긴다.
      if (answer.tbd) {
        const text = answer.tbdText?.trim();
        return text ? `미정 — ${text}` : "미정";
      }
      const range = [answer.d1, answer.d2].filter(Boolean).join(" ~ ");
      const extra = answer.extra?.trim();
      return extra ? `${range} (${extra})` : range;
    }

    case "text":
    case "text1":
      return answer.val?.trim() ?? "";

    case "choice": {
      const parts: string[] = [];
      const label = chosenLabel(question, answer);
      if (label) parts.push(label);

      // 2차 선택지 (예: 국내 → 수도권/지방, 분야 기타 → 세부 분야)
      if (answer.sub !== undefined && question.subChoice) {
        const subOption = question.subChoice.options[answer.sub];
        if (subOption) parts.push(parseOption(subOption).label);
      }
      if (answer.subCustom?.trim()) parts.push(answer.subCustom.trim());

      // 보기에 딸린 추가 입력 (예산 구간, 인원수, 국가·도시 등)
      if (answer.extra?.trim()) parts.push(answer.extra.trim());

      return parts.join(" · ");
    }
  }
}

function fileNames(submission: Submission, questionId?: string): string {
  return submission.files
    .filter((f) => !questionId || f.questionId === questionId)
    .map((f) => f.fileName)
    .join(", ");
}

// ---------------------------------------------------------------------------
// "전체" 탭 — 모든 카테고리가 공유하는 고정 컬럼
// ---------------------------------------------------------------------------

export interface SheetColumn {
  /** 시트 헤더에 그대로 쓰이는 이름 */
  name: string;
  /** 나중에 DB로 옮길 때 쓸 컬럼명 */
  key: string;
  value: (s: Submission) => string | number;
}

export const COMMON_COLUMNS: readonly SheetColumn[] = [
  { name: "접수번호", key: "ref_no", value: () => "" }, // Apps Script가 발급
  { name: "접수일시", key: "submitted_at", value: (s) => s.submittedAt },
  { name: "상태", key: "status", value: () => "신규" },
  { name: "구분", key: "category_label", value: (s) => s.categoryLabel },

  { name: "업체·기관명", key: "org", value: (s) => s.contact.org },
  { name: "담당자명", key: "contact_name", value: (s) => s.contact.name },
  { name: "이메일", key: "email", value: (s) => s.contact.email },
  { name: "휴대폰", key: "phone", value: (s) => s.contact.phone },

  { name: "첨부파일", key: "files", value: (s) => fileNames(s) },
  { name: "유입경로", key: "routes", value: (s) => s.routes.join(", ") },
  { name: "추천인", key: "route_referral", value: (s) => s.routeReferral },
  { name: "유입경로(기타)", key: "route_etc", value: (s) => s.routeEtc },

  {
    name: "개인정보 동의",
    key: "privacy_agreed_at",
    value: (s) => (s.privacyAgreed ? s.privacyAgreedAt : "미동의"),
  },
  {
    name: "자동견적",
    key: "auto_estimated",
    value: (s) => (s.estimate.auto ? "자동산출" : "담당자확정필요"),
  },
  {
    name: "예상금액(VAT포함)",
    key: "estimated_total",
    value: (s) => (s.estimate.auto ? s.estimate.total : ""),
  },

  { name: "담당자 메모", key: "admin_memo", value: () => "" },
  // 기계용 원본. 이관·재현의 기준이 되는 컬럼입니다.
  { name: "RAW_JSON", key: "raw_json", value: (s) => JSON.stringify(s) },
] as const;

/** "전체" 탭에 들어갈 한 줄 */
export function toCommonRow(submission: Submission): Record<string, string | number> {
  const row: Record<string, string | number> = {};
  for (const column of COMMON_COLUMNS) {
    row[column.name] = column.value(submission);
  }
  return row;
}

// ---------------------------------------------------------------------------
// 카테고리 탭 — 그 구분의 문항이 그대로 컬럼이 된다
// ---------------------------------------------------------------------------

/**
 * 카테고리별 상세 컬럼.
 * 문항 제목을 컬럼명으로 씁니다. 문항이 추가되면 Apps Script가 헤더 끝에
 * 새 컬럼을 자동으로 덧붙이므로, 기존 데이터가 밀리지 않습니다.
 */
export function toDetailRow(submission: Submission): Record<string, string> {
  const row: Record<string, string> = {
    접수번호: "", // Apps Script가 채움
    접수일시: submission.submittedAt,
    "업체·기관명": submission.contact.org,
    담당자명: submission.contact.name,
    이메일: submission.contact.email,
    휴대폰: submission.contact.phone,
  };

  for (const question of getFlow(submission.categoryId, submission.answers)) {
    const text = describeAnswer(question, submission.answers[question.id]);
    // 같은 제목의 문항이 겹치면 뒤엣것이 덮어쓰지 않도록 id를 덧붙입니다.
    const columnName = row[question.title] === undefined
      ? question.title
      : `${question.title} (${question.id})`;
    row[columnName] = text;

    if (question.file) {
      const attached = fileNames(submission, question.id);
      if (attached) row[`${question.title} — 첨부`] = attached;
    }
  }

  row["유입경로"] = submission.routes.join(", ");
  row["추천인"] = submission.routeReferral;
  return row;
}

// ---------------------------------------------------------------------------
// 전송
// ---------------------------------------------------------------------------

export interface SubmitResult {
  ok: boolean;
  refNo?: string;
  error?: string;
}

/**
 * 구글 앱스 스크립트 엔드포인트로 제출한다.
 *
 * Apps Script는 CORS 프리플라이트를 지원하지 않으므로 text/plain 으로 보내
 * 단순 요청(simple request)이 되게 합니다. Apps Script 연동의 표준 우회법입니다.
 */
export async function submitQuote(
  submission: Submission,
  endpoint: string,
  uploads: FileUpload[] = [],
): Promise<SubmitResult> {
  if (!endpoint) {
    return {
      ok: false,
      error:
        "제출 주소가 설정되지 않았습니다. 관리자에게 문의해 주세요. (NEXT_PUBLIC_QUOTE_ENDPOINT 미설정)",
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      // 프리플라이트를 피하기 위해 의도적으로 text/plain 을 씁니다.
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        schemaVersion: SCHEMA_VERSION,
        categoryId: submission.categoryId,
        categoryLabel: submission.categoryLabel,
        common: toCommonRow(submission),
        detail: toDetailRow(submission),
        raw: submission,
        // 파일 본문은 RAW_JSON에 섞이지 않도록 최상위에 따로 싣습니다.
        files: uploads,
      }),
    });

    if (!response.ok) {
      return { ok: false, error: `전송에 실패했습니다. (${response.status})` };
    }

    const result = (await response.json()) as {
      ok?: boolean;
      refNo?: string;
      error?: string;
    };
    return result.ok
      ? { ok: true, refNo: result.refNo }
      : { ok: false, error: result.error ?? "전송에 실패했습니다." };
  } catch {
    return {
      ok: false,
      error: "네트워크 오류로 전송하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
