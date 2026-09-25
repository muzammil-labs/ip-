import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import QRCode from "qrcode";
import { FilePdf } from "@phosphor-icons/react";
import Seal from "../ui/Seal";
import Plate from "../ui/Plate";
import Button from "../ui/Button";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import { StatusChip } from "../ui/Chip";
import EmptyState from "../ui/EmptyState";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import { classify } from "../engines/classify";
import { absDuties } from "../engines/absDuties";
import { computeBenefitShare } from "../engines/benefitShare";
import { claimsCheck } from "../engines/claims";
import { protectionRows, type ProtectionStrength } from "../data/protectionRows";
import { resolvePlant } from "../data/plants";
import { SOURCES } from "../data/sources";
import { allCitedSources, hashCase } from "../engines/dossier";
import { CHAPTER_ORDER, type ChapterSlug } from "../chapters/order";
import { chapterStatus } from "../chapters/status";
import "../styles/print.css";

const CHAPTER_TITLE_KEY: Record<ChapterSlug, string> = {
  describe: "chDescribeTitle",
  classify: "chClassifyTitle",
  protect: "chProtectTitle",
  owe: "chOweTitle",
  say: "chSayTitle",
  search: "chSearchTitle",
  dossier: "chDossierTitle",
};

const PROTECT_GROUPS: { strength: ProtectionStrength; headingKey: string; state: "V" | "U" | "R" }[] = [
  { strength: "strong", headingKey: "protectStrongHeading", state: "V" },
  { strength: "limited", headingKey: "protectLimitedHeading", state: "U" },
  { strength: "none", headingKey: "protectNoneHeading", state: "R" },
];

/** #/dossier/print (B2, UI-6.4): A4 print view of the whole Case. "Export PDF" (Dossier.tsx) opens
 * this route; the visible "Print" button here calls window.print(). No PDF library: the browser's
 * own print-to-PDF does the conversion, styled by styles/print.css. */
