// El lobby: una sala tranquila donde Tarda vende personajes, hay una caja de cartón con tus cintas
// (y la tele en pequeñito al lado; antes era una estantería)
// y una puerta para entrar a los pasillos.

import { TILE, VIEW_W, VIEW_H, PLAYER, ABILITIES, SKINS_DIA, SKINS_LISTAS, NAVIDAD } from './config.js';
import { T, loadMap, setTile } from './level.js';
import { LOBBY } from './maps.js';
import { Game, dist } from './game.js';
import { drawCharacter, characterById, TARDA_GRIS } from './characters.js';
import { t } from './i18n.js';
import { sfx } from './sound.js';
import { coinValue } from './coins.js';
import { hoyJuego } from './adviento.js';

// ¿Es Navidad? (NAVIDAD en src/config.js). Sale siempre en el modo Navidad secreto (el código de Elora)
// y con index.html?navidad=1, para probarlo.
export function esNavidad(hoy = hoyJuego()) {
  try { if (new URLSearchParams(location.search).get('navidad') === '1') return true; } catch (e) { /* nada */ }
  try { if (localStorage.getItem('holeway.modoNavidad') === '1') return true; } catch (e) { /* nada */ }
  const dia = (txt) => { const [a, m, d] = txt.split('-').map(Number); return new Date(a, m - 1, d); };
  const h = new Date(hoy); h.setHours(0, 0, 0, 0);
  return h >= dia(NAVIDAD.desde) && h <= dia(NAVIDAD.hasta);
}

// ¿Sale el cartel «¡La Navidad se acerca!»? Desde NAVIDAD.cartelDesde hasta el día antes del evento
// (con index.html?cartelnavidad=1 sale siempre, para verlo)
export function cartelNavidad(hoy = hoyJuego()) {
  try { if (new URLSearchParams(location.search).get('cartelnavidad') === '1') return true; } catch (e) { /* nada */ }
  if (!NAVIDAD.cartelDesde) return false;
  const dia = (txt) => { const [a, m, d] = txt.split('-').map(Number); return new Date(a, m - 1, d); };
  const h = new Date(hoy); h.setHours(0, 0, 0, 0);
  return h >= dia(NAVIDAD.cartelDesde) && h < dia(NAVIDAD.desde);
}

export class Lobby extends Game {
  // callbacks: { onPause(), onShop(), onTapes(), onStart(), onCoin(n), totalCoins(), totalTapes(),
  //              practiceTaken: Set con las monedas de práctica ya cogidas }
  constructor(character, callbacks) {
    super(character, loadMap('lobby', LOBBY), callbacks);
    // Las monedas de práctica ya cogidas no vuelven hasta que escapes de un pasillo.
    this.level.items.forEach((it, i) => { if (callbacks.practiceTaken.has(i)) it.taken = true; });
    const m = this.level.markers;
    // La Tarda de la tienda es amarilla, para distinguirla de la Tarda personaje (verde). Decidido por Elora.
    this.tarda = { ...characterById('tarda'), ...TARDA_GRIS };   // la de la tienda: gris, como la Tarda de verdad del dibujo (Elora)
    this.npc = m.N[0];
    this.shelf = m.V;
    this.doors = m.D;
    // la estantería es sólida
    for (const v of this.shelf) setTile(this.level, v.tx, v.ty, T.WALL);
    // en Navidad, el árbol (Elora): en la esquina de arriba a la derecha, al lado de la tienda de Tarda.
    // Es grande (Elora: "es muy pequeño"): ocupa 4 casillas de ancho, de la 22 a la 25, y no se atraviesa
    // (una fila más abajo que la pared, para que la estrella no tape los números de arriba)
    this.arbol = esNavidad() ? { tx: 23.5, ty: 4 } : null;
    // y el calendario de Adviento (Elora), colgado en la pared de arriba, entre Tarda y el árbol [PROVISIONAL el sitio]
    this.calendario = esNavidad() && callbacks.onAdviento ? { x: 21 * TILE + TILE / 2, y: TILE * 0.5 } : null;
    if (this.arbol) {
      // el suelo se pinta antes de bloquear sus casillas, para que debajo no salgan baldosas de pared
      this.staticLayer = this.buildStaticLayer();
      for (let tx = 22; tx <= 25; tx++) setTile(this.level, tx, 4, T.WALL);
      for (let tx = 23; tx <= 24; tx++) setTile(this.level, tx, 3, T.WALL);
    }
    this.enemies = [];
    this.near = null;
    this.player.facing = 'up';
    this.sinCansancio = true;   // en el lobby se corre sin cansarse (Elora)
    this.updateCamera();
  }

