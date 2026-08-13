"use client";

import { useEffect, useState } from "react";
import { fetchNotices, type Notice } from "@/lib/notices";
import KindBadge from "@/components/KindBadge";
import { SkeletonTable } from "@/components/Skeleton";

/**
 * 공지사항 아코디언 표.
 *
 * 언니가 구글 시트에서 관리하고, 이 컴포넌트가 실시간 fetch 후 표로 노출합니다.
 * 이미지는 두지 않습니다 — FAQ 스타일로 제목·날짜 행을 눌러 본문을 펼치는 방식입니다.
 *
 * 불러오는 동안에는 스켈레톤을 보여줍니다. 예전에는 시트 내용과 거의 같은 dummy 를
 * 보여줬는데, 그래서 연동이 끊겨도 화면이 정상처럼 보였습니다 (Skeleton.tsx 주석 참고).
 */
export default function NoticesBoard({ locale = "ko" }: { locale?: "ko" | "en" }) {
  const endpoint = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";
  const isEn = locale === "en";

  const [items, setItems] = useState<readonly Notice[]>([]);
  /*
   * 엔드포인트가 비어 있으면 애초에 불러올 수 없으므로 바로 error 로 둡니다.
   * 빌드 환경에 NEXT_PUBLIC_QUOTE_ENDPOINT 가 빠지면 이 상태가 되어 즉시 드러납니다.
   */
  const [state, setState] = useState<"loading" | "ready" | "error">(
    endpoint ? "loading" : "error",
  );

  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    fetchNotices(endpoint, locale)
      .then((list) => {
        if (cancelled) return;
        setItems(list);
        setState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, locale]);

  if (state === "loading") {
    return (
      <SkeletonTable label={isEn ? "Loading notices." : "공지를 불러오는 중입니다."} />
    );
  }

  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-neutral-500">
        {isEn ? "No notices yet." : "등록된 공지가 없습니다."}
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
      {items.map((notice) => (
        <NoticeRow key={notice.id || notice.title} notice={notice} />
      ))}
    </ul>
  );
}

function NoticeRow({ notice }: { notice: Notice }) {
  const hasBody = notice.body.length > 0;

  return (
    <li>
      <details className="group">
        <summary
          className={`flex cursor-pointer list-none items-center gap-3 px-4 py-4 sm:px-6 ${
            hasBody ? "hover:bg-neutral-50 dark:hover:bg-neutral-800/50" : ""
          }`}
        >
          <KindBadge kind={notice.kind} />
          <p className="flex-1 truncate text-sm font-semibold group-open:whitespace-normal">
            {notice.title}
          </p>
          <span className="hidden shrink-0 text-xs text-neutral-500 sm:inline">
            {notice.date}
          </span>
          {hasBody && (
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 text-neutral-400 transition group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </summary>

        {hasBody && (
          <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-4 text-sm leading-relaxed whitespace-pre-line text-neutral-700 sm:px-6 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300">
            {notice.body}
          </div>
        )}
      </details>
    </li>
  );
}
