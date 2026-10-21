import * as THREE from "three";
import type { Flavor } from "@/lib/data";

function fontVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function spacing(ctx: CanvasRenderingContext2D, px: number) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${px}px`;
}

function speckle(ctx: CanvasRenderingContext2D, w: number, h: number, n: number) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = `rgba(255,${(170 + Math.random() * 70) | 0},120,${Math.random() * 0.06})`;
    const s = Math.random() * 2.5 + 0.5;
    ctx.fillRect(Math.random() * w, Math.random() * h, s, s);
  }
}

function flame(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y - s);
  ctx.bezierCurveTo(x + s * 0.9, y - s * 0.2, x + s * 0.7, y + s * 0.8, x, y + s * 0.8);
  ctx.bezierCurveTo(x - s * 0.7, y + s * 0.8, x - s * 0.8, y, x - s * 0.15, y - s * 0.35);
  ctx.bezierCurveTo(x - s * 0.1, y + s * 0.05, x + s * 0.2, y - s * 0.2, x, y - s);
  ctx.closePath();
}

/** Рисует этикетку 2048×672 — развёртка на дугу ~234° цилиндра */
export function drawLabel(canvas: HTMLCanvasElement, f: Flavor) {
  const W = 2048;
  const H = 672;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const display = fontVar("--font-unbounded", "sans-serif");
  const serif = fontVar("--font-playfair", "serif");
  const sans = fontVar("--font-manrope", "sans-serif");

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#16110d");
  bg.addColorStop(1, "#070504");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  speckle(ctx, W, H, 9000);

  // Кант
  ctx.fillStyle = f.accent;
  ctx.fillRect(0, 0, W, 16);
  ctx.fillRect(0, H - 16, W, 16);
  ctx.strokeStyle = f.accent;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 2;
  ctx.strokeRect(46, 50, W - 92, H - 100);
  ctx.globalAlpha = 1;

  // Разделители
  ctx.fillStyle = "rgba(246,236,223,0.18)";
  ctx.fillRect(590, 90, 2, H - 180);
  ctx.fillRect(W - 592, 90, 2, H - 180);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Центр
  ctx.fillStyle = "rgba(246,236,223,0.65)";
  ctx.font = `italic 400 44px ${serif}`;
  spacing(ctx, 2);
  ctx.fillText(`Sauce Atelier — № ${f.index}`, W / 2, 158);

  ctx.fillStyle = f.accent;
  ctx.font = `800 176px ${display}`;
  spacing(ctx, -4);
  ctx.fillText("EMBERA", W / 2, 345);

  ctx.fillStyle = "#f6ecdf";
  ctx.font = `600 50px ${display}`;
  spacing(ctx, 10);
  ctx.fillText(f.latin, W / 2, 440);

  // Шкала остроты
  ctx.font = `700 26px ${sans}`;
  spacing(ctx, 8);
  ctx.fillStyle = "rgba(246,236,223,0.6)";
  ctx.fillText("HEAT", W / 2 - 190, 545);
  for (let i = 0; i < 5; i++) {
    flame(ctx, W / 2 - 80 + i * 66, 532, 26);
    if (i < f.heat) {
      ctx.fillStyle = f.accent;
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(246,236,223,0.35)";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }

  // Левая панель
  ctx.fillStyle = "#f6ecdf";
  ctx.font = `800 120px ${display}`;
  spacing(ctx, -2);
  ctx.fillText(f.index, 318, 260);
  ctx.font = `700 24px ${sans}`;
  spacing(ctx, 7);
  ctx.fillStyle = f.accent;
  ctx.fillText("SMALL BATCH", 318, 340);
  ctx.fillStyle = "rgba(246,236,223,0.7)";
  ctx.fillText("FERMENTED 90 DAYS", 318, 385);
  ctx.fillText("HAND SEALED", 318, 430);
  ctx.font = `italic 400 38px ${serif}`;
  spacing(ctx, 0);
  ctx.fillStyle = "rgba(246,236,223,0.55)";
  ctx.fillText("est. 2019", 318, 530);

  // Правая панель
  const rx = W - 318;
  ctx.font = `700 24px ${sans}`;
  spacing(ctx, 7);
  ctx.fillStyle = "rgba(246,236,223,0.7)";
  ctx.fillText("NET VOL.", rx, 170);
  ctx.fillStyle = "#f6ecdf";
  ctx.font = `800 74px ${display}`;
  spacing(ctx, -1);
  ctx.fillText("250", rx, 260);
  ctx.font = `700 24px ${sans}`;
  spacing(ctx, 7);
  ctx.fillStyle = f.accent;
  ctx.fillText(f.scoville, rx, 315);
  // Штрихкод
  let bx = rx - 140;
  ctx.fillStyle = "#f6ecdf";
  while (bx < rx + 140) {
    const w = Math.random() > 0.6 ? 6 : 3;
    ctx.fillRect(bx, 380, w, 110);
    bx += w + (Math.random() > 0.5 ? 5 : 3);
  }
  ctx.font = `600 20px ${sans}`;
  spacing(ctx, 6);
  ctx.fillText("4 607 1190 " + f.index + "019", rx, 528);
}

export function createLabelTexture(f: Flavor) {
  const canvas = document.createElement("canvas");
  drawLabel(canvas, f);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Круглая печать на крышке */
export function drawLid(canvas: HTMLCanvasElement) {
  const S = 1024;
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const display = fontVar("--font-unbounded", "sans-serif");
  const c = S / 2;

  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "#1d1612");
  g.addColorStop(1, "#060403");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  speckle(ctx, S, S, 4000);

  ctx.strokeStyle = "#ff5a00";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(c, c, 455, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(c, c, 330, 0, Math.PI * 2);
  ctx.stroke();

  const text = "EMBERA • SAUCE ATELIER • HANDMADE • EST. 2019 • ";
  ctx.fillStyle = "#f6ecdf";
  ctx.font = `700 46px ${display}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const step = (Math.PI * 2) / text.length;
  for (let i = 0; i < text.length; i++) {
    const a = i * step - Math.PI / 2;
    ctx.save();
    ctx.translate(c + Math.cos(a) * 392, c + Math.sin(a) * 392);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(text[i], 0, 0);
    ctx.restore();
  }

  flame(ctx, c, c - 20, 170);
  const fg = ctx.createLinearGradient(c, c - 190, c, c + 140);
  fg.addColorStop(0, "#ffb000");
  fg.addColorStop(1, "#ff4400");
  ctx.fillStyle = fg;
  ctx.fill();
}

export function createLidTexture() {
  const canvas = document.createElement("canvas");
  drawLid(canvas);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
