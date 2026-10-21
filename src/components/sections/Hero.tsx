"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useLenis } from "../SmoothScroll";
import { Arrow, Flame } from "../ui/Icons";
import { FireButton } from "../ui/Magnetic";

const ease = [0.16, 1, 0.3, 1] as const;

function Line({ children, delay, ready, className }: { children: React.ReactNode; delay: number; ready: boolean; className?: string }) {
  return (
    <span className={`-mt-[0.15em] block overflow-hidden pt-[0.15em] ${className ?? ""}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ opacity: 0, y: "30%" }}
        animate={ready ? { opacity: 1, y: "0%" } : undefined}
        transition={{ duration: 0.9, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // Гигантский заголовок расползается и тает при скролле
  useGSAP(
    () => {
      gsap.to("[data-hero-l1]", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-l2]", {
        xPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-fade]", {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "60% top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-8 pt-32 md:px-10 md:pb-10 md:pt-36"
    >
      {/* Слои идут в потоке, поэтому не наезжают друг на друга; z-index — относительно 3D-сцены */}
      <div data-hero-fade className="relative z-30 flex items-start justify-between text-[11px] uppercase tracking-[0.25em] text-cream/60">
        <motion.p initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : undefined} transition={{ delay: 0.4, duration: 0.7 }}>
          <span className="text-ember">(01)</span> Копчёный чипотле
          <br />
          Острота 3 / 5
        </motion.p>
        <motion.p
          className="hidden text-right md:block"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          Соус-ателье
          <br />
          Москва — с 2019
        </motion.p>
      </div>

      {/* Типографика за банкой (на телефоне банка во всю ширину — там заголовок поверх неё) */}
      <div className="pointer-events-none relative z-30 -mx-2 md:z-10 flex flex-1 flex-col justify-center py-10 md:-mx-4">
        {/* «Огонь» слева, «в / банке» столбиком справа — на десктопе по разные стороны банки */}
        <h1
          aria-label="Огонь в банке"
          className="flex flex-col font-display text-[12.5vw] font-black uppercase leading-[0.92] tracking-[-0.06em] md:grid md:grid-cols-[auto_auto] md:grid-rows-2 md:justify-between md:text-[min(8.5vw,17svh)]"
        >
          <span data-hero-l1 className="block self-start">
            <Line ready={ready} delay={0}>
              Огонь
            </Line>
          </span>
          <span data-hero-l2 aria-hidden className="block self-end md:row-span-2">
            <Line ready={ready} delay={0.12} className="text-outline-ember">
              в
            </Line>
            <Line ready={ready} delay={0.18} className="text-outline-ember">
              банке
            </Line>
          </span>
        </h1>
      </div>

      {/* Интерфейс поверх банки */}
      <div data-hero-fade className="relative z-30 flex items-end justify-between gap-6">
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.35, duration: 0.8, ease }}
        >
          <p className="mb-6 font-serif text-xl italic leading-snug text-cream/80 md:text-2xl">
            Малые партии. 90 дней ферментации.
            <br />
            <span className="text-ember">Острота без компромиссов.</span>
          </p>
          <div className="flex flex-wrap gap-3">
            <FireButton onClick={() => lenis?.scrollTo("#shop", { duration: 2 })} cursor="Купить">
              Купить от 790 ₽ <Arrow className="h-4 w-4" />
            </FireButton>
            <FireButton variant="ghost" onClick={() => lenis?.scrollTo("#story", { duration: 1.6 })}>
              Наша история
            </FireButton>
          </div>
        </motion.div>

        <motion.div
          className="relative hidden h-36 w-36 shrink-0 md:block"
          initial={{ opacity: 0, scale: 0.6, rotate: -60 }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
          transition={{ delay: 0.5, duration: 0.9, ease }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin_16s_linear_infinite]">
            <defs>
              <path id="badge" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
            </defs>
            <text className="fill-cream font-display text-[8.4px] font-bold uppercase tracking-[0.2em]">
              <textPath href="#badge">Ферментация • 90 дней • Ручной розлив •</textPath>
            </text>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <Flame className="h-9 w-9 text-ember" />
          </div>
        </motion.div>
      </div>

      {/* Индикатор скролла */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 0.7 }}
      >
        <span className="text-[10px] uppercase tracking-[0.35em] text-cream/50">Скролл</span>
        <span className="relative h-12 w-px overflow-hidden bg-cream/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-ember"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