  setCharacter(ch) {
    this.ch = ch;
    this.jumpTime = ch.ability === 'carot' ? ABILITIES.carot.jumpTime : PLAYER.jumpTime;
  }

  update(dt, input) {
    if (this.paused || this.finished) return;
    this.time += dt;
    if (input.wasPressed('pause')) { this.cb.onPause(); return; }
    this.updatePlayer(dt, input);
    const p = this.player;

    // monedas de práctica dentro de la U de cajas
    this.level.items.forEach((it, i) => {
      if (it.taken || dist(it.x, it.y, p.x, p.y) > p.r + 10) return;
      it.taken = true;
      this.cb.practiceTaken.add(i);
      this.cb.onCoin(coinValue(it.kind));
      sfx.coin();
    });

    // ¿cerca de Tarda o de la estantería?
    this.near = null;
    if (dist(p.x, p.y, this.npc.x, this.npc.y) < TILE * 1.9) this.near = 'tarda';
    else if (this.shelf.some((v) => dist(p.x, p.y, v.x, v.y + TILE) < TILE * 1.3)) this.near = 'tapes';
    else if (this.calendario && dist(p.x, p.y, this.calendario.x, this.calendario.y + TILE * 1.5) < TILE * 1.4) this.near = 'adviento';
    if (this.near && input.wasPressed('interact')) {
      if (this.near === 'tarda') this.cb.onShop();
      else if (this.near === 'adviento') this.cb.onAdviento();
      else this.cb.onTapes();
      return;
    }

    // la puerta de arriba lleva a los pasillos (vale con llegar a ella, aunque no estés justo en el centro)
    if (this.doors.some((d) => dist(d.x, d.y, p.x, p.y) < TILE * 1.1)) { this.finished = true; this.cb.onStart(); return; }

    for (const m of this.messages) m.ttl -= dt;
    this.messages = this.messages.filter((m) => m.ttl > 0);
    this.updateCamera();
  }

