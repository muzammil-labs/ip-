import { useT } from "../i18n/useT";
import type { Confidence } from "../lib/types";

const LVL_KEY: Record<number, string> = { 3: "lvlStrong", 2: "lvlPartial", 1: "lvlWeak" };

function PipRow({ label, level }: { label: string; level: number }) {
  const t = useT();
  return (
    <div className="flex items-center justify-between gap-3 text-small">
      <span className="text-ink-2">{label}</span>
      <span className="flex items-center gap-2">
        <span className="flex items-center gap-1" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-pill ${i <= level ? "bg-neem" : "bg-line"}`}
            />
          ))}
        </span>
        <span className="font-semibold text-ink">{t(LVL_KEY[level])}</span>
      </span>
    </div>
  );
}

/** Replaces ConfidenceBars: Authority, Coverage and Agreement, each three pips (filled count = level). No filled background tracks. */
export default function Pips({ confidence }: { confidence: Pick<Confidence, "auth" | "cov" | "agr"> }) {
  const t = useT();
  return (
    <div className="flex flex-col gap-2">
      <PipRow label={t("confAuthority")} level={confidence.auth} />
      <PipRow label={t("confCoverage")} level={confidence.cov} />
      <PipRow label={t("confAgreement")} level={confidence.agr} />
    </div>
  );
}
