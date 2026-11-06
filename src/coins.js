// Las tres monedas del juego, dibujadas por Elora (assets/referencias/objetos/monedas.webp):
//   bronce: marrón, con un 1 y manchas verdes de óxido      → vale 1
//   metal:  gris metálico, con un 2 y manchas marrones de óxido → vale 2
//   oro:    amarilla, con un 3 y manchas rojas de sangre     → vale 3
// Cuánto vale cada una y cuántas salen de cada tipo: COINS.kinds en src/config.js.

import { COINS } from './config.js';

const LOOK = {
  bronce: { base: '#b9784c', light: '#d89b6e', num: '#7a4524', spot: '#3f8f4a' },
  metal:  { base: '#b8bcc4', light: '#dfe2e8', num: '#3a3a40', spot: '#b8682c' },
  oro:    { base: '#e2b93a', light: '#f7dc74', num: '#a77d0e', spot: '#d42a2a' },
};

// Cómo es el óxido (Elora: que se note que es óxido): manchas con forma irregular, el borde más
// oscuro, y puntitos rugosos claros y oscuros dentro y alrededor.
//   bronce: óxido verde (cardenillo).   metal: óxido marrón anaranjado.
const OXIDO = {
  bronce: { dark: '#1f5a2a', light: '#8fd09a' },
  metal:  { dark: '#6e3510', light: '#e8a462' },
};

// Número "al azar" pero siempre el mismo para la misma mancha (así el óxido no baila).
function ruido(a, b) { const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v); }

// Una mancha con el borde irregular, alrededor de (x, y) y de radio r más o menos.
function manchaIrregular(ctx, x, y, r, semilla) {
  const n = 9, pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = r * (0.7 + ruido(semilla, i) * 0.5);
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  ctx.beginPath();
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let m = mid(pts[n - 1], pts[0]);
  ctx.moveTo(m[0], m[1]);
  for (let i = 0; i < n; i++) {
    m = mid(pts[i], pts[(i + 1) % n]);
    ctx.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]);
  }
  ctx.closePath();
}

// Manchas (óxido o sangre) en el sitio más o menos donde las pintó Elora: [x, y, radio], en una moneda de radio 7.
const SPOTS = {
  bronce: [[-3.2, -4.2, 1.9], [4.5, -2.5, 1.4], [-0.5, 3.6, 1.3], [5, 3.2, 2.1], [-6, 1.5, 1.6]],
  metal:  [[-2.5, -3.5, 2.2], [5, -3, 2], [-4.5, 4.5, 2.4], [4, 3.6, 1]],
  oro:    [[-1.5, -4, 2.6], [5.8, -0.5, 2.2], [1, 3.6, 1.2], [-4, 5.6, 2.2], [-6.4, -3, 1.2]],
};

// Elige de qué tipo es una moneda, al azar según COINS.kinds (rand: función que da un número entre 0 y 1).
export function pickCoinKind(rand) {
  const kinds = Object.entries(COINS.kinds);
  const total = kinds.reduce((s, [, k]) => s + k.chance, 0);
  let r = rand() * total;
  for (const [id, k] of kinds) { r -= k.chance; if (r < 0) return id; }
  return kinds[0][0];
}

export function coinValue(kind) { return (COINS.kinds[kind] || COINS.kinds.bronce).value; }

// Dibuja una moneda en (x, y). w y h son el ancho y el alto (la moneda gira: w cambia).
export function drawCoin(ctx, x, y, kind, w, h) {
  const L = LOOK[kind] || LOOK.bronce;
  const R = 7;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(Math.max(0.05, w / R), h / R);
  // la moneda
  ctx.fillStyle = L.base;
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.clip();
  // brillo
  ctx.fillStyle = L.light;
  ctx.beginPath(); ctx.arc(-2, -2.5, 4.5, 0, Math.PI * 2); ctx.fill();
  const ox = OXIDO[kind];
  if (ox) {
    // óxido: manchas irregulares con el borde oscuro y puntitos rugosos
    (SPOTS[kind] || []).forEach(([sx, sy, sr], k) => {
      ctx.fillStyle = ox.dark; manchaIrregular(ctx, sx, sy, sr * 1.12, k + 1); ctx.fill();
      ctx.fillStyle = L.spot; manchaIrregular(ctx, sx - 0.15, sy - 0.15, sr * 0.88, k + 1); ctx.fill();
      for (let i = 0; i < 7; i++) {
        // puntitos dentro de la mancha (cada uno en su propio trazo)
        const a = ruido(k, i + 10) * Math.PI * 2, d = ruido(k, i + 20) * sr * 0.75;
        ctx.fillStyle = i % 2 ? ox.light : ox.dark;
        ctx.beginPath(); ctx.arc(sx + Math.cos(a) * d, sy + Math.sin(a) * d, 0.22 + ruido(k, i + 30) * 0.28, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < 4; i++) {
        // y unos pocos sueltos alrededor, como si el óxido se extendiera
        const a = ruido(k, i + 40) * Math.PI * 2, d = sr * (1.15 + ruido(k, i + 50) * 0.6);
        ctx.fillStyle = i % 2 ? L.spot : ox.dark;
        ctx.beginPath(); ctx.arc(sx + Math.cos(a) * d, sy + Math.sin(a) * d, 0.25 + ruido(k, i + 60) * 0.3, 0, Math.PI * 2); ctx.fill();
      }
    });
  } else {
    // sangre (cada mancha en su propio trazo)
    ctx.fillStyle = L.spot;
    for (const [sx, sy, sr] of SPOTS[kind] || []) { ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
  // el número (solo si se ve la moneda de frente, no de canto)
  if (w > 3) {
    ctx.fillStyle = L.num;
    ctx.font = 'bold 10px "Segoe UI", system-ui, Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String(coinValue(kind)), 0, 0.8);
  }
  // borde
  ctx.strokeStyle = 'rgba(30, 20, 15, 0.85)'; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}
