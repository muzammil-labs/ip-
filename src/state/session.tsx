import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { Lang } from "../i18n/useT";
import type { SourcePoint } from "../lib/types";

export type Theme = "light" | "dark";

const THEME_KEY = "ips.theme";

function readStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function writeStoredTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage unavailable (private mode, blocked storage); theme just won't persist.
  }
}

interface ClauseSheetState {
  sourceId: string;
  point: SourcePoint | null;
}

interface SessionState {
  lang: Lang;
  theme: Theme;
  sahayakOpen: boolean;
  presenter: boolean;
  clauseSheet: ClauseSheetState | null;
  /** UI-6.2 legal time machine: an ISO date ("YYYY-MM-DD") the user is viewing sources as of, or null
   * for "today" (live). Session-only, not persisted. */
  asOfDate: string | null;
  /** UI-9.14 LeafFall: bumps whenever celebrate() fires a new (not-yet-celebrated) key, so LeafFall's
   * effect can key off it. Null until the first celebration. */
  celebration: { key: string; at: number } | null;
}

interface SessionApi extends SessionState {
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setSahayakOpen: (v: boolean) => void;
  setPresenter: (v: boolean) => void;
  openClauseSheet: (sourceId: string, point?: SourcePoint | null) => void;
  closeClauseSheet: () => void;
  setAsOfDate: (d: string | null) => void;
  /** Fires LeafFall for this key (a chapter slug, or "dossier"), at most once per key per session. */
  celebrate: (key: string) => void;
}

const SessionContext = createContext<SessionApi | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  // Light is the default and the designed theme; it does not follow system preference.
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [sahayakOpen, setSahayakOpen] = useState(false);
  const [presenter, setPresenter] = useState(false);
  const [clauseSheet, setClauseSheet] = useState<ClauseSheetState | null>(null);
  const [asOfDate, setAsOfDate] = useState<string | null>(null);
  const [celebration, setCelebration] = useState<{ key: string; at: number } | null>(null);
  const celebratedKeys = useRef(new Set<string>());

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#07110D" : "#F6F8F5");
    writeStoredTheme(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleTheme = useCallback(() => setTheme((th) => (th === "light" ? "dark" : "light")), []);
  const openClauseSheet = useCallback((sourceId: string, point: SourcePoint | null = null) => {
    setClauseSheet({ sourceId, point });
  }, []);
  const closeClauseSheet = useCallback(() => setClauseSheet(null), []);
  const celebrate = useCallback((key: string) => {
    if (celebratedKeys.current.has(key)) return;
    celebratedKeys.current.add(key);
    setCelebration({ key, at: Date.now() });
  }, []);

  const value: SessionApi = {
    lang, theme, sahayakOpen, presenter, clauseSheet, asOfDate, celebration,
    setLang, setTheme, toggleTheme, setSahayakOpen, setPresenter, openClauseSheet, closeClauseSheet, setAsOfDate, celebrate,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
