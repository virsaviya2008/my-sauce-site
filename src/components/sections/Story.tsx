"use client";

import { useRef } from "react";
import { story } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * История, раскрывающаяся по мере прокрутки: sticky-экран,
 * три главы сменяют друг друга по скрабу ScrollTrigger.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 },
      });

      chapters.forEach((ch, i) => {
        const words = ch.querySelectorAll("[data-word]");
        const rest = ch.querySelectorAll("[data-fade]");
        const num = ch.querySelector("[data-num]");
        tl.fromTo(num, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6 }, i * 3)
          // строки заголовка «проявляются» шторкой слева направо
          .fromTo(
            words,
            { clipPath: "inset(-25% 100% -25% 0%)", opacity: 0, x: -24 },
            { clipPath: "inset(-25% 0% -25% 0%)", opacity: 1, x: 0, stagger: 0.22, duration: 0.8, ease: "power2.out" },
            i * 3 + 0.1,
          )
          .fromTo(rest, { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.15, duration: 0.6 }, i * 3 + 0.6)
          .fromTo(`[data-bar="${i}"]`, { scaleX: 0 }, { scaleX: 1, duration: 3 }, i * 3);
        if (i < chapters.length - 1) {
          tl.to(ch, { y: -40, opacity: 0, duration: 0.6, ease: "power1.in" }, i * 3 + 2.3);
        }
      });
      tl.to({}, { duration: 0.4 });
    },
    { scope: root },
  );

  return (
    <section id="story" ref={root} className="relative h-[420vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-end overflow-hidden px-5 pb-10 md:justify-center md:px-10 md:pb-0">
        <span className="pointer-events-none absolute left-5 top-28 z-10 font-display text-[11px] uppercase tracking-[0.3em] text-cream/50 md:left-10">
          <span className="text-ember">●</span> История бренда
        </span>

        <div className="relative z-30 h-[58svh] md:h-[70svh] md:w-[52%]">
          {story.map((c, i) => (
            <article key={c.index} data-chapter className="absolute inset-0 flex flex-col justify-center">
              <div className="mb-4 flex items-baseline gap-4">
                <span data-num className="font-display text-6xl font-black text-outline-ember md:text-8xl">
                  {c.index}
                </span>
                <span data-fade className="font-serif text-lg italic text-cream/60">
                  {c.kicker}
                </span>
              </div>
              <h2 className="font-display text-[11vw] font-black uppercase leading-[0.88] tracking-[-0.05em] md:text-[5.6vw]">
                {c.title.map((w, j) => (
                  <span key={j} data-word className={`block w-fit ${j === 1 ? "text-ember" : ""}`}>
                    {w}
                  </span>
                ))}
              </h2>
              <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:gap-10">
                <p data-fade className="max-w-md text-base leading-relaxed text-cream/75 md:text-lg">
                  {c.body}
                </p>
                <div data-fade className="shrink-0 border-l border-ember/40 pl-5">
                  <p className="font-display text-5xl font-black text-ember">{c.stat}</p>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-cream/50">{c.statLabel}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Прогресс глав */}
        <div className="relative z-30 mt-6 flex gap-2 md:absolute md:bottom-10 md:left-10 md:w-[40%]">
          {story.map((c, i) => (
            <div key={c.index} className="flex-1">
              <div className="h-[2px] overflow-hidden bg-cream/15">
                <div data-bar={i} className="h-full origin-left scale-x-0 bg-ember" />
              </div>
              <p className="mt-2 font-display text-[10px] uppercase tracking-[0.25em] text-cream/40">{c.index}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
