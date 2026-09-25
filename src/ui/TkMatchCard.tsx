import { motion } from "motion/react";
import { plantBySlug } from "../data/plants";
import { useSession } from "../state/session";
import { useT } from "../i18n/useT";
import { StatusChip } from "./Chip";
import CiteChip from "./CiteChip";
import { threadPath, useMotionOK } from "./motion";
import type { TkMatch } from "../engines/tkProximity";

const ROW_H = 36;

function plantLabel(slug: string, lang: "en" | "hi" | "te"): string {
  const plant = plantBySlug(slug);
  if (!plant) return slug;
  return plant.names[lang] ?? plant.names.en ?? plant.botanicalName;
}

function IngredientRow({ slug, lang, dim, align }: { slug: string; lang: "en" | "hi" | "te"; dim: boolean; align: "left" | "right" }) {
  return (
    <li
      style={{ height: ROW_H }}
      className={`flex items-center text-small ${align === "right" ? "justify-end text-right" : ""} ${dim ? "text-ink-3" : "font-semibold text-ink"}`}
    >
      {plantLabel(slug, lang)}
    </li>
  );
}

const READING_CITE: Record<TkMatch["reading"], string[]> = {
  classical: ["pa-3p"],
  proprietary: [],
  newAsu: ["tk-guide", "tkdl"],
};

/** UI-6.1: one TK proximity match. Two ingredient columns (the Case's formula, this reference formulation),
 * shared ingredients listed first and connected by a Thread line, differing ones greyed below. Score is text,
 * not a gauge, per MASTER-PLAN. */
export default function TkMatchCard({ match }: { match: TkMatch }) {
  const t = useT();
  const { lang } = useSession();
  const motionOK = useMotionOK();
  const { formulation, score, shared, caseOnly, formulationOnly, reading } = match;

  const readingKey = { classical: "tkReadingClassical", proprietary: "tkReadingProprietary", newAsu: "tkReadingNewAsu" }[reading];

  return (
    <div className="rounded-container border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-h3 text-ink">{formulation.name}</h3>
          <p className="mt-0.5 text-small text-ink-3">
            {formulation.citation ? `${formulation.citation.book}, ${formulation.citation.chapter}` : t("tkCitationPending")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!formulation.reviewed && <StatusChip tone="input">{t("tkReviewPending")}</StatusChip>}
          <span className="text-h3 font-bold text-ink">{Math.round(score * 100)}%</span>
        </div>
      </div>

      <div className="mt-4 flex items-stretch">
        <ul className="min-w-0 flex-1">
          {shared.map((slug) => (
            <IngredientRow key={slug} slug={slug} lang={lang} dim={false} align="left" />
          ))}
          {caseOnly.map((slug) => (
            <IngredientRow key={slug} slug={slug} lang={lang} dim align="left" />
          ))}
        </ul>

        <div className="w-10 shrink-0">
          {shared.length > 0 && (
            <svg width="100%" height={shared.length * ROW_H} viewBox={`0 0 40 ${shared.length * ROW_H}`} preserveAspectRatio="none" aria-hidden="true">
              {shared.map((slug, i) => (
                <motion.line
                  key={slug}
                  x1="0"
                  x2="40"
                  y1={i * ROW_H + ROW_H / 2}
                  y2={i * ROW_H + ROW_H / 2}
                  stroke="var(--neem)"
                  strokeWidth={1.5}
                  initial={motionOK ? "hidden" : "visible"}
                  animate="visible"
                  variants={threadPath}
                />
              ))}
            </svg>
          )}
        </div>

        <ul className="min-w-0 flex-1">
          {shared.map((slug) => (
            <IngredientRow key={slug} slug={slug} lang={lang} dim={false} align="right" />
          ))}
          {formulationOnly.map((slug) => (
            <IngredientRow key={slug} slug={slug} lang={lang} dim align="right" />
          ))}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3 text-small">
        <span className="font-semibold text-ink">{t(readingKey)}</span>
        {READING_CITE[reading].map((id) => (
          <CiteChip key={id} sourceId={id} />
        ))}
        {reading === "proprietary" && <StatusChip tone="input">{t("tkCitationPending")}</StatusChip>}
      </div>
    </div>
  );
}
