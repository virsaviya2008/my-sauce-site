# EMBERA — Sauce Atelier

Промо-лендинг и магазин бренда ремесленных соусов.
Next.js 16 · Tailwind CSS 4 · React Three Fiber · GSAP ScrollTrigger · Framer Motion · Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Структура

| Путь | Что внутри |
| --- | --- |
| `src/lib/data.ts` | Вкусы, цены, ингредиенты, главы истории — весь контент |
| `src/lib/store.ts` | Мутируемый стор: через него GSAP управляет 3D-банкой без ререндеров |
| `src/components/Experience.tsx` | Корень страницы и хореография банки по секциям |
| `src/components/three/` | Сцена: банка (lathe-стекло, соус, этикетка на canvas), пар, специи, свечение |
| `src/components/sections/` | Hero, История, Бегущая строка, Вкусы, Магазин, Ингредиенты, Цифры, Футер |
| `src/components/cart/` | Корзина (context + localStorage), выдвижная панель, тосты |

Вся 3D-графика процедурная: нет внешних моделей и HDR-файлов, этикетки рисуются в canvas
шрифтами сайта.
