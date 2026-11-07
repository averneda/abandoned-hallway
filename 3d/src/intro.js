// Cinemática provisional: el personaje camina por una calle normal hasta un cartel.
// Sin voces, solo imagen. La versión definitiva la diseñará Elora.

import { VIEW_W, VIEW_H } from './config.js';
import { drawCharacter } from './characters.js';
import { t } from './i18n.js';

export class Intro {
  constructor(character, onDone) {
    this.ch = character;
    this.onDone = onDone;
    this.time = 0;
    this.duration = 7.5;
    this.finished = false;
  }

  update(dt, input) {
    if (this.finished) return;
    this.time += dt;
    if (input.wasPressed('interact') || input.wasPressed('jump') || this.time >= this.duration) {
      this.finished = true;
      this.onDone();
    }
  }

  render(ctx) {
    const tm = this.time;
    // cielo de noche
    const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    sky.addColorStop(0, '#0a0d1f'); sky.addColorStop(1, '#2a2540');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 40; i++) { const x = (i * 197) % VIEW_W, y = (i * 89) % 260; ctx.globalAlpha = 0.4 + Math.sin(tm * 2 + i) * 0.3; ctx.fillRect(x, y, 2, 2); }
    ctx.globalAlpha = 1;
    // edificios
    for (let i = 0; i < 9; i++) {
      const w = 90 + (i * 37) % 60, h = 160 + (i * 71) % 140, x = i * 110 - 20;
      ctx.fillStyle = i % 2 ? '#1a1c2b' : '#222437'; ctx.fillRect(x, 360 - h, w, h);
      ctx.fillStyle = '#e9d27a';
      for (let wy = 0; wy < h - 30; wy += 34) for (let wx = 12; wx < w - 16; wx += 26) if ((wx * 3 + wy * 7 + i) % 5 < 2) ctx.fillRect(x + wx, 360 - h + 14 + wy, 12, 16);
    }
    // acera y calle
    ctx.fillStyle = '#6d6f78'; ctx.fillRect(0, 360, VIEW_W, 70);
    ctx.fillStyle = '#2b2b31'; ctx.fillRect(0, 430, VIEW_W, VIEW_H - 430);
    ctx.fillStyle = '#c9c46a';
    for (let x = 0; x < VIEW_W; x += 80) ctx.fillRect(x, 512, 40, 6);
    // farola
    ctx.fillStyle = '#3a3d47'; ctx.fillRect(300, 200, 8, 165);
    ctx.fillStyle = '#fff2b0'; ctx.shadowColor = '#fff2b0'; ctx.shadowBlur = 30; ctx.fillRect(292, 190, 24, 12); ctx.shadowBlur = 0;
    // cartel
    const signX = 720;
    ctx.fillStyle = '#4a3b2a'; ctx.fillRect(signX - 4, 250, 8, 115);
    ctx.fillStyle = '#e9e2c9'; ctx.fillRect(signX - 100, 210, 200, 70);
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3; ctx.strokeRect(signX - 100, 210, 200, 70);
    ctx.fillStyle = '#7a1018'; ctx.font = 'bold 16px "Segoe UI", Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const lines = t('intro.sign').split('\n');
    lines.forEach((l, i) => ctx.fillText(l, signX, 233 + i * 24));
    // personaje caminando
    const walkEnd = 5.2;
    const prog = Math.min(1, tm / walkEnd);
    const px = 80 + (signX - 60 - 80) * prog, py = 400;
    ctx.save(); ctx.translate(px, py); ctx.scale(2.2, 2.2);
    drawCharacter(ctx, this.ch, 0, 0, prog < 1 ? 'right' : 'up', prog < 1 ? tm * 10 : 0, 0, false);
    ctx.restore();
    // signo de interrogación al llegar
    if (tm > walkEnd + 0.4) {
      ctx.fillStyle = '#fff'; ctx.font = 'bold 36px "Segoe UI", Arial';
      ctx.fillText('?', px + 30, py - 90 + Math.sin(tm * 4) * 4);
    }
    // fundido a negro
    const fade = Math.max(0, (tm - (this.duration - 1.2)) / 1.2);
    if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, fade)})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }
    const fadeIn = Math.max(0, 1 - tm / 0.8);
    if (fadeIn > 0) { ctx.fillStyle = `rgba(0,0,0,${fadeIn})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  }
}
