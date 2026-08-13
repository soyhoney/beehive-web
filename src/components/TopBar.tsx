import Link from "next/link";
import Logo from "@/components/Logo";
import { getContent } from "@/lib/content";
import {
  DEFAULT_LOCALE,
  EN_ENABLED,
  LOCALE_LABEL,
  type Locale,
} from "@/lib/i18n";

export default function TopBar({ locale }: { locale?: Locale } = {}) {
  const currentLocale: Locale = locale ?? DEFAULT_LOCALE;
  const UI = getContent(currentLocale).ui;

  const isEn = currentLocale === "en";
  const homeHref = isEn ? "/en/" : "/";
  const quoteHref = "/quote/"; // 견적 폼은 1차엔 KR만 제작
  const anchorPrefix = isEn ? "/en/" : "/";
  const otherLocale: Locale = isEn ? "ko" : "en";
  const otherHref = isEn ? "/" : "/en/";

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

        <div className="flex items-center gap-3">
          {EN_ENABLED && (
            <Link
              href={otherHref}
              aria-label={`Switch to ${LOCALE_LABEL[otherLocale]}`}
              className="hidden items-center gap-1 rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition hover:border-brand hover:text-brand-strong sm:inline-flex dark:border-neutral-700 dark:text-neutral-400"
            >
              <span className="text-neutral-400">{LOCALE_LABEL[currentLocale]}</span>
              <span aria-hidden>›</span>
              <span>{LOCALE_LABEL[otherLocale]}</span>
            </Link>
          )}
          <Link
            href={quoteHref}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-neutral-900 transition hover:bg-brand-strong"
          >
            {UI.ctaQuote}
          </Link>
        </div>
      </div>
    </header>
  );
}
