import Link from "next/link";

/**
 * KO / EN 세그먼트 토글.
 *
 * 데스크톱 상단바와 모바일 메뉴 안에서 같은 마크업을 씁니다.
 * 상태가 없어 서버 컴포넌트로 동작합니다 — 경로가 곧 언어이므로
 * 현재 언어는 렌더 시점에 이미 정해져 있습니다.
 */
export default function LocaleToggle({
  isEn,
  className = "",
}: {
  isEn: boolean;
  className?: string;
}) {
  const active =
    "bg-neutral-900 px-3.5 py-1.5 text-white dark:bg-white dark:text-neutral-900";
  const idle =
    "px-3.5 py-1.5 text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100";

  return (
    <div
      role="group"
      aria-label="Language toggle"
      className={`inline-flex overflow-hidden rounded-full border border-neutral-300 bg-white text-xs font-bold dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
    >
      <Link href="/" aria-current={!isEn ? "page" : undefined} className={isEn ? idle : active}>
        KO
      </Link>
      <Link href="/en/" aria-current={isEn ? "page" : undefined} className={isEn ? active : idle}>
        EN
      </Link>
    </div>
  );
}
