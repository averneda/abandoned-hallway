// Personajes jugables. Carot, Froggy, Oct, Caty y Gec se dibujan a partir de sus fichas de Elora; el resto son
// dibujos provisionales (formas simples) hasta que lleguen sus fichas.
// Los Bloodies son las versiones "rotas y sangrando" de estos mismos personajes.
//
// stats (Elora): Velocidad, Cordura y Sigilo, de 0 a 100. Con 50 el personaje es "normal".
// Cómo afecta cada uno al juego: STAT_EFFECTS en src/config.js.
// ficha: la foto de la ficha de Elora, con los colores avivados (sale en la tienda de Tarda).
// fichaCuadro: dónde van los parámetros en esa foto (en %: a la derecha de su raya y debajo del nombre).
//   La original está en assets/referencias/personajes/; se aviva con tools-fichas/avivar.sh.
//   Si un personaje no tiene ficha, se hace una de papel.

// Colores fosforito de la pintura de Caty (Elora): cada vez que usa su habilidad sale uno
// distinto. c: el color; claro: el de los goterones. El nombre de cada uno está en src/i18n.js
// ('paint.color.<id>').
export const PINTURAS_FOSFORITO = [
  { id: 'azul', c: '#3ad6ff', claro: '#9fefff' },
  { id: 'rosa', c: '#ff3ad6', claro: '#ffa3ee' },
  { id: 'verde', c: '#39ff6a', claro: '#a8ffbe' },
  { id: 'amarillo', c: '#f4ff3a', claro: '#fbffa8' },
  { id: 'naranja', c: '#ff8a1f', claro: '#ffc58f' },
  { id: 'lila', c: '#b56bff', claro: '#dcb8ff' },
];

// Los parámetros (stats, de 0 a 100; 50 = normal) y los corazones de cada personaje los eligió Elora
// en su menú de números (noviembre de 2026).

export const CHARACTERS = [
  { id: 'carot', name: 'Carot', species: { es: 'Coneja', en: 'Rabbit' }, color: '#f2b38e', dark: '#c47d5a', shape: 'carot', price: 0, ability: 'carot',
    stats: { velocidad: 70, cordura: 31, sigilo: 70, resistencia: 60 }, corazones: 3, ficha: 'assets/sprites/fichas/carot.webp',
    fichaCuadro: { left: 61.5, top: 26, right: 4, bottom: 5 } },
  { id: 'froggy', name: 'Froggy', species: { es: 'Rana', en: 'Frog' }, color: '#7cc36a', dark: '#3f7f3a', shape: 'frog', price: 0, ability: 'carot',   // Elora: el mismo salto grande que Carot
    stats: { velocidad: 30, cordura: 80, sigilo: 40, resistencia: 80 }, corazones: 3, ficha: 'assets/sprites/fichas/froggy.webp',
    fichaCuadro: { left: 63.5, top: 29, right: 4.5, bottom: 5 } },
  { id: 'oct', name: 'Oct', species: { es: 'Pulpo', en: 'Octopus' }, color: '#7fd0ec', dark: '#3d8db3', shape: 'octopus', price: 150, ability: 'oct',   // Oct es no binarie (Elora)
    stats: { velocidad: 53, cordura: 30, sigilo: 70, resistencia: 30 }, corazones: 3, ficha: 'assets/sprites/fichas/oct.webp',
    fichaCuadro: { left: 62, top: 23, right: 4, bottom: 5 } },
  { id: 'tarda', name: 'Tarda', species: { es: 'Tardígrado', en: 'Tardigrade' }, color: '#b07c52', dark: '#7a5232', shape: 'tardigrade', price: 50, ability: 'tarda',   // la que se compra es marrón; la de la tienda, gris (Elora)
    stats: { velocidad: 84, cordura: 60, sigilo: 60, resistencia: 30 }, corazones: 3, ficha: 'assets/sprites/fichas/tarda.webp',
    fichaCuadro: { left: 69.5, top: 25, right: 2.5, bottom: 4 } },
  { id: 'gek', name: 'Gec', species: { es: 'Lagarto', en: 'Lizard' }, color: '#98cc84', dark: '#5e9a4c', shape: 'lizard', price: 80, ability: 'gek',   // hermano adoptivo de Draila (Elora)
    stats: { velocidad: 80, cordura: 60, sigilo: 40, resistencia: 40 }, corazones: 3, ficha: 'assets/sprites/fichas/gek.webp',
    fichaCuadro: { left: 65.5, top: 33, right: 3, bottom: 5 } },
  { id: 'drake', name: 'Drake', species: { es: 'Dragón', en: 'Dragon' }, color: '#ee7a4a', dark: '#b64c26', shape: 'dragon', price: 200, secreto: true, ability: 'drake',   // sale en la tienda al escapar del pasillo 50 (Elora)
    stats: { velocidad: 100, cordura: 100, sigilo: 100, resistencia: 100 }, corazones: 5 },
  { id: 'draila', name: 'Draila', species: { es: 'Cocodrilo', en: 'Crocodile' }, color: '#3f8f5a', dark: '#245c38', shape: 'crocodile', price: 100, ability: 'draila', stats: { velocidad: 30, cordura: 60, sigilo: 50, resistencia: 40 }, corazones: 3 },
  { id: 'katy', name: 'Caty', species: { es: 'Gata', en: 'Cat' }, color: '#f08a3c', dark: '#c0561c', shape: 'cat', price: 150, ability: 'katy',
    pequena: true,   // más pequeña que los demás: tiene 7 u 8 años (Elora)
    stats: { velocidad: 80, cordura: 35, sigilo: 60, resistencia: 40 }, corazones: 3, ficha: 'assets/sprites/fichas/katy.webp',
    fichaCuadro: { left: 62.5, top: 25, right: 3, bottom: 5 } },
  { id: 'jely', name: 'Jely', species: { es: 'Medusa', en: 'Jellyfish' }, color: '#3f9fe0', dark: '#2a78b8', shape: 'jellyfish', price: 160, ability: 'jely',   // no tiene boca: habla lengua de signos (Elora)
    stats: { velocidad: 40, cordura: 60, sigilo: 30, resistencia: 75 }, corazones: 3, ficha: 'assets/sprites/fichas/jely.webp',
    fichaCuadro: { left: 65.5, top: 27, right: 2.5, bottom: 4 } },
  { id: 'hoppy', name: 'Hoppy', species: { es: 'Liebre', en: 'Hare' }, color: '#c49a7a', dark: '#93694c', shape: 'hare', price: 50, ability: 'hoppy',
    pequena: true,   // chica, más pequeña que los demás: tiene 7 u 8 años; enérgica, adoptada por humanos (Elora)
    stats: { velocidad: 80, cordura: 41, sigilo: 30, resistencia: 70 }, corazones: 3, ficha: 'assets/sprites/fichas/hoppy.webp',
    fichaCuadro: { left: 65.5, top: 26, right: 2.5, bottom: 4 } },
];

