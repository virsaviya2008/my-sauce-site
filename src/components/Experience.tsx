"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setPaused, store } from "@/lib/store";
import { CartProvider } from "./cart/CartContext";
import { CartDrawer, CartToast } from "./cart/CartDrawer";
import { Nav } from "./Nav";
import { Flavors } from "./sections/Flavors";
import { Footer, Numbers } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Ingredients } from "./sections/Ingredients";
import { Marquee } from "./sections/Marquee";
import { Products } from "./sections/Products";
import { Story } from "./sections/Story";
import { SmoothScroll, useLenis } from "./SmoothScroll";
import { Backdrop, Grain } from "./ui/Backdrop";
import { Preloader } from "./ui/Preloader";

const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

/** Связывает положение 3D-банки с секциями страницы */
function Choreography({ ready }: { ready: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!ready) return;
    lenis?.start();
    gsap.to(store.jar, { intro: 1, duration: 1.6, ease: "expo.out" });
    ScrollTrigger.refresh();
  }, [ready, lenis]);

  useGSAP(() => {
    const j = store.jar;
    const P = Math.PI;

    // Hero → история: банка уходит вправо
    gsap.fromTo(j, { x: 0, scale: 1, spin: 0 }, {
      x: 0.42, scale: 0.84, spin: P, ease: "none", immediateRender: false,
      scrollTrigger: { trigger: "#story", start: "top bottom", end: "top top", scrub: true },
    });

    // История: оборот и ритуальное открытие крышки в третьей главе
    const tl = gsap.timeline({
      scrollTrigger: { trigger: "#story", start: "top top", end: "bottom bottom", scrub: true },
    });
    tl.fromTo(j, { spin: P }, { spin: P * 3, duration: 1, ease: "none", immediateRender: false }, 0)
      .fromTo(j, { lid: 0 }, { lid: 1, duration: 0.2, ease: "power2.inOut", immediateRender: false }, 0.68);

    // История → вкусы: банка перелетает влево, крышка закрывается
    gsap.fromTo(j, { x: 0.42, lid: 1, spin: P * 3, scale: 0.84 }, {
      x: -0.42, lid: 0, spin: P * 4, scale: 0.92, ease: "none", immediateRender: false,
      scrollTrigger: { trigger: "#flavors", start: "top bottom", end: "top top", scrub: true },
    });

    // Магазин полностью перекрыл сцену — ставим рендер на паузу
    ScrollTrigger.create({
      trigger: "#shop",
      start: "top top",
      endTrigger: "html",
      end: "bottom bottom",
      onToggle: (self) => setPaused(self.isActive),
    });
  });

  return null;
}

export default function Experience() {
  const [ready, setReady] = useState(false);

  return (
    <CartProvider>
      <SmoothScroll>
        <Preloader onDone={() => setReady(true)} />
        <Choreography ready={ready} />
        <Backdrop />
        <Scene />
        <Nav ready={ready} />
        <main className="relative">
          <Hero ready={ready} />
          <Story />
          <Marquee />
          <Flavors />
          <Products />
          <Ingredients />
          <Numbers />
          <Footer />
        </main>
        <CartDrawer />
        <CartToast />
        <Grain />
      </SmoothScroll>
    </CartProvider>
  );
}
