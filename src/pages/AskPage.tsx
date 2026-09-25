import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { PaperPlaneRight, Microphone, SpeakerHigh, Question } from "@phosphor-icons/react";
import { useApp, type Persona } from "../state/store";
import { useSession } from "../state/session";
import { SCREEN_ROUTE } from "../lib/legacyRoutes";
import { useT } from "../i18n/useT";
import { SUGGEST } from "../data/suggest";
import { ANSWERS } from "../data/answers";
import { performAsk } from "../engines/ask";
import { computeConfidence } from "../engines/confidence";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { speakText } from "../lib/speakText";
import { LANG_TAG } from "../lib/langTag";
import Segmented from "../ui/Segmented";
import IconButton from "../ui/IconButton";
import Button from "../ui/Button";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import Callout from "../ui/Callout";
import Pips from "../ui/Pips";
import Sheet from "../ui/Sheet";
import { Field } from "../ui/Field";
import type { Answer, EvidenceState } from "../lib/types";

const PERSONAS: { key: Persona; labelKey: string }[] = [
  { key: "startup", labelKey: "personaStartup" },
  { key: "vaidya", labelKey: "personaVaidya" },
  { key: "research", labelKey: "personaResearch" },
  { key: "farmer", labelKey: "personaFarmer" },
];

const COL_TITLES = {
  en: [["India", "Indian statutes, rules and registries"], ["International", "Treaties and export markets"]],
  hi: [["भारत", "भारतीय अधिनियम, नियम और रजिस्ट्री"], ["अंतरराष्ट्रीय", "संधियाँ और निर्यात बाज़ार"]],
  te: [["భారతదేశం", "భారత చట్టాలు, నియమాలు, రిజిస్ట్రీలు"], ["అంతర్జాతీయం", "ఒప్పందాలు, ఎగుమతి మార్కెట్లు"]],
} as const;

function AnswerColumn({ answer, side, detail }: { answer: Answer; side: "in" | "intl"; detail: string }) {
  const d = answer[side];
  if (!d) return null;
  const L = COL_TITLES[answer.lang === "hi" || answer.lang === "te" ? answer.lang : "en"];
  const [title, sub] = L[side === "in" ? 0 : 1];
  return (
    <div className="flex-1 rounded-container border border-line bg-surface p-5">
      <h3 className="text-h3 text-ink">{title}</h3>
      <p className="mb-3 text-small text-ink-3">{sub}</p>
      <p className="text-body-lg leading-relaxed text-ink-2">{d.plain}</p>
      {detail === "expert" && (
        <div className="mt-3 border-t border-line pt-1">
          <EvidenceList>
            {d.pts.map((p, ix) => (
              <EvidenceRow key={ix} state={p.s as EvidenceState} cites={p.c} lawChanged={p.flux}>
                {p.t}
              </EvidenceRow>
            ))}
          </EvidenceList>
        </div>
      )}
    </div>
  );
}

