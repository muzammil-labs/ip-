export type Jurisdiction = "India" | "Export market" | "International" | "Treaty";
export type EvidenceState = "V" | "U" | "C" | "R";

export interface SourcePoint {
  t: string;
  s: EvidenceState;
  c: string[];
  flux?: boolean;
}

export interface AnswerColumn {
  plain: string;
  pts: SourcePoint[];
}

export interface Answer {
  id: string;
  persona?: string[];
  lang: "en" | "hi" | "te";
  q: string;
  keys?: string[];
  cls?: string;
  in?: AnswerColumn;
  intl?: AnswerColumn;
  gaps?: string[];
  gloss?: [string, string][];
  abstain?: { why: string; next: string[]; cite?: string };
  esc?: boolean;
}

export interface Source {
  t: string;
  tier: number;
  jur: string;
  reg: string;
  status: string;
  ver: string;
  by: string;
  summary?: string;
  excerpt?: string;
  url: string;
  flux?: boolean;
  paid?: boolean;
  note?: string;
}

export interface Confidence {
  auth: number;
  cov: number;
  agr: number;
  overall: number;
  strong: number;
  ver: number;
  conf: number;
  n: number;
}

export interface ClassifyState {
  use?: string;
  text?: string;
  frac?: string;
  src?: string;
  ent?: string;
  [k: string]: string | undefined;
}

export interface ClassifyQuestion {
  k: string;
  q: string;
  why: string;
  show?: (c: ClassifyState) => boolean;
  o: [string, string][];
}

export interface ClassifyCategory {
  name: string;
  sum: string;
  rows: Record<string, [string, string[]]>;
}
