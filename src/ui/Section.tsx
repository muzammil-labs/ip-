import type { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUp, useMotionOK } from "./motion";

export interface SectionProps {
  title: string;
  lede?: string;
  children?: ReactNode;
}

/** h2 plus optional body-lg lede plus children. No eyebrow. Vertical rhythm: 64px desktop / 48px mobile between sections.
 * Fades up once as it enters the viewport (every page built from Section gets this for free); collapses to a
 * plain, static <section> under prefers-reduced-motion. */
export default function Section({ title, lede, children }: SectionProps) {
  const motionOK = useMotionOK();
  return (
    <motion.section
      className="py-12 sm:py-16"
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