/** #/ask (B2): the full-page Sahayak, used for Kisan mode. The docked-panel version (available on every page) is UI-4.10. */
export default function AskPage() {
  const app = useApp();
  const { persona, setPersona, juris, setJuris, detail, setDetail, current, history, logEvent, addLedger } = app;
  const { lang } = useSession();
  const [, navigate] = useLocation();
  const [input, setInput] = useState("");
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);
  const t = useT();

  function submit(q?: string) {
    const query = q ?? input;
    if (!query.trim()) return;
    const a = performAsk(app, query);
    setInput(a.id === "unk" ? query : a.q);
  }

  const { supported: voiceSupported, listening, error: voiceError, start: startVoice } = useSpeechRecognition({
    lang: LANG_TAG[lang],
    onResult: (txt) => {
      setInput(txt);
      submit(txt);
      logEvent("Voice input used", "Audio not stored");
    },
  });

  function speak() {
    if (!current) return;
    const txt = current.abstain ? current.abstain.why : [current.in?.plain, current.intl?.plain].filter(Boolean).join(" ");
    const result = speakText(txt, LANG_TAG[current.lang]);
    setVoiceNote(result === "no-voice" ? t("voiceNoVoiceForLang") : null);
  }

  const confidence = useMemo(() => (current && !current.abstain ? computeConfidence(current) : null), [current]);
  const suggestIds = SUGGEST[persona] || SUGGEST.startup;

  return (
    <div className="mx-auto max-w-[var(--w-shell)] px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-h1 text-ink">{t("askTitle")}</h1>
      <p className="mt-2 max-w-[64ch] text-body-lg text-ink-2">{t("askLede")}</p>

      <div className="mt-6">
        <Segmented label={t("persona")} value={persona} onChange={setPersona} options={PERSONAS.map((p) => ({ value: p.key, label: t(p.labelKey) }))} />
      </div>

      <div className="mt-4 flex items-end gap-2">
        <div className="flex-1">
          <Field
            label={t("askTitle")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t("askInputPlaceholder")}
            className="h-12 text-body-lg"
          />
        </div>
        {voiceSupported && (
          <IconButton
            label={listening ? t("voiceStop") : t("speakAria")}
            icon={<Microphone size={18} />}
            onClick={startVoice}
            className={listening ? "animate-pulse bg-kumkum text-on-neem" : ""}
          />
        )}
        <Button size="lg" icon={<PaperPlaneRight size={16} />} onClick={() => submit()}>
          {t("askBtn")}
        </Button>
      </div>

      <p className="mt-1.5 min-h-[1.25em] text-small text-ink-3" aria-live="polite">
        {listening
          ? t("voiceListening")
          : voiceError === "no-speech"
            ? t("voiceNoSpeech")
            : voiceError === "not-allowed"
              ? t("voiceNotAllowed")
              : ""}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestIds.map((id) => {
          const a = ANSWERS.find((x) => x.id === id);
          if (!a) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => submit(a.q)}
              className="rounded-pill border border-line bg-surface px-3 py-1.5 text-small text-ink-2 transition-colors hover:border-neem hover:text-neem-strong"
            >
              {a.q}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-line py-3 text-small">
        <div className="flex items-center gap-1.5">
          <span className="text-ink-3">{t("jurisdictionLabel")}</span>
          {(["both", "in", "intl"] as const).map((j) => (
            <button
              key={j}
              type="button"
              onClick={() => setJuris(j)}
              className={`rounded-pill px-2.5 py-1 font-medium ${juris === j ? "bg-neem-wash text-neem-strong" : "text-ink-2 hover:bg-wash"}`}
            >
              {j === "both" ? t("juBoth") : j === "in" ? t("juIndia") : t("juIntl")}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-ink-3">{t("detailLabel")}</span>
          {(["expert", "plain"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDetail(d)}
              className={`rounded-pill px-2.5 py-1 font-medium ${detail === d ? "bg-neem-wash text-neem-strong" : "text-ink-2 hover:bg-wash"}`}
            >
              {d === "expert" ? t("detExpert") : t("detPlain")}
            </button>
          ))}
        </div>
      </div>

      {history.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-small text-ink-3">{t("earlier")}</span>
          {history.slice(1).map((q) => (
            <button key={q} type="button" onClick={() => submit(q)} className="text-small text-indigo hover:underline">
              {q}
            </button>
          ))}
        </div>
      )}

      {current && (
        <article className="mt-8">
          <p className="text-small font-semibold uppercase tracking-wide text-ink-3">{current.q}</p>

          {current.abstain ? (
            <div className="mt-3 rounded-container border border-line bg-surface p-6">
              <div className="flex items-start gap-4">
                <Question size={32} weight="bold" className="text-ink-3" />
                <div>
                  <h3 className="text-h3 text-ink">{t("abstainTitle")}</h3>
                  <p className="mt-1.5 text-body leading-relaxed text-ink-2">{current.abstain.why}</p>
                  <h4 className="mt-3 text-small font-semibold text-ink">{t("abstainWhatYouCanDo")}</h4>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-small text-ink-2">
                    {current.abstain.next.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button onClick={() => setEscalateOpen(true)}>{t("abstainEscalate")}</Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {confidence && (
                <div className="mt-3 rounded-container border border-line bg-surface p-4">
                  <p className="text-body font-bold text-ink">{{ 3: t("confHigh"), 2: t("confMod"), 1: t("confLow") }[confidence.overall]}</p>
                  <div className="mt-2">
                    <Pips confidence={confidence} />
                  </div>
                </div>
              )}

              {current.gloss && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 rounded-control bg-wash px-4 py-2.5 text-small text-ink-2">
                  {current.gloss.map(([h, e]) => (
                    <span key={h}>
                      <b>{h}</b> = {e}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex flex-col gap-4 sm:flex-row">
                {(juris === "both" || juris === "in") && <AnswerColumn answer={current} side="in" detail={detail} />}
                {(juris === "both" || juris === "intl") && <AnswerColumn answer={current} side="intl" detail={detail} />}
              </div>

              {current.gaps && (
                <div className="mt-4">
                  <Callout tone="note" title={t("gapsTitle")}>
                    <ul className="list-disc space-y-1 pl-5">
                      {current.gaps.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </Callout>
                </div>
              )}

              {voiceNote && (
                <p className="mt-3 text-right text-small text-ink-3" aria-live="polite">
                  {voiceNote}
                </p>
              )}
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Button variant="secondary" icon={<SpeakerHigh size={15} />} onClick={speak}>
                  {t("readAloud")}
                </Button>
                <Button variant="secondary" onClick={() => navigate(SCREEN_ROUTE.classify)}>
                  {t("classifyMyProduct")}
                </Button>
                <Button onClick={() => setEscalateOpen(true)}>{t("askHuman")}</Button>
              </div>
            </>
          )}
        </article>
      )}

      <Sheet open={escalateOpen} onOpenChange={setEscalateOpen} title={t("escalateModalTitle")}>
        <p className="text-small text-ink-2">{t("escalateModalDesc")}</p>
        <p className="mt-3 rounded-control bg-wash px-3 py-2 text-small text-ink-2">&ldquo;{current?.q.slice(0, 90)}&rdquo;</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setEscalateOpen(false)}>
            {t("escalateCancel")}
          </Button>
          <Button
            onClick={() => {
              logEvent("Escalated to facilitator", "Shared: question, answer");
              addLedger("Facilitator", "Escalation, this session");
              setEscalateOpen(false);
            }}
          >
            {t("escalateSend")}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
