// El lobby: una sala tranquila donde Tarda vende personajes, hay una caja de cartón con tus cintas
// (y la tele en pequeñito al lado; antes era una estantería)
// y una puerta para entrar a los pasillos.

import { TILE, VIEW_W, VIEW_H, PLAYER, ABILITIES } from './config.js';
import { T, loadMap, setTile } from './level.js';
import { LOBBY } from './maps.js';
import { Game, dist } from './game.js';
import { drawCharacter, characterById } from './characters.js';
import { t } from './i18n.js';
import { sfx } from './sound.js';
import { coinValue } from './coins.js';

export class Lobby extends Game {
  // callbacks: { onPause(), onShop(), onTapes(), onStart(), onCoin(n), totalCoins(), totalTapes(),
  //              practiceTaken: Set con las monedas de práctica ya cogidas }
  constructor(character, callbacks) {
    super(character, loadMap('lobby', LOBBY), callbacks);
    // Las monedas de práctica ya cogidas no vuelven hasta que escapes de un pasillo.
    this.level.items.forEach((it, i) => { if (callbacks.practiceTaken.has(i)) it.taken = true; });
    const m = this.level.markers;
    // La Tarda de la tienda es amarilla, para distinguirla de la Tarda personaje (verde). Decidido por Elora.
    this.tarda = { ...characterById('tarda'), color: '#e8c840', dark: '#b89820' };
    this.npc = m.N[0];
    this.shelf = m.V;
    this.doors = m.D;
    // la estantería es sólida
    for (const v of this.shelf) setTile(this.level, v.tx, v.ty, T.WALL);
    this.enemies = [];
    this.near = null;
    this.player.facing = 'up';
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
    if (this.near && input.wasPressed('interact')) {
      if (this.near === 'tarda') this.cb.onShop(); else this.cb.onTapes();
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
    const total = this.cb.totalTapes();
    if (this.shelf.length) {
      const v0 = this.shelf[0], vN = this.shelf[this.shelf.length - 1];
      // la tele a la izquierda y la caja a la derecha (Elora)
      this.drawMiniTV(ctx, v0.tx * TILE + 30, v0.ty * TILE + TILE - 2);
      this.drawTapeBox(ctx, (vN.tx * TILE + TILE) - TILE / 2 - 4, vN.ty * TILE + TILE - 2, total);
    }

    // mostrador de Tarda
    const nx = this.npc.x, ny = this.npc.y;
    ctx.fillStyle = '#4a3220'; ctx.fillRect(nx - 30, ny + 10, 60, 14);
    ctx.fillStyle = '#6b4a2b'; ctx.fillRect(nx - 30, ny + 8, 60, 4);
    ctx.fillStyle = '#ffd95a'; ctx.beginPath(); ctx.ellipse(nx + 18, ny + 12, 6, 4, 0, 0, Math.PI * 2); ctx.fill();

    // actores ordenados por altura
    const actors = [
      { y: ny, draw: () => drawCharacter(ctx, this.tarda, nx, ny, 'down', this.time * 2, 0, false) },
      { y: p.y, draw: () => this.drawPlayer(ctx) },
    ];
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
    ctx.fillStyle = '#e8e2c8';
    ctx.fillText(`${t('hud.tapes')}: ${this.cb.totalTapes()}`, VIEW_W - 18, 40);
    // avisos
    ctx.textAlign = 'center';
    let yy = VIEW_H - 40;
    if (this.near) { ctx.font = `bold 20px ${font}`; ctx.fillStyle = '#ffe36b'; ctx.fillText(t(this.near === 'tarda' ? 'lobby.talk' : 'lobby.tapes'), VIEW_W / 2, yy); yy -= 30; }
    else { ctx.font = `16px ${font}`; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillText(t('lobby.door'), VIEW_W / 2, yy); yy -= 30; }
    this.renderMessages(ctx, yy, font);
    ctx.restore();
  }
}
