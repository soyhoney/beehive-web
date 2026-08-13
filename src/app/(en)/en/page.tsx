import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { alternatesFor } from "@/lib/metadata";

/*
 * title · description · openGraph · twitter 는 (en)/layout.tsx 의
 * ROOT_METADATA.en 이 담당합니다. 여기서 다시 적으면 두 곳이 갈라집니다.
 * (예전에 openGraph 만 영문으로 덮고 twitter 를 빠뜨려 트위터 미리보기에
 *  한국어 제목이 나갔습니다)
 */
export const metadata: Metadata = {
  alternates: alternatesFor("/", "en"),
};

export default function EnHome() {
  return <HomePage locale="en" />;
}
