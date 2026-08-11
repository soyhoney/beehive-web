/**
 * 콘텐츠 진입점.
 *
 * 화면 컴포넌트는 이 파일의 getContent(locale) 만 씁니다.
 * 언어가 늘어나도 컴포넌트는 손댈 필요가 없습니다.
 */

import type { Locale } from "../i18n";
import { ko } from "./ko";
import { en } from "./en";
import { SHARED } from "./shared";
import type { SiteContent } from "./types";

const CONTENT: Record<Locale, SiteContent> = { ko, en };

export function getContent(locale: Locale): SiteContent {
  return CONTENT[locale];
}

export { SHARED };
export type * from "./types";
