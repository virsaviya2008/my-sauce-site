"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/data";
import { useLenis } from "../SmoothScroll";
import { Check, Close, Flame, Minus, Plus } from "../ui/Icons";
import { JarIllustration } from "../ui/JarIllustration";
import { FREE_SHIPPING, useCart } from "./CartContext";
import { CHECKOUT_FORM_ID, CheckoutForm, type Delivery, deliveryWindow } from "./CheckoutForm";

const ease = [0.16, 1, 0.3, 1] as const;

export function CartDrawer() {
  const { items, open, setOpen, setQty, total, clear, count } = useCart();
  const lenis = useLenis();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [order, setOrder] = useState<{ id: string; delivery: Delivery } | null>(null);

  // Блокируем скролл только пока открыта корзина — не трогаем его во время прелоадера
  const locked = useRef(false);
  useEffect(() => {
    if (open) {
      lenis?.stop();
      locked.current = true;
    } else if (locked.current) {
      lenis?.start();
      locked.current = false;
    }
  }, [open, lenis]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [setOpen]);

  const left = Math.max(0, FREE_SHIPPING - total);
  const progress = Math.min(1, total / FREE_SHIPPING);

  const checkout = (delivery: Delivery) => {
    setOrder({ id: `E-${Math.floor(1000 + Math.random() * 9000)}`, delivery });
    clear();
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        setOrder(null);
        setStep("cart");
      }}
    >
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[60] bg-coal/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-label="Корзина"
            data-lenis-prevent
            className="fixed inset-y-0 right-0 z-[61] flex w-full max-w-[460px] flex-col bg-cream text-coal"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="flex items-center justify-between border-b border-coal/10 px-6 py-5">
              <h3 className="font-display text-2xl font-black uppercase tracking-[-0.03em]">
                {step === "form" && !order ? "Оформление" : "Корзина"} <sup className="text-sm text-ember">{count || ""}</sup>
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="grid h-11 w-11 place-items-center rounded-full border border-coal/15 transition hover:rotate-90 hover:bg-coal hover:text-cream"
                aria-label="Закрыть"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>

            {order ? (
              <OrderSuccess order={order.id} delivery={order.delivery} onClose={() => setOpen(false)} />
            ) : step === "form" && items.length ? (
              <>
                <CheckoutForm onSubmit={checkout} onBack={() => setStep("cart")} />
                <div className="border-t border-coal/10 px-6 py-5">
                  <div className="mb-4 flex items-end justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-coal/60">К оплате</span>
                    <span className="font-display text-3xl font-black">{formatPrice(total)}</span>
                  </div>
                  <SubmitButton type="submit" form={CHECKOUT_FORM_ID}>
                    Подтвердить заказ
                  </SubmitButton>
                  <p className="mt-3 text-center text-xs text-coal/50">Оплата курьеру при получении — картой или наличными</p>
                </div>
              </>
            ) : (
              <>
                <div className="px-6 pt-5">
                  <p className="text-sm">
                    {left > 0 ? (
                      <>
                        До бесплатной доставки — <b>{formatPrice(left)}</b>
                      </>
                    ) : (
                      <b className="text-ember">Доставка бесплатно 🔥</b>
                    )}
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-coal/10">
                    <motion.div
                      className="h-full rounded-full bg-ember"
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.8, ease }}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                      <Flame className="h-12 w-12 text-ember" />
                      <p className="font-display text-xl font-bold uppercase">Здесь пока не горит</p>
                      <p className="max-w-[16rem] text-sm text-coal/60">Добавьте пару банок — и ужин уже не будет прежним.</p>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {items.map((it) => (
                          <motion.li
                            key={it.key}
                            layout
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.5, ease }}
                            className="flex items-center gap-4 rounded-2xl bg-coal p-3 text-cream"
                          >
                            <div className="h-20 w-16 shrink-0">
                              <JarIllustration sauce={it.sauce} accent={it.accent} className="h-full w-full" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-display text-sm font-bold uppercase">{it.name}</p>
                              <p className="text-xs text-cream/50">
                                {it.size === "set" ? "4 × 150 мл" : `${it.size} мл`} · {formatPrice(it.price)}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <button
                                  onClick={() => setQty(it.key, it.qty - 1)}
                                  className="grid h-7 w-7 place-items-center rounded-full border border-cream/20 hover:border-ember hover:text-ember"
                                  aria-label="Меньше"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-6 text-center font-display text-sm tabular-nums">{it.qty}</span>
                                <button
                                  onClick={() => setQty(it.key, it.qty + 1)}
                                  className="grid h-7 w-7 place-items-center rounded-full border border-cream/20 hover:border-ember hover:text-ember"
                                  aria-label="Больше"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            <p className="font-display text-sm font-bold text-ember">{formatPrice(it.price * it.qty)}</p>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                <div className="border-t border-coal/10 px-6 py-5">
                  <div className="mb-4 flex items-end justify-between">
                    <span className="text-sm uppercase tracking-[0.2em] text-coal/60">Итого</span>
                    <span className="font-display text-3xl font-black">{formatPrice(total)}</span>
                  </div>
                  <SubmitButton disabled={!items.length} onClick={() => setStep("form")}>
                    Оформить заказ
                  </SubmitButton>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function SubmitButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="group relative w-full overflow-hidden rounded-full bg-ember py-5 font-display text-sm font-bold uppercase tracking-[0.18em] text-coal transition disabled:opacity-40"
    >
      <span className="absolute inset-0 translate-y-full bg-coal transition-transform duration-500 ease-expo group-enabled:group-hover:translate-y-0" />
      <span className="relative transition-colors duration-500 group-enabled:group-hover:text-ember">{children}</span>
    </button>
  );
}

