// La guerra de almohadas contra los Bloodies (Elora, noviembre 2026). Solo en la fiesta del Día del Niño.
// Se empieza en el montón de almohadas del lobby. Tienes 5 vidas (Elora): cada
// almohada de un Bloodie que te da te quita una. Los Bloodies tienen 1 vida (Elora): dales una vez y se van,
// y viene otro; cada uno que derrotas te da 5 monedas. Si aguantas el tiempo (1 minuto), ganas; si te quedas
// sin vidas antes, pierdes. Los números, en ALMOHADAS de config.js.

import { VIEW_W, VIEW_H, ALMOHADAS } from './config.js';

// cuánto espera un Bloodie para tirar: 10 s y, a veces, 5 (Elora)
const esperaTiro = () => (Math.random() < ALMOHADAS.probRapido ? ALMOHADAS.tiroRapido : ALMOHADAS.tiroBloodie);
import { CHARACTERS, drawCharacter, rrect } from './characters.js';
import { t } from './i18n.js';
import { sfx } from './sound.js';

const PASTEL = ['#ffc6dd', '#c7e3ff', '#d9ccff', '#fff1a8', '#c8f2d4', '#ffd6b8'];   // las tuyas (Elora)
const LOOKS = CHARACTERS.filter((c) => !c.navidad && !c.secreto);
const MURO = 40;   // el borde de la habitación
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

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
  // callbacks: { onCoin(n), onSalir() }
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
    this.decor = Array.from({ length: 9 }, (_, i) => ({
      x: MURO + 30 + ((i * 97) % (VIEW_W - 2 * MURO - 60)), y: MURO + 40 + ((i * 61) % (VIEW_H - 2 * MURO - 80)),
      color: PASTEL[i % PASTEL.length], ang: (i % 3 - 1) * 0.4, sangre: i % 4 === 0,
    }));
  }

  aviso(txt) { this.avisos.push({ txt, t: 1.6 }); }

  nuevoBloodie() {
    const lado = Math.floor(Math.random() * 4);
    const x = lado === 0 ? MURO + 20 : lado === 1 ? VIEW_W - MURO - 20 : MURO + 40 + Math.random() * (VIEW_W - 2 * MURO - 80);
    const y = lado === 2 ? MURO + 30 : lado === 3 ? VIEW_H - MURO - 20 : MURO + 40 + Math.random() * (VIEW_H - 2 * MURO - 80);
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
      p.x += ax.x / n * v * dt; p.y += ax.y / n * v * dt;
      p.walk += dt * 10;
      p.facing = Math.abs(ax.x) > Math.abs(ax.y) ? (ax.x > 0 ? 'right' : 'left') : (ax.y > 0 ? 'down' : 'up');
    }
    p.x = Math.max(MURO + 14, Math.min(VIEW_W - MURO - 14, p.x));
    p.y = Math.max(MURO + 30, Math.min(VIEW_H - MURO - 8, p.y));
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
      b.x += b.dx / n * ALMOHADAS.velocidadBloodies * dt; b.y += b.dy / n * ALMOHADAS.velocidadBloodies * dt;
      b.x = Math.max(MURO + 14, Math.min(VIEW_W - MURO - 14, b.x)); b.y = Math.max(MURO + 30, Math.min(VIEW_H - MURO - 8, b.y));
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
        if (this.vidas <= 0) { this.fin = 'pierdes'; this.finEn = this.time; }
      }
    }
    this.almohadas = this.almohadas.filter((a) => !a.fuera);
    this.bloodies = this.bloodies.filter((b) => !(b.ido && b.cae <= 0));
    if (!this.fin && this.time >= ALMOHADAS.tiempo) { this.fin = 'ganas'; this.finEn = this.time; try { sfx.levelUp(); } catch (e) { /* nada */ } }
  }

  render(ctx) {
    // la habitación: suelo de colores pastel, paredes moradas oscuras y almohadas por el suelo
    ctx.fillStyle = '#3a2d4a'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    for (let y = MURO; y < VIEW_H - MURO; y += 40) for (let x = MURO; x < VIEW_W - MURO; x += 40) {
      ctx.fillStyle = ((x + y) / 40) % 2 ? '#e9dff2' : '#f3ebf8'; ctx.fillRect(x, y, 40, 40);
    }
    ctx.strokeStyle = '#2a1f36'; ctx.lineWidth = 4; ctx.strokeRect(MURO, MURO, VIEW_W - 2 * MURO, VIEW_H - 2 * MURO);
    for (const d of this.decor) drawAlmohada(ctx, d.x, d.y, d.color, d.sangre, d.ang, 1);
    // los personajes, de arriba abajo
    const cosas = this.bloodies.map((b) => ({ y: b.y, draw: () => {
      ctx.save();
      if (b.cae > 0) { ctx.globalAlpha = Math.max(0, b.cae / 0.7); ctx.translate(b.x, b.y); ctx.rotate((1 - b.cae / 0.7) * 1.4); ctx.translate(-b.x, -b.y); }
      if (b.golpe > 0 && Math.floor(b.golpe * 20) % 2) ctx.globalAlpha *= 0.5;
      drawCharacter(ctx, b.look, b.x, b.y, b.facing, b.walk, 0, false, { bloody: true, dormir: true });
      ctx.restore();
      // sus vidas, encima de la cabeza
      for (let i = 0; i < ALMOHADAS.vidasBloodie; i++) { ctx.fillStyle = i < b.vidas ? '#ff3b47' : 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.arc(b.x - 10 + i * 10, b.y - 46, 3.6, 0, Math.PI * 2); ctx.fill(); }
    } }));
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

  renderHUD(ctx) {
    const font = '"Segoe UI", Arial';
    ctx.textBaseline = 'middle';
    // tus vidas
    for (let i = 0; i < this.maxVidas; i++) {
      ctx.fillStyle = i < this.vidas ? '#ff3b47' : 'rgba(255,255,255,0.25)';
      ctx.font = `bold 26px ${font}`; ctx.textAlign = 'left'; ctx.fillText('❤', 14 + i * 30, 22);
    }
    // el tiempo que queda y lo que llevas
    const queda = Math.max(0, Math.ceil(ALMOHADAS.tiempo - this.time));
    ctx.textAlign = 'center'; ctx.font = `bold 24px ${font}`; ctx.fillStyle = '#fff6dc';
    ctx.fillText(t('alm.titulo') + '  ⏱ ' + queda + ' s', VIEW_W / 2, 20);
    ctx.textAlign = 'right'; ctx.font = `bold 18px ${font}`; ctx.fillStyle = '#ffd95a';
    ctx.fillText(t('alm.marcador', { n: this.derrotados, m: this.monedas }), VIEW_W - 14, 20);
    // ayuda abajo, al principio
    if (this.time < 5 && !this.fin) {
      ctx.textAlign = 'center'; ctx.font = `bold 16px ${font}`; ctx.fillStyle = '#2a1f36';
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
      ctx.font = `18px ${font}`; ctx.fillText(t('alm.volver'), VIEW_W / 2, VIEW_H / 2 + 52);
    }
    ctx.textBaseline = 'alphabetic';
  }
}
