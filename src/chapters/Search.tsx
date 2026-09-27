import { useEffect, useMemo, useState } from "react";
import { ArrowSquareOut, Lock, Check } from "@phosphor-icons/react";
import { Link } from "wouter";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import Sheet from "../ui/Sheet";
import DataTable from "../ui/DataTable";
import { StatusChip } from "../ui/Chip";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { useCoverage } from "../state/coverage";
import type { LedgerEntry } from "../lib/types";

interface Registry {
  key: string;
  name: string;
  descKey: string;
  paid: boolean;
  url: string;
}

const REGISTRIES: Registry[] = [
  { key: "inpass", name: "IP India patent search (InPASS)", descKey: "searchRegInpassDesc", paid: false, url: "https://ipindia.gov.in/" },
  { key: "patentscope", name: "WIPO Patentscope", descKey: "searchRegPatentscopeDesc", paid: false, url: "https://patentscope.wipo.int/" },
  { key: "espacenet", name: "Espacenet", descKey: "searchRegEspacenetDesc", paid: false, url: "https://worldwide.espacenet.com/" },
  { key: "ayush", name: "AYUSH Research Portal", descKey: "searchRegAyushDesc", paid: false, url: "https://ayushportal.nic.in/" },
  { key: "tkdl", name: "TKDL", descKey: "searchRegTkdlDesc", paid: true, url: "#" },
];

export default function Search() {
  const t = useT();
  const { case: kase, dispatch } = useCase();
  const { mark } = useCoverage();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const query = useMemo(() => {
    if (kase.formula.length === 0) return null;
    return `(${kase.formula.map((f) => `"${f.plant.botanicalName ?? f.plant.name}"`).join(" OR ")})`;
  }, [kase.formula]);

  useEffect(() => {
    if (query) mark(4); // TKDL and prior-art pointer: a ready-made query for five databases
  }, [query, mark]);

  const tkdlGranted = kase.consent.some((c) => c.src === "tkdl" && c.active);

  function grantConsent() {
    if (!consentChecked) return;
    dispatch({ type: "grantConsent", src: "tkdl", scope: query ?? t("searchYourProduct") });
    mark(5); // paid subscriptions only with explicit, logged, revocable permission
    setSheetOpen(false);
    setConsentChecked(false);
  }

  return (
    <Chapter n={6} titleKey="chSearchTitle" purposeKey="chSearchPurpose">
      {!query ? (
        <EmptyState
          message={t("searchNeedsFormula")}
          action={
            <Link href="/case/describe" className="text-small font-semibold text-neem hover:text-neem-strong">
              {t("searchGoToDescribe")}
            </Link>
          }
        />
      ) : (
        <Section title={t("searchQueryHeading")}>
          <div className="rounded-control border border-line bg-wash px-4 py-2.5 font-mono text-mono text-ink-2">{query}</div>

          <div className="mt-4 divide-y divide-line rounded-container border border-line">
            {REGISTRIES.map((r) => (
              <div key={r.key} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5">
                <div>
                  <p className="text-body font-semibold text-ink">{r.name}</p>
                  <p className="text-small text-ink-3">{t(r.descKey)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusChip tone={r.paid ? "input" : "done"}>{r.paid ? t("paidLabel") : t("freeLabel")}</StatusChip>
                  {r.paid ? (
                    tkdlGranted ? (
                      <span className="inline-flex items-center gap-1 text-small font-medium text-neem-strong">
                        <Check size={14} weight="bold" /> {t("permissionGranted")}
                      </span>
                    ) : (
                      <Button variant="secondary" size="md" icon={<Lock size={14} />} onClick={() => setSheetOpen(true)}>
                        {t("askPermission")}
                      </Button>
                    )
                  ) : (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 rounded-control border border-line-strong bg-surface px-3.5 py-2 text-small font-medium text-ink-2 hover:bg-wash"
                    >
                      {t("openBtn")} <ArrowSquareOut size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title={t("searchConsentLedgerHeading")}>
        <DataTable<LedgerEntry>
          columns={[
            { key: "src", header: t("colSource"), render: (l) => l.src.toUpperCase(), primary: true },
            { key: "scope", header: t("colScope"), render: (l) => l.scope },
            { key: "time", header: t("colGranted"), render: (l) => l.time },
            {
              key: "action",
              header: "",
              render: (l) => {
                const i = kase.consent.indexOf(l);
                return l.active ? (
                  <button type="button" onClick={() => dispatch({ type: "revokeConsent", index: i })} className="text-small font-semibold text-kumkum hover:underline">
                    {t("revoke")}
                  </button>
                ) : (
                  <span className="text-ink-3">{t("revoked")}</span>
                );
              },
            },
          ]}
          rows={kase.consent}
          rowKey={(l) => `${l.src}-${l.time}`}
          emptyMessage={t("ledgerEmpty")}
        />
      </Section>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen} title={t("modalAllowTitle")}>
        <p className="text-small text-ink-2">{t("modalAllowDesc")}</p>
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-small">
          <dt className="text-ink-3">{t("dlScope")}</dt>
          <dd className="text-ink-2">{query ?? t("searchYourProduct")}</dd>
          <dt className="text-ink-3">{t("dlDuration")}</dt>
          <dd className="text-ink-2">{t("durationValue")}</dd>
          <dt className="text-ink-3">{t("dlShared")}</dt>
          <dd className="text-ink-2">{t("sharedValue")}</dd>
        </dl>
        <label className="mt-4 flex items-start gap-2 text-small text-ink-2">
          <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} className="mt-0.5" />
          {t("consentLabel")}
        </label>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setSheetOpen(false)}>
            {t("dontAllow")}
          </Button>
          <Button onClick={grantConsent} disabled={!consentChecked}>
            {t("allowAndLog")}
          </Button>
        </div>
      </Sheet>
    </Chapter>
  );
}
