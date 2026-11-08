// El minijuego del árbol de Navidad (idea del padre de Elora; Elora lo pensó todo con Clad, noviembre 2026).
//
// En Navidad, por los pasillos salen adornos (de 5 a 10 por pasillo). Se cogen y van a tu inventario. En el
// lobby, al darle al árbol (E o Start), sale el árbol en grande con el inventario a la izquierda, y lo decoras.
// Cada adorno vale unos puntos (cuantos más puntos, más raro es). Al poner algo en la punta, los puntos de los
// adornos nuevos se convierten en monedas: 1 punto = 1 moneda. El árbol se queda decorado en el lobby; si
// vuelves, se quita la punta y puedes seguir. Un adorno puesto se puede mover; si lo quitas, se pierde.
//
// Todo se dibuja aquí con código, en un árbol de «unidades»: el (0, 0) es el pie de la maceta y el árbol mide
// unas 66 unidades de alto (el del lobby las pinta a 2,5 px cada una).

import { drawCharacter, characterById } from './characters.js';

// ---- los adornos (Elora). puntos: lo que vale; sec: la sección del inventario
export const ADORNOS = [
  // básicos (1 punto)
  { id: 'bola-roja', puntos: 1 }, { id: 'bola-verde', puntos: 1 }, { id: 'bola-azul', puntos: 1 }, { id: 'bola-dorada', puntos: 1 },
  { id: 'regalo-rojo', puntos: 1 }, { id: 'regalo-azul', puntos: 1 }, { id: 'baston', puntos: 1 }, { id: 'guirnalda', puntos: 1 },
  // 2 puntos
  { id: 'angelito', puntos: 2 }, { id: 'galleta', puntos: 2 },
  // 3 puntos: cabezas de animales de ganchillo (Elora)
  { id: 'ganchillo-gato', puntos: 3 }, { id: 'ganchillo-oso', puntos: 3 }, { id: 'ganchillo-conejo', puntos: 3 },
  // 5 puntos: cosas de los personajes (Elora)
  { id: 'lazo-carot', puntos: 5 }, { id: 'pintura-caty', puntos: 5 }, { id: 'monopatin-gec', puntos: 5 },
  { id: 'cinta-tarda', puntos: 5 }, { id: 'lazo-chop', puntos: 5 }, { id: 'llamita-drake', puntos: 5 },
  { id: 'burbuja-jely', puntos: 5 }, { id: 'mando-oct', puntos: 5 }, { id: 'maceta-hoppy', puntos: 5 },
  { id: 'nenufar-froggy', puntos: 5 }, { id: 'movil-draila', puntos: 5 },
  // 10 puntos: peluches de los personajes (Elora)
  ...['carot', 'froggy', 'oct', 'tarda', 'gek', 'draila', 'katy', 'jely', 'hoppy', 'drake', 'reno']
    .map((pj) => ({ id: 'peluche-' + pj, puntos: 10, sec: 'peluches', pj })),
  // 10 puntos: las luces (Elora: otra sección; en el árbol solo puede haber unas a la vez)
  { id: 'luces-amarillas', puntos: 10, sec: 'luces' }, { id: 'luces-arcoiris', puntos: 10, sec: 'luces' },
  { id: 'luces-nieve', puntos: 10, sec: 'luces' }, { id: 'luces-rojiverdes', puntos: 10, sec: 'luces' },
  { id: 'luces-bloodie', puntos: 10, sec: 'luces' },
  // cosas grandes para poner debajo del árbol, junto a la maceta (Elora): de 10 a 50 puntos, más raras todavía
  { id: 'gigante-rojo', puntos: 10, sec: 'grandes' }, { id: 'gigante-azul', puntos: 10, sec: 'grandes' },
  { id: 'gigante-verde', puntos: 10, sec: 'grandes' }, { id: 'calcetin', puntos: 10, sec: 'grandes' },
  { id: 'leche-galletas', puntos: 10, sec: 'grandes' },
  { id: 'muneco-nieve', puntos: 20, sec: 'grandes' }, { id: 'tren', puntos: 20, sec: 'grandes' }, { id: 'caja-musica', puntos: 20, sec: 'grandes' },
  { id: 'trineo', puntos: 30, sec: 'grandes' }, { id: 'caga-tio', puntos: 30, sec: 'grandes' }, { id: 'casita-jengibre', puntos: 30, sec: 'grandes' },
  { id: 'osito-gigante', puntos: 40, sec: 'grandes' }, { id: 'tele-cintas', puntos: 40, sec: 'grandes' },
  { id: 'bloodie-gigante', puntos: 50, sec: 'grandes' }, { id: 'cofre-monedas', puntos: 50, sec: 'grandes' },
];
for (const a of ADORNOS) if (!a.sec) a.sec = 'p' + a.puntos;
export const adorno = (id) => ADORNOS.find((a) => a.id === id);
export const esLuces = (id) => !!(adorno(id) && adorno(id).sec === 'luces');
export const esGrande = (id) => !!(adorno(id) && adorno(id).sec === 'grandes');
// Las secciones del inventario, en orden (Elora), y la de la punta al final
export const SECCIONES = ['p1', 'p2', 'p3', 'p5', 'peluches', 'luces', 'grandes'];

// ---- lo que va en la punta (Elora): solo sirve para terminar el árbol. La estrella la tienes siempre; las
// demás se compran en la tienda de Tarda (el precio, en ARBOL.precioPunta de config.js) y son para siempre.
export const PUNTAS = ['estrella', 'lazo', 'corazon', 'cinta', 'llamita'];

// Un adorno al azar para un pasillo (conf: ARBOL de config.js). A veces sale una cosa grande (conf.grandes.prob %);
// rareza: % de que salga cada valor
export function sortearAdorno(conf, rand = Math.random) {
  const grande = rand() * 100 < conf.grandes.prob;
  const rareza = grande ? conf.grandes.rareza : conf.rareza;
  const valores = Object.keys(rareza).map(Number);
  const total = valores.reduce((s, v) => s + rareza[v], 0);
  let r = rand() * total, valor = valores[valores.length - 1];
  for (const v of valores) { if (r < rareza[v]) { valor = v; break; } r -= rareza[v]; }
  const lista = ADORNOS.filter((a) => a.puntos === valor && (a.sec === 'grandes') === grande);
  return lista[Math.floor(rand() * lista.length)].id;
}

