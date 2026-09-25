import { useCallback, useEffect, useRef, useState } from "react";
import type { ClauseHit } from "../workers/search.worker";

export type { ClauseHit };

/** UI-6.6: runs clause search (MiniSearch over data/sources.ts) in a Web Worker, off the main
 * thread. The worker is created lazily, on the first search, and terminated on unmount. */
export function useClauseSearch() {
  const workerRef = useRef<Worker | null>(null);
  const [results, setResults] = useState<ClauseHit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const search = useCallback((query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    if (!workerRef.current) {
      workerRef.current = new Worker(new URL("../workers/search.worker.ts", import.meta.url), { type: "module" });
    }
    const worker = workerRef.current;
    setLoading(true);
    const handleMessage = (event: MessageEvent<{ results: ClauseHit[] }>) => {
      setResults(event.data.results);
      setLoading(false);
      worker.removeEventListener("message", handleMessage);
    };
    worker.addEventListener("message", handleMessage);
    worker.postMessage({ query });
  }, []);

  return { results, loading, search };
}
