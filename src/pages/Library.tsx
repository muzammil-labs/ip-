import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import Segmented from "../ui/Segmented";
import DataTable, { type DataTableColumn } from "../ui/DataTable";
import { Field } from "../ui/Field";
import { StatusChip } from "../ui/Chip";
import Section from "../ui/Section";
import { useT } from "../i18n/useT";
import { SOURCES } from "../data/sources";

const RULE_170_TIMELINE: [string, string][] = [
  ["Aug 2023", "Ministry asks States not to act under Rule 170 while it is reviewed."],
  ["7 May 2024", "Supreme Court directs adherence to Rule 170 and self-declarations by advertisers."],
  ["1 Jul 2024", "Drugs (Fourth Amendment) Rules, 2024 omit Rule 170."],
  ["27 Aug 2024", "Supreme Court stays the omission; pre-approval effectively returns."],
  ["Aug 2025", "Stay vacated and petition disposed; Rule 170 stands omitted, contentions open."],
];

interface Row {
  id: string;
  act: string;
  section: string;
  tier: number;
  jur: string;
  status: string;
  ver: string;
  flux?: boolean;
}

/** #/library (B2): DataTable of the source register with jurisdiction/tier filters. Row opens #/library/:id. */
export default function Library() {
  const t = useT();
  const [, navigate] = useLocation();
  const [jur, setJur] = useState("all");
  const [query, setQuery] = useState("");

  const jurs = useMemo(() => ["all", ...new Set(Object.values(SOURCES).map((s) => s.jur))], []);

  const rows: Row[] = useMemo(
    () =>
      Object.entries(SOURCES)
        .filter(([, s]) => jur === "all" || s.jur === jur)
        .filter(([, s]) => !query.trim() || s.t.toLowerCase().includes(query.trim().toLowerCase()))
        .map(([id, s]) => ({ id, act: s.act ?? s.t, section: s.section ?? "", tier: s.tier, jur: s.jur, status: s.status, ver: s.ver, flux: s.flux })),
    [jur, query]
  );

  const columns: DataTableColumn<Row>[] = [
    {
      key: "act",
      header: t("colTitle"),
      primary: true,
      render: (r) => (
        <span>
          <span className="block font-semibold text-ink">{r.act}</span>
          {r.section && <span className="block text-small text-ink-3">{r.section}</span>}
        </span>
      ),
    },
    {
      key: "tier",
      header: t("colTier"),
      render: (r) => <span className="whitespace-nowrap">{t("tierLabel").replace("{n}", String(r.tier))}</span>,
    },
    { key: "jur", header: t("colJurisdiction"), render: (r) => r.jur },
    {
      key: "status",
      header: t("colStatus"),
      render: (r) => (r.flux ? <StatusChip tone="input">{r.status}</StatusChip> : <span className="text-ink-2">{r.status}</span>),
    },
    { key: "ver", header: t("colVersion"), render: (r) => r.ver },
  ];

  return (
    <div className="mx-auto max-w-[var(--w-shell)] px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-h1 text-ink">{t("srcH1")}</h1>
      <p className="mt-2 max-w-[64ch] text-body-lg text-ink-2">{t("srcLede")}</p>

      <div className="mt-8">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          onRowClick={(r) => navigate(`/library/${r.id}`)}
          emptyMessage={t("librarySearchEmpty")}
          filterBar={
            <>
              <Segmented label={t("colJurisdiction")} value={jur} onChange={setJur} options={jurs.map((j) => ({ value: j, label: j === "all" ? t("allJurisdictions") : j }))} />
              <Field label={t("librarySearchLabel")} placeholder={t("librarySearchPlaceholder")} value={query} onChange={(e) => setQuery(e.target.value)} className="h-9 w-56" />
            </>
          }
        />
      </div>

      <Section title={t("rule170Heading")} lede={t("rule170Lede")}>
        <ol className="relative space-y-5 border-l-2 border-line pl-6">
          {RULE_170_TIMELINE.map(([date, desc], i) => (
            <li key={date} className="relative">
              <span className={`absolute -left-[29px] top-1 h-3 w-3 rounded-pill border-2 border-surface ${i === RULE_170_TIMELINE.length - 1 ? "bg-kumkum" : "bg-neem"}`} />
              <p className="text-small font-semibold text-ink">{date}</p>
              <p className="text-small text-ink-2">{desc}</p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}
