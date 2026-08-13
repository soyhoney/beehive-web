import Link from "next/link";
import { getContent, SHARED } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import TopBar from "@/components/TopBar";
import Reveal from "@/components/Reveal";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import NoticesBoard from "@/components/NoticesBoard";
import BlogPosts from "@/components/BlogPosts";
import type { Notice } from "@/lib/notices";
import type { Post } from "@/lib/posts";
import { InstagramIcon, NaverIcon, KakaoIcon } from "@/components/BrandIcons";

/**
 * 시트 fallback — 로케일별로 문구가 달라야 하므로 로케일 안에서 선택합니다.
 */
const NOTICE_FALLBACK_KO: readonly Notice[] = [
  {
    id: "sample-1",
    kind: "공지",
    title: "웹사이트 개설을 완료하였습니다.",
    body: "비하이브코퍼레이션 웹사이트를 오픈했습니다. 문의는 service@beehivecorp.co.kr 로 편하게 남겨 주세요.",
    date: "2026-08-12",
  },
  {
    id: "sample-2",
    kind: "안내",
    title: "여름 휴가 일정 안내 (8/12~8/16)",
    body: "휴가 기간 동안 문의 응답이 지연될 수 있습니다. 급한 건은 담당자 개별 연락 부탁드립니다.",
    date: "2026-07-28",
  },
];

const NOTICE_FALLBACK_EN: readonly Notice[] = [
  {
    id: "sample-1",
    kind: "Notice",
    title: "Website launched.",
    body: "The Beehive Corporation website is now live. Please send inquiries to service@beehivecorp.co.kr.",
    date: "2026-08-12",
  },
  {
    id: "sample-2",
    kind: "Info",
    title: "Summer break schedule (8/12–8/16)",
    body: "Responses may be delayed during the break. For urgent matters, please contact the responsible manager directly.",
    date: "2026-07-28",
  },
];

const POST_FALLBACK_KO: readonly Post[] = [
  { id: "sample-1", title: "ICCR 16회기 사무국 운영 후기", link: "https://blog.naver.com/beehivecorp", date: "2026-07-15" },
  { id: "sample-2", title: "스페인 교육부 장관 사절단 수행통역", link: "https://blog.naver.com/beehivecorp", date: "2026-06-22" },
  { id: "sample-3", title: "그라운드시소 전시 도록 번역 완료", link: "https://blog.naver.com/beehivecorp", date: "2026-05-10" },
  { id: "sample-4", title: "화랑미술제 개막식 5년 연속 통역", link: "https://blog.naver.com/beehivecorp", date: "2026-03-05" },
];

const POST_FALLBACK_EN: readonly Post[] = [
  { id: "sample-1", title: "ICCR 16th session secretariat operations", link: "https://blog.naver.com/beehivecorp", date: "2026-07-15" },
  { id: "sample-2", title: "Spanish Minister of Education delegation interpretation", link: "https://blog.naver.com/beehivecorp", date: "2026-06-22" },
  { id: "sample-3", title: "Groundseesaw exhibition catalog translation completed", link: "https://blog.naver.com/beehivecorp", date: "2026-05-10" },
  { id: "sample-4", title: "5th consecutive year of Galleries Art Fair opening interpretation", link: "https://blog.naver.com/beehivecorp", date: "2026-03-05" },
];

/** 소셜 카드에 매핑할 브랜드 아이콘. 한/영 이름 모두 매칭. */
const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram: InstagramIcon,
  "네이버 블로그": NaverIcon,
  "Naver Blog": NaverIcon,
  "카카오톡 채널": KakaoIcon,
  "KakaoTalk Channel": KakaoIcon,
};

