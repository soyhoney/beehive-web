"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  CONTACT_FIELDS,
  ROUTES,
  ROUTE_ETC,
  ROUTE_REFERRAL,
  getFlow,
  parseOption,
  type Category,
  type CategoryId,
  type Question,
} from "@/lib/quote-flow";
import { calculateEstimate, formatKRW, type Answer, type Answers } from "@/lib/pricing";
import {
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  SCHEMA_VERSION,
  formatBytes,
  submitQuote,
  type AttachedFile,
  type ContactInfo,
  type FileUpload,
  type Submission,
} from "@/lib/submission";

const ENDPOINT = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "";

/**
 * 파일을 base64 문자열로 읽는다.
 * 큰 파일에서 String.fromCharCode 인자 개수 한도를 넘지 않도록 청크로 나눠 처리한다.
 */
async function toBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const CHUNK = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

/** 단계 구성: 카테고리 선택 → 문항들 → 연락처 → 완료 */
type Stage = { kind: "category" } | { kind: "question"; index: number } | { kind: "contact" } | { kind: "done" };

const EMPTY_CONTACT: ContactInfo = { org: "", name: "", email: "", phone: "" };

/**
 * 홈 화면의 서비스 카드에서 들어오면 initialCategory가 채워져 유형 선택 단계를 건너뜁니다.
 * 상단바의 "견적 신청하기"로 들어오면 비어 있어 유형 선택부터 시작합니다.
 */