// Cuántos puntos da el árbol al poner la punta: solo los adornos (y las luces) que aún no se han cobrado, y el color
// de la maceta si es la primera vez que terminas el árbol con él (Elora: 3 puntos, solo una vez)
export function puntosNuevos(arbol, puntosMaceta = 3) {
  let n = 0;
  if (arbol.maceta && !(arbol.macetasCobradas || []).includes(arbol.maceta)) n += puntosMaceta;
  for (const a of arbol.adornos) if (!a.pagado && adorno(a.id)) n += adorno(a.id).puntos;
  if (arbol.luces && !arbol.luces.pagado && adorno(arbol.luces.id)) n += adorno(arbol.luces.id).puntos;
  return n;
}
export const arbolVacio = () => ({ adornos: [], luces: null, punta: null, maceta: 'marron', macetasCobradas: [] });

// ---- la forma del árbol: tres pisos de ramas [base, medio ancho, alto], de abajo arriba
export const PISOS = [[-14, 26, 24], [-30, 21, 22], [-45, 15, 20]];
export const PUNTA_Y = -66;
// ¿Está el punto (en unidades del árbol) encima de las ramas? (con un poco de margen hacia dentro)
export function dentroDelArbol(x, y) {
  return PISOS.some(([base, w, h]) => {
    const arriba = base - h;
    if (y > base - 0.5 || y < arriba + 3) return false;
    return Math.abs(x) <= w * (y - arriba) / h - 1.5;
  });
}

// Las cosas grandes van en el suelo, debajo del árbol, a los lados y delante de la maceta (Elora)
export function dentroDeAbajo(x, y) { return y >= -9 && y <= 1 && Math.abs(x) <= 29; }
export const puedeIr = (id, x, y) => (esGrande(id) ? dentroDeAbajo(x, y) : dentroDelArbol(x, y));

// ---- los colores de la maceta (Elora: muchos; se compran en la tienda de Tarda con las cosas de la punta;
// la marrón es gratis, Elora). [base, borde de arriba, dibujo]
export const MACETAS = {
  marron: ['#8a5a32', '#c99a62'], roja: ['#c0392b', '#e8c547'], azul: ['#2f6fd6', '#9fd0ff'], verde: ['#2f9a4a', '#b6f0a0'], morada: ['#7b3fc4', '#d8b6ff'],
  rosa: ['#ff6fae', '#ffd1e6'], blanca: ['#eef2f7', '#9fc4e8'], dorada: ['#d9a521', '#fff0a0'], plateada: ['#aab2bd', '#eef2f7'],
  naranja: ['#f07a24', '#ffd08a'], amarilla: ['#f2c230', '#fff4b0'], turquesa: ['#25b5b0', '#b5fff6'], negra: ['#26222b', '#e23b4a'],
  caramelo: ['#fafafa', '#e23b4a', 'rayas'], arcoiris: ['#ff4d4d', '#ffffff', 'arcoiris'], estrellas: ['#1e2b66', '#f7d75a', 'estrellas'],
  lunares: ['#e23b4a', '#ffffff', 'lunares'], bloodie: ['#5e0810', '#c0101e', 'gotas'],
};
export const MACETAS_ORDEN = Object.keys(MACETAS);
export const MACETA_GRATIS = 'marron';
export function drawMaceta(ctx, id = MACETA_GRATIS) {
  const [base, borde, dibujo] = MACETAS[id] || MACETAS[MACETA_GRATIS];
  const forma = () => { ctx.beginPath(); ctx.moveTo(-11, -12); ctx.lineTo(11, -12); ctx.lineTo(8, 0); ctx.lineTo(-8, 0); ctx.closePath(); };
  ctx.fillStyle = base; forma(); ctx.fill();
  if (dibujo) {
    ctx.save(); forma(); ctx.clip();
    if (dibujo === 'rayas') { ctx.fillStyle = '#e23b4a'; for (let x = -16; x < 14; x += 4) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 2, 0); ctx.lineTo(x + 8, -12); ctx.lineTo(x + 6, -12); ctx.closePath(); ctx.fill(); } }
    else if (dibujo === 'arcoiris') { ['#ff4d4d', '#ff9f1c', '#ffe36b', '#4cd964', '#4aa8ff', '#a46bff'].forEach((c, k) => { ctx.fillStyle = c; ctx.fillRect(-12, -12 + k * 2, 24, 2.05); }); }
    else if (dibujo === 'estrellas') { ctx.fillStyle = '#f7d75a'; for (const [x, y] of [[-6, -8], [1, -5], [6, -9], [-3, -3], [4, -2]]) { ctx.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? 0.5 : 1.2; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.fill(); } }
    else if (dibujo === 'lunares') { ctx.fillStyle = '#fff'; for (const [x, y] of [[-6, -8], [0, -6], [6, -8], [-3, -3], [3, -2.6]]) dot(ctx, x, y, 1.1); }
    else if (dibujo === 'gotas') { ctx.fillStyle = '#c0101e'; for (const [x, h] of [[-7, 4], [-2, 6], [3, 3], [7, 5]]) { ctx.fillRect(x - 0.6, -9, 1.2, h); dot(ctx, x, -9 + h, 0.9); } }
    ctx.restore();
  }
  ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.moveTo(4, -12); ctx.lineTo(11, -12); ctx.lineTo(8, 0); ctx.lineTo(3, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = borde; ctx.fillRect(-11, -12, 22, 3);
}

