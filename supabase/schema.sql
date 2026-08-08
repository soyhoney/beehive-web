-- 비하이브코퍼레이션 견적 · 클라이언트 DB 스키마
-- Supabase SQL Editor에 그대로 붙여넣어 실행하세요.

-- ---------------------------------------------------------------------------
-- 클라이언트 (업체 · 기관 단위)
--
-- 견적 요청이 들어올 때마다 이메일 기준으로 upsert 하여, 같은 담당자가 여러 번
-- 문의해도 한 행으로 누적됩니다. 4분기 목표인 "클라이언트 DB 축적"의 본체입니다.
-- ---------------------------------------------------------------------------
create table if not exists public.clients (
  id           uuid primary key default gen_random_uuid(),
  org          text        not null,
  name         text        not null,
  email        text        not null,
  phone        text,
  -- 누적 지표: 문의가 들어올 때마다 갱신
  request_count integer    not null default 0,
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now(),
  -- 영업 메모 (관리자만 작성)
  memo         text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 이메일은 대소문자 무시하고 유일하게 취급
create unique index if not exists clients_email_lower_idx
  on public.clients (lower(email));

-- ---------------------------------------------------------------------------
-- 견적 요청
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.quote_status as enum (
    'new',        -- 접수됨
    'reviewing',  -- 담당자 검토 중
    'quoted',     -- 확정 견적 발송
    'won',        -- 수주
    'lost',       -- 실주
    'archived'    -- 보관
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.quote_requests (
  id              uuid primary key default gen_random_uuid(),
  -- 고객 안내용 접수번호 (예: BH-20260808-0001)
  ref_no          text        not null unique,
  client_id       uuid        not null references public.clients(id) on delete restrict,

  -- 카테고리 (A~F). 라벨도 함께 저장해 문항이 개편돼도 과거 데이터를 읽을 수 있게 둠
  category_id     text        not null,
  category_label  text        not null,

  -- 단계형 폼 답변 원본. 문항 구조가 바뀌어도 과거 요청을 그대로 재현할 수 있음
  answers         jsonb       not null default '{}'::jsonb,

  -- 유입 경로
  routes          text[]      not null default '{}',
  route_referral  text,       -- "지인 추천" 선택 시 추천인
  route_etc       text,       -- "기타" 선택 시 직접 입력

  -- 개인정보 수집 · 이용 동의 (동의 시각까지 함께 보관해야 입증이 됩니다)
  privacy_agreed     boolean     not null,
  privacy_agreed_at  timestamptz not null,

  -- 자동 산출 결과 스냅샷 (auto / lines / subtotal / vat / total / note)
  -- 단가표가 바뀌어도 당시 고객에게 보낸 금액이 남도록 계산 결과를 통째로 저장
  estimate        jsonb,

  status          public.quote_status not null default 'new',
  admin_memo      text,

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists quote_requests_client_idx
  on public.quote_requests (client_id);
create index if not exists quote_requests_created_idx
  on public.quote_requests (created_at desc);
create index if not exists quote_requests_status_idx
  on public.quote_requests (status);

-- ---------------------------------------------------------------------------
-- 첨부 파일 (Supabase Storage의 quote-files 버킷에 저장하고 경로만 기록)
-- ---------------------------------------------------------------------------
create table if not exists public.quote_files (
  id         uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.quote_requests(id) on delete cascade,
  -- 답변 중 어떤 문항의 첨부인지 (예: 'detail', 'volume')
  question_id text not null,
  file_name  text not null,
  storage_path text not null,
  size_bytes bigint,
  content_type text,
  created_at timestamptz not null default now()
);

create index if not exists quote_files_request_idx
  on public.quote_files (request_id);

-- ---------------------------------------------------------------------------
-- updated_at 자동 갱신
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists clients_touch on public.clients;
create trigger clients_touch before update on public.clients
  for each row execute function public.touch_updated_at();

drop trigger if exists quote_requests_touch on public.quote_requests;
create trigger quote_requests_touch before update on public.quote_requests
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 접수번호 발급: BH-YYYYMMDD-NNNN (당일 순번)
-- ---------------------------------------------------------------------------
create sequence if not exists public.quote_ref_seq;

create or replace function public.next_ref_no()
returns text language plpgsql as $$
declare
  today text := to_char(now() at time zone 'Asia/Seoul', 'YYYYMMDD');
  n     bigint;
begin
  -- 당일 접수 건수 + 1. 동시 접수 시에도 유일성은 ref_no unique 제약이 보장합니다.
  select count(*) + 1 into n
    from public.quote_requests
   where (created_at at time zone 'Asia/Seoul')::date
       = (now() at time zone 'Asia/Seoul')::date;
  return 'BH-' || today || '-' || lpad(n::text, 4, '0');
end $$;

-- ---------------------------------------------------------------------------
-- 보안: RLS를 켜고 정책을 두지 않습니다.
--
-- 익명 키(anon)로는 아무것도 읽거나 쓸 수 없고, 서버(Route Handler)에서
-- service_role 키로만 접근합니다. service_role 키는 절대 클라이언트로 내보내지 마세요.
-- ---------------------------------------------------------------------------
alter table public.clients        enable row level security;
alter table public.quote_requests enable row level security;
alter table public.quote_files    enable row level security;

-- ---------------------------------------------------------------------------
-- 관리자 조회용 뷰
-- ---------------------------------------------------------------------------
create or replace view public.quote_requests_view as
select
  r.id,
  r.ref_no,
  r.created_at,
  r.status,
  r.category_label,
  c.org,
  c.name  as contact_name,
  c.email,
  c.phone,
  c.request_count,
  (r.estimate ->> 'auto')::boolean as auto_estimated,
  (r.estimate ->> 'total')::numeric as estimated_total,
  r.routes,
  r.answers,
  r.admin_memo
from public.quote_requests r
join public.clients c on c.id = r.client_id
order by r.created_at desc;
