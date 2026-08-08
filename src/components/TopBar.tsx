import Link from "next/link";
import Logo from "@/components/Logo";

const NAV = [
  { href: "/#services", label: "서비스" },
  { href: "/#scope", label: "전문 분야" },
  { href: "/#cases", label: "대표 사례" },
  { href: "/#about", label: "회사 소개" },
];

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/85 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" aria-label="비하이브코퍼레이션 홈">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
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
          견적 신청하기
        </Link>
      </div>
    </header>
  );
}
