import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowSquareOut, Lock, X } from "@phosphor-icons/react";
import { useApp } from "../state/store";
import { I18N } from "../data/i18n";
import Reveal from "../components/Reveal";

const REGISTRIES = [
  { name: "IP India patent search (InPASS)", desc: "Indian applications and grants", paid: false, url: "https://ipindia.gov.in/" },
  { name: "WIPO Patentscope", desc: "PCT and national collections, many languages", paid: false, url: "https://patentscope.wipo.int/" },
  { name: "Espacenet", desc: "Worldwide patent documents", paid: false, url: "https://worldwide.espacenet.com/" },
  { name: "AYUSH Research Portal", desc: "Published Ayurveda research", paid: false, url: "https://ayushportal.nic.in/" },
  { name: "TKDL", desc: "Codified formulations from classical texts", paid: true, url: "#" },
];

export default function PriorArt() {
  const { lang, ledger, logEvent, addLedger, revokeLedger } = useApp();
  const t = (k: string) => I18N[lang]?.[k] || I18N.en[k] || k;
  const [input, setInput] = useState("");
  const [query, setQuery] = useState<string | null>(null);
  const [permOpen, setPermOpen] = useState(false);
  const [consent, setConsent] = useState(false);

  const tkdlGranted = ledger.some((l) => l.src === "TKDL" && l.active);

  function search() {
    const raw = input.trim() || "your product";
    const parts = raw.split(",").map((x) => x.trim()).filter(Boolean);
    let subj = parts[0] || raw;
    const extra = parts.slice(1).join(" ");
    const n = raw.toLowerCase();
    if (n.includes("withania") || n.includes("ashwagandha")) subj = '"Withania somnifera" OR ashwagandha';
    const q = extra
      ? `(${subj}) AND (${extra.replace(/supercritical co₂|supercritical co2/i, 'supercritical OR "carbon dioxide"')})`
      : `(${subj})`;
    setQuery(q);
    logEvent("Prior-art pointer generated", "Query terms kept in session only");
  }

  function grantPermission() {
    if (!consent) return;
    addLedger("TKDL", `Prior-art search: ${input || "your product"}`);
    logEvent("Paid-source permission granted", "TKDL, session scope");
    setPermOpen(false);
    setConsent(false);
  }

  return (
    <div className="mx-auto max-w-[820px] px-4 py-10 sm:px-6 sm:py-14">
      <Reveal>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("tkH1")}</h1>
        <p className="mt-2 max-w-[64ch] text-[14.5px] text-ink-2">{t("tkLede")}</p>
      </Reveal>

      <Reveal delay={0.06} className="mt-6 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Ashwagandha, supercritical CO2 extraction"
          className="flex-1 rounded-full border border-line bg-surface px-4 py-2.5 text-[14px] outline-none focus:border-brand"
        />
        <button type="button" onClick={search} className="rounded-full bg-brand px-5 py-2.5 text-[13.5px] font-semibold text-white">
          Search
        </button>
      </Reveal>

      {query && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <p className="text-[13px] text-ink-3">Suggested query</p>
          <div className="mt-1 rounded-md border border-line bg-sunk px-4 py-2.5 font-mono text-[14px] text-ink-2">{query}</div>
          <p className="mt-2 text-[12.5px] text-ink-3">Demo shows where and how to search. The live build runs these searches and returns matching records with their IDs.</p>

          <div className="mt-4 divide-y divide-line rounded-lg border border-line bg-surface">
            {REGISTRIES.map((r) => (
              <div key={r.name} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div>
                  <p className="text-[14px] font-semibold text-ink">{r.name}</p>
                  <p className="text-[12.5px] text-ink-3">{r.desc}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${r.paid ? "bg-turmeric-soft text-turmeric" : "bg-brand-soft text-brand-strong"}`}>
                    {r.paid ? "Paid" : "Free"}
                  </span>
                  {r.paid ? (
                    <button
                      type="button"
                      onClick={() => (tkdlGranted ? null : setPermOpen(true))}
                      className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-2 hover:bg-sunk"
                    >
                      <Lock size={12} /> {tkdlGranted ? "Permission granted" : "Ask my permission"}
                    </button>
                  ) : (
                    <a href={r.url} target="_blank" rel="noopener" className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[12.5px] font-medium text-ink-2 hover:bg-sunk">
                      Open <ArrowSquareOut size={12} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <Reveal delay={0.12} className="mt-10">
        <h2 className="text-[15px] font-bold text-ink">Permission ledger</h2>
        {ledger.length === 0 ? (
          <p className="mt-1 text-[13px] text-ink-3">No permissions granted in this session.</p>
        ) : (
          <table className="mt-2 w-full text-[13px]">
            <thead>
              <tr className="border-b border-line text-left text-ink-3">
                <th className="py-1.5 font-medium">Source</th>
                <th className="py-1.5 font-medium">Scope</th>
                <th className="py-1.5 font-medium">Granted</th>
                <th className="py-1.5" />
              </tr>
            </thead>
            <tbody>
              {ledger.map((l, i) => (
                <tr key={i} className="border-b border-line">
                  <td className="py-2">{l.src}</td>
                  <td className="py-2 text-ink-2">{l.scope}</td>
                  <td className="py-2 text-ink-2">{l.time}</td>
                  <td className="py-2 text-right">
                    {l.active ? (
                      <button type="button" onClick={() => revokeLedger(i)} className="text-[12px] font-medium text-kumkum hover:underline">
                        Revoke
                      </button>
                    ) : (
                      <span className="text-ink-3">Revoked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Reveal>

      <AnimatePresence>
        {permOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPermOpen(false)} className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px]" />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              role="dialog"
              aria-modal="true"
              className="fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface p-6 shadow-lg"
            >
              <button type="button" onClick={() => setPermOpen(false)} className="absolute right-4 top-4 text-ink-3"><X size={16} /></button>
              <h2 className="pr-6 text-[16.5px] font-bold">Allow IP-SAKTI to query TKDL?</h2>
              <p className="mt-2 text-[13.5px] text-ink-2">TKDL is a paid subscription. IP-SAKTI uses your organisation's credentials only for this search, and every query is recorded in your permission ledger.</p>
              <dl className="mt-3 grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-[13px]">
                <dt className="text-ink-3">Scope</dt><dd>Prior-art search for: {input || "your product"}</dd>
                <dt className="text-ink-3">Duration</dt><dd>This session only</dd>
                <dt className="text-ink-3">Shared with TKDL</dt><dd>Search terms only, never your formulation</dd>
              </dl>
              <label className="mt-3 flex items-start gap-2 text-[13px] text-ink-2">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5" />
                I allow this search and understand it is logged
              </label>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setPermOpen(false)} className="rounded-full border border-line px-3.5 py-2 text-[13px] font-medium text-ink-2">Don't allow</button>
                <button type="button" onClick={grantPermission} disabled={!consent} className="rounded-full bg-brand px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-40">Allow and log</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