  render(ctx) {
    const p = this.player;
    ctx.fillStyle = '#0b0a0e';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.save();
    ctx.translate(-Math.round(this.cam.x), -Math.round(this.cam.y));
    this.renderWorld(ctx);

    // puerta a los pasillos: bordes rojos (Elora) y luz ámbar
    for (const d of this.doors) this.drawDoor(ctx, d.tx * TILE, d.ty * TILE, true, '#b3202a', '#ffd35a');

    // las cintas (Elora): una cajita de cartón con las cintas dentro y, a su izquierda, la tele marrón
    // donde se ven, en pequeñito (la misma que dibujó Elora)
    const total = this.cb.cintasEnCaja ? this.cb.cintasEnCaja() : this.cb.totalTapes();   // la caja enseña las cintas depositadas
    if (this.shelf.length) {
      const v0 = this.shelf[0], vN = this.shelf[this.shelf.length - 1];
      // la tele a la izquierda y la caja a la derecha (Elora)
      this.drawMiniTV(ctx, v0.tx * TILE + 30, v0.ty * TILE + TILE - 2);
      this.drawTapeBox(ctx, (vN.tx * TILE + TILE) - TILE / 2 - 4, vN.ty * TILE + TILE - 2, total);
    }

    // Tarda de la tienda: detrás de su mostrador, para vender (Elora); alta, gris y con su cinta
    const nx = this.npc.x, ny = this.npc.y;
    const tienda = () => {
      drawCharacter(ctx, this.tarda, nx, ny - 6, 'down', this.time * 2, 0, false, { alta: true });
      // el mostrador, delante de Tarda: le tapa las patas de abajo
      ctx.fillStyle = '#6b4a2b'; ctx.fillRect(nx - 32, ny + 1, 64, 5);     // la tabla de arriba
      ctx.fillStyle = '#4a3220'; ctx.fillRect(nx - 30, ny + 6, 60, 18);    // el frente
      ctx.fillStyle = '#3a2618'; ctx.fillRect(nx - 30, ny + 6, 60, 2);     // sombra bajo la tabla
      ctx.strokeStyle = '#5a3d26'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(nx - 10, ny + 9); ctx.lineTo(nx - 10, ny + 22); ctx.moveTo(nx + 10, ny + 9); ctx.lineTo(nx + 10, ny + 22); ctx.stroke();
      // un montoncito de monedas encima
      ctx.fillStyle = '#ffd95a'; ctx.beginPath(); ctx.ellipse(nx + 20, ny + 2, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e8b83a'; ctx.beginPath(); ctx.ellipse(nx + 20, ny + 0.5, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
    };

    // el cartel de madera "¡Nuevas skins próximamente!" (Elora): a la izquierda de la puerta de
    // salida, colgado en la pared de arriba
    const d0 = this.doors[0] || { tx: 13, ty: 1 };
    const cartel = () => {
      const w = 100, h = 40, cx = d0.tx * TILE - 12 - w / 2, top = d0.ty * TILE - 6;
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(cx - w / 2 + 3, top + 4, w, h);   // sombra en la pared
      ctx.fillStyle = '#a8733f'; ctx.fillRect(cx - w / 2, top, w, h);                 // la tabla
      ctx.fillStyle = '#8c5d30'; ctx.fillRect(cx - w / 2, top + h / 2 - 1, w, 2);       // la raya entre tablas
      ctx.strokeStyle = '#5a3d26'; ctx.lineWidth = 2; ctx.strokeRect(cx - w / 2, top, w, h);
      ctx.fillStyle = '#3a2618';                                   // los clavos
      for (const [px, py] of [[-w / 2 + 5, 5], [w / 2 - 5, 5], [-w / 2 + 5, h - 5], [w / 2 - 5, h - 5]]) { ctx.beginPath(); ctx.arc(cx + px, top + py, 1.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#fff6dc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold 11px "Segoe UI", Arial';
      // cuántos días faltan para las skins nuevas (cuenta sola, según la fecha de hoy)
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      const [a, m, d] = SKINS_DIA.split('-').map(Number);
      const faltan = Math.round((new Date(a, m - 1, d) - hoy) / 86400000);
      const l1 = t('lobby.skins');
      const l2 = faltan > 1 ? t('lobby.skinsDias', { n: faltan }) : faltan === 1 ? t('lobby.skinsDia') : t('lobby.skinsYa');
      ctx.fillText(l1, cx, top + h * 0.3); ctx.fillText(l2 || '', cx, top + h * 0.72);
      ctx.textBaseline = 'alphabetic';
    };

    // el cartel de «¡La Navidad se acerca!» (Elora) va en el mismo sitio que el de las skins, que para
    // entonces ya se habrá quitado (al probarlo con ?cartelnavidad=1, lo tapa)
    if (this.calendario) this.drawCalendario(ctx, this.calendario.x, this.calendario.y);
    if (cartelNavidad()) this.drawCartelNavidad(ctx, d0.tx * TILE - 12 - 70, d0.ty * TILE - 8);
    else if (!SKINS_LISTAS) cartel();   // cuando las skins estén puestas, el cartel se va (Elora)

    // actores ordenados por altura
    const actors = [
      { y: ny + 12, draw: tienda },
      { y: p.y, draw: () => this.drawPlayer(ctx) },
    ];
    if (this.arbol) {
      const ax = this.arbol.tx * TILE + TILE / 2, ay = this.arbol.ty * TILE + TILE - 2;
      actors.push({ y: ay - 8, draw: () => this.drawArbol(ctx, ax, ay) });
    }
    actors.sort((a, b) => a.y - b.y);
    for (const a of actors) a.draw();

    // bocadillo de Tarda cuando estás cerca
    if (this.near === 'tarda') {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(nx + 22, ny - 34, 12, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#222'; ctx.font = 'bold 12px "Segoe UI", Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('...', nx + 22, ny - 35);
      ctx.textBaseline = 'alphabetic';
    }
    ctx.restore();

    // luz cálida: viñeta suave, sin oscuridad
    const g = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.35, VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    this.renderHUD(ctx);
  }

  // El calendario de Adviento colgado en la pared (Elora): una tabla verde con una cinta roja arriba y
  // casillas con número; las del calendario grande, más grandes. (cx, top): el centro de arriba.
  drawCalendario(ctx, cx, top) {
    const w = 58, h = 46, x0 = cx - w / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x0 + 3, top + 4, w, h);
    ctx.fillStyle = '#1f6e38'; ctx.fillRect(x0, top, w, h);
    ctx.strokeStyle = '#f2d24a'; ctx.lineWidth = 2; ctx.strokeRect(x0 + 1, top + 1, w - 2, h - 2);
    // el lazo rojo de arriba
    ctx.fillStyle = '#d42a36';
    ctx.beginPath(); ctx.ellipse(cx - 6, top + 1, 6, 3.5, -0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + 6, top + 1, 6, 3.5, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#a81f2a'; ctx.beginPath(); ctx.arc(cx, top + 1, 2.6, 0, Math.PI * 2); ctx.fill();
    // las casillas: 5 grandes (21 a 25) y 5 chiquitas (26 a 30), con su número
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < 5; i++) {
      const bx = x0 + 5 + i * 10, by = top + 9;
      ctx.fillStyle = ['#e23b4a', '#f2d24a', '#3a8ee8', '#fff6dc', '#b65fe0'][i];
      ctx.fillRect(bx, by, 8.5, 12);
      ctx.fillStyle = '#2a2124'; ctx.font = 'bold 6px "Segoe UI", Arial'; ctx.fillText(String(21 + i), bx + 4.25, by + 6.5);
    }
    for (let i = 0; i < 5; i++) {
      const bx = x0 + 7 + i * 9.5, by = top + 27;
      ctx.fillStyle = '#fff6dc'; ctx.fillRect(bx, by, 6.5, 7);
      ctx.fillStyle = '#2a2124'; ctx.font = 'bold 4.5px "Segoe UI", Arial'; ctx.fillText(String(26 + i), bx + 3.25, by + 3.8);
    }
    ctx.fillStyle = '#fff6dc'; ctx.font = 'bold 5px "Segoe UI", Arial'; ctx.fillText('ADVIENTO', cx, top + 41);
    ctx.textBaseline = 'alphabetic';
  }

  // El cartel de «¡La Navidad se acerca!» (Elora): una tabla roja con el borde verde, nieve encima,
  // acebo con bolitas rojas en las esquinas y lucecitas de colores; cuenta los días que faltan para el
  // evento de Navidad (NAVIDAD.desde). (cx, top): el centro de arriba.
  drawCartelNavidad(ctx, cx, top) {
    const w = 140, h = 46, x0 = cx - w / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x0 + 3, top + 4, w, h);   // sombra en la pared
    ctx.fillStyle = '#1f7a3a'; ctx.fillRect(x0 - 3, top - 3, w + 6, h + 6);     // el borde verde
    ctx.fillStyle = '#b8232f'; ctx.fillRect(x0, top, w, h);                     // la tabla roja
    ctx.fillStyle = '#9a1a25'; ctx.fillRect(x0, top + h - 4, w, 4);
    // la nieve de arriba, con bultitos (cada uno, su trazo)
    ctx.fillStyle = '#f4f8ff'; ctx.fillRect(x0 - 3, top - 5, w + 6, 4);
    for (let i = 0; i <= 12; i++) { ctx.beginPath(); ctx.arc(x0 - 1 + i * (w + 2) / 12, top - 2, 2.6 + (i % 3) * 0.6, 0, Math.PI * 2); ctx.fill(); }
    // las lucecitas de colores colgando por debajo, que se encienden y se apagan
    ctx.strokeStyle = '#2b3a2b'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(x0 - 2, top + h + 3); ctx.quadraticCurveTo(cx, top + h + 9, x0 + w + 2, top + h + 3); ctx.stroke();
    for (let i = 0; i < 9; i++) {
      const k = i / 8, lx = x0 - 2 + k * (w + 4), ly = top + h + 3 + Math.sin(k * Math.PI) * 3.2 + 2;
      const on = Math.sin(this.time * 3 + i * 1.9) > -0.3;
      ctx.fillStyle = on ? ['#ffe36b', '#5ec8ff', '#ff6b8a', '#7dff8a'][i % 4] : 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.arc(lx, ly, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    // acebo en las dos esquinas de arriba: dos hojas y tres bolitas rojas
    for (const side of [-1, 1]) {
      const hx = cx + side * (w / 2 - 7), hy = top + 6;
      ctx.fillStyle = '#2e9a4c';
      ctx.beginPath(); ctx.ellipse(hx - 4, hy, 4.5, 2, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx + 4, hy, 4.5, 2, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ff2e3e';
      for (const [bx, by] of [[-1.2, -1], [1.2, -1], [0, 1]]) { ctx.beginPath(); ctx.arc(hx + bx, hy + by, 1.4, 0, Math.PI * 2); ctx.fill(); }
    }
    // el texto
    const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
    const [a, m, d] = NAVIDAD.desde.split('-').map(Number);
    const faltan = Math.round((new Date(a, m - 1, d) - hoy) / 86400000);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff6dc'; ctx.font = 'bold 11.5px "Segoe UI", Arial';
    ctx.fillText(t('lobby.navidad'), cx, top + h * 0.34);
    ctx.fillStyle = '#ffe36b'; ctx.font = 'bold 11px "Segoe UI", Arial';
    ctx.fillText(faltan > 1 ? t('lobby.navidadDias', { n: faltan }) : t('lobby.navidadDia'), cx, top + h * 0.72);
    ctx.textBaseline = 'alphabetic';
  }

  // El árbol de Navidad del lobby (Elora pidió el árbol; lo dibuja Clad): tres pisos verdes, la estrella
  // amarilla arriba, bolas de colores y lucecitas que se encienden y apagan, en una maceta roja.
  // (x, y): el centro de abajo.
  drawArbol(ctx, x, y) {
    const tt = this.time;
    // grande, mucho más alto que los personajes (Elora)
    ctx.save(); ctx.translate(x, y); ctx.scale(2.5, 2.5); ctx.translate(-x, -y);
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(x + 2, y, 24, 6, 0, 0, Math.PI * 2); ctx.fill();   // sombra
    // la maceta y el tronco
    ctx.fillStyle = '#6b4226'; ctx.fillRect(x - 4, y - 16, 8, 8);
    ctx.fillStyle = '#c0392b';
    ctx.beginPath(); ctx.moveTo(x - 11, y - 12); ctx.lineTo(x + 11, y - 12); ctx.lineTo(x + 8, y); ctx.lineTo(x - 8, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8c547'; ctx.fillRect(x - 11, y - 12, 22, 3);
    // los tres pisos de ramas (de abajo arriba, cada uno más pequeño)
    const pisos = [[y - 14, 26, 24], [y - 30, 21, 22], [y - 45, 15, 20]];
    for (const [base, ancho, alto] of pisos) {
      ctx.fillStyle = '#1f7a3a';
      ctx.beginPath(); ctx.moveTo(x - ancho, base); ctx.lineTo(x, base - alto); ctx.lineTo(x + ancho, base); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#2e9a4c';   // el lado con luz
      ctx.beginPath(); ctx.moveTo(x - ancho, base); ctx.lineTo(x, base - alto); ctx.lineTo(x - 2, base); ctx.closePath(); ctx.fill();
    }
    // la guirnalda dorada
    ctx.strokeStyle = '#f2d24a'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(x - 18, y - 24); ctx.quadraticCurveTo(x, y - 18, x + 20, y - 27); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x - 13, y - 41); ctx.quadraticCurveTo(x + 2, y - 35, x + 14, y - 43); ctx.stroke();
    // bolas de colores (cada una, su trazo)
    const bolas = [[-14, -19, '#e23b4a'], [9, -22, '#3a8ee8'], [-3, -27, '#f2d24a'], [15, -17, '#b65fe0'],
      [-8, -36, '#3a8ee8'], [8, -38, '#e23b4a'], [-1, -50, '#e23b4a']];
    for (const [bx, by, c] of bolas) {
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + bx, y + by, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.beginPath(); ctx.arc(x + bx - 0.8, y + by - 0.8, 0.8, 0, Math.PI * 2); ctx.fill();
    }
    // lucecitas que se encienden y se apagan
    const luces = [[-20, -16], [-6, -18], [4, -16], [20, -18], [-12, -30], [12, -31], [-6, -44], [6, -46], [0, -58]];
    luces.forEach(([lx, ly], i) => {
      const on = Math.sin(tt * 3 + i * 1.7) > -0.2;
      ctx.fillStyle = on ? ['#fff3a0', '#ffb3c8', '#b3e6ff'][i % 3] : 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.arc(x + lx, y + ly, on ? 1.5 : 1, 0, Math.PI * 2); ctx.fill();
    });
    // la estrella de arriba, que brilla
    const r = 7 + Math.sin(tt * 2.5) * 0.6;
    ctx.fillStyle = 'rgba(255, 230, 120, 0.25)'; ctx.beginPath(); ctx.arc(x, y - 66, r + 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd83a';
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.45 : r;
      const px = x + Math.cos(a) * rr, py = y - 66 + Math.sin(a) * rr;
      if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // Caja de cartón abierta con las cintas asomando (cuantas más tengas, más asoman; como mucho 6).
  // (x, y): el centro de abajo de la caja.
  drawTapeBox(ctx, x, y, total) {
    const w = 40, h = 24, top = y - h;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x - w / 2 + 3, y - 2, w, 5);   // sombra
    // el hueco de dentro y las cintas asomando
    ctx.fillStyle = '#6a4826'; ctx.fillRect(x - w / 2 + 2, top - 4, w - 4, 8);
    const n = Math.min(total, 6);
    for (let i = 0; i < n; i++) {
      const cx = x - w / 2 + 5 + i * 5.5, inclina = (i % 2 ? 1 : -1) * 0.12;
      ctx.save(); ctx.translate(cx + 3, top + 2); ctx.rotate(inclina);
      ctx.fillStyle = '#2c2c34'; ctx.fillRect(-3, -14, 6, 16);
      ctx.fillStyle = '#f2ecd2'; ctx.fillRect(-2, -12, 4, 5);
      ctx.restore();
    }
    // la caja
    ctx.fillStyle = '#c8955a'; ctx.fillRect(x - w / 2, top, w, h);
    ctx.fillStyle = '#a8743e'; ctx.fillRect(x - w / 2, top, w, 3);
    ctx.fillStyle = '#b5824a'; ctx.fillRect(x + w / 2 - 9, top + 3, 9, h - 3);   // lado en sombra
    // las solapas abiertas
    ctx.fillStyle = '#d9a86a';
    ctx.beginPath(); ctx.moveTo(x - w / 2, top); ctx.lineTo(x - w / 2 - 7, top - 7); ctx.lineTo(x - w / 2 + 6, top - 6); ctx.lineTo(x - w / 2 + 8, top); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + w / 2, top); ctx.lineTo(x + w / 2 + 7, top - 7); ctx.lineTo(x + w / 2 - 6, top - 6); ctx.lineTo(x + w / 2 - 8, top); ctx.closePath(); ctx.fill();
    // cinta de embalar
    ctx.fillStyle = 'rgba(230, 210, 150, 0.7)'; ctx.fillRect(x - 3, top, 6, h);
    if (total > 6) {
      ctx.fillStyle = '#fff'; ctx.font = 'bold 10px "Segoe UI", Arial'; ctx.textAlign = 'center';
      ctx.fillText('+' + (total - 6), x - 8, y - 6);
    }
  }

  // La tele de las cintas en pequeñito, como la dibujó Elora: marco de madera marrón, dos antenas,
  // la pantalla gris con rayas (con un poco de nieve) y debajo el mueble con el vídeo y el pomo amarillo.
  // (x, y): el centro de abajo.
  drawMiniTV(ctx, x, y) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(x - 24, y - 2, 50, 5);   // sombra
    // el mueble
    ctx.fillStyle = '#e9e1b8'; ctx.fillRect(x - 24, y - 12, 48, 12);
    ctx.fillStyle = '#d7cd9c'; ctx.fillRect(x - 24, y - 12, 48, 2);
    ctx.fillStyle = '#f2c62e'; ctx.beginPath(); ctx.arc(x - 6, y - 5, 2.2, 0, Math.PI * 2); ctx.fill();   // el pomo amarillo
    ctx.fillStyle = '#2b2b30'; ctx.fillRect(x + 7, y - 9, 12, 4);                                         // el vídeo
    ctx.fillStyle = '#111'; ctx.fillRect(x + 9, y - 8, 8, 1.5);
    // las antenas (cada bolita, su propio trazo)
    ctx.strokeStyle = '#9a9aa2'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(x - 6, y - 44); ctx.lineTo(x - 14, y - 54); ctx.moveTo(x + 6, y - 44); ctx.lineTo(x + 12, y - 55); ctx.stroke();
    ctx.fillStyle = '#c0c0c8';
    ctx.beginPath(); ctx.arc(x - 14, y - 54, 1.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 12, y - 55, 1.4, 0, Math.PI * 2); ctx.fill();
    // el marco de madera
    ctx.fillStyle = '#8b4a2b'; ctx.fillRect(x - 21, y - 44, 42, 32);
    ctx.fillStyle = '#a65d38'; ctx.fillRect(x - 21, y - 44, 42, 3);
    // la pantalla: gris con rayas y algo de nieve que parpadea
    ctx.fillStyle = '#c9cbd0'; ctx.fillRect(x - 17, y - 40, 34, 24);
    ctx.fillStyle = 'rgba(80,80,90,0.45)';
    for (let k = 0; k < 3; k++) ctx.fillRect(x - 15, y - 36 + k * 7, 30, 1.5);
    for (let k = 0; k < 10; k++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.7)' : 'rgba(40,40,50,0.5)';
      ctx.fillRect(x - 17 + Math.random() * 33, y - 40 + Math.random() * 23, 1.5, 1.5);
    }
  }

  renderHUD(ctx) {
    const font = '"Segoe UI", system-ui, Arial';
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
    ctx.fillStyle = '#fff'; ctx.font = `bold 20px ${font}`;
    ctx.fillText(t('lobby.title'), 16, 14);
    ctx.font = `16px ${font}`; ctx.fillStyle = '#e8e2c8';
    ctx.fillText(this.ch.name, 16, 42);
    this.renderAbility(ctx, 16, 64, font);
    ctx.textAlign = 'right'; ctx.font = `16px ${font}`;
    ctx.fillStyle = '#ffd95a';
    ctx.fillText(`${t('hud.coins')}: ${this.cb.totalCoins()}`, VIEW_W - 18, 16);
    // las cintas de tu inventario y, debajo, las que hay en la caja (Elora)
    ctx.fillStyle = '#e8e2c8';
    const caja = this.cb.cintasEnCaja ? this.cb.cintasEnCaja() : 0;
    ctx.fillText(`${t('hud.tapes')}: ${this.cb.totalTapes() - caja}`, VIEW_W - 18, 40);
    ctx.fillStyle = '#b8b0a0';
    ctx.fillText(`${t('hud.box')}: ${caja}`, VIEW_W - 18, 62);
    // avisos
    ctx.textAlign = 'center';
    let yy = VIEW_H - 40;
    if (this.near) { ctx.font = `bold 20px ${font}`; ctx.fillStyle = '#ffe36b'; ctx.fillText(t({ tarda: 'lobby.talk', tapes: 'lobby.tapes', adviento: 'lobby.adviento' }[this.near]), VIEW_W / 2, yy); yy -= 30; }
    else { ctx.font = `16px ${font}`; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(t('lobby.door'), VIEW_W / 2, yy); yy -= 30; }
    this.renderMessages(ctx, yy, font);
    ctx.restore();
  }
}
