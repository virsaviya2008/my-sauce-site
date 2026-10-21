"use client";

import { motion } from "framer-motion";
import { flavors } from "@/lib/data";
import { useStoreValue } from "@/lib/store";

/** Фиксированный фактурный фон: сетка, виньетка, мягкое свечение, зерно */
export function Backdrop() {
  const flavor = useStoreValue((s) => s.flavor);
  const glow = flavors[flavor].glow;
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0 bg-coal" />
      <motion.div
        className="absolute inset-0"
        animate={{
          background: `radial-gradient(60% 55% at 50% 55%, ${glow}33 0%, ${glow}0d 45%, transparent 75%)`,
        }}
        transition={{ duration: 1.2 }}
      />
      <div className="grid-lines absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_50%,transparent_55%,rgba(0,0,0,0.75)_100%)]" />
    </div>
  );
}

export function Grain() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[80] opacity-[0.04]" aria-hidden>
      <div className="grain h-full w-full" />
    </div>
  );
}
