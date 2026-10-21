"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { flavors, formatPrice } from "@/lib/data";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setFlavor } from "@/lib/store";
import { useCart } from "../cart/CartContext";
import { useLenis } from "../SmoothScroll";
import { Arrow, Flame } from "../ui/Icons";
import { FireButton } from "../ui/Magnetic";

const ease = [0.16, 1, 0.3, 1] as const;

/** Вкусы: sticky-экран, скролл переключает соус в 3D-банке */
export function Flavors() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { add } = useCart();
  const lenis = useLenis();
  const f = flavors[active];

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const i = Math.min(flavors.length - 1, Math.floor(self.progress * flavors.length));
          setActive(i);
          setFlavor(i);
          document.documentElement.style.setProperty("--accent", flavors[i].accent);
          gsap.set("[data-flavor-progress]", { scaleY: self.progress });
        },
        onLeaveBack: () => {
          setActive(0);
          setFlavor(0);
        },
      });
    },
    { scope: root },
  );

  const jump = (i: number) => {
    const el = root.current!;
    const top = el.offsetTop + ((el.offsetHeight - window.innerHeight) * (i + 0.5)) / flavors.length;
    lenis?.scrollTo(top, { duration: 1.4 });
  };

  return (
    <section id="flavors" ref={root} className="relative" style={{ height: `${flavors.length * 100 + 100}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Гигантское латинское имя на фоне */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[6%] z-10 overflow-hidden md:bottom-[4%]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={f.id}
              className="whitespace-nowrap text-center font-display text-[13vw] font-black uppercase leading-none tracking-[-0.06em] text-cream/[0.06]"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 1, ease }}
            >
              {f.latin.split(" ").slice(-1)[0]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="relative z-30 flex h-full flex-col justify-end px-5 pb-8 md:ml-auto md:w-[52%] md:justify-center md:px-10 md:pb-10 md:pt-32">
          <div className="mb-5 flex items-center justify-between font-display text-[11px] uppercase tracking-[0.3em] text-cream/50 md:mb-8">
            <span>
              <span className="text-ember">●</span> Линейка вкусов
            </span>
            <span className="tabular-nums">
              <span className="text-cream">{f.index}</span> / {String(flavors.length).padStart(2, "0")}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={f.id} initial="hidden" animate="show" exit="exit">
              <div className="-mt-[0.3em] overflow-hidden pb-[0.12em] pt-[0.3em]">
                <motion.h2
                  className="font-display text-[10vw] font-black uppercase leading-[1.02] tracking-[-0.02em] md:text-[4.6vw]"
                  variants={{
                    hidden: { y: "105%" },
                    show: { y: "0%", transition: { duration: 0.9, ease } },
                    exit: { y: "-105%", transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } },
                  }}
                >
                  {f.name}
                </motion.h2>
              </div>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: 0.15, staggerChildren: 0.06 } },
                  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
                }}
              >
                <p className="mt-3 font-display text-xs tracking-[0.35em]" style={{ color: f.accent }}>
                  {f.latin}
                </p>
                <p className="mt-5 font-serif text-xl italic text-cream/90 md:text-2xl">{f.tagline}</p>
                <p className="mt-3 hidden max-w-lg leading-relaxed text-cream/65 md:block [@media(max-height:780px)]:!hidden">{f.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-5 border-t border-cream/10 pt-5 md:grid-cols-[auto_1fr]">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-cream/45">Острота</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 380, damping: 14 }}
                        >
                          <Flame filled={i < f.heat} className={`h-5 w-5 ${i < f.heat ? "text-ember" : "text-cream/25"}`} />
                        </motion.span>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-cream/45">{f.scoville}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-cream/45">Ноты</p>
                    <div className="flex flex-wrap gap-1.5">
                      {f.notes.map((n, i) => (
                        <motion.span
                          key={n}
                          className="rounded-full border border-cream/15 px-3 py-1 text-xs text-cream/80"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 + i * 0.06, duration: 0.6, ease }}
                        >
                          {n}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-5 hidden text-sm text-cream/55 md:block [@media(max-height:780px)]:!hidden">
                  Идеально к: <span className="text-cream">{f.pairing.join(" · ")}</span>
                </p>

                <div className="mt-6 flex items-center gap-5">
                  <p className="font-display text-3xl font-black md:text-4xl">{formatPrice(f.price)}</p>
                  <FireButton
                    cursor="+1"
                    onClick={() =>
                      add({ id: f.id, name: f.name, latin: f.latin, size: "250", price: f.price, sauce: f.sauce, accent: f.accent })
                    }
                  >
                    В корзину <Arrow className="h-4 w-4" />
                  </FireButton>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Навигация по вкусам */}
        <div className="absolute bottom-8 left-10 z-30 hidden md:flex">
          <div className="relative mr-5 w-px bg-cream/15">
            <div data-flavor-progress className="absolute inset-0 origin-top scale-y-0 bg-ember" />
          </div>
          <ul className="flex flex-col gap-4">
            {flavors.map((fl, i) => (
              <li key={fl.id}>
                <button
                  onClick={() => jump(i)}
                  className={`group flex items-center gap-3 font-display text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    i === active ? "text-cream" : "text-cream/35 hover:text-cream/70"
                  }`}
                >
                  <span className={i === active ? "text-ember" : ""}>{fl.index}</span>
                  <span className="relative overflow-hidden">{fl.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
