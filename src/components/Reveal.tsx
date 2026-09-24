import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Fade+rise on scroll into view. Canonical Motion whileInView pattern, no scroll listeners. */
export default function Reveal({
  children,
  delay = 0,
  className,
  as: As = "div",
  id,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
  id?: string;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[As];
  return (
    <MotionTag
      id={id}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
