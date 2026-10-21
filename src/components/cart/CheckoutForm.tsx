"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export type Delivery = {
  name: string;
  phone: string;
  city: string;
  street: string;
  flat: string;
  comment: string;
};

type Errors = Partial<Record<keyof Delivery, string>>;

export const CHECKOUT_FORM_ID = "checkout";

const FAST_CITIES = ["москва", "санкт-петербург", "спб", "питер"];

/** Ориентировочное окно доставки: по Москве и Питеру быстрее, заказы после 14:00 — со следующего дня */
export function deliveryWindow(city: string, now = new Date()) {
  const fast = FAST_CITIES.some((c) => city.trim().toLowerCase().startsWith(c));
  const [min, max] = fast ? [1, 2] : [3, 6];
  const shift = now.getHours() >= 14 ? 1 : 0;
  const day = (n: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + n + shift);
    return d;
  };
  const fmt = (d: Date) => d.toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "long" });
  return { label: `${fmt(day(min))} — ${fmt(day(max))}`, days: `${min + shift}–${max + shift} дн.`, fast };
}

export function DeliveryEstimate({ city }: { city: string }) {
  const { label, days, fast } = deliveryWindow(city);
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-coal px-4 py-3.5 text-cream">
      <span className="mt-0.5 text-lg leading-none">🚚</span>
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-cream/50">Ориентировочная доставка</p>
        <p className="mt-1 font-semibold first-letter:uppercase">{label}</p>
        <p className="mt-0.5 text-xs text-cream/50">
          {fast ? "Курьером" : "Курьерской службой"} · {days} · точное время согласуем по телефону
        </p>
      </div>
    </div>
  );
}

/** +7 (999) 123-45-67 — из любых введённых цифр */
function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("8")) d = "7" + d.slice(1);
  if (d && !d.startsWith("7")) d = "7" + d;
  d = d.slice(0, 11);
  if (!d) return "";
  const p = d.slice(1);
  let out = "+7";
  if (p.length) out += ` (${p.slice(0, 3)}`;
  if (p.length >= 3) out += ")";
  if (p.length > 3) out += ` ${p.slice(3, 6)}`;
  if (p.length > 6) out += `-${p.slice(6, 8)}`;
  if (p.length > 8) out += `-${p.slice(8, 10)}`;
  return out;
}

function validate(v: Delivery): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Как к вам обращаться?";
  if (v.phone.replace(/\D/g, "").length !== 11) e.phone = "Нужен номер полностью — курьер позвонит перед доставкой";
  if (v.city.trim().length < 2) e.city = "Укажите город";
  if (!/\d/.test(v.street) || v.street.trim().length < 4) e.street = "Улица и номер дома, например: Тверская, 12";
  return e;
}

function Field({
  label,
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.2em] text-coal/55">{label}</span>
      <input
        {...props}
        aria-invalid={!!error}
        className={`w-full rounded-2xl border bg-white/60 px-4 py-3.5 text-base text-coal outline-none transition placeholder:text-coal/30 focus:border-ember focus:bg-white ${
          error ? "border-ember" : "border-coal/15"
        }`}
      />
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 block text-xs text-ember"
        >
          {error}
        </motion.span>
      )}
    </label>
  );
}

/** Шаг оформления: контакты и адрес доставки. Кнопка отправки — в подвале корзины */
export function CheckoutForm({ onSubmit, onBack }: { onSubmit: (d: Delivery) => void; onBack: () => void }) {
  const [v, setV] = useState<Delivery>({ name: "", phone: "", city: "Москва", street: "", flat: "", comment: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);

  const set = (k: keyof Delivery) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...v, [k]: k === "phone" ? formatPhone(e.target.value) : e.target.value };
    setV(next);
    // после первой попытки подсвечиваем ошибки по мере ввода
    if (tried) setErrors(validate(next));
  };

  return (
    <motion.form
      id={CHECKOUT_FORM_ID}
      noValidate
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease }}
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        const errs = validate(v);
        setErrors(errs);
        if (Object.keys(errs).length) return;
        onSubmit({ ...v, name: v.name.trim(), city: v.city.trim(), street: v.street.trim() });
      }}
    >
      <button
        type="button"
        onClick={onBack}
        className="self-start text-xs uppercase tracking-[0.2em] text-coal/55 transition hover:text-ember"
      >
        ← Назад к корзине
      </button>

      <p className="font-display text-lg font-black uppercase tracking-[-0.02em]">Контакты</p>
      <Field label="Имя" autoComplete="name" placeholder="Анна" value={v.name} onChange={set("name")} error={errors.name} />
      <Field
        label="Телефон"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+7 (999) 123-45-67"
        value={v.phone}
        onChange={set("phone")}
        error={errors.phone}
      />

      <p className="mt-2 font-display text-lg font-black uppercase tracking-[-0.02em]">Адрес доставки</p>
      <Field label="Город" autoComplete="address-level2" value={v.city} onChange={set("city")} error={errors.city} />
      <Field
        label="Улица и дом"
        autoComplete="street-address"
        placeholder="Тверская, 12"
        value={v.street}
        onChange={set("street")}
        error={errors.street}
      />
      <DeliveryEstimate city={v.city} />
      <Field label="Квартира / офис" placeholder="Необязательно" value={v.flat} onChange={set("flat")} />
      <Field
        label="Комментарий курьеру"
        placeholder="Подъезд, домофон, этаж"
        value={v.comment}
        onChange={set("comment")}
      />
    </motion.form>
  );
}
