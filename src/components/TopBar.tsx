import Link from "next/link";
import Logo from "@/components/Logo";
import { getContent } from "@/lib/content";
import { DEFAULT_LOCALE } from "@/lib/i18n";

export default function TopBar() {
  const UI = getContent(DEFAULT_LOCALE).ui;

  const nav = [
    { href: "/#about", label: UI.navAbout },
    { href: "/#services", label: UI.navServices },
    { href: "/#news", label: UI.navNews },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" aria-label="비하이브코퍼레이션 홈">
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

        {/* 전환 지점: 어느 화면에서든 항상 보이는 견적 신청 버튼 */}
        <Link
          href="/quote/"
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-neutral-900 transition hover:bg-brand-strong"
        >
          {UI.ctaQuote}
        </Link>
      </div>
    </header>
  );
}
