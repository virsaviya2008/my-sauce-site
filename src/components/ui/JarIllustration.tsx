"use client";

import { useId } from "react";

/** Плоская, но объёмная иллюстрация банки для карточек и корзины */
export function JarIllustration({
  sauce,
  accent,
  latin,
  index,
  className,
}: {
  sauce: string;
  accent: string;
  latin?: string;
  index?: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 200 280" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${id}s`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.18" stopColor={sauce} />
          <stop offset="0.55" stopColor={sauce} stopOpacity="0.85" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0.02" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" x2="1">
          <stop offset="0" stopColor="#050403" />
          <stop offset="0.3" stopColor="#2b2420" />
          <stop offset="0.5" stopColor="#0c0a09" />
          <stop offset="0.75" stopColor="#3a322c" />
          <stop offset="1" stopColor="#050403" />
        </linearGradient>
        <radialGradient id={`${id}h`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="150" rx="100" ry="120" fill={`url(#${id}h)`} />
      <ellipse cx="100" cy="266" rx="66" ry="7" fill="#000" opacity="0.45" />

      {/* соус */}
      <path d="M46 108 Q100 101 154 108 L154 244 Q154 256 142 256 L58 256 Q46 256 46 244 Z" fill={`url(#${id}s)`} />
      {/* стекло */}
      <path
        d="M40 74 Q40 60 56 58 L144 58 Q160 60 160 74 L160 246 Q160 262 144 262 L56 262 Q40 262 40 246 Z"
        fill={`url(#${id}g)`}
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1.2"
      />
      {/* этикетка */}
      <rect x="40" y="132" width="120" height="96" fill="#0d0a08" />
      <rect x="40" y="132" width="120" height="3" fill={accent} />
      <rect x="40" y="225" width="120" height="3" fill={accent} />
      <text x="100" y="168" textAnchor="middle" fill={accent} fontFamily="var(--font-unbounded)" fontWeight="800" fontSize="17">
        EMBERA
      </text>
      {latin && (
        <text x="100" y="186" textAnchor="middle" fill="#f6ecdf" fontFamily="var(--font-unbounded)" fontWeight="600" fontSize="6.4" letterSpacing="1.4">
          {latin}
        </text>
      )}
      {index && (
        <text x="100" y="212" textAnchor="middle" fill="#f6ecdf" opacity="0.6" fontFamily="var(--font-playfair)" fontStyle="italic" fontSize="10">
          № {index}
        </text>
      )}
      {/* блики */}
      <rect x="50" y="66" width="7" height="186" rx="3.5" fill="#fff" opacity="0.22" />
      <rect x="61" y="70" width="2" height="170" rx="1" fill="#fff" opacity="0.18" />
      <rect x="146" y="72" width="3" height="170" rx="1.5" fill="#fff" opacity="0.12" />
      {/* крышка */}
      <rect x="45" y="22" width="110" height="38" rx="7" fill={`url(#${id}l)`} />
      {Array.from({ length: 26 }).map((_, i) => (
        <rect key={i} x={49 + i * 4} y="25" width="1.4" height="32" fill="#fff" opacity="0.07" />
      ))}
      <rect x="45" y="55" width="110" height="2.4" fill={accent} />
    </svg>
  );
}
