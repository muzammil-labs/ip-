export interface RadioCardOption<T extends string> {
  value: T;
  title: string;
  description: string;
}

export interface RadioCardsProps<T extends string> {
  options: RadioCardOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  label: string;
}

export default function RadioCards<T extends string>({ options, value, onChange, label }: RadioCardsProps<T>) {
  function onKeyDown(e: React.KeyboardEvent, ix: number) {
    let next = -1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (ix + 1) % options.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (ix - 1 + options.length) % options.length;
    if (next >= 0) {
      e.preventDefault();
      onChange(options[next].value);
    }
  }

  return (
    <div role="radiogroup" aria-label={label} className="grid gap-3 sm:grid-cols-2">
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
            className={`flex flex-col gap-1 rounded-container border-2 px-4 py-3.5 text-left transition-colors ${
              selected ? "border-neem bg-neem-wash" : "border-line bg-surface hover:border-line-strong"
            }`}
          >
            <span className="text-body font-semibold text-ink">{o.title}</span>
            <span className="text-small text-ink-2">{o.description}</span>
          </button>
        );
      })}
    </div>
  );
}
