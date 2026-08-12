import Link from "next/link";
import { CATEGORIES } from "@/lib/quote-flow";
import { getContent, SHARED } from "@/lib/content";
import { DEFAULT_LOCALE } from "@/lib/i18n";
import TopBar from "@/components/TopBar";
import Reveal from "@/components/Reveal";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import { InstagramIcon, NaverIcon, KakaoIcon } from "@/components/BrandIcons";

/** 소셜 카드에 매핑할 브랜드 아이콘. socials 배열의 name과 매칭됩니다. */
const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram: InstagramIcon,
  "네이버 블로그": NaverIcon,
  "카카오톡 채널": KakaoIcon,
};

export default function Home() {
  // 한국어가 기본입니다. 영문 사이트는 en.ts 번역 후 EN_ENABLED로 켭니다.
  const {
    company: COMPANY,
    ui: UI,
    highlights: HIGHLIGHTS,
    achievements: ACHIEVEMENTS,
    representative: REPRESENTATIVE,
    milestones: MILESTONES,
    principles: PRINCIPLES,
    process: PROCESS,
    caseStudies: CASE_STUDIES,
    socials: SOCIALS,
    testimonials: TESTIMONIALS,
  } = getContent(DEFAULT_LOCALE);
  const CLIENTS = SHARED.clients;
  const TESTIMONIAL_FORM_URL = SHARED.testimonialFormUrl;

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

          {/* 1차 CTA — 견적 전환이 목적이므로 두 버튼만 크게 남깁니다. */}
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

          {/* 2차 CTA — 다운로드는 작게 묶어 위계를 낮춥니다. */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="/downloads/beehive-company-profile-2026-07.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-600 underline-offset-4 transition hover:text-brand-strong hover:underline dark:text-neutral-400"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              {UI.ctaCompanyProfile}
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=app.netlify.std_beehive.twa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={UI.ctaAndroidApp}
              className="inline-block transition hover:opacity-80"
            >
              <img
                src="/badges/google-play.png"
                alt="Get it on Google Play"
                width={155}
                height={46}
                className="h-11 w-auto"
              />
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
        <section className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{UI.sectionClients}</h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              {UI.sectionClientsSub}
            </p>
          </Reveal>

          {/*
            로고는 원본이 흰 배경 JPEG이라 항상 흰 타일 위에 올립니다.
            다크 모드에서도 로고 색이 뭉개지지 않습니다.
          */}
          <Reveal delay={100}>
            <ul className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
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
          </Reveal>

          {/*
            고객 후기 캐러셀 — 로고월 바로 아래, 성과 리스트 위.
            "이 회사들 담당했다 → 담당자들이 이렇게 말한다 → 구체적 성과"로 이어지는 흐름입니다.
            현재는 dummy 5건이고, 실제 후기가 수집되면 ko.ts의 testimonials 배열을 교체합니다.
          */}
          <Reveal delay={150}>
            <div className="mt-14 border-t border-neutral-200 pt-10 dark:border-neutral-800">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {UI.sectionTestimonials}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {UI.sectionTestimonialsSub}
                  </p>
                </div>
                {TESTIMONIAL_FORM_URL && (
                  <a
                    href={TESTIMONIAL_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold transition hover:border-brand hover:text-brand-strong dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    {UI.testimonialsFormCta} →
                  </a>
                )}
              </div>
              <div className="mt-6">
                <TestimonialsMarquee items={TESTIMONIALS} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {ACHIEVEMENTS.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-brand" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
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
            <Reveal delay={100}>
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
            </Reveal>
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
          <div className="mx-auto max-w-7xl px-6">
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

        {/* ── 소식 (네이버 블로그 · SNS) ────────────────────────── */}
        <section
          id="news"
          className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{UI.navNews}</h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              공지사항과 대표 경력은 네이버 블로그에서 확인하실 수 있습니다.
            </p>

            {/*
              블로그 갤러리 (임시 레이아웃).
              언니 블로그에 콘텐츠가 채워지면 네이버 RSS 또는 수동 큐레이션으로 실제 글을 연결합니다.
              현재는 어떤 형태로 노출될지 보여주는 목업입니다.
            */}
            <div className="mt-10">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                공지사항
                <span className="ml-2 text-xs font-normal text-neutral-400">(예시 — 실제 블로그 글로 교체 예정)</span>
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { title: "2026년 하반기 프로젝트 접수 안내", date: "2026.08.01" },
                  { title: "여름 휴가 일정 공지 (8/12~8/16)", date: "2026.07.28" },
                ].map((post) => (
                  <a
                    key={post.title}
                    href="https://blog.naver.com/beehivecorp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-brand hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="aspect-square w-20 shrink-0 rounded-lg bg-gradient-to-br from-brand-soft to-brand/40" />
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-semibold group-hover:text-brand-strong">{post.title}</p>
                      <p className="mt-1 text-xs text-neutral-500">{post.date}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                대표 경력
                <span className="ml-2 text-xs font-normal text-neutral-400">(예시 — 실제 블로그 글로 교체 예정)</span>
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "ICCR 16회기 사무국 운영 후기", date: "2026.07.15" },
                  { title: "스페인 교육부 장관 사절단 수행통역", date: "2026.06.22" },
                  { title: "그라운드시소 전시 도록 번역 완료", date: "2026.05.10" },
                  { title: "화랑미술제 개막식 5년 연속 통역", date: "2026.03.05" },
                ].map((post) => (
                  <a
                    key={post.title}
                    href="https://blog.naver.com/beehivecorp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:border-brand hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="aspect-[16/10] bg-gradient-to-br from-brand-soft to-brand/40" />
                    <div className="p-4">
                      <p className="text-sm font-semibold group-hover:text-brand-strong">{post.title}</p>
                      <p className="mt-1 text-xs text-neutral-500">{post.date}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <a
                href="https://blog.naver.com/beehivecorp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-brand hover:text-brand-strong dark:border-neutral-700 dark:bg-neutral-900"
              >
                <NaverIcon className="h-5 w-5" />
                네이버 블로그 바로가기 →
              </a>
            </div>

            {/* 우리의 이야기, 들어보실래요? — Instagram / Blog / KakaoTalk */}
            <div className="mt-16 border-t border-neutral-200 pt-14 dark:border-neutral-800">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                {UI.sectionSocial}
              </h3>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {SOCIALS.map((social) => {
                  const Icon = SOCIAL_ICONS[social.name];
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                    >
                      {Icon && <Icon className="h-10 w-10" />}
                      <h4 className="mt-4 text-base font-semibold">{social.name}</h4>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {social.desc}
                      </p>
                      <span className="mt-5 text-sm font-semibold text-brand-strong transition group-hover:translate-x-0.5">
                        바로가기 →
                      </span>
                    </a>
                  );
                })}
              </div>
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