function dot(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

// El árbol sin nada (Elora: empieza vacío y lo decoras tú): sombra, maceta, tronco y ramas
export function drawArbolVacio(ctx, maceta) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(2, 0, 24, 6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6b4226'; ctx.fillRect(-4, -16, 8, 8);
  drawMaceta(ctx, maceta);
  for (const [base, w, h] of PISOS) {
    ctx.fillStyle = '#1f7a3a';
    ctx.beginPath(); ctx.moveTo(-w, base); ctx.lineTo(0, base - h); ctx.lineTo(w, base); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2e9a4c';   // el lado con luz
    ctx.beginPath(); ctx.moveTo(-w, base); ctx.lineTo(0, base - h); ctx.lineTo(-2, base); ctx.closePath(); ctx.fill();
    // unas ramitas en el borde de abajo
    ctx.fillStyle = '#1a6a32';
    for (let x = -w + 3; x < w - 1; x += 5) { ctx.beginPath(); ctx.moveTo(x - 2.5, base - 0.2); ctx.lineTo(x, base + 1.6); ctx.lineTo(x + 2.5, base - 0.2); ctx.closePath(); ctx.fill(); }
  }
}

// ---- las luces: una tira por piso, colgando un poco
const TIRAS = [[-22, -19, 22, -22, -12], [-17, -35, 17, -38, -29], [-11, -50, 11, -53, -45]];
function bombillas() {
  const r = [];
  TIRAS.forEach(([x0, y0, x1, y1, cy], k) => {
    const n = [9, 7, 5][k];
    for (let i = 0; i <= n; i++) {
      const u = i / n, cx = (x0 + x1) / 2;
      r.push([(1 - u) * (1 - u) * x0 + 2 * (1 - u) * u * cx + u * u * x1, (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * cy + u * u * y1]);
    }
  });
  return r;
}
const BOMBILLAS = bombillas();
const ARCOIRIS = ['#ff4d4d', '#ff9f1c', '#ffe36b', '#4cd964', '#4aa8ff', '#a46bff'];
function colorBombilla(id, i, t) {
  if (id === 'luces-amarillas') return ['#ffe36b', Math.sin(t * 2 + i) > -0.6];
  if (id === 'luces-arcoiris') return [ARCOIRIS[i % ARCOIRIS.length], Math.sin(t * 3 + i * 1.3) > -0.5];
  if (id === 'luces-nieve') return ['#eef8ff', Math.sin(t * 1.5 + i * 0.8) > -0.7];
  if (id === 'luces-rojiverdes') return [i % 2 ? '#3ee06a' : '#ff3b3b', (Math.floor(t * 2) + i) % 2 === 0];   // parpadean a la vez
  return ['#c0101e', Math.sin(t * 1.2 + i * 2.1) > -0.3];   // de Bloodie
}
export function drawLuces(ctx, id, t = 0) {
  ctx.strokeStyle = id === 'luces-bloodie' ? '#3a0508' : '#123d20'; ctx.lineWidth = 0.5;
  for (const [x0, y0, x1, y1, cy] of TIRAS) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2, cy, x1, y1); ctx.stroke(); }
  BOMBILLAS.forEach(([x, y], i) => {
    const [c, on] = colorBombilla(id, i, t);
    if (on) { ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = c; dot(ctx, x, y + 1, 2.6); ctx.restore(); }
    ctx.fillStyle = on ? c : 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.ellipse(x, y + 1, 0.9, 1.3, 0, 0, Math.PI * 2); ctx.fill();
    if (id === 'luces-bloodie' && i % 3 === 0) { ctx.fillStyle = '#8a0a14'; ctx.beginPath(); ctx.ellipse(x, y + 3.2, 0.35, 0.8, 0, 0, Math.PI * 2); ctx.fill(); }   // una gotita
  });
}
// El dibujito de unas luces para el inventario y los pasillos (en una caja de 10 x 10)
function lucesIcono(ctx, id, t) {
  ctx.strokeStyle = '#1e5a2c'; ctx.lineWidth = 0.6;
  ctx.beginPath(); ctx.moveTo(-5, -2); ctx.quadraticCurveTo(0, 4, 5, -2); ctx.stroke();
  for (let i = 0; i < 5; i++) {
    const u = i / 4, x = -5 + u * 10, y = -2 + 4 * 2 * u * (1 - u) * 1.5;
    const [c] = colorBombilla(id, i, t);
    ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y + 1.2, 1, 1.5, 0, 0, Math.PI * 2); ctx.fill();
  }
}

// ---- los dibujos de cada adorno, en una caja de 10 x 10 con el centro en (0, 0)
const BOLAS = { 'bola-roja': '#e23b4a', 'bola-verde': '#3fbf5a', 'bola-azul': '#3a8ee8', 'bola-dorada': '#f2c230' };
const REGALOS = { 'regalo-rojo': ['#e23b4a', '#f7d75a'], 'regalo-azul': ['#3a7ee8', '#f2f2f2'],
  'gigante-rojo': ['#c8202e', '#f7d75a'], 'gigante-azul': ['#2f5fd0', '#f2f2f2'], 'gigante-verde': ['#2f9a4a', '#e23b4a'] };
const GANCHILLO = { 'ganchillo-gato': ['#f0a35e', '#ffd2a6'], 'ganchillo-oso': ['#a0714f', '#d4ab88'], 'ganchillo-conejo': ['#f1eef0', '#ffc1d6'] };

