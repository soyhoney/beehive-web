/**
 * 공지사항 데이터 계약.
 *
 * 시트 스키마와 Apps Script 응답 형태는 docs/CONTENT-SHEETS.md 참고.
 * 언니가 시트 한 줄 추가하면 사이트가 바로 반영합니다.
 */

export interface Notice {
  id: string;
  /** 뱃지 라벨 — 오렌지("공지"/"Notice") 또는 회색("안내"/"Info"). 시트에서 언니가 직접 선택. */
  kind: "공지" | "안내" | "Notice" | "Info";
  title: string;
  /** 카드에 인라인으로 보여줄 짧은 요약 */
  body: string;
  /** yyyy-MM-dd */
  date: string;
}

interface NoticesResponse {
  ok: boolean;
  items?: Notice[];
}

/**
 * 견적 접수용으로 이미 배포되어 있는 Apps Script 웹앱에
 * `?type=notices` 파라미터를 붙여 GET 합니다.
 * 엔드포인트가 비어 있으면 빈 배열을 돌려주고 UI는 dummy를 유지합니다.
 */
export async function fetchNotices(endpoint: string): Promise<Notice[]> {
  if (!endpoint) return [];

  const url = new URL(endpoint);
  url.searchParams.set("type", "notices");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`notices fetch failed: ${res.status}`);
  const data = (await res.json()) as NoticesResponse;
  return data.items ?? [];
}
