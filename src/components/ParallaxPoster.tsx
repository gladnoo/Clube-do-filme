"use client";

import { useEffect, useRef } from "react";

export default function ParallaxPoster({
  children,
  factor = 0.12,
}: {
  children: React.ReactNode;
  factor?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let ticking = false;

    function update() {
      ticking = false;
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!wrapper || !inner) return;

      const rect = wrapper.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const distanceFromCenter = rect.top + rect.height / 2 - viewportCenter;
      const offset = Math.max(-40, Math.min(40, -distanceFromCenter * factor));
      inner.style.transform = `translateY(${offset}px)`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [factor]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 overflow-hidden rounded-card">
      <div ref={innerRef} className="absolute inset-0 will-change-transform scale-[1.15]">
        {children}
      </div>
    </div>
  );
}
