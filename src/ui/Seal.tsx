import { motion } from "motion/react";
import { stamp, useMotionOK } from "./motion";

export type SealSize = 16 | 24 | 32 | 48;
export type SealVariant = "outline" | "filled" | "number";

export interface SealProps {
  size?: SealSize;
  variant?: SealVariant;
  /** 1 to 7, shown instead of the § glyph when variant is "number". */
  number?: number;
  animate?: boolean;
  className?: string;
}

/**
 * The product's one custom mark: concentric circles with a § glyph (or a chapter number).
 * Used as the logo, chapter numbers, evidence seals and the dossier stamp. No other
 * hand-drawn SVG is used anywhere in the app.
 */
export default function Seal({ size = 24, variant = "outline", number, animate = false, className = "" }: SealProps) {
  const motionOK = useMotionOK();
  const filled = variant === "filled";
  const ring = filled ? "var(--on-neem)" : "var(--neem)";
  const bg = filled ? "var(--neem)" : "none";
  const glyphColor = filled ? "var(--on-neem)" : "var(--neem)";
  const glyph = variant === "number" && number ? String(number) : "§";
  const fontSize = size * (glyph.length > 1 ? 0.34 : 0.42);

  const svg = (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-hidden="true" className={className}>
      <circle cx="24" cy="24" r="22" fill={bg} stroke={ring} strokeWidth="2" />
      <circle cx="24" cy="24" r="16" fill="none" stroke={ring} strokeWidth="1.25" opacity="0.55" />
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font)"
        fontWeight={700}
        fontSize={fontSize * (48 / size)}
        fill={glyphColor}
      >
        {glyph}
      </text>
    </svg>
  );

  if (!animate) return svg;

  return (
    <motion.span
      initial={motionOK ? "hidden" : false}
      animate="visible"
      variants={stamp}
      style={{ display: "inline-flex" }}
    >
      {svg}
    </motion.span>
  );
}
