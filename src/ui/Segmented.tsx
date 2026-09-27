import { useRef } from "react";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}

/** Arrow keys move the selection between segments; Home/End jump to the first/last. */
export default function Segmented<T extends string>({ options, value, onChange, label }: SegmentedProps<T>) {
  const ref = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent) {
    const ix = options.findIndex((o) => o.value === value);
    if (ix < 0) return;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (ix + 1) % options.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (ix - 1 + options.length) % options.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = options.length - 1;
    if (next >= 0) {
      e.preventDefault();
      onChange(options[next].value);
      const btn = ref.current?.querySelectorAll("button")[next] as HTMLButtonElement | undefined;
      btn?.focus();
    }
  }

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="inline-flex items-center gap-0.5 rounded-control border border-line bg-wash p-0.5"
    >
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={`rounded-control px-3 py-1.5 text-small font-medium transition-colors ${
              selected ? "bg-surface text-ink shadow-1" : "text-ink-2 hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
