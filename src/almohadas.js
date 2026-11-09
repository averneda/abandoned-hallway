// La guerra de almohadas contra los Bloodies (Elora, noviembre 2026). Solo en la fiesta del Día del Niño.
// Se empieza en el montón de almohadas del lobby. Tienes 5 vidas (Elora): cada
// almohada de un Bloodie que te da te quita una. Los Bloodies tienen 1 vida (Elora): dales una vez y se van,
// y viene otro; cada uno que derrotas te da 5 monedas. No hay tiempo (Elora): dura hasta que te eliminan, y al
// final sale cuántos Bloodies has derrotado y cuánto has aguantado. Los números, en ALMOHADAS de config.js.

import { VIEW_W, VIEW_H, ALMOHADAS } from './config.js';

// 83 s → «1:23»
export const minSeg = (s) => { const n = Math.floor(s); return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); };
// cuánto espera un Bloodie para tirar: 10 s y, a veces, 5 (Elora)
const esperaTiro = () => (Math.random() < ALMOHADAS.probRapido ? ALMOHADAS.tiroRapido : ALMOHADAS.tiroBloodie);
import { CHARACTERS, drawCharacter, rrect } from './characters.js';
import { t } from './i18n.js';
import { sfx } from './sound.js';

const PASTEL = ['#ffc6dd', '#c7e3ff', '#d9ccff', '#fff1a8', '#c8f2d4', '#ffd6b8'];   // las tuyas (Elora)
const LOOKS = CHARACTERS.filter((c) => !c.navidad && !c.secreto);
const MURO = 40;   // el borde de la habitación
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

// Los 3 escenarios de la guerra de almohadas (Elora: "que haya 3, así va variando"; cómo es cada uno lo inventó
// Clad [PROVISIONAL]; Elora hará los mapas). Cada partida toca el siguiente. Todos con el suelo normal de los
// pasillos (Elora: "que tenga un suelo normal"). Los obstáculos (x, y, ancho, alto) son sitios para protegerse
// (Elora): no se atraviesan y paran las almohadas.
//   tipo: 'sofa' (sofá de cojines), 'monton' (montón de almohadas), 'tienda' (tienda de mantas), 'caja' (caja con farolillo)
export const ESCENARIOS = [
  { id: 'cuarto', obst: [
    { tipo: 'sofa', x: 150, y: 140, w: 130, h: 52, color: '#f2a7c3' },
    { tipo: 'sofa', x: 680, y: 140, w: 130, h: 52, color: '#9fd0ff' },
    { tipo: 'caja', x: 170, y: 380, w: 72, h: 66 },
    { tipo: 'caja', x: 718, y: 380, w: 72, h: 66 },
    { tipo: 'monton', x: 425, y: 455, w: 110, h: 50 },
  ] },
  { id: 'cama', obst: [
    { tipo: 'monton', x: 170, y: 130, w: 100, h: 56 },
    { tipo: 'monton', x: 690, y: 130, w: 100, h: 56 },
    { tipo: 'sofa', x: 410, y: 200, w: 140, h: 52, color: '#c9b3ff' },
    { tipo: 'monton', x: 170, y: 400, w: 100, h: 56 },
    { tipo: 'monton', x: 690, y: 400, w: 100, h: 56 },
  ] },
  { id: 'fuerte', obst: [
    { tipo: 'tienda', x: 395, y: 130, w: 170, h: 110 },
    { tipo: 'caja', x: 150, y: 310, w: 72, h: 66 },
    { tipo: 'caja', x: 738, y: 310, w: 72, h: 66 },
    { tipo: 'monton', x: 250, y: 460, w: 100, h: 50 },
    { tipo: 'monton', x: 610, y: 460, w: 100, h: 50 },
  ] },
];
// el escenario que toca: cada vez el siguiente (se guarda para que vaya variando)
function siguienteEscenario() {
  let i = 0;
  try { i = (Number(localStorage.getItem('holeway.escenarioAlmohadas')) || 0) % ESCENARIOS.length; } catch (e) { /* nada */ }
  try { localStorage.setItem('holeway.escenarioAlmohadas', String((i + 1) % ESCENARIOS.length)); } catch (e) { /* nada */ }
  return ESCENARIOS[i];
}
const dentro = (o, x, y, m = 0) => x > o.x - m && x < o.x + o.w + m && y > o.y - m && y < o.y + o.h + m;

