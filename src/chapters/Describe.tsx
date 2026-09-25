import { useEffect, useRef, useState } from "react";
import { useSearch } from "wouter";
import { Microphone, Plus, X } from "@phosphor-icons/react";
import Chapter from "../ui/Chapter";
import Section from "../ui/Section";
import { Field, TextArea } from "../ui/Field";
import RadioCards from "../ui/RadioCards";
import Segmented from "../ui/Segmented";
import IconButton from "../ui/IconButton";
import Finding from "../ui/Finding";
import { useT } from "../i18n/useT";
import { useCase } from "../state/case";
import type { DosageForm, Market } from "../state/case";
import { decodeSharedCase } from "../lib/shareLink";
import { resolvePlant, searchPlants } from "../data/plants";
import { useSession } from "../state/session";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { LANG_TAG } from "../lib/langTag";

const FORMS: DosageForm[] = ["tablet", "capsule", "churna", "syrup", "oil", "cream", "other"];
const MARKETS: Market[] = ["IN", "EU", "US", "GCC", "ASEAN"];
const TURNOVER_BANDS: { value: string; cr: number }[] = [
  { value: "b0", cr: 0.5 },
  { value: "b1", cr: 3 },
  { value: "b2", cr: 15 },
  { value: "b3", cr: 50 },
];

function bandFor(cr: number | undefined): string {
  if (cr === undefined) return "b0";
  const band = TURNOVER_BANDS.slice().reverse().find((b) => cr >= b.cr);
  return band ? band.value : "b0";
}

