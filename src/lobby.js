// El lobby: una sala tranquila donde Tarda vende personajes, hay una caja de cartón con tus cintas
// (y la tele en pequeñito al lado; antes era una estantería)
// y una puerta para entrar a los pasillos.

import { TILE, VIEW_W, VIEW_H, PLAYER, ABILITIES, SKINS_DIA, skinsListas, horaSkins, ahoraJuego, NAVIDAD, fechaNavidad, DIA_NINO, horaRopa, ropaLista } from './config.js';
import { T, loadMap, setTile } from './level.js';
import { LOBBY } from './maps.js';
import { Game, dist } from './game.js';
import { drawCharacter, characterById, TARDA_GRIS } from './characters.js';
import { t } from './i18n.js';
import { sfx } from './sound.js';
import { coinValue } from './coins.js';
import { hoyJuego, casillas } from './adviento.js';
import { drawArbolCompleto, drawAdorno } from './adornos.js';
import { drawAlmohada } from './almohadas.js';

// ¿Es Navidad? (NAVIDAD en src/config.js). Sale siempre en el modo Navidad secreto (el código de Elora)
// y con index.html?navidad=1, para probarlo.
export function esNavidad(hoy = hoyJuego()) {
  try { if (new URLSearchParams(location.search).get('navidad') === '1') return true; } catch (e) { /* nada */ }
  try { if (localStorage.getItem('holeway.modoNavidad') === '1') return true; } catch (e) { /* nada */ }
  const h = new Date(hoy); h.setHours(0, 0, 0, 0);
  const anio = h.getFullYear();   // la Navidad se repite cada año (Elora)
  return h >= fechaNavidad('desde', anio) && h <= fechaNavidad('hasta', anio);
}

// ¿Es la fiesta del Día del Niño? (DIA_NINO en config.js: del 15 al 20 de noviembre, todos los años, Elora)
export function esDiaNino(hoy = hoyJuego()) {
  try { if (new URLSearchParams(location.search).get('dianino') === '1') return true; } catch (e) { /* nada */ }
  // con el modo pijama (el código de Elora) también hay fiesta: lobby de pijamas y guerra de almohadas (Elora)
  try { if (localStorage.getItem('holeway.modoPijama') === '1') return true; } catch (e) { /* nada */ }
  const h = new Date(hoy); h.setHours(0, 0, 0, 0);
  const dia = (clave) => { const [m, d] = DIA_NINO[clave].split('-').map(Number); return new Date(h.getFullYear(), m - 1, d); };
  return h >= dia('desde') && h <= dia('hasta');
}

// La música del lobby: la de Navidad cuando es Navidad (o con el modo Navidad), la de la fiesta de pijamas en
// el Día del Niño (o con el modo pijama), y si no la de siempre (Elora)
export function cancionLobby() { return esNavidad() ? 'navidad' : esDiaNino() ? 'pijamas' : 'lobby'; }
// Y la de los pasillos: en Navidad, la de los pasillos de Navidad (Elora)
export function cancionPasillo() { return esNavidad() ? 'pasilloNavidad' : 'pasillo'; }

