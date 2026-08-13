import Link from "next/link";
import Logo from "@/components/Logo";
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

        <div className="flex items-center gap-3">
          {EN_ENABLED && (
            <div
              role="group"
              aria-label="Language toggle"
              className="inline-flex overflow-hidden rounded-full border border-neutral-300 bg-white text-xs font-bold dark:border-neutral-700 dark:bg-neutral-900"
            >
              <Link
                href="/"
                aria-current={!isEn ? "page" : undefined}
                className={
                  !isEn
                    ? "bg-neutral-900 px-3.5 py-1.5 text-white dark:bg-white dark:text-neutral-900"
                    : "px-3.5 py-1.5 text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                }
              >
                KO
              </Link>
              <Link
                href="/en/"
                aria-current={isEn ? "page" : undefined}
                className={
                  isEn
                    ? "bg-neutral-900 px-3.5 py-1.5 text-white dark:bg-white dark:text-neutral-900"
                    : "px-3.5 py-1.5 text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                }
              >
                EN
              </Link>
            </div>
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