// Una almohada: rectángulo blandito con las cuatro esquinas; las de los Bloodies, manchadas de sangre (Elora)
export function drawAlmohada(ctx, x, y, color, sangre, ang = 0, k = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k);
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(2, 9, 13, 3.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color; rrect(ctx, -13, -8, 26, 16, 7); ctx.fill();
  for (const [cx, cy] of [[-12, -7], [12, -7], [-12, 7], [12, 7]]) { ctx.beginPath(); ctx.arc(cx, cy, 2.6, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.ellipse(-4, -3, 6, 2.4, -0.2, 0, Math.PI * 2); ctx.fill();
  if (sangre) {
    ctx.fillStyle = '#9c1220';
    ctx.beginPath(); ctx.ellipse(4, 1, 6, 4, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(-6, 4, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(9, -4, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(3, 4, 1.6, 5);
  }
  ctx.restore();
}

export class GuerraAlmohadas {
  // callbacks: { onCoin(n), onFin({ tiempo, bloodies }) → récords nuevos, onSalir() }
  constructor(character, callbacks) {
    this.ch = character;
    this.cb = callbacks;
    this.time = 0;
    this.paused = false;
    this.fin = null;            // 'ganas' | 'pierdes'
    this.vidas = ALMOHADAS.vidasTuyas;   // 5 con cualquier personaje (Elora)
    this.maxVidas = this.vidas;
    this.p = { x: VIEW_W / 2, y: VIEW_H / 2 + 60, facing: 'up', walk: 0, invuln: 0, cooldown: 0 };
    this.almohadas = [];        // las que vuelan: { x, y, vx, vy, mia, color, ang }
    this.bloodies = [];
    this.esperaBloodie = [0.6, 1.6];   // cuándo sale cada uno de los primeros
    this.derrotados = 0;
    this.monedas = 0;
    this.avisos = [];
    // ?escenario=cuarto|cama|fuerte para probar uno
    let pedido = null;
    try { pedido = new URLSearchParams(location.search).get('escenario'); } catch (e) { /* nada */ }
    this.esc = ESCENARIOS.find((e) => e.id === pedido) || siguienteEscenario();
    this.obst = this.esc.obst;
    this.decor = Array.from({ length: 9 }, (_, i) => ({
      x: MURO + 30 + ((i * 97) % (VIEW_W - 2 * MURO - 60)), y: MURO + 40 + ((i * 61) % (VIEW_H - 2 * MURO - 80)),
      color: PASTEL[i % PASTEL.length], ang: (i % 3 - 1) * 0.4, sangre: i % 4 === 0,
    })).filter((d) => !this.obst.some((o) => dentro(o, d.x, d.y, 18)));
    this.aviso(t('alm.esc.' + this.esc.id));
  }

  // ¿choca con un obstáculo alguien con los pies en (x, y)?
  choca(x, y) { return this.obst.some((o) => x > o.x - 12 && x < o.x + o.w + 12 && y > o.y - 4 && y < o.y + o.h + 8); }
  // moverse sin atravesar los obstáculos (primero de lado, luego arriba y abajo)
  mover(q, dx, dy) {
    if (!this.choca(q.x + dx, q.y)) q.x += dx;
    if (!this.choca(q.x, q.y + dy)) q.y += dy;
    q.x = Math.max(MURO + 14, Math.min(VIEW_W - MURO - 14, q.x));
    q.y = Math.max(MURO + 30, Math.min(VIEW_H - MURO - 8, q.y));
  }

  aviso(txt) { this.avisos.push({ txt, t: 1.6 }); }

  nuevoBloodie() {
    let x, y;
    for (let k = 0; k < 30; k++) {   // por un borde, fuera de los obstáculos
      const lado = Math.floor(Math.random() * 4);
      x = lado === 0 ? MURO + 20 : lado === 1 ? VIEW_W - MURO - 20 : MURO + 40 + Math.random() * (VIEW_W - 2 * MURO - 80);
      y = lado === 2 ? MURO + 30 : lado === 3 ? VIEW_H - MURO - 20 : MURO + 40 + Math.random() * (VIEW_H - 2 * MURO - 80);
      if (!this.choca(x, y)) break;
    }
    this.bloodies.push({
      x, y, vidas: ALMOHADAS.vidasBloodie, look: LOOKS[Math.floor(Math.random() * LOOKS.length)],
      tiro: esperaTiro(),   // la primera, igual que las demás (Elora: cada 10 s y a veces 5)
      golpe: 0, walk: 0, facing: 'down', dx: 0, dy: 0, cambia: 0, cae: 0,
    });
  }

  tirar(desde, haciaX, haciaY, mia, color) {
    let dx = haciaX - desde.x, dy = haciaY - desde.y;
    const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const v = mia ? ALMOHADAS.velocidadTuya : ALMOHADAS.velocidadBloodie;
    this.almohadas.push({ x: desde.x, y: desde.y - 14, vx: dx * v, vy: dy * v, mia, color, ang: 0 });
  }

  update(dt, input) {
    if (this.paused) return;
    this.time += dt;
    for (const a of this.avisos) a.t -= dt;
    this.avisos = this.avisos.filter((a) => a.t > 0);
    if (this.fin) {
      if (this.time - this.finEn > 0.8 && (input.wasPressed('interact') || input.wasPressed('ability') || input.wasPressed('jump') || input.wasPressed('pause'))) this.cb.onSalir();
      return;
    }
    if (input.wasPressed('pause')) { this.cb.onSalir(); return; }
    const p = this.p;
    // moverte (la cruceta o las flechas)
    const ax = input.axis();
    const v = ALMOHADAS.velocidadJugador * (input.isDown('run') ? 1.35 : 1);
    if (ax.x || ax.y) {
      const n = Math.hypot(ax.x, ax.y);
      this.mover(p, ax.x / n * v * dt, ax.y / n * v * dt);
      p.walk += dt * 10;
      p.facing = Math.abs(ax.x) > Math.abs(ax.y) ? (ax.x > 0 ? 'right' : 'left') : (ax.y > 0 ? 'down' : 'up');
    }
    if (p.invuln > 0) p.invuln -= dt;
    if (p.cooldown > 0) p.cooldown -= dt;
    // tirar una almohada hacia donde miras: con Start o Select del mando (Elora), o E, Q o Espacio en el teclado
    if ((input.wasPressed('interact') || input.wasPressed('ability') || input.wasPressed('jump')) && p.cooldown <= 0) {
      const [dx, dy] = DIRS[p.facing];
      this.tirar(p, p.x + dx * 100, p.y - 14 + dy * 100 + 14, true, PASTEL[Math.floor(Math.random() * PASTEL.length)]);
      p.cooldown = ALMOHADAS.recargaTuya;
      try { sfx.dash(); } catch (e) { /* nada */ }
    }
    // los Bloodies: van saliendo hasta que hay 2 a la vez; se mueven a ratos y te tiran almohadas
    this.esperaBloodie = this.esperaBloodie.map((s) => s - dt);
    while (this.esperaBloodie.length && this.esperaBloodie[0] <= 0) { this.esperaBloodie.shift(); this.nuevoBloodie(); }
    for (const b of this.bloodies) {
      if (b.cae > 0) { b.cae -= dt; continue; }
      if (b.golpe > 0) b.golpe -= dt;
      b.cambia -= dt;
      if (b.cambia <= 0) {
        // se acerca si estás lejos, se aleja si estás muy cerca, y si no, se mueve de lado
        const dx = p.x - b.x, dy = p.y - b.y, d = Math.hypot(dx, dy) || 1;
        const lejos = d > 260 ? 1 : d < 150 ? -1 : 0;
        const lado = Math.random() < 0.5 ? 1 : -1;
        b.dx = (dx / d) * lejos + (-dy / d) * lado * 0.8; b.dy = (dy / d) * lejos + (dx / d) * lado * 0.8;
        b.cambia = 0.8 + Math.random() * 0.9;
      }
      const n = Math.hypot(b.dx, b.dy) || 1;
      this.mover(b, b.dx / n * ALMOHADAS.velocidadBloodies * dt, b.dy / n * ALMOHADAS.velocidadBloodies * dt);
      b.walk += dt * 8;
      b.facing = Math.abs(p.x - b.x) > Math.abs(p.y - b.y) ? (p.x > b.x ? 'right' : 'left') : (p.y > b.y ? 'down' : 'up');
      b.tiro -= dt;
      if (b.tiro <= 0) {
        // apunta a donde estás, con un poco de error
        const err = (Math.random() - 0.5) * 70;
        this.tirar(b, p.x + err, p.y + err * 0.5, false, '#f4e3dc');
        b.tiro = esperaTiro();   // una almohada cada 10 s, y a veces cada 5 (Elora)
      }
    }
    // las almohadas que vuelan
    for (const a of this.almohadas) {
      a.x += a.vx * dt; a.y += a.vy * dt; a.ang += dt * 9;
      if (a.x < MURO || a.x > VIEW_W - MURO || a.y < MURO || a.y > VIEW_H - MURO) { a.fuera = true; continue; }
      // los obstáculos paran las almohadas (para esconderse detrás)
      if (this.obst.some((o) => dentro(o, a.x, a.y + 10))) { a.fuera = true; continue; }
      if (a.mia) {
        for (const b of this.bloodies) {
          if (b.cae > 0 || Math.hypot(a.x - b.x, a.y - (b.y - 14)) > 22) continue;
          a.fuera = true; b.vidas -= 1; b.golpe = 0.3;
          try { sfx.bite(); } catch (e) { /* nada */ }
          if (b.vidas <= 0) {
            // derrotado: se va, te da 5 monedas y viene otro (Elora)
            b.cae = 0.7; b.ido = true;
            this.derrotados += 1; this.monedas += ALMOHADAS.monedasBloodie; this.cb.onCoin(ALMOHADAS.monedasBloodie);
            this.aviso(t('alm.derrotado', { n: ALMOHADAS.monedasBloodie }));
            try { sfx.coin(); } catch (e) { /* nada */ }
            this.esperaBloodie.push(1.2);
          }
          break;
        }
      } else if (p.invuln <= 0 && Math.hypot(a.x - p.x, a.y - (p.y - 14)) < 20) {
        a.fuera = true; this.vidas -= 1; p.invuln = 1;
        try { sfx.hurt(); } catch (e) { /* nada */ }
        if (this.vidas <= 0) this.terminar('pierdes');
      }
    }
    this.almohadas = this.almohadas.filter((a) => !a.fuera);
    this.bloodies = this.bloodies.filter((b) => !(b.ido && b.cae <= 0));
    if (!this.fin && ALMOHADAS.tiempo && this.time >= ALMOHADAS.tiempo) { this.terminar('ganas'); try { sfx.levelUp(); } catch (e) { /* nada */ } }
  }

  // se acaba la partida: se apuntan los récords (Elora) y se ve si hay alguno nuevo
  terminar(fin) {
    this.fin = fin; this.finEn = this.time;
    this.nuevos = (this.cb.onFin && this.cb.onFin({ tiempo: Math.floor(this.time), bloodies: this.derrotados })) || [];
    if (this.nuevos.length) { try { sfx.levelUp(); } catch (e) { /* nada */ } }
  }

  render(ctx) {
    this.renderSuelo(ctx);
    for (const d of this.decor) drawAlmohada(ctx, d.x, d.y, d.color, d.sangre, d.ang, 1);
    // los personajes y los obstáculos, de arriba abajo
    const cosas = this.obst.map((o) => ({ y: o.y + o.h, draw: () => this.drawObstaculo(ctx, o) }));
    cosas.push(...this.bloodies.map((b) => ({ y: b.y, draw: () => {
      ctx.save();
      if (b.cae > 0) { ctx.globalAlpha = Math.max(0, b.cae / 0.7); ctx.translate(b.x, b.y); ctx.rotate((1 - b.cae / 0.7) * 1.4); ctx.translate(-b.x, -b.y); }
      if (b.golpe > 0 && Math.floor(b.golpe * 20) % 2) ctx.globalAlpha *= 0.5;
      drawCharacter(ctx, b.look, b.x, b.y, b.facing, b.walk, 0, false, { bloody: true, dormir: true });
      ctx.restore();
      // sus vidas, encima de la cabeza
      for (let i = 0; i < ALMOHADAS.vidasBloodie; i++) { ctx.fillStyle = i < b.vidas ? '#ff3b47' : 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.arc(b.x - 10 + i * 10, b.y - 46, 3.6, 0, Math.PI * 2); ctx.fill(); }
    } })));
    const p = this.p;
    cosas.push({ y: p.y, draw: () => {
      ctx.save();
      if (p.invuln > 0 && Math.floor(p.invuln * 12) % 2) ctx.globalAlpha = 0.45;
      drawCharacter(ctx, this.ch, p.x, p.y, p.facing, p.walk, 0, false);
      ctx.restore();
    } });
    cosas.sort((a, b) => a.y - b.y);
    for (const c of cosas) c.draw();
    for (const a of this.almohadas) drawAlmohada(ctx, a.x, a.y, a.color, !a.mia, a.ang, 1);
    this.renderHUD(ctx);
  }

  // el suelo: el normal de los pasillos, baldosas grises con su junta (Elora: "que tenga un suelo normal")
  renderSuelo(ctx) {
    ctx.fillStyle = 'rgb(34,30,42)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);   // la pared
    for (let y = MURO, j = 0; y < VIEW_H - MURO; y += 40, j++) for (let x = MURO, i = 0; x < VIEW_W - MURO; x += 40, i++) {
      const v = (i * 31 + j * 17) % 7;
      ctx.fillStyle = `rgb(${72 + v},${78 + v},${92 + v})`; ctx.fillRect(x, y, 40, 40);
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, 39, 39);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(MURO, MURO, VIEW_W - 2 * MURO, 6);   // el borde de la pared de arriba
  }

  // los obstáculos de los escenarios
  drawObstaculo(ctx, o) {
    const { x, y, w, h } = o;
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(x + w / 2, y + h + 2, w / 2 + 4, 8, 0, 0, Math.PI * 2); ctx.fill();
    if (o.tipo === 'sofa') {   // sofá de cojines: el respaldo, el asiento y tres cojines blanditos
      const osc = 'rgba(0,0,0,0.18)';
      ctx.fillStyle = o.color; rrect(ctx, x, y - 22, w, h + 22, 14); ctx.fill();
      ctx.fillStyle = osc; rrect(ctx, x, y + h - 14, w, 14, 8); ctx.fill();
      const cw = (w - 16) / 3;
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = 'rgba(255,255,255,0.35)'; rrect(ctx, x + 8 + i * cw + 2, y - 14, cw - 4, h - 4, 9); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(x + 8 + i * cw + cw / 2, y + h / 2 - 12, 2.5, 0, Math.PI * 2); ctx.fill();
      }
    } else if (o.tipo === 'monton') {   // un montón de almohadas de colores, unas encima de otras
      const filas = [[0.25, 0.75], [0.15, 0.5, 0.85], [0.5]];
      let k = 0;
      filas.forEach((fila, f) => fila.forEach((fx) => {
        const c = PASTEL[(k++ + Math.round(x)) % PASTEL.length];
        drawAlmohada(ctx, x + w * fx, y + h - 10 - f * 18, c, false, ((k % 3) - 1) * 0.15, 1.5);
      }));
    } else if (o.tipo === 'tienda') {   // tienda de mantas: tejado de rayas y la puerta abierta
      ctx.fillStyle = '#7c5cc4'; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w / 2, y - 40); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w / 2, y - 40); ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.clip();
      ctx.fillStyle = '#ffd1dc'; for (let i = 0; i < 8; i += 2) ctx.fillRect(x + (i * w) / 8, y - 40, w / 8, h + 40);
      ctx.restore();
      ctx.fillStyle = '#1b1430'; ctx.beginPath(); ctx.moveTo(x + w / 2 - 26, y + h); ctx.lineTo(x + w / 2, y + 30); ctx.lineTo(x + w / 2 + 26, y + h); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffd95a'; ctx.beginPath(); ctx.arc(x + w / 2, y - 42, 5, 0, Math.PI * 2); ctx.fill();   // la estrellita de la punta
    } else {   // caja de cartón con un farolillo encendido encima
      ctx.fillStyle = '#c98f55'; ctx.fillRect(x, y, w, h);
      ctx.fillStyle = '#a8733f'; ctx.fillRect(x, y, w, 10); ctx.fillRect(x + w / 2 - 3, y, 6, h);
      const fx = x + w / 2, fy = y - 14;
      ctx.globalAlpha = 0.25 + 0.1 * Math.sin(this.time * 4); ctx.fillStyle = '#ffe28a'; ctx.beginPath(); ctx.arc(fx, fy, 30, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      ctx.fillStyle = '#ffcf4a'; rrect(ctx, fx - 9, fy - 12, 18, 22, 6); ctx.fill();
      ctx.fillStyle = '#5b4a3a'; ctx.fillRect(fx - 10, fy - 15, 20, 4); ctx.fillRect(fx - 10, fy + 9, 20, 4);
    }
  }

  renderHUD(ctx) {
    const font = '"Segoe UI", Arial';
    ctx.textBaseline = 'middle';
    // tus vidas
    for (let i = 0; i < this.maxVidas; i++) {
      ctx.fillStyle = i < this.vidas ? '#ff3b47' : 'rgba(255,255,255,0.25)';
      ctx.font = `bold 26px ${font}`; ctx.textAlign = 'left'; ctx.fillText('❤', 14 + i * 30, 22);
    }
    // cuánto llevas aguantando (sin tiempo, Elora: dura hasta que te eliminan) y lo que llevas
    const llevas = this.fin ? this.finEn : this.time;
    ctx.textAlign = 'center'; ctx.font = `bold 24px ${font}`; ctx.fillStyle = '#fff6dc';
    const reloj = ALMOHADAS.tiempo ? Math.max(0, Math.ceil(ALMOHADAS.tiempo - this.time)) + ' s' : minSeg(llevas);
    ctx.fillText(t('alm.titulo') + '  ⏱ ' + reloj, VIEW_W / 2, 20);
    ctx.textAlign = 'right'; ctx.font = `bold 18px ${font}`; ctx.fillStyle = '#ffd95a';
    ctx.fillText(t('alm.marcador', { n: this.derrotados, m: this.monedas }), VIEW_W - 14, 20);
    // ayuda abajo, al principio
    if (this.time < 5 && !this.fin) {
      ctx.textAlign = 'center'; ctx.font = `bold 16px ${font}`; ctx.fillStyle = '#fff6dc';
      ctx.fillText(t('alm.ayuda'), VIEW_W / 2, VIEW_H - 20);
    }
    this.avisos.forEach((a, i) => {
      ctx.textAlign = 'center'; ctx.font = `bold 20px ${font}`; ctx.fillStyle = '#ffd95a';
      ctx.globalAlpha = Math.min(1, a.t); ctx.fillText(a.txt, VIEW_W / 2, 58 + i * 26); ctx.globalAlpha = 1;
    });
    if (this.fin) {
      ctx.fillStyle = 'rgba(20,12,30,0.75)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.textAlign = 'center'; ctx.fillStyle = this.fin === 'ganas' ? '#9df0b0' : '#ff8a94';
      ctx.font = `bold 46px ${font}`; ctx.fillText(t(this.fin === 'ganas' ? 'alm.ganas' : 'alm.pierdes'), VIEW_W / 2, VIEW_H / 2 - 50);
      ctx.fillStyle = '#fff6dc'; ctx.font = `bold 24px ${font}`;
      ctx.fillText(t('alm.resultado', { n: this.derrotados, m: this.monedas }), VIEW_W / 2, VIEW_H / 2 + 6);
      ctx.fillText(t('alm.aguantado', { t: minSeg(this.finEn) }), VIEW_W / 2, VIEW_H / 2 + 40);
      if (this.nuevos && this.nuevos.length) {   // ¡nuevo récord! (de tiempo, de Bloodies o de los dos)
        ctx.fillStyle = '#ffd95a'; ctx.font = `bold 26px ${font}`;
        ctx.fillText(t('alm.nuevoRecord') + ' ' + this.nuevos.map((n) => t('alm.record.' + n)).join(' · '), VIEW_W / 2, VIEW_H / 2 + 82);
      }
      ctx.fillStyle = '#fff6dc'; ctx.font = `18px ${font}`; ctx.fillText(t('alm.volver'), VIEW_W / 2, VIEW_H / 2 + 122);
    }
    ctx.textBaseline = 'alphabetic';
  }
}