export default function Describe() {
  const t = useT();
  const search = useSearch();
  const { lang } = useSession();
  const { case: kase, dispatch } = useCase();
  const handled = useRef<string | null>(null);
  const [plantQuery, setPlantQuery] = useState("");
  const [part, setPart] = useState("");
  const [qty, setQty] = useState("");

  const { supported: voiceSupported, listening, error: voiceError, start: startVoice } = useSpeechRecognition({
    lang: LANG_TAG[lang],
    onResult: (txt) => {
      const next = kase.product.description.trim() ? `${kase.product.description.trim()} ${txt}` : txt;
      dispatch({ type: "setField", field: "productDescription", value: next });
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    const encoded = params.get("c");
    if (!encoded || handled.current === encoded) return;
    handled.current = encoded;

    const shared = decodeSharedCase(encoded);
    if (!shared) return;

    const hasExistingContent = kase.product.name.trim().length > 0;
    const isSameCase = kase.product.name === shared.product.name && JSON.stringify(kase.formula) === JSON.stringify(shared.formula);
    if (hasExistingContent && !isSameCase) {
      if (!window.confirm(t("confirmLoadSharedCase"))) return;
    }
    dispatch({ type: "loadShared", shared });
  }, [search, kase, dispatch, t]);

  const matched = plantQuery.trim() ? resolvePlant(plantQuery) : null;
  const suggestions = plantQuery.trim() && !matched ? searchPlants(plantQuery) : [];

  function addFormulaItem() {
    if (!plantQuery.trim() || !part.trim()) return;
    const resolved = resolvePlant(plantQuery);
    dispatch({
      type: "addFormulaItem",
      item: {
        plant: { name: plantQuery.trim(), botanicalName: resolved?.botanicalName },
        part: part.trim(),
        qty: qty.trim() || undefined,
      },
    });
    setPlantQuery("");
    setPart("");
    setQty("");
  }

  function toggleMarket(m: Market) {
    const has = kase.markets.includes(m);
    const next = has ? kase.markets.filter((x) => x !== m) : [...kase.markets, m];
    dispatch({ type: "setField", field: "markets", value: next });
  }

  const summaryName = kase.product.name.trim() || t("describeSummaryDefaultName");
  const summaryPlants = kase.formula.length ? kase.formula.map((f) => f.plant.name).join(", ") : t("describeSummaryNoFormula");
  const summaryMarkets = kase.markets.map((m) => t(`market${m}`)).join(", ");
  const summary = t("describeSummaryTemplate")
    .replace("{name}", summaryName)
    .replace("{plants}", summaryPlants)
    .replace("{markets}", summaryMarkets);

  return (
    <Chapter n={1} titleKey="chDescribeTitle" purposeKey="chDescribePurpose" wide>
      <div className="flex flex-col gap-0 xl:flex-row xl:items-start xl:gap-10">
      <div className="min-w-0 flex-1">
      <Section title={t("describeProductSectionTitle")}>
        <div className="flex flex-col gap-6">
          <Field
            label={t("describeProductNameLabel")}
            placeholder={t("describeProductNamePlaceholder")}
            value={kase.product.name}
            onChange={(e) => dispatch({ type: "setField", field: "productName", value: e.target.value })}
          />
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <TextArea
                label={t("describeProductDescLabel")}
                placeholder={t("describeProductDescPlaceholder")}
                rows={3}
                value={kase.product.description}
                onChange={(e) => dispatch({ type: "setField", field: "productDescription", value: e.target.value })}
              />
            </div>
            {voiceSupported && (
              <IconButton
                label={listening ? t("voiceStop") : t("describeVoiceInputAria")}
                icon={<Microphone size={18} />}
                onClick={startVoice}
                className={listening ? "animate-pulse bg-kumkum text-on-neem" : ""}
              />
            )}
          </div>
          <p className="min-h-[1.25em] text-small text-ink-3" aria-live="polite">
            {listening
              ? t("voiceListening")
              : voiceError === "no-speech"
                ? t("voiceNoSpeech")
                : voiceError === "not-allowed"
                  ? t("voiceNotAllowed")
                  : ""}
          </p>
        </div>
      </Section>

      <Section title={t("describeFormLabel")}>
        <RadioCards
          label={t("describeFormLabel")}
          value={kase.product.form}
          onChange={(v) => dispatch({ type: "setField", field: "productForm", value: v })}
          options={FORMS.map((f) => ({ value: f, title: t(`form${f}`), description: t(`form${f}Desc`) }))}
          columnsLg={3}
        />
      </Section>

      <Section title={t("describeFormulaLabel")} lede={t("describeFormulaHelper")}>
        {kase.formula.length > 0 && (
          <ul className="mb-4 divide-y divide-line rounded-container border border-line">
            {kase.formula.map((item, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-2.5 text-body text-ink-2">
                <span className="flex-1">
                  <span className="font-semibold text-ink">{item.plant.name}</span>
                  {item.plant.botanicalName && <span className="italic text-ink-3"> · {item.plant.botanicalName}</span>}
                  {" — "}
                  {item.part}
                  {item.qty && `, ${item.qty}`}
                </span>
                <IconButton
                  label={t("describeFormulaRemove")}
                  icon={<X size={16} />}
                  variant="ghost"
                  onClick={() => dispatch({ type: "removeFormulaItem", index: i })}
                />
              </li>
            ))}
          </ul>
        )}
        <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_auto]">
          <div>
            <Field
              label={t("describeFormulaPlantLabel")}
              placeholder={t("describeFormulaPlantPlaceholder")}
              value={plantQuery}
              onChange={(e) => setPlantQuery(e.target.value)}
              list="plant-suggestions"
            />
            <datalist id="plant-suggestions">
              {suggestions.map((s) => (
                <option key={s.slug} value={s.names.en ?? s.botanicalName} />
              ))}
            </datalist>
            {matched && <p className="mt-1 text-small text-ink-3">{t("describeFormulaMatched").replace("{name}", matched.botanicalName)}</p>}
          </div>
          <Field label={t("describeFormulaPartLabel")} placeholder={t("describeFormulaPartPlaceholder")} value={part} onChange={(e) => setPart(e.target.value)} />
          <Field label={t("describeFormulaQtyLabel")} value={qty} onChange={(e) => setQty(e.target.value)} />
          <div className="flex items-end">
            <IconButton label={t("describeFormulaAdd")} icon={<Plus size={18} />} onClick={addFormulaItem} disabled={!plantQuery.trim() || !part.trim()} />
          </div>
        </div>
      </Section>

      <Section title={t("describeMarketsLabel")}>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("describeMarketsLabel")}>
          {MARKETS.map((m) => {
            const selected = kase.markets.includes(m);
            return (
              <button
                key={m}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleMarket(m)}
                className={`inline-flex h-9 items-center rounded-pill border px-3.5 text-small font-medium transition-colors ${
                  selected ? "border-neem bg-neem-wash text-neem-strong" : "border-line bg-surface text-ink-2 hover:border-line-strong"
                }`}
              >
                {t(`market${m}`)}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t("describeTurnoverLabel")}>
        <Segmented
          label={t("describeTurnoverLabel")}
          value={bandFor(kase.turnoverCr)}
          onChange={(v) => dispatch({ type: "setField", field: "turnoverCr", value: TURNOVER_BANDS.find((b) => b.value === v)?.cr })}
          options={TURNOVER_BANDS.map((b) => ({ value: b.value, label: t(`turnover${b.value}`) }))}
        />
      </Section>

      </div>

      {/* Below xl, this renders in normal document flow after the form (default flex-col
       * stacking). At xl and up, the row becomes flex-row and this becomes a sticky sidebar
       * beside the form instead. One Finding instance either way, just repositioned. */}
      <aside className="xl:sticky xl:top-24 xl:w-80 xl:shrink-0">
        <Section title={t("describeFindingHeading")}>
          <Finding headline={t("describeFindingHeadline")}>{summary}</Finding>
        </Section>
      </aside>
      </div>
    </Chapter>
  );
}
