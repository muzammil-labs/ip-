import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "wouter";
import {
  House, FlowArrow, BookBookmark, Question, Sun, Moon, List, X,
} from "@phosphor-icons/react";
import { useSession } from "../state/session";
import { useT, type Lang } from "../i18n/useT";
import { LAYER } from "../ui/layers";

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "hi", label: "हि" },
  { value: "te", label: "తె" },
];

/** The four B2 destinations. Case links to the first chapter; the router redirects an unknown or missing chapter slug there too. */
const NAV: { href: string; labelKey: string; icon: typeof House; match: (loc: string) => boolean }[] = [
  { href: "/", labelKey: "navHome", icon: House, match: (loc) => loc === "/" },
  { href: "/case/describe", labelKey: "navCase", icon: FlowArrow, match: (loc) => loc.startsWith("/case/") },
  { href: "/library", labelKey: "navLibrary", icon: BookBookmark, match: (loc) => loc.startsWith("/library") },
  { href: "/how", labelKey: "navHow", icon: Question, match: (loc) => loc === "/how" },
];

function LangControl() {
  const { lang, setLang } = useSession();
  const t = useT();
  return (
    <div role="group" aria-label={t("lang")} className="flex items-center gap-0.5 rounded-pill border border-line bg-surface p-0.5">
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

function Seal() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-control pr-2 text-h3 font-bold tracking-tight text-ink transition-transform active:scale-[0.98]"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-control bg-neem text-on-neem text-small font-extrabold">
        IPS
      </span>
      <span className="hidden sm:inline">IP-SAKTI</span>
    </Link>
  );
}

export default function TopBar() {
  const [location] = useLocation();
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 border-b border-line bg-canvas/90 backdrop-blur-md"
      style={{ zIndex: LAYER.header }}
    >
      {/* Desktop: single line, 64px */}
      <div className="mx-auto hidden h-16 max-w-[var(--w-shell)] items-center gap-3 px-6 lg:flex">
        <Seal />

        <nav className="ml-1 flex flex-1 items-center gap-1 overflow-x-auto" aria-label="Primary">
          {NAV.map(({ href, labelKey, icon: Icon, match }) => {
            const active = match(location);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-pill px-3 py-1.5 text-small font-medium transition-colors ${
                  active ? "bg-neem-wash text-neem-strong" : "text-ink-2 hover:bg-wash hover:text-ink"
                }`}
              >
                <Icon size={16} weight={active ? "fill" : "regular"} />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LangControl />
          <ThemeToggle />
          <Link
            href="/case/describe"
            className="whitespace-nowrap rounded-pill bg-neem px-4 py-2 text-small font-semibold text-on-neem shadow-1 transition-transform active:scale-[0.98]"
          >
            {t("startCase")}
          </Link>
        </div>
      </div>

      {/* Mobile: single line, 56px, destinations behind a menu sheet */}
      <div className="flex h-14 items-center gap-2 px-4 lg:hidden">
        <Seal />
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <LangControl />
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
                {NAV.map(({ href, labelKey, icon: Icon, match }) => {
                  const active = match(location);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 rounded-control px-3 py-2.5 text-body font-medium ${
                        active ? "bg-neem-wash text-neem-strong" : "text-ink-2"
                      }`}
                    >
                      <Icon size={18} weight={active ? "fill" : "regular"} />
                      {t(labelKey)}
                    </Link>
                  );
                })}
                <Link
                  href="/case/describe"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 rounded-pill bg-neem px-4 py-2.5 text-center text-small font-semibold text-on-neem"
                >
                  {t("startCase")}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
