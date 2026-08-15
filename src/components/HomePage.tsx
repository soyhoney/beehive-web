import Link from "next/link";
import { getContent, SHARED } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import TopBar from "@/components/TopBar";
import Reveal from "@/components/Reveal";
import TestimonialsMarquee from "@/components/TestimonialsMarquee";
import NoticesBoard from "@/components/NoticesBoard";
import BlogPosts from "@/components/BlogPosts";
import { InstagramIcon, NaverIcon } from "@/components/BrandIcons";

/*
 * 카카오톡 채널 매핑을 지웠습니다. 채널 자체를 정리했기 때문입니다 (ko.ts socials 주석 참고).
 * KakaoIcon 컴포넌트는 BrandIcons 에 남겨 둡니다 — 나중에 채널을 다시 열면 그대로 씁니다.
 */
const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram: InstagramIcon,
  "네이버 블로그": NaverIcon,
  "Naver Blog": NaverIcon,
};

export default function HomePage({ locale }: { locale: Locale }) {
  const {
    company: COMPANY,
    ui: UI,
    highlights: HIGHLIGHTS,
    achievements: ACHIEVEMENTS,
    representative: REPRESENTATIVE,
    caseStudies: CASE_STUDIES,
    milestones: MILESTONES,
    principles: PRINCIPLES,
    process: PROCESS,
    socials: SOCIALS,
    serviceCards: SERVICE_CARDS,
  } = getContent(locale);
  const CLIENTS = SHARED.clients;
  const TESTIMONIAL_FORM_URL = SHARED.testimonialFormUrl;

  const isEn = locale === "en";
  const quoteHref = isEn ? "/en/quote/" : "/quote/";
  const privacyHref = "/privacy/"; // 개인정보처리방침은 KR 원문만 유지 (법률 문서)

  return (
    <>
      <TopBar locale={locale} />

      <main>
        {/* ── 히어로 ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <p className="text-sm font-semibold tracking-wide text-brand-strong">
            {COMPANY.serviceLine}
          </p>
          {/*
            자간 -0.02em. 원래 -0.04em 이었는데 그 값은 헤드라인이 명조였을 때 잡은 것이고,
            Pretendard 로 바꾼 뒤에는 글자들이 서로 붙어 읽기 불편했습니다.
            한글은 글립이 전각이라 라틴보다 자간을 덜 조여야 합니다.
          */}
          <h1 className="mt-4 text-3xl leading-tight font-bold tracking-[-0.02em] sm:text-5xl sm:leading-[1.15]">
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
            className="mt-6 max-w-2xl text-base leading-[1.75] text-neutral-700 dark:text-neutral-300"
            style={{ textWrap: "pretty" }}
          >
            {COMPANY.heroSub}
          </p>
          {/*
            브랜드 문장은 서브 문단보다 폭을 좁게(34rem) 둡니다.

            둘 다 같은 폭이면 회색 문단 두 개가 한 덩어리로 뭉쳐서, 어디서 끊기고
            무엇이 더 중요한지 한눈에 안 보입니다. 폭을 줄여 계단 모양을 만들면
            글자 크기·색만으로 부족했던 위계가 형태로 드러납니다.
            자간이 아니라 이 부분이 "글이 많아 보이는" 느낌을 줄이는 장치입니다.
          */}
          <p
            className="mt-3 max-w-[34rem] text-sm leading-[1.7] text-neutral-500"
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

        {/* ── 대표 사례 ────────────────────────────────────────── */}
        {/*
          클라이언트 로고월 · 성과 리스트 바로 아래에 둡니다. (2026-08-15 회의)

          방문자의 판단 순서를 따라갑니다 —
            누구와 일했나(로고) → 무엇을 했나(성과) → 어떻게 했나(대표 사례)
          신뢰의 근거를 여기서 다 쌓은 뒤에 서비스·견적으로 넘깁니다.

          섹션 데이터(caseStudies)는 예전에 작성돼 있었지만, 사례를 서비스 카드 안으로
          통합한 이후 렌더링되지 않고 콘텐츠에만 남아 있었습니다. 대표가 "대표 사례를
          더 디벨롭해 달라" 고 요청했으므로 이 데이터를 되살려 씁니다.
          내용은 대표가 보완 텍스트를 주면 교체합니다.
        */}
        {/*
          배경은 흰색으로 두고 구분선만 넣습니다. 바로 다음 서비스 섹션이 회색이라
          여기까지 회색이면 두 구역이 한 덩어리로 붙어 버립니다.
          클라이언트(흰) → 대표 사례(흰) 는 "누구와" 와 "무엇을" 이라 한 묶음으로 읽혀도 됩니다.
        */}
        <section
          id="cases"
          className="border-t border-neutral-200 py-20 dark:border-neutral-800"
        >
          <div className="mx-auto max-w-5xl px-6">
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{UI.sectionCases}</h2>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                {UI.sectionCasesSub}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {CASE_STUDIES.map((study) => (
                  <article
                    key={study.title}
                    className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    {study.photo && (
                      <div className="aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={study.photo}
                          alt={study.title}
                          loading="lazy"
                          /* 포스터처럼 세로로 긴 이미지는 잘라내지 않고 전체를 보여줍니다. */
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
                            className="flex gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
                          >
                            <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-brand-strong" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
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
                return (
                  <article
                    key={card.id}
                    className="flex flex-col rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    {/*
                      서비스 카드에서 사진을 뺐습니다. (2026-08-15 대표 요청)

                      바로 위 대표 사례 섹션이 같은 사진들을 이미 크게 쓰고 있어서
                      한 화면에 같은 이미지가 두 번 나왔습니다. 사진이 빠지면 카드가
                      "무엇을 해주는가" 라는 설명에 집중되고, 사진은 대표 사례에서
                      근거로만 쓰이게 됩니다.
                    */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold tracking-tight">{card.title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-relaxed">
                        {card.headline}
                      </p>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {card.body}
                      </p>
                      {/*
                        서비스 카드 안에 있던 대표 사례를 뺐습니다. (2026-08-15 회의)

                        카드마다 사례를 작게 붙이면 서비스 설명과 사례가 뒤섞여 둘 다
                        흐릿해집니다. 회의에서 "서비스는 견적 요청 버튼만 두고, 대표 사례는
                        위로 올려서 제대로 보여주자" 로 정리했습니다.
                        사례는 클라이언트 섹션 바로 아래 독립 섹션으로 옮겼습니다.

                        serviceCards[].cases 데이터는 콘텐츠에 남겨 둡니다 — 대표가 사례
                        텍스트를 보완해 주기로 했고, 그때 어느 쪽에 넣을지 다시 판단합니다.
                      */}
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

            {/*
              앱 다운로드 안내 — 2026-08-15 회의에서 대표가 위치까지 지정했습니다.
              "서비스 소개 하단에 문구 + 앱 다운로드 버튼"

              공식 Google Play 뱃지 대신 텍스트 버튼을 씁니다. 검은 뱃지는 페이지
              중간에서 시선을 과하게 끌어 바로 위 서비스 카드의 견적 버튼과 경쟁합니다.
              공식 뱃지는 푸터에 그대로 있어 브랜드 표기 요건도 충족합니다.

              버튼 문구에 "안드로이드" 를 남겨 둡니다. 이 앱은 Google Play 전용이라
              아이폰 사용자가 눌렀다가 헛걸음하는 것을 막습니다.
            */}
            <Reveal delay={200}>
              <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900">
                <div>
                  <p className="text-sm font-semibold">{UI.labelAlsoMobile}</p>
                  <p className="mt-1 text-xs text-neutral-500">{UI.labelAlsoMobileSub}</p>
                </div>
                {/*
                  채워진 버튼으로 강조합니다. 테두리만 있는 버튼은 바로 위 카드의
                  노란 견적 버튼들 옆에서 눌러야 할 것으로 읽히지 않았습니다.

                  색은 노랑이 아니라 진한 회색을 씁니다. 이 페이지에서 노란색은
                  "견적 문의" 하나만 가리키게 두는 편이 낫습니다. 앱 버튼까지 노랗게 하면
                  카드마다 있는 견적 버튼과 색이 같아져 어느 쪽이 목적인지 흐려집니다.
                  진한 회색은 흰 배경에서 충분히 강조되면서 노란색과 경쟁하지 않습니다.
                */}
                <a
                  href="https://play.google.com/store/apps/details?id=app.netlify.std_beehive.twa"
                  target="_blank"
                  rel="noopener noreferrer"
                  /*
                    좁은 화면에서는 버튼을 가로로 꽉 채웁니다. 왼쪽에만 붙어 있으면
                    오른쪽이 비어 배너가 미완성처럼 보이고, 버튼도 작아 보입니다.
                  */
                  className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-700 sm:w-auto dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v12" />
                    <polyline points="8 11 12 15 16 11" />
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  </svg>
                  {UI.ctaAndroidApp}
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 업력(연혁) ───────────────────────────────────────── */}
        {/*
          원래 이 자리에 대표 소개(이름 · 직함 · 학력 · 경력)가 함께 있었습니다.
          2026-08-15 회의에서 대표 요청으로 제거했습니다.

          이유 — ICCR 등 NDA 가 걸린 건이 있어 대표 사례를 드러낼 수 없고,
          이름과 학력이 그대로 노출되는 것에 부담이 있었습니다. 관심 있는 방문자는
          회사소개서를 다운로드하므로 그쪽에 남겨 두는 편이 낫다고 판단했습니다.
          회의에서 "업력만 남기는 것도 나쁘지 않다" 로 합의해 연혁은 유지합니다.

          라이브 후 실제 유입 고객층이 드러나면 무엇을 보여줄지 다시 판단합니다.
          대표이사 성명은 푸터에 법적 표기로 남아 있습니다.

          앵커 id 는 about 을 유지합니다 — 상단 메뉴 "회사소개" 가 이곳을 가리키고,
          연혁이 곧 회사 소개 역할을 합니다.
        */}
        <section id="about" className="mx-auto max-w-5xl px-6 py-20">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {UI.sectionMilestones}
            </h2>
            {/*
              한 칼럼이 되었으므로 연혁 폭을 제한합니다. max-w-5xl 을 꽉 채우면
              설명 줄이 너무 길어져 읽기 불편합니다.
            */}
            <ol className="mt-8 max-w-2xl space-y-7 border-l border-neutral-200 pl-6 dark:border-neutral-800">
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
              <TestimonialsMarquee lang={locale} />
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
              <NoticesBoard locale={locale} />
            </div>

            <div className="mt-14">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                {UI.labelUpdatesSub}
              </h3>
              <BlogPosts locale={locale} />
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
