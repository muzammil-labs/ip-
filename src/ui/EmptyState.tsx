import type { ReactNode } from "react";
import Seal from "./Seal";

export interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

/** Used whenever a region has no content yet. No region may render blank; use this instead. */
export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-container border border-dashed border-line px-6 py-10 text-center">
      <Seal size={32} variant="outline" />
      <p className="max-w-[36ch] text-small text-ink-3">{message}</p>
      {action}
    </div>
  );
}