function dibujo(ctx, id, t) {
  if (BOLAS[id]) {
    ctx.fillStyle = '#b8b8c0'; ctx.fillRect(-1.2, -5, 2.4, 1.6);
    ctx.fillStyle = BOLAS[id]; dot(ctx, 0, 0.5, 4.2);
    ctx.fillStyle = 'rgba(255,255,255,0.65)'; dot(ctx, -1.5, -1, 1.1);
    return;
  }
  if (REGALOS[id]) {
    const [c, cinta] = REGALOS[id];
    ctx.fillStyle = c; ctx.fillRect(-4, -2.5, 8, 7);
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(1.5, -2.5, 2.5, 7);
    ctx.fillStyle = cinta; ctx.fillRect(-0.8, -2.5, 1.6, 7); ctx.fillRect(-4, 0.4, 8, 1.4);
    ctx.beginPath(); ctx.ellipse(-1.6, -3.4, 1.6, 1, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(1.6, -3.4, 1.6, 1, 0.4, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (GANCHILLO[id]) {
    const [c, claro] = GANCHILLO[id];
    ctx.fillStyle = c;
    if (id === 'ganchillo-gato') {
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 4.2, -1); ctx.lineTo(s * 3.6, -5); ctx.lineTo(s * 1.2, -2.8); ctx.closePath(); ctx.fill(); }
    } else if (id === 'ganchillo-oso') {
      for (const s of [-1, 1]) dot(ctx, s * 3, -3.2, 1.6);
    } else {
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 1.6, -4.6, 1.1, 2.8, s * 0.15, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = claro; for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 1.6, -4.6, 0.5, 1.8, s * 0.15, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = c;
    }
    dot(ctx, 0, 0.6, 4);
    // los puntos del ganchillo
    ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 0.3;
    for (const [x, y] of [[-2.4, -1.4], [0, -2.2], [2.4, -1.4], [-3, 1], [3, 1], [-1.6, 3], [1.6, 3], [0, 0.6]]) { ctx.beginPath(); ctx.arc(x, y, 0.55, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = '#1b1720'; dot(ctx, -1.4, 0, 0.6); dot(ctx, 1.4, 0, 0.6);
    ctx.fillStyle = id === 'ganchillo-conejo' ? '#ff8fb4' : '#3a2418'; dot(ctx, 0, 1.4, 0.5);
    return;
  }
  switch (id) {
    case 'baston':
      ctx.lineCap = 'round'; ctx.lineWidth = 1.8; ctx.strokeStyle = '#fafafa';
      ctx.beginPath(); ctx.moveTo(1, 5); ctx.lineTo(1, -2); ctx.arc(-1, -2, 2, 0, Math.PI, true); ctx.stroke();
      ctx.strokeStyle = '#e23b4a'; ctx.setLineDash([1, 1.2]);
      ctx.beginPath(); ctx.moveTo(1, 5); ctx.lineTo(1, -2); ctx.arc(-1, -2, 2, 0, Math.PI, true); ctx.stroke();
      ctx.setLineDash([]);
      return;
    case 'guirnalda':
      ctx.lineCap = 'round'; ctx.lineWidth = 2; ctx.strokeStyle = '#e8c547';
      ctx.beginPath(); ctx.moveTo(-5.5, -1.5); ctx.quadraticCurveTo(0, 4, 5.5, -1.5); ctx.stroke();
      ctx.fillStyle = '#fff3a0'; for (const [x, y] of [[-4, 0], [-1.5, 1.6], [1.5, 1.6], [4, 0]]) dot(ctx, x, y, 0.5);
      return;
    case 'angelito':
      ctx.fillStyle = 'rgba(220,235,255,0.9)';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 2.8, 0, 2.2, 1.3, s * -0.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.moveTo(0, -1.5); ctx.lineTo(3, 4.6); ctx.lineTo(-3, 4.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f5cfa8'; dot(ctx, 0, -2.6, 1.8);
      ctx.strokeStyle = '#f5d24a'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.ellipse(0, -5, 1.8, 0.6, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#1b1720'; dot(ctx, -0.6, -2.7, 0.25); dot(ctx, 0.6, -2.7, 0.25);
      return;
    case 'galleta':
      ctx.fillStyle = '#b8743c';
      dot(ctx, 0, -2.8, 2);
      ctx.beginPath(); ctx.moveTo(-1.6, -1.2); ctx.lineTo(1.6, -1.2); ctx.lineTo(4, 0.6); ctx.lineTo(3.4, 1.6); ctx.lineTo(1.6, 0.8);
      ctx.lineTo(2.6, 4.8); ctx.lineTo(1, 5); ctx.lineTo(0, 2.6); ctx.lineTo(-1, 5); ctx.lineTo(-2.6, 4.8); ctx.lineTo(-1.6, 0.8);
      ctx.lineTo(-3.4, 1.6); ctx.lineTo(-4, 0.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff'; dot(ctx, -0.7, -3, 0.35); dot(ctx, 0.7, -3, 0.35); dot(ctx, 0, 0.6, 0.4); dot(ctx, 0, 2, 0.4);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.arc(0, -2.4, 0.9, 0.3, Math.PI - 0.3); ctx.stroke();
      return;
    case 'lazo-carot':   // el lazo rosa de Carot
      ctx.fillStyle = '#ff5fa2';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(s * 4.6, -3); ctx.lineTo(s * 4.6, 3); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = '#e0408a'; dot(ctx, 0, 0, 1.3);
      return;
    case 'lazo-chop':    // el lazo de regalo de su cuerno: rosa clarito, con las colas colgando
      ctx.fillStyle = '#ff9fd0';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 2.4, -1.6, 2.6, 1.6, s * -0.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(-0.6, 0); ctx.lineTo(-2.6, 4.6); ctx.lineTo(-1.2, 4); ctx.lineTo(0, 0.6); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(0.6, 0); ctx.lineTo(2.6, 4.6); ctx.lineTo(1.2, 4); ctx.lineTo(0, 0.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f07fbc'; dot(ctx, 0, -0.6, 1.1);
      return;
    case 'pintura-caty':   // un bote de pintura fosforita
      ctx.fillStyle = '#b6ff3b'; ctx.beginPath(); ctx.ellipse(0, -2.6, 3.6, 1.1, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c9ccd4'; ctx.fillRect(-3.6, -2.6, 7.2, 6.8);
      ctx.fillStyle = '#b6ff3b'; ctx.fillRect(-3.6, -2.6, 7.2, 2.2); ctx.beginPath(); ctx.ellipse(-1.6, -0.4, 0.7, 1.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#9aa0ab'; ctx.beginPath(); ctx.ellipse(0, 4.2, 3.6, 1, 0, 0, Math.PI); ctx.fill();
      ctx.strokeStyle = '#8a8f99'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.arc(0, -3, 4.2, Math.PI, 0); ctx.stroke();
      return;
    case 'monopatin-gec':   // su monopatín
      ctx.fillStyle = '#3a9a4a'; ctx.beginPath(); ctx.moveTo(-5, -1); ctx.lineTo(5, -1); ctx.quadraticCurveTo(5.6, -1, 5.4, -2.4); ctx.lineTo(5.8, 0.6); ctx.lineTo(-5.8, 0.6); ctx.lineTo(-5.4, -2.4); ctx.quadraticCurveTo(-5.6, -1, -5, -1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f7d75a'; ctx.fillRect(-2.5, -1, 5, 1.2);
      ctx.fillStyle = '#333'; dot(ctx, -3.4, 2, 1.2); dot(ctx, 3.4, 2, 1.2);
      return;
    case 'cinta-tarda':   // una cinta de vídeo, como las del juego
      ctx.fillStyle = '#1c1c22'; ctx.fillRect(-5, -3.4, 10, 6.8);
      ctx.fillStyle = '#e8e2c8'; ctx.fillRect(-3.6, -2, 7.2, 2.4);
      ctx.fillStyle = '#666'; dot(ctx, -2, 1.8, 1); dot(ctx, 2, 1.8, 1);
      return;
    case 'llamita-drake': return llama(ctx, 1);
    case 'burbuja-jely':
      ctx.fillStyle = 'rgba(160, 220, 255, 0.35)'; dot(ctx, 0, 0, 4.4);
      ctx.strokeStyle = '#9ad8ff'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.arc(0, 0, 4.4, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.ellipse(-1.6, -1.8, 1.2, 0.7, -0.6, 0, Math.PI * 2); ctx.fill();
      return;
    case 'mando-oct':   // un mando de videojuegos (Elora), morado como su camiseta
      ctx.fillStyle = '#8f5bd6';
      ctx.beginPath(); ctx.moveTo(-3, -2.6); ctx.lineTo(3, -2.6); ctx.quadraticCurveTo(5.6, -2.6, 5.4, 1); ctx.quadraticCurveTo(5.2, 3.6, 3.6, 2.6);
      ctx.lineTo(2, 1.2); ctx.lineTo(-2, 1.2); ctx.lineTo(-3.6, 2.6); ctx.quadraticCurveTo(-5.2, 3.6, -5.4, 1); ctx.quadraticCurveTo(-5.6, -2.6, -3, -2.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#2b1f3d'; ctx.fillRect(-3.8, -1, 2.4, 0.8); ctx.fillRect(-3, -1.8, 0.8, 2.4);
      ctx.fillStyle = '#ff5b6b'; dot(ctx, 2.2, -1.2, 0.6); ctx.fillStyle = '#5bd6ff'; dot(ctx, 3.4, -0.2, 0.6);
      return;
    case 'maceta-hoppy':   // una maceta (Elora ya contará por qué)
      ctx.fillStyle = '#4caf50';
      ctx.beginPath(); ctx.ellipse(-1.2, -3.2, 1.2, 2, -0.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(1.2, -3.2, 1.2, 2, 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c96a3b'; ctx.beginPath(); ctx.moveTo(-3.6, -1); ctx.lineTo(3.6, -1); ctx.lineTo(2.6, 4.6); ctx.lineTo(-2.6, 4.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e08452'; ctx.fillRect(-4, -1.8, 8, 1.8);
      return;
    case 'nenufar-froggy':   // un nenúfar de peluche, como una almohada con carita
      ctx.fillStyle = '#5cc46a';
      ctx.beginPath(); ctx.moveTo(0, 0.4); ctx.arc(0, 0.4, 4.6, -Math.PI / 2 + 0.35, Math.PI * 1.5 - 0.35); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffb3d1'; dot(ctx, 2.8, -2.6, 1.1);
      ctx.fillStyle = '#1b1720'; dot(ctx, -1.4, 0.6, 0.5); dot(ctx, 1.4, 0.6, 0.5);
      ctx.strokeStyle = '#1b1720'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.arc(0, 1.4, 1, 0.4, Math.PI - 0.4); ctx.stroke();
      ctx.fillStyle = 'rgba(255,140,170,0.6)'; dot(ctx, -2.6, 1.8, 0.6); dot(ctx, 2.6, 1.8, 0.6);
      return;
    // ---- las cosas grandes (Elora), para debajo del árbol
    case 'calcetin':   // un calcetín de Navidad lleno de regalos
      ctx.fillStyle = '#3fbf5a'; ctx.fillRect(-1.2, -5.4, 2.4, 3);
      ctx.fillStyle = '#f7d75a'; ctx.fillRect(1, -5, 2.4, 2.4);
      ctx.strokeStyle = '#fafafa'; ctx.lineWidth = 0.9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-2.4, -2.6); ctx.lineTo(-2.4, -5); ctx.arc(-3.4, -5, 1, 0, Math.PI, true); ctx.stroke();
      ctx.fillStyle = '#d6202b';
      ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(2.4, -2); ctx.lineTo(2.4, 1.6); ctx.quadraticCurveTo(4.8, 2, 4.4, 4.2); ctx.quadraticCurveTo(3.8, 5.4, 0, 5); ctx.quadraticCurveTo(-3.2, 4.6, -3, 1.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fafafa'; ctx.fillRect(-3.6, -3, 6.6, 2.2);
      ctx.fillStyle = '#3fbf5a'; dot(ctx, -0.6, 1.8, 0.6); dot(ctx, 1.6, 3.4, 0.5);
      return;
    case 'leche-galletas':   // leche y galletas para Papá Noel
      ctx.fillStyle = '#e8e2d6'; ctx.beginPath(); ctx.ellipse(1, 4.2, 5, 1.2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(210,235,255,0.7)'; ctx.fillRect(-4.6, -4.4, 3.6, 8.4);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(-4.3, -2.6, 3, 6.4);
      for (const [x, y] of [[0.8, 3], [3.2, 3.2], [2, 1.8]]) { ctx.fillStyle = '#c98a4a'; dot(ctx, x, y, 1.4); ctx.fillStyle = '#5a3418'; dot(ctx, x - 0.4, y - 0.3, 0.25); dot(ctx, x + 0.5, y + 0.2, 0.25); }
      return;
    case 'muneco-nieve':
      ctx.fillStyle = '#f4f6fa'; dot(ctx, 0, 2.4, 3.4); dot(ctx, 0, -2.6, 2.4);
      ctx.fillStyle = '#d6202b'; ctx.fillRect(-2.2, -0.9, 4.4, 1.1); ctx.fillRect(1, -0.6, 1, 2.4);
      ctx.fillStyle = '#d6202b'; ctx.beginPath(); ctx.arc(0, -4, 2.1, Math.PI, 0); ctx.fill(); ctx.fillStyle = '#fafafa'; dot(ctx, 0, -6.2, 0.6); ctx.fillRect(-2.2, -4.2, 4.4, 0.7);
      ctx.fillStyle = '#1b1720'; dot(ctx, -0.8, -2.8, 0.3); dot(ctx, 0.8, -2.8, 0.3); dot(ctx, 0, 1.6, 0.35); dot(ctx, 0, 3.2, 0.35);
      ctx.fillStyle = '#f08a24'; ctx.beginPath(); ctx.moveTo(0, -2.3); ctx.lineTo(2, -2); ctx.lineTo(0, -1.7); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(-3, 1); ctx.lineTo(-5, -0.6); ctx.moveTo(3, 1); ctx.lineTo(5, -0.6); ctx.stroke();
      return;
    case 'tren':   // un tren de juguete
      ctx.fillStyle = '#d6202b'; ctx.fillRect(-5, -1, 7, 4); ctx.fillRect(0, -4.4, 3.6, 7.4);
      ctx.fillStyle = '#1b1720'; ctx.fillRect(-3.8, -4, 1.6, 3); ctx.fillStyle = '#f7d75a'; ctx.fillRect(-4.2, -4.6, 2.4, 0.8);
      ctx.fillStyle = '#9fd0ff'; ctx.fillRect(0.7, -3.6, 2.2, 1.8);
      ctx.fillStyle = '#2f5fd0'; ctx.fillRect(-5.6, 2.4, 9.8, 0.8);
      ctx.fillStyle = '#1b1720'; dot(ctx, -3.4, 3.8, 1.2); dot(ctx, -0.6, 3.8, 1.2); dot(ctx, 2.4, 3.8, 1.2);
      ctx.fillStyle = '#f7d75a'; dot(ctx, -3.4, 3.8, 0.4); dot(ctx, -0.6, 3.8, 0.4); dot(ctx, 2.4, 3.8, 0.4);
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; dot(ctx, -3, -5.6, 0.8); dot(ctx, -2, -6.6, 0.6);
      return;
    case 'caja-musica':   // una caja de música abierta, con notas
      ctx.fillStyle = '#8a5a32'; ctx.fillRect(-4.4, -0.4, 8.8, 4.8);
      ctx.fillStyle = '#b07c52'; ctx.beginPath(); ctx.moveTo(-4.4, -0.4); ctx.lineTo(-3.2, -4.6); ctx.lineTo(5.2, -4.6); ctx.lineTo(4.4, -0.4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ff9fd0'; ctx.fillRect(-4, -0.4, 8, 1);
      ctx.fillStyle = '#f2c230'; dot(ctx, 0, 2, 0.8); ctx.fillRect(4.4, 1.6, 1.4, 0.6);
      ctx.fillStyle = '#ffe36b'; ctx.font = 'bold 3px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♪', -2.4, -5.4); ctx.fillText('♫', 2, -6);
      return;
    case 'trineo':
      ctx.fillStyle = '#d6202b';
      ctx.beginPath(); ctx.moveTo(-5, -3); ctx.lineTo(3, -3); ctx.quadraticCurveTo(5.4, -3, 5, 0.6); ctx.lineTo(-5, 0.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#a3141e'; ctx.fillRect(-5, -5, 1.6, 5.6);
      ctx.strokeStyle = '#e8c547'; ctx.lineWidth = 0.7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-5.6, 3); ctx.lineTo(4, 3); ctx.quadraticCurveTo(6.2, 3, 6, 1.2); ctx.quadraticCurveTo(5.8, 0, 4.8, 0.4);
      ctx.moveTo(-3, 0.6); ctx.lineTo(-3, 3); ctx.moveTo(2, 0.6); ctx.lineTo(2, 3); ctx.stroke();
      ctx.fillStyle = '#3fbf5a'; ctx.fillRect(-2.6, -5.4, 2.6, 2.4); ctx.fillStyle = '#f7d75a'; ctx.fillRect(0.4, -4.6, 2, 1.6);
      return;
    case 'caga-tio': {   // el Caga Tió (Elora): un tronco con cara, barretina roja, mantita y patitas
      ctx.fillStyle = '#6b4226'; ctx.fillRect(-3.4, 2, 0.8, 3); ctx.fillRect(1.8, 2, 0.8, 3);
      ctx.fillStyle = '#9a6a3c'; ctx.beginPath(); ctx.ellipse(-0.6, 0.4, 5, 2.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#6b4226'; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(-4, -0.4); ctx.lineTo(1, -0.6); ctx.moveTo(-3, 1.6); ctx.lineTo(1.6, 1.4); ctx.stroke();
      // la manta, roja con rayas blancas
      ctx.fillStyle = '#d6202b'; ctx.beginPath(); ctx.moveTo(-4.4, -1.4); ctx.quadraticCurveTo(-1.6, -3, 1.4, -1.6); ctx.lineTo(1.4, 2.8); ctx.lineTo(-4.4, 2.8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fafafa'; ctx.fillRect(-4.4, 1.4, 5.8, 0.5); ctx.fillRect(-4.4, 2.3, 5.8, 0.5);
      // la cara, en la punta del tronco
      ctx.fillStyle = '#e8c79a'; ctx.beginPath(); ctx.ellipse(4.2, 0.2, 2, 2.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#b8935e'; ctx.lineWidth = 0.25; ctx.beginPath(); ctx.ellipse(4.2, 0.2, 1.1, 1.5, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#1b1720'; dot(ctx, 3.6, -0.4, 0.35); dot(ctx, 4.9, -0.4, 0.35);
      ctx.strokeStyle = '#1b1720'; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.arc(4.2, 0.6, 0.8, 0.3, Math.PI - 0.3); ctx.stroke();
      ctx.fillStyle = 'rgba(255,120,120,0.6)'; dot(ctx, 3, 0.8, 0.4); dot(ctx, 5.4, 0.8, 0.4);
      // la barretina
      ctx.fillStyle = '#d6202b'; ctx.beginPath(); ctx.moveTo(2.6, -1.8); ctx.quadraticCurveTo(4, -4.6, 6.6, -4); ctx.lineTo(5.8, -1.6); ctx.closePath(); ctx.fill();
      return;
    }
    case 'casita-jengibre':
      ctx.fillStyle = '#b8743c'; ctx.fillRect(-4, -1, 8, 5.6);
      ctx.fillStyle = '#fafafa'; ctx.beginPath(); ctx.moveTo(-5.4, -0.6); ctx.lineTo(0, -5.4); ctx.lineTo(5.4, -0.6); ctx.lineTo(4.4, 0.2); ctx.lineTo(0, -3.8); ctx.lineTo(-4.4, 0.2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8a4f22'; ctx.beginPath(); ctx.moveTo(-4.4, 0.2); ctx.lineTo(0, -3.8); ctx.lineTo(4.4, 0.2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#6b3a18'; ctx.fillRect(-1, 1.6, 2, 3);
      ctx.fillStyle = '#9fd0ff'; ctx.fillRect(-3.2, 0.8, 1.6, 1.4); ctx.fillRect(1.6, 0.8, 1.6, 1.4);
      for (const [x, y, c] of [[-2.4, -1.6, '#e23b4a'], [0, -2.6, '#3fbf5a'], [2.4, -1.6, '#3a8ee8'], [-3, 3.6, '#f7d75a'], [3, 3.6, '#e23b4a']]) { ctx.fillStyle = c; dot(ctx, x, y, 0.45); }
      return;
    case 'osito-gigante':   // un osito de peluche gigante, con ojos de botón
      ctx.fillStyle = '#a0714f'; dot(ctx, -3.4, -4.6, 1.3); dot(ctx, 3.4, -4.6, 1.3); dot(ctx, 0, 2.4, 3.6);
      dot(ctx, -3.4, 4.6, 1.4); dot(ctx, 3.4, 4.6, 1.4); dot(ctx, -3.8, 1, 1.2); dot(ctx, 3.8, 1, 1.2); dot(ctx, 0, -2.8, 3.2);
      ctx.fillStyle = '#d4ab88'; dot(ctx, -3.4, -4.6, 0.6); dot(ctx, 3.4, -4.6, 0.6); dot(ctx, 0, 2.6, 2); dot(ctx, 0, -1.8, 1.4);
      ctx.fillStyle = '#3a2418'; dot(ctx, 0, -2.2, 0.45);
      boton(ctx, -1.2, -3.6, 0.6); boton(ctx, 1.2, -3.6, 0.6);
      ctx.fillStyle = '#d6202b'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-1.8, -0.8); ctx.lineTo(-1.8, 0.8); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1.8, -0.8); ctx.lineTo(1.8, 0.8); ctx.closePath(); ctx.fill();
      return;
    case 'tele-cintas':   // una tele antigua con cintas, como la del lobby
      ctx.strokeStyle = '#555'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(-0.6, -3.4); ctx.lineTo(-2.4, -6); ctx.moveTo(0.6, -3.4); ctx.lineTo(2.4, -6); ctx.stroke();
      ctx.fillStyle = '#8a5a32'; ctx.fillRect(-4.6, -3.6, 9.2, 6.4);
      ctx.fillStyle = '#9aa3ad'; ctx.fillRect(-3.8, -2.8, 6, 4.8);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 0.3; ctx.beginPath(); for (let y = -2.2; y < 2; y += 1) { ctx.moveTo(-3.6, y); ctx.lineTo(2, y); } ctx.stroke();
      ctx.fillStyle = '#f2c230'; dot(ctx, 3.4, -1.2, 0.5);
      ctx.fillStyle = '#1c1c22'; ctx.fillRect(-4.4, 3, 4, 2); ctx.fillRect(0.2, 3, 4, 2);
      ctx.fillStyle = '#e8e2c8'; ctx.fillRect(-3.6, 3.4, 2.4, 0.8); ctx.fillRect(1, 3.4, 2.4, 0.8);
      return;
    case 'cofre-monedas':   // un cofre lleno de monedas de oro
      ctx.fillStyle = '#7a4a24'; ctx.beginPath(); ctx.moveTo(-4.6, -1.2); ctx.lineTo(-4, -5); ctx.lineTo(4, -5); ctx.lineTo(4.6, -1.2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f2c230'; for (const [x, y] of [[-3, -1.4], [-1, -2.2], [1, -1.6], [3, -1.2], [-2, -0.4], [0, -0.6], [2, -0.4]]) dot(ctx, x, y, 1.1);
      ctx.fillStyle = '#fff4b0'; dot(ctx, -1.3, -2.5, 0.35); dot(ctx, 0.7, -1.9, 0.35);
      ctx.fillStyle = '#8a5a32'; ctx.fillRect(-4.8, -0.4, 9.6, 5.4);
      ctx.fillStyle = '#d9a521'; ctx.fillRect(-4.8, -0.4, 9.6, 0.8); ctx.fillRect(-0.8, 0.6, 1.6, 2);
      ctx.fillStyle = '#1b1720'; dot(ctx, 0, 1.4, 0.3);
      return;
    case 'movil-draila': {   // su móvil, con funda de lagarto (Elora: no de cocodrilo)
      ctx.fillStyle = '#7cc36a'; ctx.beginPath(); ctx.moveTo(-2.8, -4.8); ctx.lineTo(2.8, -4.8); ctx.lineTo(2.8, 4.8); ctx.lineTo(-2.8, 4.8); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#5ea24f'; for (const [x, y] of [[-1.6, -3.4], [1.2, -2.2], [-1, 0.4], [1.6, 1.6], [-1.4, 3.4], [1, 3.8]]) dot(ctx, x, y, 0.55);
      // el lagartito de la funda
      ctx.fillStyle = '#f7d75a'; ctx.beginPath(); ctx.ellipse(0, 0, 0.8, 2, 0, 0, Math.PI * 2); ctx.fill(); dot(ctx, 0, -2.2, 0.8);
      ctx.strokeStyle = '#f7d75a'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(0, 2); ctx.quadraticCurveTo(1.2, 3.4, 0.4, 4.2);
      for (const [a, b] of [[-0.6, -1], [0.6, -1], [-0.6, 1], [0.6, 1]]) { ctx.moveTo(a, b); ctx.lineTo(a * 2.4, b - 0.6); }
      ctx.stroke();
      ctx.fillStyle = '#26303a'; dot(ctx, 1.6, -3.8, 0.45);
      return;
    }
  }
}
function llama(ctx, k) {
  ctx.fillStyle = '#ff6a1a';
  ctx.beginPath(); ctx.moveTo(0, -5 * k); ctx.quadraticCurveTo(4 * k, -1 * k, 3 * k, 2.2 * k); ctx.quadraticCurveTo(2 * k, 4.6 * k, 0, 4.6 * k);
  ctx.quadraticCurveTo(-2 * k, 4.6 * k, -3 * k, 2.2 * k); ctx.quadraticCurveTo(-3.6 * k, -0.6 * k, -1.2 * k, -2.4 * k); ctx.quadraticCurveTo(-0.6 * k, -0.6 * k, 0, -5 * k); ctx.fill();
  ctx.fillStyle = '#ffd23a';
  ctx.beginPath(); ctx.moveTo(0, -1.6 * k); ctx.quadraticCurveTo(2 * k, 1 * k, 1.4 * k, 2.6 * k); ctx.quadraticCurveTo(0, 3.8 * k, -1.4 * k, 2.6 * k); ctx.quadraticCurveTo(-1.8 * k, 0.8 * k, 0, -1.6 * k); ctx.fill();
}

// Dónde tiene los ojos cada personaje (dibujado con los pies en y = 12, mirando de frente) y lo grandes que son
// los botones que se los tapan
const OJOS_PELUCHE = {
  carot: [[[-3.6, -1], [3.6, -1]], 2.2], froggy: [[[-6.4, -8.6], [6.4, -8.6]], 1.9], oct: [[[-5.7, -5.4], [0.6, -5.4]], 1.7],
  tarda: [[[-4, -4.6], [2.9, -4.6]], 1.5], gek: [[[-4.3, -6], [4.4, -6]], 2.4], draila: [[[-2.1, -10.6], [2, -10.6]], 1.6],
  katy: [[[-2.9, 0], [3.1, 0]], 1.7], jely: [[[-3.6, -5.7], [3.7, -5.7]], 1.9],   // Hoppy no: la maceta le tapa los ojos
  drake: [[[-3.1, -4.6], [3.1, -4.6]], 1.7], reno: [[[-3.4, -4.6], [3.4, -4.6]], 1.7],
};
// Un ojo de botón: negro, con el borde y los cuatro agujeritos cosidos con hilo clarito
function boton(ctx, x, y, r) {
  ctx.fillStyle = '#231b26'; dot(ctx, x, y, r);
  ctx.strokeStyle = '#4e4054'; ctx.lineWidth = r * 0.18; ctx.beginPath(); ctx.arc(x, y, r * 0.72, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = '#e9e0cf'; ctx.lineWidth = r * 0.16; ctx.lineCap = 'round';
  const k = r * 0.3;
  ctx.beginPath(); ctx.moveTo(x - k, y - k); ctx.lineTo(x + k, y + k); ctx.moveTo(x + k, y - k); ctx.lineTo(x - k, y + k); ctx.stroke();
}

// Un adorno (o unas luces) centrado en (x, y), de `tam` px de ancho
export function drawAdorno(ctx, id, x, y, tam, t = 0) {
  const a = adorno(id);
  ctx.save(); ctx.translate(x, y);
  if (id === 'bloodie-gigante') {
    // un Bloodie de peluche gigante, con gorrito de Navidad y ojos de botón
    const k = tam / 30;
    ctx.scale(k, k);
    try { drawCharacter(ctx, characterById('carot'), 0, 12, 'down', 0, 0, false, { bloody: true, navidad: true }); } catch (e) { /* nada */ }
    boton(ctx, -3.6, -1, 2.2); boton(ctx, 3.6, -1, 2.2);
  } else if (a && a.pj) {
    // un peluchito del personaje: el personaje en pequeño
    const k = tam / 30;
    ctx.scale(k, k);
    try { drawCharacter(ctx, characterById(a.pj), 0, 12, 'down', 0, 0, false); } catch (e) { /* nada */ }
    // con ojos de botón, para que se note que son peluches (Elora)
    const ojos = OJOS_PELUCHE[a.pj];
    if (ojos) for (const [ox, oy] of ojos[0]) boton(ctx, ox, oy, ojos[1]);
  } else {
    ctx.scale(tam / 10, tam / 10);
    if (a && a.sec === 'luces') lucesIcono(ctx, id, t); else dibujo(ctx, id, t);
  }
  ctx.restore();
}

// Lo que va en la punta, centrado en (x, y), de `tam` px
export function drawPunta(ctx, id, x, y, tam, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(tam / 14, tam / 14);
  const brilla = 1 + Math.sin(t * 2.5) * 0.06;
  ctx.fillStyle = 'rgba(255, 230, 120, 0.22)'; dot(ctx, 0, 0, 10 * brilla);
  if (id === 'estrella') {
    ctx.fillStyle = '#ffd83a'; ctx.beginPath();
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = (k % 2 ? 3.2 : 7) * brilla; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
  } else if (id === 'lazo') {
    ctx.fillStyle = '#e02b3a';
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 3.6, -1.6, 3.8, 2.4, s * -0.4, 0, Math.PI * 2); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-1, 0); ctx.lineTo(-3.6, 6); ctx.lineTo(-1.6, 5.4); ctx.lineTo(0, 1); ctx.lineTo(1.6, 5.4); ctx.lineTo(3.6, 6); ctx.lineTo(1, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b81d2b'; dot(ctx, 0, -0.8, 1.6);
  } else if (id === 'corazon') {
    ctx.fillStyle = '#ff3b55'; ctx.beginPath(); ctx.moveTo(0, 6);
    ctx.bezierCurveTo(-8, 0, -5, -7, 0, -2.6); ctx.bezierCurveTo(5, -7, 8, 0, 0, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; dot(ctx, -2.8, -2.2, 1);
  } else if (id === 'cinta') {
    ctx.fillStyle = '#1c1c22'; ctx.fillRect(-7, -4.6, 14, 9.2);
    ctx.fillStyle = '#f2d24a'; ctx.fillRect(-5, -2.8, 10, 3.2);
    ctx.fillStyle = '#666'; dot(ctx, -2.8, 2.4, 1.3); dot(ctx, 2.8, 2.4, 1.3);
  } else if (id === 'llamita') {
    ctx.scale(1.4, 1.4); llama(ctx, 1);
  }
  ctx.restore();
}

// El árbol entero tal como lo tienes: ramas, luces, adornos y la punta. (x, y): el pie; s: px por unidad
export function drawArbolCompleto(ctx, x, y, s, arbol, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  drawArbolVacio(ctx, arbol && arbol.maceta);
  if (arbol && arbol.luces) drawLuces(ctx, arbol.luces.id, t);
  if (arbol) for (const a of arbol.adornos) if (!esGrande(a.id)) drawAdorno(ctx, a.id, a.x, a.y, TAM_ADORNO(a.id), t);
  if (arbol && arbol.punta) drawPunta(ctx, arbol.punta, 0, PUNTA_Y, 13, t);
  // las cosas grandes, en el suelo: las de más atrás primero
  if (arbol) for (const a of arbol.adornos.filter((b) => esGrande(b.id)).sort((p, q) => p.y - q.y)) drawAdorno(ctx, a.id, a.x, a.y, TAM_ADORNO(a.id), t);
  ctx.restore();
}
// el tamaño de cada adorno en el árbol (en unidades)
export const TAM_ADORNO = (id) => (esGrande(id) ? (id.startsWith('gigante') || id === 'calcetin' || id === 'leche-galletas' ? 11 : 14) : adorno(id) && adorno(id).pj ? 8 : id === 'guirnalda' ? 7 : 5.6);
