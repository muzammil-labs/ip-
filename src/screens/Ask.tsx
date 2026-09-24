import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PaperPlaneRight, Microphone, SpeakerHigh, UserCircle, Question } from "@phosphor-icons/react";
import { useApp } from "../state/store";
import { useApp as useAppType } from "../state/store";
import { I18N } from "../data/i18n";
import { SUGGEST } from "../data/suggest";
import { ANSWERS } from "../data/answers";
import { SOURCES } from "../data/sources";
import { performAsk, citeNumbering } from "../lib/ask";
import { computeConfidence } from "../lib/confidence";
import { STATE_NAME, LVL } from "../data/constants";
import EvidenceMark from "../components/EvidenceMark";
import ConfidenceBars from "../components/ConfidenceBars";
import CiteChip from "../components/CiteChip";
import Reveal from "../components/Reveal";
import type { Answer, EvidenceState } from "../lib/types";

const PERSONAS: { key: ReturnType<typeof useAppType>["persona"]; label: string }[] = [
  { key: "startup", label: "Startup founder" },
  { key: "vaidya", label: "Registered vaidya" },
  { key: "research", label: "Researcher" },
  { key: "farmer", label: "Grower / cultivator" },
];

const COL_TITLES = {
  en: [["India", "Indian statutes, rules and registries"], ["International", "Treaties and export markets"]],
  hi: [["भारत", "भारतीय अधिनियम, नियम और रजिस्ट्री"], ["अंतरराष्ट्रीय", "संधियाँ और निर्यात बाज़ार"]],
  te: [["భారతదేశం", "భారత చట్టాలు, నియమాలు, రిజిస్ట్రీలు"], ["అంతర్జాతీయం", "ఒప్పందాలు, ఎగుమతి మార్కెట్లు"]],
} as const;

