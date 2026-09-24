import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: ReactNode;
  variant?: "surface" | "ghost";
}

/** 40x40 icon-only button. label doubles as aria-label; pair with Tooltip (UI-2.17) at call sites that want a visible hint on hover. */
export default function IconButton({ label, icon, variant = "surface", className = "", ...rest }: IconButtonProps) {
  const tone =
    variant === "surface"
      ? "border border-line bg-surface text-ink-2 hover:text-ink"
      : "bg-transparent text-ink-2 hover:bg-wash hover:text-ink";
  return (
    <button
      type="button"
      aria-label={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-control transition-colors active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 ${tone} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
