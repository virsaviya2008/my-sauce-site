"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { bundle, type Category, type Flavor, flavors, formatPrice } from "@/lib/data";
import { type Size, useCart } from "../cart/CartContext";
import { Check, Flame, Plus } from "../ui/Icons";
import { JarIllustration } from "../ui/JarIllustration";
import { FireButton } from "../ui/Magnetic";
import { RevealWords } from "../ui/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

const filters: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "hot", label: "Острые" },
  { id: "umami", label: "Умами" },
];

function AddButton({ onAdd }: { onAdd: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => {
        onAdd();
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      data-cursor="+1"
      aria-label="Добавить в корзину"
      className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-ember text-coal transition-transform hover:scale-110 active:scale-95"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={done ? "ok" : "plus"}
          initial={{ y: 20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {done ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
      {done && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-ember"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      )}
    </button>
  );
}

function ProductCard({ f, i }: { f: Flavor; i: number }) {
  const { add } = useCart();
  const [size, setSize] = useState<Size>("250");
  const price = size === "250" ? f.price : Math.round(f.price * 0.68 / 10) * 10;
  const large = size === "250";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ duration: 0.9, ease, delay: i * 0.08 }}
      whileHover="hover"
      className="group relative flex flex-col overflow-hidden rounded-[28px] bg-coal p-5 text-cream"
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-cream/50">
        <span className="font-display">№ {f.index}</span>
        <span className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, k) => (
            <Flame key={k} filled={k < f.heat} className={`h-3.5 w-3.5 ${k < f.heat ? "text-ember" : "text-cream/20"}`} />
          ))}
        </span>
      </div>

      <div className="relative my-4 flex aspect-[4/5] items-center justify-center" data-cursor="Смотреть">
        <motion.div
          className="absolute inset-6 rounded-full blur-3xl"
          style={{ background: f.glow }}
          initial={{ opacity: 0.15, scale: 0.7 }}
          variants={{ hover: { opacity: 0.45, scale: 1 } }}
          transition={{ duration: 0.6 }}
        />
        {/* Специи разлетаются при наведении */}
        {Array.from({ length: 8 }).map((_, k) => (
          <motion.span
            key={k}
            className="absolute h-1.5 w-2.5 rounded-full"
            style={{ background: k % 3 === 0 ? "#f1dfb8" : k % 3 === 1 ? "#c2260a" : "#1b120c", rotate: k * 40 }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            variants={{
              hover: {
                x: Math.cos((k / 8) * Math.PI * 2) * 110,
                y: Math.sin((k / 8) * Math.PI * 2) * 130,
                opacity: 1,
                scale: 1,
              },
            }}
            transition={{ duration: 0.7, ease }}
          />
        ))}
        <motion.div
          className="relative h-full w-[78%]"
          animate={{ scale: large ? 1 : 0.84 }}
          variants={{ hover: { y: -14, rotate: -4, scale: large ? 1.04 : 0.88 } }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
        >
          <JarIllustration sauce={f.sauce} accent={f.accent} latin={f.latin} index={f.index} className="h-full w-full" />
        </motion.div>
      </div>

      <h3 className="font-display text-xl font-black uppercase leading-none tracking-[-0.03em]">{f.name}</h3>
      <p className="mt-2 text-sm text-cream/55">{f.notes.slice(0, 3).join(" · ")}</p>

      <div className="mt-5 flex items-center justify-between gap-2 whitespace-nowrap">
        <div className="relative flex rounded-full border border-cream/15 p-1 text-xs">
          {(["150", "250"] as Size[]).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`relative z-10 rounded-full px-2.5 py-1.5 font-display text-[11px] transition-colors ${size === s ? "text-coal" : "text-cream/60"}`}
            >
              {size === s && (
                <motion.span
                  layoutId={`size-${f.id}`}
                  className="absolute inset-0 -z-10 rounded-full bg-cream"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {s} мл
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={price}
              className="font-display text-base font-bold"
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
            >
              {formatPrice(price)}
            </motion.span>
          </AnimatePresence>
          <AddButton
            onAdd={() => add({ id: f.id, name: f.name, latin: f.latin, size, price, sauce: f.sauce, accent: f.accent })}
          />
        </div>
      </div>
    </motion.article>
  );
}

export function Products() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const { add } = useCart();
  const list = flavors.filter((f) => filter === "all" || f.category === filter);

  return (
    <section id="shop" className="paper relative z-30 overflow-hidden rounded-t-[40px] bg-ember px-4 pb-20 pt-20 text-coal md:rounded-t-[64px] md:px-10 md:pb-28 md:pt-28">
      <div className="halftone pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-5 font-display text-[11px] uppercase tracking-[0.3em]">● Магазин — малые партии</p>
            <h2 className="font-display text-[13vw] font-black uppercase leading-[0.84] tracking-[-0.06em] md:text-[8.5vw]">
              <RevealWords text="Забери" />
              <br />
              <RevealWords text="огонь домой" delay={0.1} className="text-cream" />
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="mb-6 font-serif text-xl italic leading-snug">
              Каждая банка пронумерована вручную. Партия ограничена — 400 банок каждого вкуса.
            </p>
            <LayoutGroup id="filters">
              <div className="inline-flex rounded-full bg-coal p-1">
                {filters.map((fl) => (
                  <button
                    key={fl.id}
                    onClick={() => setFilter(fl.id)}
                    className={`relative rounded-full px-5 py-2.5 font-display text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      filter === fl.id ? "text-coal" : "text-cream/70 hover:text-cream"
                    }`}
                  >
                    {filter === fl.id && (
                      <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-ember" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <span className="relative">{fl.label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>
        </div>

        <motion.div layout className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence>
            {list.map((f, i) => (
              <ProductCard key={f.id} f={f} i={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Набор */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="relative mt-4 grid items-center gap-8 overflow-hidden rounded-[28px] bg-coal p-6 text-cream md:grid-cols-[1.2fr_1fr] md:p-10"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-ember/30 blur-3xl" />
          <div className="relative">
            <span className="inline-block rotate-[-3deg] rounded-full bg-ember px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-coal">
              −17% · хит подарков
            </span>
            <h3 className="mt-5 font-display text-3xl font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-5xl">
              {bundle.name}
            </h3>
            <p className="mt-2 font-display text-xs tracking-[0.35em] text-ember">{bundle.latin}</p>
            <p className="mt-5 max-w-md text-cream/65">{bundle.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <p className="font-display text-4xl font-black">{formatPrice(bundle.price)}</p>
              <p className="text-cream/40 line-through">{formatPrice(bundle.oldPrice)}</p>
              <FireButton
                cursor="+1"
                onClick={() =>
                  add({ id: bundle.id, name: bundle.name, latin: bundle.latin, size: "set", price: bundle.price, sauce: flavors[0].sauce, accent: flavors[0].accent })
                }
              >
                Взять сет
              </FireButton>
            </div>
          </div>
          <div className="relative flex h-56 items-end justify-center md:h-72">
            {flavors.map((f, i) => (
              <motion.div
                key={f.id}
                className="-mx-3 h-[80%] w-1/4 md:-mx-4"
                style={{ zIndex: i === 1 || i === 2 ? 2 : 1 }}
                initial={{ y: 80, rotate: (i - 1.5) * 10 }}
                whileInView={{ y: i === 1 || i === 2 ? -10 : 10, rotate: (i - 1.5) * 6 }}
                whileHover={{ y: -30, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 + i * 0.08 }}
              >
                <JarIllustration sauce={f.sauce} accent={f.accent} className="h-full w-full" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
