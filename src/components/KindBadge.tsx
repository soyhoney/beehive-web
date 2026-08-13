/**
 * 소식/공지 리스트 좌측 뱃지.
 * 시트에서 관리되는 3종 (공지 / 안내 / 소식)의 시각적 무게를 통일합니다.
 */
type Kind = "공지" | "안내" | "소식" | "Notice" | "Info" | "Update";

const STYLES: Record<Kind, string> = {
  공지: "bg-brand text-neutral-900",
  안내: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  소식: "bg-brand-soft text-brand-strong ring-1 ring-brand-border/30",
  Notice: "bg-brand text-neutral-900",
  Info: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  Update: "bg-brand-soft text-brand-strong ring-1 ring-brand-border/30",
};

export default function KindBadge({ kind }: { kind: Kind }) {
  return (
    <span
      className={`inline-flex w-12 shrink-0 items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-bold ${STYLES[kind]}`}
    >
      {kind}
    </span>
  );
}