// La Tarda de verdad (la de la tienda del lobby y la que habla en las grabaciones) es gris, como la
// dibujó Elora; la Tarda que se compra es marrón (Elora).
export const TARDA_GRIS = { color: '#a9a8ad', dark: '#74737a' };

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

  // Caty y Hoppy son más pequeñas que los demás (7 u 8 años, Elora): se dibujan un poco más bajitas
  if (ch.pequena) { ctx.translate(0, 11); ctx.scale(0.86, 0.86); ctx.translate(0, -11); }

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
    if (ch.shape === 'crocodile') {
      // cola larga que se mueve
      ctx.strokeStyle = dark; ctx.lineWidth = 6; ctx.lineCap = 'round';
      const w = Math.sin(walk * 0.8) * 5;
      ctx.beginPath(); ctx.moveTo(0, 7); ctx.quadraticCurveTo(8 + w, 16, 4 + w * 2, 24); ctx.stroke();
      // púas del lomo
      ctx.fillStyle = dark;
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(i * 5 - 2, -2 + i * 4); ctx.lineTo(i * 5, -7 + i * 4); ctx.lineTo(i * 5 + 2, -2 + i * 4); ctx.closePath(); ctx.fill(); }
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
      const big = 2.6;
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
  // pintura fosforita de Caty: el Bloodie brilla del color que ha salido esta vez
  // (opts.pintado es uno de PINTURAS_FOSFORITO)
  if (opts.pintado) {
    const pin = opts.pintado.c ? opts.pintado : PINTURAS_FOSFORITO[0];
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = pin.c;
    ctx.shadowColor = pin.c; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.ellipse(0, -4, 15, 19, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // goterones de pintura
    ctx.fillStyle = pin.claro;
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
  // la cabeza no se mueve hacia los lados al andar a izquierda o derecha (Elora)
  const hx = 0, hy = back ? -15 : -14;
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

// Oct (ficha de Elora; Oct es no binarie): pulpo azul clarito con la cabeza redonda (en el juego
// sin cuello: Elora, así no es tan alte), unos tentáculos que le salen de la cara (Elora: no es un pico), gafas redondas, un coloretito en la
// mejilla, camiseta morada de "GAMER" con un mando dibujado, y abajo una falda de tentáculos
// con las ventosas amarillas. Los dos tentáculos-brazo van bajados e iguales (en la ficha uno está
// levantado porque saluda).
function drawOct(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const shirt = B ? '#5e0810' : '#9b6ad0', shirtDark = B ? '#3a0408' : '#6b3fa6';
  const sucker = B ? '#c9a0a0' : '#f3d65a';
  const line = B ? '#2a0306' : '#1f2a33';
  // hacia dónde apuntan los tentáculos de la cara: de frente, a la izquierda como en la ficha
  const dir = facing === 'right' ? 1 : -1;
  const ex = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
  const hx = ex, hy = -15;   // la cabeza va justo encima de la camiseta (sin cuello: Elora)

  // los dos tentáculos-brazo son iguales, uno a cada lado, bajados (Elora: en la ficha uno está
  // levantado solo porque saluda). De Bloodie que persigue, arriba y agitándolos.
  const brazo = (side, fase) => {
    const sw = Math.sin(walk * (chasing ? 2 : 0.8) + fase) * (chasing ? 3 : 1.2);
    const ctl = chasing ? [side * 15, -8] : [side * 13, -4];
    const end = chasing ? [side * 13 + sw, -24] : [side * 12 + sw * 0.4, 2];
    ctx.strokeStyle = skin; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(side * 6, -5); ctx.quadraticCurveTo(ctl[0], ctl[1], end[0], end[1]); ctx.stroke();
    ctx.fillStyle = sucker;
    for (const t of [0.55, 0.85]) {
      // ventosas a lo largo del tentáculo
      const u = 1 - t;
      const px = u * u * (side * 6) + 2 * u * t * ctl[0] + t * t * end[0];
      const py = u * u * (-5) + 2 * u * t * ctl[1] + t * t * end[1];
      dot(ctx, px - side * 1, py + 0.6, 0.9);
    }
  };

  // el brazo de atrás (detrás de la camiseta)
  brazo(-dir, 0);
  // falda de tentáculos con las puntas dobladas y las ventosas amarillas por debajo
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.moveTo(-6, 2); ctx.lineTo(6, 2); ctx.lineTo(11, 10); ctx.lineTo(-11, 10); ctx.closePath(); ctx.fill();
  for (const k of [-8.5, -3, 3, 8.5]) {
    const w = Math.sin(walk + k) * 1;
    ctx.fillStyle = sucker; ctx.beginPath(); ctx.ellipse(k + w + 0.8, 11.4, 2.4, 1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(k + w, 10.4, 3, 1.6, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.strokeStyle = skinDark; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(-3, 4); ctx.lineTo(-4.5, 9); ctx.moveTo(3, 4); ctx.lineTo(4.5, 9); ctx.stroke();
  // camiseta morada con mangas cortas
  ctx.fillStyle = shirt;
  rrect(ctx, -7, -9, 14, 12, 2.5); ctx.fill();
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 5 : -9.5, -9, 4.5, 4.5);
  ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = shirtDark; ctx.fillRect(3.5, -8, 3, 10); ctx.restore();
  ctx.strokeStyle = shirtDark; ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(-3, -9); ctx.quadraticCurveTo(0, -6.8, 3, -9); ctx.stroke();
  if (!back) {
    // el mando de la camiseta de "GAMER"
    ctx.fillStyle = B ? '#c9a0a0' : '#f4f4f8';
    rrect(ctx, -3.6, -5.2, 7.2, 3.6, 1.6); ctx.fill();
    ctx.fillStyle = line; dot(ctx, -1.8, -3.4, 0.6); dot(ctx, 1.6, -3.9, 0.45); dot(ctx, 2.4, -3, 0.45);
  }
  // el brazo de delante, igual que el otro
  brazo(dir, 1);
  // cabeza redonda
  ctx.fillStyle = skin; dot(ctx, hx, hy, 8);
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // los tentáculos de la boca (Elora: no es un pico): son dos, caídos hacia abajo, con la punta
  // un poco enroscada y una ventosa amarilla; se mueven al andar
  ctx.strokeStyle = skin; ctx.lineCap = 'round';
  [[2.5, 6.5, 2], [5, 4.5, 1.7]].forEach(([y0, fwd, lw], k) => {
    const wig = Math.sin(walk * 1.3 + k * 1.7) * 0.7;
    const x0 = hx + dir * 4, ya = hy + y0;
    const xe = x0 + dir * fwd + wig, ye = ya + 8;   // cuelgan hacia abajo
    ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(x0, ya);
    ctx.bezierCurveTo(x0 + dir * fwd * 0.9, ya + 1, x0 + dir * fwd * 0.6 - wig, ya + 5, xe, ye);
    ctx.quadraticCurveTo(xe - dir * 0.6, ye + 1.8, xe - dir * 1.8, ye + 0.8); ctx.stroke();
    ctx.fillStyle = sucker; dot(ctx, x0 + dir * fwd * 0.7, ya + 3.5, 0.55);
  });
  // gafas redondas con los ojos grandes (cada círculo en su propio trazo)
  const ec = hx + dir * 2.2;
  const eyeC = B ? (chasing ? '#ffe36b' : '#7a0b12') : line;
  for (const side of [-1, 1]) {
    const x = ec + side * 3.1;
    ctx.fillStyle = B ? '#f0d0c8' : '#fff'; dot(ctx, x, hy - 2.5, 2.4);
    ctx.fillStyle = eyeC; dot(ctx, x + dir * 0.4, hy - 2.4, 1.3);
    ctx.strokeStyle = line; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(x, hy - 2.5, 2.6, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(ec - 0.5, hy - 2.5); ctx.lineTo(ec + 0.5, hy - 2.5); ctx.stroke();
  // ceja preocupada encima del ojo de atrás y el coloretito en la mejilla
  ctx.lineWidth = 0.8;
  ctx.beginPath(); ctx.moveTo(ec - dir * 1.8, hy - 6.4); ctx.lineTo(ec - dir * 4.6, hy - 5.4); ctx.stroke();
  if (!B) { ctx.save(); ctx.globalAlpha *= 0.55; ctx.fillStyle = '#f08aa8'; dot(ctx, hx - dir * 3.5, hy + 2.6, 1.6); ctx.restore(); }
}

// Caty (ficha de Elora): gata naranja con las puntas de las orejas y de la cola lilas, una mancha
// de pintura lila sobre un ojo, los ojos cerrados de contenta, sonrisa con dientes, camiseta
// clarita de "HAPY DAY!" con una flor rosa con carita amarilla, y un pincel en la mano.
// La cabeza no se mueve hacia los lados al andar (como Carot). En la ficha tiene un brazo
// levantado; en el juego van los dos bajados [PROVISIONAL] (como Oct, que solo saludaba).
function drawCaty(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const lila = B ? '#c9a0a0' : '#a9a2e6';
  const shirt = B ? '#5e0810' : '#fbf0a8', shirtDark = B ? '#3a0408' : '#d9c45a';
  const line = B ? '#2a0306' : '#3a2418';
  const hx = 0, hy = -15;
  const step = Math.sin(walk) * 1.5;
  // hacia qué lado lleva el pincel (la mano de la derecha; mirando a la izquierda, la de la izquierda)
  const mano = facing === 'left' ? -1 : 1;

  // la cola larga, que sube por un lado con la punta lila (por detrás, salvo de espaldas)
  const cola = () => {
    const w = Math.sin(walk * 0.7) * 2.5;
    ctx.strokeStyle = skin; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-mano * 4, 5); ctx.quadraticCurveTo(-mano * 17, 8, -mano * (15 + w), -8); ctx.stroke();
    ctx.fillStyle = lila; dot(ctx, -mano * (15 + w), -9, 2.1);
  };
  if (!back) cola();
  // piernas y pies
  ctx.fillStyle = skin;
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.6 : 0;
    ctx.fillRect(side * 3.5 - 1.7, 3, 3.4, 8 + lift);
    ctx.beginPath(); ctx.ellipse(side * 4.2, 11 + lift, 3, 1.7, 0, 0, Math.PI * 2); ctx.fill();
  }
  // brazos (de Bloodie que persigue, arriba)
  const brazos = [];
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.5);
    brazos.push([side, chasing ? [side * 14 + sw, -18 + Math.abs(sw)] : [side * 10 + sw * 0.4, 3]]);
  }
  for (const [side, h] of brazos) {
    ctx.strokeStyle = skin; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(side * 6, -6); ctx.quadraticCurveTo(side * 10, -3, h[0], h[1]); ctx.stroke();
  }
  // camiseta clarita con mangas cortas
  ctx.fillStyle = shirt;
  rrect(ctx, -7, -9, 14, 14, 2.5); ctx.fill();
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 5 : -9.5, -9, 4.5, 4.5);
  ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = shirtDark; ctx.fillRect(3.5, -8, 3, 12); ctx.restore();
  if (!back && !B) {
    // la flor rosa con carita amarilla (cada pétalo, su propio círculo)
    ctx.fillStyle = '#ef7fb0';
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; dot(ctx, Math.cos(a) * 2.3, -2.5 + Math.sin(a) * 2.3, 1.4); }
    ctx.fillStyle = '#ffd83a'; dot(ctx, 0, -2.5, 1.6);
    ctx.fillStyle = line; dot(ctx, -0.6, -3, 0.3); dot(ctx, 0.6, -3, 0.3);
    ctx.fillRect(-0.6, -2.2, 1.2, 0.5);
  }
  // el pincel, en una mano: palo marrón y la punta con pintura lila
  if (!B) {
    const h = brazos.find(([side]) => side === mano)[1];
    ctx.strokeStyle = '#8a5a3a'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(h[0] - mano * 1, h[1] + 3); ctx.lineTo(h[0] + mano * 3, h[1] - 7); ctx.stroke();
    ctx.fillStyle = '#c9c9d2'; ctx.fillRect(h[0] + mano * 3 - 1, h[1] - 8.5, 2, 1.6);
    ctx.fillStyle = lila;
    ctx.beginPath(); ctx.ellipse(h[0] + mano * 3.4, h[1] - 10, 1.3, 2, mano * 0.35, 0, Math.PI * 2); ctx.fill();
  }
  // manos
  ctx.fillStyle = skin;
  for (const [, h] of brazos) dot(ctx, h[0], h[1], 1.8);
  if (back) cola();
  // orejas: naranjas, con la punta lila y el dentro rosa
  for (const side of [-1, 1]) {
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(hx + side * 2.5, hy - 7); ctx.lineTo(hx + side * 8.5, hy - 17); ctx.lineTo(hx + side * 9.5, hy - 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = lila;
    ctx.beginPath(); ctx.moveTo(hx + side * 7.2, hy - 14.8); ctx.lineTo(hx + side * 8.5, hy - 17); ctx.lineTo(hx + side * 8.8, hy - 13.6); ctx.closePath(); ctx.fill();
    if (!back) {
      ctx.fillStyle = B ? '#3a0408' : '#f0a8bc';
      ctx.beginPath(); ctx.moveTo(hx + side * 4.5, hy - 7.5); ctx.lineTo(hx + side * 7.6, hy - 12.5); ctx.lineTo(hx + side * 8, hy - 6); ctx.closePath(); ctx.fill();
    }
  }
  // cabeza
  ctx.fillStyle = skin; dot(ctx, hx, hy, 9);
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // la mancha de pintura lila sobre el ojo derecho (Elora), con bultitos como una nube
  if (!B) {
    ctx.save();
    ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = lila;
    dot(ctx, hx + 3.8, hy - 1, 3.4);
    dot(ctx, hx + 6, hy - 3.6, 1.9);
    dot(ctx, hx + 1.5, hy - 3.8, 1.6);
    dot(ctx, hx + 6.4, hy + 1.2, 1.7);
    ctx.restore();
  }
  // ojos: cerrados de contenta (arquitos); de Bloodie, abiertos y enfadados
  ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const x = hx + side * 3.6;
    if (B) {
      ctx.fillStyle = chasing ? '#ffe36b' : '#7a0b12'; dot(ctx, x, hy - 1, 1.6);
    } else {
      ctx.beginPath(); ctx.arc(x, hy, 1.9, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    }
  }
  // naricita y la sonrisa con dientes
  ctx.fillStyle = B ? '#2a0306' : '#b5485a'; dot(ctx, hx, hy + 2.2, 0.8);
  ctx.fillStyle = B ? '#2a0306' : '#5a2a22';
  ctx.beginPath(); ctx.moveTo(hx - 3, hy + 3.6); ctx.quadraticCurveTo(hx, hy + 8.2, hx + 3, hy + 3.6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = B ? '#e8d8c0' : '#fff';
  ctx.fillRect(hx - 2.2, hy + 3.7, 4.4, 1.3);
}

// Gec (ficha de Elora): lagarto verde con los ojos grandes y negros, una sonrisa enorme con dos
// dientes grandes, dos agujeritos de nariz, camiseta gris con "ROK!" en rojo, los brazos un poco
// abiertos y la cola larga. Sin cuello y con la cabeza quieta al andar. Su monopatín rojo
// (Elora): al andar lo lleva en la mano; al correr (opts.skate) va subido encima; y mientras usa
// la lengua (opts.lengua) lo agarra con las dos manos encima de la cabeza, porque va tan rápido
// que se le caería.
function drawGec(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const shirt = B ? '#5e0810' : '#a9abb0', shirtDark = B ? '#3a0408' : '#7c7e84';
  const line = B ? '#2a0306' : '#1d241a';
  const hx = 0, hy = -15;
  const step = Math.sin(walk) * 1.5;
  const lado = facing === 'left' ? 1 : -1;   // la cola sale por el lado contrario a donde mira
  const agarra = !!opts.lengua && !B;             // con la lengua: monopatín agarrado con las dos manos
  const skate = !!opts.skate && !B && !agarra;
  const tabla = B ? '#3a0408' : '#e0303c', rueda = B ? '#1a0204' : '#2b2b30';
  // el monopatín: una tabla roja con las puntas redondeadas y cuatro ruedas
  const monopatin = (x, y, ang) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.fillStyle = rueda;
    for (const k of [-5, 5]) { dot(ctx, k, 2, 1.3); }
    ctx.fillStyle = tabla;
    rrect(ctx, -8, -1.2, 16, 2.8, 1.4); ctx.fill();
    ctx.restore();
  };
  if (skate) {
    // subido al monopatín: la tabla debajo de los pies, se balancea un poco
    monopatin(0, 13, Math.sin(walk * 0.5) * 0.06);
    ctx.translate(0, -2.5);
  }

  // cola larga (detrás, salvo de espaldas)
  const cola = () => {
    const w = Math.sin(walk * 0.8) * 3;
    ctx.strokeStyle = skin; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(lado * 4, 4); ctx.quadraticCurveTo(lado * 15, 6, lado * (13 + w), -6); ctx.stroke();
  };
  if (!back) cola();
  // piernas
  ctx.fillStyle = skin;
  for (const side of [-1, 1]) {
    const lift = !skate && side * step > 0 ? -side * step * 0.6 : 0;   // en el monopatín no da pasos
    ctx.fillRect(side * 3.6 - 1.8, 3, 3.6, 8 + lift);
    ctx.beginPath(); ctx.ellipse(side * 4.4, 11 + lift, 3.2, 1.7, 0, 0, Math.PI * 2); ctx.fill();
  }
  // brazos un poco abiertos, con la mano de deditos (de Bloodie que persigue, arriba;
  // en el monopatín, más abiertos para mantener el equilibrio)
  const manos = [];
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.2);
    const h = chasing ? [side * 14 + sw, -18 + Math.abs(sw)] : agarra ? [side * 8, -26] : skate ? [side * 14, -6 + side * sw * 0.8] : [side * 12 + sw * 0.4, -1];
    manos.push([side, h]);
    ctx.strokeStyle = skin; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(side * 6, -6); ctx.lineTo(h[0], h[1]); ctx.stroke();
    ctx.fillStyle = skin;
    for (let k = -1; k <= 1; k++) dot(ctx, h[0] + side * 1.6, h[1] + k * 1.5, 1);
  }
  // camiseta gris con mangas cortas
  ctx.fillStyle = shirt;
  rrect(ctx, -7, -9, 14, 14, 2.5); ctx.fill();
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 5 : -9.5, -9, 4.5, 4.5);
  ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = shirtDark; ctx.fillRect(3.5, -8, 3, 12); ctx.restore();
  if (!back && !B) {
    // "ROK!" en rojo (letras de palitos, pequeñas)
    ctx.strokeStyle = '#d81e2c'; ctx.lineWidth = 0.9; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-5, -1); ctx.lineTo(-5, -5); ctx.lineTo(-3.5, -5); ctx.lineTo(-3.5, -3.3); ctx.lineTo(-5, -3.3); ctx.lineTo(-3.4, -1);   // R
    ctx.moveTo(-1.6, -5); ctx.lineTo(-0.2, -5); ctx.lineTo(-0.2, -1); ctx.lineTo(-1.6, -1); ctx.closePath();   // O
    ctx.moveTo(1.3, -5); ctx.lineTo(1.3, -1); ctx.moveTo(3, -5); ctx.lineTo(1.4, -3); ctx.lineTo(3, -1);   // K
    ctx.moveTo(4.6, -5); ctx.lineTo(4.6, -2.4);   // !
    ctx.stroke();
    ctx.fillStyle = '#d81e2c'; ctx.fillRect(4.15, -1.4, 0.9, 0.9);
  }
  // andando, lleva el monopatín en la mano (en la del lado de la cola), de pie junto a la pierna
  if (!skate && !agarra && !B && !chasing) {
    const h = manos.find(([side]) => side === lado)[1];
    monopatin(h[0] + lado * 2, h[1] + 7, Math.PI / 2);
    ctx.fillStyle = skin; for (let k = -1; k <= 1; k++) dot(ctx, h[0] + lado * 1.6, h[1] + k * 1.5, 1);
  }
  if (back) cola();
  // cabeza grande y redonda
  ctx.fillStyle = skin;
  rrect(ctx, hx - 10, hy - 8.5, 20, 16, 7.5); ctx.fill();
  // con la lengua: el monopatín bien agarrado con las dos manos, encima de la cabeza (Elora)
  if (agarra) {
    monopatin(0, -27, 0);
    ctx.fillStyle = skin;
    for (const [, h] of manos) for (let k = -1; k <= 1; k++) dot(ctx, h[0] + k * 1.3, h[1] - 0.5, 1);
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // ojos grandes y negros, con un brillito (de Bloodie, rojos o amarillos al perseguir)
  for (const side of [-1, 1]) {
    const x = hx + side * 4.4, y = hy - 3.2;
    ctx.fillStyle = B ? '#f0d0c8' : '#fff'; dot(ctx, x, y, 3.4);
    ctx.fillStyle = B ? (chasing ? '#ffe36b' : '#7a0b12') : '#111'; dot(ctx, x, y + 0.2, 2.6);
    if (!B) { ctx.fillStyle = '#fff'; dot(ctx, x + 0.9, y - 0.9, 0.7); }
  }
  // la sonrisa enorme con los dos dientes grandes
  ctx.fillStyle = B ? '#e8d8c0' : '#fbfbf4';
  rrect(ctx, hx - 7.5, hy + 1.6, 15, 4.4, 2); ctx.fill();
  ctx.strokeStyle = line; ctx.lineWidth = 0.7; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx - 2, hy + 1.8); ctx.lineTo(hx - 2, hy + 5.8); ctx.moveTo(hx + 2, hy + 1.8); ctx.lineTo(hx + 2, hy + 5.8); ctx.stroke();
  // agujeritos de la nariz
  ctx.fillStyle = B ? '#2a0306' : skinDark;
  dot(ctx, hx - 1.3, hy - 0.2, 0.55); dot(ctx, hx + 1.3, hy - 0.2, 0.55);
}

