export default function ConfidenceBars({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <i
          key={i}
          className="block h-[10px] w-[6px] rounded-[1.5px]"
          style={{ background: i <= level ? "var(--brand)" : "var(--line)" }}
        />
      ))}
    </span>
  );
}
