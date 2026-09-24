import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  House, ChatCircleText, FlowArrow, MagnifyingGlass, Megaphone,
  BookBookmark, ShieldCheck, MapTrifold, Sun, Moon,
} from "@phosphor-icons/react";
import { useApp, type Screen } from "./state/store";
import { useSession } from "./state/session";
import { useT, type Lang } from "./i18n/useT";
import Overview from "./screens/Overview";
import Ask from "./screens/Ask";
import Classify from "./screens/Classify";
import PriorArt from "./screens/PriorArt";
import ClaimCheck from "./screens/ClaimCheck";
import Sources from "./screens/Sources";
import Trust from "./screens/Trust";
import Blueprint from "./screens/Blueprint";
import SourceDrawer from "./components/SourceDrawer";

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "हि" },
  { value: "te", label: "తె" },
];

const NAV: { key: Screen; icon: typeof House }[] = [
  { key: "overview", icon: House },
  { key: "ask", icon: ChatCircleText },
  { key: "classify", icon: FlowArrow },
  { key: "tk", icon: MagnifyingGlass },
  { key: "claims", icon: Megaphone },
  { key: "sources", icon: BookBookmark },
  { key: "trust", icon: ShieldCheck },
  { key: "blueprint", icon: MapTrifold },
];

const SCREENS: Record<Screen, React.ComponentType> = {
  overview: Overview, ask: Ask, classify: Classify, tk: PriorArt,
  claims: ClaimCheck, sources: Sources, trust: Trust, blueprint: Blueprint,
};

export default function App() {
  const { screen, go } = useApp();
  const { lang, setLang, theme, toggleTheme } = useSession();
  const t = useT();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [screen]);

  const Active = SCREENS[screen];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => go("overview")}
            className="flex items-center gap-2 rounded-md pr-2 text-[17px] font-bold tracking-tight text-ink transition-transform active:scale-[0.98]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand text-white text-[13px] font-extrabold">
              IPS
            </span>
            <span className="hidden sm:inline">IP-SAKTI</span>
          </button>

          <nav className="ml-1 hidden flex-1 items-center gap-1 overflow-x-auto lg:flex" aria-label="Primary">
            {NAV.map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => go(key)}
                aria-current={screen === key ? "page" : undefined}
                className={`group flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13.5px] font-medium transition-colors ${
                  screen === key ? "bg-brand-soft text-brand-strong" : "text-ink-2 hover:bg-sunk hover:text-ink"
                }`}
              >
                <Icon size={16} weight={screen === key ? "fill" : "regular"} />
                {t(key)}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <div
              role="group"
              aria-label={t("lang")}
              className="flex items-center gap-0.5 rounded-full border border-line bg-surface p-0.5"
            >
              {LANG_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLang(value)}
                  aria-pressed={lang === value}
                  className={`rounded-full px-2 py-1 text-[12.5px] font-semibold transition-colors ${
                    lang === value ? "bg-brand-soft text-brand-strong" : "text-ink-3 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:text-ink"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto border-t border-line px-3 py-1.5 lg:hidden" aria-label="Primary mobile">
          {NAV.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => go(key)}
              aria-current={screen === key ? "page" : undefined}
              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[12.5px] font-medium ${
                screen === key ? "bg-brand-soft text-brand-strong" : "text-ink-2"
              }`}
            >
              <Icon size={14} weight={screen === key ? "fill" : "regular"} />
              {t(key)}
            </button>
          ))}
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="relative flex-1 outline-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <Active />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-line px-4 py-5 text-center text-[12.5px] text-ink-3 sm:px-6">
        {t("disc")}
      </footer>
      <SourceDrawer />
    </div>
  );
}