// Jely (ficha de Elora): medusa con la cabeza redonda turquesa clarito, los ojos tristes, dos
// tentáculos rizados en la cara (no tiene boca: habla lengua de signos), tentáculos turquesas finos
// a los lados, y el cuerpo como una columna azul que se ensancha abajo, con olas y el borde lila.
// De Bloodie le falta un tentáculo (Elora: a los Bloodies de Jely les falta un tentáculo).
function drawJely(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const head = B ? '#c23a42' : '#a9e4e2', fin = head;   // los tentáculos, del color de los de la cara (Elora)
  const body = pal.color, bodyDark = pal.dark, base = B ? '#5e0810' : '#c3b6ea';
  const line = B ? '#2a0306' : '#1f2a33';
  const ex = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
  const hx = ex, hy = -15;
  const sway = Math.sin(walk * 0.8) * 1.2;   // el bajo del cuerpo se balancea como en el agua

  // tentáculos a los dos lados, saliendo de debajo de la cabeza (Elora: son tentáculos, no pinchos):
  // dos finos por lado, cortos, que se mueven como en el agua
  // (Elora: como los de la cara) cuelgan hacia abajo y acaban en un rizo
  const tentaculo = (side, k) => {
    const w = Math.sin(walk * (chasing ? 2.2 : 1.2) + side + k * 1.4) * (chasing ? 1.2 : 0.6);
    const x0 = hx + side * (5.5 + k * 4), y0 = hy + 2.5 - k * 0.6;   // bien separados (Elora)
    const fwd = [1.6, 4.4][k], down = [8.5, 7.5][k];
    const xe = x0 + side * fwd + w, ye = y0 + down;
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(x0, y0);
    ctx.bezierCurveTo(x0 + side * fwd * 1.1, y0 + 2, x0 + side * fwd * 1.1 - w, y0 + down * 0.65, xe, ye);
    // el rizo de la punta, hacia dentro
    ctx.quadraticCurveTo(xe - side * 1.7, ye + 0.3, xe - side * 1.2, ye - 1.6);
    ctx.stroke();
  };
  ctx.strokeStyle = fin; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    for (let k = 0; k < 2; k++) {
      if (B && side === 1 && k > 0) continue;   // de Bloodie le falta un tentáculo de un lado
      tentaculo(side, k);
    }
  }

  // cuerpo: columna azul, estrecha arriba y ancha abajo
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-5, hy + 3);
  ctx.lineTo(5, hy + 3);
  ctx.quadraticCurveTo(5, 2, 11 + sway, 10);
  ctx.lineTo(-11 + sway, 10);
  ctx.quadraticCurveTo(-5, 2, -5, hy + 3);
  ctx.closePath(); ctx.fill();
  // sombra de un lado
  ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = bodyDark;
  ctx.beginPath(); ctx.moveTo(2.5, hy + 4); ctx.lineTo(5, hy + 4); ctx.quadraticCurveTo(5, 2, 11 + sway, 10); ctx.lineTo(7 + sway, 10); ctx.quadraticCurveTo(3, 2, 2.5, hy + 4); ctx.closePath(); ctx.fill();
  ctx.restore();
  // el borde de abajo, lila, y las olitas encima
  ctx.fillStyle = base;
  ctx.beginPath(); ctx.moveTo(-10 + sway, 7.5); ctx.lineTo(10 + sway, 7.5); ctx.lineTo(11 + sway, 10.5); ctx.lineTo(-11 + sway, 10.5); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = B ? '#2a0306' : '#e8f6ff'; ctx.lineWidth = 0.8; ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const x0 = -9 + i * 4 + sway, ph = Math.sin(walk * 1.5 + i) * 0.4;
    ctx.moveTo(x0, 6 + ph); ctx.quadraticCurveTo(x0 + 1, 4.6 + ph, x0 + 2, 6 + ph); ctx.quadraticCurveTo(x0 + 3, 7.2 + ph, x0 + 4, 6 + ph);
  }
  ctx.stroke();

  // cabeza: una campana redonda turquesa clarito con la parte de abajo recta
  ctx.fillStyle = head;
  ctx.beginPath(); ctx.ellipse(hx, hy, 9.5, 9, 0, Math.PI, 0); ctx.lineTo(hx + 9.5, hy + 3); ctx.lineTo(hx - 9.5, hy + 3); ctx.closePath(); ctx.fill();
  if (!B) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.ellipse(hx - 4.5, hy - 5.5, 1.8, 3, -0.6, 0, Math.PI * 2); ctx.fill();
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;

  // los dos tentáculos rizados de la cara (donde los demás tienen la boca), que se mueven un poco
  ctx.strokeStyle = head; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const w = Math.sin(walk * 1.2 + side) * 0.5;
    const x0 = hx + side * 2.4;
    ctx.beginPath();
    ctx.moveTo(x0, hy + 1);
    ctx.bezierCurveTo(x0 + side * 2.5, hy + 3, x0 + side * 2.5 + w, hy + 7, x0 + side * 0.5 + w, hy + 8);
    ctx.quadraticCurveTo(x0 - side * 1.2 + w, hy + 8.2, x0 - side * 0.6 + w, hy + 6.6);
    ctx.stroke();
  }
  // ojos tristes: blancos con la pupila negra y el párpado caído
  const eyeC = B ? (chasing ? '#ffe36b' : '#7a0b12') : line;
  for (const side of [-1, 1]) {
    const x = hx + ex * 0.6 + side * 3.6;
    ctx.fillStyle = B ? '#f0d0c8' : '#fff';
    ctx.beginPath(); ctx.ellipse(x, hy - 3, 2.1, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = eyeC; dot(ctx, x + ex * 0.3, hy - 2.6, 1.2);
    ctx.strokeStyle = line; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.ellipse(x, hy - 3, 2.1, 2.5, 0, 0, Math.PI * 2); ctx.stroke();
    // el párpado caído (más bajo por fuera, como en la ficha): es lo que la hace parecer triste
    ctx.save();
    ctx.beginPath(); ctx.ellipse(x, hy - 3, 2.4, 2.8, 0, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = head;
    ctx.beginPath(); ctx.moveTo(x - 3, hy - 6); ctx.lineTo(x + 3, hy - 6);
    ctx.lineTo(x + side * 2.6, hy - 3.2); ctx.lineTo(x - side * 2.6, hy - 4.6); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = line; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(x - side * 2.2, hy - 4.6); ctx.lineTo(x + side * 2.3, hy - 3.3); ctx.stroke();
  }
}

// Tarda (ficha de Elora): tardígrada marrón (la de la tienda del lobby es gris), con el cuerpo alto
// como un rectángulo con rayas, un ojo guiñado y el otro abierto con la ceja, una sonrisa enorme con
// dientes, y ocho patitas con garritas. En la ficha sujeta una cinta y lleva una moneda de oro.
// De Bloodie le falta una pata.
function drawTarda(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, dark = pal.dark;
  const line = B ? '#2a0306' : '#3a2a1e';
  const claw = B ? '#2a0306' : '#5a5a5e';
  const ex = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
  // La Tarda de la tienda del lobby (opts.alta) es más alta y lleva su cinta; la jugable es más
  // bajita y no lleva ni la cinta ni las monedas (Elora).
  const alta = !!opts.alta;
  const top = alta ? -34 : -22, bot = 8;   // el cuerpo, de arriba abajo
  const fy = top + 27;   // la cara y la cinta se colocan respecto a lo alto del cuerpo

  // una pata: un tubito con tres garritas en la punta
  const pata = (x0, y0, x1, y1, w) => {
    ctx.strokeStyle = skin; ctx.lineCap = 'round'; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.fillStyle = claw;
    const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l;
    for (const a of [-0.7, 0, 0.7]) {
      const c = Math.cos(a), s = Math.sin(a);
      const vx = ux * c - uy * s, vy = ux * s + uy * c;
      dot(ctx, x1 + vx * (w * 0.55 + 0.6), y1 + vy * (w * 0.55 + 0.6), 0.7);
    }
  };
  // las patas de los lados (tres por lado) se mueven un poco al andar; de Bloodie que persigue, arriba
  const lados = [[-12, -3], [-6, 0], [0, 3]];
  for (const side of [-1, 1]) {
    lados.forEach(([y, fase], k) => {
      if (B && side === 1 && k === 2) return;   // de Bloodie le falta una pata
      const sw = Math.sin(walk * (chasing ? 2 : 1) + fase + (side > 0 ? 1.5 : 0)) * (chasing ? 2.5 : 1.2);
      const yEnd = chasing ? y - 7 + sw : y + 2 + sw;
      pata(side * 6.5, y, side * 12.5, yEnd, 3.2);
    });
  }
  // las dos de abajo, andando
  for (const side of [-1, 1]) {
    const st = Math.sin(walk + (side > 0 ? Math.PI : 0)) * 1.6;
    pata(side * 4, bot - 2, side * 5 + st, bot + 4, 3.6);
  }
  // el cuerpo: un rectángulo alto (un poco más ancho abajo) con las esquinas redondeadas
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.moveTo(-7, top + 2); ctx.quadraticCurveTo(-7, top, -5, top);
  ctx.lineTo(5, top); ctx.quadraticCurveTo(7, top, 7, top + 2);
  ctx.lineTo(8, bot - 1); ctx.quadraticCurveTo(8, bot + 1, 6, bot + 1);
  ctx.lineTo(-6, bot + 1); ctx.quadraticCurveTo(-8, bot + 1, -8, bot - 1);
  ctx.closePath(); ctx.fill();
  // sombra de un lado
  ctx.save(); ctx.globalAlpha *= 0.3; ctx.fillStyle = dark;
  ctx.fillRect(4, top + 1, 3.5, bot - top);
  ctx.restore();
  // las rayas del cuerpo, un poco torcidas como en la ficha
  ctx.strokeStyle = dark; ctx.lineWidth = 0.9;
  ctx.beginPath();
  for (const y of [top + 16, top + 22, top + 28, top + 34]) { if (y > bot - 4) break; ctx.moveTo(-7.6, y + 1); ctx.quadraticCurveTo(0, y - 1, 7.6, y); }
  ctx.stroke();
  if (B) bloodyMarks(ctx, ex, top + 7, facing);
  if (!back) {
    ctx.save(); ctx.translate(0, fy);
    // la cara, arriba del todo: un ojo guiñado (el de la izquierda) y el otro abierto con su ceja
    const fx = ex;
    ctx.strokeStyle = line; ctx.lineWidth = 0.9; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(fx - 5, -22.6); ctx.lineTo(fx - 2.6, -21.4); ctx.lineTo(fx - 5, -20.4); ctx.stroke();
    ctx.fillStyle = B ? (chasing ? '#ffe36b' : '#7a0b12') : '#141414';
    dot(ctx, fx + 3, -21.4, 1.5);
    ctx.beginPath(); ctx.moveTo(fx + 1.2, -24.6); ctx.lineTo(fx + 4.6, -23.6); ctx.stroke();
    // la sonrisa enorme, abierta, con dientes
    ctx.fillStyle = B ? '#3a0408' : '#2a1a14';
    ctx.beginPath(); ctx.moveTo(fx - 1, -18); ctx.quadraticCurveTo(fx + 2.5, -18.6, fx + 5, -19.4);
    ctx.quadraticCurveTo(fx + 4.6, -14, fx + 1, -14.2); ctx.quadraticCurveTo(fx - 1.2, -15, fx - 1, -18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = B ? '#f0d0c8' : '#fff';
    ctx.fillRect(fx + 0.2, -18.2, 1.2, 1.2); ctx.fillRect(fx + 2, -18.6, 1.2, 1.3); ctx.fillRect(fx + 3.6, -18.9, 1, 1.2);
    ctx.fillRect(fx + 1.2, -15.6, 1.2, 1); ctx.fillRect(fx + 2.8, -15.8, 1.1, 1);
    ctx.restore();
  }
  if (alta && !B && !back) {
    // la cinta que lleva en una pata de arriba (la de la derecha)
    ctx.save();
    ctx.translate(13.5, -15 + fy * 0.5); ctx.rotate(-0.25);
    ctx.fillStyle = '#2b2b30'; rrect(ctx, -4.5, -2.2, 9, 4.4, 1); ctx.fill();
    ctx.fillStyle = '#e8e8ec'; ctx.fillRect(-3.4, -1.1, 1.8, 1.8); ctx.fillRect(1.6, -1.1, 1.8, 1.8);
    ctx.restore();
  }
}

// Hoppy (ficha de Elora): liebre marrón clarito, chica y pequeñita (7 u 8 años, como Caty), con las
// orejas largas amarillas por dentro (una tiesa y la otra doblada hacia un lado), los ojos cerrados
// de contenta, una sonrisita, camiseta roja con un dibujo azul clarito (un corazón con brazos y
// piernas, de "HAPPY HOPPY"), los brazos abiertos, las patas de liebre grandes y la colita.
function drawHoppy(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const shirt = B ? '#5e0810' : '#d8344a', shirtDark = B ? '#3a0408' : '#a8202f';
  const panel = B ? '#c9a0a0' : '#cfe9f6';
  const earIn = B ? '#7a0b12' : '#f2d23c';
  const line = B ? '#2a0306' : '#4a2e22';
  const hx = 0, hy = back ? -15 : -14;
  const step = Math.sin(walk) * 1.8;

  // colita (detrás si mira de frente)
  if (!back) { ctx.fillStyle = skinDark; dot(ctx, -9.5, 4, 2.6); }
  // piernas con las patas de liebre grandes
  ctx.fillStyle = skin;
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.7 : 0;
    ctx.fillRect(side * 3.5 - 1.8, 3, 3.6, 7 + lift);
    ctx.beginPath(); ctx.ellipse(side * 4.5, 10.5 + lift, 4.2, 2, 0, 0, Math.PI * 2); ctx.fill();
  }
  // brazos abiertos (de Bloodie que persigue, arriba)
  ctx.strokeStyle = skin; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.8) + side) * (chasing ? 4 : 1.5);
    ctx.beginPath(); ctx.moveTo(side * 5.5, -4);
    if (B && chasing) ctx.lineTo(side * 13 + sw, -17 + Math.abs(sw));
    else ctx.lineTo(side * 11 + sw * 0.4, -1 + sw * 0.3);
    ctx.stroke();
    if (!(B && chasing)) { ctx.fillStyle = skin; dot(ctx, side * 11.5 + sw * 0.4, -1 + sw * 0.3, 2); }
  }
  // camiseta roja
  ctx.fillStyle = shirt;
  rrect(ctx, -6.5, -8, 13, 12.5, 2.5); ctx.fill();
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 4.5 : -8.5, -8, 4, 4);
  ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = shirtDark; ctx.fillRect(3.5, -7, 3, 11); ctx.restore();
  if (!back) {
    // el dibujo azul clarito con el corazón con brazos y piernas
    ctx.fillStyle = panel; ctx.fillRect(-4, -6, 8, 9);
    if (!B) {
      ctx.fillStyle = '#ef8fb0';
      ctx.beginPath(); ctx.moveTo(0, 0.2); ctx.lineTo(-2.4, -2.4); ctx.quadraticCurveTo(-2.6, -4.6, -0.8, -4.2);
      ctx.lineTo(0, -3.4); ctx.lineTo(0.8, -4.2); ctx.quadraticCurveTo(2.6, -4.6, 2.4, -2.4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#7a5a6a'; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(-1.6, -2.6); ctx.lineTo(-3.2, -4); ctx.moveTo(1.6, -2.6); ctx.lineTo(3.2, -4);
      ctx.moveTo(-0.8, -0.6); ctx.lineTo(-1.4, 1.6); ctx.moveTo(0.8, -0.6); ctx.lineTo(1.4, 1.6); ctx.stroke();
      ctx.fillStyle = '#4ea84a'; ctx.fillRect(1, 3, 4, 1.4);   // el trocito verde de abajo
    }
  }
  // orejas largas: la de la izquierda tiesa y la de la derecha doblada hacia un lado
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(hx - 3.5, hy - 13, 2.8, 8.5, -0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + 8.5, hy - 7, 2.7, 7, 1.0, 0, Math.PI * 2); ctx.fill();
  if (!back) {
    ctx.fillStyle = earIn;
    ctx.beginPath(); ctx.ellipse(hx - 3.4, hy - 13.5, 1.3, 6, -0.15, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hx + 8.8, hy - 7.2, 1.2, 4.8, 1.0, 0, Math.PI * 2); ctx.fill();
  }
  // cabeza
  ctx.fillStyle = skin; dot(ctx, hx, hy, 9);
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // ojos cerrados de contenta (como dos arquitos), naricita y sonrisita
  ctx.strokeStyle = B && chasing ? '#ffe36b' : line; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    ctx.beginPath(); ctx.arc(hx + side * 3.6, hy + 0.5, 2, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  }
  ctx.strokeStyle = line; ctx.lineWidth = 0.9;
  ctx.fillStyle = B ? '#2a0306' : '#8a5a48'; dot(ctx, hx, hy + 3.3, 0.8);
  ctx.beginPath(); ctx.moveTo(hx - 2, hy + 4.6); ctx.quadraticCurveTo(hx - 1, hy + 6, hx, hy + 4.8); ctx.quadraticCurveTo(hx + 1, hy + 6, hx + 2, hy + 4.6); ctx.stroke();
  if (!B) { ctx.save(); ctx.globalAlpha *= 0.45; ctx.fillStyle = '#f08aa8'; dot(ctx, hx - 5.2, hy + 3, 1.4); dot(ctx, hx + 5.2, hy + 3, 1.4); ctx.restore(); }
}

