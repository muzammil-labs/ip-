import { motion } from "motion/react";
import { sprout, useMotionOK } from "./motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export interface VineRailProps {
  /** Total number of chapter rows the rail spans. */
  total: number;
  /** Index (0-based) of the current chapter, drives how far the stem has grown. */
  currentIx: number;
  /** Which chapters (by index) are done and get a leaf. Never includes the last (dossier, its own
   * stamp moment is UI-9.16, not a rail leaf). */
  doneIx: number[];
}

const LEAF = "M0 0 C 5 -9, 19 -11, 30 -2 C 20 6, 6 7, 0 0 Z";

function rowCenterY(ix: number, total: number): number {
  // Matches the row spacing the rail's own <li> list produces closely enough for a decorative
  // stem: evenly spaced from just past the top to just before the bottom of the 0-100 viewBox.
  return total <= 1 ? 50 : (ix / (total - 1)) * 100;
}

/**
 * The chapter rail's progress line, replacing a straight bar with a gently wavy stem: the tasteful
 * version of "vines" (see docs/plan/UI-POLISH-PLAN.md UI-9.13). A leaf sprouts beside each chapter
 * the moment its status flips to done, alternating sides; the current chapter gets a closed bud.
 * No thorns. Purely decorative: aria-hidden, and the rail's own StatusChips remain the real,
 * accessible status text.
 */
export default function VineRail({ total, currentIx, doneIx }: VineRailProps) {
  const motionOK = useMotionOK();
  const progress = total <= 1 ? 1 : currentIx / (total - 1);

  // A single gentle wave per row, amplitude 3 viewBox units either side of the centre line (x=12).
  const points: [number, number][] = [];
  const steps = Math.max(total * 6, 12);
  for (let i = 0; i <= steps; i++) {
    const y = (i / steps) * 100;
    const x = 12 + Math.sin((y / 100) * Math.PI * (total - 1)) * 3;
    points.push([x, y]);
  }
  const stemPath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");

  return (
    <div className="absolute left-1 top-4 bottom-4 w-6" aria-hidden="true">
      <svg viewBox="0 0 24 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <path d={stemPath} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-line" vectorEffect="non-scaling-stroke" />
        <motion.path
          d={stemPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-neem"
          vectorEffect="non-scaling-stroke"
          initial={motionOK ? { pathLength: 0 } : false}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.48, ease: EASE }}
        />
      </svg>

      {doneIx.map((ix) => {
        const side = ix % 2 === 0 ? 1 : -1;
        const y = rowCenterY(ix, total);
        return (
          <motion.svg
            key={ix}
            viewBox="0 0 30 12"
            className="absolute h-3 w-[30px] text-leaf"
            style={{
              top: `${y}%`,
              left: side > 0 ? "calc(50% + 2px)" : undefined,
              right: side < 0 ? "calc(50% + 2px)" : undefined,
              transform: `translateY(-50%) ${side < 0 ? "scaleX(-1)" : ""}`,
            }}
            initial={motionOK ? "hidden" : false}
            animate="visible"
            variants={sprout}
          >
            <path d={LEAF} fill="currentColor" />
          </motion.svg>
        );
      })}

      <span
        className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-pill bg-neem"
        style={{ top: `${rowCenterY(currentIx, total)}%`, left: "50%" }}
      />
    </div>
  );
}
