"use client";

/**
 * 서비스 소개 섹션 — 상단 pill 필터 + 큰 split 카드.
 *
 * 왼쪽(브랜드 컬러): 카테고리 번호 + 서비스명(큰 타이포) + headline + body
 * 오른쪽(흰 배경): "주요 수행 범위" 라벨 + card.scope 를 콤마로 쪼갠 배지들 + 견적 CTA + 좌우 네비
 *
 * 대표 사례는 별도 상위 섹션에서 크게 다룹니다 (2026-08-15 회의).
 * 여기서는 견적 전환에만 집중.
 *
 * 필터 state 때문에 클라이언트 컴포넌트. 콘텐츠는 상위(HomePage)에서 로케일별로 로드해 전달.
 */

import { useState } from "react";
import Link from "next/link";
import type { ServiceCard } from "@/lib/content";

interface Props {
  cards: readonly ServiceCard[];
  ctaLabel: string;
  /** CTA 클릭 시 이동할 URL 프리픽스. 뒤에 카드 id 붙임. 예: "/quote/" */
  quoteHref: string;
  /** "주요 수행 범위" — ko 는 UI.labelScope */
  scopeLabel: string;
}

export default function ServicesSection({ cards, ctaLabel, quoteHref, scopeLabel }: Props) {
  const [index, setIndex] = useState(0);
  const active = cards[index];
  const scopes = splitScope(active.scope);

  const go = (delta: number) => {
    const next = (index + delta + cards.length) % cards.length;
    setIndex(next);
  };

  return (
    <>
      {/* pill 필터 */}
      <div className="-mx-6 mt-10 flex gap-2 overflow-x-auto px-6">
        {cards.map((c, i) => {
          const isActive = i === index;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition ${
                isActive
                  ? "border-brand bg-brand text-neutral-900 shadow-sm"
                  : "border-neutral-300 bg-white text-neutral-600 hover:border-brand hover:text-brand-strong dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              }`}
            >
              {c.title}
            </button>
          );
        })}
      </div>

      {/* split 카드 */}
      <article className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white lg:h-[440px] dark:border-neutral-800 dark:bg-neutral-900">
        <div className="grid lg:h-full lg:grid-cols-[1.1fr_1fr]">
          {/* 왼쪽 — 큰 타이포 */}
          <div className="relative flex h-full flex-col justify-between overflow-hidden bg-brand p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-neutral-900/70">
                Service · {active.id}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-neutral-900/60">
                {String(index + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
              </span>
            </div>

            {/* 배경 큰 숫자 — 장식용, 콘텐츠 레이아웃엔 영향 없음. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-3 font-serif text-[9rem] font-bold leading-none tracking-tighter text-neutral-900/[0.07] sm:text-[11rem]"
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="relative">
              <h3 className="text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
                {active.title}
              </h3>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-neutral-900/90 sm:text-base">
                {active.headline}
              </p>
              <div className="mt-4 h-px w-12 bg-neutral-900/40" />
              <p className="mt-3 max-w-md text-xs leading-relaxed text-neutral-900/75 sm:text-[13px]">
                {active.body}
              </p>
            </div>
          </div>

          {/* 오른쪽 — 스코프 배지 + CTA */}
          <div className="flex h-full flex-col justify-between p-6 sm:p-8">
            <section>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-strong">
                {scopeLabel}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {scopes.map((s) => (
                  <li
                    key={s}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4 dark:border-neutral-800">
              <Link
                href={`${quoteHref}${active.id}/`}
                className="inline-flex w-fit items-center gap-1 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-neutral-900 transition hover:bg-brand-strong sm:text-sm"
              >
                {ctaLabel} →
              </Link>
              <div className="flex gap-1.5">
                <NavButton onClick={() => go(-1)} dir="left" />
                <NavButton onClick={() => go(1)} dir="right" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

/**
 * card.scope 는 대표가 콤마로 나열한 단일 문자열입니다.
 * ("국제회의 사무국 운영, 국제 공동 R&D 프로젝트, ... 등")
 * 여기서 배지로 표시하기 위해 콤마 기준 분리 + 앞뒤 공백 제거.
 * 빈 값이나 undefined 는 빈 배열로 취급 — 배지 자체가 렌더링되지 않습니다.
 */
function splitScope(scope: string | undefined): string[] {
  if (!scope) return [];
  return scope
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function NavButton({ onClick, dir }: { onClick: () => void; dir: "left" | "right" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "이전 서비스" : "다음 서비스"}
      className="flex size-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-xs text-neutral-600 transition hover:border-brand hover:text-brand-strong dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
    >
      {dir === "left" ? "←" : "→"}
    </button>
  );
}
