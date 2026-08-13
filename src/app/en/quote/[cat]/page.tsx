import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import QuoteWizard from "@/components/QuoteWizard";
import { CATEGORIES, getCategory } from "@/lib/quote-flow-en";

/** 홈 화면(EN) 서비스 카드에서 바로 들어오는 경로 (/en/quote/A/ ~ /en/quote/F/) */
export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ cat: category.id }));
}

export const dynamicParams = false;

type Params = { cat: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cat } = await params;
  const category = getCategory(cat);
  return {
    title: category ? `${category.title} — Request a Quote` : "Request a Quote",
    description: category
      ? `${category.title} — ${category.desc}. Answer a few short questions and we'll reply within 1–2 business days.`
      : undefined,
  };
}

export default async function EnCategoryQuotePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { cat } = await params;
  const category = getCategory(cat);

  if (!category) notFound();

  return (
    <>
      <TopBar locale="en" />
      <main>
        <QuoteWizard initialCategory={category} locale="en" />
      </main>
    </>
  );
}
