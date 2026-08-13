"use client";

import { useEffect, useState } from "react";
import { fetchPosts, type Post } from "@/lib/posts";
import KindBadge from "@/components/KindBadge";

/**
 * 소식(네이버 블로그) 표.
 *
 * 공지사항과 동일한 표 UI를 사용합니다.
 * 각 행에는 "소식" 뱃지가 상시 붙고, 블로그 URL이 있으면 행 클릭 시 새 탭으로 이동합니다.
 * dummy fallback을 함께 두어 엔드포인트가 비어 있을 때도 화면이 비지 않습니다.
 */
export default function BlogPosts({
  fallback,
  locale = "ko",
}: {
  fallback: readonly Post[];
  locale?: "ko" | "en";
}) {
  const endpoint = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";
  const isEn = locale === "en";

  const [items, setItems] = useState<readonly Post[]>(fallback);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    if (!endpoint) return;
    let cancelled = false;
    setState("loading");
    fetchPosts(endpoint, locale)
      .then((list) => {
        if (cancelled) return;
        if (list.length > 0) setItems(list);
        setState("idle");
      })
      .catch(() => {
        if (cancelled) return;
        setState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, locale]);

  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-neutral-500">
        {isEn ? "No updates yet." : "등록된 소식이 없습니다."}
      </p>
    );
  }

  return (
    <ul className="mt-4 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
      {items.map((post) => (
        <PostRow key={post.id || post.title} post={post} kindLabel={isEn ? "Update" : "소식"} />
      ))}
      {state === "loading" && (
        <li className="sr-only" role="status">
          {isEn ? "Loading updates." : "소식을 불러오는 중입니다."}
        </li>
      )}
    </ul>
  );
}

function PostRow({ post, kindLabel }: { post: Post; kindLabel: "소식" | "Update" }) {
  const hasLink = post.link.length > 0;
  const Wrapper: React.ElementType = hasLink ? "a" : "div";
  const wrapperProps = hasLink
    ? { href: post.link, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <li>
      <Wrapper
        {...wrapperProps}
        className={`flex items-center gap-3 px-4 py-4 sm:px-6 ${
          hasLink ? "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50" : ""
        }`}
      >
        <KindBadge kind={kindLabel} />
        <p className="flex-1 truncate text-sm font-semibold">{post.title}</p>
        <span className="hidden shrink-0 text-xs text-neutral-500 sm:inline">{post.date}</span>
        {hasLink && (
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 text-neutral-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </Wrapper>
    </li>
  );
}
