import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the section and pans a horizontal track as the user scrolls vertically.
 * Motivated: the three build stages are a physical journey (now → next → later), not a static list.
 */
export default function HorizontalPan({ items }: { items: ReactNode[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrapRef.current || !trackRef.current) return;
    const ctx = gsap.context(() => {
      const distance = trackRef.current!.scrollWidth - window.innerWidth;
      if (distance <= 0) return;
      gsap.to(trackRef.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, [reduce]);

  if (reduce) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </div>
    );
  }

  return (
    <section ref={wrapRef} className="relative overflow-hidden">
      <div ref={trackRef} className="flex min-h-[70dvh] items-center gap-6 pr-[10vw]">
        {items.map((item, i) => (
          <div key={i} className="w-[min(86vw,560px)] shrink-0">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
