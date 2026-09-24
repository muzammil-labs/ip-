import type { ClaimRule } from "./claimRules";

export const CAT_RULES: Record<string, ClaimRule> = {
 aahara:{re:/\b(treats?|heals?|remedy|medicine|therapeutic|helps\s+reduce)\b/gi,lvl:"bad",why:()=>"Ayurveda Aahara products may not claim to treat or cure disease.",cite:"fssai-aa",fix:"Use food-appropriate wording, e.g. \"prepared per Ayurvedic tradition\"."},
 cosmetic:{re:/\b(treats?|heals?|remedy|medicine|therapeutic|helps\s+reduce)\b/gi,lvl:"bad",why:()=>"A therapeutic claim makes this a drug, not a cosmetic.",cite:"cos-2020",fix:"Limit to cleansing, beautifying or appearance claims."}
};
