import { AnimatePresence, motion } from "motion/react";
import { X, ArrowSquareOut } from "@phosphor-icons/react";
import { useApp } from "../state/store";
import { SOURCES } from "../data/sources";
import { TIER_NAME } from "../data/constants";
import EvidenceMark from "./EvidenceMark";

function SourceBlock({ id }: { id: string }) {
  const s = SOURCES[id];
  if (!s) return null;
  return (
    <div className="space-y-4">
      {s.excerpt ? (
        <blockquote className="rounded-md border border-line bg-sunk px-4 py-3 text-[14.5px] italic leading-relaxed text-ink-2">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-3">Exact text</span>
          &ldquo;{s.excerpt}&rdquo;
        </blockquote>
      ) : (
        <div className="rounded-md border border-line bg-sunk px-4 py-3 text-[14.5px] leading-relaxed text-ink-2">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-ink-3">
            Summary in plain words, open the official text to rely on it
          </span>
          {s.summary}
        </div>
      )}
      <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-1.5 text-[13.5px]">
        <dt className="text-ink-3">Authority</dt>
        <dd>Tier {s.tier}, {TIER_NAME[s.tier]}</dd>
        <dt className="text-ink-3">Issued by</dt>
        <dd>{s.by}</dd>
        <dt className="text-ink-3">Jurisdiction</dt>
        <dd>{s.jur}</dd>
        <dt className="text-ink-3">Status</dt>
        <dd>{s.status} {s.flux && <span className="ml-1 rounded-full bg-turmeric-soft px-2 py-0.5 text-[11px] font-semibold text-turmeric">Law changed</span>}</dd>
        <dt className="text-ink-3">Version</dt>
        <dd>{s.ver}</dd>
        <dt className="text-ink-3">Access</dt>
        <dd>{s.paid ? "Paid subscription, used only with your logged permission" : "Free, official"}</dd>
      </dl>
      {s.note && <p className="text-[13.5px] text-ink-3">{s.note}</p>}
      <a href={s.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-focus hover:underline">
        Open the official record <ArrowSquareOut size={14} />
      </a>
    </div>
  );
}

export default function SourceDrawer() {
  const { drawer, closeDrawer } = useApp();
  const isConflict = drawer?.point?.s === "C";
  const s = drawer ? SOURCES[drawer.sourceId] : null;

  return (
    <AnimatePresence>
      {drawer && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Source detail"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[61] h-[100dvh] w-full max-w-[440px] overflow-y-auto bg-surface p-6 shadow-lg"
          >
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-sunk"
            >
              <X size={18} />
            </button>

            {isConflict && drawer?.point ? (
              <>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-kumkum-soft px-2.5 py-1 text-[12px] font-semibold text-kumkum">
                  <EvidenceMark state="C" /> Sources conflict
                </span>
                <h2 className="mt-3 pr-8 text-[19px] font-bold leading-snug">How the disagreement is handled</h2>
                <div className="mt-4 rounded-md border-l-[3px] border-kumkum bg-kumkum-soft/50 px-4 py-3 text-[14px]">
                  <b>The sentence:</b> {drawer.point.t}
                </div>
                <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">
                  Primary law outranks commentary. Where the primary text does not settle the point, IP-SAKTI shows every reading, lowers the agreement score and recommends human review rather than choosing one.
                </p>
                <div className="mt-5 space-y-6">
                  {drawer.point.c.map((c) => (
                    <div key={c}>
                      <h3 className="mb-2 text-[15px] font-semibold">{SOURCES[c]?.t}</h3>
                      <SourceBlock id={c} />
                    </div>
                  ))}
                </div>
              </>
            ) : s ? (
              <>
                <p className="pr-8 text-[12.5px] text-ink-3">Tier {s.tier} · {s.jur}</p>
                <h2 className="mt-1 pr-8 text-[19px] font-bold leading-snug">{s.t}</h2>
                {drawer?.point && (
                  <div className="mt-4 rounded-md border-l-[3px] border-brand bg-brand-soft/50 px-4 py-3 text-[14px]">
                    <b>Supports this sentence:</b> {drawer.point.t}
                  </div>
                )}
                <div className="mt-4">
                  <SourceBlock id={drawer!.sourceId} />
                </div>
              </>
            ) : null}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
