import { useParams } from "wouter";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { SOURCES } from "../data/sources";
import { TIER_NAME_KEY } from "../data/constants";
import { useT } from "../i18n/useT";
import Section from "../ui/Section";
import { StatusChip } from "../ui/Chip";
import EmptyState from "../ui/EmptyState";

/** #/library/:sourceId (B2): a clause page for one source, linked from every CiteChip. */
export default function SourcePage() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const t = useT();
  const s = sourceId ? SOURCES[sourceId] : undefined;

  if (!s) {
    return (
      <div className="mx-auto max-w-[var(--w-main)] px-4 py-10 sm:px-6">
        <EmptyState message={t("sourceNotFound")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[var(--w-main)] px-4 py-10 sm:px-6">
      <p className="text-small text-ink-3">
        {t("tierLabel").replace("{n}", String(s.tier))} · {t(TIER_NAME_KEY[s.tier])} · {s.jur}
      </p>
      <h1 className="mt-1 text-h1 text-ink">{s.t}</h1>
      {s.flux && (
        <div className="mt-3">
          <StatusChip tone="input">{t("lawChanged")}</StatusChip>
        </div>
      )}

      <Section title={t("exactText")}>
        {s.excerpt ? (
          <blockquote className="rounded-control border border-line bg-wash px-4 py-3 text-body italic leading-relaxed text-ink-2">
            &ldquo;{s.excerpt}&rdquo;
          </blockquote>
        ) : (
          <p className="text-body leading-relaxed text-ink-2">{s.summary}</p>
        )}
      </Section>

      <Section title={t("authorityLabel")}>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-small">
          <dt className="text-ink-3">{t("issuedByLabel")}</dt>
          <dd className="text-ink-2">{s.by}</dd>
          <dt className="text-ink-3">{t("statusLabel")}</dt>
          <dd className="text-ink-2">{s.status}</dd>
          <dt className="text-ink-3">{t("versionLabel")}</dt>
          <dd className="text-ink-2">{s.ver}</dd>
          <dt className="text-ink-3">{t("accessLabel")}</dt>
          <dd className="text-ink-2">{s.paid ? t("paidAccessNote") : t("freeAccessNote")}</dd>
        </dl>
        {s.note && <p className="mt-3 text-small text-ink-3">{s.note}</p>}
        <a
          href={s.url}
          target="_blank"
          rel="noopener"
          className="mt-4 inline-flex items-center gap-1.5 text-small font-medium text-indigo hover:underline"
        >
          {t("openOfficialRecord")} <ArrowSquareOut size={14} />
        </a>
      </Section>
    </div>
  );
}
