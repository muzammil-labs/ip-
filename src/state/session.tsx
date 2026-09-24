import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
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
}

interface SessionApi extends SessionState {
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setSahayakOpen: (v: boolean) => void;
  setPresenter: (v: boolean) => void;
  openClauseSheet: (sourceId: string, point?: SourcePoint | null) => void;
  closeClauseSheet: () => void;
}

const SessionContext = createContext<SessionApi | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  // Light is the default and the designed theme; it does not follow system preference.
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [sahayakOpen, setSahayakOpen] = useState(false);
  const [presenter, setPresenter] = useState(false);
  const [clauseSheet, setClauseSheet] = useState<ClauseSheetState | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#0A1410" : "#F7F9F6");
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

  const value: SessionApi = {
    lang, theme, sahayakOpen, presenter, clauseSheet,
    setLang, setTheme, toggleTheme, setSahayakOpen, setPresenter, openClauseSheet, closeClauseSheet,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
