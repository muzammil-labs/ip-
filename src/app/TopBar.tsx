import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  House, ChatCircleText, FlowArrow, MagnifyingGlass, Megaphone,
  BookBookmark, ShieldCheck, MapTrifold, Sun, Moon, List, X,
} from "@phosphor-icons/react";
import { useApp, type Screen } from "../state/store";
import { useSession } from "../state/session";
import { useT, type Lang } from "../i18n/useT";
import { LAYER } from "../ui/layers";

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "हि" },
  { value: "te", label: "తె" },
];

/**
 * The final IA (Home, Case, Library, How it works per Appendix B2) is built in Phase 3
 * and 4. Until then this bar keeps the current eight screens reachable, restyled to the
 * C9 shell spec (single line, 64px desktop / 56px mobile, right-side language and theme
 * controls, a primary "Start a case" action). See docs/plan/QUESTIONS.md.
 */
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

function LangControl({ compact }: { compact?: boolean }) {
  const { lang, setLang } = useSession();
  const t = useT();
  return (
    <div
      role="group"
      aria-label={t("lang")}
      className={`flex items-center gap-0.5 rounded-pill border border-line bg-surface p-0.5 ${compact ? "" : ""}`}
    >
      {LANG_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLang(value)}
          aria-pressed={lang === value}
          className={`rounded-pill px-2 py-1 text-small font-semibold transition-colors ${
            lang === value ? "bg-neem-wash text-neem-strong" : "text-ink-3 hover:text-ink"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useSession();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-line bg-surface text-ink-2 transition-colors hover:text-ink"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}

function Seal({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 rounded-control pr-2 text-h3 font-bold tracking-tight text-ink transition-transform active:scale-[0.98]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-control bg-neem text-on-neem text-small font-extrabold">
        IPS
      </span>
      <span className="hidden sm:inline">IP-SAKTI</span>
    </button>
  );
}

export default function TopBar() {
  const { screen, go } = useApp();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  function goTo(key: Screen) {
    go(key);
    setMenuOpen(false);
  }

  return (
    <header
      className="sticky top-0 border-b border-line bg-canvas/90 backdrop-blur-md"
      style={{ zIndex: LAYER.header }}
    >
      {/* Desktop: single line, 64px */}
      <div className="mx-auto hidden h-16 max-w-[var(--w-shell)] items-center gap-3 px-6 lg:flex">
        <Seal onClick={() => go("overview")} />

        <nav className="ml-1 flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Primary">
          {NAV.map(({ key, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => go(key)}
              aria-current={screen === key ? "page" : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-pill px-3 py-1.5 text-small font-medium transition-colors ${
                screen === key ? "bg-neem-wash text-neem-strong" : "text-ink-2 hover:bg-wash hover:text-ink"
              }`}
            >
              <Icon size={16} weight={screen === key ? "fill" : "regular"} />
              {t(key)}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LangControl />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => go("classify")}
            className="whitespace-nowrap rounded-pill bg-neem px-4 py-2 text-small font-semibold text-on-neem shadow-1 transition-transform active:scale-[0.98]"
          >
            {t("startCase")}
          </button>
        </div>
      </div>

      {/* Mobile: single line, 56px, destinations behind a menu sheet */}
      <div className="flex h-14 items-center gap-2 px-4 lg:hidden">
        <Seal onClick={() => goTo("overview")} />
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LangControl compact />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={t("menuAria")}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-pill border border-line bg-surface text-ink-2"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-ink/30 backdrop-blur-[2px] lg:hidden"
              style={{ zIndex: LAYER.sheet }}
              aria-hidden="true"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 top-0 max-h-[85dvh] overflow-y-auto rounded-b-container bg-surface p-4 shadow-2 lg:hidden"
              style={{ zIndex: LAYER.sheet }}
            >
              <div className="flex items-center justify-between px-2 pb-2">
                <span className="text-small font-semibold text-ink-3">{t("menuAria")}</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t("closeAria")}
                  className="flex h-9 w-9 items-center justify-center rounded-control text-ink-2 hover:bg-wash"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Primary mobile">
                {NAV.map(({ key, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => goTo(key)}
                    aria-current={screen === key ? "page" : undefined}
                    className={`flex items-center gap-2.5 rounded-control px-3 py-2.5 text-body font-medium ${
                      screen === key ? "bg-neem-wash text-neem-strong" : "text-ink-2"
                    }`}
                  >
                    <Icon size={18} weight={screen === key ? "fill" : "regular"} />
                    {t(key)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => goTo("classify")}
                  className="mt-2 rounded-pill bg-neem px-4 py-2.5 text-center text-small font-semibold text-on-neem"
                >
                  {t("startCase")}
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
