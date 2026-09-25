import { useEffect, useState } from "react";
import { CaretDown, CaretUp, Trash, X } from "@phosphor-icons/react";
import { useSession } from "../state/session";
import { useT } from "../i18n/useT";
import { subscribeApiLog, clearApiLog, type ApiCallLogEntry } from "../api/client";
import { LAYER } from "../ui/layers";

let externalOpen: ((v: boolean) => void) | null = null;

/** Opens the inspector from outside presenter mode, e.g. the link on the How it works page. */
export function openApiInspector() {
  externalOpen?.(true);
}

/**
 * UI-3.7: a docked panel listing every call the typed API client (src/api/client.ts) has
 * made, backed by MSW. Toggled with the 'D' key while presenter mode is on, or by calling
 * openApiInspector() from anywhere (How it works links to it). Mounted once in Shell.
 */
export default function ApiInspector() {
  const { presenter } = useSession();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [entries, setEntries] = useState<ApiCallLogEntry[]>([]);

  useEffect(() => {
    externalOpen = setOpen;
    return () => {
      externalOpen = null;
    };
  }, []);

  useEffect(() => subscribeApiLog(setEntries), []);

  useEffect(() => {
    if (!presenter) return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (e.key.toLowerCase() === "d" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenter]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 flex max-h-[50dvh] flex-col border-t border-line bg-surface shadow-2 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:max-h-[70dvh] sm:w-[440px] sm:rounded-container sm:border"
      style={{ zIndex: LAYER.toast }}
      role="region"
      aria-label={t("apiInspectorTitle")}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="text-small font-semibold text-ink">
          {t("apiInspectorTitle")} <span className="text-ink-3">({entries.length})</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={clearApiLog}
            className="flex h-8 w-8 items-center justify-center rounded-control text-ink-3 hover:bg-wash"
            aria-label={t("apiInspectorClear")}
          >
            <Trash size={16} />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-control text-ink-3 hover:bg-wash"
            aria-label={t("closeAria")}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="p-4 text-small text-ink-3">{t("apiInspectorEmpty")}</div>
        ) : (
          <ul className="divide-y divide-line">
            {entries.map((entry) => {
              const isOpen = expandedId === entry.id;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : entry.id)}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-small hover:bg-wash"
                    aria-expanded={isOpen}
                  >
                    <span className={`font-mono text-mono ${entry.status >= 400 ? "text-kumkum" : "text-neem-strong"}`}>
                      {entry.method}
                    </span>
                    <span className="flex-1 truncate font-mono text-mono text-ink-2">{entry.path}</span>
                    <span className="text-ink-3">{entry.status}</span>
                    <span className="text-ink-3">{entry.latencyMs}ms</span>
                    {isOpen ? <CaretUp size={14} /> : <CaretDown size={14} />}
                  </button>
                  {isOpen && (
                    <div className="flex flex-col gap-3 bg-wash px-4 py-3">
                      <div>
                        <div className="mb-1 text-small font-semibold text-ink-3">{t("apiInspectorRequest")}</div>
                        <pre className="overflow-x-auto rounded-control bg-surface p-2 font-mono text-mono text-ink-2">
                          {JSON.stringify(entry.request, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <div className="mb-1 text-small font-semibold text-ink-3">{t("apiInspectorResponse")}</div>
                        <pre className="overflow-x-auto rounded-control bg-surface p-2 font-mono text-mono text-ink-2">
                          {JSON.stringify(entry.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
