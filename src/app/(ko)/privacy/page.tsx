import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import { getContent } from "@/lib/content";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import { alternatesFor } from "@/lib/metadata";

const COMPANY = getContent(DEFAULT_LOCALE).company;

export const metadata: Metadata = {
  title: "개인정보처리방침",
  // 영문판이 아직 없으므로 hreflang 없이 canonical 만 붙입니다.
  alternates: alternatesFor("/privacy/", "ko", { hasEn: false }),
};

/**
 * ⚠️ 기존 사이트의 방침은 부동산 분양대행사 템플릿이 그대로 붙어 있어
 *    실제 처리 내용과 전혀 맞지 않았습니다. 견적 문의 폼의 수집 항목에 맞춰 새로 작성했습니다.
 *    시행일과 세부 문구는 공개 전 한 번 검토받으시기를 권합니다.
 */
const SECTIONS = [
  {
    title: "1. 수집하는 개인정보 항목 및 수집 방법",
    body: [
      "회사는 견적 문의 응대를 위해 아래 정보를 수집합니다.",
      "· 필수 항목: 업체·기관명, 담당자명, 이메일 주소, 휴대폰번호, 문의 내용",
      "· 선택 항목: 첨부 자료, 예산 범위, 유입 경로 및 추천인",
      "· 수집 방법: 홈페이지 견적 문의 폼",
    ],
  },
  {
    title: "2. 개인정보의 이용 목적",
    body: [
      "수집한 개인정보는 아래 목적으로만 이용하며, 목적 외의 용도로 이용하지 않습니다.",
      "· 견적 산출 및 회신, 문의 사항에 대한 응대",
      "· 계약 체결 협의 및 용역 수행에 필요한 연락",
      "· 서비스 품질 개선을 위한 통계 분석 (식별할 수 없는 형태로 처리)",
    ],
  },
  {
    title: "3. 개인정보의 보유 및 이용 기간",
    body: [
      "원칙적으로 수집·이용 목적이 달성되면 지체 없이 파기합니다. 다만 아래의 경우 명시한 기간 동안 보관합니다.",
      "· 견적 문의 내역: 문의 처리 완료 후 3년",
      "· 계약이 체결된 경우: 계약 종료 후 5년 (상법 및 국세기본법 등 관계 법령에 따름)",
      "· 정보주체가 삭제를 요청한 경우: 요청 즉시 파기",
    ],
  },
  {
    title: "4. 개인정보의 제3자 제공",
    body: [
      "회사는 정보주체의 개인정보를 제3자에게 제공하지 않습니다.",
      "다만 용역 수행에 통역사·번역가 등 외부 전문 인력의 배정이 필요한 경우, 사전에 정보주체의 동의를 받은 범위 내에서 업무 수행에 필요한 최소한의 정보만 공유합니다.",
      "법령에 근거하거나 수사기관의 적법한 요구가 있는 경우에는 예외로 합니다.",
    ],
  },
  {
    title: "5. 정보주체의 권리와 행사 방법",
    body: [
      "정보주체는 언제든지 개인정보의 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다.",
      `요청은 ${COMPANY.email} 로 접수하실 수 있으며, 회사는 지체 없이 조치합니다.`,
    ],
  },
  {
    title: "6. 개인정보의 파기 절차 및 방법",
    body: [
      "보유 기간이 지나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다.",
      "· 전자적 파일: 복구할 수 없는 기술적 방법으로 영구 삭제",
      "· 출력물: 분쇄 또는 소각",
    ],
  },
  {
    title: "7. 개인정보의 안전성 확보 조치",
    body: [
      "· 개인정보 취급자를 최소한으로 제한하고 접근 권한을 관리합니다.",
      "· 전송 구간을 암호화(HTTPS)하여 개인정보를 보호합니다.",
      "· 개인정보가 저장된 시스템에 대한 접근 기록을 보관합니다.",
    ],
  },
  {
    title: "8. 개인정보 보호책임자",
    body: [
      `· 성명: 임선희 (대표이사)`,
      `· 연락처: ${COMPANY.tel}`,
      `· 이메일: ${COMPANY.email}`,
      "개인정보 침해에 관한 상담이 필요한 경우 개인정보침해신고센터(privacy.kisa.or.kr, 국번없이 118)에 문의하실 수 있습니다.",
    ],
  },
  {
    title: "9. 방침의 변경",
    body: [
      "이 개인정보처리방침이 변경되는 경우, 변경 사항을 홈페이지 공지사항을 통해 시행 7일 전부터 안내합니다.",
    ],
  },
] as const;

export default function PrivacyPage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-bold tracking-tight">개인정보처리방침</h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {COMPANY.name}(이하 &lsquo;회사&rsquo;)는 정보주체의 개인정보를 중요시하며,
          「개인정보 보호법」 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」을 준수합니다.
        </p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold">{section.title}</h2>
              <div className="mt-3 space-y-2">
                {section.body.map((line) => (
                  <p
                    key={line}
                    className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800">
          본 방침의 시행일은 사이트 공개일에 맞춰 기재하세요. (예: 2026년 9월 1일)
        </p>
      </main>
    </>
  );
}
