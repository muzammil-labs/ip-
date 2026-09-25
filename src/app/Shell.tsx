import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";
import TopBar from "./TopBar";
import SourceDrawer from "../components/SourceDrawer";
import { useT } from "../i18n/useT";

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

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas text-ink-2">
      <TopBar />

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

      <footer className="border-t border-line px-4 py-5 text-center text-small text-ink-3 sm:px-6">
        {t("disc")}
      </footer>
      <SourceDrawer />
    </div>
  );
}
