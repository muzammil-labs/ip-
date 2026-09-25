import { Link, useParams } from "wouter";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { SOURCES } from "../data/sources";
import { TIER_NAME_KEY } from "../data/constants";
import { useT } from "../i18n/useT";
import { useSession } from "../state/session";
import Section from "../ui/Section";
import { StatusChip } from "../ui/Chip";
import EmptyState from "../ui/EmptyState";
import TimeMachine from "../panels/TimeMachine";
import { versionAt } from "../engines/asOf";
import { citedIn } from "../lib/citedIn";

/** #/library/:sourceId (B2): a clause page for one source, linked from every CiteChip. */
export default function SourcePage() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const t = useT();
  const { asOfDate } = useSession();
  const s = sourceId ? SOURCES[sourceId] : undefined;

  if (!s || !sourceId) {
    return (
      <div className="mx-auto max-w-[var(--w-main)] px-4 py-10 sm:px-6">
        <EmptyState message={t("sourceNotFound")} />
      </div>
    );
  }

  const citations = citedIn(sourceId);
  const activeVersion = versionAt(s, asOfDate ? new Date(asOfDate) : new Date());

  return (
    <div className="mx-auto max-w-[var(--w-main)] px-4 py-10 sm:px-6">
      <p className="text-small text-ink-3">
        {t("tierLabel").replace("{n}", String(s.tier))} · {t(TIER_NAME_KEY[s.tier])} · {s.jur}
      </p>
      <h1 className="mt-1 text-h1 text-ink">{s.act ?? s.t}</h1>
      {s.section && <p className="mt-0.5 text-body-lg text-ink-2">{s.section}</p>}
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

      <Section title={t("versionHistoryHeading")}>
        {s.versions?.length ? (
          <div className="flex flex-col gap-4">
            <TimeMachine sourceIds={[sourceId]} />
            <ul className="divide-y divide-line rounded-container border border-line">
              {s.versions.map((v, i) => {
                const active = v === activeVersion;
                return (
                  <li key={i} className={`flex items-start justify-between gap-3 px-4 py-3 ${active ? "bg-neem-wash" : ""}`}>
                    <div>
                      <p className="text-body font-semibold text-ink">{v.status}</p>
                      {v.note && <p className="mt-0.5 text-small text-ink-2">{v.note}</p>}
                      <p className="mt-0.5 text-small text-ink-3">
                        {v.from}
                        {" – "}
                        {v.to ?? t("timeMachinePresent")}
                      </p>
                    </div>
                    {active && <StatusChip tone="done">{t("timeMachineCurrent")}</StatusChip>}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-container border border-line">
            <li className="flex items-center justify-between gap-3 px-4 py-3">
              <span className="text-body text-ink-2">{s.ver}</span>
              <StatusChip tone={s.flux ? "input" : "done"}>{s.flux ? t("lawChanged") : t("dossierDone")}</StatusChip>
            </li>
          </ul>
        )}
      </Section>

      <Section title={t("citedInHeading")}>
        {citations.length === 0 ? (
          <EmptyState message={t("citedInEmpty")} />
        ) : (
          <ul className="flex flex-col gap-2">
            {citations.map((c, i) => (
              <li key={i} className="text-small text-ink-2">
                {c.label}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <p className="mt-8 text-small">
        <Link href="/library" className="font-semibold text-neem hover:text-neem-strong">
          {t("backToLibrary")}
        </Link>
      </p>
    </div>
  );
}
