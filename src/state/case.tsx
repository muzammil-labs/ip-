import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import type { AuditEntry, ClassifyState, LedgerEntry } from "../lib/types";
import type { Persona } from "./store";

export type DosageForm = "tablet" | "capsule" | "churna" | "syrup" | "oil" | "cream" | "other";
export type Market = "IN" | "EU" | "US" | "GCC" | "ASEAN";
export type ClaimMedium = "label" | "ad" | "web";

export interface PlantRef {
  /** As the user typed it, any script. */
  name: string;
  botanicalName?: string;
}

export interface FormulaItem {
  plant: PlantRef;
  part: string;
  qty?: string;
}

export interface ClaimItem {
  text: string;
  medium: ClaimMedium;
}

export interface CaseQuestion {
  q: string;
  answerId: string | null;
  at: string;
}

export interface Case {
  id: string;
  createdAt: string;
  corpusVersion: string;
  product: { name: string; description: string; form?: DosageForm };
  formula: FormulaItem[];
  answers: ClassifyState;
  persona: Persona;
  markets: Market[];
  turnoverCr?: number;
  claims: ClaimItem[];
  questions: CaseQuestion[];
  consent: LedgerEntry[];
  audit: AuditEntry[];
  asOf: string;
}

export const CORPUS_VERSION = "2026-09-24";

function timeNow() {
  return new Date().toISOString();
}

function newCaseId() {
  return `case_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyCase(): Case {
  const now = timeNow();
  return {
    id: newCaseId(),
    createdAt: now,
    corpusVersion: CORPUS_VERSION,
    product: { name: "", description: "" },
    formula: [],
    answers: {},
    persona: "startup",
    markets: ["IN"],
    claims: [],
    questions: [],
    consent: [],
    audit: [{ time: now, ev: "Case started", detail: "" }],
    asOf: now.slice(0, 10),
  };
}

export type CaseAction =
  | { type: "setField"; field: "productName"; value: string }
  | { type: "setField"; field: "productDescription"; value: string }
  | { type: "setField"; field: "productForm"; value: DosageForm | undefined }
  | { type: "setField"; field: "persona"; value: Persona }
  | { type: "setField"; field: "markets"; value: Market[] }
  | { type: "setField"; field: "turnoverCr"; value: number | undefined }
  | { type: "answer"; k: string; v: string }
  | { type: "addFormulaItem"; item: FormulaItem }
  | { type: "removeFormulaItem"; index: number }
  | { type: "setClaims"; claims: ClaimItem[] }
  | { type: "ask"; q: string; answerId: string | null }
  | { type: "grantConsent"; src: string; scope: string }
  | { type: "revokeConsent"; index: number }
  | { type: "setAsOf"; asOf: string }
  | { type: "reset" }
  | { type: "loadExample"; example: Case }
  | { type: "loadShared"; shared: Case };

function logged(c: Case, ev: string, detail = ""): Case {
  // Audit log is append-only: entries are never edited or removed, only added.
  return { ...c, audit: [...c.audit, { time: timeNow(), ev, detail }] };
}

function reducer(c: Case, action: CaseAction): Case {
  switch (action.type) {
    case "setField": {
      switch (action.field) {
        case "productName":
          return logged({ ...c, product: { ...c.product, name: action.value } }, "Product name set");
        case "productDescription":
          return logged({ ...c, product: { ...c.product, description: action.value } }, "Product description set");
        case "productForm":
          return logged({ ...c, product: { ...c.product, form: action.value } }, "Product form set");
        case "persona":
          return logged({ ...c, persona: action.value }, "Persona changed", action.value);
        case "markets":
          return logged({ ...c, markets: action.value }, "Markets changed", action.value.join(", "));
        case "turnoverCr":
          return logged({ ...c, turnoverCr: action.value }, "Turnover set");
      }
      return c;
    }
    case "answer":
      return logged({ ...c, answers: { ...c.answers, [action.k]: action.v } }, "Answered", `${action.k} = ${action.v}`);
    case "addFormulaItem":
      return logged({ ...c, formula: [...c.formula, action.item] }, "Formula item added", action.item.plant.name);
    case "removeFormulaItem":
      return logged({ ...c, formula: c.formula.filter((_, i) => i !== action.index) }, "Formula item removed");
    case "setClaims":
      return logged({ ...c, claims: action.claims }, "Claims text updated");
    case "ask":
      return logged(
        { ...c, questions: [...c.questions, { q: action.q, answerId: action.answerId, at: timeNow() }] },
        "Question asked",
        action.q
      );
    case "grantConsent":
      return logged(
        { ...c, consent: [...c.consent, { src: action.src, scope: action.scope, time: timeNow(), active: true }] },
        "Consent granted",
        `${action.src}: ${action.scope}`
      );
    case "revokeConsent":
      return logged(
        { ...c, consent: c.consent.map((entry, i) => (i === action.index ? { ...entry, active: false } : entry)) },
        "Consent revoked"
      );
    case "setAsOf":
      return logged({ ...c, asOf: action.asOf }, "As-of date changed", action.asOf);
    case "reset":
      return emptyCase();
    case "loadExample":
      return logged({ ...action.example, id: newCaseId(), createdAt: timeNow() }, "Example case loaded", action.example.product.name);
    case "loadShared":
      return logged(
        { ...action.shared, id: newCaseId(), createdAt: timeNow(), audit: [], consent: [] },
        "Case loaded from share link",
        action.shared.product.name
      );
  }
}

const STORAGE_KEY = "ips.case.v1";

function readStoredCase(): Case | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Case) : null;
  } catch {
    return null;
  }
}

function writeStoredCase(c: Case) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {
    // localStorage unavailable (private mode, blocked storage); the Case just won't persist.
  }
}

const CaseContext = createContext<{ case: Case; dispatch: React.Dispatch<CaseAction> } | null>(null);

export function CaseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => readStoredCase() ?? emptyCase());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => writeStoredCase(state), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state]);

  return <CaseContext.Provider value={{ case: state, dispatch }}>{children}</CaseContext.Provider>;
}

export function useCase() {
  const ctx = useContext(CaseContext);
  if (!ctx) throw new Error("useCase must be used within CaseProvider");
  return ctx;
}