function AnswerColumn({ answer, side, nums, detail }: { answer: Answer; side: "in" | "intl"; nums: Record<string, number>; detail: string }) {
  const d = answer[side];
  if (!d) return null;
  const L = COL_TITLES[answer.lang === "hi" || answer.lang === "te" ? answer.lang : "en"];
  const [title, sub] = L[side === "in" ? 0 : 1];
  return (
    <div className="flex-1 rounded-lg border border-line bg-surface p-5">
      <h3 className="text-[15px] font-bold text-ink">{title}</h3>
      <p className="mb-3 text-[12.5px] text-ink-3">{sub}</p>
      <p className="text-[14.5px] leading-relaxed text-ink-2">{d.plain}</p>
      {detail === "expert" && (
        <ul className="mt-3 space-y-2.5 border-t border-line pt-3">
          {d.pts.map((p, ix) => (
            <li key={ix} className="flex items-start gap-2 text-[13.5px] leading-relaxed">
              <EvidenceMark state={p.s as EvidenceState} />
              <span className="text-ink-2">
                {p.t}
                {p.flux && <span className="ml-1.5 rounded-full bg-turmeric-soft px-1.5 py-0.5 text-[10.5px] font-semibold text-turmeric">Law changed</span>}
                {p.c.map((c) => (
                  <CiteChip key={c} num={nums[c]} sourceId={c} point={p} />
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Ask() {
  const app = useApp();
  const { lang, persona, setPersona, juris, setJuris, detail, setDetail, current, history, logEvent, addLedger } = app;
  const [input, setInput] = useState("");
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [listening, setListening] = useState(false);

  const t = (k: string) => I18N[lang]?.[k] || I18N.en[k] || k;

  function submit(q?: string) {
    const query = q ?? input;
    if (!query.trim()) return;
    const a = performAsk(app, query);
    setInput(a.id === "unk" ? query : a.q);
  }

  function startVoice() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert("Speech input needs Chrome or Edge here. The live build uses Bhashini speech recognition.");
      return;
    }
    const r = new SR();
    r.lang = { en: "en-IN", hi: "hi-IN", te: "te-IN" }[lang];
    r.interimResults = false;
    setListening(true);
    r.onresult = (e: any) => {
      const txt = e.results[0][0].transcript;
      setInput(txt);
      submit(txt);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
    logEvent("Voice input used", "Audio not stored");
  }

  function speak() {
    if (!current || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const txt = current.abstain ? current.abstain.why : [current.in?.plain, current.intl?.plain].filter(Boolean).join(" ");
    const u = new SpeechSynthesisUtterance(txt);
    u.lang = { en: "en-IN", hi: "hi-IN", te: "te-IN" }[current.lang];
    speechSynthesis.speak(u);
  }

  const nums = useMemo(() => (current ? citeNumbering(current) : {}), [current]);
  const confidence = useMemo(() => (current && !current.abstain ? computeConfidence(current) : null), [current]);
  const suggestIds = SUGGEST[persona] || SUGGEST.startup;

  return (
    <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14">
      <Reveal>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("askTitle")}</h1>
        <p className="mt-2 max-w-[60ch] text-[14.5px] text-ink-2">{t("askLede")}</p>
      </Reveal>

      <Reveal delay={0.06} className="mt-6 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-[13px] text-ink-3">
          <UserCircle size={16} /> {t("persona")}
        </span>
        {PERSONAS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPersona(p.key)}
            className={`rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors ${
              persona === p.key ? "bg-brand-soft text-brand-strong" : "border border-line text-ink-2 hover:bg-sunk"
            }`}
          >
            {p.label}
          </button>
        ))}
      </Reveal>

      <Reveal delay={0.1} className="mt-4 flex items-stretch gap-2">
        <div className="flex flex-1 items-center rounded-full border border-line bg-surface pl-4 pr-1.5 shadow-xs focus-within:border-brand">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Can I patent an Ashwagandha extract?"
            className="min-w-0 flex-1 bg-transparent py-3 text-[14.5px] text-ink outline-none placeholder:text-ink-3"
          />
          <button
            type="button"
            onClick={startVoice}
            aria-label="Speak your question"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${listening ? "animate-pulse bg-kumkum text-white" : "text-ink-3 hover:bg-sunk"}`}
          >
            <Microphone size={16} />
          </button>
          <button
            type="button"
            onClick={() => submit()}
            aria-label={t("askBtn")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-transform active:scale-95"
          >
            <PaperPlaneRight size={15} />
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.14} className="mt-3 flex flex-wrap gap-2">
        {suggestIds.map((id) => {
          const a = ANSWERS.find((x) => x.id === id);
          if (!a) return null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => submit(a.q)}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.5px] text-ink-2 transition-colors hover:border-brand hover:text-brand-strong"
            >
              {a.q}
            </button>
          );
        })}
      </Reveal>

      <Reveal delay={0.16} className="mt-5 flex flex-wrap items-center gap-4 border-y border-line py-3 text-[13px]">
        <div className="flex items-center gap-1.5">
          <span className="text-ink-3">Jurisdiction</span>
          {(["both", "in", "intl"] as const).map((j) => (
            <button
              key={j}
              type="button"
              onClick={() => setJuris(j)}
              className={`rounded-full px-2.5 py-1 font-medium ${juris === j ? "bg-brand-soft text-brand-strong" : "text-ink-2 hover:bg-sunk"}`}
            >
              {j === "both" ? "Both" : j === "in" ? "India" : "International"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-ink-3">Detail</span>
          {(["expert", "plain"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDetail(d)}
              className={`rounded-full px-2.5 py-1 font-medium ${detail === d ? "bg-brand-soft text-brand-strong" : "text-ink-2 hover:bg-sunk"}`}
            >
              {d === "expert" ? "With citations" : "Plain summary"}
            </button>
          ))}
        </div>
      </Reveal>

      {history.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-[12px] text-ink-3">Earlier:</span>
          {history.slice(1).map((q) => (
            <button key={q} type="button" onClick={() => submit(q)} className="text-[12px] text-focus hover:underline">
              {q}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {current && (
          <motion.article
            key={current.id + current.q}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8"
          >
            <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-3">{current.q}</p>

            {current.abstain ? (
              <div className="mt-3 rounded-lg border border-line bg-surface p-6">
                <div className="flex items-start gap-4">
                  <Question size={32} weight="bold" className="text-ink-3" />
                  <div>
                    <h3 className="text-[16px] font-bold">IP-SAKTI is not answering this</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{current.abstain.why}</p>
                    <h4 className="mt-3 text-[13.5px] font-semibold">What you can do</h4>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-[13.5px] text-ink-2">
                      {current.abstain.next.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => setEscalateOpen(true)}
                      className="mt-4 rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white"
                    >
                      Ask a human IP facilitator
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {confidence && (
                  <div className="mt-3 rounded-lg border border-line bg-surface p-4">
                    <p className="text-[14px] font-bold text-ink">
                      {{ 3: "High confidence", 2: "Moderate confidence", 1: "Low confidence, read the flagged lines" }[confidence.overall]}
                    </p>
                    <div className="mt-2 grid gap-1.5 text-[12.5px] sm:grid-cols-3">
                      <div className="flex items-center gap-2"><span className="text-ink-3">Authority</span><ConfidenceBars level={confidence.auth} /><span>{LVL[confidence.auth]}</span></div>
                      <div className="flex items-center gap-2"><span className="text-ink-3">Coverage</span><ConfidenceBars level={confidence.cov} /><span>{LVL[confidence.cov]}</span></div>
                      <div className="flex items-center gap-2"><span className="text-ink-3">Agreement</span><ConfidenceBars level={confidence.agr} /><span>{confidence.agr === 3 ? "Consistent" : `${confidence.conf} dispute${confidence.conf === 1 ? "" : "s"}`}</span></div>
                    </div>
                  </div>
                )}

                {current.gloss && (
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 rounded-md bg-sunk px-4 py-2.5 text-[12.5px] text-ink-2">
                    {current.gloss.map(([h, e]) => (
                      <span key={h}><b>{h}</b> = {e}</span>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-4 sm:flex-row">
                  {(juris === "both" || juris === "in") && <AnswerColumn answer={current} side="in" nums={nums} detail={detail} />}
                  {(juris === "both" || juris === "intl") && <AnswerColumn answer={current} side="intl" nums={nums} detail={detail} />}
                </div>

                {current.gaps && (
                  <div className="mt-4 rounded-lg border border-line bg-surface p-5">
                    <h4 className="text-[13.5px] font-bold text-ink">What's still missing</h4>
                    <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[13.5px] text-ink-2">
                      {current.gaps.map((g) => (
                        <li key={g}>{g}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap justify-end gap-2">
                  <button type="button" onClick={speak} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[13px] font-medium text-ink-2 hover:bg-sunk">
                    <SpeakerHigh size={15} /> Read aloud
                  </button>
                  <button type="button" onClick={() => app.go("classify")} className="rounded-full border border-line px-3.5 py-2 text-[13px] font-medium text-ink-2 hover:bg-sunk">
                    Classify my product
                  </button>
                  <button type="button" onClick={() => setEscalateOpen(true)} className="rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white">
                    Ask a human
                  </button>
                </div>
              </>
            )}
          </motion.article>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {escalateOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEscalateOpen(false)} className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              role="dialog"
              aria-modal="true"
              className="fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface p-6 shadow-lg"
            >
              <h2 className="text-[17px] font-bold">Send this to a human IP facilitator</h2>
              <p className="mt-2 text-[13.5px] text-ink-2">A facilitator reviews your question with the sources IP-SAKTI found.</p>
              <p className="mt-3 rounded-md bg-sunk px-3 py-2 text-[13px] text-ink-2">"{current?.q.slice(0, 90)}"</p>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setEscalateOpen(false)} className="rounded-full border border-line px-3.5 py-2 text-[13px] font-medium text-ink-2">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logEvent("Escalated to facilitator", "Shared: question, answer");
                    addLedger("Facilitator", "Escalation, this session");
                    setEscalateOpen(false);
                  }}
                  className="rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white"
                >
                  Send for review
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
