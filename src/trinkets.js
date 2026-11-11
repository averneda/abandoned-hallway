// Los dibujos de los trinkets (Elora los describió en su página «Aspecto de los trinkets», 11-11-2026).
// drawTrinket(ctx, id) dibuja el trinket en un cuadrado de -50 a 50 (centro en 0, 0): se escala desde fuera.
// Recordatorio: un círculo por trazo (beginPath para cada uno) y nada de ctx.roundRect (usar rrect).
import { drawCharacter, characterById, rrect } from './characters.js';

const LINEA = '#2a2124';

function circulo(ctx, x, y, r, relleno, borde, grosor = 2) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  if (relleno) { ctx.fillStyle = relleno; ctx.fill(); }
  if (borde) { ctx.strokeStyle = borde; ctx.lineWidth = grosor; ctx.stroke(); }
}

// puntadas de hilo alrededor de un parche (rayitas cortas)
function puntadas(ctx, x, y, w, h, color) {
  ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  const paso = 5;
  ctx.beginPath();
  for (let i = x + 2; i < x + w - 1; i += paso) { ctx.moveTo(i, y - 1.5); ctx.lineTo(i + 2, y + 1.5); ctx.moveTo(i, y + h - 1.5); ctx.lineTo(i + 2, y + h + 1.5); }
  for (let j = y + 2; j < y + h - 1; j += paso) { ctx.moveTo(x - 1.5, j); ctx.lineTo(x + 1.5, j + 2); ctx.moveTo(x + w - 1.5, j); ctx.lineTo(x + w + 1.5, j + 2); }
  ctx.stroke();
}

// 🎒 Mochila grande: verde y marrón, de militar, cerrada y llena de cosas (abultada)
function mochila(ctx) {
  // las asas por detrás
  ctx.strokeStyle = '#4a3420'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-18, -26); ctx.quadraticCurveTo(0, -46, 18, -26); ctx.stroke();
  // el cuerpo, abultado
  ctx.fillStyle = '#5c6b38'; ctx.strokeStyle = LINEA; ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-30, -24); ctx.quadraticCurveTo(-40, 10, -32, 40); ctx.lineTo(32, 40); ctx.quadraticCurveTo(40, 10, 30, -24);
  ctx.quadraticCurveTo(0, -34, -30, -24); ctx.closePath(); ctx.fill(); ctx.stroke();
  // manchas de camuflaje (verde oscuro y marrón)
  for (const [x, y, r, c] of [[-20, 8, 7, '#43502a'], [14, 20, 8, '#6e5232'], [20, -4, 5, '#43502a'], [-10, 30, 6, '#6e5232'], [4, 6, 4, '#43502a']]) {
    ctx.save(); ctx.translate(x, y); ctx.scale(1.4, 0.8); circulo(ctx, 0, 0, r, c); ctx.restore();
  }
  // bolsillo de delante, marrón, con su tapa
  ctx.fillStyle = '#7a5a35'; rrect(ctx, -17, 12, 34, 22, 5); ctx.fill(); ctx.strokeStyle = LINEA; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = '#5e4326'; rrect(ctx, -18, 8, 36, 10, 4); ctx.fill(); ctx.stroke();
  // la tapa de arriba, marrón, cerrada con dos correas y hebillas
  ctx.fillStyle = '#7a5a35';
  ctx.beginPath(); ctx.moveTo(-30, -24); ctx.quadraticCurveTo(0, -36, 30, -24); ctx.lineTo(28, -4); ctx.quadraticCurveTo(0, 2, -28, -4); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (const x of [-14, 14]) {
    ctx.fillStyle = '#4a3420'; ctx.fillRect(x - 3, -6, 6, 20);
    ctx.fillStyle = '#c9b25a'; ctx.fillRect(x - 4.5, 6, 9, 6); ctx.strokeStyle = LINEA; ctx.lineWidth = 1.2; ctx.strokeRect(x - 4.5, 6, 9, 6);
  }
}

