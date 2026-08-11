import Link from "next/link";
import { CATEGORIES } from "@/lib/quote-flow";
import { getContent, SHARED } from "@/lib/content";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import TopBar from "@/components/TopBar";

export default function Home() {
  // 한국어가 기본입니다. 영문 사이트는 en.ts 번역 후 EN_ENABLED로 켭니다.
  const {
    company: COMPANY,
    ui: UI,
    highlights: HIGHLIGHTS,
    achievements: ACHIEVEMENTS,
    representative: REPRESENTATIVE,
    milestones: MILESTONES,
    workScope: WORK_SCOPE,
    principles: PRINCIPLES,
    process: PROCESS,
    caseStudies: CASE_STUDIES,
  } = getContent(DEFAULT_LOCALE);
  const CLIENTS = SHARED.clients;

  return (
    <>
      <TopBar />

      <main>
        {/* ── 히어로 ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          {/* 무슨 회사인지부터 밝힙니다. 처음 온 사람은 감성 카피보다 이게 먼저입니다. */}
          <p className="text-sm font-semibold tracking-wide text-brand-strong">
            {COMPANY.serviceLine}
          </p>
          <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-5xl sm:leading-[1.15]">
            {UI.heroHeadline[0]}
            <br />
            {UI.heroHeadline[1]}
          </h1>
          {/* 어떤 건으로 견적을 받을 수 있는지 구체적으로 */}
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
            {COMPANY.heroSub}
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500">
            {COMPANY.philosophy}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/quote/"
              className="rounded-lg bg-brand px-6 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-brand-strong"
            >
              {UI.ctaQuote}
            </Link>
            <a
              href="#services"
              className="rounded-lg border border-neutral-300 px-6 py-3.5 text-sm font-semibold transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              {UI.ctaExplore}
            </a>
          </div>

          {/* 핵심 성과 */}
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-neutral-200 pt-10 sm:grid-cols-4 dark:border-neutral-800">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label}>
                <dd className="text-2xl font-bold tracking-tight sm:text-3xl">{item.value}</dd>
                <dt className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                  {item.label}
                  {"note" in item && item.note && (
                    <span className="mt-0.5 block text-neutral-400">{item.note}</span>
                  )}
                </dt>
              </div>
            ))}
          </dl>
        </section>

        {/* ── 클라이언트 ───────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{UI.sectionClients}</h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            {UI.sectionClientsSub}
          </p>

          {/*
            로고는 원본이 흰 배경 JPEG이라 항상 흰 타일 위에 올립니다.
            다크 모드에서도 로고 색이 뭉개지지 않습니다.
          */}
          <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {CLIENTS.map((client) => (
              <li
                key={client.name}
                title={client.name}
                className="flex items-center justify-center rounded-lg bg-white p-3 ring-1 ring-neutral-200 dark:ring-neutral-800"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  width={300}
                  height={100}
                  className="h-10 w-auto max-w-full object-contain"
                />
              </li>
            ))}
          </ul>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {ACHIEVEMENTS.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ── 서비스 카드 → 견적 전환 ──────────────────────────── */}
        <section
          id="services"
          className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {UI.sectionServices}
            </h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              {UI.sectionServicesSub}
            </p>

            {/* 전환이 목적인 구간이라 사진 없이 텍스트 카드로 유지합니다. */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((category) => (
                <Link
                  key={category.id}
                  // 카드를 누르면 유형 선택 단계를 건너뛰고 첫 문항부터 시작합니다.
                  href={`/quote/${category.id}/`}
                  className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <h3 className="text-base font-semibold">{category.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {category.desc}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-brand-strong transition group-hover:translate-x-0.5">
                    {UI.cardCta}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Work Scope ───────────────────────────────────────── */}
        <section id="scope" className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {UI.sectionScope}{" "}
              <span className="ml-1 text-base font-normal text-neutral-500">{UI.sectionScopeEn}</span>
            </h2>
            <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
              {WORK_SCOPE.map((item) => (
                <div key={item.title}>
                  <h3 className="text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 작업 방식 ────────────────────────────────────────── */}
        <section id="how" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {UI.sectionHow} <span className="ml-1 text-base font-normal text-neutral-500">{UI.sectionHowEn}</span>
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {PRINCIPLES.map((item) => (
              <div key={item.title}>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 진행 단계 */}
          <ol className="mt-14 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PROCESS.map((step, index) => (
              <li
                key={step}
                className="rounded-xl border border-neutral-200 px-4 py-4 dark:border-neutral-800"
              >
                <div className="text-xs font-semibold text-brand-strong">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="mt-1.5 text-sm font-medium">{step}</div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 대표 사례 ────────────────────────────────────────── */}
        <section
          id="cases"
          className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {UI.sectionCases}{" "}
              <span className="ml-1 text-base font-normal text-neutral-500">{UI.sectionCasesEn}</span>
            </h2>

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {CASE_STUDIES.map((study) => (
                <article
                  key={study.title}
                  className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                >
                  {study.photo && (
                    <div className="aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={study.photo}
                        alt={`${study.title} 자료`}
                        loading="lazy"
                        // 포스터처럼 세로로 긴 이미지는 잘라내지 않고 전체를 보여줍니다.
                        className={`size-full ${
                          "photoFit" in study && study.photoFit === "contain"
                            ? "object-contain"
                            : "object-cover"
                        }`}
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-lg leading-snug font-bold tracking-tight">
                      {study.title}
                    </h3>
                    <p className="mt-2 text-xs font-medium text-neutral-500">
                      {study.client} · {study.period}
                    </p>

                    <ul className="mt-5 space-y-3">
                      {study.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-3 text-[0.9375rem] leading-relaxed text-neutral-700 dark:text-neutral-300"
                        >
                          <span className="mt-[0.5rem] size-1.5 shrink-0 rounded-full bg-brand-strong" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 대표 소개 · 연혁 ─────────────────────────────────── */}
        <section id="about" className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{UI.sectionAbout}</h2>
              <p className="mt-6 text-lg font-semibold">
                {REPRESENTATIVE.name}
                <span className="ml-2 text-sm font-normal text-neutral-500">
                  {REPRESENTATIVE.title} · {REPRESENTATIVE.nameEn}
                </span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {REPRESENTATIVE.intro}
              </p>

              <ul className="mt-6 space-y-2.5">
                {REPRESENTATIVE.career.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {UI.sectionMilestones}{" "}
                <span className="ml-1 text-base font-normal text-neutral-500">
                  {UI.sectionMilestonesEn}
                </span>
              </h2>
              <ol className="mt-6 space-y-7 border-l border-neutral-200 pl-6 dark:border-neutral-800">
                {MILESTONES.map((milestone) => (
                  <li key={milestone.year} className="relative">
                    <span className="absolute top-1.5 -left-[1.8rem] size-2 rounded-full bg-brand" />
                    <div className="text-xs font-semibold text-brand-strong">{milestone.year}</div>
                    <div className="mt-1 text-sm font-semibold">{milestone.title}</div>
                    <div className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {milestone.desc}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ── 마무리 CTA ───────────────────────────────────────── */}
        <section className="border-t border-neutral-200 py-24 text-center dark:border-neutral-800">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {UI.finalCtaTitle}
            </h2>
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
              {UI.finalCtaSub}
            </p>
            <Link
              href="/quote/"
              className="mt-8 inline-block rounded-lg bg-brand px-8 py-4 text-sm font-semibold text-neutral-900 transition hover:bg-brand-strong"
            >
              견적 신청하기
            </Link>
          </div>
        </section>
      </main>

      {/* ── 푸터 ───────────────────────────────────────────────── */}
      <footer className="border-t border-neutral-200 py-12 dark:border-neutral-800">
        <div className="mx-auto max-w-5xl px-6 text-xs leading-relaxed text-neutral-500">
          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            {COMPANY.name}
          </p>
          <p className="mt-3">{COMPANY.address}</p>
          <p className="mt-1">
            {UI.ceoLabel} {REPRESENTATIVE.name} · {UI.businessNumberLabel}{" "}
            {COMPANY.businessNumber}
          </p>
          <p className="mt-1">
            TEL. {COMPANY.tel} · E-mail.{" "}
            <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-2">
              {COMPANY.email}
            </a>
          </p>
          <p className="mt-3 max-w-3xl">
            {UI.businessAreasLabel} · {COMPANY.businessAreas}
          </p>
          <div className="mt-5">
            <Link href="/privacy/" className="underline underline-offset-2">
              {UI.privacyLink}
            </Link>
          </div>
          <p className="mt-5">
            © {COMPANY.since}–2026 {COMPANY.nameEn}. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
