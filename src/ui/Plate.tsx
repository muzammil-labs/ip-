import { useRef, type PointerEvent } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import BotanicalMark from "./BotanicalMark";
import { useMotionOK } from "./motion";
import { useT } from "../i18n/useT";

export interface PlateProps {
  /** public/plates path without size suffix or extension, e.g. "ashwagandha" for ashwagandha-480.webp etc. */
  slug?: string;
  /** Botanical name (rendered in italic) and common names. */
  botanicalName: string;
  commonNames?: string;
  creditHref?: string;
  /** Shorter 16:9 tile for dense grids (placeholder only). */
  compact?: boolean;
  /** Varies the placeholder mark's orientation so neighbouring tiles in a grid don't repeat. */
  markVariant?: number;
  /** UI-9.18: the Home hero's single sprig only, never example-card tiles (Section 0 amendment
   * A3's "one slow ambient loop"). A gentle sway plus desktop pointer parallax. */
  living?: boolean;
}

const MARK_VARIANTS = ["", "-scale-x-100", "rotate-6", "-scale-x-100 -rotate-6"];

/** UI-9.18: the sway and parallax wrapper for `living` plates. Pauses off-screen and under
 * reduced motion; parallax only responds to a real mouse (not touch), never via useState. */
function LivingMark({ className }: { className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const motionOK = useMotionOK();
  const inView = useInView(ref, { amount: 0.3 });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 120, damping: 20 });
  const y = useSpring(my, { stiffness: 120, damping: 20 });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!motionOK || e.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((-(e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 6);
    my.set((-(e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 6);
  }
  function handlePointerLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, transformOrigin: "50% 85%" }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      animate={motionOK && inView ? { rotate: [-1.5, 1.5] } : { rotate: 0 }}
      transition={
        motionOK && inView
          ? { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          : { duration: 0 }
      }
    >
      <BotanicalMark className="h-full w-full" />
    </motion.div>
  );
}

/**
 * A botanical plate: real, licence-checked photography only (C6), duotone-treated via
 * the .plate CSS class (Appendix D). Until a slug's images exist in public/plates/, this
 * renders a designed placeholder (tinted tile, leaf mark, the botanical name) rather than
 * the generic dashed "no content" EmptyState: a decorative image slot on a marketing
 * surface (Home) reads as broken when it borrows the same treatment used for genuine
 * empty data elsewhere in the app, even though neither fakes a photograph.
 */
export default function Plate({ slug, botanicalName, commonNames, creditHref, compact = false, markVariant = 0, living = false }: PlateProps) {
  const t = useT();
  if (!slug) {
    const markClassName = `absolute inset-0 h-full w-full ${compact ? "p-5" : "p-8"} text-neem-strong/45 ${MARK_VARIANTS[markVariant % MARK_VARIANTS.length]}`;
    return (
      <div
        className={`relative flex ${compact ? "aspect-[16/9]" : "aspect-[4/3]"} w-full items-end overflow-hidden rounded-container border border-line bg-neem-wash`}
      >
        {living ? <LivingMark className={markClassName} /> : <BotanicalMark className={markClassName} />}
        <div className="relative z-10 w-full bg-gradient-to-t from-neem-wash from-40% to-transparent px-5 pb-3 pt-8 text-center">
          <p className="text-small font-semibold italic text-neem-strong">{botanicalName}</p>
        </div>
      </div>
    );
  }

  return (
    <figure>
      <div className="plate aspect-[4/3] w-full">
        <img
          src={`/plates/${slug}-960.webp`}
          srcSet={`/plates/${slug}-480.webp 480w, /plates/${slug}-960.webp 960w, /plates/${slug}-1440.webp 1440w`}
          sizes="(min-width: 1024px) 480px, 100vw"
          alt={botanicalName}
          loading="lazy"
          width={960}
          height={720}
        />
      </div>
      <figcaption className="mt-2 text-small text-ink-3">
        <span className="italic">{botanicalName}</span>
        {commonNames && <>, {commonNames}</>}
        {creditHref && (
          <>
            {" · "}
            <a href={creditHref} target="_blank" rel="noopener" className="underline hover:text-ink-2">
              {t("plateCredit")}
            </a>
          </>
        )}
      </figcaption>
    </figure>
  );
}
