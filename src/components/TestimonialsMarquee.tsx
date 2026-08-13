"use client";

import { useEffect, useState } from "react";
import { fetchTestimonials } from "@/lib/testimonials";
import type { Testimonial } from "@/lib/content/types";

/**
 * 고객 후기 무한 스크롤 캐러셀.
 * 동일 배열을 두 번 렌더해 이어붙이고, 트랙 자체를 -50%까지 이동시킵니다.
 * 애니메이션 정의: src/app/globals.css @keyframes marquee.
 * hover 시 일시정지, prefers-reduced-motion에서는 미디어 쿼리로 정지 상태 유지.
 *
 * fallback은 시트가 비어 있을 때 자리를 지킵니다. 언니가 구글 폼으로 받은
 * 후기를 시트에서 "공개" 체크만 켜면 자동으로 이 배열이 교체됩니다.
 */
export default function TestimonialsMarquee({ fallback }: { fallback: readonly Testimonial[] }) {
  const endpoint = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";
  const [items, setItems] = useState<readonly Testimonial[]>(fallback);

  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    fetchTestimonials(endpoint)
      .then((list) => {
        if (cancelled) return;
        if (list.length > 0) setItems(list);
      })
      .catch(() => {
        // 실패 시 fallback 유지
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  if (items.length === 0) return null;

  // 짝수 개 이상일 때 이음새가 자연스럽습니다. 홀수면 하나 더 늘려 짝수로 맞춥니다.
  const track = items.length % 2 === 0 ? items : [...items, items[0]];
  const doubled = [...track, ...track];

  // 카드 수에 비례해 재생 시간을 늘려 속도를 일정하게 유지합니다.
  const duration = `${Math.max(track.length * 8, 32)}s`;

  return (
    <div className="group relative overflow-hidden">
      {/* 양쪽 페이드 마스크 — 카드가 잘리는 대신 부드럽게 사라지도록 */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent sm:w-24 dark:from-neutral-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent sm:w-24 dark:from-neutral-950" />

      <ul
        className="marquee-track flex w-max gap-4 group-hover:[animation-play-state:paused]"
        style={{ animation: `marquee ${duration} linear infinite` }}
      >
        {doubled.map((t, i) => (
          <li
            key={`${t.id || t.name}-${i}`}
            className="w-[300px] shrink-0 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:w-[360px] dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              &ldquo;{t.review}&rdquo;
            </p>
            <div className="mt-5 border-t border-neutral-100 pt-4 text-xs text-neutral-500 dark:border-neutral-800">
              <p className="font-semibold text-neutral-700 dark:text-neutral-300">
                {t.name} <span className="font-normal text-neutral-500">{t.title}</span>
              </p>
              <p className="mt-1">{t.affiliation}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
