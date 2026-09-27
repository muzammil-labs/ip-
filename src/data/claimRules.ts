import { DISEASES } from "./constants";

export type ClaimRule = {
  re: RegExp;
  lvl: "bad" | "warn";
  why: (m: string) => string;
  cite: string;
  fix: string;
};

export const CLAIM_RULES: ClaimRule[] = [
 {re:new RegExp("\\b("+DISEASES.map(d=>d.replace(/ /g,"\\s+")).join("|")+")\\b","gi"),lvl:"bad",why:m=>`"${m}" is a condition in the Schedule to the Drugs and Magic Remedies Act; no drug may be advertised for it.`,cite:"dmr-3",fix:"Remove the disease. Describe only permitted traditional use, e.g. \"traditionally used to support healthy metabolism\", as your licence allows."},
 {re:/\b(permanently\s+cures?|cures?|cured|permanent\s+cure)\b/gi,lvl:"bad",why:()=>"An absolute cure claim is prohibited for Schedule conditions and misleading elsewhere.",cite:"dmr-4",fix:"Replace with \"supports\" or \"helps maintain\" only where evidence exists."},
 {re:/\b(miracle|magic(al)?|wonder)\b/gi,lvl:"bad",why:()=>"Magic-remedy language is the core target of the 1954 Act.",cite:"dmr-4",fix:"Delete it."},
 {re:/\b(guaranteed?|100%\s+effective|in\s+\d+\s+days)\b/gi,lvl:"warn",why:()=>"Guaranteed results or fixed timelines need substantiation or are misleading.",cite:"ccpa",fix:"Drop the promise or cite the study that supports it."},
 {re:/\bno\s+side[\s-]effects?\b/gi,lvl:"warn",why:()=>"\"No side effects\" is an absolute safety claim that must be proven.",cite:"ccpa",fix:"Say \"use as directed\" and list precautions."},
 {re:/\bclinically\s+(proven|tested)\b/gi,lvl:"warn",why:()=>"Needs a published study you can produce on request.",cite:"ccpa",fix:"Reference the study, or remove."},
 {re:/\bdoctor[\s-]recommended\b/gi,lvl:"warn",why:()=>"An endorsement must be genuine and substantiated.",cite:"ccpa",fix:"Name the basis, or remove."},
 {re:/\b100%\s+(herbal|natural)\b/gi,lvl:"warn",why:()=>"Must be literally true, including excipients and preservatives.",cite:"ccpa",fix:"Use \"herbal formulation\" unless every ingredient qualifies."}
];
