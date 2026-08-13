"use client";

import { useEffect, useRef, useState } from "react";
import LocaleToggle from "@/components/LocaleToggle";

/**
 * 모바일(md 미만) 상단바 메뉴.
 *
 * ── 왜 필요한가 ─────────────────────────────────────────────────────
 * 상단 메뉴가 `hidden md:flex` 라서 768px 미만에서는 회사소개·서비스·소식으로
 * 갈 방법이 아예 없었습니다. 폰에서는 로고 · 언어토글 · 견적 버튼만 남았습니다.
 *
 * 390px 기준으로 로고(110) + 견적 버튼(110) + 여백(48) 을 빼면 120px 남습니다.
 * 언어 토글(85)과 메뉴를 함께 두기엔 부족해서, 좁은 화면에서는 토글을 메뉴 안으로
 * 넣고 자리를 메뉴에 줬습니다. 언어별 URL(/ 와 /en/)이 따로 있어 이미 해당 언어
 * 링크를 받은 방문자에게는 토글보다 메뉴가 급합니다.
 *
 * ── 왜 details 가 아니라 클라이언트 컴포넌트인가 ────────────────────
 * CSS 만으로 되는 <details> 로 만들면 JS 가 필요 없지만, 메뉴 항목이 같은 페이지
 * 앵커(#about)라서 눌러도 페이지가 바뀌지 않습니다. 그러면 메뉴가 열린 채로 남아
 * 스크롤된 내용을 가립니다. 그래서 링크 클릭 · Esc · 바깥 클릭에 닫히도록
 * 상태를 두었습니다. 이 파일만 클라이언트로 내려가고 TopBar 는 서버 컴포넌트입니다.
 */
export default function MobileMenu({
  nav,
  isEn,
  enEnabled,
  openLabel,
  closeLabel,
  languageLabel,
}: {
  nav: readonly { href: string; label: string }[];
  isEn: boolean;
  enEnabled: boolean;
  openLabel: string;
  closeLabel: string;
  languageLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        className="flex size-10 items-center justify-center rounded-lg text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          <nav className="flex flex-col py-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                /* 같은 페이지 앵커라 페이지가 바뀌지 않으므로 직접 닫아 줍니다 */
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {enEnabled && (
            <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
              <p className="mb-2 text-xs font-semibold text-neutral-500">{languageLabel}</p>
              <LocaleToggle isEn={isEn} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