// ¿Sale el cartel «¡La Navidad se acerca!»? Desde NAVIDAD.cartelDesde hasta el primer día del evento, cada año
// (con index.html?cartelnavidad=1 sale siempre, para verlo)
export function cartelNavidad(hoy = hoyJuego()) {
  try { if (new URLSearchParams(location.search).get('cartelnavidad') === '1') return true; } catch (e) { /* nada */ }
  if (!NAVIDAD.cartelDesde) return false;
  const h = new Date(hoy); h.setHours(0, 0, 0, 0);
  const anio = h.getFullYear();   // cada año (Elora)
  return h >= fechaNavidad('cartelDesde', anio) && h <= fechaNavidad('desde', anio);   // el primer día del evento sigue (Elora)
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
    this.doors = m.D;
    // la caja de las cintas y la tele: mientras están a la vez el cartel de Navidad y el de los pijamas, se mueven
    // dos casillas a la izquierda para que quepa el de Navidad; cuando se quita, vuelven a su sitio (Elora)
    const mover = cartelNavidad() && this.cartelSkinsVisible() ? 2 : 0;
    this.shelf = m.V.map((v) => ({ ...v, tx: v.tx - mover, x: v.x - mover * TILE }));
    // la estantería es sólida
    for (const v of this.shelf) setTile(this.level, v.tx, v.ty, T.WALL);
    // en Navidad, el árbol (Elora): en la esquina de arriba a la derecha, al lado de la tienda de Tarda.
    // Es grande (Elora: "es muy pequeño"): ocupa 4 casillas de ancho, de la 22 a la 25, y no se atraviesa
    // (una fila más abajo que la pared, para que la estrella no tape los números de arriba)
    this.arbol = esNavidad() ? { tx: 23.5, ty: 4 } : null;
    this.diaNino = esDiaNino();   // la fiesta del Día del Niño (Elora): lobby de fiesta de pijamas y Tarda en pijama
    // y el montón de almohadas de la guerra de almohadas (Elora): unas con sangre (las de los Bloodies) y otras pastel
    this.monton = this.diaNino && callbacks.onAlmohadas ? { x: 21 * TILE + TILE / 2, y: 7 * TILE + TILE / 2 } : null;
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
    else if (this.monton && dist(p.x, p.y, this.monton.x, this.monton.y) < TILE * 1.6) this.near = 'almohadas';
    else if (this.arbol && this.cb.onArbol && dist(p.x, p.y, this.arbol.tx * TILE + TILE / 2, this.arbol.ty * TILE + TILE * 1.6) < TILE * 2.4) this.near = 'arbol';
    else if (this.cb.onCartel && this.cartelSkinsVisible() && dist(p.x, p.y, this.cartelSkinsPos().x, this.cartelSkinsPos().y) < TILE * 1.6) this.near = 'cartel';
    else if (this.cb.onCartel && cartelNavidad() && dist(p.x, p.y, this.cartelNavidadPos().x, this.cartelNavidadPos().y) < TILE * 1.6) this.near = 'cartelNav';
    else if (this.cb.onCartel && this.cartelRopaVisible() && dist(p.x, p.y, this.cartelRopaPos().x, this.cartelRopaPos().y) < TILE * 1.6) this.near = 'cartelRopa';
    if (this.near && input.wasPressed('interact')) {
      if (this.near === 'tarda') this.cb.onShop();
      else if (this.near === 'adviento') this.cb.onAdviento();
      else if (this.near === 'arbol') this.cb.onArbol();
      else if (this.near === 'almohadas') this.cb.onAlmohadas();
      else if (this.near === 'cartel') this.cb.onCartel('skins');
      else if (this.near === 'cartelNav') this.cb.onCartel('navidad');
      else if (this.near === 'cartelRopa') this.cb.onCartel('ropa');
      else this.cb.onTapes();
      return;
    }

    // la puerta de arriba lleva a los pasillos (vale con llegar a ella, aunque no estés justo en el centro)
    if (this.doors.some((d) => dist(d.x, d.y, p.x, p.y) < TILE * 1.1)) { this.finished = true; this.cb.onStart(); return; }

    for (const m of this.messages) m.ttl -= dt;
    this.messages = this.messages.filter((m) => m.ttl > 0);
    this.updateCamera();
  }

  // El cartel de las skins (Elora): se ve hasta que salen las skins y todo el día del estreno (Elora: ese día
  // sigue y es la fiesta de pijamas), y no cuando está el de Navidad. Se puede mirar de cerca: te pones debajo y pulsas E.
  cartelSkinsVisible() {
    const ahora = ahoraJuego(), h = horaSkins();
    return !skinsListas(ahora) || ahora.toDateString() === h.toDateString();
  }
  // El cartel de la ropa nueva (Elora: «que haya un cartel»): a la derecha de la puerta, de madera como el de los pijamas.
  // Cuenta lo que falta para que salga (martes 10 a las 8:00) y ese día dice que ya está en la tienda; al día
  // siguiente se quita. [PROVISIONAL el sitio y cómo es]
  // se ve hasta que sale la ropa nueva y todo ese día; se mira de cerca con E (Elora)
  cartelRopaVisible() {
    const ahora = ahoraJuego(), h = horaRopa();
    return ahora <= h || ahora.toDateString() === h.toDateString();
  }
  cartelRopaPos() {
    const d0 = this.doors[0] || { tx: 13, ty: 1 };
    return { x: (d0.tx + 1) * TILE + 14 + 52, y: d0.ty * TILE - 6 + 40 + TILE * 0.9 };   // justo debajo del cartel
  }
  drawCartelRopa(ctx, d0) {
    const ahora = ahoraJuego(), h = horaRopa();
    if (!this.cartelRopaVisible()) return;   // ya pasó su día
    const w = 104, alto = 40, cx = (d0.tx + 1) * TILE + 14 + w / 2, top = d0.ty * TILE - 6;
    // de madera, con la misma decoración que el de los pijamas (Elora)
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(cx - w / 2 + 3, top + 4, w, alto);
    ctx.fillStyle = '#a8733f'; ctx.fillRect(cx - w / 2, top, w, alto);
    ctx.fillStyle = '#8c5d30'; ctx.fillRect(cx - w / 2, top + alto / 2 - 1, w, 2);
    ctx.strokeStyle = '#5a3d26'; ctx.lineWidth = 2; ctx.strokeRect(cx - w / 2, top, w, alto);
    ctx.fillStyle = '#3a2618';
    for (const [px, py] of [[-w / 2 + 5, 5], [w / 2 - 5, 5], [-w / 2 + 5, alto - 5], [w / 2 - 5, alto - 5]]) { ctx.beginPath(); ctx.arc(cx + px, top + py, 1.5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#fff6dc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = 'bold 11px "Segoe UI", Arial';
    let l2;
    if (ropaLista(ahora)) l2 = t('lobby.ropaYa');
    else if (ahora.toDateString() !== h.toDateString()) {
      const hoy = new Date(ahora); hoy.setHours(0, 0, 0, 0); const dia = new Date(h); dia.setHours(0, 0, 0, 0);
      const faltan = Math.round((dia - hoy) / 86400000);
      l2 = faltan === 1 ? t('lobby.ropaManana') : t('lobby.skinsDias', { n: faltan });
    } else {
      const seg = Math.max(0, Math.ceil((h - ahora) / 1000)), min = Math.ceil(seg / 60), hh = Math.floor(min / 60), mm = min % 60;
      l2 = seg <= 60 ? t('lobby.skinsS', { s: seg }) : hh > 0 ? t('lobby.skinsHM', { h: hh, m: mm }) : t('lobby.skinsM', { m: mm });
    }
    ctx.fillText(t('lobby.ropa'), cx, top + alto * 0.3); ctx.fillText(l2, cx, top + alto * 0.72);
    ctx.textBaseline = 'alphabetic';
  }

  // El de Navidad: si está también el de los pijamas, a su izquierda y un poco más pequeño (Elora: «se pueden 3»);
  // si no, en su sitio de siempre, a la izquierda de la puerta. Devuelve el centro, arriba y el tamaño.
  cartelNavidadSitio() {
    const d0 = this.doors[0] || { tx: 13, ty: 1 };
    if (this.cartelSkinsVisible()) return { cx: d0.tx * TILE - 12 - 100 - 10 - 63, top: d0.ty * TILE - 6, k: 0.9 };
    return { cx: d0.tx * TILE - 12 - 70, top: d0.ty * TILE - 8, k: 1 };
  }
  cartelNavidadPos() {
    const c = this.cartelNavidadSitio();
    return { x: c.cx, y: c.top + 46 * c.k + TILE * 0.9 };
  }
  cartelSkinsPos() {
    const d0 = this.doors[0] || { tx: 13, ty: 1 };
    return { x: d0.tx * TILE - 12 - 50, y: d0.ty * TILE - 6 + 40 + TILE * 0.9 };   // justo debajo del cartel
  }

  render(ctx) {
    const p = this.player;
    ctx.fillStyle = '#0b0a0e';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.save();
    ctx.scale(this.zoom, this.zoom);   // modo móvil: todo más grande
    ctx.translate(-Math.round(this.cam.x), -Math.round(this.cam.y));
    this.renderWorld(ctx);

    // la fiesta del Día del Niño (Elora): guirnalda de estrellitas, lucecitas, almohadas y peluches
    if (this.diaNino) this.drawFiestaPijamas(ctx);
    if (this.monton) {
      const { x, y } = this.monton;
      [[-14, 6, '#c7e3ff', 0, 0.2], [12, 7, '#f4e3dc', 1, -0.2], [0, 0, '#ffc6dd', 0, 0.1], [-8, -8, '#f4e3dc', 1, -0.3], [9, -7, '#d9ccff', 0, 0.3], [0, -15, '#fff1a8', 0, 0]]
        .forEach(([dx, dy, c, s, a]) => drawAlmohada(ctx, x + dx * 1.3, y + dy * 1.3, c, !!s, a, 1.2));
    }

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
      // en Navidad lleva su skin de osito, toda marrón, y está cosiendo (Elora)
      // y en la fiesta del Día del Niño, en pijama (Elora)
      const tarda = this.diaNino && !this.arbol ? { ...this.tarda, skin: 'pijama', pijamaMarron: true } : this.tarda;
      const fiesta = this.diaNino && !this.arbol;
      drawCharacter(ctx, tarda, nx, ny - 6, 'down', this.time * 2, 0, false, this.arbol ? { alta: true, osito: true, cosiendo: true } : { alta: true, peluche: fiesta });
      // y en la fiesta, un peluchito de oso como el del lobby, en la mano de arriba (donde lleva la cinta), para que se
      // vea bien al lado del pijama (Elora: «que lo tenga en la mano»)
      if (fiesta) drawAdorno(ctx, 'osito-gigante', nx + 16, ny - 23, 16, this.time);
      // el mostrador, delante de Tarda: le tapa las patas de abajo
      ctx.fillStyle = '#6b4a2b'; ctx.fillRect(nx - 32, ny + 1, 64, 5);     // la tabla de arriba
      ctx.fillStyle = '#4a3220'; ctx.fillRect(nx - 30, ny + 6, 60, 18);    // el frente
      ctx.fillStyle = '#3a2618'; ctx.fillRect(nx - 30, ny + 6, 60, 2);     // sombra bajo la tabla
      ctx.strokeStyle = '#5a3d26'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(nx - 10, ny + 9); ctx.lineTo(nx - 10, ny + 22); ctx.moveTo(nx + 10, ny + 9); ctx.lineTo(nx + 10, ny + 22); ctx.stroke();
      // en Navidad, un carrete de hilo rojo en el mostrador (Tarda está cosiendo, Elora)
      if (this.arbol) {
        ctx.fillStyle = '#c9a06a'; ctx.fillRect(nx - 24, ny - 6, 7, 1.6); ctx.fillRect(nx - 24, ny - 0.4, 7, 1.6);
        ctx.fillStyle = '#d8344a'; ctx.fillRect(nx - 23, ny - 4.6, 5, 4.4);
        ctx.strokeStyle = '#a31c26'; ctx.lineWidth = 0.5;
        ctx.beginPath(); for (const y of [-3.6, -2.4, -1.2]) { ctx.moveTo(nx - 23, ny + y); ctx.lineTo(nx - 18, ny + y); } ctx.stroke();
      }
      // un montoncito de monedas encima
      ctx.fillStyle = '#ffd95a'; ctx.beginPath(); ctx.ellipse(nx + 20, ny + 2, 5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e8b83a'; ctx.beginPath(); ctx.ellipse(nx + 20, ny + 0.5, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
    };

    // el cartel de madera "¡Nuevas skins próximamente!" (Elora): a la izquierda de la puerta de
    // salida, colgado en la pared de arriba
    const d0 = this.doors[0] || { tx: 13, ty: 1 };
    const cartel = () => {
      const w = 100, h = 40, cx = d0.tx * TILE - 12 - w / 2, top = d0.ty * TILE - 6;
      // morado con el borde amarillo y estrellitas que brillan en las esquinas (Elora: la decoración que tenía
      // primero el cartel de la ropa nueva)
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(cx - w / 2 + 3, top + 4, w, h);   // sombra en la pared
      ctx.fillStyle = '#6a3fae'; ctx.fillRect(cx - w / 2, top, w, h);
      ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2; ctx.strokeRect(cx - w / 2, top, w, h);
      ctx.fillStyle = '#ffe36b';
      for (const [px, py] of [[-w / 2 + 6, 6], [w / 2 - 6, 6], [-w / 2 + 6, h - 6], [w / 2 - 6, h - 6]]) {
        const tw = 0.6 + 0.4 * Math.sin(this.time * 3 + px);
        ctx.save(); ctx.globalAlpha *= tw; ctx.beginPath(); ctx.arc(cx + px, top + py, 1.8, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      ctx.fillStyle = '#fff6dc'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = 'bold 11px "Segoe UI", Arial';
      // cuántos días faltan para las skins nuevas (cuenta sola, según la fecha de hoy). El mismo día
      // (Elora): un temporizador con las horas y los minutos que faltan, y en el último minuto, los segundos
      const ahora = ahoraJuego(), hoy = new Date(ahora); hoy.setHours(0, 0, 0, 0);
      const [a, m, d] = SKINS_DIA.split('-').map(Number);
      const faltan = Math.round((new Date(a, m - 1, d) - hoy) / 86400000);
      // hasta el estreno, el cartel avisa a ratos de que la fiesta se mueve (Elora)
      const l1 = !skinsListas(ahora) && Math.floor(this.time / 2.5) % 2 ? t('lobby.skinsMueve') : t('lobby.skins');
      let l2;
      if (skinsListas(ahora)) l2 = t('lobby.skinsFiesta');   // el día del estreno: ¡la fiesta de pijamas!
      else if (faltan > 1) l2 = t('lobby.skinsDias', { n: faltan });
      else if (faltan === 1) l2 = t('lobby.skinsDia');
      else {
        const seg = Math.max(0, Math.ceil((horaSkins() - ahora) / 1000));
        const min = Math.ceil(seg / 60), hh = Math.floor(min / 60), mm = min % 60;   // los minutos, redondeando hacia arriba
        if (seg <= 60) l2 = t('lobby.skinsS', { s: seg });
        else if (hh > 0) l2 = t('lobby.skinsHM', { h: hh, m: mm });
        else l2 = t('lobby.skinsM', { m: mm });
      }
      ctx.fillText(l1, cx, top + h * 0.3); ctx.fillText(l2 || '', cx, top + h * 0.72);
      ctx.textBaseline = 'alphabetic';
    };

    // el cartel de «¡La Navidad se acerca!» (Elora) va en el mismo sitio que el de las skins, que para
    // entonces ya se habrá quitado (al probarlo con ?cartelnavidad=1, lo tapa)
    if (this.calendario) this.drawCalendario(ctx, this.calendario.x, this.calendario.y);
    // los tres carteles a la vez (Elora): el de Navidad, el de los pijamas y el de la ropa nueva
    if (cartelNavidad()) {
      const c = this.cartelNavidadSitio();
      ctx.save(); ctx.translate(c.cx, c.top); ctx.scale(c.k, c.k); this.drawCartelNavidad(ctx, 0, 0); ctx.restore();
    }
    if (this.cartelSkinsVisible()) cartel();   // el día del estreno sigue; al día siguiente se va (Elora)
    this.drawCartelRopa(ctx, d0);

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
    // las casillas: las del calendario grande (21, en 3 filas de 7) y las del mini calendario del 5, con su número
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const colores = ['#e23b4a', '#f2d24a', '#3a8ee8', '#fff6dc', '#b65fe0'];
    casillas('grande').forEach((c, i) => {
      const bx = x0 + 5.5 + (i % 7) * 6.9, by = top + 6 + Math.floor(i / 7) * 6.4;
      ctx.fillStyle = colores[i % 5]; ctx.fillRect(bx, by, 6, 5.4);
      ctx.fillStyle = '#2a2124'; ctx.font = 'bold 3.6px "Segoe UI", Arial'; ctx.fillText(String(c.dia), bx + 3, by + 2.9);
    });
    casillas('chico').forEach((c, i) => {
      const bx = x0 + 9 + i * 8.4, by = top + 27.5;
      ctx.fillStyle = '#fff6dc'; ctx.fillRect(bx, by, 6.5, 6.5);
      ctx.fillStyle = '#2a2124'; ctx.font = 'bold 4.2px "Segoe UI", Arial'; ctx.fillText(String(c.dia), bx + 3.25, by + 3.5);
    });
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
    // el texto (el primer día del evento: «¡Ya es Navidad!»)
    const hoy = hoyJuego(); hoy.setHours(0, 0, 0, 0);
    const faltan = Math.round((fechaNavidad('desde', hoy.getFullYear()) - hoy) / 86400000);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff6dc'; ctx.font = 'bold 11.5px "Segoe UI", Arial';
    ctx.fillText(t('lobby.navidad'), cx, top + h * 0.34);
    ctx.fillStyle = '#ffe36b'; ctx.font = 'bold 11px "Segoe UI", Arial';
    ctx.fillText(faltan > 1 ? t('lobby.navidadDias', { n: faltan }) : faltan === 1 ? t('lobby.navidadDia') : t('lobby.navidadYa'), cx, top + h * 0.72);
    ctx.textBaseline = 'alphabetic';
  }

  // El árbol de Navidad del lobby (Elora pidió el árbol; lo dibuja Clad): tres pisos verdes, la estrella
  // amarilla arriba, bolas de colores y lucecitas que se encienden y apagan, en una maceta roja.
  // (x, y): el centro de abajo.
  // La fiesta de pijamas del Día del Niño (Elora): por la pared de arriba, una guirnalda con estrellitas y lucecitas
  // que se encienden y se apagan (menos encima de la puerta); por el suelo, almohadas y peluchitos de los personajes
  // con ojos de botón. Son de adorno: se pueden pisar [PROVISIONAL dónde va cada cosa]
  drawFiestaPijamas(ctx) {
    const tt = this.time, y0 = 2 * TILE - 4, puerta = this.doors.map((d) => d.tx);
    const colores = ['#ffd95a', '#ff8fc4', '#8fd0ff', '#b48cf0'];
    for (let tx = 1; tx < this.level.w - 2; tx += 2) {
      if (puerta.some((d) => tx + 2 >= d && tx <= d + 1)) continue;
      const xa = tx * TILE, xb = (tx + 2) * TILE;
      ctx.strokeStyle = '#d9c6f2'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(xa, y0); ctx.quadraticCurveTo((xa + xb) / 2, y0 + 12, xb, y0); ctx.stroke();
      // una estrellita colgando en medio y dos lucecitas
      const k = tx / 2 | 0, cx = (xa + xb) / 2, cy = y0 + 8;
      ctx.fillStyle = colores[k % colores.length];
      ctx.beginPath();
      for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 2.4 : 5.4; ctx.lineTo(cx + Math.cos(a) * r, cy + 6 + Math.sin(a) * r); }
      ctx.closePath(); ctx.fill();
      for (const [u, j] of [[0.25, 0], [0.75, 1]]) {
        const lx = xa + (xb - xa) * u, ly = y0 + 12 * 2 * u * (1 - u) * 1.5;
        const on = Math.sin(tt * 3 + k * 1.7 + j * 2) > -0.2;
        ctx.fillStyle = on ? colores[(k + j + 1) % colores.length] : 'rgba(255,255,255,0.25)';
        ctx.beginPath(); ctx.arc(lx, ly + 2, on ? 2.6 : 1.8, 0, Math.PI * 2); ctx.fill();
      }
    }
    // almohadas y peluchitos por el suelo
    const almohada = (tx, ty, c, c2) => {
      const x = tx * TILE + TILE / 2, y = ty * TILE + TILE / 2 + 4;
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(x + 2, y + 9, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, 15, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(x - 4, y - 3, 7, 3, -0.2, 0, Math.PI * 2); ctx.fill();
      for (const s of [-1, 1]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + s * 14, y + s * 6, 3, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(x - s * 14, y + s * 6, 3, 0, Math.PI * 2); ctx.fill(); }
    };
    almohada(1.6, 6, '#ffb3d1', '#ffe0ee'); almohada(8, 10, '#9fd0ff', '#d9efff'); almohada(14, 10, '#c9b3ff', '#ece3ff'); almohada(25, 6.5, '#fff0a0', '#fffbe0');
    const peluches = [['peluche-carot', 2, 7], ['osito-gigante', 10, 10], ['peluche-froggy', 15.4, 10], ['peluche-jely', 25, 7.6]];   // sin el de Chop: sería un spoiler (Elora)
    for (const [id, tx, ty] of peluches) drawAdorno(ctx, id, tx * TILE + TILE / 2, ty * TILE + TILE / 2 - 2, id === 'osito-gigante' ? 26 : 30, tt);
  }

  // El árbol de Navidad (Elora). Es el del minijuego (idea de su padre): empieza vacío y lleva lo que tú le pongas
  // (los adornos, las luces y la punta). Grande, mucho más alto que los personajes (Elora).
  drawArbol(ctx, x, y) {
    drawArbolCompleto(ctx, x, y, 2.5, this.cb.arbol ? this.cb.arbol() : null, this.time);
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
    if (this.near) { ctx.font = `bold 20px ${font}`; ctx.fillStyle = '#ffe36b'; ctx.fillText(t({ tarda: 'lobby.talk', tapes: 'lobby.tapes', adviento: 'lobby.adviento', cartel: 'lobby.cartel', cartelRopa: 'lobby.cartel', cartelNav: 'lobby.cartel', arbol: 'lobby.arbol', almohadas: 'lobby.almohadas' }[this.near]), VIEW_W / 2, yy); yy -= 30; }
    else { ctx.font = `16px ${font}`; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(t('lobby.door'), VIEW_W / 2, yy); yy -= 30; }
    this.renderMessages(ctx, yy, font);
    ctx.restore();
  }
}
