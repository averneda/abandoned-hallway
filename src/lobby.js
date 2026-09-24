// El lobby: una sala tranquila donde Tarda vende personajes, hay una estantería con tus cintas
// y una puerta para entrar a los pasillos.

import { TILE, VIEW_W, VIEW_H, PLAYER, ABILITIES } from './config.js';
import { T, loadMap, setTile } from './level.js';
import { LOBBY } from './maps.js';
import { Game, dist } from './game.js';
import { drawCharacter, characterById } from './characters.js';
import { t } from './i18n.js';
import { sfx } from './sound.js';

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
      this.cb.onCoin(1);
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

    // estantería con cintas
    const total = this.cb.totalTapes();
    for (let i = 0; i < this.shelf.length; i++) {
      const v = this.shelf[i];
      const x = v.tx * TILE, y = v.ty * TILE;
      ctx.fillStyle = '#4a3220'; ctx.fillRect(x, y - 6, TILE, TILE + 6);
      ctx.fillStyle = '#6b4a2b'; ctx.fillRect(x + 2, y - 4, TILE - 4, 3); ctx.fillRect(x + 2, y + 13, TILE - 4, 3);
      for (let k = 0; k < 2; k++) {
        const idx = i * 2 + k;
        if (idx < total) {
          ctx.fillStyle = '#1c1c22'; ctx.fillRect(x + 4 + k * 13, y + 1, 11, 10);
          ctx.fillStyle = '#e8e2c8'; ctx.fillRect(x + 6 + k * 13, y + 4, 7, 3);
        }
      }
      if (total > this.shelf.length * 2 && i === this.shelf.length - 1) {
        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px "Segoe UI", Arial'; ctx.textAlign = 'center';
        ctx.fillText('+' + (total - this.shelf.length * 2), x + TILE / 2, y + 27);
      }
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
