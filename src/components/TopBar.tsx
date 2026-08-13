import Link from "next/link";
import Logo from "@/components/Logo";
import LocaleToggle from "@/components/LocaleToggle";
import MobileMenu from "@/components/MobileMenu";
import { getContent } from "@/lib/content";
import { DEFAULT_LOCALE, EN_ENABLED, type Locale } from "@/lib/i18n";

export default function TopBar({ locale }: { locale?: Locale } = {}) {
  const currentLocale: Locale = locale ?? DEFAULT_LOCALE;
  const UI = getContent(currentLocale).ui;

  const isEn = currentLocale === "en";
  const homeHref = isEn ? "/en/" : "/";
  const quoteHref = isEn ? "/en/quote/" : "/quote/";
  const anchorPrefix = isEn ? "/en/" : "/";

  const nav = [
    { href: `${anchorPrefix}#about`, label: UI.navAbout },
    { href: `${anchorPrefix}#services`, label: UI.navServices },
    { href: `${anchorPrefix}#news`, label: UI.navNews },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-6">
        <Link href={homeHref} aria-label="Beehive Corporation">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/*
            언어 토글은 md 이상에서만 상단바에 둡니다.
            좁은 화면에서는 자리가 없어 MobileMenu 안으로 들어갑니다 —
            그 자리를 메뉴에 내주는 이유는 MobileMenu.tsx 주석 참고.
          */}
          {/*
            숨김은 래퍼에 걸어야 합니다. LocaleToggle 자체에 hidden 을 덧붙이면
            기본 클래스의 inline-flex 와 같은 display 유틸리티끼리 충돌하고,
            어느 쪽이 이기는지는 클래스 나열 순서가 아니라 Tailwind 가 생성한
            CSS 순서로 결정됩니다. (실제로 inline-flex 가 이겨 안 숨겨졌습니다)
          */}
          {EN_ENABLED && (
            <div className="hidden md:block">
              <LocaleToggle isEn={isEn} />
            </div>
          )}

          <Link
            href={quoteHref}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-neutral-900 transition hover:bg-brand-strong"
          >
            {UI.ctaQuote}
          </Link>

          <MobileMenu
            nav={nav}
            isEn={isEn}
            enEnabled={EN_ENABLED}
            openLabel={UI.menuOpen}
            closeLabel={UI.menuClose}
            languageLabel={UI.menuLanguage}
          />
        </div>
      </div>
    </header>
  );
}
