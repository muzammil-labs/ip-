import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useSession } from "../state/session";
import { useMotionOK } from "./motion";
import { LEAF_PATH } from "./VineRail";
import { LAYER } from "./layers";

interface FallingLeaf {
  id: string;
  xPct: number;
  dropPct: number;
  duration: number;
  delay: number;
  rotateTo: number;
  swaySign: 1 | -1;
  tone: "text-leaf" | "text-leaf-2";
}

function makeLeaves(): FallingLeaf[] {
  const count = window.innerWidth < 640 ? 4 : 7;
  const leafTwoCount = window.innerWidth < 640 ? 1 : 2;
  return Array.from({ length: count }, (_, i) => ({
    id: `${Date.now()}-${i}`,
    xPct: 5 + Math.random() * 60, // start x across the top 60% of the width
    dropPct: 55 + Math.random() * 20,
    duration: 1.6 + Math.random() * 0.6,
    delay: Math.random() * 0.3,
    rotateTo: 120 + Math.random() * 160,
    swaySign: i % 2 === 0 ? 1 : -1,
    tone: i < count - leafTwoCount ? "text-leaf" : "text-leaf-2",
  }));
}

/**
 * A burst of leaves falling across the viewport, once, on a real moment of progress: a chapter's
 * status flipping to done (triggered from ChapterRail), or the dossier completing (UI-9.16). Not on
 * every navigation (see docs/plan/UI-POLISH-PLAN.md UI-9.14): that would fire ~15 times in a five-
 * minute demo and read as a screensaver. `session.celebrate(key)` is the only trigger, and it fires
 * at most once per key per session, so this component never re-plays for the same event.
 */
export default function LeafFall() {
  const { celebration } = useSession();
  const motionOK = useMotionOK();
  const [leaves, setLeaves] = useState<FallingLeaf[]>([]);

  useEffect(() => {
    if (!celebration || !motionOK) return;
    setLeaves(makeLeaves());
    const timeout = setTimeout(() => setLeaves([]), 2800);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [celebration]);

  if (!leaves.length) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: LAYER.header - 1 }} aria-hidden="true">
      <AnimatePresence>
        {leaves.map((l) => (
          <motion.svg
            key={l.id}
            viewBox="0 0 30 12"
            className={`absolute h-4 w-10 ${l.tone}`}
            style={{ left: `${l.xPct}%`, top: 0 }}
            initial={{ y: 0, x: 0, rotate: 0, opacity: 1 }}
            animate={{
              y: `${l.dropPct}vh`,
              x: [0, 24 * l.swaySign, -24 * l.swaySign, 0],
              rotate: l.rotateTo,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: l.duration,
              delay: l.delay,
              ease: "easeIn",
              // A per-value transition override replaces the whole transition for that value, not
              // just the keys given, so duration and delay must be repeated here or opacity falls
              // back to Motion's ~0.3s default tween and the leaf fades out far too early.
              opacity: { duration: l.duration, delay: l.delay, times: [0, 0.7, 1] },
            }}
          >
            <path d={LEAF_PATH} fill="currentColor" />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
