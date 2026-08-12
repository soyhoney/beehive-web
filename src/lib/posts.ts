/**
 * 소식(블로그) 데이터 계약.
 *
 * 시트 스키마와 Apps Script 응답 형태는 docs/CONTENT-SHEETS.md 참고.
 * 언니가 블로그 글을 올리고 시트에 한 줄 추가하면 사이트 소식 표에 뜹니다.
 */

export interface Post {
  id: string;
  title: string;
  /** 네이버 블로그 글 URL. 있으면 행 클릭 시 새 탭으로 이동합니다. */
  link: string;
  /** yyyy-MM-dd */
  date: string;
}

interface PostsResponse {
  ok: boolean;
  items?: Post[];
}

export async function fetchPosts(endpoint: string): Promise<Post[]> {
  if (!endpoint) return [];

  const url = new URL(endpoint);
  url.searchParams.set("type", "posts");

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`posts fetch failed: ${res.status}`);
  const data = (await res.json()) as PostsResponse;
  return data.items ?? [];
}
