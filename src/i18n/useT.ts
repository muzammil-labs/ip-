import { useSession } from "../state/session";
import { en } from "./en";
import { hi } from "./hi";
import { te } from "./te";

export type Lang = "en" | "hi" | "te";

const DICTS: Record<Lang, Record<string, string>> = { en, hi, te };

export function translate(lang: Lang, key: string): string {
  return DICTS[lang]?.[key] || en[key] || key;
}

/** Reads the current language from session state and returns a t(key) function that falls back to English, then to the key itself. */
export function useT() {
  const { lang } = useSession();
  return (key: string) => translate(lang, key);
}