// costura en cruz sobre un roto (Elora: «más roto pero con costuras»): puntadas de un lado a otro de la raja
function cosido(ctx, x1, y1, x2, y2, n, color) {
  const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy), nx = -dy / l * 3, ny = dx / l * 3;
  ctx.strokeStyle = LINEA; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, cx = x1 + dx * t, cy = y1 + dy * t;
    ctx.moveTo(cx - nx - dx / l * 1.5, cy - ny - dy / l * 1.5); ctx.lineTo(cx + nx + dx / l * 1.5, cy + ny + dy / l * 1.5);
    ctx.moveTo(cx - nx + dx / l * 1.5, cy - ny + dy / l * 1.5); ctx.lineTo(cx + nx - dx / l * 1.5, cy + ny - dy / l * 1.5);
  }
  ctx.stroke();
}

// 👟 Zapatillas veloces: un zapato blanco muy roto, remendado con parches y costuras de colores (Elora)
function zapatilla(ctx) {
  ctx.strokeStyle = LINEA; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  // la suela, despegada por la punta (se ve el hueco oscuro)
  ctx.fillStyle = '#3a3036';
  ctx.beginPath(); ctx.moveTo(10, 20); ctx.quadraticCurveTo(30, 18, 42, 16); ctx.lineTo(44, 24); ctx.quadraticCurveTo(28, 26, 10, 24); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#d9d4cc';
  ctx.beginPath(); ctx.moveTo(-42, 22); ctx.lineTo(10, 22); ctx.quadraticCurveTo(30, 26, 44, 34); ctx.quadraticCurveTo(46, 38, 40, 38);
  ctx.quadraticCurveTo(24, 34, 8, 30); ctx.lineTo(-40, 30); ctx.quadraticCurveTo(-46, 28, -42, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
  // el zapato blanco, con el borde de arriba deshilachado
  ctx.fillStyle = '#f7f5f0';
  ctx.beginPath();
  ctx.moveTo(-40, 22); ctx.lineTo(-38, -14); ctx.lineTo(-34, -18); ctx.lineTo(-30, -15); ctx.lineTo(-26, -20); ctx.lineTo(-22, -16); ctx.lineTo(-18, -18); ctx.lineTo(-6, -4);
  ctx.quadraticCurveTo(18, -6, 34, 0); ctx.quadraticCurveTo(46, 6, 43, 17); ctx.quadraticCurveTo(26, 19, 10, 20); ctx.lineTo(-40, 22); ctx.closePath(); ctx.fill(); ctx.stroke();
  // manchas de suciedad
  ctx.save(); ctx.globalAlpha = 0.18;
  for (const [x, y, r] of [[-30, 14, 5], [22, 12, 4], [-4, 16, 3]]) circulo(ctx, x, y, r, '#5a4a3a');
  ctx.restore();
  // parches cosidos de colores
  for (const [x, y, w, h, c, hilo] of [[-35, -10, 13, 12, '#e0413b', '#7a1f1b'], [-16, 6, 15, 10, '#f2c230', '#8a6a10'], [16, 8, 12, 8, '#3f7fd6', '#1d3f73']]) {
    ctx.fillStyle = c; ctx.fillRect(x, y, w, h); puntadas(ctx, x, y, w, h, hilo);
  }
  // rajas cosidas con hilo de colores (Elora: «más roto pero con costuras»)
  cosido(ctx, -24, -2, -20, 14, 3, '#e0413b');
  cosido(ctx, 4, -2, 14, -4, 2, '#3fae4f');
  cosido(ctx, 30, 2, 36, 12, 2, '#f2c230');
  // un roto sin coser todavía, con los bordes desgarrados
  ctx.fillStyle = '#3a3036';
  ctx.beginPath(); ctx.moveTo(-6, 10); ctx.lineTo(-2, 6); ctx.lineTo(2, 9); ctx.lineTo(5, 7); ctx.lineTo(6, 13); ctx.lineTo(1, 16); ctx.lineTo(-4, 15); ctx.closePath(); ctx.fill();
  // los cordones, uno roto colgando
  ctx.strokeStyle = '#b0aaa0'; ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); for (let i = 0; i < 3; i++) { ctx.moveTo(-14 + i * 6, -10 + i * 3); ctx.lineTo(-8 + i * 6, -14 + i * 3); }
  ctx.moveTo(-2, -6); ctx.quadraticCurveTo(4, 2, 0, 8); ctx.stroke();
  // rayas de velocidad
  ctx.strokeStyle = 'rgba(120, 190, 255, 0.8)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-46, -8); ctx.lineTo(-52, -8); ctx.moveTo(-46, 4); ctx.lineTo(-55, 4); ctx.moveTo(-46, 14); ctx.lineTo(-51, 14); ctx.stroke();
}

