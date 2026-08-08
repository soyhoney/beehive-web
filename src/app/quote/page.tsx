import type { Metadata } from "next";
import TopBar from "@/components/TopBar";
import QuoteWizard from "@/components/QuoteWizard";

export const metadata: Metadata = {
  title: "견적 신청",
  description:
    "통역 · 번역 · 출장 수행 · 교육 견적을 온라인으로 신청하세요. 영업일 기준 1~2일 내 회신드립니다.",
};

export default function QuotePage() {
  return (
    <>
      <TopBar />
      <main>
        <QuoteWizard />
      </main>
    </>
  );
}
