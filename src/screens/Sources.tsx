import { useMemo, useState } from "react";
import { useApp } from "../state/store";
import { useT } from "../i18n/useT";
import { SOURCES } from "../data/sources";
import Reveal from "../components/Reveal";

const TIMELINE: [string, string][] = [
  ["Aug 2023", "Ministry asks States not to act under Rule 170 while it is reviewed."],
  ["7 May 2024", "Supreme Court directs adherence to Rule 170 and self-declarations by advertisers."],
  ["1 Jul 2024", "Drugs (Fourth Amendment) Rules, 2024 omit Rule 170."],
  ["27 Aug 2024", "Supreme Court stays the omission; pre-approval effectively returns."],
  ["Aug 2025", "Stay vacated and petition disposed; Rule 170 stands omitted, contentions open."],
];

export default function Sources() {
  const { openSource } = useApp();
  const t = useT();
  const [jur, setJur] = useState("");
  const [tier, setTier] = useState("");
  const [reg, setReg] = useState("");

  const regs = useMemo(() => [...new Set(Object.values(SOURCES).map((s) => s.reg))].sort(), []);
  const rows = useMemo(
    () => Object.entries(SOURCES).filter(([, s]) => (!jur || s.jur === jur) && (!tier || String(s.tier) === tier) && (!reg || s.reg === reg)),
    [jur, tier, reg]
  );
  const jurs = useMemo(() => [...new Set(Object.values(SOURCES).map((s) => s.jur))].sort(), []);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 sm:py-14">
      <Reveal>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("srcH1")}</h1>
        <p className="mt-2 max-w-[64ch] text-[14.5px] text-ink-2">{t("srcLede")}</p>
      </Reveal>

      <Reveal delay={0.06} className="mt-6 flex flex-wrap gap-2">
        <select value={jur} onChange={(e) => setJur(e.target.value)} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px]">
          <option value="">{t("allJurisdictions")}</option>
          {jurs.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>
        <select value={tier} onChange={(e) => setTier(e.target.value)} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px]">
          <option value="">{t("allTiers")}</option>
          {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{t("tierLabel").replace("{n}", String(n))}</option>)}
        </select>
        <select value={reg} onChange={(e) => setReg(e.target.value)} className="rounded-full border border-line bg-surface px-3 py-1.5 text-[13px]">
          <option value="">{t("allRegistries")}</option>
          {regs.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Reveal>

      <Reveal delay={0.1} className="mt-4 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead>
            <tr className="border-b border-line bg-sunk text-left text-ink-3">
              <th className="px-3 py-2 font-medium">{t("colTier")}</th>
              <th className="px-3 py-2 font-medium">{t("colTitle")}</th>
              <th className="px-3 py-2 font-medium">{t("colJurisdiction")}</th>
              <th className="px-3 py-2 font-medium">{t("colRegistry")}</th>
              <th className="px-3 py-2 font-medium">{t("colStatus")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([id, s]) => (
              <tr key={id} onClick={() => openSource(id)} className="cursor-pointer border-b border-line last:border-0 hover:bg-sunk">
                <td className="px-3 py-2"><span className="rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-bold text-brand-strong">{s.tier}</span></td>
                <td className="px-3 py-2 text-ink">{s.t}</td>
                <td className="px-3 py-2 text-ink-2">{s.jur}</td>
                <td className="px-3 py-2 text-ink-2">{s.reg}</td>
                <td className="px-3 py-2">
                  {s.flux ? <span className="rounded-full bg-turmeric-soft px-2 py-0.5 text-[11px] font-semibold text-turmeric">{s.status}</span> : <span className="text-ink-2">{s.status}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={0.14} id="rule170" className="mt-12">
        <h2 className="text-[16px] font-bold text-ink">{t("rule170Heading")}</h2>
        <p className="mt-1 text-[13.5px] text-ink-2">{t("rule170Lede")}</p>
        <ol className="relative mt-5 space-y-5 border-l-2 border-line pl-6">
          {TIMELINE.map(([date, desc], i) => (
            <li key={date} className="relative">
              <span
                className={`absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-surface ${i === TIMELINE.length - 1 ? "bg-kumkum" : "bg-brand"}`}
              />
              <p className="text-[13px] font-bold text-ink">{date}</p>
              <p className="text-[13.5px] text-ink-2">
                {desc}
                {i === TIMELINE.length - 1 && (
                  <button type="button" onClick={() => openSource("dr-170")} className="ml-1.5 rounded-full border border-focus/40 bg-focus-soft px-2 py-0.5 text-[11px] font-semibold text-focus">
                    {t("sourceBtn")}
                  </button>
                )}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