// una pegatina recortada con la forma de su dibujo y un borde blanco alrededor (Elora: «de la forma que tengan pero
// rodeado de blanco»). dibujo(c, color, extra) pinta la figura: con color, toda de ese color y extra px más gorda
// (para la sombra y el borde blanco); con color null, con sus colores de verdad.
function pegatina(ctx, x, y, giro, dibujo) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(giro);
  ctx.save(); ctx.translate(1.2, 1.8); dibujo(ctx, 'rgba(0,0,0,0.5)', 3.2); ctx.restore();   // sombra
  dibujo(ctx, '#ffffff', 3.2);                                                               // el borde blanco
  dibujo(ctx, null, 0);                                                                      // el dibujo
  ctx.restore();
}

// 🔦 Linterna: negra, con dos pegatinas bien grandes: un lagarto y un skate (Elora)
function linterna(ctx) {
  ctx.save(); ctx.rotate(-0.3);
  // la luz
  const g = ctx.createLinearGradient(30, 0, 62, 0);
  g.addColorStop(0, 'rgba(255, 236, 140, 0.85)'); g.addColorStop(1, 'rgba(255, 236, 140, 0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(32, -12); ctx.lineTo(62, -28); ctx.lineTo(62, 28); ctx.lineTo(32, 12); ctx.closePath(); ctx.fill();
  // el mango y la cabeza, negros (más gordos para que quepan las pegatinas)
  ctx.strokeStyle = '#5a5a62'; ctx.lineWidth = 2;
  ctx.fillStyle = '#1c1c22'; rrect(ctx, -50, -13, 64, 26, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, -13); ctx.lineTo(28, -18); ctx.lineTo(34, -18); ctx.lineTo(34, 18); ctx.lineTo(28, 18); ctx.lineTo(12, 13); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fff3b0'; ctx.fillRect(32, -16, 3, 32);
  // brillo del plástico y el botón
  ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-46, -9); ctx.lineTo(10, -9); ctx.stroke();
  ctx.fillStyle = '#8a8a92'; ctx.fillRect(2, -16, 8, 4);
  // pegatina del lagarto (verde)
  pegatina(ctx, -32, 1, -0.15, (c, color, e) => {
    const verde = color || '#3fae4f';
    c.save(); c.scale(1.7, 0.9); circulo(c, -1, 0, 3.4 + e / 1.4, verde); c.restore();
    circulo(c, 6, -1, 2.8 + e, verde);
    c.strokeStyle = verde; c.lineWidth = 2 + e * 2; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-6, 0); c.quadraticCurveTo(-12, 5, -10, -4);
    c.moveTo(-3, -2); c.lineTo(-5, -6); c.moveTo(2, -2); c.lineTo(4, -6); c.moveTo(-3, 2); c.lineTo(-5, 6); c.moveTo(2, 2); c.lineTo(4, 6); c.stroke();
    if (!color) circulo(c, 7, -2, 0.7, '#1c1c22');
  });
  // pegatina del skate
  pegatina(ctx, -7, 0, 0.2, (c, color, e) => {
    c.fillStyle = color || '#d0703a'; rrect(c, -10 - e, -4 - e, 20 + e * 2, 5 + e * 2, 2.5 + e); c.fill();
    circulo(c, -5, 3.5, 2.3 + e, color || '#333'); circulo(c, 5, 3.5, 2.3 + e, color || '#333');
    if (!color) { c.strokeStyle = '#7a3a18'; c.lineWidth = 0.8; rrect(c, -10, -4, 20, 5, 2.5); c.stroke(); c.fillStyle = '#f2c230'; c.fillRect(-3, -3, 6, 3); }
  });
  ctx.restore();
}

