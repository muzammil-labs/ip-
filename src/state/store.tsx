import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Answer, ClassifyState, SourcePoint } from "../lib/types";
import type { Lang } from "../data/i18n";

export type Screen = "overview" | "ask" | "classify" | "tk" | "claims" | "sources" | "trust" | "blueprint";
export type Persona = "startup" | "vaidya" | "research" | "farmer";
export type Jurisdiction = "both" | "in" | "intl";
export type Detail = "plain" | "expert";

export interface AuditEntry {
  time: string;
  ev: string;
  detail: string;
}

export interface LedgerEntry {
  src: string;
  scope: string;
  time: string;
  active: boolean;
}

interface AppState {
  screen: Screen;
  lang: Lang;
  persona: Persona;
  juris: Jurisdiction;
  detail: Detail;
  current: Answer | null;
  history: string[];
  audit: AuditEntry[];
  ledger: LedgerEntry[];
  cls: ClassifyState;
  prevRows: { cat: string; rowsByKey: Record<string, string> } | null;
  claimCat: string;
  drawer: { sourceId: string; point: SourcePoint | null } | null;
}

interface AppApi extends AppState {
  go: (s: Screen) => void;
  setLang: (l: Lang) => void;
  setPersona: (p: Persona) => void;
  setJuris: (j: Jurisdiction) => void;
  setDetail: (d: Detail) => void;
  setCurrent: (a: Answer | null) => void;
  pushHistory: (q: string) => void;
  logEvent: (ev: string, detail?: string) => void;
  addLedger: (src: string, scope: string) => void;
  revokeLedger: (index: number) => void;
  setCls: (obj: ClassifyState) => void;
  answerCls: (k: string, v: string) => void;
  setPrevRows: (v: AppState["prevRows"]) => void;
  setClaimCat: (c: string) => void;
  openSource: (sourceId: string, point?: SourcePoint | null) => void;
  closeDrawer: () => void;
}

const AppContext = createContext<AppApi | null>(null);

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("overview");
  const [lang, setLang] = useState<Lang>("en");
  const [persona, setPersona] = useState<Persona>("startup");
  const [juris, setJuris] = useState<Jurisdiction>("both");
  const [detail, setDetail] = useState<Detail>("expert");
  const [current, setCurrent] = useState<Answer | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [cls, setClsState] = useState<ClassifyState>({});
  const [prevRows, setPrevRows] = useState<AppState["prevRows"]>(null);
  const [claimCat, setClaimCat] = useState("drug");
  const [drawer, setDrawer] = useState<AppState["drawer"]>(null);

  const go = useCallback((s: Screen) => setScreen(s), []);
  const openSource = useCallback((sourceId: string, point: SourcePoint | null = null) => {
    setDrawer({ sourceId, point });
  }, []);
  const closeDrawer = useCallback(() => setDrawer(null), []);

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

  const setCls = useCallback((obj: ClassifyState) => setClsState(obj), []);

  const answerCls = useCallback((k: string, v: string) => {
    setClsState((c) => ({ ...c, [k]: v }));
  }, []);

  const value = useMemo<AppApi>(
    () => ({
      screen, lang, persona, juris, detail, current, history, audit, ledger, cls, prevRows, claimCat, drawer,
      go, setLang, setPersona, setJuris, setDetail, setCurrent, pushHistory, logEvent, addLedger, revokeLedger, setCls, answerCls, setPrevRows, setClaimCat, openSource, closeDrawer,
    }),
    [screen, lang, persona, juris, detail, current, history, audit, ledger, cls, prevRows, claimCat, drawer, go, pushHistory, logEvent, addLedger, revokeLedger, setCls, answerCls, openSource, closeDrawer]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
