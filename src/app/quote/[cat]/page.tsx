import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import QuoteWizard from "@/components/QuoteWizard";
import { CATEGORIES, getCategory } from "@/lib/quote-flow";

/** 홈 화면의 서비스 카드에서 바로 들어오는 경로입니다. (/quote/A/ ~ /quote/F/) */
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ cat: category.id }));
}

// 목록에 없는 주소는 404로 처리합니다.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/quote/[cat]">): Promise<Metadata> {
  const { cat } = await params;
  const category = getCategory(cat);
  return {
    title: category ? `${category.title} 견적 신청` : "견적 신청",
    description: category
      ? `${category.title} — ${category.desc}. 간단한 문항만 답하시면 영업일 기준 1~2일 내 회신드립니다.`
      : undefined,
  };
}

export default async function CategoryQuotePage({
  params,
}: PageProps<"/quote/[cat]">) {
  const { cat } = await params;
  const category = getCategory(cat);

  if (!category) notFound();

  return (
    <>
      <TopBar />
      <main>
        {/* 유형이 정해진 상태로 들어오므로 선택 단계 없이 첫 문항부터 시작합니다. */}
        <QuoteWizard initialCategory={category} />
      </main>
    </>
  );
}
