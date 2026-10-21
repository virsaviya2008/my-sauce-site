import type { Ingredient } from "@/lib/data";

const stroke = { stroke: "#f6ecdf", strokeWidth: 1.6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Стилизованные иллюстрации ингредиентов в оранжево-чёрной гамме */
export function IngredientArt({ icon, className }: { icon: Ingredient["icon"]; className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <linearGradient id={`ing-${icon}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb000" />
          <stop offset="0.5" stopColor="#ff5a00" />
          <stop offset="1" stopColor="#7a1a00" />
        </linearGradient>
      </defs>
      {icon === "chili" && (
        <>
          <path d="M72 46 C130 38 172 86 160 150 C154 182 128 196 104 190 C126 168 130 132 112 104 C100 84 82 74 72 46 Z" fill={`url(#ing-${icon})`} />
          <path d="M72 46 C66 34 70 22 84 16 M72 46 C82 40 92 40 98 46" {...stroke} />
          <path d="M120 70 C140 84 150 110 146 136" {...stroke} opacity={0.5} />
          {[...Array(6)].map((_, i) => (
            <path key={i} d={`M${30 + i * 6} ${150 - i * 14} q 8 -6 2 -14`} {...stroke} opacity={0.35} />
          ))}
        </>
      )}
      {icon === "garlic" && (
        <>
          <path d="M100 30 C104 62 158 78 160 132 C162 176 128 188 100 188 C72 188 38 176 40 132 C42 78 96 62 100 30 Z" fill="#120c08" stroke="#ff8a1f" strokeWidth="2" />
          <path d="M100 52 C92 90 86 140 100 186 M100 52 C108 90 114 140 100 186 M100 60 C72 92 60 140 74 182 M100 60 C128 92 140 140 126 182" {...stroke} opacity={0.6} />
          <ellipse cx="100" cy="186" rx="34" ry="6" fill="url(#ing-garlic)" opacity={0.8} />
        </>
      )}
      {icon === "habanero" && (
        <>
          <path d="M100 48 C152 44 176 96 164 140 C154 176 124 192 100 192 C76 192 46 176 36 140 C24 96 48 44 100 48 Z" fill={`url(#ing-${icon})`} />
          <path d="M70 60 C60 100 64 150 82 186 M130 60 C140 100 136 150 118 186 M100 50 C98 100 98 150 100 190" {...stroke} opacity={0.45} />
          <path d="M100 48 C98 34 106 22 120 18" {...stroke} strokeWidth={3} />
        </>
      )}
      {icon === "soy" && (
        <>
          <path d="M34 120 C40 70 110 42 166 64 C176 70 172 84 160 86 C116 82 72 108 56 140 C50 152 30 146 34 120 Z" fill="#1b120c" stroke="#ff8a1f" strokeWidth="2" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={74 + i * 30} cy={100 - i * 12} r={14} fill={`url(#ing-${icon})`} />
          ))}
          <path d="M100 180 C80 160 92 146 104 140 C120 150 124 166 100 180 Z" fill="#ff5a00" />
          <path d="M104 140 C102 120 112 110 122 106" {...stroke} />
        </>
      )}
      {icon === "sugar" && (
        <>
          {[
            [60, 110],
            [110, 110],
            [85, 66],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M0 14 L30 0 L60 14 L30 28 Z" fill="#ffb000" />
              <path d="M0 14 L30 28 L30 64 L0 50 Z" fill="#ff5a00" />
              <path d="M60 14 L30 28 L30 64 L60 50 Z" fill="#7a1a00" />
            </g>
          ))}
          {[...Array(14)].map((_, i) => (
            <circle key={i} cx={40 + ((i * 37) % 130)} cy={176 + ((i * 13) % 14)} r={1.8} fill="#f6ecdf" opacity={0.6} />
          ))}
        </>
      )}
      {icon === "salt" && (
        <>
          <path d="M60 30 C40 50 80 60 60 82 M100 22 C80 46 122 56 100 82 M140 30 C120 50 160 60 140 82" {...stroke} opacity={0.5} />
          {[
            "M40 150 L70 112 L104 138 L86 176 Z",
            "M96 160 L120 108 L160 128 L150 170 Z",
            "M70 186 L84 150 L118 164 L108 192 Z",
          ].map((d, i) => (
            <path key={i} d={d} fill={i === 1 ? `url(#ing-${icon})` : "#f6ecdf"} stroke="#0a0705" strokeWidth="1.5" opacity={i === 1 ? 1 : 0.9} />
          ))}
        </>
      )}
    </svg>
  );
}
