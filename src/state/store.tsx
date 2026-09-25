import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Answer, AuditEntry, LedgerEntry } from "../lib/types";

export type { AuditEntry, LedgerEntry } from "../lib/types";
export type Persona = "startup" | "vaidya" | "research" | "farmer";
export type Jurisdiction = "both" | "in" | "intl";
export type Detail = "plain" | "expert";

interface AppState {
  persona: Persona;
  juris: Jurisdiction;
  detail: Detail;
  current: Answer | null;
  history: string[];
  audit: AuditEntry[];
  ledger: LedgerEntry[];
}

interface AppApi extends AppState {
  setPersona: (p: Persona) => void;
  setJuris: (j: Jurisdiction) => void;
  setDetail: (d: Detail) => void;
  setCurrent: (a: Answer | null) => void;
  pushHistory: (q: string) => void;
  logEvent: (ev: string, detail?: string) => void;
  addLedger: (src: string, scope: string) => void;
  revokeLedger: (index: number) => void;
}

const AppContext = createContext<AppApi | null>(null);

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/** State for the Ask feature (#/ask, UI-4.9), which predates the Case model. Persona,
 * jurisdiction, detail level and the current/history conversation state live here;
 * the Case's own audit and consent (state/case.tsx) are the real, displayed record. */
export function AppProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>("startup");
  const [juris, setJuris] = useState<Jurisdiction>("both");
  const [detail, setDetail] = useState<Detail>("expert");
  const [current, setCurrent] = useState<Answer | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);

  const pushHistory = useCallback((q: string) => {
    setHistory((h) => [q, ...h.filter((x) => x !== q)].slice(0, 6));
  }, []);

  const logEvent = useCallback((ev: string, detail = "") => {
    setAudit((a) => [{ time: timeNow(), ev, detail }, ...a]);
  }, []);

  const addLedger = useCallback((src: string, scope: string) => {
    setLedger((l) => [{ src, scope, time: timeNow(), active: true }, ...l]);
  }, []);
  const revokeLedger = useCallback((index: number) => {
    setLedger((l) => l.map((entry, i) => (i === index ? { ...entry, active: false } : entry)));
  }, []);

  const value = useMemo<AppApi>(
    () => ({
      persona, juris, detail, current, history, audit, ledger,
      setPersona, setJuris, setDetail, setCurrent, pushHistory, logEvent, addLedger, revokeLedger,
    }),
    [persona, juris, detail, current, history, audit, ledger, pushHistory, logEvent, addLedger, revokeLedger]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