export default function HomePage({ locale }: { locale: Locale }) {
  const {
    company: COMPANY,
    ui: UI,
    highlights: HIGHLIGHTS,
    achievements: ACHIEVEMENTS,
    representative: REPRESENTATIVE,
    milestones: MILESTONES,
    principles: PRINCIPLES,
    process: PROCESS,
    socials: SOCIALS,
    testimonials: TESTIMONIALS,
    serviceCards: SERVICE_CARDS,
  } = getContent(locale);
  const CLIENTS = SHARED.clients;
  const TESTIMONIAL_FORM_URL = SHARED.testimonialFormUrl;

  const isEn = locale === "en";
  const quoteHref = isEn ? "/en/quote/" : "/quote/";
  const privacyHref = "/privacy/"; // 개인정보처리방침은 KR 원문만 유지 (법률 문서)
  const NOTICE_FALLBACK = isEn ? NOTICE_FALLBACK_EN : NOTICE_FALLBACK_KO;
  const POST_FALLBACK = isEn ? POST_FALLBACK_EN : POST_FALLBACK_KO;

  return (
    <>
      <TopBar locale={locale} />

      <main>
        {/* ── 히어로 ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <p className="text-sm font-semibold tracking-wide text-brand-strong">
            {COMPANY.serviceLine}
          </p>
          <h1 className="mt-4 text-3xl leading-tight font-bold tracking-[-0.04em] sm:text-5xl sm:leading-[1.15]">
            {UI.heroHeadline[0]}
            <br />
            {UI.heroHeadline[1]}
          </h1>
          {/*
            히어로 서브 문단: 한국어는 word-break:keep-all(globals.css)로 단어 중간은 안 깨지지만
            "영어 교육 및 트레이닝" · "언어·시차·문화·이해관계" 같은 구간에서 브레이크가 어색.
            text-wrap:pretty 로 브라우저가 마지막 줄 균형을 자동으로 맞추게 합니다.
          */}
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-700 dark:text-neutral-300"
            style={{ textWrap: "pretty" }}
          >
            {COMPANY.heroSub}
          </p>
          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-500"
            style={{ textWrap: "pretty" }}
          >
            {COMPANY.philosophy}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href={quoteHref}
              className="rounded-lg bg-brand px-6 py-3.5 text-sm font-semibold text-neutral-900 transition hover:bg-brand-strong"
            >
              {UI.ctaQuote}
            </Link>
            <a
              href="/downloads/beehive-company-profile-2026-07.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-6 py-3.5 text-sm font-semibold text-neutral-700 transition hover:border-brand hover:text-brand-strong dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 18 15 15" />
              </svg>
              {UI.ctaCompanyProfile}
            </a>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-neutral-200 pt-10 sm:grid-cols-4 dark:border-neutral-800">
            {HIGHLIGHTS.map((item) => (
              <div key={item.label}>
                <dd className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">{item.value}</dd>
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
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{UI.sectionClients}</h2>
            <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
              {UI.sectionClientsSub}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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

            <Reveal delay={100}>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICE_CARDS.map((card) => {
                const photo = SHARED.categoryPhotos[card.id];
                return (
                  <article
                    key={card.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    {photo && (
                      <div className="aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={photo.src}
                          alt={photo.alt}
                          loading="lazy"
                          className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
                          style={
                            photo.objectPosition
                              ? { objectPosition: photo.objectPosition }
                              : undefined
                          }
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold tracking-tight">{card.title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-relaxed">
                        {card.headline}
                      </p>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {card.body}
                      </p>
                      {card.cases && card.cases.length > 0 && (
                        <div className="mt-5 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-strong">
                            {UI.labelFeaturedCase}
                          </p>
                          <ul className="mt-2.5 space-y-2">
                            {card.cases.map((c) => (
                              <li key={c.title} className="text-xs leading-relaxed">
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                  {c.title}
                                </span>
                                <span className="mt-0.5 block text-neutral-500">{c.meta}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <Link
                        href={`${quoteHref}${card.id}/`}
                        className="mt-6 inline-flex w-fit items-center gap-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-brand-strong"
                      >
                        {UI.ctaQuote}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
            </Reveal>
          </div>
        </section>

        {/* ── 대표 소개 · 연혁 ─────────────────────────────────── */}
        <section id="about" className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr]">
            <Reveal>
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

              <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                <p className="text-xs text-neutral-500">{UI.labelAlsoMobile}</p>
                <a
                  href="https://play.google.com/store/apps/details?id=app.netlify.std_beehive.twa"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={UI.ctaAndroidApp}
                  className="mt-3 inline-block transition hover:opacity-80"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/badges/google-play.png"
                    alt="Get it on Google Play"
                    width={155}
                    height={46}
                    className="h-11 w-auto"
                  />
                </a>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {UI.sectionMilestones}
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
            </Reveal>
          </div>
        </section>

        {/* ── 고객 후기 ────────────────────────────────────────── */}
        <section className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mx-auto max-w-5xl px-6">
        <Reveal delay={150}>
          <div>
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
              <TestimonialsMarquee fallback={TESTIMONIALS} lang={locale} />
            </div>
          </div>
        </Reveal>
          </div>
        </section>

        {/* ── 작업 방식 ────────────────────────────────────────── */}
        <section id="how" className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {UI.sectionHow}
            </h2>
          </Reveal>

          <Reveal delay={100}>
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
          </Reveal>

          <Reveal delay={200}>
          <ol className="mt-14 sm:grid sm:grid-cols-6 sm:gap-4">
            {PROCESS.map((step, index) => {
              const isLast = index === PROCESS.length - 1;
              return (
                <li
                  key={step}
                  className={`relative flex items-start gap-4 sm:flex-col sm:items-center sm:gap-0 sm:text-center ${
                    !isLast ? "pb-8 sm:pb-0" : ""
                  }`}
                >
                  {!isLast && (
                    <>
                      <span
                        aria-hidden
                        className="absolute top-10 bottom-0 left-[19px] w-px bg-brand-border/50 sm:hidden dark:bg-brand-border/60"
                      />
                      <span
                        aria-hidden
                        className="absolute top-5 left-[calc(50%+24px)] hidden h-px w-[calc(100%+1rem-48px)] bg-brand-border/50 sm:block dark:bg-brand-border/60"
                      />
                    </>
                  )}
                  <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-neutral-900 shadow-sm">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="pt-2 text-sm font-medium sm:mt-4 sm:pt-0 sm:text-xs sm:leading-snug">
                    {step}
                  </div>
                </li>
              );
            })}
          </ol>
          </Reveal>
        </section>

        {/* ── 소식 (네이버 블로그 · SNS) ────────────────────────── */}
        <section
          id="news"
          className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-950"
        >
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {UI.sectionNews}
              </h2>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                {UI.sectionNewsSub}
              </p>
            </Reveal>

            <Reveal delay={100}>
            <div className="mt-10">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {UI.labelNoticesSub}
              </h3>
              <NoticesBoard fallback={NOTICE_FALLBACK} locale={locale} />
            </div>

            <div className="mt-14">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {UI.labelUpdatesSub}
              </h3>
              <BlogPosts fallback={POST_FALLBACK} locale={locale} />
            </div>
            </Reveal>

            <Reveal delay={200}>
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
                        {UI.labelVisitLink}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
            </Reveal>
          </div>
        </section>

        {/* ── 마무리 CTA ───────────────────────────────────────── */}
        <section className="border-t border-neutral-200 py-24 text-center dark:border-neutral-800">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {UI.finalCtaTitle}
              </h2>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
                {UI.finalCtaSub}
              </p>
              <Link
                href={quoteHref}
                className="mt-8 inline-block rounded-lg bg-brand px-8 py-4 text-sm font-semibold text-neutral-900 transition hover:bg-brand-strong"
              >
                {UI.ctaQuote}
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-border/60 bg-brand py-12 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="mx-auto max-w-5xl px-6 text-xs leading-relaxed text-neutral-900 dark:text-neutral-400">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
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
            </div>

            <a
              href="https://play.google.com/store/apps/details?id=app.netlify.std_beehive.twa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={UI.ctaAndroidApp}
              className="inline-block shrink-0 transition hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/badges/google-play.png"
                alt="Get it on Google Play"
                width={155}
                height={46}
                className="h-11 w-auto"
              />
            </a>
          </div>

          <div className="mt-5">
            <Link href={privacyHref} className="underline underline-offset-2">
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
