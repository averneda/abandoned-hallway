// Los Bloodies especiales de Elora (dibujos en assets/referencias/bloodies/): salen además de los de siempre, en
// 1 de cada 10 pasillos y nunca en los 5 primeros (Elora). Cada uno tiene su habilidad (Elora):
//   'caty'      → en su pasillo salen un montón de bocas riéndose por las paredes y el suelo; una es la boca de un
//                 gato (con colmillos y la ω): si pasas por delante te coge y te quita 2 corazones.
//   'oct'       → robot con cabeza de tele: más o menos cada 10 s (Elora; antes 20) te sale un minijuego (el pulpito en la pecera, un
//                 laberinto de algas que creó Oct) y no te puedes mover hasta acabarlo; si no lo acabas, Oct te
//                 encuentra y te quita 2 corazones.
//   'tarda'     → gusano gris enroscado: camina también por las paredes, así que escala los trastos que se saltan.
//   'gecdraila' → Gec y Draila en un solo cuerpo: se turnan cada 5 a 10 s; con Gec va más rápido, con Draila más
//                 lento pero te ve desde más lejos.
//   'hoppy'     → Hoppy Bloody (dibujo de Elora): por el pasillo hay girasoles con ojo; si pisas uno, sale del suelo
//                 un girasol con forma de garra que te coge y te quita 1 corazón. De momento solo sale con el enlace
//                 (?bloodie=hoppy).
// Los números, en BLOODIES_ESPECIALES de config.js. Cómo están dibujados, a partir de los dibujos de Elora (Clad).

import { BLOODIES_ESPECIALES as BE } from './config.js';

export const ESPECIALES = ['caty', 'oct', 'tarda', 'gecdraila', 'hoppy'];
// los que pueden salir al azar (Hoppy Bloody, de momento, solo con el enlace: Elora todavía la va a cambiar)
const AL_AZAR = ['caty', 'oct', 'tarda', 'gecdraila'];

const dot = (ctx, x, y, r) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}
const SANGRE = '#7a0b12', ROJO = '#d42a36';

// ¿Sale un Bloodie especial en este pasillo? (con index.html?bloodie=caty|oct|tarda|gecdraila sale siempre ese)
// ?bloodie=… se lee al cargar: con ?pasillo=N la dirección se limpia antes de que empiece el pasillo
const PEDIDO = (() => { try { return new URLSearchParams(location.search).get('bloodie'); } catch (e) { return null; } })();
// Solo con el enlace (Elora): ?bloodie=tarda&solo=1 hace un pasillo en el que solo está ese Bloodie especial
const SOLO = (() => { try { return new URLSearchParams(location.search).get('solo') === '1'; } catch (e) { return false; } })();
export const soloEspecial = () => SOLO && ESPECIALES.includes(PEDIDO);
// Hasta la actualización de los Bloodies (Elora), solo salen con su código secreto (holeway.modoBloodies).
export function decidirEspecial(n, L) {
  const pedido = PEDIDO;
  let codigo = false;
  try { codigo = localStorage.getItem('holeway.modoBloodies') === '1'; } catch (e) { /* nada */ }
  if (ESPECIALES.includes(pedido)) return pedido;
  if (!codigo) return null;
  if (n < BE.desdePasillo || L.noButton || L.lobby || L.fuego || !L.enemies || !L.enemies.length) return null;
  if (Math.random() >= BE.prob) return null;
  return AL_AZAR[Math.floor(Math.random() * AL_AZAR.length)];
}
export const entre = ([a, b]) => a + Math.random() * (b - a);
// un número entero al azar de a a b, los dos incluidos (Gec y Draila: 5, 6, 7, 8, 9 o 10 segundos, Elora)
export const enteroEntre = ([a, b]) => a + Math.floor(Math.random() * (b - a + 1));

// Los arañazos rojos que deja la Bloodie Tarda en los trastos que trepa (Elora). Cada uno: { x, y, s } (la casilla)
export function drawZarpazos(ctx, lista) {
  ctx.save(); ctx.lineCap = 'round';
  for (const z of lista) {
    const a = z.s * 6.28, cx = z.x + 16 + Math.cos(a) * 3, cy = z.y + 15 + Math.sin(a) * 2, inc = (z.s - 0.5) * 0.8;
    for (let k = -1; k <= 1; k++) {
      const ox = k * 5;
      ctx.strokeStyle = 'rgba(120,10,18,0.9)'; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(cx + ox - 4 + inc * 4, cy - 7); ctx.lineTo(cx + ox + 3 - inc * 4, cy + 7); ctx.stroke();
      ctx.strokeStyle = '#d42a36'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx + ox - 4 + inc * 4, cy - 7); ctx.lineTo(cx + ox + 3 - inc * 4, cy + 7); ctx.stroke();
    }
  }
  ctx.restore();
}

// ------------------------------------------------------------------ dibujo de los cuatro

