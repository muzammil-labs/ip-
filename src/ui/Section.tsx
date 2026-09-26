import type { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUp, useMotionOK } from "./motion";

export interface SectionProps {
  title: string;
  lede?: string;
  /** Anchor id for in-page navigation (e.g. How it works' section sidebar, UI-9.10). Optional: most
   * pages have nothing to link to a Section directly. */
  id?: string;
  children?: ReactNode;
}

/** h2 plus optional body-lg lede plus children. No eyebrow. Vertical rhythm (C4): 96px desktop / 64px
 * mobile between stacked sections (each section contributes half on its own top and bottom).
 * Fades up once as it enters the viewport (every page built from Section gets this for free); collapses to a
 * plain, static <section> under prefers-reduced-motion. */
export default function Section({ title, lede, id, children }: SectionProps) {
  const motionOK = useMotionOK();
  return (
    <motion.section
      id={id}
      className="scroll-mt-24 py-8 sm:py-12"
      initial={motionOK ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
    >
      <h2 className="text-h2 text-ink">{title}</h2>
      {lede && <p className="mt-2 text-body-lg text-ink-2">{lede}</p>}
      {children && <div className="mt-6">{children}</div>}
    </motion.section>
  );
}
