"use client";

import { useEffect, useRef } from "react";
import { store } from "@/lib/store";
import { Flame } from "../ui/Icons";

function Row({ words, dir, className }: { words: string[]; dir: 1 | -1; className: string }) {
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = 0;
    let raf = 0;
    const loop = () => {
      const el = track.current;
      if (el) {
        const half = el.scrollWidth / 2;
        // скорость растёт вместе со скоростью скролла
        x -= (0.6 + Math.min(Math.abs(store.velocity) * 0.25, 14)) * dir;
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [dir]);

  const items = [...words, ...words];
  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="flex w-max items-center will-change-transform">
        {items.map((w, i) => (
          <span key={i} className="flex items-center gap-8 px-4 md:gap-12 md:px-6">
            <span className={i % 2 ? "text-outline" : ""}>{w}</span>
            <Flame className="h-[0.6em] w-[0.6em] shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section aria-hidden className="relative z-30 -my-10 overflow-hidden py-24 md:py-32">
      <Row
        words={["Остро", "Дерзко", "Честно", "Дымно", "Вручную"]}
        dir={1}
        className="halftone relative [--fill:var(--color-ember)] [--stroke:var(--color-coal)] -rotate-3 scale-110 bg-ember py-4 font-display text-[9vw] font-black uppercase leading-none tracking-[-0.04em] text-coal md:py-6 md:text-[6vw]"
      />
      <Row
        words={["Smoke", "Ferment", "Fire", "Umami", "Heat"]}
        dir={-1}
        className="relative [--stroke:var(--color-ember)] -mt-4 rotate-2 scale-110 border-y border-ember/40 bg-coal py-3 font-display text-[6vw] font-black uppercase leading-none tracking-[-0.03em] text-ember md:text-[3.6vw]"
      />
    </section>
  );
}
