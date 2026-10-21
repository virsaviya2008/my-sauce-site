"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "./cart/CartContext";
import { useLenis } from "./SmoothScroll";
import { Bag, Flame } from "./ui/Icons";

const links = [
  { href: "#story", label: "История" },
  { href: "#flavors", label: "Вкусы" },
  { href: "#shop", label: "Магазин" },
  { href: "#ingredients", label: "Состав" },
];

export function Nav({ ready }: { ready: boolean }) {
  const { count, setOpen } = useCart();
  const lenis = useLenis();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!lenis) return;
    let last = 0;
    const on = ({ scroll }: { scroll: number }) => {
      setHidden(scroll > 200 && scroll > last);
      last = scroll;
    };
    lenis.on("scroll", on);
    return () => lenis.off("scroll", on);
  }, [lenis]);

  const go = (href: string) => lenis?.scrollTo(href, { duration: 1.8 });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6"
      initial={{ y: -120 }}
      animate={{ y: ready && !hidden ? 0 : -120 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="flex items-center justify-between rounded-full border border-cream/10 bg-coal/55 py-2 pl-5 pr-2 backdrop-blur-xl">
        <button onClick={() => go("#top")} className="flex items-center gap-2 font-display text-lg font-black tracking-[-0.04em]">
          <Flame className="h-5 w-5 text-ember" />
          EMBERA
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <button
                onClick={() => go(l.href)}
                className="group relative overflow-hidden rounded-full px-4 py-2 font-display text-[11px] uppercase tracking-[0.2em] text-cream/70 transition-colors hover:text-cream"
              >
                <span className="block transition-transform duration-500 ease-expo group-hover:-translate-y-full">{l.label}</span>
                <span className="absolute inset-x-0 top-full block py-2 text-ember transition-transform duration-500 ease-expo group-hover:-translate-y-full">
                  {l.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 rounded-full bg-ember py-2.5 pl-5 pr-2.5 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-coal transition-colors hover:bg-cream"
        >
          <span className="hidden sm:inline">Корзина</span>
          <Bag className="h-4 w-4 sm:hidden" />
          <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-coal text-[11px] text-cream">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </span>
        </button>
      </nav>
    </motion.header>
  );
}
