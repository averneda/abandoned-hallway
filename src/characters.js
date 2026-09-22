// Personajes jugables. Los dibujos son provisionales (formas simples); se sustituirán por sprites hechos a partir de los dibujos de Elora.
// Los Bloodies son las versiones "rotas y sangrando" de estos mismos personajes.

// Azul fosforito de la pintura de Katy (el mismo azul que su mancha de la cara, pero brillante).
export const PINTURA_KATY = '#3ad6ff';
export const PINTURA_KATY_CLARO = '#9fefff';

export const CHARACTERS = [
  { id: 'carot', name: 'Carot', species: { es: 'Conejo', en: 'Rabbit' }, color: '#e9d6b8', dark: '#b8977a', shape: 'rabbit', price: 0, ability: 'carot' },
  { id: 'oct', name: 'Oct', species: { es: 'Pulpo', en: 'Octopus' }, color: '#5b8fe0', dark: '#3a62ad', shape: 'octopus', price: 30, ability: 'oct' },
  { id: 'tarda', name: 'Tarda', species: { es: 'Tardígrado', en: 'Tardigrade' }, color: '#a9d68b', dark: '#6f9f57', shape: 'tardigrade', price: 60, ability: 'tarda' },
  { id: 'gek', name: 'Gek', species: { es: 'Lagarto', en: 'Lizard' }, color: '#6fc94a', dark: '#3f8a2a', shape: 'lizard', price: 80, ability: 'gek' },
  { id: 'drake', name: 'Drake', species: { es: 'Dragón', en: 'Dragon' }, color: '#ee7a4a', dark: '#b64c26', shape: 'dragon', price: 100, ability: null },
  { id: 'draila', name: 'Draila', species: { es: 'Cocodrilo', en: 'Crocodile' }, color: '#3f8f5a', dark: '#245c38', shape: 'crocodile', price: 120, ability: 'draila' },
  { id: 'katy', name: 'Katy', species: { es: 'Gata', en: 'Cat' }, color: '#d8d2cc', dark: '#9a938c', shape: 'cat', price: 140, ability: 'katy' },
];

export function characterById(id) { return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0]; }

const BLOODY = { color: '#a3141c', dark: '#5e0810' };

