import type { ReactNode } from "react";

export interface SectionProps {
  title: string;
  lede?: string;
  children?: ReactNode;
}

/** h2 plus optional body-lg lede plus children. No eyebrow. Vertical rhythm: 64px desktop / 48px mobile between sections. */
export default function Section({ title, lede, children }: SectionProps) {
  return (
    <section className="py-12 sm:py-16">
      <h2 className="text-h2 text-ink">{title}</h2>
      {lede && <p className="mt-2 text-body-lg text-ink-2">{lede}</p>}
      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
