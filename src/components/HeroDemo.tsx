import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { HERO_EXAMPLES } from "../data/heroExamples";
import CiteChip from "./CiteChip";

const ROTATE_MS = 7000;

export default function HeroDemo() {
  const [ix, setIx] = useState(0);
  const [typed, setTyped] = useState("");
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const ex = HERO_EXAMPLES[ix];

  useEffect(() => {
    if (reduce) {
      setTyped(ex.q);
      return;
    }
    setTyped("");
    let i = 0;
    const tick = () => {
      i++;
      setTyped(ex.q.slice(0, i));
      if (i < ex.q.length) timerRef.current = setTimeout(tick, 16);
    };
    tick();
    return () => clearTimeout(timerRef.current);
  }, [ix, reduce]);

  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setIx((v) => (v + 1) % HERO_EXAMPLES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, reduce]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="rounded-lg border border-line bg-surface p-5 shadow-md sm:p-6"
    >
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <span className="h-2 w-2 rounded-full bg-brand" />
        <span className="text-[12px] font-semibold uppercase tracking-wide text-ink-3">Live sample answer</span>
      </div>

      <p className="mt-4 min-h-[3.5em] text-[15.5px] font-medium leading-snug text-ink">
        {typed}
        <span className="ml-0.5 inline-block h-[1em] w-[2px] animate-pulse bg-brand align-text-bottom" />
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={ix}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div>
            <h4 className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-brand-strong">India</h4>
            <ul className="space-y-1.5">
              {ex.in.map(([txt, c], i) => (
                <li key={i} className="text-[13.5px] leading-snug text-ink-2">
                  {txt} <CiteChip num={i + 1} sourceId={c} />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-focus">International</h4>
            <ul className="space-y-1.5">
              {ex.intl.map(([txt, c], i) => (
                <li key={i} className="text-[13.5px] leading-snug text-ink-2">
                  {txt} <CiteChip num={ex.in.length + i + 1} sourceId={c} />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-center gap-1.5" role="tablist" aria-label="Sample answers">
        {HERO_EXAMPLES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === ix}
            aria-label={`Sample question ${i + 1}`}
            onClick={() => setIx(i)}
            className="h-2 rounded-full transition-all"
            style={{ width: i === ix ? 20 : 8, background: i === ix ? "var(--brand)" : "var(--line)" }}
          />
        ))}
      </div>
    </div>
  );
}
