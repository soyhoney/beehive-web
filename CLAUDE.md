@AGENTS.md

# 비하이브코퍼레이션 웹사이트

작업을 시작하기 전에 [`docs/PROJECT.md`](./docs/PROJECT.md) 를 읽을 것.
클라이언트를 "1인 번역 프리랜서"로 오해하면 설계가 통째로 어긋난다.

| 문서 | 내용 |
|---|---|
| [docs/PROJECT.md](./docs/PROJECT.md) | 클라이언트 · 사업 규모 · 과업 범위 |
| [docs/DECISIONS.md](./docs/DECISIONS.md) | 왜 이렇게 만들었는지 |
| [docs/OPERATIONS.md](./docs/OPERATIONS.md) | 배포 · Apps Script · 도메인 |
| [docs/LEGACY-SITE.md](./docs/LEGACY-SITE.md) | 기존 사이트 점검 결과 |
| [docs/TODO.md](./docs/TODO.md) | 남은 작업 |

## 손대기 전에 알아둘 것

- **서버가 없다.** `output: "export"` 정적 빌드다. 서버 라우트를 추가하려면
  구조 결정부터 다시 해야 한다 — [DECISIONS.md](./docs/DECISIONS.md) 참고
- **문자열을 컴포넌트에 하드코딩하지 말 것.** `src/lib/content/` 에 넣는다.
  한 · 영이 같은 타입을 구현하므로 누락은 컴파일에서 걸린다
- **`NEXT_PUBLIC_QUOTE_ENDPOINT` 는 빌드 시점에 박힌다.** 바꿨으면 다시 빌드
- **도메인 DNS 작업 시 MX 레코드를 건드리면 회사 메일이 죽는다**
- 시트 · 드라이브 · 메일함은 접근 권한이 없어 직접 확인할 수 없다.
  변경 후에는 사람이 눈으로 확인해야 한다

## 주요 파일

```
src/lib/quote-flow.ts    견적 문항 정의 (카테고리 6종, 조건부 분기)
src/lib/pricing.ts       견적 산출 — 단가는 더미, RATES만 교체하면 됨
src/lib/submission.ts    시트 컬럼 계약 + 전송
src/lib/content/         언어별 콘텐츠 (ko / en / shared)
src/lib/i18n.ts          EN_ENABLED 로 영문 사이트 on/off
apps-script/Code.gs      접수 처리 (시트 적재 · 드라이브 · 메일)
supabase/schema.sql      나중에 DB로 옮길 때 쓸 스키마
```
