import { useMemo } from "react";
import { useSession } from "../state/session";
import { useT } from "../i18n/useT";
import { eventsFor, fractionBetween } from "../engines/asOf";

const START = new Date(2018, 0, 1);

function monthsBetween(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1);
}

export interface TimeMachineProps {
  /** Source ids whose events show as ticks on the track. */
  sourceIds: string[];
}

/** UI-6.2: a date slider from Jan 2018 to today, with event ticks for the given sources. Moving it sets
 * session.asOfDate (null = "today"); EvidenceRow-consuming screens re-derive each cited source's status
 * as of that date from engines/asOf.ts and Shift the rows that changed. */
export default function TimeMachine({ sourceIds }: TimeMachineProps) {
  const { asOfDate, setAsOfDate, lang } = useSession();
  const t = useT();

  const today = useMemo(() => new Date(), []);
  const totalMonths = monthsBetween(START, today);
  const current = asOfDate ? new Date(asOfDate) : today;
  const monthValue = Math.min(totalMonths, Math.max(0, monthsBetween(START, current)));
  const events = useMemo(() => eventsFor(sourceIds), [sourceIds]);

  const localeTag = { en: "en-IN", hi: "hi-IN", te: "te-IN" }[lang];
  const label = asOfDate
    ? new Date(asOfDate).toLocaleDateString(localeTag, { year: "numeric", month: "long", day: current.getDate() > 1 || asOfDate.length > 7 ? "numeric" : undefined })
    : t("timeMachineToday");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const n = Number(e.target.value);
    if (n >= totalMonths) {
      setAsOfDate(null);
      return;
    }
    setAsOfDate(addMonths(START, n).toISOString().slice(0, 10));
  }

  return (
    <div className="rounded-container border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-small font-semibold text-ink">{t("timeMachineLabel")}</p>
        <p className="text-small font-medium text-ink-2" aria-live="polite">
          {label}
        </p>
      </div>

      <div className="relative mt-3">
        <input
          type="range"
          min={0}
          max={totalMonths}
          value={monthValue}
          onChange={handleChange}
          aria-label={t("timeMachineLabel")}
          className="w-full accent-neem"
        />
        {events.length > 0 && (
          <div className="relative mt-1 h-3" aria-hidden="true">
            {events.map((ev, i) => (
              <span
                key={i}
                title={ev.label}
                style={{ left: `${fractionBetween(ev.date, START, today) * 100}%` }}
                className="absolute top-0 h-2.5 w-0.5 -translate-x-1/2 bg-ink-3"
              />
            ))}
          </div>
        )}
      </div>

      {asOfDate && (
        <button type="button" onClick={() => setAsOfDate(null)} className="mt-2 text-small font-medium text-indigo hover:underline">
          {t("timeMachineReset")}
        </button>
      )}
    </div>
  );
}
