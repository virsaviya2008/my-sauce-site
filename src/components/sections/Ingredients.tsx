"use client";

import { useRef } from "react";
import { ingredients } from "@/lib/data";
import { gsap, useGSAP } from "@/lib/gsap";
import { IngredientArt } from "../ui/IngredientArt";

/** Горизонтальная лента ингредиентов, закреплённая на скролле */
export function Ingredients() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        // Иллюстрации чуть «плывут» внутри карточек
        gsap.utils.toArray<HTMLElement>("[data-ing-art]").forEach((el) => {
          gsap.fromTo(
            el,
            { xPercent: 18, rotate: 8 },
            {
              xPercent: -18,
              rotate: -8,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="ingredients" ref={root} className="relative z-30 overflow-hidden bg-coal">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div ref={track} className="relative flex flex-col gap-4 px-4 py-20 md:h-[100svh] md:w-max md:flex-row md:items-center md:gap-6 md:px-10 md:py-0">
        <div className="flex shrink-0 flex-col justify-center md:w-[42vw] md:pr-10">
          <p className="mb-5 font-display text-[11px] uppercase tracking-[0.3em] text-cream/50">
            <span className="text-ember">●</span> Акцент на ингредиентах
          </p>
          <h2 className="font-display text-[14vw] font-black uppercase leading-[0.82] tracking-[-0.06em] md:text-[7.5vw]">
            Что
            <br />
            <span className="text-outline-ember">внутри</span>
          </h2>
          <p className="mt-6 max-w-sm font-serif text-xl italic text-cream/70">
            Шесть ингредиентов, четыре континента и ни одного компромисса. Без загустителей, без усилителей, без спешки.
          </p>
        </div>

        {ingredients.map((ing, i) => (
          <article
            key={ing.id}
            className="group relative flex shrink-0 flex-col overflow-hidden rounded-[28px] border border-cream/10 bg-soot p-6 transition-colors duration-500 hover:border-ember/60 md:h-[72svh] md:w-[min(30vw,420px)]"
          >
            <div className="flex items-start justify-between">
              <span className="font-display text-5xl font-black text-outline-ember [--fill:var(--color-soot)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="rounded-full border border-cream/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream/60">
                {ing.origin}
              </span>
            </div>
            {/* Иллюстрация сжимается, если тексту нужно больше места — карточка фиксированной высоты */}
            <div className="relative flex min-h-0 flex-1 items-center justify-center py-6">
              <div className="absolute h-40 w-40 rounded-full bg-ember/20 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-ember/35" />
              <div data-ing-art className="relative aspect-square h-44 transition-transform duration-700 ease-expo group-hover:scale-110 md:h-full md:max-h-52">
                <IngredientArt icon={ing.icon} className="h-full w-full" />
              </div>
            </div>
            <h3 className="min-h-[2em] text-balance font-display text-xl font-black uppercase leading-none tracking-[-0.03em] lg:text-2xl">
              {ing.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">{ing.fact}</p>
            <div className="mt-5 flex items-baseline gap-3 border-t border-cream/10 pt-4">
              <span className="font-display text-3xl font-black text-ember">{ing.stat}</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-cream/45">{ing.statLabel}</span>
            </div>
          </article>
        ))}
        <div className="hidden w-[8vw] shrink-0 md:block" />
      </div>
    </section>
  );
}