export default function QuoteWizard({
  initialCategory,
}: {
  initialCategory?: Category;
}) {
  const [category, setCategory] = useState<Category | null>(initialCategory ?? null);
  const [stage, setStage] = useState<Stage>(
    initialCategory ? { kind: "question", index: 0 } : { kind: "category" },
  );
  const [answers, setAnswers] = useState<Answers>({});
  const [contact, setContact] = useState<ContactInfo>(EMPTY_CONTACT);
  const [routes, setRoutes] = useState<string[]>([]);
  const [routeReferral, setRouteReferral] = useState("");
  const [routeEtc, setRouteEtc] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [refNo, setRefNo] = useState("");

  const flow = useMemo(
    () => (category ? getFlow(category.id as CategoryId, answers) : []),
    [category, answers],
  );

  const totalSteps = flow.length + 1; // 문항 + 연락처
  const currentStep =
    stage.kind === "question" ? stage.index : stage.kind === "contact" ? flow.length : 0;
  const progress = stage.kind === "category" ? 0 : ((currentStep + 1) / totalSteps) * 100;

  const estimate = useMemo(
    () => (category ? calculateEstimate(category.id as CategoryId, answers) : null),
    [category, answers],
  );

  function updateAnswer(id: string, patch: Partial<Answer>) {
    setAnswers((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function selectCategory(next: Category) {
    setCategory(next);
    setAnswers({});
    setStage({ kind: "question", index: 0 });
  }

  function goNext() {
    if (stage.kind !== "question") return;
    // 교육(E)은 첫 문항 답변에 따라 이후 문항이 바뀌므로 매번 flow를 다시 읽는다.
    const nextIndex = stage.index + 1;
    setStage(nextIndex < flow.length ? { kind: "question", index: nextIndex } : { kind: "contact" });
  }

  function goBack() {
    if (stage.kind === "contact") {
      setStage({ kind: "question", index: flow.length - 1 });
      return;
    }
    if (stage.kind === "question") {
      if (stage.index === 0) {
        setCategory(null);
        setStage({ kind: "category" });
      } else {
        setStage({ kind: "question", index: stage.index - 1 });
      }
    }
  }

  /** 현재 문항에 답이 채워졌는지 */
  function isAnswered(question: Question): boolean {
    const answer = answers[question.id];
    if (!answer) return false;

    switch (question.type) {
      case "choice": {
        if (answer.idx === undefined) return false;
        // 2차 선택지가 열렸으면 그것도 골라야 한다.
        if (question.subChoice?.when === answer.idx) {
          return answer.sub !== undefined || Boolean(answer.subCustom?.trim());
        }
        // 추가 입력이 열렸으면 채워야 한다. (예산 구간, 인원수 등)
        if (question.followInput?.when === answer.idx) {
          return Boolean(answer.extra?.trim());
        }
        return true;
      }
      case "text":
      case "text1":
        return Boolean(answer.val?.trim());
      case "dates":
        return answer.tbd ? Boolean(answer.tbdText?.trim()) : Boolean(answer.d1);
    }
  }

  const contactValid =
    CONTACT_FIELDS.every((f) => contact[f.id as keyof ContactInfo]?.trim()) &&
    /\S+@\S+\.\S+/.test(contact.email) &&
    agreed;

  /** 첨부 용량을 확인하고 통과하면 상태에 담는다. */
  function acceptFiles(questionId: string, list: File[]) {
    const oversized = list.find((f) => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setError(
        `‘${oversized.name}’ 파일이 너무 큽니다. 파일 하나당 ${formatBytes(MAX_FILE_BYTES)}까지 첨부할 수 있습니다.`,
      );
      return;
    }

    const others = Object.entries(files)
      .filter(([id]) => id !== questionId)
      .flatMap(([, l]) => l);
    const total = [...others, ...list].reduce((sum, f) => sum + f.size, 0);

    if (total > MAX_TOTAL_BYTES) {
      setError(
        `첨부파일 합계가 ${formatBytes(MAX_TOTAL_BYTES)}를 넘습니다. 용량을 줄이거나 메일로 따로 보내주세요.`,
      );
      return;
    }

    setError("");
    setFiles((prev) => ({ ...prev, [questionId]: list }));
  }

  async function handleSubmit() {
    if (!category || !estimate || !contactValid) return;
    setSending(true);
    setError("");

    const entries = Object.entries(files).flatMap(([questionId, list]) =>
      list.map((file) => ({ questionId, file })),
    );

    // 시트·RAW_JSON에는 메타데이터만, 파일 본문은 따로 실어 보냅니다.
    const attached: AttachedFile[] = entries.map(({ questionId, file }) => ({
      questionId,
      fileName: file.name,
      size: file.size,
      type: file.type,
    }));

    let uploads: FileUpload[];
    try {
      uploads = await Promise.all(
        entries.map(async ({ questionId, file }) => ({
          questionId,
          fileName: file.name,
          size: file.size,
          type: file.type,
          data: await toBase64(file),
        })),
      );
    } catch {
      setSending(false);
      setError("첨부파일을 읽지 못했습니다. 파일을 다시 선택해 주세요.");
      return;
    }

    const now = new Date().toISOString();
    const submission: Submission = {
      schemaVersion: SCHEMA_VERSION,
      submittedAt: now,
      categoryId: category.id as CategoryId,
      categoryLabel: category.title,
      answers,
      contact,
      routes,
      routeReferral,
      routeEtc,
      privacyAgreed: agreed,
      privacyAgreedAt: now,
      estimate,
      files: attached,
    };

    const result = await submitQuote(submission, ENDPOINT, uploads);
    setSending(false);

    if (result.ok) {
      setRefNo(result.refNo ?? "");
      setStage({ kind: "done" });
    } else {
      setError(result.error ?? "전송에 실패했습니다.");
    }
  }

  // -------------------------------------------------------------------------

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-10">
      {stage.kind !== "category" && stage.kind !== "done" && (
        <div className="mb-8">
          <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-brand transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
            <span>{category?.title}</span>
            <span>
              {currentStep + 1} / {totalSteps}
            </span>
          </div>
        </div>
      )}

      {stage.kind === "category" && <CategoryPicker onSelect={selectCategory} />}

      {stage.kind === "question" && flow[stage.index] && (
        <QuestionView
          question={flow[stage.index]}
          answer={answers[flow[stage.index].id]}
          files={files[flow[stage.index].id] ?? []}
          onChange={(patch) => updateAnswer(flow[stage.index].id, patch)}
          onFiles={(list) => acceptFiles(flow[stage.index].id, list)}
        />
      )}

      {stage.kind === "contact" && (
        <ContactView
          contact={contact}
          onContact={setContact}
          routes={routes}
          onRoutes={setRoutes}
          routeReferral={routeReferral}
          onRouteReferral={setRouteReferral}
          routeEtc={routeEtc}
          onRouteEtc={setRouteEtc}
          agreed={agreed}
          onAgreed={setAgreed}
        />
      )}

      {stage.kind === "done" && <DoneView refNo={refNo} estimate={estimate} />}

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}

      {(stage.kind === "question" || stage.kind === "contact") && (
        <div className="mt-10 flex gap-3">
          <button
            type="button"
            onClick={goBack}
            className="rounded-lg border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
          >
            이전
          </button>

          {stage.kind === "question" ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!isAnswered(flow[stage.index])}
              className="flex-1 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition enabled:hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:enabled:hover:bg-neutral-200"
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!contactValid || sending}
              className="flex-1 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-neutral-900 transition enabled:hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? "전송 중…" : "견적 문의 보내기"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function CategoryPicker({ onSelect }: { onSelect: (c: Category) => void }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">어떤 도움이 필요하신가요?</h1>
      <p className="mt-2 text-sm text-neutral-500">
        유형을 선택하시면 필요한 내용만 여쭤봅니다. 1~2분이면 충분합니다.
      </p>

      <div className="mt-8 grid gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category)}
            className="group rounded-xl border border-neutral-200 px-5 py-4 text-left transition hover:border-brand hover:bg-brand-soft dark:border-neutral-800"
          >
            <div className="font-semibold">{category.title}</div>
            <div className="mt-1 text-sm text-neutral-500">{category.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

interface QuestionViewProps {
  question: Question;
  answer: Answer | undefined;
  files: File[];
  onChange: (patch: Partial<Answer>) => void;
  onFiles: (files: File[]) => void;
}

function QuestionView({ question, answer, files, onChange, onFiles }: QuestionViewProps) {
  const selected = answer?.idx;
  const showHint = question.hint && selected === question.hint.when;
  const showSubChoice = question.subChoice && selected === question.subChoice.when;
  const showFollowInput = question.followInput && selected === question.followInput.when;

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight">{question.title}</h2>
      {question.sub && <p className="mt-2 text-sm text-neutral-500">{question.sub}</p>}

      <div className="mt-7 space-y-3">
        {question.type === "choice" &&
          question.options?.map((option, index) => {
            const { label, desc } = parseOption(option);
            const active = selected === index;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onChange({ idx: index, sub: undefined, subCustom: "", extra: "" })}
                className={`w-full rounded-xl border px-5 py-4 text-left transition ${
                  active
                    ? "border-brand-border bg-brand-soft text-foreground"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                }`}
              >
                <div className="text-sm font-medium">{label}</div>
                {desc && <div className="mt-1 text-xs text-neutral-500">{desc}</div>}
              </button>
            );
          })}

        {question.type === "text" && (
          <textarea
            rows={6}
            value={answer?.val ?? ""}
            placeholder={question.ph}
            onChange={(e) => onChange({ val: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-brand dark:border-neutral-800 dark:bg-neutral-950"
          />
        )}

        {question.type === "text1" && (
          <input
            type="text"
            value={answer?.val ?? ""}
            placeholder={question.ph}
            onChange={(e) => onChange({ val: e.target.value })}
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-brand dark:border-neutral-800 dark:bg-neutral-950"
          />
        )}

        {question.type === "dates" && (
          <DatesField question={question} answer={answer} onChange={onChange} />
        )}
      </div>

      {showSubChoice && question.subChoice && (
        <div className="mt-5 rounded-xl bg-neutral-50 p-4 dark:bg-neutral-900">
          <div className="flex flex-wrap gap-2">
            {question.subChoice.options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => onChange({ sub: index, subCustom: "" })}
                className={`rounded-lg border px-3 py-2 text-xs transition ${
                  answer?.sub === index
                    ? "border-brand-border bg-brand-soft text-foreground"
                    : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700"
                }`}
              >
                {parseOption(option).label}
              </button>
            ))}
          </div>
          {question.subChoice.textLabel && (
            <input
              type="text"
              value={answer?.subCustom ?? ""}
              placeholder={question.subChoice.textPh}
              onChange={(e) => onChange({ subCustom: e.target.value, sub: undefined })}
              className="mt-3 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-brand dark:border-neutral-700 dark:bg-neutral-950"
            />
          )}
        </div>
      )}

      {showFollowInput && question.followInput && (
        <div className="mt-5">
          <span className="text-xs font-medium text-neutral-500">
            {question.followInput.label}
          </span>
          {question.followInput.options ? (
            <ChipGroup
              options={question.followInput.options}
              value={answer?.extra ?? ""}
              onSelect={(value) => onChange({ extra: value })}
            />
          ) : (
            <input
              type="text"
              value={answer?.extra ?? ""}
              placeholder={question.followInput.ph}
              onChange={(e) => onChange({ extra: e.target.value })}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950"
            />
          )}
        </div>
      )}

      {showHint && (
        <p className="mt-5 rounded-lg bg-brand-soft px-4 py-3 text-xs text-foreground">
          {question.hint?.text}
        </p>
      )}

      {question.file && (
        <div className="mt-6">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-sm text-neutral-600 transition hover:border-brand dark:border-neutral-700 dark:text-neutral-400">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => onFiles(Array.from(e.target.files ?? []))}
            />
            파일 첨부
          </label>
          {files.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-neutral-500">
              {files.map((file) => (
                <li key={file.name}>· {file.name}</li>
              ))}
            </ul>
          )}
          {question.fileNote && (
            <p className="mt-2 text-xs text-neutral-500">{question.fileNote}</p>
          )}
        </div>
      )}
    </div>
  );
}

/** 보기를 알약 버튼으로 나열한다. 자유 입력 대신 고르게 해 입력 부담을 줄인다. */
function ChipGroup({
  options,
  value,
  onSelect,
}: {
  options: readonly string[];
  value: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={`rounded-lg border px-3.5 py-2.5 text-sm transition ${
            value === option
              ? "border-brand-border bg-brand-soft font-medium text-foreground"
              : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

/** 클릭하면 브라우저 달력이 바로 열리는 날짜 입력 */
function DateInput({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <input
        type="date"
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // 칸 아무 곳이나 눌러도 달력이 뜨도록 합니다.
        // (기본 동작은 작은 달력 아이콘을 정확히 눌러야 열립니다)
        onClick={(e) => e.currentTarget.showPicker?.()}
        onFocus={(e) => e.currentTarget.showPicker?.()}
        className="mt-2 w-full cursor-pointer rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-brand disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:bg-neutral-950"
      />
    </label>
  );
}

function DatesField({
  question,
  answer,
  onChange,
}: {
  question: Question;
  answer: Answer | undefined;
  onChange: (patch: Partial<Answer>) => void;
}) {
  const tbd = Boolean(answer?.tbd);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <DateInput
          label="시작일"
          value={answer?.d1 ?? ""}
          disabled={tbd}
          onChange={(d1) => onChange({ d1 })}
        />
        <DateInput
          label="종료일"
          value={answer?.d2 ?? ""}
          disabled={tbd}
          onChange={(d2) => onChange({ d2 })}
        />
      </div>

      {question.extraInput && (
        <div>
          <span className="text-xs font-medium text-neutral-500">
            {question.extraInput.label}
          </span>
          {question.extraInput.options ? (
            <ChipGroup
              options={question.extraInput.options}
              value={answer?.extra ?? ""}
              onSelect={(extra) => onChange({ extra })}
            />
          ) : (
            <input
              type="text"
              value={answer?.extra ?? ""}
              placeholder={question.extraInput.ph}
              onChange={(e) => onChange({ extra: e.target.value })}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950"
            />
          )}
        </div>
      )}

      {question.tbd && (
        <>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={tbd}
              onChange={(e) => onChange({ tbd: e.target.checked })}
              className="size-4 accent-brand"
            />
            일정이 아직 미정입니다
          </label>

          {tbd && (
            <div>
              <p className="mb-2 text-xs text-neutral-500">{question.tbd.hint}</p>
              <input
                type="text"
                value={answer?.tbdText ?? ""}
                placeholder={question.tbd.ph}
                onChange={(e) => onChange({ tbdText: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

interface ContactViewProps {
  contact: ContactInfo;
  onContact: (c: ContactInfo) => void;
  routes: string[];
  onRoutes: (r: string[]) => void;
  routeReferral: string;
  onRouteReferral: (v: string) => void;
  routeEtc: string;
  onRouteEtc: (v: string) => void;
  agreed: boolean;
  onAgreed: (v: boolean) => void;
}

function ContactView(props: ContactViewProps) {
  const { contact, onContact, routes, onRoutes, agreed, onAgreed } = props;

  function toggleRoute(route: string) {
    onRoutes(routes.includes(route) ? routes.filter((r) => r !== route) : [...routes, route]);
  }

  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight">연락처를 알려주세요.</h2>
      <p className="mt-2 text-sm text-neutral-500">
        견적서를 보내드릴 곳입니다. 영업일 기준 1~2일 내에 회신드립니다.
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {CONTACT_FIELDS.map((field) => (
          <label key={field.id} className="block">
            <span className="text-xs font-medium text-neutral-500">{field.label}</span>
            <input
              type={field.type}
              value={contact[field.id as keyof ContactInfo]}
              placeholder={field.ph}
              onChange={(e) => onContact({ ...contact, [field.id]: e.target.value })}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950"
            />
          </label>
        ))}
      </div>

      <div className="mt-8">
        <span className="text-xs font-medium text-neutral-500">
          비하이브를 어떻게 알게 되셨나요? (복수 선택 가능)
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {ROUTES.map((route) => (
            <button
              key={route}
              type="button"
              onClick={() => toggleRoute(route)}
              className={`rounded-lg border px-3 py-2 text-xs transition ${
                routes.includes(route)
                  ? "border-brand-border bg-brand-soft text-foreground"
                  : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-700"
              }`}
            >
              {route}
            </button>
          ))}
        </div>

        {routes.includes(ROUTE_REFERRAL) && (
          <input
            type="text"
            value={props.routeReferral}
            placeholder="추천인 성함"
            onChange={(e) => props.onRouteReferral(e.target.value)}
            className="mt-3 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950"
          />
        )}
        {routes.includes(ROUTE_ETC) && (
          <input
            type="text"
            value={props.routeEtc}
            placeholder="직접 입력"
            onChange={(e) => props.onRouteEtc(e.target.value)}
            className="mt-3 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-brand dark:border-neutral-800 dark:bg-neutral-950"
          />
        )}
      </div>

      <div className="mt-8 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => onAgreed(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-brand"
          />
          <span>
            <strong className="font-semibold">개인정보 수집 · 이용에 동의합니다.</strong> (필수)
          </span>
        </label>

        <div className="mt-3 space-y-1 text-xs leading-relaxed text-neutral-500">
          <p>· 수집 항목: 업체·기관명, 담당자명, 이메일, 휴대폰번호, 문의 내용</p>
          <p>· 수집 목적: 견적 산출 및 회신, 문의 응대, 계약 체결 협의</p>
          <p>· 보유 기간: 문의 처리 완료 후 3년 (계약 체결 시 관계 법령에 따름)</p>
          <p>· 동의를 거부하실 수 있으나, 이 경우 견적 회신이 제한됩니다.</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

function DoneView({
  refNo,
  estimate,
}: {
  refNo: string;
  estimate: ReturnType<typeof calculateEstimate> | null;
}) {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-soft text-2xl">
        ✓
      </div>
      <h2 className="mt-6 text-xl font-bold tracking-tight">문의가 접수되었습니다.</h2>
      {refNo && (
        <p className="mt-2 text-sm text-neutral-500">
          접수번호 <span className="font-mono font-semibold">{refNo}</span>
        </p>
      )}

      {estimate?.auto && estimate.lines.length > 0 && (
        <div className="mt-8 rounded-xl border border-neutral-200 p-5 text-left dark:border-neutral-800">
          <div className="text-xs font-semibold text-neutral-500">예상 견적</div>
          <ul className="mt-4 space-y-2 text-sm">
            {estimate.lines.map((line) => (
              <li key={line.label} className="flex justify-between gap-4">
                <span>
                  {line.label}
                  {line.detail && (
                    <span className="mt-0.5 block text-xs text-neutral-500">{line.detail}</span>
                  )}
                </span>
                <span className="shrink-0 tabular-nums">{formatKRW(line.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800">
            <div className="flex justify-between text-neutral-500">
              <span>공급가액</span>
              <span className="tabular-nums">{formatKRW(estimate.subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>부가세</span>
              <span className="tabular-nums">{formatKRW(estimate.vat)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>합계</span>
              <span className="tabular-nums">{formatKRW(estimate.total)}</span>
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm leading-relaxed text-neutral-500">{estimate?.note}</p>

      <p className="mt-8 text-xs text-neutral-400">
        입력하신 이메일로 접수 확인 메일을 보내드렸습니다.
      </p>
    </div>
  );
}
