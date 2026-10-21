"use client";

import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Arrow, Check, Flame } from "../ui/Icons";
import { RevealWords } from "../ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

const stats = [
  { value: 0, suffix: "", label: "консервантов и усилителей" },
  { value: 90, suffix: " дн", label: "ферментации каждой партии" },
  { value: 12, suffix: "", label: "партий в год — не больше" },
  { value: 4.9, suffix: "", label: "средняя оценка из 3 200 отзывов", decimals: 1 },
];

function Counter({ to, decimals = 0, suffix }: { to: number; decimals?: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease, onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toFixed(decimals).replace(".", ",")}
      {suffix}
    </span>
  );
}

export function Numbers() {
  return (
    <section className="relative z-30 bg-coal px-4 py-24 md:px-10 md:py-36">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className="max-w-4xl font-display text-[10vw] font-black uppercase leading-[0.86] tracking-[-0.05em] md:text-[5.4vw]">
          <RevealWords text="Честность" />
          <br />
          <RevealWords text="в цифрах" className="text-ember" delay={0.1} />
        </h2>
        <p className="max-w-xs font-serif text-lg italic text-cream/60">Мы не масштабируемся ценой вкуса. Это принцип, а не маркетинг.</p>
      </div>
      <div className="grid grid-cols-2 border-t border-cream/10 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="border-b border-cream/10 py-8 pr-4 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: i * 0.1 }}
          >
            <p className="font-display text-6xl font-black tracking-[-0.05em] text-cream md:text-7xl">
              <Counter to={s.value} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="mt-3 max-w-[12rem] text-sm text-cream/55">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);
  const letters = "EMBERA".split("");

  return (
    <footer ref={ref} className="paper relative z-30 overflow-hidden rounded-t-[40px] bg-ember text-coal md:rounded-t-[64px]">
      <div className="halftone pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative grid gap-12 px-5 pb-6 pt-20 md:grid-cols-[1.4fr_1fr] md:px-10 md:pt-28">
        <div>
          <p className="mb-5 font-display text-[11px] uppercase tracking-[0.3em]">● Клуб первой партии</p>
          <h2 className="font-display text-[10vw] font-black uppercase leading-[0.86] tracking-[-0.05em] md:text-[5vw]">
            <RevealWords text="−10% на первый" />
            <br />
            <RevealWords text="огонь" className="text-cream" delay={0.15} />
          </h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setSent(true);
            }}
            className="mt-10 flex max-w-xl items-center gap-2 rounded-full bg-coal p-2 pl-6"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ваш@email.ru"
              aria-label="Email"
              disabled={sent}
              className="min-w-0 flex-1 bg-transparent py-3 text-cream placeholder:text-cream/35 focus:outline-none"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.92 }}
              className="flex shrink-0 items-center gap-2 rounded-full bg-ember px-6 py-3.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-coal transition-colors hover:bg-cream"
            >
              {sent ? (
                <>
                  Готово <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Хочу <Arrow className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
          {sent && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 text-sm">
              Промокод уже летит к вам. Проверьте почту 🔥
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm md:pt-14">
          <div>
            <p className="mb-4 font-display text-[11px] uppercase tracking-[0.25em] opacity-60">Магазин</p>
            <ul className="space-y-2 font-medium">
              <li>Все соусы</li>
              <li>Наборы</li>
              <li>Подарочные карты</li>
              <li>Оптом для ресторанов</li>
            </ul>
          </div>
          <div>
            <p className="mb-4 font-display text-[11px] uppercase tracking-[0.25em] opacity-60">Ателье</p>
            <ul className="space-y-2 font-medium">
              <li>Москва, Хлебозавод №9</li>
              <li>hello@embera.ru</li>
              <li>Telegram</li>
              <li>Instagram*</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden px-2">
        <motion.p
          style={{ y }}
          className="flex justify-between font-display text-[18vw] font-black uppercase leading-[0.78] tracking-[-0.07em]"
        >
          {letters.map((l, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease, delay: i * 0.06 }}
            >
              {l}
            </motion.span>
          ))}
        </motion.p>
      </div>

      <div className="relative flex flex-col items-center justify-between gap-3 border-t border-coal/20 px-5 py-5 text-xs md:flex-row md:px-10">
        <span className="flex items-center gap-2">
          <Flame className="h-4 w-4" /> © 2026 EMBERA Sauce Atelier
        </span>
        <span className="opacity-60">Сделано с огнём. Хранить в прохладном месте, подальше от слабонервных.</span>
      </div>
    </footer>
  );
}
