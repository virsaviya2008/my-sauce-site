"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { store } from "@/lib/store";
import { Flame } from "./Icons";

const ease = [0.76, 0, 0.24, 1] as const;
const WORD = "EMBERA";

/** Микрозаставка: счётчик «разогрева» и шторка, уходящая вверх */
export function Preloader({ onDone }: { onDone: () => void }) {
  const [done, setDone] = useState(false);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let value = 0;
    let fontsReady = false;
    document.fonts.ready.then(() => (fontsReady = true));
    const start = performance.now();
    let last = start;
    const loop = (now: number) => {
      // шаг по времени, а не по кадрам — на слабом железе заставка не затягивается
      const k = Math.min((now - last) / 16.7, 6);
      last = now;
      // ждём шрифты и прогрев 3D-сцены, но не висим дольше ~2,5 с
      const cap = (fontsReady && store.sceneReady) || now - start > 2500 ? 100 : 86;
      value = Math.min(cap, value + Math.max(0.9, (cap - value) * 0.1) * k);
      // пишем прямо в DOM, без ререндера React на каждом кадре
      if (counter.current) counter.current.textContent = String(Math.floor(value)).padStart(3, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${value / 100})`;
      if (value >= 99.9) {
        setTimeout(() => setDone(true), 150);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!done && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-coal p-6 md:p-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.75, ease }}
        >
          <div className="grid-lines pointer-events-none absolute inset-0" />
          <div className="relative flex items-center justify-between font-display text-[11px] uppercase tracking-[0.3em] text-cream/50">
            <span>Sauce Atelier</span>
            <span>Разогрев углей</span>
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <Flame className="h-12 w-12 text-ember drop-shadow-[0_0_24px_rgba(255,90,0,0.8)]" />
            </motion.div>
            <div className="flex overflow-hidden font-display text-[16vw] font-black leading-[0.85] tracking-[-0.05em] md:text-[11vw]">
              {WORD.split("").map((c, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-105%" }}
                  transition={{ duration: 0.6, ease, delay: 0.05 + i * 0.04 }}
                  className="inline-block"
                  style={{ color: i === 0 ? "var(--color-ember)" : undefined }}
                >
                  {c}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="relative flex items-end justify-between">
            <span className="max-w-[16rem] font-serif text-lg italic text-cream/60">
              Огонь, дым и время — разливаем вручную.
            </span>
            <span ref={counter} className="font-display text-6xl font-black tabular-nums text-ember md:text-8xl">
              000
            </span>
          </div>
          <div ref={bar} className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-ember" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