export default function DossierPrint() {
  const t = useT();
  const { case: kase } = useCase();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);

  const result = useMemo(() => classify(kase), [kase]);
  const [absText, absCites] = useMemo(() => absDuties(kase), [kase]);
  const benefitShare = useMemo(() => computeBenefitShare(kase, kase.highValueResource ?? false), [kase]);
  const claimReport = useMemo(() => (kase.claims[0]?.text ? claimsCheck(kase, kase.claims[0].text) : null), [kase]);
  const status = chapterStatus(kase);
  const cited = useMemo(() => allCitedSources(kase), [kase]);
  const formulaPlants = useMemo(
    () => kase.formula.map((f) => resolvePlant(f.plant.botanicalName || f.plant.name)).filter((p): p is NonNullable<typeof p> => !!p),
    [kase.formula]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const digest = await hashCase(kase);
      if (cancelled) return;
      setHash(digest);
      const payload = `IP-SAKTI Sahayak\ncorpus:${kase.corpusVersion}\nsha256:${digest}`;
      const url = await QRCode.toDataURL(payload, { margin: 1, width: 200 });
      if (!cancelled) setQrDataUrl(url);
    })();
    return () => {
      cancelled = true;
    };
  }, [kase]);

  const hasContent = kase.product.name.trim().length > 0;

  return (
    <div className="mx-auto max-w-[210mm] px-4 py-10 sm:px-6 print:max-w-none print:px-0 print:py-0">
      <div className="print:hidden mb-6 flex items-center justify-between">
        <p className="text-small text-ink-3">{t("dossierPrintNote")}</p>
        <div className="flex gap-2">
          <Link href="/case/dossier" className="text-small font-semibold text-neem hover:text-neem-strong">
            {t("dossierPrintBack")}
          </Link>
          <Button icon={<FilePdf size={16} />} onClick={() => window.print()} disabled={!hasContent}>
            {t("dossierPrintButton")}
          </Button>
        </div>
      </div>

      {!hasContent ? (
        <EmptyState message={t("dossierPrintEmpty")} />
      ) : (
        <>
          {/* Cover */}
          <section className="print:break-inside-avoid flex flex-col items-center gap-6 border-b border-line pb-10 text-center">
            <Seal size={48} variant="filled" />
            <div>
              <h1 className="text-h1 text-ink">{kase.product.name}</h1>
              <p className="mt-2 max-w-[60ch] text-body-lg text-ink-2">{kase.product.description}</p>
            </div>
            <div className="w-full max-w-[320px]">
              <Plate slug={formulaPlants[0]?.slug} botanicalName={formulaPlants[0]?.botanicalName ?? kase.product.name} />
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-1 text-small text-ink-2">
              <dt className="text-ink-3">{t("dossierCorpusVersion")}</dt>
              <dd>{kase.corpusVersion}</dd>
              <dt className="text-ink-3">{t("dossierGeneratedOn")}</dt>
              <dd>{new Date().toLocaleDateString()}</dd>
            </dl>
            {qrDataUrl && (
              <div className="flex flex-col items-center gap-1">
                <img src={qrDataUrl} alt={t("dossierQrAlt")} width={140} height={140} />
                <p className="max-w-[280px] text-small text-ink-3">
                  {t("dossierQrCaption")} <span className="font-mono text-mono">{hash?.slice(0, 16)}…</span>
                </p>
              </div>
            )}
          </section>

          {/* Status recap */}
          <section className="print:break-inside-avoid py-8">
            <h2 className="text-h2 text-ink">{t("dossierStatusHeading")}</h2>
            <ul className="mt-3 divide-y divide-line rounded-container border border-line">
              {CHAPTER_ORDER.filter((slug) => slug !== "dossier").map((slug) => (
                <li key={slug} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="text-body text-ink">{t(CHAPTER_TITLE_KEY[slug])}</span>
                  <StatusChip tone={status[slug] ? "done" : "input"}>{t(status[slug] ? "dossierDone" : "dossierNeedsInput")}</StatusChip>
                </li>
              ))}
            </ul>
          </section>

          {/* Describe */}
          <section className="print:break-inside-avoid py-8">
            <h2 className="text-h2 text-ink">{t("chDescribeTitle")}</h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-small">
              <dt className="text-ink-3">{t("describeFormLabel")}</dt>
              <dd className="text-ink-2">{kase.product.form ? t(`form${kase.product.form}`) : "—"}</dd>
              <dt className="text-ink-3">{t("describeFormulaLabel")}</dt>
              <dd className="text-ink-2">
                {kase.formula.length ? kase.formula.map((f) => `${f.plant.name} (${f.part})`).join("; ") : t("describeSummaryNoFormula")}
              </dd>
              <dt className="text-ink-3">{t("describeMarketsLabel")}</dt>
              <dd className="text-ink-2">{kase.markets.map((m) => t(`market${m}`)).join(", ")}</dd>
            </dl>
          </section>

          {/* Classify */}
          {result && (
            <section className="print:break-inside-avoid py-8">
              <h2 className="text-h2 text-ink">{t("chClassifyTitle")}</h2>
              <p className="mt-1 text-body font-semibold text-ink">{result.def.name}</p>
              <p className="text-small text-ink-2">{result.def.sum}</p>
              <div className="mt-3">
                <EvidenceList>
                  {result.rows.map((r) => (
                    <EvidenceRow key={r.key} state={r.cites.length ? "V" : "U"} cites={r.cites}>
                      <span className="font-semibold text-ink">{r.label}:</span> {r.text}
                    </EvidenceRow>
                  ))}
                </EvidenceList>
              </div>
            </section>
          )}

          {/* Protect */}
          {result && (
            <section className="py-8">
              <h2 className="text-h2 text-ink">{t("chProtectTitle")}</h2>
              {PROTECT_GROUPS.map((g) => {
                const rows = protectionRows(result.cat).filter((r) => r.strength === g.strength);
                if (rows.length === 0) return null;
                return (
                  <div key={g.strength} className="print:break-inside-avoid mt-3">
                    <h3 className="text-h3 text-ink">{t(g.headingKey)}</h3>
                    <EvidenceList>
                      {rows.map((r) => (
                        <EvidenceRow key={r.ip} state={g.state} cites={r.cites}>
                          <span className="font-semibold text-ink">{t(`ip${r.ip}`)}:</span> {r.text}
                        </EvidenceRow>
                      ))}
                    </EvidenceList>
                  </div>
                );
              })}
            </section>
          )}

          {/* Owe */}
          {result && (
            <section className="print:break-inside-avoid py-8">
              <h2 className="text-h2 text-ink">{t("chOweTitle")}</h2>
              <EvidenceList>
                <EvidenceRow state={absCites.length ? "V" : "U"} cites={absCites}>
                  {absText}
                </EvidenceRow>
                {benefitShare.kind === "computed" && (
                  <EvidenceRow state="U" cites={[]}>
                    {t("benefitShareComputedLabel")
                      .replace("{rate}", String((benefitShare.rate ?? 0) * 100))
                      .replace("{amount}", (benefitShare.amountCr ?? 0).toFixed(3))}
                  </EvidenceRow>
                )}
                {benefitShare.kind === "nil" && (
                  <EvidenceRow state="U" cites={[]}>
                    {t("benefitShareNilLabel")}
                  </EvidenceRow>
                )}
              </EvidenceList>
            </section>
          )}

          {/* Say */}
          {claimReport && (
            <section className="print:break-inside-avoid py-8">
              <h2 className="text-h2 text-ink">{t("chSayTitle")}</h2>
              <p className="mt-2 rounded-control bg-wash px-3 py-2 text-small italic text-ink-2">&ldquo;{kase.claims[0].text}&rdquo;</p>
              {claimReport.findings.length === 0 ? (
                <p className="mt-2 text-small text-ink-3">{t("noProhibited")}</p>
              ) : (
                <div className="mt-2">
                  <EvidenceList>
                    {claimReport.findings.map((f, i) => (
                      <EvidenceRow key={i} state={f.rule.lvl === "bad" ? "C" : "U"} cites={[f.rule.cite]}>
                        <span className="font-semibold text-ink">{f.match}:</span> {f.rule.why(f.match)}
                      </EvidenceRow>
                    ))}
                  </EvidenceList>
                </div>
              )}
            </section>
          )}

          {/* Search */}
          <section className="print:break-inside-avoid py-8">
            <h2 className="text-h2 text-ink">{t("chSearchTitle")}</h2>
            {formulaPlants.length ? (
              <p className="mt-2 font-mono text-mono text-small text-ink-2">
                ({formulaPlants.map((p) => `"${p.botanicalName}"`).join(" OR ")})
              </p>
            ) : (
              <p className="mt-2 text-small text-ink-3">{t("describeSummaryNoFormula")}</p>
            )}
            {kase.consent.length > 0 && (
              <ul className="mt-3 flex flex-col gap-1 text-small text-ink-2">
                {kase.consent.map((c, i) => (
                  <li key={i}>
                    {c.src}: {c.scope} ({c.time}) {c.active ? "" : `— ${t("revoked")}`}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Clause appendix */}
          {cited.length > 0 && (
            <section className="print:break-before-page py-8">
              <h2 className="text-h2 text-ink">{t("dossierAppendixHeading")}</h2>
              <ul className="mt-3 flex flex-col gap-4">
                {cited.map((id) => {
                  const s = SOURCES[id];
                  if (!s) return null;
                  return (
                    <li key={id} className="print:break-inside-avoid border-b border-line pb-3">
                      <p className="text-body font-semibold text-ink">{s.act ?? s.t}</p>
                      {s.section && <p className="text-small text-ink-3">{s.section}</p>}
                      <p className="mt-1 text-small text-ink-2">{s.excerpt ?? s.summary}</p>
                      <p className="mt-1 text-small text-ink-3">
                        {s.status} · {s.ver}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </>
      )}

      <p className="mt-8 text-small text-ink-3">{t("dossierPrintDisclaimer")}</p>
    </div>
  );
}