// 🧸 Peluche de la calma: un peluche de Carot (el Carot del juego, con costuras de peluche)
function peluche(ctx) {
  ctx.save(); ctx.translate(0, 26); ctx.scale(2.1, 2.1);
  drawCharacter(ctx, characterById('carot'), 0, 0, 'down', 0, 0, false, { pose: { bi: 30, bd: -30 } });
  ctx.restore();
  // ojos de botón (Elora): tapan los ojos de Carot; negros, con cuatro agujeritos y el hilo en cruz
  for (const x of [-7.6, 7.6]) {
    circulo(ctx, x, -1.5, 4.6, '#1f1a1c', '#000000', 1);
    circulo(ctx, x - 1.2, -2.8, 1.2, 'rgba(255,255,255,0.35)');
    ctx.strokeStyle = '#d9cbb0'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(x - 1.6, -3.1); ctx.lineTo(x + 1.6, 0.1); ctx.moveTo(x + 1.6, -3.1); ctx.lineTo(x - 1.6, 0.1); ctx.stroke();
  }
  // costura en la barriga y la etiqueta del peluche
  ctx.strokeStyle = 'rgba(60, 40, 30, 0.55)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, 26); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#9a9aa2'; ctx.lineWidth = 1;
  ctx.fillRect(18, 22, 10, 13); ctx.strokeRect(18, 22, 10, 13);
  ctx.fillStyle = '#e0413b'; ctx.fillRect(20, 25, 6, 2);
}

// 🧲 Imán (Elora: «hazlo como quieras»): de herradura, rojo con las puntas plateadas y chispitas [PROVISIONAL]
function iman(ctx) {
  ctx.lineCap = 'butt';
  ctx.strokeStyle = LINEA; ctx.lineWidth = 26;
  ctx.beginPath(); ctx.arc(0, -4, 24, Math.PI, 0); ctx.lineTo(24, 30); ctx.moveTo(-24, -4); ctx.lineTo(-24, 30); ctx.stroke();
  ctx.strokeStyle = '#d8333b'; ctx.lineWidth = 21;
  ctx.beginPath(); ctx.arc(0, -4, 24, Math.PI, 0); ctx.lineTo(24, 18); ctx.moveTo(-24, -4); ctx.lineTo(-24, 18); ctx.stroke();
  ctx.strokeStyle = '#ff7a7f'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, -4, 28, Math.PI * 1.1, Math.PI * 1.5); ctx.stroke();
  ctx.strokeStyle = '#c9ccd4'; ctx.lineWidth = 21;
  ctx.beginPath(); ctx.moveTo(-24, 18); ctx.lineTo(-24, 30); ctx.moveTo(24, 18); ctx.lineTo(24, 30); ctx.stroke();
  // chispitas
  ctx.strokeStyle = '#ffd95a'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
  ctx.beginPath();
  for (const [x, y] of [[-24, 44], [0, 42], [24, 44]]) { ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); }
  ctx.stroke();
}

