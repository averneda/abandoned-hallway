// Personajes jugables. Carot y Froggy se dibujan a partir de sus fichas de Elora; el resto son
// dibujos provisionales (formas simples) hasta que lleguen sus fichas.
// Los Bloodies son las versiones "rotas y sangrando" de estos mismos personajes.
//
// stats (Elora): Velocidad, Cordura y Sigilo, de 0 a 100. Con 50 el personaje es "normal".
// Cómo afecta cada uno al juego: STAT_EFFECTS en src/config.js.
// ficha: la foto de la ficha de Elora, con los colores avivados (sale en la tienda de Tarda).
//   La original está en assets/referencias/personajes/; se aviva con tools-fichas/avivar.sh.
//   Si un personaje no tiene ficha, se hace una de papel.

// Azul fosforito de la pintura de Caty (el mismo azul que su mancha de la cara, pero brillante).
export const PINTURA_KATY = '#3ad6ff';
export const PINTURA_KATY_CLARO = '#9fefff';

const S50 = { velocidad: 50, cordura: 50, sigilo: 50 };   // todos a 50 de momento (Elora los ajustará)

export const CHARACTERS = [
  { id: 'carot', name: 'Carot', species: { es: 'Coneja', en: 'Rabbit' }, color: '#f2b38e', dark: '#c47d5a', shape: 'carot', price: 0, ability: 'carot',
    stats: { ...S50 }, ficha: 'assets/sprites/fichas/carot.webp' },
  { id: 'froggy', name: 'Froggy', species: { es: 'Rana', en: 'Frog' }, color: '#7cc36a', dark: '#3f7f3a', shape: 'frog', price: 0, ability: null,
    stats: { ...S50 }, ficha: 'assets/sprites/fichas/froggy.webp' },
  { id: 'oct', name: 'Oct', species: { es: 'Pulpo', en: 'Octopus' }, color: '#5b8fe0', dark: '#3a62ad', shape: 'octopus', price: 30, ability: 'oct', stats: { ...S50 } },
  { id: 'tarda', name: 'Tarda', species: { es: 'Tardígrado', en: 'Tardigrade' }, color: '#a9d68b', dark: '#6f9f57', shape: 'tardigrade', price: 60, ability: 'tarda', stats: { ...S50 } },
  { id: 'gek', name: 'Gec', species: { es: 'Lagarto', en: 'Lizard' }, color: '#6fc94a', dark: '#3f8a2a', shape: 'lizard', price: 80, ability: 'gek', stats: { ...S50 } },
  { id: 'drake', name: 'Drake', species: { es: 'Dragón', en: 'Dragon' }, color: '#ee7a4a', dark: '#b64c26', shape: 'dragon', price: 100, ability: 'drake', stats: { ...S50 } },
  { id: 'draila', name: 'Draila', species: { es: 'Cocodrilo', en: 'Crocodile' }, color: '#3f8f5a', dark: '#245c38', shape: 'crocodile', price: 120, ability: 'draila', stats: { ...S50 } },
  { id: 'katy', name: 'Caty', species: { es: 'Gata', en: 'Cat' }, color: '#d8d2cc', dark: '#9a938c', shape: 'cat', price: 140, ability: 'katy', stats: { ...S50 } },
  { id: 'jely', name: 'Jely', species: { es: 'Medusa', en: 'Jellyfish' }, color: '#e7a3e0', dark: '#b06aa8', shape: 'jellyfish', price: 160, ability: null, stats: { ...S50 } },
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

  if (OWN_DRAW[ch.shape]) {
    // personajes con dibujo propio, hecho a partir de la ficha de Elora
    OWN_DRAW[ch.shape](ctx, pal, facing, walk, opts);
  } else {
    // cola / detalles traseros según el animal
    if (ch.shape === 'dragon' && opts.flap != null && !opts.bloody) {
      // volando: alas grandes que baten
      ctx.strokeStyle = dark; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, 6); ctx.quadraticCurveTo(12, 14, 18, 6); ctx.stroke();
      const f = Math.sin(opts.flap);
      ctx.fillStyle = dark;
      for (const side of [-1, 1]) {
        ctx.beginPath(); ctx.moveTo(side * 10, -8);
        ctx.lineTo(side * (30 + f * 4), -22 + f * 12);
        ctx.lineTo(side * (26 + f * 3), -4 + f * 6);
        ctx.lineTo(side * 11, 3); ctx.closePath(); ctx.fill();
      }
    } else if (ch.shape === 'dragon') {
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
    if (ch.shape === 'jellyfish') {
      // tentáculos finos que ondulan (a los Bloodies les falta uno)
      ctx.strokeStyle = dark; ctx.lineWidth = 2; ctx.lineCap = 'round';
      for (let i = -2; i <= 2; i++) {
        if (opts.bloody && i === 2) continue;
        const w = Math.sin(walk * 0.9 + i * 1.3) * 3;
        ctx.beginPath(); ctx.moveTo(i * 4, 6);
        ctx.bezierCurveTo(i * 4 + w, 12, i * 5 - w, 17, i * 5 + w * 0.6, 23);
        ctx.stroke();
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
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(-12, i * 5 + 2, 2.2, 0, Math.PI * 2); ctx.moveTo(14.2, i * 5 + 2); ctx.arc(12, i * 5 + 2, 2.2, 0, Math.PI * 2); ctx.fill(); }
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
    if (ch.shape === 'jellyfish') {
      // campana translúcida sobre la cabeza, con el borde ondulado y un brillo
      ctx.save();
      ctx.globalAlpha *= 0.75;
      ctx.fillStyle = opts.bloody ? '#d23a44' : '#f6c9f1';
      ctx.beginPath(); ctx.arc(hx, hy - 1, 12.5, Math.PI, 0); ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.fillStyle = dark;
      for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.arc(hx + i * 5, hy - 0.5, 2.3, 0, Math.PI); ctx.fill(); }
      if (!opts.bloody) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath(); ctx.ellipse(hx - 5, hy - 8, 2.2, 3.5, -0.6, 0, Math.PI * 2); ctx.fill();
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
      ctx.beginPath(); ctx.arc(hx + ex - 3.5, hy + 1, big, 0, Math.PI * 2); ctx.moveTo(hx + ex + 3.5 + big, hy + 1); ctx.arc(hx + ex + 3.5, hy + 1, big, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = opts.bloody ? '#7a0b12' : '#222';
      if (opts.bloody) {
        ctx.beginPath(); ctx.ellipse(hx + ex - 3.5 + ex * 0.3, hy + 1.3, 1, 2.2, 0, 0, Math.PI * 2); ctx.moveTo(hx + ex + 4.5 + ex * 0.3, hy + 1.3); ctx.ellipse(hx + ex + 3.5 + ex * 0.3, hy + 1.3, 1, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        // lágrima de sangre
        ctx.fillStyle = '#e02330'; ctx.fillRect(hx + ex - 4.2, hy + 3, 1.4, 4);
        // cejas enfadadas al perseguir
        if (chasing) {
          ctx.strokeStyle = '#2a0306'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(hx + ex - 7, hy - 4); ctx.lineTo(hx + ex - 1, hy - 1.5); ctx.moveTo(hx + ex + 7, hy - 4); ctx.lineTo(hx + ex + 1, hy - 1.5); ctx.stroke();
        }
      } else {
        ctx.beginPath(); ctx.arc(hx + ex - 3.5 + ex * 0.3, hy + 1.3, 1.2, 0, Math.PI * 2); ctx.moveTo(hx + ex + 4.7 + ex * 0.3, hy + 1.3); ctx.arc(hx + ex + 3.5 + ex * 0.3, hy + 1.3, 1.2, 0, Math.PI * 2); ctx.fill();
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
  // pintura fosforita de Caty: el Bloodie brilla en azul, el color de la mancha de Caty
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

// ---------------------------------------------------------------------------
// Personajes con dibujo propio, pasados a código a partir de las fichas de Elora
// (assets/referencias/personajes/). Mismo sistema de medidas que drawCharacter:
// (0,0) es el centro del cuerpo, los pies en y≈12 y la cabeza encima.

// Un círculo relleno (cada uno con su propio trazo: así no hay líneas fantasma entre ellos).
function dot(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

// Rectángulo con las esquinas redondeadas (la función del navegador para esto no existe en los algo viejos).
function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Grietas, mancha y lágrima de sangre de los Bloodies con dibujo propio.
function bloodyMarks(ctx, hx, hy, facing) {
  ctx.strokeStyle = '#2a0306'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-5, -3); ctx.lineTo(-2, 1); ctx.lineTo(-4, 5); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx + 4, hy - 7); ctx.lineTo(hx + 2, hy - 3); ctx.lineTo(hx + 5, hy - 1); ctx.stroke();
  ctx.fillStyle = '#e02330';
  dot(ctx, 5, 2, 2.2);
  if (facing !== 'up') ctx.fillRect(hx - 4.2, hy + 3, 1.4, 4);
}

// Carot (ficha de Elora): coneja color melocotón con vestido rosa con corazones,
// collar de corazones, un lazo grande, una oreja tiesa y otra caída (las dos del color del cuerpo),
// pompón de cola, un bolsito colgado y cara triste.
function drawCarot(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const dress = B ? '#5e0810' : '#ef9cc0', dressDark = B ? '#3a0408' : '#c4587f';
  const bow = B ? '#7a0b12' : '#d63a7a';
  const tail = B ? '#c9a0a0' : '#fff7f0';
  const ex = facing === 'left' ? -3 : facing === 'right' ? 3 : 0;
  const hx = ex, hy = back ? -15 : -14;
  const step = Math.sin(walk) * 1.5;

  // pompón (detrás si mira de frente)
  if (!back) { ctx.fillStyle = tail; dot(ctx, -10, 5, 3); }
  // piernas y pies
  ctx.fillStyle = skin;
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.6 : 0;
    ctx.fillRect(side * 3.5 - 1.6, 4, 3.2, 7 + lift);
    ctx.beginPath(); ctx.ellipse(side * 4, 11 + lift, 3, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  }
  // brazos: de Bloodie, colgando o arriba al perseguir
  if (B) {
    ctx.strokeStyle = skinDark; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 5 : 2);
      ctx.beginPath(); ctx.moveTo(side * 6, -4);
      if (chasing) ctx.lineTo(side * 14 + sw, -18 + Math.abs(sw)); else ctx.lineTo(side * 10 + sw * 0.5, 6);
      ctx.stroke();
    }
  }
  // vestido trapecio con la tira de corazones abajo
  ctx.fillStyle = dress;
  ctx.beginPath(); ctx.moveTo(-6, -7); ctx.lineTo(6, -7); ctx.lineTo(11, 7); ctx.lineTo(-11, 7); ctx.closePath(); ctx.fill();
  ctx.fillStyle = dressDark;
  ctx.beginPath(); ctx.moveTo(-9.9, 4); ctx.lineTo(9.9, 4); ctx.lineTo(11, 7); ctx.lineTo(-11, 7); ctx.closePath(); ctx.fill();
  if (!B) { ctx.fillStyle = '#ffd6e6'; for (let x = -8; x <= 8; x += 4) ctx.fillRect(x - 0.6, 5, 1.2, 1.2); }
  if (!back) {
    // un brazo cruzado sobre la tripa (como en el dibujo) y el bolsito colgado
    if (!B) {
      ctx.strokeStyle = skin; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-6, -5); ctx.quadraticCurveTo(-7, 1, -1, 1); ctx.stroke();
    }
    ctx.strokeStyle = dressDark; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(4, -7); ctx.lineTo(7.5, 0); ctx.stroke();
    ctx.fillStyle = B ? '#2a0306' : '#9b3f62';
    ctx.fillRect(6, 0, 4, 3.5);
  } else {
    ctx.fillStyle = tail; dot(ctx, 0, 4, 3);
  }
  // collar de corazones
  ctx.fillStyle = dressDark; ctx.fillRect(-5, -8.5, 10, 2.5);
  if (!B) { ctx.fillStyle = '#ffd6e6'; for (let x = -3; x <= 3; x += 3) ctx.fillRect(x - 0.5, -7.8, 1, 1); }
  // orejas: la de la derecha tiesa, la de la izquierda caída; las dos del color del cuerpo
  // (Elora: en la ficha la caída salió más naranja por error)
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(hx + 4, hy - 11, 3, 8, 0.2, 0, Math.PI * 2); ctx.fill();
  if (!B) { ctx.fillStyle = '#f7c9b0'; ctx.beginPath(); ctx.ellipse(hx + 4.3, hy - 11, 1.4, 5.5, 0.2, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(hx - 7, hy - 8, 2.8, 6.5, -0.9, 0, Math.PI * 2); ctx.fill();
  // cabeza
  ctx.fillStyle = skin; dot(ctx, hx, hy, 9.5);
  // lazo grande arriba a la izquierda
  ctx.fillStyle = bow;
  ctx.beginPath(); ctx.ellipse(hx - 7.5, hy - 7, 4, 3, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx - 1.5, hy - 9.5, 3.6, 3, 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = B ? '#3a0408' : '#a3245a'; dot(ctx, hx - 4.5, hy - 8.3, 1.7);
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // cara triste: ojos grandes, cejas preocupadas, naricita y boca hacia abajo
  const eyeC = B ? (chasing ? '#ffe36b' : '#7a0b12') : '#2a2226';
  for (const side of [-1, 1]) {
    ctx.fillStyle = eyeC; dot(ctx, hx + side * 3.6, hy + 1, 2.3);
    if (!B) { ctx.fillStyle = '#fff'; dot(ctx, hx + side * 3.6 + 0.7, hy + 0.3, 0.7); }
  }
  ctx.strokeStyle = B ? '#2a0306' : '#5a3a3a'; ctx.lineWidth = 1; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    // cejas: tristes (el lado de dentro más alto); de Bloodie que persigue, enfadadas
    ctx.beginPath();
    if (B && chasing) { ctx.moveTo(hx + side * 6.5, hy - 3.5); ctx.lineTo(hx + side * 1.5, hy - 1.5); }
    else { ctx.moveTo(hx + side * 6.2, hy - 2); ctx.lineTo(hx + side * 2, hy - 4); }
    ctx.stroke();
  }
  ctx.fillStyle = B ? '#2a0306' : '#5a3a3a'; dot(ctx, hx, hy + 4, 0.7);
  ctx.beginPath(); ctx.arc(hx, hy + 7.6, 1.9, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
}

// Froggy (ficha de Elora): rana verde con la cabeza ancha y plana, los ojos en los dos
// bultitos de encima, una naricita de dos puntos, una sonrisa enorme llena de dientes, el cuerpo
// alto como una caja, brazos largos con deditos y las piernas dobladas.
function drawFroggy(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const teeth = B ? '#e8d8c0' : '#f6f3e8', line = B ? '#2a0306' : '#26331f';
  const ex = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
  const hx = ex, hy = -14;
  const step = Math.sin(walk) * 1.5;

  // piernas dobladas
  ctx.strokeStyle = skin; ctx.lineWidth = 3.6; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.6 : 0;
    ctx.beginPath(); ctx.moveTo(side * 4, 5); ctx.quadraticCurveTo(side * 9, 8, side * 6, 11 + lift); ctx.stroke();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(side * 7, 11.5 + lift, 3.4, 1.7, 0, 0, Math.PI * 2); ctx.fill();
  }
  // colita (el triangulito de abajo del dibujo)
  ctx.fillStyle = skinDark;
  ctx.beginPath(); ctx.moveTo(-6, 4); ctx.lineTo(-10, 8); ctx.lineTo(-5.5, 7.5); ctx.closePath(); ctx.fill();
  // brazos largos y curvos con deditos (de Bloodie que persigue, arriba)
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.5);
    const hand = chasing ? [side * 15 + sw, -17 + Math.abs(sw)] : [side * 14 + sw * 0.4, 3];
    ctx.strokeStyle = skin; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(side * 6, -5); ctx.quadraticCurveTo(side * 15, chasing ? -8 : -6, hand[0], hand[1]); ctx.stroke();
    ctx.fillStyle = skinDark;
    for (let k = -1; k <= 1; k++) dot(ctx, hand[0] + k * 1.6, hand[1] + (chasing ? -1.6 : 1.8), 1.1);
  }
  // camiseta larga azul verdoso con mangas cortas (Elora), que tapa todo el cuerpo hasta las piernas
  const shirt = B ? '#5e0810' : '#6fd0c4', shirtDark = B ? '#3a0408' : '#3f9e93';
  ctx.fillStyle = shirt;
  rrect(ctx, -7, -8, 14, 15, 3); ctx.fill();
  ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = shirtDark; ctx.fillRect(4, -7, 2.5, 13); ctx.restore();
  ctx.fillStyle = shirt;
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 5 : -9, -8, 4, 4.5);
  ctx.strokeStyle = shirtDark; ctx.lineWidth = 0.8;
  for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side > 0 ? 9 : -9, -3.5); ctx.lineTo(side > 0 ? 5.5 : -5.5, -3.5); ctx.stroke(); }
  // cuello de la camiseta
  ctx.beginPath(); ctx.moveTo(-3, -8); ctx.lineTo(0, -5.5); ctx.lineTo(3, -8); ctx.stroke();
  // los ojos van en los dos bultitos de encima de la cabeza (Elora)
  for (const side of [-1, 1]) {
    ctx.fillStyle = skin; dot(ctx, hx + side * 6.5, hy - 5.5, 3.4);
    if (back) continue;
    ctx.fillStyle = B ? (chasing ? '#ffe36b' : '#f0d0c8') : '#fff'; dot(ctx, hx + side * 6.5, hy - 5.8, 2.2);
    ctx.fillStyle = B ? '#7a0b12' : line; dot(ctx, hx + side * 6.5 + ex * 0.5, hy - 5.6, 1.1);
  }
  // cabeza ancha y plana
  ctx.fillStyle = skin;
  rrect(ctx, hx - 12, hy - 6, 24, 12, 5); ctx.fill();
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // la sonrisa enorme llena de dientes
  ctx.fillStyle = teeth;
  rrect(ctx, hx - 11, hy + 0.5, 22, 5, 2.5); ctx.fill();
  ctx.strokeStyle = line; ctx.lineWidth = 0.8; ctx.stroke();
  ctx.beginPath();
  for (let x = -7.5; x <= 7.5; x += 3.75) { ctx.moveTo(hx + x, hy + 0.7); ctx.lineTo(hx + x, hy + 5.3); }
  ctx.stroke();
  // la naricita: dos puntitos en el medio de la cara (Elora)
  ctx.fillStyle = B ? '#2a0306' : skinDark;
  for (const side of [-1, 1]) dot(ctx, hx + ex * 0.4 + side * 1.4, hy - 2.4, 0.6);
}

const OWN_DRAW = { carot: drawCarot, frog: drawFroggy };
