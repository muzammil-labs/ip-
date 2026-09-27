function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-control bg-wash ${className}`} />;
}

/** Shape-matched placeholder for a Finding card. No spinners. */
export function FindingSkeleton() {
  return (
    <div className="rounded-container border border-line bg-surface p-6 shadow-1" aria-hidden="true">
      <div className="flex items-center justify-between gap-3">
        <Bar className="h-5 w-2/5" />
        <Bar className="h-6 w-20 rounded-pill" />
      </div>
      <Bar className="mt-4 h-3 w-full" />
      <Bar className="mt-2 h-3 w-4/5" />
    </div>
  );
}

/** Shape-matched placeholder for a row in an EvidenceList. */
export function EvidenceRowSkeleton() {
  return (
    <div className="flex items-start gap-2.5 px-1 py-3" aria-hidden="true">
      <Bar className="mt-0.5 h-5 w-5 shrink-0 rounded-pill" />
      <Bar className="h-4 w-full" />
    </div>
  );
}

/** Shape-matched placeholder for a DataTable row. */
export function DataTableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 border-b border-line px-4 py-3" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Bar key={i} className="h-3.5 flex-1" />
      ))}
    </div>
  );
}