// Dibuja un personaje visto desde arriba/atrás (vista tres cuartos).
// facing: 'up' | 'down' | 'left' | 'right'.  walk: fase de animación.  jumpH: altura del salto en px.
// opts.bloody = versión Bloodie (rota y sangrando). opts.chasing = enfadado, brazos arriba. opts.frozen = parado por Oct.
export function drawCharacter(ctx, ch, x, y, facing = 'down', walk = 0, jumpH = 0, blink = false, opts = {}) {
  const chasing = !!opts.chasing;
  const bob = Math.sin(walk) * (chasing ? 2.5 : 1.5);
  const s = 1 - Math.min(jumpH, 40) / 110;
  const pal = opts.bloody ? BLOODY : ch;
  const body = pal.color, dark = pal.dark;
  ctx.save();
  // sombra
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(x, y + 10, 12 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();

  if (blink) ctx.globalAlpha = 0.45;
  ctx.translate(x, y - jumpH + bob);
  if (chasing) ctx.translate(Math.sin(walk * 3) * 1.2, 0); // temblor de rabia

  // charco y goteo de los Bloodies
  if (opts.bloody) {
    ctx.fillStyle = '#7a0b12';
    ctx.beginPath(); ctx.ellipse(0, 11, 13, 4, 0, 0, Math.PI * 2); ctx.fill();
    for (let i = -1; i <= 1; i++) {
      const drip = (Math.sin(walk * 0.3 + i * 2) + 1) * 3;
      ctx.beginPath(); ctx.ellipse(i * 7, 8 + drip, 2.5, 4 + drip * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    }
  }

  // cola / detalles traseros según el animal
  if (ch.shape === 'dragon') {
    ctx.strokeStyle = dark; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 6); ctx.quadraticCurveTo(12, 14, 18, 6); ctx.stroke();
    ctx.fillStyle = dark;
    ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(-24, -14); ctx.lineTo(-13, 2); ctx.closePath(); ctx.fill();
    // a los Bloodies les falta un trozo de ala
    if (!opts.bloody) { ctx.beginPath(); ctx.moveTo(12, -6); ctx.lineTo(24, -14); ctx.lineTo(13, 2); ctx.closePath(); ctx.fill(); }
    else { ctx.beginPath(); ctx.moveTo(12, -6); ctx.lineTo(19, -9); ctx.lineTo(13, 2); ctx.closePath(); ctx.fill(); }
  }
  if (ch.shape === 'cat') {
    // cola larga que se balancea
    ctx.strokeStyle = dark; ctx.lineWidth = 4; ctx.lineCap = 'round';
    const w = Math.sin(walk * 0.7) * 6;
    ctx.beginPath(); ctx.moveTo(0, 7); ctx.quadraticCurveTo(10 + w, 16, 14 + w, 6); ctx.stroke();
  }
  if (ch.shape === 'lizard' || ch.shape === 'crocodile') {
    // cola larga que se mueve
    ctx.strokeStyle = dark; ctx.lineWidth = ch.shape === 'crocodile' ? 6 : 4; ctx.lineCap = 'round';
    const w = Math.sin(walk * 0.8) * 5;
    ctx.beginPath(); ctx.moveTo(0, 7); ctx.quadraticCurveTo(8 + w, 16, 4 + w * 2, 24); ctx.stroke();
    if (ch.shape === 'crocodile') {
      // púas del lomo
      ctx.fillStyle = dark;
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * 5 - 2, -2 + i * 4); ctx.lineTo(i * 5, -7 + i * 4); ctx.lineTo(i * 5 + 2, -2 + i * 4); ctx.closePath(); ctx.fill(); }
    }
  }
  if (ch.shape === 'octopus') {
    ctx.strokeStyle = dark; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = -1.5; i <= 1.5; i++) {
      if (opts.bloody && i === 1.5) continue; // le falta un tentáculo
      const w = Math.sin(walk + i) * 3;
      ctx.beginPath(); ctx.moveTo(i * 6, 4); ctx.quadraticCurveTo(i * 8 + w, 12, i * 9, 16); ctx.stroke();
    }
  }
  // brazos de los Bloodies: colgando al patrullar, arriba y agitados al perseguir
  if (opts.bloody) {
    ctx.strokeStyle = dark; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 5 : 2);
      ctx.beginPath(); ctx.moveTo(side * 9, -3);
      if (chasing) ctx.lineTo(side * 16 + sw, -20 + Math.abs(sw));
      else ctx.lineTo(side * 12 + sw * 0.5, 8);
      ctx.stroke();
    }
  }
  // cuerpo
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.ellipse(0, 0, 11, 12, 0, 0, Math.PI * 2); ctx.fill();
  if (ch.shape === 'tardigrade') {
    ctx.strokeStyle = dark; ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(-9, i * 5); ctx.lineTo(9, i * 5); ctx.stroke(); }
    ctx.fillStyle = dark;
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(-12, i * 5 + 2, 2.2, 0, Math.PI * 2); ctx.arc(12, i * 5 + 2, 2.2, 0, Math.PI * 2); ctx.fill(); }
  }
  if (ch.shape === 'crocodile' && !opts.bloody) {
    // tripa clara
    ctx.fillStyle = '#c9dc9a'; ctx.beginPath(); ctx.ellipse(0, 3, 6, 7, 0, 0, Math.PI * 2); ctx.fill();
  }
  // cabeza
  const hx = facing === 'left' ? -3 : facing === 'right' ? 3 : 0;
  const hy = facing === 'up' ? -14 : -12;
  ctx.fillStyle = body;
  ctx.beginPath(); ctx.arc(hx, hy, 9.5, 0, Math.PI * 2); ctx.fill();
  if (ch.shape === 'crocodile') {
    // hocico largo con dientes, hacia donde mira
    const dx = facing === 'left' ? -1 : facing === 'right' ? 1 : 0;
    const dy = facing === 'down' ? 1 : 0;
    if (dx !== 0 || dy !== 0) {
      ctx.fillStyle = body;
      ctx.beginPath(); ctx.ellipse(hx + dx * 11, hy + 3 + dy * 6, dx !== 0 ? 8 : 6, dx !== 0 ? 4.5 : 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 3; i++) {
        const tx = dx !== 0 ? hx + dx * (7 + i * 4) : hx - 4 + i * 4;
        const ty = dx !== 0 ? hy + 6 : hy + 10 + dy * 3;
        ctx.beginPath(); ctx.moveTo(tx - 1.2, ty); ctx.lineTo(tx, ty + 3); ctx.lineTo(tx + 1.2, ty); ctx.closePath(); ctx.fill();
      }
    }
  }
  if (ch.shape === 'rabbit') {
    ctx.fillStyle = body; ctx.strokeStyle = dark; ctx.lineWidth = 1.5;
    for (const side of [-1, 1]) {
      // a los Bloodies se les dobla una oreja
      const bent = opts.bloody && side === 1;
      ctx.beginPath(); ctx.ellipse(hx + side * 5 + (bent ? 4 : 0), hy - (bent ? 8 : 14), 3.2, bent ? 6 : 9, side * (bent ? 1.1 : 0.15), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    }
    if (!opts.bloody) {
      // lazo rosa a un lado de la cabeza
      const bx = hx - 8, by = hy - 6;
      ctx.fillStyle = '#ff7eb6';
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - 6, by - 4); ctx.lineTo(bx - 5, by + 3); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 4, by - 5); ctx.lineTo(bx + 5, by + 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#e0508f'; ctx.beginPath(); ctx.arc(bx, by, 1.8, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (ch.shape === 'dragon') {
    ctx.fillStyle = opts.bloody ? '#d9c27a' : '#ffe08a';
    for (const side of [-1, 1]) {
      if (opts.bloody && side === -1) continue; // cuerno roto
      ctx.beginPath(); ctx.moveTo(hx + side * 4, hy - 7); ctx.lineTo(hx + side * 8, hy - 16); ctx.lineTo(hx + side * 8, hy - 6); ctx.closePath(); ctx.fill();
    }
    if (opts.bloody) { ctx.beginPath(); ctx.moveTo(hx - 4, hy - 7); ctx.lineTo(hx - 7, hy - 10); ctx.lineTo(hx - 8, hy - 6); ctx.closePath(); ctx.fill(); }
  }
  if (ch.shape === 'octopus') {
    ctx.fillStyle = dark;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(hx - 4 + i * 4, hy - 4 + (i % 2) * 2, 1.4, 0, Math.PI * 2); ctx.fill(); }
  }
  if (ch.shape === 'cat') {
    // orejas triangulares
    ctx.fillStyle = body;
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(hx + side * 3, hy - 8); ctx.lineTo(hx + side * 8, hy - 17); ctx.lineTo(hx + side * 10, hy - 5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#f0a8bc';
      ctx.beginPath(); ctx.moveTo(hx + side * 5, hy - 8); ctx.lineTo(hx + side * 7.5, hy - 13.5); ctx.lineTo(hx + side * 8.5, hy - 6.5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = body;
    }
    // mancha de pintura sobre un ojo (decidido por Elora)
    if (!opts.bloody) {
      ctx.save();
      ctx.beginPath(); ctx.arc(hx, hy, 9.5, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = '#4aa3e8';
      ctx.beginPath(); ctx.ellipse(hx - 4, hy + 0.5, 6.5, 6, 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx - 7.5, hy - 5, 3, 2.6, 0.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(hx - 2, hy + 6.5, 2.4, 2, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // goterón que cae por la cara
      ctx.fillStyle = '#4aa3e8';
      ctx.beginPath(); ctx.ellipse(hx - 5, hy + 8.5, 1.8, 3, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  if (ch.shape === 'lizard') {
    // cresta
    ctx.fillStyle = dark;
    for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(hx + i * 4 - 2, hy - 8); ctx.lineTo(hx + i * 4, hy - 14); ctx.lineTo(hx + i * 4 + 2, hy - 8); ctx.closePath(); ctx.fill(); }
  }
  // grietas de los Bloodies
  if (opts.bloody) {
    ctx.strokeStyle = '#2a0306'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-7, -4); ctx.lineTo(-3, 0); ctx.lineTo(-5, 5); ctx.lineTo(-1, 9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx + 3, hy - 9); ctx.lineTo(hx + 1, hy - 4); ctx.lineTo(hx + 4, hy - 1); ctx.stroke();
    ctx.fillStyle = '#e02330';
    ctx.beginPath(); ctx.arc(6, 3, 2.5, 0, Math.PI * 2); ctx.fill();
  }
  // cara (solo si no está de espaldas)
  if (facing !== 'up') {
    const ex = facing === 'left' ? -3 : facing === 'right' ? 3 : 0;
    const big = ch.shape === 'lizard' ? 3.4 : 2.6;
    ctx.fillStyle = chasing ? '#ffe36b' : '#fff';
    ctx.beginPath(); ctx.arc(hx + ex - 3.5, hy + 1, big, 0, Math.PI * 2); ctx.arc(hx + ex + 3.5, hy + 1, big, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = opts.bloody ? '#7a0b12' : '#222';
    if (opts.bloody) {
      ctx.beginPath(); ctx.ellipse(hx + ex - 3.5 + ex * 0.3, hy + 1.3, 1, 2.2, 0, 0, Math.PI * 2); ctx.ellipse(hx + ex + 3.5 + ex * 0.3, hy + 1.3, 1, 2.2, 0, 0, Math.PI * 2); ctx.fill();
      // lágrima de sangre
      ctx.fillStyle = '#e02330'; ctx.fillRect(hx + ex - 4.2, hy + 3, 1.4, 4);
      // cejas enfadadas al perseguir
      if (chasing) {
        ctx.strokeStyle = '#2a0306'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hx + ex - 7, hy - 4); ctx.lineTo(hx + ex - 1, hy - 1.5); ctx.moveTo(hx + ex + 7, hy - 4); ctx.lineTo(hx + ex + 1, hy - 1.5); ctx.stroke();
      }
    } else {
      ctx.beginPath(); ctx.arc(hx + ex - 3.5 + ex * 0.3, hy + 1.3, 1.2, 0, Math.PI * 2); ctx.arc(hx + ex + 3.5 + ex * 0.3, hy + 1.3, 1.2, 0, Math.PI * 2); ctx.fill();
      if (ch.shape === 'cat') {
        // naricita y bigotes
        ctx.fillStyle = '#f0a8bc';
        ctx.beginPath(); ctx.moveTo(hx + ex - 1.6, hy + 5); ctx.lineTo(hx + ex + 1.6, hy + 5); ctx.lineTo(hx + ex, hy + 7); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(80,74,70,0.85)'; ctx.lineWidth = 1;
        for (const side of [-1, 1]) for (let i = -1; i <= 1; i++) {
          ctx.beginPath(); ctx.moveTo(hx + ex + side * 3, hy + 5.5); ctx.lineTo(hx + ex + side * 11, hy + 4 + i * 2.5); ctx.stroke();
        }
      }
      if (ch.shape === 'octopus') {
        // gafas redondas
        ctx.strokeStyle = '#222'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(hx + ex - 3.5, hy + 1, 4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(hx + ex + 3.5, hy + 1, 4, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hx + ex - 0.5, hy + 1); ctx.lineTo(hx + ex + 0.5, hy + 1); ctx.stroke();
      }
    }
  }
  // la capa "Tun" de Tarda: una burbuja que gira y la hace inmortal
  if (opts.capa) {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = '#c9a3f0';
    ctx.beginPath(); ctx.ellipse(0, -5, 17, 21, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = '#efe0ff'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(0, -5, 17, 21, 0, 0, Math.PI * 2); ctx.stroke();
    // estrellitas girando
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) {
      const a = walk * 0.25 + i * Math.PI / 2;
      ctx.beginPath(); ctx.arc(Math.cos(a) * 17, -5 + Math.sin(a) * 21, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  // pintura fosforita de Katy: el Bloodie brilla en azul, el color de la mancha de Katy
  if (opts.pintado) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = PINTURA_KATY;
    ctx.shadowColor = PINTURA_KATY; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.ellipse(0, -4, 15, 19, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // goterones de pintura
    ctx.fillStyle = PINTURA_KATY_CLARO;
    for (let i = -1; i <= 1; i++) {
      const g2 = (Math.sin(walk * 0.4 + i * 2) + 1) * 2;
      ctx.beginPath(); ctx.ellipse(i * 6, 6 + g2, 2, 3.5, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  // hielo de Oct
  if (opts.frozen) {
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = '#9fe8ff';
    ctx.beginPath(); ctx.ellipse(0, -6, 16, 22, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = '#e6fbff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-10, -20); ctx.lineTo(-4, -8); ctx.lineTo(-9, 4); ctx.moveTo(8, -22); ctx.lineTo(4, -10); ctx.lineTo(10, 2); ctx.stroke();
  }
  ctx.restore();
}
