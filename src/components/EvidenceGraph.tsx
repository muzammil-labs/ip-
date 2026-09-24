import { motion, useReducedMotion } from "motion/react";

const NODES = [
  { id: "patents", label: "Patents Act", x: 40, y: 40, tier: "brand" },
  { id: "tkdl", label: "TKDL", x: 260, y: 24, tier: "turmeric" },
  { id: "abs", label: "ABS · NBA", x: 34, y: 190, tier: "brand" },
  { id: "treaties", label: "Treaties", x: 262, y: 196, tier: "focus" },
  { id: "core", label: "IP-SAKTI", x: 150, y: 112, tier: "core" },
] as const;

const EDGES: [string, string][] = [
  ["patents", "core"],
  ["tkdl", "core"],
  ["abs", "core"],
  ["treaties", "core"],
];

const COLORS: Record<string, string> = {
  brand: "var(--brand)",
  turmeric: "var(--turmeric)",
  focus: "var(--focus)",
  core: "var(--brand-strong)",
};

/** A small decorative diagram: four evidence sources flowing into the answer engine. Motivation: shows, at a glance, that answers are assembled from separate cited bodies of law rather than one blended source. */
export default function EvidenceGraph() {
  const reduce = useReducedMotion();
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" role="img" aria-label="Diagram: Patents Act, TKDL, ABS and treaties flowing into IP-SAKTI">
      <defs>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {EDGES.map(([from, to], i) => {
        const a = byId[from];
        const b = byId[to];
        return (
          <motion.line
            key={from + to}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={COLORS[a.tier]}
            strokeWidth={1.6}
            strokeDasharray="5 5"
            strokeLinecap="round"
            initial={reduce ? undefined : { strokeDashoffset: 0, opacity: 0 }}
            animate={reduce ? { opacity: 0.55 } : { strokeDashoffset: [0, -20], opacity: 0.55 }}
            transition={reduce ? { duration: 0 } : { strokeDashoffset: { duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.15 }, opacity: { duration: 0.6, delay: 0.2 + i * 0.1 } }}
          />
        );
      })}

      <circle cx={byId.core.x} cy={byId.core.y} r="46" fill="url(#coreGlow)" />

      {NODES.map((n, i) => (
        <motion.g
          key={n.id}
          initial={reduce ? undefined : { opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <circle cx={n.x} cy={n.y} r={n.id === "core" ? 30 : 22} fill={n.id === "core" ? "var(--surface)" : "var(--surface)"} stroke={COLORS[n.tier]} strokeWidth={n.id === "core" ? 2.5 : 1.75} />
          <text x={n.x} y={n.y + (n.id === "core" ? 46 : 38)} textAnchor="middle" fontSize="10.5" fontWeight={n.id === "core" ? 700 : 600} fill="var(--ink-2)">
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
