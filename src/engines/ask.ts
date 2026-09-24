import { ANSWERS } from "../data/answers";
import type { Answer } from "../lib/types";

/** Keyword-overlap match against the scripted corpus. Requires a real score, so near-misses abstain. */
export function matchQuestion(q: string): Answer | null {
  const n = q.toLowerCase();
  let best: Answer | null = null;
  let score = 0;
  for (const a of ANSWERS) {
    let s = 0;
    for (const k of a.keys || []) if (n.includes(k.toLowerCase())) s++;
    if (n.trim() === a.q.toLowerCase()) s += 10;
    if (s > score) {
      score = s;
      best = a;
    }
  }
  if (best && (score >= 2 || (best.abstain && score >= 1))) return best;
  return null;
}

export function unknownAnswer(q: string): Answer {
  return {
    id: "unk",
    q,
    lang: /[ऀ-ॿ]/.test(q) ? "hi" : /[ఀ-౿]/.test(q) ? "te" : "en",
    abstain: {
      why: "No source in the corpus answers this with enough support, so IP-SAKTI won't guess. In the live build the question would go through full retrieval first; this demo only holds the scripted set.",
      next: [
        "Frame it around your product, a right (patent, trade mark, GI, design) or a duty (licence, biodiversity, advertising)",
        "Or send it to a human IP facilitator",
      ],
    },
    esc: true,
  };
}

interface AskApi {
  setCurrent: (a: Answer | null) => void;
  pushHistory: (q: string) => void;
  logEvent: (ev: string, detail?: string) => void;
}

/** Shared entry point for asking a question, whether typed, spoken, suggested, or triggered by the guided tour. */
export function performAsk(app: AskApi, q: string): Answer {
  const query = (q || "").trim();
  const a = matchQuestion(query) || unknownAnswer(query);
  app.setCurrent(a);
  app.pushHistory(a.q);
  app.logEvent(
    a.abstain ? "Answer withheld (abstained)" : "Answer served",
    a.id === "unk" ? "Unmatched question, content not stored" : `Question ${a.id}, ${a.lang.toUpperCase()}`
  );
  return a;
}

export function citeNumbering(a: Answer): Record<string, number> {
  const map: Record<string, number> = {};
  let i = 1;
  for (const side of ["in", "intl"] as const) {
    for (const p of a[side]?.pts || []) {
      for (const c of p.c) if (!map[c]) map[c] = i++;
    }
  }
  if (a.abstain?.cite && !map[a.abstain.cite]) map[a.abstain.cite] = i++;
  return map;
}