// Dibuja un Bloodie especial en (x, y) (los pies), como drawCharacter. opts: { chasing, frozen, modo, sube }
// sube (de 0 a 1): la Bloodie Tarda encima de un trasto naranja; se sube 20 px, se inclina mientras trepa y se
// agarra al borde con las garras (Elora: que se note que lo ha trepado)
const SUBE_PX = 20;   // Elora: que suba más alto
export function drawBloodieEspecial(ctx, tipo, x, y, facing, walk, opts = {}) {
  const chasing = !!opts.chasing;
  const sube = tipo === 'tarda' ? (opts.sube || 0) : 0, alto = sube * SUBE_PX;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(x, y + 10 - alto, (tipo === 'tarda' ? 20 : 13) * (1 - sube * 0.25), 5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.translate(x, y - alto + Math.sin(walk) * (chasing ? 2.2 : 1.2));
  // mientras trepa (a medio subir o bajar), se inclina hacia donde va
  if (sube > 0.02 && sube < 0.98) ctx.rotate(-0.45 * Math.sin(Math.PI * sube) * (facing === 'left' ? -1 : 1));
  if (chasing) ctx.translate(Math.sin(walk * 3) * 1.2, 0);
  // el charco de sangre y los goterones de siempre
  ctx.fillStyle = SANGRE;
  ctx.beginPath(); ctx.ellipse(0, 11, tipo === 'tarda' ? 19 : 13, 4, 0, 0, Math.PI * 2); ctx.fill();
  for (let i = -1; i <= 1; i++) { const g = (Math.sin(walk * 0.3 + i * 2) + 1) * 3; ctx.beginPath(); ctx.ellipse(i * 7, 8 + g, 2.5, 4 + g * 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
  if (tipo === 'caty') drawCatyB(ctx, facing, walk, chasing);
  else if (tipo === 'oct') drawOctB(ctx, facing, walk, chasing);
  else if (tipo === 'hoppy') drawHoppyB(ctx, facing, walk, chasing);
  else if (tipo === 'tarda') {
    drawTardaB(ctx, facing, walk, chasing);
    if (sube > 0.3) {   // las garras rojas agarradas al borde del trasto
      ctx.strokeStyle = '#c41e2a'; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.globalAlpha *= Math.min(1, (sube - 0.3) / 0.4);
      for (const gx of [-14, -7, 0, 7, 14]) {
        const m = Math.sin(walk * 2 + gx) * 0.8;
        ctx.beginPath(); ctx.moveTo(gx - 1.5, 9); ctx.quadraticCurveTo(gx, 13 + m, gx + 1.8, 15 + m); ctx.stroke();
      }
    }
  }
  else drawGecDraila(ctx, facing, walk, chasing, opts.modo || 'gec');
  if (opts.frozen) {   // hielo de Oct (la habilidad del personaje)
    ctx.globalAlpha = 0.55; ctx.fillStyle = '#9fe8ff';
    ctx.beginPath(); ctx.ellipse(0, -6, tipo === 'tarda' ? 22 : 16, 22, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

// Gec y Draila (dibujo de Elora): medio Gec (verde clarito, a la derecha) y medio Draila (verde oscuro, a la
// izquierda), partidos por una raya roja; la barriga amarilla a rayas, dos colas y manos y pies rojos de sangre.
// Se nota quién manda por los pies (Elora): el de quien manda camina y el otro va levantado.
function drawGecDraila(ctx, facing, walk, chasing, modo) {
  const gec = '#98cc84', gecOsc = '#5e9a4c', dra = '#3f8f5a', draOsc = '#245c38', barriga = '#f3dc5a';
  const back = facing === 'up';
  const paso = Math.sin(walk) * 2.4;
  // las dos colas: la de Draila a la izquierda (oscura con la tripa amarilla) y la de Gec a la derecha
  ctx.lineCap = 'round';
  ctx.strokeStyle = draOsc; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(-3, 6); ctx.quadraticCurveTo(-16, 10, -21, 2 + Math.sin(walk * 0.7) * 2); ctx.stroke();
  ctx.strokeStyle = barriga; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-4, 7.5); ctx.quadraticCurveTo(-15, 11, -19.5, 4); ctx.stroke();
  ctx.strokeStyle = gecOsc; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(3, 6); ctx.quadraticCurveTo(16, 10, 21, 2 - Math.sin(walk * 0.7) * 2); ctx.stroke();
  ctx.strokeStyle = gec; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(3, 6); ctx.quadraticCurveTo(16, 10, 20.5, 2.5 - Math.sin(walk * 0.7) * 2); ctx.stroke();
  // los pies: el de quien manda anda; el otro, levantado y quieto (Elora)
  const pie = (side, color, manda) => {
    const lift = manda ? (side * paso > 0 ? -side * paso * 0.6 : 0) : -4;
    ctx.fillStyle = color; ctx.fillRect(side * 4 - 2, 3, 4, 7 + lift);
    ctx.fillStyle = ROJO; ctx.beginPath(); ctx.ellipse(side * 4.5, 10 + lift, 3.6, 2.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = SANGRE; dot(ctx, side * 4.5 + 2, 11 + lift, 0.9);
  };
  pie(-1, dra, modo === 'draila');
  pie(1, gec, modo === 'gec');
  // el cuerpo, largo: mitad Draila y mitad Gec
  ctx.save(); rr(ctx, -7, -13, 14, 19, 5); ctx.clip();
  ctx.fillStyle = dra; ctx.fillRect(-8, -14, 8, 21);
  ctx.fillStyle = gec; ctx.fillRect(0, -14, 8, 21);
  if (!back) {
    ctx.fillStyle = barriga; rr(ctx, -3.5, -11, 7, 16, 3); ctx.fill();
    ctx.strokeStyle = 'rgba(120,90,20,0.6)'; ctx.lineWidth = 0.6; ctx.beginPath();
    for (const yy of [-7, -3, 1]) { ctx.moveTo(-3.5, yy); ctx.lineTo(3.5, yy); }
    ctx.stroke();
  }
  ctx.restore();
  // los brazos con las manos rojas de sangre
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.5);
    const mano = chasing ? [side * 13, -20 + Math.abs(sw)] : [side * 12 + sw * 0.4, 0];
    ctx.strokeStyle = side < 0 ? dra : gec; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(side * 6, -9); ctx.quadraticCurveTo(side * 12, -8, mano[0], mano[1]); ctx.stroke();
    ctx.fillStyle = ROJO; dot(ctx, mano[0], mano[1], 2.3);
    ctx.strokeStyle = ROJO; ctx.lineWidth = 0.9; ctx.beginPath();
    for (const a of [-0.6, 0, 0.6]) { ctx.moveTo(mano[0], mano[1]); ctx.lineTo(mano[0] + Math.cos(a - Math.PI / 2) * 3.6 * side, mano[1] + Math.sin(a - Math.PI / 2) * 3.6); }
    ctx.stroke();
  }
  // la cabeza redonda, partida por la mitad
  const hy = -22;
  ctx.save(); ctx.beginPath(); ctx.arc(0, hy, 10, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = dra; ctx.fillRect(-11, hy - 11, 11, 22);
  ctx.fillStyle = gec; ctx.fillRect(0, hy - 11, 11, 22);
  ctx.restore();
  // la raya roja de arriba abajo (Elora)
  ctx.strokeStyle = ROJO; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(0, hy - 10); ctx.lineTo(0, 5); ctx.stroke();
  if (back) return;
  // el ojo de Draila: grande y negro, con su espiral; el de Gec: grande y blanco con la pupila
  ctx.fillStyle = '#1a1a1a'; dot(ctx, -4.6, hy - 2, 3.4);
  ctx.strokeStyle = '#555'; ctx.lineWidth = 0.5; ctx.beginPath();
  for (let a = 0; a < Math.PI * 5; a += 0.3) { const rad = a * 0.18; ctx.lineTo(-4.6 + Math.cos(a) * rad, hy - 2 + Math.sin(a) * rad); }
  ctx.stroke();
  ctx.fillStyle = '#fff'; dot(ctx, 4.6, hy - 2, 3.6);
  ctx.fillStyle = chasing ? '#c81e2b' : '#1a1a1a'; dot(ctx, 5.2, hy - 1.6, 1.4);
  ctx.fillStyle = ROJO; dot(ctx, -8, hy + 1.2, 1.1); dot(ctx, 8, hy + 1.2, 1.1);   // los coloretes de sangre
  ctx.fillStyle = '#1d241a'; dot(ctx, -1.4, hy + 3, 0.6); dot(ctx, 1.4, hy + 3, 0.6);   // la nariz
  ctx.fillStyle = ROJO;   // los colmillitos rojos de las esquinas de la boca
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * 4.5, hy + 5.2); ctx.lineTo(s * 6.2, hy + 5.2); ctx.lineTo(s * 5.4, hy + 7.6); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle = '#1d241a'; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(-4.5, hy + 5.2); ctx.lineTo(4.5, hy + 5.2); ctx.stroke();
}

// Oct robot (dibujo de Elora): la cabeza es una tele morada con la cara de Oct llorando dentro y dos antenas; el
// cuerpo, morado con un mando de juegos; brazos de robot con pinzas rojas y un cable que va a una caja negra.
function drawOctB(ctx, facing, walk, chasing) {
  const morado = '#a99bd8', moradoOsc = '#7b6cb3', gris = '#b6b8c2', back = facing === 'up';
  const paso = Math.sin(walk) * 2;
  // el cable hasta la caja negra del suelo
  ctx.strokeStyle = '#3a3a42'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(5, -2); ctx.bezierCurveTo(16, -6, 22, 2, 18, 8); ctx.stroke();
  ctx.fillStyle = '#26232c'; ctx.fillRect(14, 5, 8, 7);
  ctx.strokeStyle = '#8a8a96'; ctx.lineWidth = 0.6; ctx.strokeRect(15.2, 6.2, 5.6, 4.6);
  // las piernas de robot con los pies rojos
  for (const side of [-1, 1]) {
    const lift = side * paso > 0 ? -side * paso * 0.6 : 0;
    ctx.strokeStyle = gris; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(side * 4, 4); ctx.lineTo(side * 4.5, 9 + lift); ctx.stroke();
    ctx.fillStyle = ROJO; ctx.fillRect(side * 4.5 - 2.6, 8.6 + lift, 5.2, 2.6);
  }
  // los brazos de robot con las pinzas rojas
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.5);
    const fin = chasing ? [side * 15, -16 + Math.abs(sw)] : [side * 14 + sw * 0.3, 2];
    ctx.strokeStyle = gris; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(side * 8, -6); ctx.lineTo(side * 12, -4); ctx.lineTo(fin[0], fin[1]); ctx.stroke();
    ctx.strokeStyle = ROJO; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(fin[0], fin[1] + 1.5, 2.6, side < 0 ? Math.PI * 0.2 : Math.PI * -0.2, side < 0 ? Math.PI * 1.6 : Math.PI * 1.2, side > 0); ctx.stroke();
  }
  // el cuerpo morado con el mando
  ctx.fillStyle = morado; rr(ctx, -9, -11, 18, 16, 3); ctx.fill();
  ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = moradoOsc; ctx.fillRect(5, -10, 3, 14); ctx.restore();
  if (!back) {
    ctx.fillStyle = '#3d8fd6'; rr(ctx, -5.5, -7, 11, 7, 2); ctx.fill();
    ctx.fillStyle = ROJO; ctx.fillRect(-4, -5.4, 2.4, 1); ctx.fillRect(-3.3, -6.1, 1, 2.4); dot(ctx, 2.4, -4.8, 1); dot(ctx, 3.8, -2.8, 0.9);
  }
  // el cuello y la tele
  ctx.fillStyle = gris; ctx.fillRect(-1.6, -14, 3.2, 3.5);
  ctx.fillStyle = morado; rr(ctx, -11, -30, 22, 17, 3); ctx.fill();
  // las antenas
  ctx.strokeStyle = '#3a3a42'; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(-6, -30); ctx.lineTo(-10, -37); ctx.moveTo(6, -30); ctx.lineTo(11, -36); ctx.stroke();
  for (const [ax, ay] of [[-10, -37], [11, -36]]) { ctx.beginPath(); ctx.arc(ax, ay, 1.4, 0, Math.PI * 2); ctx.stroke(); }
  if (back) return;
  // la pantalla gris con rayitas, y dentro la cara de Oct llorando
  ctx.fillStyle = '#c9ccd2'; ctx.fillRect(-9, -28, 18, 13);
  ctx.strokeStyle = 'rgba(80,80,90,0.25)'; ctx.lineWidth = 0.4; ctx.beginPath();
  for (let yy = -27; yy < -15; yy += 1.6) { ctx.moveTo(-9, yy); ctx.lineTo(9, yy); }
  ctx.stroke();
  const parpadeo = chasing && Math.floor(walk * 2) % 2;
  ctx.fillStyle = parpadeo ? '#c81e2b' : '#3f9fe0'; ctx.beginPath(); ctx.ellipse(0, -20.5, 5.4, 5, 0, 0, Math.PI * 2); ctx.fill();
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#fff'; dot(ctx, s * 2.2, -21.5, 1.6);
    ctx.fillStyle = '#1a1a1a'; dot(ctx, s * 2.2, -21.2, 0.7);
  }
  // las lágrimas (azules y amarillas, como en el dibujo)
  const caer = (walk * 0.6) % 1;
  ctx.fillStyle = '#ffe36b'; ctx.fillRect(-2.6, -19.6, 0.7, 4 + caer * 2);
  ctx.fillStyle = '#9fd8ff'; ctx.fillRect(1.9, -19.6, 0.7, 3 + caer * 3);
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(0, -16.8, 1.4, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
}

// Caty (dibujo de Elora): gata amarilla con los ojos azules de gato, la mancha de pintura roja en el ojo, la boca
// abierta con dientes y sangre que le cae como saliva; las orejas rojas por dentro y las puntas de las patas y la cola rojas.
// media: sin cola, piernas ni brazos (sale de la boca); boca: la boca del gato, que se convierte en la suya (Elora)
function drawCatyB(ctx, facing, walk, chasing, media = false, boca = null) {
  const am = '#f2d64a', amOsc = '#c9a92a', back = facing === 'up';
  const paso = Math.sin(walk) * 2;
  // la cola, con la punta roja
  const w = Math.sin(walk * 0.7) * 2.5;
  if (!media) {
  ctx.strokeStyle = am; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(4, 4); ctx.quadraticCurveTo(16, 2, 15 + w, -10); ctx.stroke();
  ctx.fillStyle = '#e05a6a'; dot(ctx, 15 + w, -10, 2.8);
  // las patas, con las puntas rojas
  for (const side of [-1, 1]) {
    const lift = side * paso > 0 ? -side * paso * 0.6 : 0;
    ctx.fillStyle = am; ctx.fillRect(side * 3.5 - 1.8, 3, 3.6, 7 + lift);
    ctx.fillStyle = '#e05a6a'; ctx.beginPath(); ctx.ellipse(side * 3.8, 10 + lift, 2.8, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  }
  }
  // el cuerpo amarillo con garabatos rojos
  ctx.fillStyle = am; ctx.beginPath(); ctx.ellipse(0, -3, 7.5, 9.5, 0, 0, Math.PI * 2); ctx.fill();
  if (!back) {
    ctx.strokeStyle = '#c8303c'; ctx.lineWidth = 0.6; ctx.beginPath();
    for (const [x0, y0] of [[-4, -6], [2, -8], [-3, 1], [3, -1], [0, 4]]) { ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + 1.5, y0 - 1.5, x0 + 3, y0); }
    ctx.stroke();
  }
  // los brazos, con las puntas rojas
  if (!media) for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.5);
    const mano = chasing ? [side * 12, -18 + Math.abs(sw)] : [side * 10 + sw * 0.4, 1];
    ctx.strokeStyle = am; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(side * 5, -8); ctx.lineTo(mano[0], mano[1]); ctx.stroke();
    ctx.fillStyle = '#e05a6a'; dot(ctx, mano[0], mano[1], 2);
  }
  // la cabeza con las orejas
  const hy = -18;
  for (const side of [-1, 1]) {
    ctx.fillStyle = am; ctx.beginPath(); ctx.moveTo(side * 3, hy - 7); ctx.lineTo(side * 9.5, hy - 14); ctx.lineTo(side * 9, hy - 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d83a46'; ctx.beginPath(); ctx.moveTo(side * 5, hy - 7); ctx.lineTo(side * 8.6, hy - 11.6); ctx.lineTo(side * 8.2, hy - 5); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = am; dot(ctx, 0, hy, 9);
  ctx.save(); ctx.globalAlpha *= 0.3; ctx.fillStyle = amOsc; ctx.beginPath(); ctx.ellipse(5, hy + 1, 3.5, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  if (back) return;
  // la mancha de pintura roja alrededor de un ojo
  ctx.fillStyle = 'rgba(224,90,106,0.85)'; ctx.beginPath(); ctx.ellipse(3.6, hy - 1.6, 4.6, 4.2, 0.3, 0, Math.PI * 2); ctx.fill();
  // los ojos azules de gato, con la raya negra
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#59c2d8'; ctx.beginPath(); ctx.ellipse(s * 3.6, hy - 1.6, 2.6, 2.9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = chasing ? '#c81e2b' : '#1a1a1a'; ctx.fillRect(s * 3.6 - 0.35, hy - 3.6, 0.7, 4);
  }
  ctx.fillStyle = '#d42a36'; ctx.beginPath(); ctx.moveTo(-0.9, hy + 1.6); ctx.lineTo(0.9, hy + 1.6); ctx.lineTo(0, hy + 2.6); ctx.closePath(); ctx.fill();   // la nariz
  if (boca) {   // la boca del gato se ha convertido en la boca de Caty (Elora)
    ctx.save(); ctx.translate(0, hy + 5); ctx.scale(0.5, 0.5); bocaGato(ctx, boca, 1); ctx.restore();
    return;
  }
  // la boca abierta con los dientes y la lengua roja
  ctx.fillStyle = '#3a1a1a'; ctx.beginPath(); ctx.ellipse(0, hy + 5.4, 4, 2.4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-3.6, hy + 4.4);
  for (let k = 0; k <= 6; k++) ctx.lineTo(-3.6 + k * 1.2, hy + (k % 2 ? 5.6 : 4.4));
  ctx.lineTo(3.6, hy + 4); ctx.lineTo(-3.6, hy + 4); ctx.closePath(); ctx.fill();
  // la sangre que le cae de la boca como saliva (Elora: no es la lengua)
  const baba = 2.5 + (walk * 0.5) % 2.5;
  ctx.fillStyle = '#c41e2a'; ctx.fillRect(1.6, hy + 6, 1.2, baba); dot(ctx, 2.2, hy + 6.4 + baba, 0.9);
}

// Tarda (dibujo de Elora): un gusano gris largo y enroscado, con muchas patitas con garras rojas, el ojo negro en
// espiral y la boca roja. Mira hacia donde va (izquierda o derecha).
function drawTardaB(ctx, facing, walk, chasing) {
  const gris = '#b9b9bf', grisOsc = '#8c8c94';
  const dir = facing === 'left' ? -1 : 1;
  ctx.save(); ctx.scale(dir, 1);
  // el cuerpo: una curva de bolitas desde la cola (detrás, a la izquierda) hasta la cabeza (delante, a la derecha)
  const puntos = [];
  for (let k = 0; k <= 12; k++) {
    const u = k / 12, ang = Math.PI * (1.05 - u * 1.1);
    puntos.push([Math.cos(ang) * 16 + u * 4, -1 - Math.sin(ang) * 6 + Math.sin(walk * 0.8 + k * 0.7) * 0.8, 6 - Math.abs(u - 0.55) * 2.4]);
  }
  // las patitas (4 pares) por debajo del cuerpo, con las garras rojas
  for (let k = 1; k <= 11; k += 2.5) {
    const [px, py] = puntos[Math.round(k)];
    const sw = Math.sin(walk * (chasing ? 2.2 : 1) + k) * 2;
    ctx.strokeStyle = grisOsc; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(px, py + 3); ctx.lineTo(px + sw, 9); ctx.stroke();
    ctx.fillStyle = ROJO; dot(ctx, px + sw, 9.6, 1.9);
    ctx.strokeStyle = ROJO; ctx.lineWidth = 0.7; ctx.beginPath();
    for (const a of [-0.5, 0, 0.5]) { ctx.moveTo(px + sw, 9.6); ctx.lineTo(px + sw + Math.sin(a) * 2.6, 11.4); }
    ctx.stroke();
  }
  for (const [px, py, r] of puntos) { ctx.fillStyle = grisOsc; dot(ctx, px, py + 0.8, r); }
  for (const [px, py, r] of puntos) { ctx.fillStyle = gris; dot(ctx, px, py, r - 0.4); }
  // rayitas del cuerpo
  ctx.strokeStyle = grisOsc; ctx.lineWidth = 0.6; ctx.beginPath();
  for (let k = 2; k < 12; k += 2) { const [px, py, r] = puntos[k]; ctx.moveTo(px, py - r + 1); ctx.lineTo(px, py + r - 1); }
  ctx.stroke();
  // la cabeza, al final: el ojo negro en espiral y la boca roja
  const [hx, hy] = puntos[12];
  ctx.fillStyle = gris; dot(ctx, hx + 2, hy, 5.6);
  ctx.fillStyle = '#1a1a1a'; dot(ctx, hx + 2.6, hy - 1.4, 2.4);
  ctx.strokeStyle = '#666'; ctx.lineWidth = 0.4; ctx.beginPath();
  for (let a = 0; a < Math.PI * 4; a += 0.3) { const rad = a * 0.17; ctx.lineTo(hx + 2.6 + Math.cos(a) * rad, hy - 1.4 + Math.sin(a) * rad); }
  ctx.stroke();
  if (chasing) { ctx.fillStyle = '#c81e2b'; dot(ctx, hx + 2.6, hy - 1.4, 0.8); }
  ctx.fillStyle = ROJO; ctx.fillRect(hx + 4.6, hy + 0.6, 3.4, 2.8);
  ctx.fillStyle = '#fff'; ctx.fillRect(hx + 5, hy + 0.6, 0.8, 1); ctx.fillRect(hx + 6.6, hy + 0.6, 0.8, 1);
  ctx.restore();
}

// ------------------------------------------------------------------ las bocas que se ríen (Bloodie Caty)

// Bocas por el suelo y por las paredes que dan al suelo; una de ellas, la del gato, lejos de donde empiezas.
// Hoppy Bloody, según el dibujo de Elora (assets/referencias/bloodies/hoppy.webp, 11-11-2026): la maceta más alta,
// rota por una esquina de arriba y desconchada por abajo; debajo, una sonrisa enorme de dientes en punta; la manta
// sucia, gris marronácea, con manchas de sangre y la tira de abajo con las florecitas solo dibujadas (sin color); las
// manitas con garras sujetándola, y dos pies grises. Los tallos de la maceta, larguísimos, bajan hasta el suelo como
// patas de araña y acaban en unas flores rojas que son GARRAS.
function drawHoppyB(ctx, facing, walk, chasing) {
  const back = facing === 'up', hx = 0, hy = back ? -15 : -14;
  const manta = '#a39a8e', mantaOsc = '#7d7468', piel = '#d6b8a0', tallo = '#6fb83a', talloOsc = '#3c7a1e';
  const maceta = '#b07a5a', macetaOsc = '#7a4e34', raya = '#2a1a14';
  const step = Math.sin(walk) * 1.6;
  // los tallos-patas: salen de los lados de la maceta, se abren y bajan hasta el suelo; las garras rojas se apoyan
  // en el suelo y se van levantando al andar, una y otra
  for (const side of [-1, 1]) {
    const sube = Math.max(0, Math.sin(walk + (side > 0 ? Math.PI : 0))) * (chasing ? 3.4 : 2.2);
    const base = [hx + side * 8.6, hy + 1.4], codo = [side * 22, hy - 2 - sube], pie = [side * 19, 9.4 - sube];
    ctx.lineCap = 'round';
    ctx.strokeStyle = talloOsc; ctx.lineWidth = 3.6;
    ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.quadraticCurveTo(codo[0], codo[1], pie[0], pie[1] - 2); ctx.stroke();
    ctx.strokeStyle = tallo; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(base[0], base[1]); ctx.quadraticCurveTo(codo[0], codo[1], pie[0], pie[1] - 2); ctx.stroke();
    // la flor roja-garra: un capullo rojo y cuatro uñas curvas que se clavan en el suelo
    ctx.fillStyle = '#c4303a';
    ctx.beginPath(); ctx.ellipse(pie[0], pie[1] - 1.2, 2.6, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#a3141c'; ctx.lineWidth = 1.3;
    for (const o of [-2.6, -1, 1, 2.6]) {
      ctx.beginPath(); ctx.moveTo(pie[0] + o * 0.5, pie[1] - 0.4);
      ctx.quadraticCurveTo(pie[0] + o * 1.5, pie[1] - 0.6, pie[0] + o * 1.7, pie[1] + 1.6); ctx.stroke();
    }
    ctx.fillStyle = SANGRE; dot(ctx, pie[0] + side * 0.6, pie[1] + 1.4, 0.7);
  }
  // Elora: NO tiene pies; anda solo con las plantas, y el cuerpo va flotando. La manta la lleva por detrás, echada
  // hacia atrás por el viento (al andar de lado, ondea hacia el lado contrario)
  const viento = facing === 'left' ? 1 : facing === 'right' ? -1 : 0, ola = Math.sin(walk * 1.3) * 1.2;
  const manta_ = () => {
    ctx.beginPath(); ctx.moveTo(-4.4, -7); ctx.lineTo(4.4, -7);
    ctx.quadraticCurveTo(9 + viento * 3, -1, 11 + viento * 6 + ola, 6.4 - ola * 0.5);
    ctx.quadraticCurveTo(6 + viento * 5, 8.6 + ola, 0 + viento * 5, 7.4);
    ctx.quadraticCurveTo(-6 + viento * 5, 8.6 - ola, -11 + viento * 6 - ola, 6.4 + ola * 0.5);
    ctx.quadraticCurveTo(-9 + viento * 3, -1, -4.4, -7); ctx.closePath();
  };
  const pintaManta = () => {
    ctx.fillStyle = manta; manta_(); ctx.fill();
    ctx.save(); manta_(); ctx.clip();
    ctx.fillStyle = mantaOsc; ctx.globalAlpha *= 0.4; ctx.fillRect(4 + viento * 4, -8, 10, 18); ctx.globalAlpha /= 0.4;
    // la tira de abajo, con las florecitas solo dibujadas
    ctx.fillStyle = '#e8e4dc'; ctx.strokeStyle = raya; ctx.lineWidth = 0.35;
    ctx.beginPath(); ctx.moveTo(-13 + viento * 6, 3.6); ctx.quadraticCurveTo(viento * 5, 5.2, 13 + viento * 6, 3.6); ctx.lineTo(13 + viento * 6, 12); ctx.lineTo(-13 + viento * 6, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (let x = -9; x <= 9.1; x += 2.6) {
      const fx = x + viento * 5.5, fy = 5.8 + Math.abs(x) * 0.08;
      ctx.beginPath(); ctx.arc(fx, fy, 0.7, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.moveTo(fx + Math.cos(a) * 0.8, fy + Math.sin(a) * 0.8); ctx.lineTo(fx + Math.cos(a) * 1.2, fy + Math.sin(a) * 1.2); } ctx.stroke();
    }
    ctx.fillStyle = '#c4303a'; for (const [x, y, r] of [[7, 0, 1.1], [-7.4, 2, 1.2]]) { ctx.beginPath(); ctx.ellipse(x + viento * 3, y, r * 1.2, r, 0.3, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = raya; ctx.lineWidth = 0.6; manta_(); ctx.stroke();
  };
  // el cuerpo: largo y gris, flotando (sin pies), con manchas de sangre
  const cuerpo_ = () => { ctx.beginPath(); ctx.moveTo(-4.2, -7); ctx.lineTo(4.2, -7); ctx.quadraticCurveTo(5.4, 1, 3.8, 6.2); ctx.quadraticCurveTo(0, 8.4, -3.8, 6.2); ctx.quadraticCurveTo(-5.4, 1, -4.2, -7); ctx.closePath(); };
  const flota = Math.sin(walk * 0.5) * 0.6;
  const pintaCuerpo = () => {
    ctx.save(); ctx.translate(0, flota);
    ctx.fillStyle = '#9a948c'; cuerpo_(); ctx.fill();
    ctx.fillStyle = '#c4303a'; for (const [x, y, r] of [[2.4, -2, 1.1], [-2.2, 3, 1.2], [1.6, 4.4, 0.7]]) { ctx.beginPath(); ctx.ellipse(x, y, r * 1.2, r, 0.3, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = raya; ctx.lineWidth = 0.6; cuerpo_(); ctx.stroke();
    if (!back) {
      // las manitas con garras, sujetando la manta por delante del pecho
      for (const [x, y, s] of [[0.6, -3.4, 1], [-0.6, -1.2, -1]]) {
        ctx.fillStyle = piel; ctx.beginPath(); ctx.ellipse(x + s * 1.2, y, 1.9, 1.2, s * 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = raya; ctx.lineWidth = 0.4;
        for (const k of [-0.8, 0, 0.8]) { ctx.beginPath(); ctx.moveTo(x - s * 0.4, y + k); ctx.lineTo(x - s * 1.4, y + k + 0.5); ctx.stroke(); }
      }
    }
    ctx.restore();
  };
  // de frente o de lado, la manta va por detrás; de espaldas, se ve por encima
  if (back) { pintaCuerpo(); pintaManta(); } else { pintaManta(); pintaCuerpo(); }
  // la cara, debajo de la maceta
  ctx.fillStyle = piel; dot(ctx, hx, hy, 9);
  // la maceta, más alta: rota por la esquina de arriba (a la derecha) y desconchada por abajo (a la izquierda)
  const top = hy - 15;
  ctx.fillStyle = maceta;
  ctx.beginPath(); ctx.moveTo(hx - 6.4, top); ctx.lineTo(hx + 2.4, top); ctx.lineTo(hx + 3.4, top + 1.6); ctx.lineTo(hx + 4.6, top + 0.4);
  ctx.lineTo(hx + 5.4, top + 2.4); ctx.lineTo(hx + 6.6, top + 1.4); ctx.lineTo(hx + 9.8, hy - 0.4); ctx.lineTo(hx - 9.8, hy - 0.4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = macetaOsc; ctx.globalAlpha *= 0.4;
  ctx.beginPath(); ctx.moveTo(hx + 3, top + 1); ctx.lineTo(hx + 6.6, top + 1.4); ctx.lineTo(hx + 9.8, hy - 0.4); ctx.lineTo(hx + 5, hy - 0.4); ctx.closePath(); ctx.fill();
  ctx.globalAlpha /= 0.4;
  ctx.strokeStyle = raya; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(hx - 6.4, top); ctx.lineTo(hx + 2.4, top); ctx.lineTo(hx + 3.4, top + 1.6); ctx.lineTo(hx + 4.6, top + 0.4);
  ctx.lineTo(hx + 5.4, top + 2.4); ctx.lineTo(hx + 6.6, top + 1.4); ctx.lineTo(hx + 9.8, hy - 0.4); ctx.moveTo(hx - 6.4, top); ctx.lineTo(hx - 9.8, hy - 0.4); ctx.stroke();
  // el borde de la maceta y el desconchón de abajo (Elora: por ahí asoma su ojo)
  ctx.fillStyle = '#c99070'; rrectB(ctx, hx - 10.8, hy - 1.4, 21.6, 3.2, 1);
  ctx.strokeStyle = raya; ctx.lineWidth = 0.45; ctx.strokeRect(hx - 10.8, hy - 1.4, 21.6, 3.2);
  ctx.fillStyle = '#e8d8c4'; ctx.beginPath(); ctx.moveTo(hx - 7.6, hy - 1.6); ctx.lineTo(hx - 6.6, hy - 4.2); ctx.lineTo(hx - 5.6, hy - 2.8); ctx.lineTo(hx - 4.4, hy - 4.6); ctx.lineTo(hx - 3.4, hy - 1.6); ctx.closePath(); ctx.fill(); ctx.stroke();
  // Elora: en el desconchón asoma su OJO, amarillo y medio cerrado
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(hx - 5.5, hy - 2.6, 1.7, 1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#1a0a06'; ctx.beginPath(); ctx.ellipse(hx - 5.3, hy - 2.4, 0.35, 0.7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#b07a5a'; ctx.beginPath(); ctx.ellipse(hx - 5.5, hy - 3.2, 1.9, 0.9, 0, Math.PI, Math.PI * 2); ctx.fill();   // el párpado, medio cerrado
  ctx.strokeStyle = raya; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(hx - 7.3, hy - 3); ctx.quadraticCurveTo(hx - 5.5, hy - 2.4, hx - 3.7, hy - 3); ctx.stroke();
  if (back) return;
  // la sonrisa enorme con los dientes en punta, y la naricita
  ctx.fillStyle = raya; dot(ctx, hx, hy + 2.6, 0.5);
  ctx.fillStyle = '#3a1418';
  ctx.beginPath(); ctx.moveTo(hx - 5.4, hy + 3.6); ctx.quadraticCurveTo(hx, hy + 8.4, hx + 5.4, hy + 3.6); ctx.quadraticCurveTo(hx, hy + 5.4, hx - 5.4, hy + 3.6); ctx.fill();
  ctx.fillStyle = '#f7f2e6';
  ctx.beginPath(); ctx.moveTo(hx - 4.8, hy + 4); for (let k = 0; k <= 8; k++) ctx.lineTo(hx - 4.8 + k * 1.2, hy + (k % 2 ? 6 : 4.4)); ctx.lineTo(hx + 4.8, hy + 4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = raya; ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(hx - 5.4, hy + 3.6); ctx.quadraticCurveTo(hx, hy + 8.4, hx + 5.4, hy + 3.6); ctx.stroke();
  ctx.fillStyle = '#c4303a'; ctx.fillRect(hx + 2.2, hy + 6.4, 0.8, 1.6 + (walk * 0.5) % 2);   // la sangre que le cae
}
function rrectB(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill();
}

// Los girasoles marchitos de Hoppy Bloody, por el suelo, lejos de donde empiezas [PROVISIONAL]
export function hacerGirasoles(L, start, T, TILE) {
  const sitios = [];
  for (let ty = 1; ty < L.h - 1; ty++) for (let tx = 1; tx < L.w - 1; tx++) {
    if (L.tiles[ty * L.w + tx] !== T.FLOOR) continue;
    const x = (tx + 0.5) * TILE, y = (ty + 0.5) * TILE;
    if (Math.hypot(x - start.x, y - start.y) > TILE * 5) sitios.push({ x, y });
  }
  const lista = [];
  for (let k = 0; k < BE.girasoles && sitios.length; k++) {
    const c = sitios.splice(Math.floor(Math.random() * sitios.length), 1)[0];
    lista.push({ x: c.x + (Math.random() - 0.5) * 10, y: c.y + (Math.random() - 0.5) * 8, grita: 0, espera: 0, fase: Math.random() * 6 });
  }
  return lista;
}
// Los girasoles con ojo del dibujo de Elora: un tallo verde con raíces y hojas en el suelo, y dos girasoles (uno
// grande y otro pequeño en una ramita) con un OJO en el centro: el blanco con venitas rojas, el iris verde y la pupila
// de raya, que te sigue. Cuando gritan, tiemblan, la pupila se hace grande y el ojo se pone rojo
export function drawGirasol(ctx, g, time, px, py) {
  const grita = g.grita > 0, tiembla = grita ? Math.sin(time * 40) * 0.8 : Math.sin(time * 1.5 + g.fase) * 0.3;
  ctx.save(); ctx.lineCap = 'round';
  ctx.translate(g.x, g.y); ctx.scale(1.3, 1.3); ctx.translate(-g.x, -g.y);
  const x = g.x, y = g.y;
  // las raíces y las hojas del suelo
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x, y + 1, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2f6e2a'; ctx.lineWidth = 0.9;
  for (const a of [-2.6, -2, -1.2, 1.2, 2, 2.6]) { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.sign(a) * 2, y + 0.6, x + a * 1.8, y + 1.4 + Math.abs(a) * 0.3); ctx.stroke(); }
  ctx.fillStyle = '#3c8e2a';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + s * 3, y - 1.4, 2.6, 0.9, s * 0.5, 0, Math.PI * 2); ctx.fill(); }
  // el tallo, ondulado, y la ramita del girasol pequeño
  const hx = x + 2 + tiembla, hy = y - 17, sx = x + 6.4 + tiembla * 0.5, sy = y - 10;
  ctx.strokeStyle = '#3c8e2a'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x - 3, y - 6, x + 4, y - 10, hx, hy + 3); ctx.stroke();
  ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(x + 1, y - 7); ctx.quadraticCurveTo(x + 4, y - 7, sx, sy + 1.6); ctx.stroke();
  const flor = (cx, cy, r) => {
    ctx.fillStyle = grita ? '#ffd23f' : '#f2cc3a'; ctx.strokeStyle = '#6a5a1a'; ctx.lineWidth = 0.3;
    for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4 + 0.2;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(a - 0.32) * r, cy + Math.sin(a - 0.32) * r);
      ctx.lineTo(cx + Math.cos(a) * r * 2.05, cy + Math.sin(a) * r * 2.05); ctx.lineTo(cx + Math.cos(a + 0.32) * r, cy + Math.sin(a + 0.32) * r); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    // el ojo: el blanco con venitas, el iris verde y la pupila de raya que te mira
    ctx.fillStyle = '#fbf8f2'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d42a36'; ctx.lineWidth = 0.22;
    for (const a of [0.3, 1.4, 2.6, 3.9, 5.1]) { ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); ctx.lineTo(cx + Math.cos(a + 0.2) * r * 0.62, cy + Math.sin(a + 0.2) * r * 0.62); ctx.stroke(); }
    const dx = Math.max(-1, Math.min(1, (px - cx) / 50)) * r * 0.22, dy = Math.max(-1, Math.min(1, (py - cy) / 50)) * r * 0.22;
    ctx.fillStyle = grita ? '#d42a36' : '#2fae48'; ctx.beginPath(); ctx.arc(cx + dx, cy + dy, r * 0.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0e0a08'; ctx.beginPath(); ctx.ellipse(cx + dx, cy + dy, grita ? r * 0.32 : r * 0.12, r * 0.42, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  };
  flor(sx, sy, 1.5);
  flor(hx, hy, 2.6);
  ctx.restore();
}

// El girasol garra (Elora): cuando pisas un girasol con ojo, sale del suelo, a tus pies, otro girasol con los pétalos
// en forma de garra: sube, se cierra sobre ti como una mano y se vuelve a meter. g.garra va de 0 a 1 (segundos)
export function drawGirasolGarra(ctx, g) {
  const t = g.garra, x = g.gx, y = g.gy + 8;
  const sube = t < 0.25 ? t / 0.25 : t > 0.7 ? Math.max(0, 1 - (t - 0.7) / 0.3) : 1;   // sube, se queda y baja
  const cierra = t < 0.25 ? 0 : Math.min(1, (t - 0.25) / 0.2);                        // las garras se cierran
  const alto = 26 * sube;
  ctx.save(); ctx.lineCap = 'round';
  // el agujero del suelo, con tierra
  ctx.fillStyle = '#3a2a1e'; ctx.beginPath(); ctx.ellipse(x, y, 7 * Math.max(sube, 0.4), 2.4, 0, 0, Math.PI * 2); ctx.fill();
  if (sube <= 0) { ctx.restore(); return; }
  // el tallo que sale del agujero
  ctx.strokeStyle = '#2f6e2a'; ctx.lineWidth = 3.4;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 3, y - alto * 0.5, x, y - alto); ctx.stroke();
  ctx.strokeStyle = '#4caa36'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - 3, y - alto * 0.5, x, y - alto); ctx.stroke();
  // la cabeza: el centro con el ojo rojo y los pétalos amarillos en forma de garra, que se cierran
  const hx = x, hy = y - alto;
  for (let k = 0; k < 6; k++) {
    const a0 = -Math.PI / 2 + (k - 2.5) * 0.5 * (1 - cierra * 0.55);
    const largo = 9 * sube;
    const px = hx + Math.cos(a0) * largo, py = hy + Math.sin(a0) * largo;
    const curva = (k < 3 ? 1 : -1) * (2 + cierra * 3);
    ctx.strokeStyle = '#6a5a1a'; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo((hx + px) / 2 + curva, (hy + py) / 2, px, py); ctx.stroke();
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo((hx + px) / 2 + curva, (hy + py) / 2, px, py); ctx.stroke();
    ctx.fillStyle = '#c4303a'; ctx.beginPath(); ctx.arc(px, py, 1.2, 0, Math.PI * 2); ctx.fill();   // la uña roja
  }
  ctx.fillStyle = '#fbf8f2'; ctx.beginPath(); ctx.arc(hx, hy, 3.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#d42a36'; ctx.beginPath(); ctx.arc(hx, hy, 2.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0e0a08'; ctx.beginPath(); ctx.ellipse(hx, hy, 0.6, 1.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(hx, hy, 3.6, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

export function hacerBocas(L, start, T, TILE) {
  const suelo = [], pared = [];
  for (let ty = 1; ty < L.h - 1; ty++) for (let tx = 1; tx < L.w - 1; tx++) {
    const t = L.tiles[ty * L.w + tx];
    if (t === T.FLOOR) suelo.push({ tx, ty });
    else if (t === T.WALL && L.tiles[(ty + 1) * L.w + tx] === T.FLOOR) pared.push({ tx, ty });
  }
  const bocas = [];
  const coger = (lista) => lista.splice(Math.floor(Math.random() * lista.length), 1)[0];
  for (let k = 0; k < BE.bocas && (suelo.length || pared.length); k++) {
    const enPared = pared.length && (k % 3 === 0 || !suelo.length);
    const c = coger(enPared ? pared : suelo);
    bocas.push({ x: (c.tx + 0.2 + Math.random() * 0.6) * TILE, y: (c.ty + (enPared ? 0.55 : 0.2 + Math.random() * 0.6)) * TILE,
      k: 0.7 + Math.random() * 0.6, fase: Math.random() * 6, ang: (Math.random() - 0.5) * 0.5 });
  }
  // la del gato: en el suelo, a más de 6 casillas de donde empiezas
  const lejos = suelo.filter((c) => Math.hypot((c.tx + 0.5) * TILE - start.x, (c.ty + 0.5) * TILE - start.y) > TILE * 6);
  const c = lejos.length ? lejos[Math.floor(Math.random() * lejos.length)] : (suelo[0] || { tx: 2, ty: 2 });
  bocas.push({ x: (c.tx + 0.5) * TILE, y: (c.ty + 0.5) * TILE, k: 1.1, fase: 0, ang: 0, gato: true, muerde: 0, espera: 0, sitios: suelo, tile: TILE });
  return bocas;
}

// Una boca riéndose (como en el dibujo: media luna con los dientes a rayas); la del gato lleva colmillos y la ω
export function drawBoca(ctx, b, time) {
  const abre = 0.55 + 0.45 * Math.abs(Math.sin(time * 5 + b.fase));
  ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.ang); ctx.scale(b.k, b.k);
  if (b.gato) {
    if (b.coge == null && !(b.baja > 0)) {   // mientras sale media Caty, la boca es la suya; luego aparece en otro sitio
      if (b.aparece > 0) ctx.scale(1 - b.aparece / 0.4, 1 - b.aparece / 0.4);
      bocaGato(ctx, b, abre);
    }
    ctx.restore(); return;
  }
  const w = 7, h = 6 * abre;
  const forma = () => { ctx.beginPath(); ctx.moveTo(-w, 0); ctx.quadraticCurveTo(0, h * 1.9, w, 0); ctx.closePath(); };
  ctx.fillStyle = '#3a0a10'; forma(); ctx.fill();
  ctx.save(); forma(); ctx.clip();
  ctx.fillStyle = '#f4efe6';   // los dientes de arriba, a rayas
  ctx.fillRect(-w, 0, w * 2, Math.min(h * 0.55, 3.4));
  ctx.strokeStyle = '#8a7f74'; ctx.lineWidth = 0.4; ctx.beginPath();
  for (let x = -w + 2; x < w; x += 2) { ctx.moveTo(x, 0); ctx.lineTo(x, 3.4); }
  ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = '#c8303c'; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-w - 0.5, 0.2); ctx.quadraticCurveTo(0, -1.6, w + 0.5, 0.2); ctx.stroke();
  ctx.restore();
}

// Después de coger a alguien, la boca del gato desaparece y aparece en otro sitio (Elora), lejos de ti
export function moverBoca(b, px, py) {
  const T = b.tile, lejos = b.sitios.filter((c) => Math.hypot((c.tx + 0.5) * T - px, (c.ty + 0.5) * T - py) > T * 6);
  const lista = lejos.length ? lejos : b.sitios;
  if (!lista.length) return;
  const c = lista[Math.floor(Math.random() * lista.length)];
  b.x = (c.tx + 0.5) * T; b.y = (c.ty + 0.5) * T; b.aparece = 0.4;
}

// Media Caty (Elora): cuando pasas por la boca del gato, sale de ella de cintura para arriba, te coge con los
// brazos y te quita 2 corazones; luego se vuelve a meter. Cuánto ha salido, de 0 a 1:
const GRANDE = 1.5;   // media Caty sale más grande que tú, para que se vea bien [PROVISIONAL]
function cuantoSale(b) {
  if (b.coge != null) return Math.min(1, b.coge / 0.3);
  if (b.baja > 0) return b.baja / 0.5;
  return 0;
}
// el cuerpo (debajo de ti)
export function drawMediaCaty(ctx, b, time) {
  const sube = cuantoSale(b);
  if (sube <= 0) return;
  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(GRANDE, GRANDE);
  ctx.fillStyle = SANGRE; ctx.beginPath(); ctx.ellipse(0, 1, 15 * sube, 5 * sube, 0, 0, Math.PI * 2); ctx.fill();   // el charco
  ctx.beginPath(); ctx.rect(-40, -70, 80, 71); ctx.clip();   // solo se ve lo que ha salido por encima de la boca
  ctx.translate(0, -6 + (1 - sube) * 46);   // sale un poco por encima de ti, para que se le vea la cara
  drawCatyB(ctx, 'down', time * 3, true, true, b);
  ctx.restore();
}
// los brazos (encima de ti): se estiran desde los hombros y te rodean
export function drawBrazosCaty(ctx, b, px, py) {
  const sube = cuantoSale(b);
  if (sube <= 0) return;
  const estira = b.coge != null ? Math.min(1, Math.max(0, (b.coge - 0.15) / 0.3)) : sube;
  const am = '#f2d64a';
  ctx.save(); ctx.translate(b.x, b.y); ctx.scale(GRANDE, GRANDE);
  const hy = -6 + (1 - sube) * 46 - 8;   // la altura de los hombros
  const dx = (px - b.x) / GRANDE, dy = (py - b.y - 6) / GRANDE;
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const sx = side * 5, mx = dx + side * 7, my = dy;           // del hombro a tu cintura, por un lado
    const hx = sx + (mx - sx) * estira, hyy = hy + (my - hy) * estira;
    ctx.strokeStyle = am; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sx, hy); ctx.quadraticCurveTo(sx + side * 9, (hy + hyy) / 2, hx, hyy); ctx.stroke();
    ctx.fillStyle = '#e05a6a'; dot(ctx, hx - side * 1.5 * estira, hyy, 2.2);   // la punta roja de la mano
  }
  ctx.restore();
}

// La boca del gato, como la boca del dibujo de Caty de Elora: una sonrisa enorme con las puntas hacia arriba,
// abierta, con los dientes de arriba en zigzag (las «montañitas al revés»), dos colmillos largos, sangre que le
// cae por un lado como saliva (Elora) y la naricita roja de triángulo encima
function bocaGato(ctx, b, abre) {
  const w = 8.5, h = (b.muerde > 0 ? 6 : 3.8 + abre * 1);
  const sonrisa = () => {
    ctx.beginPath(); ctx.moveTo(-w - 1.2, -2.6);
    ctx.quadraticCurveTo(-w + 0.4, -0.6, -w + 1.6, -0.4);          // la punta de la izquierda, que sube
    ctx.lineTo(w - 1.6, -0.4); ctx.quadraticCurveTo(w - 0.4, -0.6, w + 1.2, -2.6);   // y la de la derecha
    ctx.quadraticCurveTo(w * 0.4, h * 1.6, 0, h * 1.6); ctx.quadraticCurveTo(-w * 0.4, h * 1.6, -w - 1.2, -2.6);
    ctx.closePath();
  };
  ctx.fillStyle = '#2a0a0e'; sonrisa(); ctx.fill();
  ctx.save(); sonrisa(); ctx.clip();
  // los dientes de arriba en zigzag
  ctx.fillStyle = '#fbf8f0'; ctx.beginPath(); ctx.moveTo(-w - 1, -1);
  for (let k = 0, x = -w + 1.6; x <= w - 1.6 + 0.01; k++, x += (w * 2 - 3.2) / 8) ctx.lineTo(x, k % 2 ? 2.6 : -0.4);
  ctx.lineTo(w + 1, -1); ctx.closePath(); ctx.fill();
  ctx.restore();
  // el borde de la sonrisa
  ctx.strokeStyle = '#2a1a1a'; ctx.lineWidth = 0.7; sonrisa(); ctx.stroke();
  // los colmillos largos, en los lados
  ctx.fillStyle = '#fbf8f0'; ctx.strokeStyle = '#6b5f55'; ctx.lineWidth = 0.45;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(s * (w - 5), -0.4); ctx.lineTo(s * (w - 2.6), -0.4); ctx.lineTo(s * (w - 3.8), 5); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  // la sangre que le cae de la boca por un lado, como saliva (Elora): un chorretón que se estira y una gota
  const baba = 4 + (b.fase * 3 + abre * 2) % 3;
  ctx.fillStyle = '#c41e2a';
  ctx.beginPath(); ctx.moveTo(w - 4.4, 1.6); ctx.quadraticCurveTo(w - 3, 0.8, w - 1.6, 1.6);
  ctx.quadraticCurveTo(w - 2.2, 1.6 + baba * 0.6, w - 2.6, 1.6 + baba); ctx.quadraticCurveTo(w - 3.2, 1.6 + baba * 0.6, w - 4.4, 1.6); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.arc(w - 2.7, 2.4 + baba, 1.1, 0, Math.PI * 2); ctx.fill();
  // la naricita roja de triángulo
  ctx.beginPath(); ctx.moveTo(-1.5, -5.4); ctx.lineTo(1.5, -5.4); ctx.lineTo(0, -3.4); ctx.closePath(); ctx.fill();
}

// ------------------------------------------------------------------ el minijuego de la pecera (Bloodie Oct)

// Un laberinto de algas (Elora: bastante grande, pero no demasiado), con la salida en un borde
export function nuevaPecera() {
  const W = BE.pecera[0], H = BE.pecera[1];
  const muros = [];   // por celda: [arriba, derecha, abajo, izquierda]
  for (let i = 0; i < W * H; i++) muros.push([true, true, true, true]);
  const visto = new Array(W * H).fill(false);
  const pila = [[0, 0]]; visto[0] = true;
  const D = [[0, -1, 0, 2], [1, 0, 1, 3], [0, 1, 2, 0], [-1, 0, 3, 1]];
  while (pila.length) {
    const [cx, cy] = pila[pila.length - 1];
    const op = D.filter(([dx, dy]) => { const nx = cx + dx, ny = cy + dy; return nx >= 0 && ny >= 0 && nx < W && ny < H && !visto[ny * W + nx]; });
    if (!op.length) { pila.pop(); continue; }
    const [dx, dy, a, b] = op[Math.floor(Math.random() * op.length)];
    const nx = cx + dx, ny = cy + dy;
    muros[cy * W + cx][a] = false; muros[ny * W + nx][b] = false; visto[ny * W + nx] = true; pila.push([nx, ny]);
  }
  // el pulpito empieza en el centro y la salida está en el borde de la derecha, en una fila al azar
  const salida = { x: W - 1, y: Math.floor(Math.random() * H) };
  muros[salida.y * W + salida.x][1] = false;
  return { W, H, muros, x: Math.floor(W / 2) - 1, y: Math.floor(H / 2), salida, t: 0, rep: 0, fuera: false, sale: 0 };
}

// Mueve el pulpito con las flechitas. Devuelve true cuando ha salido al mar.
export function updatePecera(pz, dt, ax) {
  pz.t += dt;
  if (pz.fuera) { pz.sale += dt; return pz.sale > 0.6; }
  pz.rep -= dt;
  const dx = Math.abs(ax.x) > 0.5 ? Math.sign(ax.x) : 0, dy = !dx && Math.abs(ax.y) > 0.5 ? Math.sign(ax.y) : 0;
  if (!dx && !dy) { pz.rep = 0; return false; }
  if (pz.rep > 0) return false;
  pz.rep = pz.movido ? 0.14 : 0.22; pz.movido = true;
  const m = pz.muros[pz.y * pz.W + pz.x];
  const lado = dy < 0 ? 0 : dx > 0 ? 1 : dy > 0 ? 2 : 3;
  if (m[lado]) return false;
  if (pz.x === pz.salida.x && pz.y === pz.salida.y && lado === 1) { pz.fuera = true; return false; }
  pz.x += dx; pz.y += dy;
  return false;
}

// La pecera, en el centro de la pantalla. falta: de 0 a 1, lo que le queda a Oct para encontrarte
export function drawPecera(ctx, pz, VW, VH, time, textos, falta) {
  const cel = 30, mw = pz.W * cel, mh = pz.H * cel, x0 = Math.round((VW - mw) / 2) - 20, y0 = Math.round((VH - mh) / 2) + 6;
  ctx.save();
  ctx.fillStyle = 'rgba(10,6,20,0.55)'; ctx.fillRect(0, 0, VW, VH);
  // el mar, a la derecha de la pecera
  ctx.fillStyle = '#1f5fa8'; ctx.fillRect(x0 + mw + 6, y0 - 10, 70, mh + 20);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
  for (let k = 0; k < 4; k++) { ctx.beginPath(); for (let x = 0; x <= 70; x += 5) ctx.lineTo(x0 + mw + 6 + x, y0 + 10 + k * (mh / 4) + Math.sin(x * 0.2 + time * 3 + k) * 3); ctx.stroke(); }
  ctx.fillStyle = '#fff6dc'; ctx.font = 'bold 15px "Segoe UI", Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(textos.mar, x0 + mw + 41, y0 + mh + 22);
  // el agua de la pecera, el cristal y la arena
  ctx.fillStyle = '#8fd3f2'; ctx.fillRect(x0, y0, mw, mh);
  ctx.fillStyle = '#e8d29a'; ctx.fillRect(x0, y0 + mh - 6, mw, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  for (let k = 0; k < 6; k++) { const bx = x0 + ((k * 73) % mw), by = y0 + mh - ((time * 30 + k * 40) % mh); dot(ctx, bx, by, 2 + (k % 2)); }
  ctx.strokeStyle = '#cfefff'; ctx.lineWidth = 4; ctx.strokeRect(x0 - 2, y0 - 2, mw + 4, mh + 4);
  // las paredes del laberinto: algas verdes onduladas
  ctx.strokeStyle = '#2f9a4c'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  const alga = (ax, ay, bx, by) => {
    ctx.beginPath(); ctx.moveTo(ax, ay);
    const n = 4;
    for (let k = 1; k <= n; k++) { const u = k / n, mx = ax + (bx - ax) * u, my = ay + (by - ay) * u, o = Math.sin(time * 2 + mx * 0.1 + my * 0.1) * 1.6; ctx.lineTo(mx + (ay === by ? 0 : o), my + (ay === by ? o : 0)); }
    ctx.stroke();
  };
  for (let cy = 0; cy < pz.H; cy++) for (let cx = 0; cx < pz.W; cx++) {
    const m = pz.muros[cy * pz.W + cx], x = x0 + cx * cel, y = y0 + cy * cel;
    if (m[0]) alga(x, y, x + cel, y);
    if (m[3]) alga(x, y, x, y + cel);
    if (cy === pz.H - 1 && m[2]) alga(x, y + cel, x + cel, y + cel);
    if (cx === pz.W - 1 && m[1]) alga(x + cel, y, x + cel, y + cel);
  }
  // la salida, marcada
  ctx.fillStyle = '#ffe36b'; ctx.font = 'bold 18px "Segoe UI", Arial';
  ctx.fillText('➜', x0 + mw + 14, y0 + pz.salida.y * cel + cel / 2);
  // el pulpito azul, pequeñito
  const px = x0 + pz.x * cel + cel / 2 + (pz.fuera ? pz.sale * 90 : 0), py = y0 + pz.y * cel + cel / 2 + Math.sin(time * 4) * 1.5;
  ctx.fillStyle = '#3f7fe0'; dot(ctx, px, py - 3, 6.5);
  ctx.strokeStyle = '#3f7fe0'; ctx.lineWidth = 2;
  for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(px + k * 2.4, py + 1); ctx.quadraticCurveTo(px + k * 3 + Math.sin(time * 6 + k) * 1.5, py + 6, px + k * 3.4, py + 9); ctx.stroke(); }
  ctx.fillStyle = '#fff'; dot(ctx, px - 2.2, py - 4, 1.8); dot(ctx, px + 2.2, py - 4, 1.8);
  ctx.fillStyle = '#1a1a1a'; dot(ctx, px - 2, py - 3.8, 0.9); dot(ctx, px + 2.4, py - 3.8, 0.9);
  // el título y lo que le queda a Oct para encontrarte
  ctx.fillStyle = '#fff6dc'; ctx.font = 'bold 22px "Segoe UI", Arial';
  ctx.fillText(textos.titulo, VW / 2, y0 - 40);
  ctx.font = 'bold 15px "Segoe UI", Arial'; ctx.fillStyle = '#ffb3bd';
  ctx.fillText(textos.oct, VW / 2, y0 + mh + 46);
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(VW / 2 - 120, y0 + mh + 60, 240, 8);
  ctx.fillStyle = '#e0424d'; ctx.fillRect(VW / 2 - 120, y0 + mh + 60, 240 * Math.max(0, Math.min(1, falta)), 8);
  ctx.restore();
}
