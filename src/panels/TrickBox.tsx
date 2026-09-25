import { useState } from "react";
import Button from "../ui/Button";
import { TextArea } from "../ui/Field";
import { StatusChip } from "../ui/Chip";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import { useT } from "../i18n/useT";
import { api } from "../api/client";
import { TRICK_PROMPTS } from "../data/trickPrompts";
import type { Answer } from "../lib/types";

type Guardrail = "scope-gate" | "abstain" | "answered";

function guardrailFor(a: Answer): Guardrail {
  if (a.id === "unk") return "abstain";
  if (a.abstain) return "scope-gate";
  return "answered";
}

/** UI-7.6: "Try to trick it." Five preset adversarial prompts plus free text, each run through the
 * real api.ask and shown with whichever guardrail actually fired, not a scripted claim about what
 * would happen. */
export default function TrickBox() {
  const t = useT();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<{ promptId: string; label: string; answer: Answer }[]>([]);

  async function run(promptId: string, label: string, q: string) {
    setLoading(promptId);
    try {
      const answer = await api.ask(q);
      setResults((prev) => [{ promptId, label, answer }, ...prev.filter((r) => r.promptId !== promptId)]);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-container border border-line bg-surface p-5">
      <div className="flex flex-wrap gap-2">
        {TRICK_PROMPTS.map((p) => (
          <Button key={p.id} variant="secondary" size="md" loading={loading === p.id} onClick={() => run(p.id, t(p.labelKey), p.text)}>
            {t(p.labelKey)}
          </Button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <TextArea label={t("trickFreeTextLabel")} rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={t("trickFreeTextPlaceholder")} />
        </div>
        <Button
          variant="secondary"
          size="md"
          loading={loading === "free"}
          disabled={!text.trim()}
          onClick={() => run("free", t("trickFreeTextResultLabel"), text)}
        >
          {t("trickTryBtn")}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="mt-5">
          <EvidenceList>
            {results.map(({ promptId, label, answer }) => {
              const g = guardrailFor(answer);
              const tone = g === "answered" ? "done" : "risk";
              const guardrailLabel = g === "scope-gate" ? t("trickGuardrailScope") : g === "abstain" ? t("trickGuardrailAbstain") : t("trickGuardrailAnswered");
              const body = answer.abstain ? answer.abstain.why : (answer.in?.plain ?? answer.intl?.plain ?? "");
              const cites = answer.abstain?.cite ? [answer.abstain.cite] : [...(answer.in?.pts ?? []), ...(answer.intl?.pts ?? [])].flatMap((p) => p.c);
              return (
                <EvidenceRow key={promptId} state={g === "answered" ? "V" : "U"} cites={[...new Set(cites)].slice(0, 4)}>
                  <span className="font-semibold text-ink">{label}:</span>{" "}
                  <span className="ml-1.5 inline-block align-middle">
                    <StatusChip tone={tone}>{guardrailLabel}</StatusChip>
                  </span>
                  <br />
                  {body}
                </EvidenceRow>
              );
            })}
          </EvidenceList>
        </div>
      )}
    </div>
  );
}
