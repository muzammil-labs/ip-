import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocation } from "wouter";
import { PaperPlaneRight, Microphone, SpeakerHigh, Question, X } from "@phosphor-icons/react";
import { useApp } from "../state/store";
import { useSession } from "../state/session";
import { useCase } from "../state/case";
import { useT } from "../i18n/useT";
import { SUGGEST } from "../data/suggest";
import { ANSWERS } from "../data/answers";
import { performAsk } from "../engines/ask";
import { computeConfidence } from "../engines/confidence";
import { classify } from "../engines/classify";
import { SCREEN_ROUTE } from "../lib/legacyRoutes";
import { LAYER } from "../ui/layers";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { speakText } from "../lib/speakText";
import { LANG_TAG } from "../lib/langTag";
import IconButton from "../ui/IconButton";
import Button from "../ui/Button";
import { Field } from "../ui/Field";
import { EvidenceRow, EvidenceList } from "../ui/EvidenceRow";
import Callout from "../ui/Callout";
import Pips from "../ui/Pips";
import type { Answer, EvidenceState } from "../lib/types";

const COL_TITLES = {
  en: [["India", "Indian statutes, rules and registries"], ["International", "Treaties and export markets"]],
  hi: [["भारत", "भारतीय अधिनियम, नियम और रजिस्ट्री"], ["अंतरराष्ट्रीय", "संधियाँ और निर्यात बाज़ार"]],
  te: [["భారతదేశం", "భారత చట్టాలు, నియమాలు, రిజిస్ట్రీలు"], ["అంతర్జాతీయం", "ఒప్పందాలు, ఎగుమతి మార్కెట్లు"]],
} as const;

function AnswerTabs({ answer, active, onChange }: { answer: Answer; active: "in" | "intl"; onChange: (s: "in" | "intl") => void }) {
  const L = COL_TITLES[answer.lang === "hi" || answer.lang === "te" ? answer.lang : "en"];
  return (
    <div className="flex gap-1 border-b border-line">
      {(["in", "intl"] as const).map((side) => (
        <button
          key={side}
          type="button"
          onClick={() => onChange(side)}
          className={`px-3 py-2 text-small font-semibold ${active === side ? "border-b-2 border-neem text-ink" : "text-ink-3"}`}
        >
          {L[side === "in" ? 0 : 1][0]}
        </button>
      ))}
    </div>
  );
}

function AnswerPane({ answer, side }: { answer: Answer; side: "in" | "intl" }) {
  const d = answer[side];
  if (!d) return null;
  return (
    <div>
      <p className="text-body leading-relaxed text-ink-2">{d.plain}</p>
      <div className="mt-3 border-t border-line pt-1">
        <EvidenceList>
          {d.pts.map((p, ix) => (
            <EvidenceRow key={ix} state={p.s as EvidenceState} cites={p.c} lawChanged={p.flux}>
              {p.t}
            </EvidenceRow>
          ))}
        </EvidenceList>
      </div>
    </div>
  );
}