// El Drake Sangriento: el que escupe fuego en el pasillo de Drake (pasillo 50), dibujado por Elora
// (assets/referencias/bloodies/drake-sangriento.webp). Un dragón rosa-rojo con alas de murciélago,
// cola larga enroscada, orejas puntiagudas, ojos grandes con un cuadrado (uno rojo y uno azul), lágrimas de sangre,
// colmillos y la boca abierta. Usa sus propios colores (no los del Bloody normal).
export const DRAKE_SANGRIENTO = { id: 'drake-sangriento', name: 'Drake', shape: 'drakeSangriento', color: '#e98d95', dark: '#b3343f' };
function drawDrakeSangriento(ctx, pal, facing, walk, opts) {
  const piel = '#e98d95', raya = '#c94a55', linea = '#3a2a2c', rojo = '#d8202c', azul = '#3a8fd8';
  const de = facing === 'up';
  if (facing === 'left') ctx.scale(-1, 1);
  const aleteo = Math.sin(walk * 0.8) * 0.18;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // las alas, detrás (de murciélago, con el borde de picos)
  for (const lado of [-1, 1]) {
    ctx.save(); ctx.translate(lado * 5, -5); ctx.rotate(lado * aleteo); ctx.scale(lado, 1);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(10, -15); ctx.lineTo(24, -12);
    ctx.lineTo(21, -2); ctx.lineTo(17, 3); ctx.lineTo(13, -1); ctx.lineTo(9, 6); ctx.lineTo(5, 2); ctx.lineTo(2, 8); ctx.closePath();
    ctx.fillStyle = piel; ctx.fill(); ctx.strokeStyle = linea; ctx.lineWidth = 1; ctx.stroke();
    // los huesos del ala
    ctx.strokeStyle = raya; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(10, -15); ctx.lineTo(17, 3); ctx.moveTo(10, -15); ctx.lineTo(9, 6); ctx.moveTo(10, -15); ctx.lineTo(21, -2); ctx.stroke();
    ctx.restore();
  }
  // la cola larga y enroscada
  ctx.strokeStyle = linea; ctx.lineWidth = 6.5;
  const cola = () => { ctx.beginPath(); ctx.moveTo(3, 6); ctx.quadraticCurveTo(18, 14, 20, 2); ctx.quadraticCurveTo(21, -6, 15, -5); ctx.quadraticCurveTo(11, -3, 14, 1); };
  cola(); ctx.stroke(); ctx.strokeStyle = piel; ctx.lineWidth = 4.5; cola(); ctx.stroke();
  // las patas de atrás, con garras
  for (const lado of [-1, 1]) {
    const paso = Math.sin(walk + (lado > 0 ? Math.PI : 0)) * 1.5;
    ctx.fillStyle = piel; ctx.strokeStyle = linea; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(lado * 4.5, 8 + paso, 3, 3.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath();
    for (let i = -1; i <= 1; i++) { ctx.moveTo(lado * 4.5 + i * 1.6, 11 + paso); ctx.lineTo(lado * 4.5 + i * 2.2, 13 + paso); }
    ctx.stroke();
  }
  // el cuerpo, con las rayas de la tripa
  ctx.fillStyle = piel; ctx.strokeStyle = linea; ctx.lineWidth = 1.1;
  ctx.beginPath(); ctx.ellipse(0, 1, 7, 9, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = raya; ctx.lineWidth = 0.9;
  ctx.beginPath(); for (const yy of [-2, 2, 6]) { ctx.moveTo(-5, yy); ctx.quadraticCurveTo(0, yy + 1.5, 5, yy); } ctx.stroke();
  // los bracitos con garras
  for (const lado of [-1, 1]) {
    ctx.strokeStyle = linea; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(lado * 6, -3); ctx.lineTo(lado * 9, 1);
    for (let i = -1; i <= 1; i++) { ctx.moveTo(lado * 9, 1); ctx.lineTo(lado * (9 + 1.5) + i * 1.3, 3.2); }
    ctx.stroke();
  }
  // la cabeza: redonda, con las orejas puntiagudas (rojas por dentro)
  for (const lado of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(lado * 4, -19); ctx.lineTo(lado * 10, -26); ctx.lineTo(lado * 9, -16); ctx.closePath();
    ctx.fillStyle = piel; ctx.fill(); ctx.strokeStyle = linea; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(lado * 5.5, -19); ctx.lineTo(lado * 9, -23.5); ctx.lineTo(lado * 8.5, -17.5); ctx.closePath();
    ctx.fillStyle = rojo; ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0, -14, 9, 0, Math.PI * 2);
  ctx.fillStyle = piel; ctx.fill(); ctx.strokeStyle = linea; ctx.lineWidth = 1.1; ctx.stroke();
  if (de) return;   // de espaldas no se le ve la cara
  // los ojos grandes, con un cuadrado dentro: uno rojo y uno azul (Elora)
  for (const [ex, ey, col] of [[-3.6, -15.5, rojo], [3.6, -16.5, azul]]) {
    ctx.beginPath(); ctx.arc(ex, ey, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = linea; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.fillStyle = col; ctx.fillRect(ex - 1.3, ey - 1.3, 2.6, 2.6);
  }
  // lágrimas de sangre debajo de los ojos (Elora: no son mofletes, son lágrimas), que caen y vuelven
  ctx.fillStyle = rojo;
  for (const [lx, ly, fase] of [[-5.6, -12.6, 0], [5.8, -13.6, 1.7]]) {
    const baja = ((walk * 0.35 + fase) % 2) * 1.4;
    ctx.beginPath();
    ctx.moveTo(lx, ly - 1 + baja);
    ctx.quadraticCurveTo(lx + 2.2, ly + 2.6 + baja, lx, ly + 3.6 + baja);
    ctx.quadraticCurveTo(lx - 2.2, ly + 2.6 + baja, lx, ly - 1 + baja);
    ctx.fill();
  }
  // la nariz (dos puntitos), la boca abierta y los colmillos
  ctx.fillStyle = '#7a1018';
  ctx.beginPath(); ctx.arc(-0.8, -12.5, 0.45, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0.8, -12.5, 0.45, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-3.5, -10.5); ctx.quadraticCurveTo(0, -9.5, 4, -10.8); ctx.lineTo(0.5, -7); ctx.closePath();
  ctx.fillStyle = rojo; ctx.fill(); ctx.strokeStyle = linea; ctx.lineWidth = 0.8; ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(-3, -10.4); ctx.lineTo(-2, -8.4); ctx.lineTo(-1.2, -10.2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(3.4, -10.6); ctx.lineTo(2.4, -8.6); ctx.lineTo(1.6, -10.4); ctx.closePath(); ctx.fill();
  // una gota de sangre que le cae de la boca
  const gota = (Math.sin(walk * 0.5) + 1) * 0.8;
  ctx.fillStyle = '#a3141c';
  ctx.beginPath(); ctx.ellipse(0.5, -6 + gota, 0.9, 1.4 + gota * 0.4, 0, 0, Math.PI * 2); ctx.fill();
}

const OWN_DRAW = { carot: drawCarot, frog: drawFroggy, octopus: drawOct, cat: drawCaty, lizard: drawGec, jellyfish: drawJely, tardigrade: drawTarda, hare: drawHoppy, drakeSangriento: drawDrakeSangriento };
