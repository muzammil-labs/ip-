import { CLAIM_RULES, type ClaimRule } from "../data/claimRules";
import { CAT_RULES } from "../data/claimCategoryRules";

export interface ClaimFinding {
  start: number;
  end: number;
  match: string;
  rule: ClaimRule;
}

export interface ClaimSegment {
  text: string;
  finding: ClaimFinding | null;
}

export interface ClaimReport {
  segments: ClaimSegment[];
  findings: ClaimFinding[];
  bad: number;
  warn: number;
  ruleFlagged: boolean;
}

/** Scans free text for prohibited/needs-proof advertising language, keeping only non-overlapping matches (first-wins, longest-wins on ties). */
export function runClaims(text: string, claimCat: string): ClaimReport {
  const found: ClaimFinding[] = [];
  const rules: ClaimRule[] = [...CLAIM_RULES, ...(CAT_RULES[claimCat] ? [CAT_RULES[claimCat]] : [])];
  for (const r of rules) {
    r.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = r.re.exec(text))) {
      found.push({ start: m.index, end: m.index + m[0].length, match: m[0], rule: r });
      if (m[0].length === 0) r.re.lastIndex++;
    }
  }
  found.sort((a, b) => a.start - b.start || b.end - a.end);
  const kept: ClaimFinding[] = [];
  let end = -1;
  for (const f of found) {
    if (f.start >= end) {
      kept.push(f);
      end = f.end;
    }
  }

  const segments: ClaimSegment[] = [];
  let pos = 0;
  for (const f of kept) {
    if (f.start > pos) segments.push({ text: text.slice(pos, f.start), finding: null });
    segments.push({ text: text.slice(f.start, f.end), finding: f });
    pos = f.end;
  }
  if (pos < text.length) segments.push({ text: text.slice(pos), finding: null });

  const bad = kept.filter((f) => f.rule.lvl === "bad").length;
  const warn = kept.length - bad;
  return { segments, findings: kept, bad, warn, ruleFlagged: claimCat === "drug" };
}
