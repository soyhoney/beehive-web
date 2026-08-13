/**
 * 고객 후기 데이터 계약.
 *
 * 언니가 구글 폼으로 후기를 수집하면, 응답이 시트의 `testimonials` 탭에
 * 쌓입니다. 시트에서 **공개 체크박스를 켜야만** 사이트에 노출됩니다.
 * 스키마와 응답 형태는 docs/CONTENT-SHEETS.md 참고.
 */

import type { Testimonial } from "@/lib/content/types";

interface TestimonialsResponse {
  ok: boolean;
  items?: Testimonial[];
}

export async function fetchTestimonials(endpoint: string): Promise<Testimonial[]> {
  if (!endpoint) return [];

  const url = new URL(endpoint);
  url.searchParams.set("type", "testimonials");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`testimonials fetch failed: ${res.status}`);
  const data = (await res.json()) as TestimonialsResponse;
  return data.items ?? [];
}