function OrderSuccess({ order, delivery, onClose }: { order: string; delivery: Delivery; onClose: () => void }) {
  const address = [delivery.city, delivery.street, delivery.flat && `кв. ${delivery.flat}`].filter(Boolean).join(", ");
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-8 text-center">
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-ember"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i / 14) * Math.PI * 2) * 160,
            y: Math.sin((i / 14) * Math.PI * 2) * 160,
            scale: [0, 1.4, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 1.2, ease, delay: 0.25 }}
        />
      ))}
      <motion.div
        className="grid h-28 w-28 place-items-center rounded-full bg-ember text-coal"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
      >
        <Check className="h-12 w-12" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease }}>
        <p className="font-display text-3xl font-black uppercase leading-none">Огонь в пути</p>
        <p className="mt-3 text-coal/60">
          {delivery.name}, заказ <b className="text-coal">{order}</b> принят. Мы уже запечатываем банки вручную.
        </p>
        <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-coal/10 bg-white/50 px-5 py-4 text-left text-sm">
          <p className="text-[11px] uppercase tracking-[0.2em] text-coal/50">Доставим по адресу</p>
          <p className="mt-1 font-semibold">{address}</p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-coal/50">Ориентировочно</p>
          <p className="mt-1 font-semibold first-letter:uppercase">{deliveryWindow(delivery.city).label}</p>
          <p className="mt-2 text-coal/60">
            Курьер позвонит на <span className="whitespace-nowrap text-coal">{delivery.phone}</span> перед приездом
          </p>
        </div>
      </motion.div>
      <button onClick={onClose} className="rounded-full border border-coal/20 px-6 py-3 font-display text-xs uppercase tracking-[0.2em] hover:bg-coal hover:text-cream">
        Вернуться
      </button>
    </div>
  );
}

export function CartToast() {
  const { toast, setOpen } = useCart();
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[65] -translate-x-1/2">
      <AnimatePresence>
        {toast && (
          <motion.button
            key={toast.id}
            onClick={() => setOpen(true)}
            className="pointer-events-auto flex items-center gap-3 rounded-full bg-cream py-2 pl-2 pr-6 text-coal shadow-[0_20px_60px_rgba(255,90,0,0.35)]"
            initial={{ y: 80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ember">
              <Check className="h-4 w-4" />
            </span>
            <span className="text-sm">
              <b>{toast.name}</b> — в корзине
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
