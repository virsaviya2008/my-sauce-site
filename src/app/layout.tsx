import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display, Unbounded } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

const display = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
});

const sans = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

const serif = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "EMBERA — Соусы с характером",
  description:
    "Ремесленные соусы малыми партиями: копчёный чипотле, чёрный чеснок, хабанеро-манго и соевая карамель. 90 дней ферментации. Огонь без компромиссов.",
};

export const viewport: Viewport = {
  themeColor: "#0a0705",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${sans.variable} ${serif.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
