# 운영 가이드

## 전체 구조

```
GitHub (코드)  github.com/soyhoney/beehive-web   ← Private
      │
      ▼  로컬 빌드 후 수동 배포
Netlify        beehive-corp.netlify.app          ← 정적 호스팅, 무료
      │
      ▼  견적 폼 제출
Apps Script    script.google.com/.../exec        ← 접수 처리
      │
      ├─▶ 구글 시트    「전체」 탭 + 구분별 탭
      ├─▶ 구글 드라이브 「비하이브 견적문의 첨부파일」/접수번호/
      └─▶ 메일         고객 접수 확인 + 담당자 알림
```

**월 고정비 0원.** 도메인 `beehivecorp.co.kr` 은 가비아에 2029-04-17 까지 결제되어 있다.

---

## 로컬 개발

```bash
npm run dev      # http://localhost:3000
npm run build    # 정적 빌드 → out/
npx tsc --noEmit # 타입 검사
```

`output: "export"` 라서 서버 라우트를 쓸 수 없다. 나중에 서버가 필요해지면
`next.config.ts` 의 그 한 줄을 지우면 된다.

## 배포

```bash
npm run build
npx netlify-cli deploy --dir=out --prod
```

최초 1회 `npx netlify-cli login` 필요. Netlify 팀 슬러그는 `bellakim970123`.

> **중요**: `NEXT_PUBLIC_QUOTE_ENDPOINT` 는 **빌드 시점에 코드로 박힌다.**
> `.env.local` 을 고쳤으면 반드시 다시 빌드해야 반영된다.

## 환경 변수

`.env.local` (git 제외됨):

```
NEXT_PUBLIC_QUOTE_ENDPOINT=https://script.google.com/macros/s/.../exec
```

`.env.local.example` 참고.

---

## Apps Script

설치 · 배포 절차는 [`apps-script/README.md`](../apps-script/README.md) 참고.

**자주 걸리는 것들:**

- **저장(⌘S)만으로는 반영되지 않는다.** `배포 → 배포 관리 → ✏️ → 버전: 새 버전 → 배포`
- `새 배포` 를 누르면 **URL이 새로 생긴다.** 기존 URL을 유지하려면 반드시 `배포 관리 → 수정`
- 새 권한(예: Drive)을 추가했으면 **재승인 후 다시 배포**해야 한다.
  `appsscript.json` 의 `oauthScopes` 에 필요한 범위를 명시해 뒀다
- 편집기에 코드를 붙여넣을 때 **일부만 복사되는 일이 잦다.** 붙여넣은 뒤
  마지막 줄 번호가 원본과 같은지 확인할 것

**설정 위치** (`apps-script/Code.gs` 상단):

| 상수 | 용도 |
|---|---|
| `SHEET_ID` | 데이터를 쌓을 시트 |
| `NOTIFY_TO` | 접수 알림 받을 주소 |
| `DRIVE_FOLDER_ID` | 첨부파일 보관 폴더 ID (드라이브 URL의 `/folders/` 뒤 문자열) |

## 시트 구조

| 탭 | 내용 |
|---|---|
| **전체** | 모든 문의를 공통 컬럼으로 — 클라이언트 DB · 영업 현황 |
| 구분별 탭 | 해당 카테고리 문항이 그대로 컬럼이 되는 상세 표 |

탭과 헤더는 **첫 문의 때 자동 생성**된다. 문항을 추가해도 헤더 끝에 컬럼이 자동으로
붙으므로 기존 데이터가 밀리지 않는다.

**전체 탭 맨 끝의 `RAW_JSON` 컬럼을 지우지 말 것.** 전체 응답 원본이 들어 있어
나중에 실제 DB로 옮길 때 이 컬럼만으로 복원이 가능하다.

> ⚠️ 시트에는 고객 개인정보가 쌓인다. 공유 범위를 **제한됨**으로 유지하고
> 필요한 사람만 개별 초대할 것.

---

## 도메인 연결 (아직 미실행)

도메인은 **회사 명의**로 가비아에 등록되어 있다. 제작 업체 소유가 아니므로
업체 동의 없이 DNS를 바꿀 수 있다.

**⚠️ 최대 리스크 — 회사 메일이 이 도메인에 물려 있다.**

```
MX  1  smtp.google.com          ← 구글 Workspace
MX 15  ...mx-verification.google.com
```

`info@` · `service@beehivecorp.co.kr` 이 여기서 돈다. **MX 레코드를 건드리면 메일이 죽는다.**

**안전한 방법** — 네임서버는 가비아에 그대로 두고 A 레코드만 바꾼다:

```
A      @     49.247.208.119  →  75.2.60.5   (Netlify)
CNAME  www   →  beehive-corp.netlify.app
```

MX · TXT는 손대지 않는다. HTTPS 인증서는 Netlify가 자동 발급 · 갱신한다.

**순서**: 사이트 확정 → DNS 변경 → 기존 임대 홈페이지(`urr.kr`) 해지

---

## 유용한 명령

```bash
# 실제 뷰포트로 화면 확인 (headless Chrome은 모바일 뷰포트를 적용하지 않으므로
# iframe으로 폭을 강제해야 정확하다)
cd out && python3 -m http.server 4321
```

```bash
# 배포된 사이트 점검
curl -s -o /dev/null -w "%{http_code}\n" https://beehive-corp.netlify.app/
```
