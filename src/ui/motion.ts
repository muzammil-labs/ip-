import { useReducedMotion } from "motion/react";
import type { Transition, Variants } from "motion/react";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

/** A line or bar draws in (scaleX or pathLength 0 to 1). 480ms, ease [0.16, 1, 0.3, 1]. */
export const thread: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.48, ease: EASE } },
};

/** Same draw-in as `thread`, but for an SVG line/path (pathLength 0 to 1) instead of a scaleX bar. */
export const threadPath: Variants = {
  hidden: { pathLength: 0 },
  visible: { pathLength: 1, transition: { duration: 0.48, ease: EASE } },
};

/** A seal, cite chip or finding appearing when evidence is verified. Spring 420/28. */
export const stamp: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 420, damping: 28 } },
};

/** Background fades from haldi-wash to transparent. Rows that changed after a what-if or time-machine move. 1400ms linear. */
export const shift: Variants = {
  changed: {
    backgroundColor: ["var(--haldi-wash)", "rgba(0,0,0,0)"],
    transition: { duration: 1.4, ease: "linear" },
  },
  idle: { backgroundColor: "rgba(0,0,0,0)" },
};

/** True when motion should actually run: false under prefers-reduced-motion. */
export function useMotionOK(): boolean {
  return !useReducedMotion();
}
