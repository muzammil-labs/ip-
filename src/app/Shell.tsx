import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Suspense, lazy, useEffect, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import TopBar from "./TopBar";
import ClauseSheet from "../panels/ClauseSheet";
import ApiInspector from "./ApiInspector";
import PresenterMode from "./PresenterMode";
import Sahayak from "../panels/Sahayak";
import LeafFall from "../ui/LeafFall";
import { useT } from "../i18n/useT";
import { useCoverage } from "../state/coverage";

// Lazy: pulls in Radix (Tooltip), and only ever renders in presenter mode, off the main bundle.
const CoverageBar = lazy(() => import("../panels/CoverageBar"));

const FOOTER_NAV: { href: string; labelKey: string }[] = [
  { href: "/", labelKey: "navHome" },
  { href: "/case/describe", labelKey: "navCase" },
  { href: "/library", labelKey: "navLibrary" },
  { href: "/how", labelKey: "navHow" },
];

/**
 * The outer chrome for every page: header, main column and the footer disclaimer,
 * which is always visible and never covered. The chapter rail (C9) is Case-only and
 * does not exist yet (Phase 3), so every screen currently uses the plain shell.
 *
 * Screens keep their own internal width classes for now (Overview's 1400px hero,
 * Ask's 1000px column, and so on); Shell does not additionally constrain width here.
 * Migrating every screen onto the --w-main / --w-shell system is Phase 4 work, done
 * screen by screen as each one is rebuilt to the new design (see docs/plan/QUESTIONS.md).
 */
export default function Shell({ children }: { children: ReactNode }) {
  const t = useT();
  const reduce = useReducedMotion();
  const [location] = useLocation();
  const { mark } = useCoverage();

  useEffect(() => {
    mark(13); // standing "information, not legal advice" disclaimer, fixed on every screen
  }, [mark]);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas text-ink-2">
      <TopBar />
      <Suspense fallback={null}>
        <CoverageBar />
      </Suspense>

      <main id="main" tabIndex={-1} className="relative flex-1 outline-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-line px-4 py-8 sm:px-6 print:hidden">
        <div className="mx-auto flex max-w-[var(--w-shell)] flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-h3 font-bold tracking-tight text-ink">
              <span className="flex h-8 w-8 items-center justify-center rounded-control bg-neem text-on-neem text-small font-extrabold">
                IPS
              </span>
              IP-SAKTI
            </Link>
            <p className="mt-1 text-small text-ink-3">{t("tagline")}</p>
          </div>
          <nav aria-label={t("navHome")} className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-small sm:justify-start">
            {FOOTER_NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-ink-2 hover:text-ink">
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <p className="text-small text-ink-3">{t("footerPs")}</p>
        </div>
        <p className="mt-6 border-t border-line pt-6 text-center text-small text-ink-3">{t("disc")}</p>
      </footer>
      <ClauseSheet />
      <ApiInspector />
      <PresenterMode />
      <Sahayak />
      <LeafFall />
    </div>
  );
}