/** UI-4.10: the Sahayak panel, available on every page (right drawer desktop, bottom sheet mobile). */
export default function Sahayak() {
  const { sahayakOpen, setSahayakOpen, lang } = useSession();
  const app = useApp();
  const { current, history, logEvent, addLedger } = app;
  const { case: kase } = useCase();
  const [, navigate] = useLocation();
  const t = useT();
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"in" | "intl">("in");
  const [escalateConfirm, setEscalateConfirm] = useState(false);
  const [voiceNote, setVoiceNote] = useState<string | null>(null);

  const result = useMemo(() => classify(kase), [kase]);
  const confidence = useMemo(() => (current && !current.abstain ? computeConfidence(current) : null), [current]);
  const suggestIds = SUGGEST[kase.persona] || SUGGEST.startup;
  const hasBothColumns = !!(current && current.in && current.intl);

  function submit(q?: string) {
    const query = q ?? input;
    if (!query.trim()) return;
    const a = performAsk(app, query);
    setInput(a.id === "unk" ? query : a.q);
    setTab("in");
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
    const speakResult = speakText(txt, LANG_TAG[current.lang]);
    setVoiceNote(speakResult === "no-voice" ? t("voiceNoVoiceForLang") : null);
  }

  function escalate() {
    logEvent("Escalated to facilitator", "Shared: question, answer");
    addLedger("Facilitator", "Escalation, this session");
    setEscalateConfirm(true);
    setTimeout(() => setEscalateConfirm(false), 2500);
  }

  const contextLine = kase.product.name.trim()
    ? t("sahayakContext").replace("{product}", kase.product.name).replace("{category}", result?.def.name ?? t("sahayakNoCategory"))
    : t("sahayakNoContext");

  return (
    <AnimatePresence>
      {sahayakOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSahayakOpen(false)}
            className="fixed inset-0 bg-ink/30 backdrop-blur-[2px]"
            style={{ zIndex: LAYER.sheet }}
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("askSahayak")}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-x-0 bottom-0 flex max-h-[90dvh] flex-col overflow-y-auto rounded-t-container bg-surface p-5 shadow-2 sm:inset-x-auto sm:inset-y-0 sm:right-0 sm:max-h-none sm:w-[440px] sm:rounded-t-none sm:rounded-l-container ${
              hasBothColumns ? "lg:w-[720px]" : ""
            }`}
            style={{ zIndex: LAYER.sheet }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-small font-medium text-ink-3">{contextLine}</p>
              <IconButton label={t("closeAria")} icon={<X size={18} />} variant="ghost" onClick={() => setSahayakOpen(false)} />
            </div>

            <div className="mt-3 flex items-end gap-2">
              <div className="flex-1">
                <Field
                  label={t("askSahayak")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder={t("askInputPlaceholder")}
                />
              </div>
              {voiceSupported && (
                <IconButton
                  label={listening ? t("voiceStop") : t("speakAria")}
                  icon={<Microphone size={16} />}
                  onClick={startVoice}
                  className={listening ? "animate-pulse bg-kumkum text-on-neem" : ""}
                />
              )}
              <IconButton label={t("askBtn")} icon={<PaperPlaneRight size={15} />} onClick={() => submit()} />
            </div>

            <p className="mt-1 min-h-[1.25em] text-small text-ink-3" aria-live="polite">
              {listening
                ? t("voiceListening")
                : voiceError === "no-speech"
                  ? t("voiceNoSpeech")
                  : voiceError === "not-allowed"
                    ? t("voiceNotAllowed")
                    : ""}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {suggestIds.map((id) => {
                const a = ANSWERS.find((x) => x.id === id);
                if (!a) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => submit(a.q)}
                    className="rounded-pill border border-line bg-surface px-2.5 py-1 text-small text-ink-2 hover:border-neem hover:text-neem-strong"
                  >
                    {a.q}
                  </button>
                );
              })}
            </div>

            {history.length > 1 && (
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-small text-ink-3">{t("earlier")}</span>
                {history.slice(1, 4).map((q) => (
                  <button key={q} type="button" onClick={() => submit(q)} className="text-small text-indigo hover:underline">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {current && (
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-small font-semibold uppercase tracking-wide text-ink-3">{current.q}</p>

                {current.abstain ? (
                  <div className="mt-3">
                    <Callout tone="note" title={t("abstainTitle")}>
                      <p>{current.abstain.why}</p>
                      <p className="mt-2 font-semibold text-ink">{t("abstainWhatYouCanDo")}</p>
                      <ul className="list-disc space-y-1 pl-5">
                        {current.abstain.next.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ul>
                    </Callout>
                    <div className="mt-3">
                      <Button onClick={escalate}>{escalateConfirm ? t("escalateSend") + "✓" : t("abstainEscalate")}</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {confidence && (
                      <div className="mt-3 rounded-container border border-line bg-wash p-3">
                        <p className="text-small font-bold text-ink">{{ 3: t("confHigh"), 2: t("confMod"), 1: t("confLow") }[confidence.overall]}</p>
                        <div className="mt-2">
                          <Pips confidence={confidence} />
                        </div>
                      </div>
                    )}

                    {hasBothColumns ? (
                      <div className="mt-3 hidden lg:grid lg:grid-cols-2 lg:gap-4">
                        <AnswerPane answer={current} side="in" />
                        <AnswerPane answer={current} side="intl" />
                      </div>
                    ) : null}
                    <div className={hasBothColumns ? "mt-3 lg:hidden" : "mt-3"}>
                      {hasBothColumns && <AnswerTabs answer={current} active={tab} onChange={setTab} />}
                      <div className="pt-3">
                        <AnswerPane answer={current} side={hasBothColumns ? tab : current.in ? "in" : "intl"} />
                      </div>
                    </div>

                    {current.gaps && (
                      <div className="mt-3">
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
                      <p className="mt-2 text-right text-small text-ink-3" aria-live="polite">
                        {voiceNote}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <IconButton label={t("readAloud")} icon={<SpeakerHigh size={15} />} onClick={speak} />
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setSahayakOpen(false);
                          navigate(SCREEN_ROUTE.classify);
                        }}
                      >
                        {t("classifyMyProduct")}
                      </Button>
                      <Button icon={<Question size={14} />} onClick={escalate}>
                        {escalateConfirm ? t("escalateSend") + "✓" : t("askHuman")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
