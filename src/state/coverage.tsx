import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const STORAGE_KEY = "ips.coverage.v1";

function readStored(): Set<number> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

function writeStored(marked: Set<number>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...marked]));
  } catch {
    // sessionStorage unavailable (private mode, blocked storage); the tracker just won't persist across reload.
  }
}

interface CoverageApi {
  marked: Set<number>;
  mark: (id: number) => void;
}

const CoverageContext = createContext<CoverageApi | null>(null);

/** UI-7.5: which of data/coverage.ts's 17 PS requirements the demo has touched this session.
 * Session-only (sessionStorage, not the Case's own localStorage), since it tracks the walkthrough
 * itself, not any one Case. */
export function CoverageProvider({ children }: { children: ReactNode }) {
  const [marked, setMarked] = useState<Set<number>>(readStored);

  const mark = useCallback((id: number) => {
    setMarked((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev).add(id);
      writeStored(next);
      return next;
    });
  }, []);

  return <CoverageContext.Provider value={{ marked, mark }}>{children}</CoverageContext.Provider>;
}

export function useCoverage(): CoverageApi {
  const ctx = useContext(CoverageContext);
  if (!ctx) throw new Error("useCoverage must be used within CoverageProvider");
  return ctx;
}