// 🧦 Calcetines silenciosos: un calcetín de lana con parches de conejito y de perrito
function calcetin(ctx) {
  ctx.strokeStyle = LINEA; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.fillStyle = '#b9a8d8';
  ctx.beginPath();
  ctx.moveTo(-18, -44); ctx.lineTo(12, -44); ctx.lineTo(12, 10); ctx.quadraticCurveTo(12, 22, 26, 24);
  ctx.quadraticCurveTo(44, 26, 42, 38); ctx.quadraticCurveTo(40, 48, 20, 46); ctx.lineTo(-6, 44);
  ctx.quadraticCurveTo(-20, 42, -18, 26); ctx.closePath(); ctx.fill(); ctx.stroke();
  // el puño de lana con rayas
  ctx.fillStyle = '#efe6d6'; ctx.fillRect(-18, -44, 30, 12); ctx.strokeRect(-18, -44, 30, 12);
  ctx.strokeStyle = '#c7b9a0'; ctx.lineWidth = 1.5;
  ctx.beginPath(); for (let x = -14; x < 12; x += 5) { ctx.moveTo(x, -42); ctx.lineTo(x, -34); } ctx.stroke();
  // textura de lana (uves)
  ctx.strokeStyle = 'rgba(80, 60, 120, 0.35)'; ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let y = -26; y < 40; y += 7) for (let x = -14; x < 10; x += 7) { ctx.moveTo(x, y); ctx.lineTo(x + 2.5, y + 3); ctx.lineTo(x + 5, y); }
  ctx.stroke();
  // parche de conejito (blanco, orejas largas)
  ctx.fillStyle = '#fff6ea'; ctx.fillRect(-15, -26, 22, 20); puntadas(ctx, -15, -26, 22, 20, '#d0607a');
  circulo(ctx, -4, -12, 5.5, '#e9e2d6');
  ctx.fillStyle = '#e9e2d6';
  ctx.save(); ctx.translate(-7, -19); ctx.scale(0.5, 1.4); circulo(ctx, 0, 0, 2.6, '#e9e2d6'); ctx.restore();
  ctx.save(); ctx.translate(-1, -19); ctx.scale(0.5, 1.4); circulo(ctx, 0, 0, 2.6, '#e9e2d6'); ctx.restore();
  circulo(ctx, -6, -13, 0.9, LINEA); circulo(ctx, -2, -13, 0.9, LINEA); circulo(ctx, -4, -10.5, 0.9, '#e88aa0');
  // parche de perrito (marrón, orejas caídas)
  ctx.fillStyle = '#f2d3a6'; ctx.fillRect(10, 26, 22, 16); puntadas(ctx, 10, 26, 22, 16, '#7a5a35');
  circulo(ctx, 21, 34, 5.5, '#b9824e');
  ctx.save(); ctx.translate(15.5, 33); ctx.scale(0.6, 1.3); circulo(ctx, 0, 0, 2.6, '#7a5232'); ctx.restore();
  ctx.save(); ctx.translate(26.5, 33); ctx.scale(0.6, 1.3); circulo(ctx, 0, 0, 2.6, '#7a5232'); ctx.restore();
  circulo(ctx, 19, 33, 0.9, LINEA); circulo(ctx, 23, 33, 0.9, LINEA); circulo(ctx, 21, 36, 1.2, LINEA);
}

// 💖 Corazón de repuesto: un corazón de metal con trozos pegados con tornillos
function corazonMetal(ctx) {
  const forma = () => {
    ctx.beginPath(); ctx.moveTo(0, 40);
    ctx.bezierCurveTo(-46, 10, -46, -36, -20, -38); ctx.bezierCurveTo(-8, -38, 0, -30, 0, -22);
    ctx.bezierCurveTo(0, -30, 8, -38, 20, -38); ctx.bezierCurveTo(46, -36, 46, 10, 0, 40); ctx.closePath();
  };
  const g = ctx.createLinearGradient(-30, -36, 30, 36);
  g.addColorStop(0, '#e6e8ee'); g.addColorStop(0.5, '#a3a7b2'); g.addColorStop(1, '#6d717c');
  ctx.fillStyle = g; forma(); ctx.fill(); ctx.strokeStyle = LINEA; ctx.lineWidth = 2.5; ctx.stroke();
  // las placas pegadas (de otro gris) y las juntas
  ctx.save(); forma(); ctx.clip();
  ctx.fillStyle = '#8c909c'; ctx.beginPath(); ctx.moveTo(-40, -6); ctx.lineTo(4, 2); ctx.lineTo(-6, 44); ctx.lineTo(-40, 44); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#c3c6cf'; ctx.beginPath(); ctx.moveTo(6, -40); ctx.lineTo(40, -40); ctx.lineTo(40, -4); ctx.lineTo(10, -10); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#4a4d56'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(-40, -6); ctx.lineTo(4, 2); ctx.lineTo(-6, 44); ctx.moveTo(6, -40); ctx.lineTo(10, -10); ctx.lineTo(40, -4); ctx.stroke();
  ctx.restore();
  // los tornillos (con su ranura)
  for (const [x, y] of [[-22, -24], [22, -24], [-26, 6], [26, 4], [0, 26], [-6, -4], [12, -16]]) {
    circulo(ctx, x, y, 3.4, '#d9dbe2', '#4a4d56', 1.2);
    ctx.strokeStyle = '#4a4d56'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 2.2, y - 1); ctx.lineTo(x + 2.2, y + 1); ctx.stroke();
  }
  // brillo rojo dentro (sigue siendo un corazón)
  ctx.save(); ctx.globalAlpha = 0.35; circulo(ctx, 0, 6, 9, '#ff3b47'); ctx.restore();
}

