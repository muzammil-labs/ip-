import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins each panel at viewport top as the next one arrives and scales/dims the outgoing one.
 * Motivated: draws full attention to one differentiator at a time instead of a scanned grid.
 */
export default function StickyStack({ items }: { items: ReactNode[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrapRef.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card", wrapRef.current!);
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top top+=72",
          endTrigger: cards[cards.length - 1],
          end: "top top+=72",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.93,
          opacity: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top+=72",
            scrub: true,
          },
        });
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [reduce]);

  if (reduce) {
    return (
      <div className="grid gap-4">
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      {items.map((item, i) => (
        <div key={i} className="stack-card sticky top-0 flex min-h-[70dvh] items-center py-6">
          {item}
        </div>
      ))}
    </div>
  );
}
