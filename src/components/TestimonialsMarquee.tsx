"use client";

import { useEffect, useState } from "react";
import { fetchTestimonials } from "@/lib/testimonials";
import type { Testimonial } from "@/lib/content/types";
import { SkeletonCards } from "@/components/Skeleton";

/**
 * 고객 후기 무한 스크롤 캐러셀.
 * 동일 배열을 두 번 렌더해 이어붙이고, 트랙 자체를 -50%까지 이동시킵니다.
 * 애니메이션 정의: src/app/globals.css @keyframes marquee.
 * hover 시 일시정지, prefers-reduced-motion에서는 미디어 쿼리로 정지 상태 유지.
 *
 * 언니가 구글 폼으로 받은 후기를 시트에서 "공개" 체크만 켜면 여기에 나옵니다.
 * 불러오는 동안에는 스켈레톤을 보여줍니다 (이유는 Skeleton.tsx 주석 참고).
 */
export default function TestimonialsMarquee({ lang = "ko" }: { lang?: "ko" | "en" }) {
  const endpoint = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";
  const [items, setItems] = useState<readonly Testimonial[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">(
    endpoint ? "loading" : "error",
  );

  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    fetchTestimonials(endpoint, lang)
      .then((list) => {
        if (cancelled) return;
        setItems(list);
        setState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, lang]);

  if (state === "loading") {
    return (
      <SkeletonCards label={lang === "en" ? "Loading reviews." : "후기를 불러오는 중입니다."} />
    );
  }

  if (items.length === 0) return null;

  // 짝수 개 이상일 때 이음새가 자연스럽습니다. 홀수면 하나 더 늘려 짝수로 맞춥니다.
  const track = items.length % 2 === 0 ? items : [...items, items[0]];
  const doubled = [...track, ...track];

  // 카드 수에 비례해 재생 시간을 늘려 속도를 일정하게 유지합니다.
  const duration = `${Math.max(track.length * 8, 32)}s`;

  return (
    <div className="group relative overflow-hidden">
      {/* 양쪽 페이드 마스크 — 카드가 잘리는 대신 부드럽게 사라지도록 */}
      {/*
        페이드는 섹션 배경색과 같아야 합니다. 섹션이 bg-neutral-50 인데 여기가
        from-white 였어서, 양끝에 흰 김이 서린 것처럼 미세하게 어긋나 있었습니다.
        (다크 모드는 섹션이 neutral-950 이라 원래부터 맞았습니다)
      */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-neutral-50 to-transparent sm:w-24 dark:from-neutral-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-neutral-50 to-transparent sm:w-24 dark:from-neutral-950" />

      <ul
        className="marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${duration} linear infinite` }}
      >
        {doubled.map((t, i) => (
          <li
            key={`${t.id || t.name}-${i}`}
            className="w-[300px] shrink-0 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:w-[360px] dark:border-neutral-800 dark:bg-neutral-900"
          >
            {/*
              KR / EN 뱃지를 뺐습니다. 방문자에게 후기 원문의 언어는 알 필요가 없는
              정보인데, 카드에서 가장 먼저 눈에 들어오는 자리를 차지하고 있었습니다.

              대신 브랜드색 인용부호를 둡니다. 이게 후기라는 걸 즉시 알리고 흰 카드에
              색을 한 점 넣어 줍니다. 본문을 감싸던 따옴표는 겹치므로 함께 없앴습니다.
            */}
            <div aria-hidden="true" className="h-6 font-serif text-[44px] leading-[0.8] text-brand">
              &ldquo;
            </div>

            <p className="mt-3.5 text-sm leading-[1.75] text-neutral-700 dark:text-neutral-300">
              {t.review}
            </p>

            {/*
              이름 이니셜 원 — 카드마다 글자가 달라지므로 색을 칠하지 않고도 카드가
              서로 구분됩니다. 후기가 단조로워 보이는 원인은 색이 없어서가 아니라
              카드들이 서로 똑같아서였습니다.
            */}
            <div className="mt-5 flex items-center gap-2.5 border-t border-neutral-100 pt-4 text-xs text-neutral-500 dark:border-neutral-800">
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[13px] font-bold text-brand-strong"
              >
                {t.name?.trim().charAt(0) || "\u00b7"}
              </span>
              <span>
                <span className="block font-semibold text-neutral-700 dark:text-neutral-300">
                  {t.name} <span className="font-normal text-neutral-500">{t.title}</span>
                </span>
                <span className="mt-0.5 block">{t.affiliation}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
