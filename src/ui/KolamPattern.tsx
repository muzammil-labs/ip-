/**
 * UI-9.17: a static kolam/rangoli dot grid, the one cultural-signature texture allowed
 * (Section 0 amendment A5), used only around the edges of the Home hero and the closing
 * CTA band. A radial mask fades it out toward the centre so it never sits under text.
 * Decorative only: aria-hidden, pointer-events-none, currentColor.
 */
export default function KolamPattern({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full text-leaf opacity-[0.12] dark:opacity-10 ${className}`}
    >
      <defs>
        <pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.3" fill="currentColor" />
          <path d="M0 12 A12 12 0 0 1 12 0" stroke="currentColor" strokeWidth="0.75" fill="none" />
          <path d="M24 12 A12 12 0 0 1 12 24" stroke="currentColor" strokeWidth="0.75" fill="none" />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} mask={`url(#${id}-mask)`} />
    </svg>
  );
}
