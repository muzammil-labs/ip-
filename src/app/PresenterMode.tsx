import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSession } from "../state/session";
import { useCase } from "../state/case";
import { useT } from "../i18n/useT";
import { ashwaExtractExample } from "../data/examples";
import { LAYER } from "../ui/layers";
import type { Lang } from "../i18n/useT";

/** The demo's own screen sequence (FINALS-STRATEGY.md §12), one route per beat. */
const STEPS = ["/", "/case/describe", "/case/classify", "/case/owe", "/case/say", "/ask?mode=kisan", "/case/dossier", "/dossier/print", "/how"];
const LANG_CYCLE: Lang[] = ["en", "hi", "te"];

/**
 * UI-7.2: `?present=1` (a real top-level query param, read once from window.location.search since
 * wouter's own useSearch() here reads the in-hash search per src/lib/hashLocation.ts) turns on
 * presenter mode for the session. While on: base type is one step larger everywhere (global.css's
 * [data-presenter] block, tokens only), a step counter shows bottom-left, and keyboard shortcuts
 * drive the demo: -> next step, R reset to the seeded example case, D toggle the API inspector
 * (ApiInspector.tsx's own listener, already gated on session.presenter), L cycle language.
 */
export default function PresenterMode() {
  const { presenter, setPresenter, lang, setLang } = useSession();
  const { dispatch } = useCase();
  const [, navigate] = useLocation();
  const t = useT();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("present") === "1") setPresenter(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-presenter", String(presenter));
  }, [presenter]);

  useEffect(() => {
    if (!presenter) return;
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") {
        setStep((s) => {
          const next = Math.min(s + 1, STEPS.length - 1);
          navigate(STEPS[next]);
          return next;
        });
      } else if (e.key.toLowerCase() === "r") {
        dispatch({ type: "loadExample", example: ashwaExtractExample() });
      } else if (e.key.toLowerCase() === "l") {
        setLang(LANG_CYCLE[(LANG_CYCLE.indexOf(lang) + 1) % LANG_CYCLE.length]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presenter, navigate, dispatch, lang, setLang]);

  if (!presenter) return null;

  return (
    <div
      className="fixed bottom-4 left-4 rounded-pill border border-line bg-surface px-3 py-1.5 text-small font-semibold text-ink shadow-2 print:hidden"
      style={{ zIndex: LAYER.toast }}
      role="status"
    >
      {t("presenterStepLabel").replace("{n}", String(step + 1)).replace("{total}", String(STEPS.length))}
    </div>
  );
}
