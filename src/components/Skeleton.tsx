/**
 * 시트에서 내용을 불러오는 동안 자리를 지키는 스켈레톤.
 *
 * ── 왜 dummy 내용 대신 스켈레톤인가 ──────────────────────────────────
 * 예전에는 공지·소식·후기가 로딩 중일 때 하드코딩된 dummy 를 보여줬습니다.
 * 그 dummy 문구가 실제 시트 내용과 거의 같아서(소식 4건은 제목까지 동일),
 * 연동이 끊겨도 화면이 정상처럼 보였습니다. 실제로 Cloudflare 빌드에
 * NEXT_PUBLIC_QUOTE_ENDPOINT 가 빠져 연동이 완전히 죽었는데도 한참 몰랐습니다.
 *
 * 스켈레톤은 "아직 안 왔다" 와 "이게 최종이다" 를 눈으로 구분해 줍니다.
 * 연동이 죽으면 빈 상태 문구가 나와 바로 티가 납니다.
 *
 * prefers-reduced-motion 에서는 animate-pulse 가 Tailwind 기본값으로 멈춥니다.
 */

/** 공지·소식 표용 — 실제 행 레이아웃(뱃지 · 제목 · 날짜)과 같은 골격 */
export function SkeletonTable({
  rows = 3,
  label,
}: {
  rows?: number;
  label: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-4 sm:px-6">
          <div className="h-5 w-11 shrink-0 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div
            className="h-4 flex-1 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800"
            /* 행마다 길이를 달리해 "글자"처럼 보이게 합니다 */
            style={{ maxWidth: `${70 - i * 12}%` }}
          />
          <div className="hidden h-3 w-20 shrink-0 animate-pulse rounded bg-neutral-200 sm:block dark:bg-neutral-800" />
        </div>
      ))}
    </div>
  );
}

/** 후기 캐러셀용 — 카드 폭·여백을 실제 카드와 맞춥니다 */
export function SkeletonCards({
  count = 3,
  label,
}: {
  count?: number;
  label: string;
}) {
  return (
    <div role="status" aria-live="polite" className="flex gap-4 overflow-hidden">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-[300px] shrink-0 rounded-2xl border border-neutral-200 bg-white p-6 sm:w-[360px] dark:border-neutral-800 dark:bg-neutral-900"
        >
          {/* 인용부호 자리 */}
          <div className="h-5 w-7 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-5 space-y-2">
            <div className="h-3.5 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3.5 w-11/12 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-3.5 w-4/5 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
          {/* 이니셜 원 + 이름·소속 두 줄 */}
          <div className="mt-5 flex items-center gap-2.5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <div className="size-8 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <div className="flex-1">
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
