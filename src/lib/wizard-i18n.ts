/**
 * QuoteWizard UI 문자열의 로케일별 번역.
 *
 * quote-flow.ts / quote-flow-en.ts 는 문항 자체(질문·보기),
 * 이 파일은 위저드의 UI 크롬(버튼·헤더·에러·완료 화면 등)을 담당합니다.
 */

import type { Locale } from "./i18n";

export interface WizardStrings {
  categoryPickerTitle: string;
  categoryPickerSub: string;
  contactTitle: string;
  contactSub: string;
  buttonPrev: string;
  buttonNext: string;
  buttonSubmit: string;
  buttonSubmitting: string;
  dateStart: string;
  dateEnd: string;
  tbdLabel: string;
  fileAttach: string;
  fileLimit: (perFile: string, total: string) => string;
  errorFileTooLarge: (name: string, limit: string) => string;
  errorTotalTooLarge: (limit: string) => string;
  errorReadFile: string;
  errorSubmit: string;
  routesLabel: string;
  routeReferralPh: string;
  routeEtcPh: string;
  privacyTitle: string;
  privacyRequired: string;
  privacyItem1: string;
  privacyItem2: string;
  privacyItem3: string;
  privacyItem4: string;
  doneTitle: string;
  doneRefLabel: string;
  estimateTitle: string;
  estimateSubtotal: string;
  estimateVat: string;
  estimateTotal: string;
  doneEmailNote: string;
}

const KO: WizardStrings = {
  categoryPickerTitle: "어떤 도움이 필요하신가요?",
  categoryPickerSub: "유형을 선택하시면 필요한 내용만 여쭤봅니다. 1~2분이면 충분합니다.",
  contactTitle: "연락처를 알려주세요.",
  contactSub: "견적서를 보내드릴 곳입니다. 영업일 기준 1~2일 내에 회신드립니다.",
  buttonPrev: "이전",
  buttonNext: "다음",
  buttonSubmit: "견적 문의 보내기",
  buttonSubmitting: "전송 중…",
  dateStart: "시작일",
  dateEnd: "종료일",
  tbdLabel: "일정이 아직 미정입니다",
  fileAttach: "파일 첨부",
  fileLimit: (perFile, total) => `파일당 최대 ${perFile} · 합계 ${total}까지`,
  errorFileTooLarge: (name, limit) =>
    `'${name}' 파일이 너무 큽니다. 파일 하나당 ${limit}까지 첨부할 수 있습니다.`,
  errorTotalTooLarge: (limit) =>
    `첨부파일 합계가 ${limit}를 넘습니다. 용량을 줄이거나 메일로 따로 보내주세요.`,
  errorReadFile: "첨부파일을 읽지 못했습니다. 파일을 다시 선택해 주세요.",
  errorSubmit: "전송에 실패했습니다.",
  routesLabel: "비하이브를 어떻게 알게 되셨나요? (복수 선택 가능)",
  routeReferralPh: "추천인 성함",
  routeEtcPh: "직접 입력",
  privacyTitle: "개인정보 수집 · 이용에 동의합니다.",
  privacyRequired: "(필수)",
  privacyItem1: "· 수집 항목: 업체·기관명, 담당자명, 이메일, 휴대폰번호, 문의 내용",
  privacyItem2: "· 수집 목적: 견적 산출 및 회신, 문의 응대, 계약 체결 협의",
  privacyItem3: "· 보유 기간: 문의 처리 완료 후 3년 (계약 체결 시 관계 법령에 따름)",
  privacyItem4: "· 동의를 거부하실 수 있으나, 이 경우 견적 회신이 제한됩니다.",
  doneTitle: "문의가 접수되었습니다.",
  doneRefLabel: "접수번호",
  estimateTitle: "예상 견적",
  estimateSubtotal: "공급가액",
  estimateVat: "부가세",
  estimateTotal: "합계",
  doneEmailNote: "입력하신 이메일로 접수 확인 메일을 보내드렸습니다.",
};

const EN: WizardStrings = {
  categoryPickerTitle: "What kind of help do you need?",
  categoryPickerSub:
    "Choose a category and we'll only ask what's relevant. It takes 1–2 minutes.",
  contactTitle: "Your contact details",
  contactSub:
    "We'll send the quote here. Expect a reply within 1–2 business days.",
  buttonPrev: "Back",
  buttonNext: "Next",
  buttonSubmit: "Send Quote Request",
  buttonSubmitting: "Sending…",
  dateStart: "Start date",
  dateEnd: "End date",
  tbdLabel: "The schedule is not yet decided",
  fileAttach: "Attach files",
  fileLimit: (perFile, total) => `Up to ${perFile} per file · ${total} total`,
  errorFileTooLarge: (name, limit) =>
    `'${name}' is too large. Each file can be up to ${limit}.`,
  errorTotalTooLarge: (limit) =>
    `Total attachments exceed ${limit}. Please reduce the size or send by email.`,
  errorReadFile: "Failed to read the attachment. Please select the file again.",
  errorSubmit: "Failed to send.",
  routesLabel: "How did you hear about Beehive? (multiple choice)",
  routeReferralPh: "Referrer's name",
  routeEtcPh: "Type here",
  privacyTitle: "I agree to the collection and use of my personal information.",
  privacyRequired: "(required)",
  privacyItem1:
    "· Items collected: company/organization name, contact name, email, phone, inquiry details",
  privacyItem2:
    "· Purpose: quote preparation and reply, inquiry response, contract negotiation",
  privacyItem3:
    "· Retention: 3 years after inquiry is closed (per applicable law once a contract is signed)",
  privacyItem4:
    "· You may decline, but in that case we cannot send you a quote.",
  doneTitle: "Your inquiry has been received.",
  doneRefLabel: "Reference number",
  estimateTitle: "Estimated Quote",
  estimateSubtotal: "Subtotal",
  estimateVat: "VAT",
  estimateTotal: "Total",
  doneEmailNote: "A confirmation email has been sent to your address.",
};

export function getWizardStrings(locale: Locale): WizardStrings {
  return locale === "en" ? EN : KO;
}