// 🥤 Botella de agua: una botella («no hay más»)
function botella(ctx) {
  ctx.strokeStyle = LINEA; ctx.lineWidth = 2.5;
  ctx.fillStyle = 'rgba(170, 215, 245, 0.9)';
  ctx.beginPath();
  ctx.moveTo(-8, -36); ctx.lineTo(8, -36); ctx.lineTo(8, -28); ctx.quadraticCurveTo(20, -22, 20, -8); ctx.lineTo(20, 38);
  ctx.quadraticCurveTo(20, 44, 14, 44); ctx.lineTo(-14, 44); ctx.quadraticCurveTo(-20, 44, -20, 38); ctx.lineTo(-20, -8);
  ctx.quadraticCurveTo(-20, -22, -8, -28); ctx.closePath(); ctx.fill(); ctx.stroke();
  // el agua
  ctx.fillStyle = 'rgba(70, 150, 225, 0.55)'; ctx.fillRect(-18.5, 0, 37, 42);
  // el tapón y la etiqueta
  ctx.fillStyle = '#2f7fd0'; rrect(ctx, -10, -46, 20, 11, 3); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffffff'; ctx.fillRect(-20, 8, 40, 16); ctx.strokeRect(-20, 8, 40, 16);
  ctx.fillStyle = '#2f7fd0'; ctx.beginPath(); ctx.moveTo(-6, 20); ctx.quadraticCurveTo(0, 8, 6, 20); ctx.quadraticCurveTo(0, 24, -6, 20); ctx.fill();
  // brillo
  ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-13, -10); ctx.lineTo(-13, 2); ctx.stroke();
}

// 🍀 Amuleto de la suerte: un collar de girasol
function amuleto(ctx) {
  // el cordón
  ctx.strokeStyle = '#7a5232'; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(-32, -44); ctx.quadraticCurveTo(-34, -6, -8, 4); ctx.moveTo(32, -44); ctx.quadraticCurveTo(34, -6, 8, 4); ctx.stroke();
  // los pétalos
  ctx.save(); ctx.translate(0, 18);
  for (let i = 0; i < 12; i++) {
    ctx.save(); ctx.rotate(i * Math.PI / 6);
    ctx.beginPath(); ctx.ellipse(0, -16, 5, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? '#ffd23f' : '#f5b521'; ctx.fill(); ctx.strokeStyle = '#b47a10'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.restore();
  }
  // el centro con pipas
  circulo(ctx, 0, 0, 10, '#6b4224', '#3e2412', 1.5);
  ctx.fillStyle = '#4a2c16';
  for (let i = 0; i < 9; i++) { const a = i * 2.4, r = 2 + (i % 3) * 2.4; circulo(ctx, Math.cos(a) * r, Math.sin(a) * r, 1, '#3a200e'); }
  ctx.restore();
  // la anilla
  circulo(ctx, 0, 1, 3, null, '#c9b25a', 2);
}

const DIBUJOS = { mochila, zapatillas: zapatilla, linterna, peluche, iman, calcetines: calcetin, corazon: corazonMetal, botella, amuleto };

export function drawTrinket(ctx, id) {
  const f = DIBUJOS[id];
  if (!f) return;
  ctx.save(); f(ctx); ctx.restore();
}
