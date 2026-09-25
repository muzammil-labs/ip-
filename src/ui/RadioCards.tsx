import type { ReactNode } from "react";

export interface RadioCardOption<T extends string> {
  value: T;
  title: string;
  description: string;
  icon?: ReactNode;
}

export interface RadioCardsProps<T extends string> {
  options: RadioCardOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  label: string;
  /** "lg" renders larger icon-led cards, one per row on mobile, for low-literacy / touch-first flows (Kisan mode). */
  size?: "md" | "lg";
}

export default function RadioCards<T extends string>({ options, value, onChange, label, size = "md" }: RadioCardsProps<T>) {
  function onKeyDown(e: React.KeyboardEvent, ix: number) {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (ix + 1) % options.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (ix - 1 + options.length) % options.length;
    if (next >= 0) {
      e.preventDefault();
      onChange(options[next].value);
    }
  }

  const hasIcons = options.some((o) => o.icon);

  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-3 sm:grid-cols-2 ${size === "lg" ? "gap-4" : ""}`}>
      {options.map((o, ix) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!value && ix === 0) ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, ix)}
            onClick={() => onChange(o.value)}
            className={`flex text-left transition-colors ${size === "lg" ? "items-center gap-4 rounded-container border-2 px-5 py-5" : "flex-col gap-1 rounded-container border-2 px-4 py-3.5"} ${
              selected ? "border-neem bg-neem-wash" : "border-line bg-surface hover:border-line-strong"
            }`}
          >
            {hasIcons && (
              <span className={`flex shrink-0 items-center justify-center rounded-pill bg-surface text-neem-strong ${size === "lg" ? "h-14 w-14" : "h-9 w-9"}`} aria-hidden="true">
                {o.icon}
              </span>
            )}
            <span className="flex flex-col gap-1">
              <span className={size === "lg" ? "text-h3 font-semibold text-ink" : "text-body font-semibold text-ink"}>{o.title}</span>
              <span className={size === "lg" ? "text-body text-ink-2" : "text-small text-ink-2"}>{o.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
