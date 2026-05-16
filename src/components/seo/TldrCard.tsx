// GEO: Citation-friendly TL;DR block for LLM-quotable summaries.
// 디자인 — Article 페이지 상단에 배치하는 골드 액센트 카드.
// 각 bullet 은 "주제 + 숫자/사실 + 출처/날짜" 패턴으로 인용 친화 포맷.

import { SITE_NAME } from "@/lib/constants/site";

export interface TldrCardProps {
  /** 3~5개의 quotable bullets — 각 bullet 은 단독으로 인용해도 의미가 통해야 함 */
  bullets: string[];
  /** 출처/검수 라벨 (default: "메종 드 탤런트 편집팀 검수 · {YYYY-MM-DD}") */
  sourceLabel?: string;
  /** 마지막 갱신일 ISO string — 명시 시 sourceLabel 에 자동 포함 */
  updatedAt?: string;
  /** 카드 제목 (default: "한눈에 보기") */
  title?: string;
}

export default function TldrCard({ bullets, sourceLabel, updatedAt, title = "한눈에 보기" }: TldrCardProps) {
  const dateStr = updatedAt
    ? new Date(updatedAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
    : null;
  const finalSource = sourceLabel ?? `${SITE_NAME} 편집팀 검수${dateStr ? ` · ${dateStr}` : ""}`;

  return (
    <aside
      aria-label={title}
      className="card-lg p-5 sm:p-6 border-l-4 border-[var(--gold-400)] bg-gradient-to-br from-[var(--gold-50)]/50 to-transparent"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[0.625rem] tracking-[0.2em] uppercase text-[var(--gold-600)] font-semibold">TL;DR</span>
        <span className="h-px flex-1 bg-[var(--gold-400)]/30" />
        <span className="text-xs font-display font-semibold text-[var(--color-charcoal)]">{title}</span>
      </div>
      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="text-sm leading-relaxed text-[var(--warm-700)] flex items-start gap-2">
            <span className="shrink-0 text-[var(--gold-500)] mt-0.5" aria-hidden="true">
              •
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <p className="text-[0.6875rem] text-[var(--warm-500)] mt-4 pt-3 border-t border-[var(--gold-400)]/20">
        {finalSource}
      </p>
    </aside>
  );
}
