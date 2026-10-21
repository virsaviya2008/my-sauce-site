"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

/** Обёртка, притягивающая ребёнка к курсору */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

type BtnProps = {
  children: React.ReactNode;
  variant?: "fire" | "ghost" | "coal";
  onClick?: () => void;
  className?: string;
  cursor?: string;
};

/** Кнопка с заливкой, поднимающейся снизу */
export function FireButton({ children, variant = "fire", onClick, className = "", cursor }: BtnProps) {
  const styles = {
    fire: "bg-ember text-coal border-ember",
    ghost: "bg-transparent text-cream border-cream/30",
    coal: "bg-coal text-cream border-coal",
  }[variant];
  const fill = {
    fire: "bg-cream",
    ghost: "bg-ember",
    coal: "bg-cream",
  }[variant];

  return (
    <Magnetic>
      <button
        type="button"
        onClick={onClick}
        data-cursor={cursor}
        className={`group relative isolate overflow-hidden rounded-full border px-7 py-4 font-display text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-500 ${styles} ${className}`}
      >
        <span
          className={`absolute inset-0 -z-10 translate-y-[101%] rounded-[50%_50%_0_0] transition-[translate,border-radius] duration-700 ease-expo group-hover:translate-y-0 group-hover:rounded-none ${fill}`}
        />
        <span className={`relative flex items-center gap-3 transition-colors duration-500 group-hover:text-coal`}>{children}</span>
      </button>
    </Magnetic>
  );
}
