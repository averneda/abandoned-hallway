// Pantalla de título: el cartel que dibujó Elora (assets/referencias/titulo-abandoned-holeway.webp)
// hecho con código: la mancha roja garabateada, las letras blancas que gotean,
// la criatura con los ojos llorando sangre y el suelo con trastos.

import { VIEW_W, VIEW_H } from './config.js';

// Aleatorio "fijo": la misma semilla da siempre el mismo número, para que el cartel no baile.
function sr(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }

const HORIZON = 402;

export class Title {
  constructor() { this.time = 0; }

  update(dt) { this.time += dt; }

  render(ctx) {
    const bg = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, 60, VIEW_W / 2, VIEW_H / 2, 560);
    bg.addColorStop(0, '#1a0d12'); bg.addColorStop(1, '#07060a');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    this.drawFloor(ctx);
    this.drawBlob(ctx);
    this.drawTitle(ctx);
    this.drawCreature(ctx);
  }

  // Suelo con horizonte curvado y cuadraditos naranjas y marrones (los trastos del dibujo).
  drawFloor(ctx) {
    ctx.fillStyle = '#131019';
    ctx.beginPath();
    ctx.moveTo(0, HORIZON + 14);
    ctx.quadraticCurveTo(VIEW_W / 2, HORIZON - 14, VIEW_W, HORIZON + 14);
    ctx.lineTo(VIEW_W, VIEW_H); ctx.lineTo(0, VIEW_H); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#332b3a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, HORIZON + 14); ctx.quadraticCurveTo(VIEW_W / 2, HORIZON - 14, VIEW_W, HORIZON + 14); ctx.stroke();

    const cols = ['#b8722e', '#a05a22', '#7c451c', '#8a5a28', '#c98a3c'];
    for (let i = 0; i < 30; i++) {
      const x = 30 + sr(i * 3 + 1) * (VIEW_W - 60);
      const y = HORIZON - 24 + sr(i * 3 + 2) * (VIEW_H - HORIZON + 4);
      // más pequeños y apagados cuanto más lejos (más arriba)
      const deep = Math.max(0.35, Math.min(1, (y - (HORIZON - 30)) / 160));
      const s = (9 + sr(i * 3 + 3) * 16) * deep;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((sr(i * 7 + 4) - 0.5) * 0.5);
      ctx.globalAlpha = 0.5 + deep * 0.5;
      ctx.fillStyle = cols[i % cols.length];
      ctx.fillRect(-s / 2, -s / 2, s, s);
      ctx.strokeStyle = 'rgba(30,18,8,0.8)'; ctx.lineWidth = 1.5;
      ctx.strokeRect(-s / 2, -s / 2, s, s);
      ctx.beginPath();
      ctx.moveTo(-s / 2 + 2, -s / 6); ctx.lineTo(s / 2 - 2, -s / 6);
      ctx.moveTo(-s / 2 + 2, s / 6); ctx.lineTo(s / 2 - 2, s / 6);
      ctx.stroke();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  // El borde ondulado de la mancha, como recortado a mano.
  blobPath(ctx) {
    const cx = 480, cy = 185, rx = 345, ry = 168, N = 24;
    const pts = [];
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const k = 1 + (sr(i * 5 + 9) - 0.5) * 0.22;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    ctx.beginPath();
    let m = mid(pts[N - 1], pts[0]);
    ctx.moveTo(m[0], m[1]);
    for (let i = 0; i < N; i++) {
      const p = pts[i], m2 = mid(p, pts[(i + 1) % N]);
      ctx.quadraticCurveTo(p[0], p[1], m2[0], m2[1]);
    }
    ctx.closePath();
  }

  // La mancha roja rellena de rayajos inclinados, como pintada con lápiz de cera.
  drawBlob(ctx) {
    ctx.save();
    this.blobPath(ctx);
    ctx.fillStyle = '#9c1420';
    ctx.fill();
    ctx.clip();
    ctx.lineCap = 'round';
    for (let i = 0; i < 150; i++) {
      const x = 100 + sr(i * 11 + 31) * 760;
      const y = sr(i * 11 + 32) * 380;
      const len = 60 + sr(i * 11 + 33) * 150;
      const a = -0.65 + (sr(i * 11 + 34) - 0.5) * 0.25;
      const c = i % 3;
      ctx.strokeStyle = c === 0 ? 'rgba(206,44,58,0.55)' : c === 1 ? 'rgba(128,12,22,0.5)' : 'rgba(235,90,100,0.35)';
      ctx.lineWidth = 2.5 + sr(i * 11 + 35) * 3;
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2);
      ctx.lineTo(x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2);
      ctx.stroke();
    }
    ctx.restore();
    this.blobPath(ctx);
    ctx.strokeStyle = '#43333c';
    ctx.lineWidth = 3.5;
    ctx.stroke();
  }

  drawTitle(ctx) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    this.titleLine(ctx, 'ABANDONED', 480, 98, 82, 0);
    this.titleLine(ctx, 'HOLE', 480, 202, 94, 40);
    this.titleLine(ctx, 'WAY', 480, 303, 100, 80);
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }

  // Una línea del título: letra a letra, cada una un poco torcida y con gotas que caen.
  titleLine(ctx, text, cx, cy, size, seed) {
    ctx.font = `900 ${size}px "Segoe UI", Arial, sans-serif`;
    const gap = size * 0.06;
    const ws = [...text].map((c) => ctx.measureText(c).width);
    const total = ws.reduce((a, b) => a + b, 0) + gap * (text.length - 1);
    let x = cx - total / 2;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], w = ws[i];
      const jy = (sr(seed + i * 13 + 2) - 0.5) * size * 0.16;
      const rot = (sr(seed + i * 13 + 3) - 0.5) * 0.12;
      ctx.save();
      ctx.translate(x + w / 2, cy + jy);
      ctx.rotate(rot);
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#3b3138'; ctx.lineWidth = size * 0.09;
      ctx.strokeText(c, 0, 0);
      const drips = 1 + Math.floor(sr(seed + i * 13 + 4) * 2);
      for (let g = 0; g < drips; g++) {
        const dx = (sr(seed + i * 13 + 5 + g * 7) - 0.5) * w * 0.55;
        const len = size * (0.14 + sr(seed + i * 13 + 6 + g * 7) * 0.26) + Math.sin(this.time * 0.8 + seed + i + g * 3) * 2;
        this.drip(ctx, dx, size * 0.26, len, size * 0.1, '#3b3138', '#f3eef2');
      }
      ctx.fillStyle = '#f3eef2';
      ctx.fillText(c, 0, 0);
      ctx.restore();
      x += w + gap;
    }
  }

  // Una gota colgando: contorno oscuro y relleno claro.
  drip(ctx, x, y, len, w, dark, light) {
    ctx.lineCap = 'round';
    ctx.strokeStyle = dark; ctx.lineWidth = w + 5;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + len); ctx.stroke();
    ctx.strokeStyle = light; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + len); ctx.stroke();
  }

  // La criatura del dibujo: cabeza blanca con hocico, una oreja puntiaguda
  // y dos ojazos negros llorando sangre, asomando sobre el horizonte.
  drawCreature(ctx) {
    const cx = 480, cy = 378;
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#efe9e2'; ctx.strokeStyle = '#4a4448'; ctx.lineWidth = 3;
    // oreja
    ctx.beginPath(); ctx.moveTo(cx + 32, cy - 30); ctx.lineTo(cx + 63, cy - 76); ctx.lineTo(cx + 73, cy - 26); ctx.closePath();
    ctx.fill(); ctx.stroke();
    // cabeza
    ctx.beginPath(); ctx.ellipse(cx, cy, 80, 56, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // hocico hacia abajo a la izquierda, con su agujerito de nariz
    ctx.beginPath(); ctx.ellipse(cx - 62, cy + 28, 36, 22, 0.35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#4a4448';
    ctx.beginPath(); ctx.arc(cx - 88, cy + 32, 3, 0, Math.PI * 2); ctx.fill();
    // ojos negros enormes
    ctx.fillStyle = '#17141a';
    ctx.beginPath(); ctx.arc(cx - 26, cy - 8, 27, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + 36, cy - 8, 27, 0, Math.PI * 2); ctx.fill();
    // lágrimas de sangre (se mueven un pelín)
    const b = Math.sin(this.time * 0.9) * 2;
    this.drip(ctx, cx - 34, cy + 12, 24 + b, 6, '#6e0a10', '#c4161f');
    this.drip(ctx, cx - 20, cy + 14, 13, 5, '#6e0a10', '#c4161f');
    this.drip(ctx, cx + 28, cy + 12, 27 + b, 6, '#6e0a10', '#c4161f');
    this.drip(ctx, cx + 44, cy + 14, 12, 5, '#6e0a10', '#c4161f');
    ctx.restore();
  }
}
