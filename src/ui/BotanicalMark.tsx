/**
 * A generic, hand-drawn line-art botanical motif (branch, leaves, a few berries): the one
 * decorative illustration in the app, used only inside Plate's placeholder while no real,
 * licence-checked photograph exists for a plant (public/plates/). Deliberately not a
 * species-accurate rendering of any specific plant (a claim this session has no botanical
 * authority to make); it reads as an illustrative mark, not an attempt at a photograph, so it
 * does not fake the real photography Plate otherwise requires. Single color via currentColor,
 * so it follows whatever text color its container sets in both themes.
 */
export default function BotanicalMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" fill="none" className={className} aria-hidden="true">
      <path d="M70 246 C 96 198, 104 156, 132 118 C 156 84, 190 60, 232 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M104 172 C 82 162, 66 140, 71 113 C 98 122, 116 144, 104 172 Z" fill="currentColor" opacity="0.22" />
      <path d="M132 122 C 155 103, 163 76, 152 49 C 125 62, 110 92, 132 122 Z" fill="currentColor" opacity="0.3" />
      <path d="M154 98 C 180 90, 200 69, 201 41 C 174 42, 151 63, 154 98 Z" fill="currentColor" opacity="0.18" />
      <path d="M118 154 C 94 151, 73 163, 65 188 C 92 195, 115 180, 118 154 Z" fill="currentColor" opacity="0.28" />
      <path d="M180 68 C 204 57, 218 33, 213 7 C 188 14, 171 37, 180 68 Z" fill="currentColor" opacity="0.4" />
      <circle cx="226" cy="36" r="5.5" fill="currentColor" opacity="0.5" />
      <circle cx="243" cy="49" r="4.5" fill="currentColor" opacity="0.4" />
      <circle cx="215" cy="53" r="4" fill="currentColor" opacity="0.32" />
    </svg>
  );
}
