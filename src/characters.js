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
    stats: { velocidad: 80, cordura: 60, sigilo: 40, resistencia: 50 }, corazones: 3, ficha: 'assets/sprites/fichas/gek.webp',
    fichaCuadro: { left: 65.5, top: 33, right: 3, bottom: 5 } },
  { id: 'drake', name: 'Drake', species: { es: 'Dragón', en: 'Dragon' }, color: '#df5f7a', dark: '#ad3a55', shape: 'dragon', price: 200, secreto: true, ability: 'drake',   // sale en la tienda al escapar del pasillo 50 (Elora)
    stats: { velocidad: 100, cordura: 100, sigilo: 100, resistencia: 100 }, corazones: 5,
    ficha: 'assets/sprites/fichas/drake.webp', fichaCuadro: { left: 69, top: 22, right: 2.5, bottom: 4 } },
  { id: 'draila', name: 'Draila', species: { es: 'Cocodrilo', en: 'Crocodile' }, color: '#3f8f5a', dark: '#245c38', shape: 'crocodile', price: 100, ability: 'draila', stats: { velocidad: 30, cordura: 60, sigilo: 50, resistencia: 40 }, corazones: 3,
    ficha: 'assets/sprites/fichas/draila.webp', fichaCuadro: { left: 67.5, top: 22, right: 3, bottom: 5 } },
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
  // Chop, el reno (Elora; el nombre lo eligió ella): el personaje secreto de Navidad. Su id sigue siendo 'reno'.
  // Se gana abriendo los 5 días del calendario de Adviento grande (src/adviento.js) o se juega gratis en el
  // modo Navidad (código). Ya tiene su ficha de Elora, su habilidad (la Nariz brillante) y sus números (Elora,
  // en su menú de números).
  { id: 'reno', name: 'Chop', species: { es: 'Reno', en: 'Reindeer' }, color: '#c49a70', dark: '#94704c', shape: 'reindeer', price: null, secreto: true, navidad: true, ability: 'chop',
    stats: { velocidad: 75, cordura: 50, sigilo: 51, resistencia: 40 }, corazones: 3, ficha: 'assets/sprites/fichas/reno.webp',
    fichaCuadro: { left: 65, top: 22, right: 3, bottom: 5 } },
  // La perrita (Elora, 9-11-2026): la mejor amiga de Carot… o eso parece (es una amistad tóxica; el lirio de su
  // oreja es venenoso y es la pista). Todavía no tiene nombre, ficha ni habilidad (Elora los pensará). De momento
  // solo sale con su código secreto (modo perrita, holeway.modoPerrita), gratis. soloCodigo: no sale de Bloodie.
  // Sus números los eligió Elora en su menú de números (9-11-2026).
  { id: 'perrita', name: 'La perrita', species: { es: 'Perra', en: 'Dog' }, color: '#e6cba0', dark: '#c9a574', shape: 'perrita', price: null, secreto: true, soloCodigo: true, ability: null,
    stats: { velocidad: 60, cordura: 40, sigilo: 40, resistencia: 85 }, corazones: 3 },
];

// La Tarda de verdad (la de la tienda del lobby y la que habla en las grabaciones) es gris, como la
// dibujó Elora; la Tarda que se compra es marrón (Elora).
export const TARDA_GRIS = { color: '#a9a8ad', dark: '#74737a' };

export function characterById(id) { return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0]; }

// Skins (Elora): disfraces con ropa nueva; el mismo personaje vestido de otra cosa. Elora las dibuja en
// papel, enteras y coloreadas, y se compran en la tienda de Tarda (de 30 a 90 monedas; el precio de cada
// una lo dice Elora con su dibujo). Las primeras son las **skins de pijama** (su cartel:
// assets/referencias/skins/cartel-pijamas.webp); habrá una para cada personaje (Elora).
// price: lo que cuesta cada una (Elora; null = aún no lo ha dicho). Todavía no se venden: hasta que dejen
// de ser secretas, solo se ven en el **modo pijama** secreto (el código de «🔑 Introducir código»), y ahí son
// gratis (Elora): así el juego se puede publicar sin enseñarlas todavía.
// Los de Gec, Draila, Hoppy y Caty los hizo Clad inspirándose en el cartel, y Elora los dejó así (no hace falta
// que los dibuje); los demás salen de sus dibujos. Cada personaje los dibuja en su función (pal.skin === 'pijama').
export const SKINS = {
  pijama: {
    emoji: '🛌',
    personajes: {
      gek: { price: 40 },      // pijama de monopatines (Elora)
      draila: { price: 40 },   // pijama de estrellas
      hoppy: { price: 40 },    // con un peluchito
      katy: { price: 40 },     // pijama entero lila (Elora) y un peluchito
      oct: { price: 40 },        // bata gris con lazo y sombrerito de paja, sin gafas (dibujo de Elora)
      reno: { price: 40 },       // Chop: camisón largo rojo con arbolitos y gorro de Papá Noel (lo pensó Elora; lo hizo Clad)
      drake: { price: 40 },      // bata amarilla clarita con llamitas y un peluchito de humano (lo pensó Elora; lo hizo Clad)
      // ya hechos a partir de su dibujo de Elora (foto en assets/referencias/skins/<id>-pijama.webp)
      carot: { price: 40 },    // camisón rosa de corazones y un peluchito blanco con manchas
      froggy: { price: 40 },   // pijama azul con lunitas amarillas
      tarda: { price: 40 },    // pijama entero gris de osito, con orejitas
      jely: { price: 40 },     // gorro de dormir, luna, estrellas y montañas verdes
      perrita: { price: 40 },  // camisón largo azul con liritos, sin el lirio y un peluchito de perrito blanco con manchas negras (Elora)
    },
  },
  // Las skins de Navidad (las pensó Elora con Clad, con el quiz). De momento solo salen, gratis, con el modo Navidad
  // (Elora: «pon las skins en el código»). Se venden solo en Navidad (del 5 al 30 de diciembre, todos los años) por
  // 50 monedas cada una (Elora); con el modo Navidad son gratis
  invierno: {
    emoji: '🎄', navidad: true,
    personajes: {
      froggy: { price: 50 },   // abrigo azul, gorro torcido que tapa un ojo, bufanda y guantes
      carot: { price: 50 },    // abrigo largo rosa con bordes blancos, bufanda y gorro que tapa la oreja caída
      hoppy: { price: 50 },    // de reno: jersey MUY peludito, felpa con cuernos y nariz pintada
      katy: { price: 50 },     // de Papá Noel: jersey, gorro, barba de mentira y la mancha blanca
      tarda: { price: 50 },    // de muñeco de nieve, con su taza de chocolate
      gek: { price: 50 },      // plumífero rojo y guantes
      draila: { price: 50 },   // disfrazada de árbol de Navidad
      drake: { price: 50 },    // de elfo mágico
      oct: { price: 50 },      // abrigo largo negro, gorro con pompón morado, guantes de tentáculo y bufanda
      jely: { price: 50 },     // de estrella fugaz
      reno: { price: 50 },     // Chop: abrigo a rayas rojas y verdes y gorrito con agujero para el cuerno del lazo
      perrita: { price: 50 },  // abrigo, gorro y bufanda azules; el gorro en lugar del lirio (Elora)
    },
  },
  // Ropa nueva (Elora: "una skin para cada personaje, no un tema concreto, para variar: Carot con la ropa morada…";
  // la hizo Clad y Elora dirá qué cambiar). Nombre, precio y diseños [PROVISIONAL]
  ropa: {
    emoji: '✨',
    personajes: {
      carot: { price: 30 },    // vestido morado con estrellitas, lazo amarillo y bolsito turquesa
      froggy: { price: 30 },   // camiseta naranja con rayas blancas, pañuelo rojo de lunares y sombrero de vaquero (Elora)
      oct: { price: 30 },      // camiseta GAMER verde y cascos de música
      katy: { price: 30 },     // camiseta azul clarito y diadema con una flor rosa
      gek: { price: 30 },      // camiseta negra con «ROK!», gorra roja y monopatín azul
      jely: { price: 30 },     // vestido rosa con volantes blancos y collar de perlas
      tarda: { price: 30 },    // sombrero de copa y pajarita
      hoppy: { price: 30 },    // camiseta verde y margaritas pintadas en la maceta
      draila: { price: 30 },   // top morado y gafas de sol de corazón
      reno: { price: 30 },     // jersey azul y gafas redondas doradas
      drake: { price: 30 },    // camiseta negra con «FIRE» amarillo y gafas de sol
      perrita: { price: 30 },  // vestido morado (como el de Carot…) con el lirio blanco (Elora)
    },
  },
  osito: { emoji: '🧸', navidad: true, personajes: { tarda: { price: 50 } } },               // jersey, gorro de oso y guantes
  // plumíferos (Draila y Drake) y el jersey largo con gorro de lana de Jely
  abrigo: { emoji: '🧥', navidad: true, personajes: { draila: { price: 50 }, drake: { price: 50 }, jely: { price: 50 } } },
};
export function skinsDe(id) { return Object.keys(SKINS).filter((k) => SKINS[k].personajes[id]); }
// El personaje con una skin puesta (una copia: el personaje de siempre no cambia). Sin skin, el de siempre.
// Los Bloodies nunca la llevan: se dibujan con sus colores de Bloodie, no con los del personaje.
export function conSkin(ch, skin) {
  const base = characterById(ch.id);
  return skin && SKINS[skin] && SKINS[skin].personajes[base.id] ? { ...base, skin } : base;
}

const BLOODY = { color: '#a3141c', dark: '#5e0810' };
// Los Bloodies de colores normales, llenos de sangre (Elora). Llegarán con la actualización de los Bloodies (Elora):
// hasta entonces solo con su código secreto (holeway.modoBloodies). true = para todos ya.
export const BLOODIES_COLOR_NORMAL = false;
let coloresVisto = 0, coloresSi = false;
function bloodiesDeColores() {
  if (BLOODIES_COLOR_NORMAL) return true;
  const ahora = Date.now();
  if (ahora - coloresVisto > 1000) {   // se mira una vez por segundo, no en cada dibujo
    coloresVisto = ahora;
    try { coloresSi = localStorage.getItem('holeway.modoBloodies') === '1'; } catch (e) { coloresSi = false; }
  }
  return coloresSi;
}
// La sangre por encima del personaje (Bloodie de color normal): chorretones que caen de la cabeza, manchas por el
// cuerpo con gotitas alrededor y, al perseguir, una venita de enfado roja. Siempre igual para cada personaje
// (depende de su id), para que no baile. [PROVISIONAL cómo es la sangre]
function sangreEncima(ctx, ch, facing, walk, chasing) {
  let h = 7; for (const c of ch.id) h = (h * 31 + c.charCodeAt(0)) % 9973;
  const r = () => { h = (h * 73 + 41) % 9973; return h / 9973; };
  const [gx, gy] = CABEZA_ARRIBA[ch.shape] || [0, -23];
  const oscura = '#7a0b12', roja = '#b3131f', viva = '#d8232f';
  // chorretones desde lo alto de la cabeza
  for (let k = 0; k < 3; k++) {
    const x = gx - 5 + k * 5 + (r() - 0.5) * 2, y0 = gy + 1.5 + r() * 2, largo = 4 + r() * 6 + Math.sin(walk * 0.4 + k) * 0.8;
    ctx.fillStyle = k % 2 ? roja : viva;
    ctx.beginPath(); ctx.ellipse(x, y0, 2.3, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - 0.8, y0, 1.6, largo);
    ctx.beginPath(); ctx.arc(x, y0 + largo, 1.15, 0, Math.PI * 2); ctx.fill();
  }
  // manchas por el cuerpo y la cara, con gotitas alrededor
  for (let k = 0; k < 6; k++) {
    const x = (r() - 0.5) * 14, y = gy + 8 + r() * (18 - gy * 0.2), rad = 1.4 + r() * 2.2;
    ctx.fillStyle = k % 3 === 0 ? oscura : k % 3 === 1 ? roja : viva;
    ctx.beginPath(); ctx.ellipse(x, y, rad * 1.2, rad, r() * 3, 0, Math.PI * 2); ctx.fill();
    for (let g = 0; g < 3; g++) { const a = r() * Math.PI * 2, d = rad + 1 + r() * 1.8; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 0.5 + r() * 0.5, 0, Math.PI * 2); ctx.fill(); }
  }
  // al perseguir, una venita de enfado en la cabeza
  if (chasing && facing !== 'up') {
    const vx = gx + 6, vy = gy + 4;
    ctx.strokeStyle = viva; ctx.lineWidth = 1; ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { ctx.moveTo(vx + a * 0.6, vy + b * 0.6); ctx.lineTo(vx + a * 2, vy + b * 2); }
    ctx.stroke();
  }
}

// Poses (el editor de andar y correr de Elora): opts.pose = { bi, bd, pi, pd, cuerpo, sube }, en grados
// (sube en píxeles). bi/bd: brazo izquierdo/derecho (el de la izquierda de la pantalla mirando de frente);
// pi/pd: las piernas; ai/ad: las alas de Drake (Elora); cuerpo: inclinar todo el cuerpo; sube: subir o bajar.
// 0 = la postura de siempre.
// Positivo = girar en el sentido de las agujas del reloj.
export const PARTES_POSE = ['bi', 'bd', 'pi', 'pd', 'ai', 'ad', 'cuerpo', 'sube'];
const angPose = (opts, k) => (opts.pose && opts.pose[k] ? opts.pose[k] * Math.PI / 180 : 0);
const brazoPose = (opts, side) => angPose(opts, side < 0 ? 'bi' : 'bd');
const piernaPose = (opts, side) => angPose(opts, side < 0 ? 'pi' : 'pd');
// gira el punto p alrededor de piv
function girar(p, piv, a) {
  if (!a) return p;
  const c = Math.cos(a), sn = Math.sin(a), dx = p[0] - piv[0], dy = p[1] - piv[1];
  return [piv[0] + dx * c - dy * sn, piv[1] + dx * sn + dy * c];
}
// dibuja algo girado alrededor de (px, py)
function girado(ctx, a, px, py, fn) {
  if (!a) { fn(); return; }
  ctx.save(); ctx.translate(px, py); ctx.rotate(a); ctx.translate(-px, -py); fn(); ctx.restore();
}

// Dibuja un personaje visto desde arriba/atrás (vista tres cuartos).
// facing: 'up' | 'down' | 'left' | 'right'.  walk: fase de animación.  jumpH: altura del salto en px.
// opts.bloody = versión Bloodie (rota y sangrando). opts.chasing = enfadado, brazos arriba. opts.frozen = parado por Oct.
export function drawCharacter(ctx, ch, x, y, facing = 'down', walk = 0, jumpH = 0, blink = false, opts = {}) {
  const chasing = !!opts.chasing;
  // con una pose, los brazos y las piernas los pone la pose (no se balancean solos)
  const conPose = !!opts.pose;
  const bob = conPose ? -(opts.pose.sube || 0) : Math.sin(walk) * (chasing ? 2.5 : 1.5);
  if (conPose) walk = 0;
  const s = 1 - Math.min(jumpH, 40) / 110;
  // Elora (9-11-2026): los Bloodies con sus colores normales, pero con mucha sangre (antes eran todos rojos)
  const colorNormal = !!opts.bloody && ch.shape !== 'drakeSangriento' && bloodiesDeColores();
  const pal = opts.bloody && !colorNormal ? BLOODY : ch;
  const body = pal.color, dark = pal.dark;
  ctx.save();
  // sombra
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath(); ctx.ellipse(x, y + 10, 12 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill();

  if (blink) ctx.globalAlpha = 0.45;
  ctx.translate(x, y - jumpH + bob);
  // inclinar todo el cuerpo (pose), desde los pies
  if (conPose && opts.pose.cuerpo) { ctx.translate(0, 11); ctx.rotate(opts.pose.cuerpo * Math.PI / 180); ctx.translate(0, -11); }
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
    OWN_DRAW[ch.shape](ctx, pal, facing, walk, colorNormal ? { ...opts, bloody: false } : opts);
    if (colorNormal) sangreEncima(ctx, ch, facing, walk, chasing);
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
  // en Navidad, los Bloodies llevan gorrito de Papá Noel (Elora)
  if (opts.bloody && opts.navidad && ch.shape !== 'drakeSangriento') {
    const [gx, gy] = CABEZA_ARRIBA[ch.shape] || [0, -23];
    gorritoNavidad(ctx, gx, gy, true);
  }
  // y en la fiesta del Día del Niño, gorro de dormir (Elora: como si ellos también fueran a la fiesta de pijamas)
  else if (opts.bloody && opts.dormir && ch.shape !== 'drakeSangriento') {
    const [gx, gy] = CABEZA_ARRIBA[ch.shape] || [0, -23];
    gorroDormir(ctx, gx, gy);
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

// Dónde está lo alto de la cabeza de cada personaje (para el gorrito de Navidad de los Bloodies)
const CABEZA_ARRIBA = { carot: [-1, -22], frog: [0, -19.5], octopus: [0, -22.5], cat: [0, -23], lizard: [0, -23], jellyfish: [0, -23.5],
  tardigrade: [0, -21.5], hare: [0, -22], crocodile: [0, -28], dragon: [0, -22.5], reindeer: [0, -22.5] };
// Un gorrito de Papá Noel con la base en (x, y): rojo, con el borde blanco y la punta que cae con el pompón.
// sucio: el de los Bloodies, con el blanco manchado de sangre
function gorritoNavidad(ctx, x, y, sucio) {
  const rojo = '#cc2430', blanco = sucio ? '#eadfd4' : '#f7f6f0';
  ctx.fillStyle = rojo;
  ctx.beginPath(); ctx.moveTo(x - 6.4, y + 0.6);
  ctx.quadraticCurveTo(x - 4, y - 9, x + 2.6, y - 8.6);
  ctx.quadraticCurveTo(x + 8, y - 7.8, x + 9.6, y - 2.2);
  ctx.lineTo(x + 7.9, y - 1.6); ctx.quadraticCurveTo(x + 6.6, y - 4.2, x + 5.2, y - 2.6); ctx.lineTo(x + 6.4, y + 0.6);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = blanco; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 6.6, y + 0.9); ctx.quadraticCurveTo(x, y - 1.6, x + 6.6, y + 0.9); ctx.stroke();
  ctx.fillStyle = blanco; dot(ctx, x + 9.2, y - 1.4, 1.9);
  if (sucio) { ctx.fillStyle = '#a3141c'; dot(ctx, x - 2.4, y + 0.6, 0.7); dot(ctx, x + 9.6, y - 0.8, 0.6); }
}

// El gorro de dormir de los Bloodies en la fiesta del Día del Niño (Elora): largo, caído hacia un lado, a rayas
// azul oscuro y azul clarito (un poco manchado de sangre) y con un pompón amarillo
function gorroDormir(ctx, x, y) {
  const forma = () => {
    ctx.beginPath(); ctx.moveTo(x - 6.6, y + 0.8);
    ctx.quadraticCurveTo(x - 5, y - 9, x + 3, y - 9);
    ctx.quadraticCurveTo(x + 10, y - 9, x + 12.6, y + 4.4);
    ctx.lineTo(x + 10.4, y + 4.6); ctx.quadraticCurveTo(x + 8.6, y - 2.6, x + 5.6, y - 1.6); ctx.lineTo(x + 6.6, y + 0.8);
    ctx.closePath();
  };
  ctx.fillStyle = '#2c3f8f'; forma(); ctx.fill();
  ctx.save(); forma(); ctx.clip();
  ctx.strokeStyle = '#8fb8ff'; ctx.lineWidth = 1.4;
  ctx.beginPath(); for (let k = -8; k < 16; k += 3.4) { ctx.moveTo(x + k, y - 10); ctx.lineTo(x + k + 6, y + 6); } ctx.stroke();
  ctx.restore();
  ctx.strokeStyle = '#dfe9ff'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 6.6, y + 0.9); ctx.quadraticCurveTo(x, y - 1.4, x + 6.6, y + 0.9); ctx.stroke();
  ctx.fillStyle = '#f7d75a'; dot(ctx, x + 11.6, y + 5.6, 2);
  ctx.fillStyle = '#a3141c'; dot(ctx, x - 2.6, y + 0.4, 0.7); dot(ctx, x + 4, y - 6, 0.6);
}

// Un círculo relleno (cada uno con su propio trazo: así no hay líneas fantasma entre ellos).
function dot(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
// Una estrella de cuatro puntas (las del pijama de Draila).
function estrella(ctx, x, y, r) {
  const k = r * 0.3;
  ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.lineTo(x + k, y - k); ctx.lineTo(x + r, y); ctx.lineTo(x + k, y + k);
  ctx.lineTo(x, y + r); ctx.lineTo(x - k, y + k); ctx.lineTo(x - r, y); ctx.lineTo(x - k, y - k);
  ctx.closePath(); ctx.fill();
}
// La bata de Drake (Elora): amarilla clarita, con llamitas de fuego, un cinturón con lazo y, de frente,
// un peluchito de humano abrazado con un brazo.
function batoDrake(ctx, facing, piel) {
  const bata = '#fbe9a2', bataOsc = '#e3c76a';
  // la bata larga, hasta las rodillas, un poco más ancha por abajo
  const forma = () => {
    ctx.beginPath();
    ctx.moveTo(-5.5, -9.5); ctx.quadraticCurveTo(0, -10.5, 5.5, -9.5);
    ctx.quadraticCurveTo(7.6, -8.4, 7.4, -4); ctx.lineTo(8.2, 7.4);
    ctx.quadraticCurveTo(0, 8.8, -8.2, 7.4); ctx.lineTo(-7.4, -4);
    ctx.quadraticCurveTo(-7.6, -8.4, -5.5, -9.5); ctx.closePath();
  };
  forma(); ctx.fillStyle = bata; ctx.fill();
  ctx.save(); forma(); ctx.clip(); ctx.globalAlpha *= 0.5; ctx.fillStyle = bataOsc;
  ctx.beginPath(); ctx.ellipse(6.4, 0, 3.4, 11, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  // las llamitas: rojas por fuera y naranjas por dentro
  for (const [lx, ly, t] of [[-4.5, -6, 0.9], [4, -5, 0.75], [-2, 5.5, 1], [5, 5, 0.85], [-5.6, 1.6, 0.75], [1.2, -1.5, 0.65]]) {
    ctx.fillStyle = '#e8452c';
    ctx.beginPath(); ctx.moveTo(lx, ly - 3 * t); ctx.quadraticCurveTo(lx + 2.2 * t, ly, lx, ly + 1.6 * t); ctx.quadraticCurveTo(lx - 2.2 * t, ly, lx, ly - 3 * t); ctx.fill();
    ctx.fillStyle = '#ffa53a';
    ctx.beginPath(); ctx.moveTo(lx, ly - 1.4 * t); ctx.quadraticCurveTo(lx + 1.1 * t, ly + 0.4 * t, lx, ly + 1.2 * t); ctx.quadraticCurveTo(lx - 1.1 * t, ly + 0.4 * t, lx, ly - 1.4 * t); ctx.fill();
  }
  // el cuello en pico y el cinturón
  ctx.strokeStyle = bataOsc; ctx.lineWidth = 0.9;
  ctx.beginPath(); ctx.moveTo(-3.5, -9.8); ctx.lineTo(0, -4); ctx.lineTo(3.5, -9.8); ctx.moveTo(0, -4); ctx.lineTo(0, 8); ctx.stroke();
  ctx.fillStyle = bataOsc; ctx.fillRect(-7.5, 1.6, 15, 1.7);
  if (facing === 'up') return;
  ctx.beginPath(); ctx.ellipse(2.4, 2.5, 1.5, 0.9, -0.4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(5, 2.5, 1.5, 0.9, 0.4, 0, Math.PI * 2); ctx.fill();
  // el peluchito de humano: pelo marrón, cara clarita, camiseta azul y pantalón
  const px = -3, py = 0.8;
  ctx.fillStyle = '#3a5a9e'; ctx.fillRect(px - 1.1, py + 5.6, 1, 2.4); ctx.fillRect(px + 0.2, py + 5.6, 1, 2.4);
  ctx.fillStyle = '#5aa0e8'; rrect(ctx, px - 2, py + 2, 4, 4, 1); ctx.fill();
  ctx.fillStyle = '#f2c9a5'; dot(ctx, px - 2.6, py + 3.2, 0.8); dot(ctx, px + 2.6, py + 3.2, 0.8);
  ctx.fillStyle = '#f2c9a5'; dot(ctx, px, py, 2.3);
  ctx.fillStyle = '#6b4226'; ctx.beginPath(); ctx.arc(px, py - 0.4, 2.4, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
  ctx.fillStyle = '#2a2020'; dot(ctx, px - 0.8, py + 0.2, 0.3); dot(ctx, px + 0.8, py + 0.2, 0.3);
  ctx.strokeStyle = '#b5485a'; ctx.lineWidth = 0.35; ctx.beginPath(); ctx.arc(px, py + 0.8, 0.7, 0.3, Math.PI - 0.3); ctx.stroke();
  // el brazo de Drake (en la manga amarilla) que lo abraza
  ctx.strokeStyle = bata; ctx.lineWidth = 3; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-7, -5); ctx.quadraticCurveTo(-7.5, 4.5, -1.5, 5); ctx.stroke();
  ctx.fillStyle = piel; dot(ctx, -1.2, 4.9, 1.5);
}

// Una luna creciente (pijamas de Froggy y Jely): un círculo amarillo y otro del color de fondo encima.
function luna(ctx, x, y, r, ang, color, fondo) {
  ctx.fillStyle = color; dot(ctx, x, y, r);
  ctx.fillStyle = fondo; dot(ctx, x + Math.cos(ang) * r * 0.55, y + Math.sin(ang) * r * 0.55, r * 0.85);
}
// Un corazoncito (el camisón de Carot).
function corazon(ctx, x, y, r) {
  ctx.beginPath();
  ctx.moveTo(x, y + r);
  ctx.bezierCurveTo(x - r * 1.6, y - r * 0.2, x - r * 0.7, y - r * 1.3, x, y - r * 0.4);
  ctx.bezierCurveTo(x + r * 0.7, y - r * 1.3, x + r * 1.6, y - r * 0.2, x, y + r);
  ctx.closePath(); ctx.fill();
}
// El camisón de las skins de pijama (Hoppy y Caty): de los hombros hasta las rodillas, más ancho abajo,
// con mangas cortas.
function camison(ctx, top, color, oscuro) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(-6, top); ctx.lineTo(6, top); ctx.lineTo(8.5, 7.5); ctx.quadraticCurveTo(0, 9, -8.5, 7.5); ctx.closePath(); ctx.fill();
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 4.5 : -8.5, top, 4, 4.5);
  ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = oscuro;
  ctx.beginPath(); ctx.moveTo(3.5, top + 1); ctx.lineTo(6, top + 1); ctx.lineTo(7.8, 7.4); ctx.lineTo(5, 7.8); ctx.closePath(); ctx.fill();
  ctx.restore();
}
// El peluchito que llevan Hoppy y Caty en pijama (cartel de Elora): carita redonda con orejas y su cuerpo.
// orejas: 'caidas' (perrito), 'picos' (gatito) o 'redondas' (el de Carot: blanco, con las orejas
// rosas por dentro y manchas negras).
function peluche(ctx, x, y, color, oscuro, orejas) {
  if (orejas === 'redondas') {
    ctx.fillStyle = color;
    dot(ctx, x - 1.3, y + 6.4, 0.95); dot(ctx, x + 1.3, y + 6.4, 0.95);
    ctx.beginPath(); ctx.ellipse(x, y + 4, 2.2, 2.7, 0, 0, Math.PI * 2); ctx.fill();
    dot(ctx, x - 2.3, y + 3.2, 0.85); dot(ctx, x + 2.3, y + 3.2, 0.85);
    ctx.fillStyle = '#2a2226'; dot(ctx, x + 0.9, y + 4.6, 0.75); dot(ctx, x - 1, y + 3.4, 0.5); dot(ctx, x + 1.3, y + 6.4, 0.55);
    for (const side of [-1, 1]) { ctx.fillStyle = color; dot(ctx, x + side * 2.3, y - 2.3, 1.5); ctx.fillStyle = oscuro; dot(ctx, x + side * 2.3, y - 2.3, 0.8); }
    ctx.fillStyle = color; dot(ctx, x, y, 2.9);
    ctx.strokeStyle = '#2a2226'; ctx.lineWidth = 0.35;
    for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(x + side * 1.1, y - 0.4, 0.75, 0, Math.PI * 2); ctx.stroke(); }
    ctx.fillStyle = '#2a2226'; dot(ctx, x - 1.1, y - 0.4, 0.3); dot(ctx, x + 1.1, y - 0.4, 0.3);
    ctx.beginPath(); ctx.arc(x, y + 0.9, 0.8, 0.2, Math.PI - 0.2); ctx.stroke();
    return;
  }
  // el cuerpo (Elora: los peluches tienen cuerpo), con bracitos y patitas
  ctx.fillStyle = color;
  dot(ctx, x - 1.3, y + 6.4, 0.95); dot(ctx, x + 1.3, y + 6.4, 0.95);
  ctx.beginPath(); ctx.ellipse(x, y + 4, 2.2, 2.7, 0, 0, Math.PI * 2); ctx.fill();
  dot(ctx, x - 2.3, y + 3.2, 0.85); dot(ctx, x + 2.3, y + 3.2, 0.85);
  ctx.fillStyle = oscuro; ctx.save(); ctx.globalAlpha *= 0.5; ctx.beginPath(); ctx.ellipse(x, y + 4.4, 1.1, 1.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.fillStyle = oscuro;
  if (orejas === 'picos') {
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(x + side * 1, y - 2); ctx.lineTo(x + side * 2.8, y - 4.4); ctx.lineTo(x + side * 3.1, y - 1); ctx.closePath(); ctx.fill();
    }
  } else {
    for (const side of [-1, 1]) { ctx.beginPath(); ctx.ellipse(x + side * 2.9, y + 0.3, 1.1, 2.1, side * 0.4, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.fillStyle = color; dot(ctx, x, y, 2.9);
  ctx.fillStyle = '#2a2020'; dot(ctx, x - 1.1, y - 0.4, 0.42); dot(ctx, x + 1.1, y - 0.4, 0.42);
  ctx.fillStyle = '#b5485a'; dot(ctx, x, y + 0.8, 0.45);
}

// Rectángulo con las esquinas redondeadas (la función del navegador para esto no existe en los algo viejos).
export function rrect(ctx, x, y, w, h, r) {
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
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  // skin de pijama (dibujo de Elora): camisón rosa con corazones rojos, sin lazo, ni collar, ni
  // bolsito, y un peluchito blanco con manchas negras abrazado con un brazo
  const pj = pal.skin === 'pijama' && !B;
  // skin de Navidad (la pensó Elora con el quiz): abrigo largo rosa como su lazo, con los bordes blancos y
  // botones como los de Froggy, bufanda del mismo rosa con blanco, y un gorro rosa como el lazo que le tapa la
  // oreja izquierda (la caída)
  const inv = pal.skin === 'invierno' && !B;
  const dress = B ? '#5e0810' : pj ? '#f2aebb' : rp ? '#a07ad8' : '#ef9cc0', dressDark = B ? '#3a0408' : pj ? '#d9798f' : rp ? '#7048b0' : '#c4587f';
  const bow = B ? '#7a0b12' : rp ? '#ffd23f' : '#d63a7a';
  const rosa = '#d63a7a', rosaOsc = '#a3245a', blanco = '#fbf6f8';
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
    girado(ctx, piernaPose(opts, side), side * 3.5, 4, () => {
      ctx.fillRect(side * 3.5 - 1.6, 4, 3.2, 7 + lift);
      ctx.beginPath(); ctx.ellipse(side * 4, 11 + lift, 3, 1.8, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  // con pose: los dos brazos sueltos, para poder moverlos (sin pose, uno va cruzado sobre la tripa)
  const brazosSueltos = !!opts.pose && !B;
  // brazos: de Bloodie, colgando o arriba al perseguir
  if (B || brazosSueltos) {
    ctx.strokeStyle = skinDark; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const side of [-1, 1]) {
      if (pj && !back && side < 0) continue;   // en pijama, ese brazo abraza el peluchito
      const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 5 : 2);
      const mano = girar(chasing ? [side * 14 + sw, -18 + Math.abs(sw)] : [side * 9 + sw * 0.5, 5], [side * 6, -4], brazoPose(opts, side));
      if (brazosSueltos) { ctx.strokeStyle = skin; ctx.lineWidth = 2.6; }
      ctx.beginPath(); ctx.moveTo(side * 6, -4); ctx.lineTo(mano[0], mano[1]); ctx.stroke();
      if (brazosSueltos) { ctx.fillStyle = skin; dot(ctx, mano[0], mano[1], 1.6); }
    }
  }
  if (inv) {
    // el abrigo largo rosa, con los bordes blancos (abajo, por delante y en las mangas) y los botones grandes
    ctx.fillStyle = rosa;
    ctx.beginPath(); ctx.moveTo(-6.4, -8); ctx.lineTo(6.4, -8); ctx.lineTo(8.6, 9); ctx.lineTo(-8.6, 9); ctx.closePath(); ctx.fill();
    for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 4.6 : -8.2, -8, 3.6, 4.4);
    ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = rosaOsc;
    ctx.beginPath(); ctx.moveTo(3.6, -7); ctx.lineTo(6.2, -7); ctx.lineTo(8.4, 8.8); ctx.lineTo(5.4, 8.8); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = blanco;
    ctx.beginPath(); ctx.moveTo(-8.25, 6.6); ctx.lineTo(8.25, 6.6); ctx.lineTo(8.6, 9); ctx.lineTo(-8.6, 9); ctx.closePath(); ctx.fill();   // el bajo
    for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 4.6 : -8.2, -4.6, 3.6, 1);   // los puños de las mangas
    if (!back) {
      ctx.fillRect(0, -6.5, 1.1, 13.4);   // el borde de delante
      for (const by of [-4, 0, 4]) { ctx.fillStyle = blanco; dot(ctx, -1.8, by, 1.2); ctx.fillStyle = rosaOsc; dot(ctx, -1.8, by, 0.45); }
      // el brazo cruzado sobre la tripa, en su manga rosa con el puño blanco, y el bolsito
      if (!brazosSueltos) {
        ctx.strokeStyle = rosa; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-6, -5); ctx.quadraticCurveTo(-7, 1, -2, 1); ctx.stroke();
        ctx.fillStyle = blanco; dot(ctx, -2, 1, 1.6);
        ctx.fillStyle = skin; dot(ctx, -0.6, 1, 1.4);
      }
      ctx.strokeStyle = rosaOsc; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(4, -7); ctx.lineTo(7.5, 0); ctx.stroke();
      ctx.fillStyle = '#9b3f62'; ctx.fillRect(6, 0, 4, 3.5);
    } else {
      ctx.fillStyle = tail; dot(ctx, 0, 4, 3);
    }
    // la bufanda rosa con rayas blancas, y la punta que cuelga
    ctx.fillStyle = rosa; rrect(ctx, -6.4, -9.6, 12.8, 3.4, 1.6); ctx.fill();
    ctx.fillStyle = blanco; for (const x of [-4.6, -1.4, 1.8, 5]) ctx.fillRect(x, -9.6, 1.1, 3.4);
    if (!back) {
      ctx.fillStyle = rosa; rrect(ctx, 2.2, -7.4, 2.8, 7, 1.1); ctx.fill();
      ctx.fillStyle = blanco; ctx.fillRect(2.2, -4.8, 2.8, 1); ctx.fillRect(2.2, -2.4, 2.8, 1);
    }
  } else if (pj) {
    // el camisón, largo y recto, con corazones rojos
    ctx.fillStyle = dress;
    ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.lineTo(8, 8); ctx.lineTo(-8, 8); ctx.closePath(); ctx.fill();
    for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 4.5 : -8, -8, 3.5, 4);
    ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = dressDark;
    ctx.beginPath(); ctx.moveTo(3.5, -7); ctx.lineTo(6, -7); ctx.lineTo(7.8, 7.8); ctx.lineTo(5, 7.8); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#d83a52';
    for (const [cx, cy, r] of [[-3.8, -5.4, 0.9], [2.6, -6, 0.7], [-4.6, 2.6, 1.3], [3.4, 1.4, 0.9], [-1.2, 5.6, 0.8], [4.6, 5.8, 1], [0.6, -1.4, 0.7]]) corazon(ctx, cx, cy, r);
    if (!back) {
      // el peluchito, abrazado con un brazo (dibujo de Elora)
      peluche(ctx, -0.6, -3.2, '#fbf8f4', '#f2a6b8', 'redondas');
      ctx.strokeStyle = skin; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-6, -5); ctx.quadraticCurveTo(-6.5, 1.5, 1.2, 1); ctx.stroke();
      ctx.fillStyle = skin; dot(ctx, 1.4, 1, 1.5);
    } else {
      ctx.fillStyle = tail; dot(ctx, 0, 4, 3);
    }
  } else {
  // vestido trapecio con la tira de corazones abajo
  ctx.fillStyle = dress;
  ctx.beginPath(); ctx.moveTo(-6, -7); ctx.lineTo(6, -7); ctx.lineTo(11, 7); ctx.lineTo(-11, 7); ctx.closePath(); ctx.fill();
  ctx.fillStyle = dressDark;
  ctx.beginPath(); ctx.moveTo(-9.9, 4); ctx.lineTo(9.9, 4); ctx.lineTo(11, 7); ctx.lineTo(-11, 7); ctx.closePath(); ctx.fill();
  if (rp) { ctx.fillStyle = '#ffe36b'; for (const [x, y, r] of [[-7.4, 2.4, 1.8], [7.6, 2.6, 1.8], [2.2, -4.6, 1.7], [-3.6, -4.2, 1.4], [4.6, -0.6, 1.3]]) estrella(ctx, x, y, r); }
  if (!B) { ctx.fillStyle = rp ? '#fff3a0' : '#ffd6e6'; for (let x = -8; x <= 8; x += 4) ctx.fillRect(x - 0.6, 5, 1.2, 1.2); }
  if (!back) {
    // un brazo cruzado sobre la tripa (como en el dibujo) y el bolsito colgado
    if (!B && !brazosSueltos) {
      ctx.strokeStyle = skin; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-6, -5); ctx.quadraticCurveTo(-7, 1, -1, 1); ctx.stroke();
    }
    ctx.strokeStyle = dressDark; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(4, -7); ctx.lineTo(7.5, 0); ctx.stroke();
    ctx.fillStyle = B ? '#2a0306' : rp ? '#3fb3a8' : '#9b3f62';
    ctx.fillRect(6, 0, 4, 3.5);
  } else {
    ctx.fillStyle = tail; dot(ctx, 0, 4, 3);
  }
  // collar de corazones
  ctx.fillStyle = dressDark; ctx.fillRect(-5, -8.5, 10, 2.5);
  if (!B) { ctx.fillStyle = rp ? '#fff3a0' : '#ffd6e6'; for (let x = -3; x <= 3; x += 3) ctx.fillRect(x - 0.5, -7.8, 1, 1); }
  }
  // orejas: la de la derecha tiesa, la de la izquierda caída; las dos del color del cuerpo
  // (Elora: en la ficha la caída salió más naranja por error)
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.ellipse(hx + 4, hy - 11, 3, 8, 0.2, 0, Math.PI * 2); ctx.fill();
  if (!B) { ctx.fillStyle = '#f7c9b0'; ctx.beginPath(); ctx.ellipse(hx + 4.3, hy - 11, 1.4, 5.5, 0.2, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = skin;
  if (!inv) { ctx.beginPath(); ctx.ellipse(hx - 7, hy - 8, 2.8, 6.5, -0.9, 0, Math.PI * 2); ctx.fill(); }   // (con el gorro, tapada)
  // cabeza
  ctx.fillStyle = skin; dot(ctx, hx, hy, 9.5);
  if (inv) {
    // el gorro rosa como el lazo, torcido hacia la izquierda, tapando la oreja caída; la oreja tiesa sale por arriba
    ctx.save(); ctx.translate(hx - 2.6, hy - 6.4); ctx.rotate(-0.4);
    ctx.fillStyle = rosa;
    ctx.beginPath(); ctx.moveTo(-8.6, 1.4); ctx.quadraticCurveTo(-8.8, -8.2, 0, -8.6); ctx.quadraticCurveTo(8.8, -8.2, 8.6, 1.4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rosaOsc; ctx.lineWidth = 0.6;
    ctx.beginPath(); for (const x of [-5, -2.5, 0, 2.5, 5]) { ctx.moveTo(x, -0.6); ctx.lineTo(x * 0.85, -7.4); } ctx.stroke();
    ctx.fillStyle = rosaOsc; rrect(ctx, -9.2, -1.2, 18.4, 3.2, 1.5); ctx.fill();   // el borde doblado
    ctx.restore();
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.ellipse(hx + 4, hy - 11, 3, 8, 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#f7c9b0'; ctx.beginPath(); ctx.ellipse(hx + 4.3, hy - 11, 1.4, 5.5, 0.2, 0, Math.PI * 2); ctx.fill();
  }
  // lazo grande arriba a la izquierda (en pijama y con el gorro no lo lleva)
  if (!pj && !inv) {
  ctx.fillStyle = bow;
  ctx.beginPath(); ctx.ellipse(hx - 7.5, hy - 7, 4, 3, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx - 1.5, hy - 9.5, 3.6, 3, 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = B ? '#3a0408' : rp ? '#d9a400' : '#a3245a'; dot(ctx, hx - 4.5, hy - 8.3, 1.7);
  }
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
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const teeth = B ? '#e8d8c0' : '#f6f3e8', line = B ? '#2a0306' : '#26331f';
  const ex = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
  const hx = ex, hy = -14;
  const step = Math.sin(walk) * 1.5;
  // skin de Navidad (la pensó Elora con el quiz): ropa de invierno. Abrigo azul con botones grandes, gorro de lana
  // azul con pompón, bufanda blanca con rayas azules y guantes azules con el borde blanco
  const inv = pal.skin === 'invierno' && !B;
  const abrigo = '#3d6fd6', abrigoOsc = '#2a4f9e', blanco = '#f4f6fb';

  // piernas dobladas
  ctx.strokeStyle = skin; ctx.lineWidth = 3.6; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.6 : 0;
    girado(ctx, piernaPose(opts, side), side * 4, 5, () => {
      ctx.beginPath(); ctx.moveTo(side * 4, 5); ctx.quadraticCurveTo(side * 9, 8, side * 6, 11 + lift); ctx.stroke();
      ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(side * 7, 11.5 + lift, 3.4, 1.7, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  // colita (el triangulito de abajo del dibujo)
  ctx.fillStyle = skinDark;
  ctx.beginPath(); ctx.moveTo(-6, 4); ctx.lineTo(-10, 8); ctx.lineTo(-5.5, 7.5); ctx.closePath(); ctx.fill();
  // brazos largos y curvos con deditos (de Bloodie que persigue, arriba)
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.5);
    const aF = brazoPose(opts, side), hombroF = [side * 6, -5];
    const hand = girar(chasing ? [side * 15 + sw, -17 + Math.abs(sw)] : [side * 14 + sw * 0.4, 3], hombroF, aF);
    const ctlF = girar([side * 15, chasing ? -8 : -6], hombroF, aF);
    ctx.strokeStyle = inv ? abrigo : skin; ctx.lineWidth = inv ? 3.8 : 3.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(side * 6, -5); ctx.quadraticCurveTo(ctlF[0], ctlF[1], hand[0], hand[1]); ctx.stroke();
    if (inv) {
      // el guante azul con el borde blanco
      const u = 0.82, cx0 = (1 - u) * (1 - u) * side * 6 + 2 * (1 - u) * u * ctlF[0] + u * u * hand[0];
      const cy0 = (1 - u) * (1 - u) * -5 + 2 * (1 - u) * u * ctlF[1] + u * u * hand[1];
      ctx.fillStyle = blanco; dot(ctx, cx0, cy0, 2.3);
      ctx.fillStyle = abrigo; dot(ctx, hand[0], hand[1] + 0.6, 2.4);
      ctx.fillStyle = abrigoOsc; dot(ctx, hand[0] - side * 1.6, hand[1] - 0.2, 1);   // el dedo gordo
      continue;
    }
    ctx.fillStyle = skinDark;
    girado(ctx, aF, hand[0], hand[1], () => { for (let k = -1; k <= 1; k++) dot(ctx, hand[0] + k * 1.6, hand[1] + (chasing ? -1.6 : 1.8), 1.1); });
  }
  // camiseta larga azul verdoso con mangas cortas (Elora), que tapa todo el cuerpo hasta las piernas;
  // con la skin de pijama (dibujo de Elora), azul con lunitas amarillas
  const pj = pal.skin === 'pijama';
  const shirt = B ? '#5e0810' : pj ? '#3c74d4' : rp ? '#f39a3c' : '#6fd0c4', shirtDark = B ? '#3a0408' : pj ? '#28529e' : rp ? '#c8701e' : '#3f9e93';
  if (inv) {
    // el abrigo azul, largo hasta las piernas, con la tira del medio y los botones grandes
    ctx.fillStyle = abrigo; rrect(ctx, -7.6, -8.6, 15.2, 17.4, 3.4); ctx.fill();
    ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = abrigoOsc; ctx.fillRect(4.2, -7.6, 2.6, 15.6); ctx.restore();
    // el borde de abajo, blanco (Elora)
    ctx.save(); rrect(ctx, -7.6, -8.6, 15.2, 17.4, 3.4); ctx.clip(); ctx.fillStyle = blanco; ctx.fillRect(-8, 6.4, 16, 3); ctx.restore();
    if (!back) {
      ctx.strokeStyle = abrigoOsc; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(0.4, -6); ctx.lineTo(0.4, 6.4); ctx.stroke();
      for (const by of [-3.6, 0.6, 4.8]) { ctx.fillStyle = blanco; dot(ctx, -1.4, by, 1.25); ctx.fillStyle = abrigoOsc; dot(ctx, -1.4, by, 0.45); }
    }
    // la bufanda blanca con rayas azules, y la punta que cuelga por delante
    ctx.fillStyle = blanco; rrect(ctx, -7.4, -10.4, 14.8, 3.6, 1.7); ctx.fill();
    ctx.fillStyle = abrigo; for (const x of [-5, -1.5, 2, 5.5]) ctx.fillRect(x, -10.4, 1.2, 3.6);
    if (!back) {
      ctx.fillStyle = blanco; rrect(ctx, 3, -8, 3, 8, 1.2); ctx.fill();
      ctx.fillStyle = abrigo; ctx.fillRect(3, -5.2, 3, 1.1); ctx.fillRect(3, -2.4, 3, 1.1);
      ctx.strokeStyle = blanco; ctx.lineWidth = 0.6;   // los flecos
      ctx.beginPath(); for (const x of [3.6, 4.5, 5.4]) { ctx.moveTo(x, 0); ctx.lineTo(x, 1.4); } ctx.stroke();
    }
  } else {
  ctx.fillStyle = shirt;
  rrect(ctx, -7, -8, 14, 15, 3); ctx.fill();
  ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = shirtDark; ctx.fillRect(4, -7, 2.5, 13); ctx.restore();
  ctx.fillStyle = shirt;
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 5 : -9, -8, 4, 4.5);
  ctx.strokeStyle = shirtDark; ctx.lineWidth = 0.8;
  for (const side of [-1, 1]) { ctx.beginPath(); ctx.moveTo(side > 0 ? 9 : -9, -3.5); ctx.lineTo(side > 0 ? 5.5 : -5.5, -3.5); ctx.stroke(); }
  // cuello de la camiseta
  ctx.beginPath(); ctx.moveTo(-3, -8); ctx.lineTo(0, -5.5); ctx.lineTo(3, -8); ctx.stroke();
  if (rp) {   // las rayas blancas de la camiseta nueva
    ctx.save(); rrect(ctx, -7, -8, 14, 15, 3); ctx.clip(); ctx.fillStyle = '#fff3e0';
    for (const y of [-3.2, 0.8, 4.8]) ctx.fillRect(-8, y, 16, 1.5);
    ctx.restore();
    if (!back) {   // el pañuelo rojo de lunares, atado al cuello
      ctx.fillStyle = '#d8343c'; ctx.beginPath(); ctx.moveTo(-6.4, -8.4); ctx.lineTo(6.4, -8.4); ctx.lineTo(0, -1.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fff3e0'; for (const [x, y] of [[-3, -7], [2.4, -6.6], [0, -4]]) dot(ctx, x, y, 0.6);
    }
  }
  }
  if (pj && !B) {
    for (const [lx, ly, a] of [[-4, -4.5, 0.6], [2.6, -3.2, 2.4], [-2, 0.4, 3.6], [4, 1.6, 0.2], [-4.4, 4.2, 2], [1.2, 4.6, 4.4], [-7, -6.2, 1], [7, -6.4, 2.6]]) {
      luna(ctx, lx, ly, 1.3, a, '#f5d94a', shirt);
    }
  }
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
  if (inv) {
    // el gorro de lana azul con el pompón, ancho y bien metido en la cabeza (Elora), torcido y tapando el ojo
    // de la derecha (Elora). El ojo de la izquierda asoma por debajo
    ctx.save(); ctx.translate(hx + 2.4, hy - 4.2); ctx.rotate(0.38);
    ctx.fillStyle = abrigo;
    ctx.beginPath(); ctx.moveTo(-9.6, 1.6); ctx.quadraticCurveTo(-9.8, -9.4, 0, -9.8);
    ctx.quadraticCurveTo(9.8, -9.4, 9.6, 1.6); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); ctx.globalAlpha *= 0.35; ctx.fillStyle = abrigoOsc; ctx.beginPath(); ctx.ellipse(7, -3.6, 3, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.strokeStyle = abrigoOsc; ctx.lineWidth = 0.6;   // las rayitas de la lana
    ctx.beginPath(); for (const x of [-6, -3, 0, 3, 6]) { ctx.moveTo(x, -0.6); ctx.lineTo(x * 0.85, -8.2); } ctx.stroke();
    ctx.fillStyle = abrigoOsc; rrect(ctx, -10.2, -1.2, 20.4, 3.4, 1.6); ctx.fill();   // el borde doblado
    ctx.fillStyle = blanco; dot(ctx, 0.6, -10.6, 2.4);                                 // el pompón
    ctx.restore();
    if (!back) {
      // el ojo de la izquierda, que asoma por debajo del gorro
      const ox = hx - 6.5;
      ctx.fillStyle = skin; dot(ctx, ox, hy - 5.5, 3.4);
      ctx.fillStyle = '#fff'; dot(ctx, ox, hy - 5.8, 2.2);
      ctx.fillStyle = line; dot(ctx, ox + ex * 0.5, hy - 5.6, 1.1);
    }
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (rp) {
    // el sombrero de vaquero (Elora: «le pega con la ropa que lleva»), entre los dos ojos
    const sx = hx, sy = hy - 11.4;   // encima de la cabeza, sin tapar los ojos
    ctx.fillStyle = '#7a4a24'; ctx.beginPath(); ctx.ellipse(sx, sy + 0.6, 11.5, 2.6, 0, 0, Math.PI * 2); ctx.fill();   // el ala
    ctx.fillStyle = '#a0683a';
    ctx.beginPath(); ctx.moveTo(sx - 9.5, sy - 0.2); ctx.quadraticCurveTo(sx - 12.5, sy - 3.4, sx - 11.5, sy - 3.6);
    ctx.quadraticCurveTo(sx, sy + 3.2, sx + 11.5, sy - 3.6); ctx.quadraticCurveTo(sx + 12.5, sy - 3.4, sx + 9.5, sy - 0.2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(sx - 5.6, sy - 0.4); ctx.lineTo(sx - 4.8, sy - 8); ctx.quadraticCurveTo(sx - 2.4, sy - 9.4, sx, sy - 7.4);
    ctx.quadraticCurveTo(sx + 2.4, sy - 9.4, sx + 4.8, sy - 8); ctx.lineTo(sx + 5.6, sy - 0.4); ctx.closePath(); ctx.fill();   // la copa con su hundido
    ctx.fillStyle = '#d8343c'; ctx.fillRect(sx - 5.4, sy - 2.6, 10.8, 1.8);   // la cinta roja, como el pañuelo
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(sx - 3.8, sy - 7, 1.2, 4);
  }
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
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const shirt = B ? '#5e0810' : rp ? '#5fc27a' : '#9b6ad0', shirtDark = B ? '#3a0408' : rp ? '#3a9a55' : '#6b3fa6';
  const sucker = B ? '#c9a0a0' : '#f3d65a';
  // skin de pijama (dibujo de Elora): una bata gris larga con un lazo en la cintura y un sombrerito de
  // paja en el pecho (Elora quería poner «ONE PIECE», pero eso tiene dueño), y sin gafas, para dormir
  const pj = pal.skin === 'pijama' && !B;
  const bata = '#bdb8c6', bataOsc = '#8f8a9c';
  // skin de Navidad (la pensó Elora con el quiz): abrigo largo negro con botones, gorro negro con pompón morado,
  // guantes de tentáculo morados y bufanda
  const inv = pal.skin === 'invierno' && !B;
  const negro = '#26232c', negroOsc = '#141218', morado = '#9b6ad0', moradoOsc = '#6b3fa6';
  const bufanda = [morado, negro];   // los colores de la bufanda, a rayas
  const line = B ? '#2a0306' : '#1f2a33';
  // hacia dónde apuntan los tentáculos de la cara: de frente, a la izquierda como en la ficha
  const dir = facing === 'right' ? 1 : -1;
  const ex = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
  const hx = ex, hy = -15;   // la cabeza va justo encima de la camiseta (sin cuello: Elora)

  // los dos tentáculos-brazo son iguales, uno a cada lado, bajados (Elora: en la ficha uno está
  // levantado solo porque saluda). De Bloodie que persigue, arriba y agitándolos.
  const brazo = (side, fase) => {
    const sw = Math.sin(walk * (chasing ? 2 : 0.8) + fase) * (chasing ? 3 : 1.2);
    const aO = brazoPose(opts, side);
    const ctl = girar(chasing ? [side * 15, -8] : [side * 13, -4], [side * 6, -5], aO);
    const end = girar(chasing ? [side * 13 + sw, -24] : [side * 12 + sw * 0.4, 2], [side * 6, -5], aO);
    ctx.strokeStyle = skin; ctx.lineWidth = 3.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(side * 6, -5); ctx.quadraticCurveTo(ctl[0], ctl[1], end[0], end[1]); ctx.stroke();
    if (inv) {
      // el guante de tentáculo morado (todo el tentáculo) y la manga negra del abrigo hasta la mitad
      ctx.strokeStyle = morado; ctx.lineWidth = 3.6;
      ctx.beginPath(); ctx.moveTo(side * 6, -5); ctx.quadraticCurveTo(ctl[0], ctl[1], end[0], end[1]); ctx.stroke();
      const m = 0.45, c1 = [side * 6 + (ctl[0] - side * 6) * m, -5 + (ctl[1] + 5) * m];
      const u = 1 - m, pm = [u * u * side * 6 + 2 * u * m * ctl[0] + m * m * end[0], u * u * -5 + 2 * u * m * ctl[1] + m * m * end[1]];
      ctx.strokeStyle = negro; ctx.lineWidth = 4.2;
      ctx.beginPath(); ctx.moveTo(side * 6, -5); ctx.quadraticCurveTo(c1[0], c1[1], pm[0], pm[1]); ctx.stroke();
      ctx.fillStyle = moradoOsc; dot(ctx, pm[0], pm[1], 1.6);   // el borde del guante
      return;
    }
    if (pj) {
      // la manga larga de la bata, hasta la mitad del tentáculo (el trozo de la curva de 0 a 0,5)
      const m = 0.5, c1 = [side * 6 + (ctl[0] - side * 6) * m, -5 + (ctl[1] + 5) * m];
      const u = 1 - m, pm = [u * u * side * 6 + 2 * u * m * ctl[0] + m * m * end[0], u * u * -5 + 2 * u * m * ctl[1] + m * m * end[1]];
      ctx.strokeStyle = bata; ctx.lineWidth = 3.8;
      ctx.beginPath(); ctx.moveTo(side * 6, -5); ctx.quadraticCurveTo(c1[0], c1[1], pm[0], pm[1]); ctx.stroke();
    }
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
  if (inv) {
    // el abrigo largo negro, hasta casi abajo (asoman las puntas de los tentáculos), con las solapas y los botones
    ctx.fillStyle = negro;
    ctx.beginPath(); ctx.moveTo(-7, -9); ctx.lineTo(7, -9); ctx.lineTo(8.6, 8.4); ctx.lineTo(-8.6, 8.4); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalAlpha *= 0.6; ctx.fillStyle = negroOsc;
    ctx.beginPath(); ctx.moveTo(3.5, -8); ctx.lineTo(6.5, -8); ctx.lineTo(8.2, 8); ctx.lineTo(5, 8); ctx.closePath(); ctx.fill(); ctx.restore();
    if (!back) {
      ctx.strokeStyle = '#4a4552'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(0.6, -6); ctx.lineTo(0.6, 8.2); ctx.stroke();
      for (const by of [-3.6, 0.8, 5]) { ctx.fillStyle = morado; dot(ctx, -1.4, by, 1.15); ctx.fillStyle = moradoOsc; dot(ctx, -1.4, by, 0.45); }
    }
    // la bufanda a rayas y la punta que cuelga
    ctx.fillStyle = bufanda[0]; rrect(ctx, -6.8, -10.4, 13.6, 3.4, 1.6); ctx.fill();
    ctx.fillStyle = bufanda[1]; for (const x of [-4.8, -1.4, 2, 5.2]) ctx.fillRect(x, -10.4, 1.2, 3.4);
    if (!back) {
      ctx.fillStyle = bufanda[0]; rrect(ctx, 2.6, -8, 3, 8, 1.2); ctx.fill();
      ctx.fillStyle = bufanda[1]; ctx.fillRect(2.6, -5.2, 3, 1.1); ctx.fillRect(2.6, -2.4, 3, 1.1);
    }
  } else if (pj) {
    // la bata gris, larga hasta casi abajo (asoman las puntas de los tentáculos), con el cuello en pico
    ctx.fillStyle = bata;
    ctx.beginPath(); ctx.moveTo(-7, -9); ctx.lineTo(7, -9); ctx.lineTo(9, 8); ctx.lineTo(-9, 8); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalAlpha *= 0.45; ctx.fillStyle = bataOsc;
    ctx.beginPath(); ctx.moveTo(3.5, -8); ctx.lineTo(6.5, -8); ctx.lineTo(8.5, 7.6); ctx.lineTo(5, 7.6); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = bataOsc; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(-3, -9); ctx.lineTo(0.5, -2); ctx.lineTo(0.5, 8); ctx.moveTo(3, -9); ctx.lineTo(0.5, -2); ctx.stroke();
    // el cinturón con el lazo
    ctx.fillStyle = bataOsc; ctx.fillRect(-8, 0, 16, 1.6);
    if (!back) {
      ctx.fillStyle = '#d8d4de';
      ctx.beginPath(); ctx.ellipse(-1.3, 0.8, 1.6, 1.1, -0.4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(1.3, 0.8, 1.6, 1.1, 0.4, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(-1, 1.4, 0.9, 3.6); ctx.fillRect(0.4, 1.4, 0.9, 3);
      // el sombrerito de paja en el pecho: el ala, la copa y la cinta roja
      ctx.fillStyle = '#f2cf4a'; ctx.beginPath(); ctx.ellipse(-2.6, -4, 2.6, 0.9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(-2.6, -4.9, 1.5, 1.3, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#d42a36'; ctx.fillRect(-4.1, -4.6, 3, 0.6);
    }
  } else {
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
  }
  // el brazo de delante, igual que el otro
  brazo(dir, 1);
  // cabeza redonda
  ctx.fillStyle = skin; dot(ctx, hx, hy, 8);
  if (inv) {
    // el gorro de lana negro con el pompón morado
    ctx.fillStyle = negro;
    ctx.beginPath(); ctx.moveTo(hx - 7.6, hy - 5.4); ctx.quadraticCurveTo(hx - 7.4, hy - 13.4, hx, hy - 13.6); ctx.quadraticCurveTo(hx + 7.4, hy - 13.4, hx + 7.6, hy - 5.4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#3d3846'; ctx.lineWidth = 0.6;
    ctx.beginPath(); for (const x of [-4.4, -1.5, 1.5, 4.4]) { ctx.moveTo(hx + x, hy - 7); ctx.lineTo(hx + x * 0.85, hy - 12.4); } ctx.stroke();
    ctx.fillStyle = negroOsc; rrect(ctx, hx - 8, hy - 7.6, 16, 2.6, 1.2); ctx.fill();
    ctx.fillStyle = morado; dot(ctx, hx, hy - 14.6, 2.5);
    ctx.fillStyle = '#b994e6'; dot(ctx, hx - 0.7, hy - 15.3, 0.8);
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (rp) {   // los cascos de música (la ropa nueva)
    ctx.strokeStyle = '#26232c'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(hx, hy, 10.2, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke();
    for (const side of [-1, 1]) { ctx.fillStyle = '#26232c'; rrect(ctx, hx + side * 10 - 2.2, hy - 3, 4.4, 6.4, 1.8); ctx.fill(); ctx.fillStyle = '#a6e35a'; rrect(ctx, hx + side * 10 - 1.4, hy - 2.2, 2.8, 4.8, 1.2); ctx.fill(); }
  }
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
  // gafas redondas con los ojos grandes (cada círculo en su propio trazo); en pijama, sin gafas (Elora)
  const ec = hx + dir * 2.2;
  const eyeC = B ? (chasing ? '#ffe36b' : '#7a0b12') : line;
  for (const side of [-1, 1]) {
    const x = ec + side * 3.1;
    ctx.fillStyle = B ? '#f0d0c8' : '#fff'; dot(ctx, x, hy - 2.5, 2.4);
    ctx.fillStyle = eyeC; dot(ctx, x + dir * 0.4, hy - 2.4, 1.3);
    if (pj) continue;
    ctx.strokeStyle = line; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.arc(x, hy - 2.5, 2.6, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.strokeStyle = line; ctx.lineWidth = 0.8;
  if (!pj) { ctx.beginPath(); ctx.moveTo(ec - 0.5, hy - 2.5); ctx.lineTo(ec + 0.5, hy - 2.5); ctx.stroke(); }
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
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  const lila = B ? '#c9a0a0' : '#a9a2e6';
  // skin de pijama (hecha por Clad a partir del cartel de Elora; Elora la dejó así): camisón entero lila (Elora) y un peluchito
  const pj = pal.skin === 'pijama';
  // skin de Navidad (la pensó Elora con el quiz): de Papá Noel. Jersey rojo con el borde de pelito blanco y un
  // cinturón negro, gorro de Papá Noel y una barba blanca de mentira
  const inv = pal.skin === 'invierno' && !B;
  const rojoPN = '#d42a36', rojoPNOsc = '#a31c26', blancoPN = '#f7f6f0';
  const shirt = B ? '#5e0810' : pj ? '#c3abf2' : rp ? '#8fd0f5' : '#fbf0a8', shirtDark = B ? '#3a0408' : pj ? '#9479d4' : rp ? '#5aa8d6' : '#d9c45a';
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
    girado(ctx, piernaPose(opts, side), side * 3.5, 3, () => {
      ctx.fillRect(side * 3.5 - 1.7, 3, 3.4, 8 + lift);
      ctx.beginPath(); ctx.ellipse(side * 4.2, 11 + lift, 3, 1.7, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  // brazos (de Bloodie que persigue, arriba)
  const brazos = [];
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.5);
    // en pijama, la mano del lado del pincel coge el peluchito (Elora)
    // (de espaldas no: el peluche no se ve y el brazo va normal, Elora)
    if (pj && !B && !back && side === mano) { brazos.push([side, [mano * 4.6, -2.6]]); continue; }
    brazos.push([side, girar(chasing ? [side * 14 + sw, -18 + Math.abs(sw)] : [side * 10 + sw * 0.4, 3], [side * 6, -6], brazoPose(opts, side))]);
  }
  for (const [side, h] of brazos) {
    const ctlC = girar([side * 10, -3], [side * 6, -6], brazoPose(opts, side));
    ctx.strokeStyle = skin; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(side * 6, -6); ctx.quadraticCurveTo(ctlC[0], ctlC[1], h[0], h[1]); ctx.stroke();
  }
  if (pj) {
    // el camisón lila y, de frente, el peluchito abrazado (un gatito)
    camison(ctx, -9, shirt, shirtDark);
    // el peluchito, cogido con una mano (Elora): el brazo sale de la manga hasta el peluche
    if (!back) {
      ctx.strokeStyle = skin; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(mano * 7.5, -5); ctx.lineTo(mano * 4.6, -2.6); ctx.stroke();
      peluche(ctx, mano * 1.2, -3.4, '#f3eee6', '#c9b8a6', 'picos');
    }
  } else if (inv) {
    // el jersey rojo de Papá Noel: el borde de abajo, los puños y el cuello de pelito blanco y el cinturón negro
    ctx.fillStyle = rojoPN; rrect(ctx, -7, -9, 14, 14.4, 2.5); ctx.fill();
    for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 5 : -9.5, -9, 4.5, 4.5);
    ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = rojoPNOsc; ctx.fillRect(3.5, -8, 3, 12); ctx.restore();
    ctx.fillStyle = blancoPN;
    for (let x = -6.4; x <= 6.5; x += 1.6) dot(ctx, x, 4.6, 1.3);            // el pelito de abajo
    for (const side of [-1, 1]) for (let k = 0; k < 3; k++) dot(ctx, side * (6 + k * 1.3), -4.4, 1.05);   // los puños
    for (let x = -3.6; x <= 3.7; x += 1.4) dot(ctx, x, -8.8, 1);              // el cuello
    ctx.fillStyle = '#1e1a1c'; ctx.fillRect(-7, -0.6, 14, 2.2);              // el cinturón
    ctx.fillStyle = '#f2c43a'; ctx.fillRect(-1.6, -1, 3.2, 3);               // la hebilla
    ctx.fillStyle = '#1e1a1c'; ctx.fillRect(-0.7, -0.1, 1.4, 1.2);
  } else {
  // camiseta clarita con mangas cortas
  ctx.fillStyle = shirt;
  rrect(ctx, -7, -9, 14, 14, 2.5); ctx.fill();
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 5 : -9.5, -9, 4.5, 4.5);
  ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = shirtDark; ctx.fillRect(3.5, -8, 3, 12); ctx.restore();
  }
  if (!back && !B && !pj && !inv) {
    // la flor rosa con carita amarilla (cada pétalo, su propio círculo)
    ctx.fillStyle = '#ef7fb0';
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; dot(ctx, Math.cos(a) * 2.3, -2.5 + Math.sin(a) * 2.3, 1.4); }
    ctx.fillStyle = '#ffd83a'; dot(ctx, 0, -2.5, 1.6);
    ctx.fillStyle = line; dot(ctx, -0.6, -3, 0.3); dot(ctx, 0.6, -3, 0.3);
    ctx.fillRect(-0.6, -2.2, 1.2, 0.5);
  }
  // el pincel, en una mano: palo marrón y la punta con pintura lila (en pijama, no: lleva su peluchito)
  if (!B && !pj) {
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
  const gorroPN = () => {
    // el gorro de Papá Noel: rojo, con el borde blanco y la punta que cae a un lado con el pompón
    ctx.fillStyle = rojoPN;
    ctx.beginPath(); ctx.moveTo(hx - 6.8, hy - 5.6);
    ctx.quadraticCurveTo(hx - 4, hy - 15.5, hx + 3, hy - 14.6);
    ctx.quadraticCurveTo(hx + 9, hy - 13.6, hx + 11, hy - 7.4);
    ctx.lineTo(hx + 9.2, hy - 6.8); ctx.quadraticCurveTo(hx + 7.6, hy - 9.6, hx + 6, hy - 7.8); ctx.lineTo(hx + 6.8, hy - 5.6);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = blancoPN; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx - 7, hy - 5.2); ctx.quadraticCurveTo(hx, hy - 8, hx + 7, hy - 5.2); ctx.stroke();
    ctx.fillStyle = blancoPN; dot(ctx, hx + 10.4, hy - 6.4, 2);
  };
  if (inv) gorroPN();
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // la mancha de pintura lila sobre el ojo derecho (Elora), con bultitos como una nube
  if (!B) {
    ctx.save();
    ctx.beginPath(); ctx.arc(hx, hy, 9, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = inv ? blancoPN : lila;   // de Papá Noel, la mancha es blanca (Elora)
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
  if (inv) {
    // la barba blanca de mentira, debajo de la boca, con las gomitas que se enganchan en las orejas
    ctx.strokeStyle = '#d8d6cf'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(hx - 5.6, hy + 5); ctx.lineTo(hx - 8.2, hy - 1); ctx.moveTo(hx + 5.6, hy + 5); ctx.lineTo(hx + 8.2, hy - 1); ctx.stroke();
    ctx.fillStyle = blancoPN;
    for (const [bx, by, r] of [[-5, 6.2, 1.8], [-2.6, 7.4, 2], [0, 8.2, 2.1], [2.6, 7.4, 2], [5, 6.2, 1.8], [-1.3, 10, 1.6], [1.3, 10, 1.6], [0, 11.6, 1.3]]) dot(ctx, hx + bx, hy + by, r);
  }
  if (rp) {   // la diadema con una flor rosa (la ropa nueva)
    ctx.strokeStyle = '#f27aa8'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(hx, hy, 9.4, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
    const fx = hx - 5.6, fy = hy - 7.6;
    ctx.fillStyle = '#ff9ec4'; for (let k = 0; k < 5; k++) { const a = k * Math.PI * 2 / 5; dot(ctx, fx + Math.cos(a) * 1.7, fy + Math.sin(a) * 1.7, 1.3); }
    ctx.fillStyle = '#ffd83a'; dot(ctx, fx, fy, 1);
  }
}

// Gec (ficha de Elora): lagarto verde con los ojos grandes y negros, una sonrisa enorme con dos
// dientes grandes, dos agujeritos de nariz, camiseta gris con "ROK!" en rojo, los brazos un poco
// abiertos y la cola larga. Sin cuello y con la cabeza quieta al andar. Su monopatín rojo
// (Elora): al andar lo lleva en la mano; al correr (opts.skate) va subido encima; y mientras usa
// la lengua (opts.lengua) lo agarra con las dos manos encima de la cabeza, porque va tan rápido
// que se le caería.
function drawGec(ctx, pal, facing, walk, opts) {
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  // skin de pijama (hecha por Clad a partir del cartel de Elora; Elora la dejó así): pijama de manga larga y pantalón
  // largo con monopatines estampados (Elora); hecho por Clad y Elora lo dejó así
  const pj = pal.skin === 'pijama';
  // skin de Navidad (la pensó Elora con el quiz): un plumífero rojo gordito y guantes rojos con el borde blanco
  const inv = pal.skin === 'invierno' && !B;
  const plum = '#d8343c', plumOsc = '#a8222a', plumClaro = '#ef5f63', blancoG = '#f7f6f0';
  // una mano: los deditos verdes, o con el plumífero, el guante rojo con el borde blanco
  const mano = (x, y, side) => {
    if (inv) { ctx.fillStyle = blancoG; dot(ctx, x - side * 1.2, y, 1.7); ctx.fillStyle = plum; dot(ctx, x + side * 0.8, y, 2.1); ctx.fillStyle = plumOsc; dot(ctx, x + side * 0.2, y - 1.6, 0.8); return; }
    ctx.fillStyle = skin; for (let k = -1; k <= 1; k++) dot(ctx, x + side * 1.6, y + k * 1.5, 1);
  };
  const shirt = B ? '#5e0810' : pj ? '#7fb3e3' : rp ? '#2f3340' : '#a9abb0', shirtDark = B ? '#3a0408' : pj ? '#5a88bd' : rp ? '#1d2029' : '#7c7e84';
  const line = B ? '#2a0306' : '#1d241a';
  const hx = 0, hy = -15;
  const step = Math.sin(walk) * 1.5;
  const lado = facing === 'left' ? 1 : -1;   // la cola sale por el lado contrario a donde mira
  const agarra = !!opts.lengua && !B;             // con la lengua: monopatín agarrado con las dos manos
  const skate = !!opts.skate && !B && !agarra;
  const tabla = B ? '#3a0408' : rp ? '#3d8bff' : '#e0303c', rueda = B ? '#1a0204' : '#2b2b30';
  // el monopatín: una tabla roja con las puntas redondeadas y cuatro ruedas
  const monopatin = (x, y, ang) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.fillStyle = rueda;
    for (const k of [-5, 5]) { dot(ctx, k, 2, 1.3); }
    ctx.fillStyle = tabla;
    rrect(ctx, -8, -1.2, 16, 2.8, 1.4); ctx.fill();
    if (pj && !B) {
      // en pijama, el monopatín va tapado con la manta de estrellas de Draila (Elora: "Draila le prestó su
      // manta para dormir y la usó para el monopatín"): azul oscuro, con el borde ondulado y estrellas amarillas
      ctx.fillStyle = '#3a4a8c';
      ctx.beginPath(); ctx.moveTo(-8.8, -0.4); ctx.quadraticCurveTo(-8.6, -2.4, -6.5, -2.4); ctx.lineTo(6.5, -2.4);
      ctx.quadraticCurveTo(8.6, -2.4, 8.8, -0.4);
      for (let k = 0; k < 6; k++) { const x0 = 8.8 - k * (17.6 / 6); ctx.quadraticCurveTo(x0 - 1.47, 3, x0 - 2.93, 1.1); }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#263266'; ctx.fillRect(-6.5, -2.4, 13, 0.6);
      ctx.fillStyle = '#ffe36b';
      for (const [ex, ey, r] of [[-5.4, -0.6, 1], [-1.6, 0.4, 0.75], [2, -0.8, 1], [5.6, 0.4, 0.75]]) estrella(ctx, ex, ey, r);
    }
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
    girado(ctx, piernaPose(opts, side), side * 3.6, 3, () => {
      ctx.fillStyle = pj ? shirt : skin;   // con pijama, el pantalón largo
      ctx.fillRect(side * 3.6 - 1.8, 3, 3.6, 8 + lift);
      ctx.fillStyle = skin;
      ctx.beginPath(); ctx.ellipse(side * 4.4, 11 + lift, 3.2, 1.7, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  // brazos un poco abiertos, con la mano de deditos (de Bloodie que persigue, arriba;
  // en el monopatín, más abiertos para mantener el equilibrio)
  const manos = [];
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.2);
    const h = girar(chasing ? [side * 14 + sw, -18 + Math.abs(sw)] : agarra ? [side * 8, -26] : skate ? [side * 14, -6 + side * sw * 0.8] : [side * 12 + sw * 0.4, -1], [side * 6, -6], brazoPose(opts, side));
    manos.push([side, h]);
    ctx.strokeStyle = inv ? plum : pj ? shirt : skin; ctx.lineWidth = inv ? 4.4 : 3; ctx.lineCap = 'round';   // con pijama, manga larga; con plumífero, gordita
    ctx.beginPath(); ctx.moveTo(side * 6, -6); ctx.lineTo(h[0], h[1]); ctx.stroke();
    if (inv) {   // las costuras del acolchado en la manga
      ctx.strokeStyle = plumOsc; ctx.lineWidth = 0.6;
      ctx.beginPath(); for (const u of [0.35, 0.65]) { const x = side * 6 + (h[0] - side * 6) * u, y = -6 + (h[1] + 6) * u; ctx.moveTo(x - 1.5, y - 1.5); ctx.lineTo(x + 1.5, y + 1.5); } ctx.stroke();
    }
    mano(h[0], h[1], side);
  }
  if (inv) {
    // el plumífero rojo gordito: franjas acolchadas, una encima de otra, con el cuello alto y la cremallera
    for (let k = 0; k < 4; k++) {
      const y = -10 + k * 4, ancho = 8.4 - Math.abs(k - 1.5) * 0.3;
      ctx.fillStyle = plumOsc; rrect(ctx, -ancho, y + 0.6, ancho * 2, 4.6, 2.3); ctx.fill();
      ctx.fillStyle = plum; rrect(ctx, -ancho, y, ancho * 2, 4.4, 2.2); ctx.fill();
      ctx.fillStyle = plumClaro; rrect(ctx, -ancho + 1.2, y + 0.7, ancho * 2 - 6, 1.1, 0.5); ctx.fill();   // el brillo
    }
    ctx.fillStyle = plum; rrect(ctx, -5.2, -11.4, 10.4, 3.2, 1.5); ctx.fill();   // el cuello alto
    ctx.fillStyle = plumOsc; ctx.fillRect(-5.2, -9, 10.4, 0.6);
    if (!back) { ctx.fillStyle = '#c9c9d2'; ctx.fillRect(-0.3, -11, 0.7, 16.6); ctx.fillRect(-0.7, -11.4, 1.5, 1.6); }   // la cremallera
  } else {
  // camiseta gris con mangas cortas
  ctx.fillStyle = shirt;
  rrect(ctx, -7, -9, 14, 14, 2.5); ctx.fill();
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 5 : -9.5, -9, 4.5, 4.5);
  ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = shirtDark; ctx.fillRect(3.5, -8, 3, 12); ctx.restore();
  }
  if (pj && !B) {
    // el pijama de monopatines (Elora): tablas rojas pequeñitas con sus ruedas, por todo el pijama
    for (const [mx, my, a] of [[-3.6, -5.6, 0.3], [2.4, -3.2, -0.4], [-2.2, 0.6, -0.2], [3.4, 2.4, 0.5]]) {
      ctx.save(); ctx.translate(mx, my); ctx.rotate(a);
      ctx.fillStyle = '#2b2b30'; dot(ctx, -1.3, 0.9, 0.45); dot(ctx, 1.3, 0.9, 0.45);
      ctx.fillStyle = '#e0303c'; rrect(ctx, -2.2, -0.6, 4.4, 1.3, 0.6); ctx.fill();
      ctx.restore();
    }
  } else if (!back && !B && !inv) {
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
    mano(h[0], h[1], lado);
  }
  if (back) cola();
  // cabeza grande y redonda
  ctx.fillStyle = skin;
  rrect(ctx, hx - 10, hy - 8.5, 20, 16, 7.5); ctx.fill();
  // con la lengua: el monopatín bien agarrado con las dos manos, encima de la cabeza (Elora)
  if (agarra) {
    monopatin(0, -27, 0);
    ctx.fillStyle = skin;
    if (inv) for (const [side, h] of manos) mano(h[0], h[1] - 0.5, side);
    else for (const [, h] of manos) for (let k = -1; k <= 1; k++) dot(ctx, h[0] + k * 1.3, h[1] - 0.5, 1);
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (rp) {   // la gorra roja, de lado (Elora): la visera sale por un lado de la cabeza
    const vs = facing === 'right' ? 1 : -1;   // hacia qué lado va la visera
    ctx.save(); ctx.translate(hx, hy - 7.6); ctx.rotate(vs * 0.12);
    ctx.fillStyle = '#a8222a'; ctx.beginPath(); ctx.ellipse(vs * 10.4, 0.4, 6, 1.9, vs * 0.08, 0, Math.PI * 2); ctx.fill();   // la visera
    ctx.fillStyle = '#d8343c'; ctx.beginPath(); ctx.ellipse(0, 0, 9.6, 5.4, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b52a33'; ctx.fillRect(-9.6, -0.9, 19.2, 1.4);   // la cinta de abajo
    ctx.strokeStyle = '#a8222a'; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(0, -5.2); ctx.lineTo(0, -0.6); ctx.stroke();
    ctx.fillStyle = '#ffe36b'; dot(ctx, 0, -5.2, 1.1);
    ctx.restore();
  }
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
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const head = B ? '#c23a42' : '#a9e4e2', fin = head;   // los tentáculos, del color de los de la cara (Elora)
  // skin de pijama (dibujo de Elora): el cuerpo es un pijama azul de noche con una luna amarilla,
  // estrellitas y montañas verdes abajo, y lleva un gorro de dormir azul con la tira y el pompón amarillos
  const pj = pal.skin === 'pijama' && !B;
  // skin de Navidad (la pensó Elora): de estrella fugaz. La cabeza con forma de estrella amarilla, la cara asomando
  // por un círculo, los piquitos de la estrella son los tentáculos, y el vestido con rayas en zigzag de lado a
  // lado: de abajo arriba, morado oscuro, morado clarito y amarillo clarito
  const inv = pal.skin === 'invierno' && !B;
  // la otra skin de Navidad (la pensó Elora con el quiz): un jersey largo como un vestido, que le tapa la parte de
  // abajo (Elora: «que no se le vean los pies»), azul oscuro con copitos y burbujas moradas, amarillas y azul
  // clarito, y un gorro de lana con rayitas de esos tres colores, sin pompón
  const ab = pal.skin === 'abrigo' && !B;
  const JERSEY = ['#b48cf0', '#f7d75a', '#a9dcff'];   // morado, amarillo y azul clarito (Elora)
  const body = pj ? '#2d5ec4' : rp ? '#f58cc0' : pal.color, bodyDark = pj ? '#1d3f8c' : rp ? '#c95a92' : pal.dark, base = B ? '#5e0810' : rp ? '#ffffff' : '#c3b6ea';
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
  for (const side of (inv ? [] : [-1, 1])) {   // (de estrella fugaz, los tentáculos son los piquitos de la estrella)
    girado(ctx, brazoPose(opts, side), hx + side * 5.5, hy + 2.5, () => {
      for (let k = 0; k < 2; k++) {
        if (B && side === 1 && k > 0) continue;   // de Bloodie le falta un tentáculo de un lado
        tentaculo(side, k);
      }
    });
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
  if (ab) {
    // el jersey largo: más largo que el cuerpo, para que tape el borde de abajo, con el cuello y el bajo de canalé
    const jersey = () => {
      ctx.beginPath(); ctx.moveTo(-5.6, hy + 2.6); ctx.lineTo(5.6, hy + 2.6); ctx.quadraticCurveTo(5.6, 2, 11.6 + sway, 11.4);
      ctx.lineTo(-11.6 + sway, 11.4); ctx.quadraticCurveTo(-5.6, 2, -5.6, hy + 2.6); ctx.closePath();
    };
    ctx.fillStyle = '#1e2b66'; jersey(); ctx.fill();
    ctx.save(); jersey(); ctx.clip();
    // los copitos y las burbujas, siempre en el mismo sitio
    const COSAS = [[-2.6, -9.6, 'c', 0], [2.4, -8, 'b', 1], [-1, -5.2, 'b', 2], [3.6, -3.6, 'c', 1], [-4.4, -2.2, 'c', 2],
      [0.6, -1.2, 'c', 0], [-6.6, 2.4, 'b', 0], [4.8, 1.2, 'b', 2], [-2, 3.2, 'c', 1], [1.8, 5, 'b', 1], [7.4, 5.4, 'c', 2], [-7.4, 6.4, 'c', 1]];
    for (const [cx0, cy, tipo, k] of COSAS) {
      const cx = cx0 + sway * Math.max(0, cy + 4) / 14;
      if (tipo === 'c') {
        ctx.strokeStyle = JERSEY[k]; ctx.lineWidth = 0.45; ctx.lineCap = 'round';
        ctx.beginPath();
        for (let a = 0; a < 3; a++) { const an = a * Math.PI / 3; ctx.moveTo(cx - Math.cos(an) * 1.4, cy - Math.sin(an) * 1.4); ctx.lineTo(cx + Math.cos(an) * 1.4, cy + Math.sin(an) * 1.4); }
        ctx.stroke();
      } else {
        ctx.fillStyle = JERSEY[k]; dot(ctx, cx, cy, 1.15);
        ctx.fillStyle = 'rgba(255,255,255,0.75)'; dot(ctx, cx - 0.4, cy - 0.4, 0.35);
      }
    }
    // el bajo y el cuello de canalé, un poco más oscuros, con rayitas
    ctx.fillStyle = '#16204d'; ctx.fillRect(-13, 9.2, 26, 3); ctx.fillRect(-7, hy + 2, 14, 1.8);
    ctx.strokeStyle = '#2a3a80'; ctx.lineWidth = 0.4;
    ctx.beginPath();
    for (let x = -12; x <= 12; x += 1.2) { ctx.moveTo(x + sway, 9.4); ctx.lineTo(x + sway, 11.6); }
    for (let x = -5; x <= 5; x += 1.2) { ctx.moveTo(x, hy + 2.6); ctx.lineTo(x, hy + 3.8); }
    ctx.stroke();
    // la sombra de un lado
    ctx.globalAlpha *= 0.3; ctx.fillStyle = '#05081c';
    ctx.beginPath(); ctx.moveTo(2.8, hy + 4); ctx.lineTo(5.6, hy + 4); ctx.quadraticCurveTo(5.6, 2, 11.6 + sway, 11.4); ctx.lineTo(7.4 + sway, 11.4); ctx.quadraticCurveTo(3.2, 2, 2.8, hy + 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  } else if (inv) {
    // el vestido de rayas en zigzag: morado oscuro abajo, morado clarito en medio y amarillo clarito arriba
    ctx.save();
    ctx.beginPath(); ctx.moveTo(-5, hy + 3); ctx.lineTo(5, hy + 3); ctx.quadraticCurveTo(5, 2, 11 + sway, 10.5);
    ctx.lineTo(-11 + sway, 10.5); ctx.quadraticCurveTo(-5, 2, -5, hy + 3); ctx.closePath(); ctx.clip();
    const zigzag = (y, color) => {
      ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(-13, 12);
      for (let x = -13, k = 0; x <= 13.1; x += 2.2, k++) ctx.lineTo(x + sway * (y > 0 ? 1 : 0.4), y + (k % 2 ? -1.3 : 1.3));
      ctx.lineTo(13, 12); ctx.closePath(); ctx.fill();
    };
    ctx.fillStyle = '#fbeea0'; ctx.fillRect(-13, hy, 26, 30);
    zigzag(-3, '#b49be6');
    zigzag(4, '#5b3a9e');
    ctx.globalAlpha *= 0.25; ctx.fillStyle = '#2a1a4a';
    ctx.beginPath(); ctx.moveTo(2.5, hy + 4); ctx.lineTo(5, hy + 4); ctx.quadraticCurveTo(5, 2, 11 + sway, 10.5); ctx.lineTo(7 + sway, 10.5); ctx.quadraticCurveTo(3, 2, 2.5, hy + 4); ctx.closePath(); ctx.fill();
    ctx.restore();
  } else if (pj) {
    // la luna con sus cráteres y las estrellitas
    luna(ctx, 0.5, -2, 3.4, -2.6, '#f5d94a', body);
    ctx.fillStyle = '#c9a92a'; dot(ctx, -1.6, -2.4, 0.45); dot(ctx, -1.1, 0.2, 0.4);
    ctx.strokeStyle = '#dbe8ff'; ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (const [sx, sy] of [[-3, -7.5], [3.6, -5.6], [4.8, 1.4], [-4.6, 2.6]]) { ctx.moveTo(sx - 0.9, sy); ctx.lineTo(sx + 0.9, sy); ctx.moveTo(sx, sy - 0.9); ctx.lineTo(sx, sy + 0.9); }
    ctx.stroke();
    // las montañas verdes de abajo
    ctx.fillStyle = '#6fbf4a';
    ctx.beginPath(); ctx.moveTo(-10.4 + sway, 10.5); ctx.lineTo(-9.4 + sway, 5.6);
    ctx.quadraticCurveTo(-6 + sway, 3.6, -3 + sway, 5.4); ctx.quadraticCurveTo(0 + sway, 3.4, 3.4 + sway, 5.2);
    ctx.quadraticCurveTo(6.6 + sway, 3.8, 9.4 + sway, 5.6); ctx.lineTo(11 + sway, 10.5); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#b6e08e';
    ctx.beginPath(); ctx.moveTo(-10.8 + sway, 10.5); ctx.lineTo(-10 + sway, 8.2); ctx.quadraticCurveTo(0 + sway, 6.6, 10 + sway, 8.2); ctx.lineTo(11 + sway, 10.5); ctx.closePath(); ctx.fill();
  } else {
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
  }

  if (inv) {
    // la cabeza de estrella amarilla (los piquitos son los tentáculos: se mueven un poco), con la cara en un círculo
    const mueve = Math.sin(walk * 1.2) * 0.06;
    ctx.save(); ctx.translate(hx, hy - 1); ctx.rotate(mueve);
    ctx.fillStyle = '#f5c518';
    ctx.beginPath();
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 6.6 : 14; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffe25a';
    ctx.beginPath();
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? 5.4 : 11.6; ctx.lineTo(Math.cos(a) * rr - 0.8, Math.sin(a) * rr - 0.8); }
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#d9a40e'; dot(ctx, hx, hy - 1, 7.4);   // el borde del círculo
    ctx.fillStyle = head; dot(ctx, hx, hy - 1, 6.6);      // la cara de Jely asomando
  } else {
  // cabeza: una campana redonda turquesa clarito con la parte de abajo recta
  ctx.fillStyle = head;
  ctx.beginPath(); ctx.ellipse(hx, hy, 9.5, 9, 0, Math.PI, 0); ctx.lineTo(hx + 9.5, hy + 3); ctx.lineTo(hx - 9.5, hy + 3); ctx.closePath(); ctx.fill();
  }
  if (!B && !inv) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.ellipse(hx - 4.5, hy - 5.5, 1.8, 3, -0.6, 0, Math.PI * 2); ctx.fill();
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (ab) {
    // el gorro de lana con rayitas moradas, amarillas y azul clarito y el borde doblado
    const gorro = () => {
      ctx.beginPath(); ctx.moveTo(hx - 10, hy - 5.6);
      ctx.bezierCurveTo(hx - 10.4, hy - 18.5, hx + 10.4, hy - 18.5, hx + 10, hy - 5.6); ctx.closePath();
    };
    ctx.save(); gorro(); ctx.clip();
    for (let k = 0; k < 7; k++) { ctx.fillStyle = JERSEY[k % 3]; ctx.fillRect(hx - 12, hy - 18 + k * 2, 24, 2.05); }
    ctx.globalAlpha *= 0.22; ctx.fillStyle = '#1e2b66'; ctx.beginPath(); ctx.ellipse(hx + 7, hy - 10, 4, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // el borde doblado (morado), de canalé
    ctx.fillStyle = '#8f63d6'; rrect(ctx, hx - 10.6, hy - 8.4, 21.2, 3, 1.2); ctx.fill();
    ctx.strokeStyle = '#6f45b8'; ctx.lineWidth = 0.4;
    ctx.beginPath(); for (let x = -9.6; x <= 9.7; x += 1.2) { ctx.moveTo(hx + x, hy - 8); ctx.lineTo(hx + x, hy - 5.8); } ctx.stroke();
    // sin pompón (Elora)
  }
  if (pj) {
    // el gorro de dormir: cae hacia un lado y acaba en el pompón
    ctx.fillStyle = '#2350b8';
    ctx.beginPath(); ctx.moveTo(hx - 9.6, hy - 3.6);
    ctx.quadraticCurveTo(hx - 8, hy - 13.5, hx + 1, hy - 12.5);
    ctx.quadraticCurveTo(hx + 9, hy - 11.5, hx + 10.5, hy + 0.5);
    ctx.lineTo(hx + 8.6, hy + 0.8); ctx.quadraticCurveTo(hx + 8, hy - 5, hx + 6.5, hy - 6.6);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#f5d94a'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx - 9, hy - 4.4); ctx.quadraticCurveTo(hx - 1, hy - 8.4, hx + 6.8, hy - 6.6); ctx.stroke();
    ctx.fillStyle = '#f5d94a'; dot(ctx, hx + 9.8, hy + 1.6, 1.9);
  }
  if (rp && !back) { ctx.fillStyle = '#fffaf2'; for (let k = -2; k <= 2; k++) dot(ctx, hx + k * 2.2, hy + 7.8 + Math.abs(k) * -0.5, 0.9); }   // el collar de perlas
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
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  // skin de pijama (dibujo de Elora): un pijama entero gris de osito, con orejitas redondas rosas por
  // dentro y un agujero para la cara; las patitas asoman marrones por las mangas
  const pj = pal.skin === 'pijama' && !B;
  // skin de Navidad (la pensó Elora con el quiz): disfraz de muñeco de nieve. Blanco, con botones negros, nariz
  // de zanahoria y bufanda blanca y azul (sin gorro de copa: Elora). Como en el pijama, la cara y las patitas asoman
  const inv = pal.skin === 'invierno' && !B;
  const nieve = '#f4f6fa', nieveOsc = '#c3cede', azulB = '#3d6fd6';
  // la otra skin de Navidad de Tarda (la describió Elora): de osito. Jersey gris, gorro de lana con orejitas de oso
  // y dos ojitos, y guantes de osito. La Tarda de la tienda (opts.osito) la lleva en Navidad, toda marrón, y está
  // cosiendo (opts.cosiendo)
  const os = (pal.skin === 'osito' || opts.osito) && !B;
  const osCol = opts.osito ? '#9a6a44' : '#a3a2aa', osOsc = opts.osito ? '#6e4a2c' : '#7b7a83', osClaro = opts.osito ? '#b88a62' : '#c2c1c8';
  const skin = pal.color, dark = pal.dark;
  // el pijama de la Tarda jugable es gris; el de la Tarda de la tienda, marrón (Elora): pal.pijamaMarron
  const gris = pal.pijamaMarron ? '#9a6a44' : '#b6b5bb', grisOsc = pal.pijamaMarron ? '#6e4a2c' : '#86858c';
  const line = B ? '#2a0306' : '#3a2a1e';
  const claw = B ? '#2a0306' : '#5a5a5e';
  const ex = facing === 'left' ? -2 : facing === 'right' ? 2 : 0;
  // La Tarda de la tienda del lobby (opts.alta) es más alta y lleva su cinta; la jugable es más
  // bajita y no lleva ni la cinta ni las monedas (Elora).
  // la Bolita Tun (Elora): Tarda hecha una bolita, como los ositos de agua cuando se secan. Un barril con
  // rayas, las patitas escondidas, los ojos cerrados y unas zetas de dormir. Medio transparente: los Bloodies
  // no la ven. En pijama, la bolita es el osito gris con sus orejitas.
  if (opts.tun && !B) {
    const color = pj ? gris : skin, osc = pj ? grisOsc : dark;
    ctx.save(); ctx.globalAlpha *= 0.8;
    if (pj) for (const side of [-1, 1]) {
      ctx.fillStyle = gris; dot(ctx, side * 6, -4, 3);
      ctx.fillStyle = '#f2a7b8'; dot(ctx, side * 6, -4, 1.6);
    }
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, 3, 10, 8, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = osc; ctx.beginPath(); ctx.ellipse(5, 4, 4, 7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    ctx.strokeStyle = osc; ctx.lineWidth = 0.9;
    ctx.beginPath();
    for (const x of [-5.5, 5.5]) { ctx.moveTo(x, -3.6); ctx.quadraticCurveTo(x * 1.25, 3, x, 9.6); }
    ctx.stroke();
    if (facing !== 'up') {
      ctx.strokeStyle = line; ctx.lineWidth = 0.8; ctx.lineCap = 'round';
      for (const side of [-1, 1]) { ctx.beginPath(); ctx.arc(ex + side * 2.2, 2, 1.2, Math.PI * 0.1, Math.PI * 0.9); ctx.stroke(); }
      ctx.beginPath(); ctx.arc(ex, 4.6, 0.9, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    }
    ctx.restore();
    // las zetas de dormir, que suben
    const z = (performance.now() / 900) % 1;
    ctx.fillStyle = '#efe0ff'; ctx.font = 'bold 5px "Segoe UI", Arial'; ctx.textAlign = 'center';
    ctx.globalAlpha *= 1 - z;
    ctx.fillText('z', 7 + z * 3, -5 - z * 8); ctx.font = 'bold 4px "Segoe UI", Arial'; ctx.fillText('z', 10 + z * 3, -9 - z * 8);
    return;
  }
  const alta = !!opts.alta;
  const top = alta ? -34 : -22, bot = 8;   // el cuerpo, de arriba abajo
  const fy = top + 27;   // la cara y la cinta se colocan respecto a lo alto del cuerpo

  // una pata: un tubito con tres garritas en la punta
  const pata = (x0, y0, x1, y1, w) => {
    ctx.strokeStyle = skin; ctx.lineCap = 'round'; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    if (pj || inv || os) {   // la manga gris del pijama (o blanca del muñeco de nieve, o del jersey de osito), y la patita asomando
      ctx.strokeStyle = inv ? nieve : os ? osCol : gris;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * 0.6, y0 + (y1 - y0) * 0.6); ctx.stroke();
    }
    if (os && w < 3.4) {   // los guantes de osito (en las patas de los lados): redonditos, con la almohadilla rosa
      ctx.fillStyle = osOsc; dot(ctx, x1, y1, w * 0.78);
      ctx.fillStyle = osCol; dot(ctx, x1, y1 - 0.2, w * 0.7);
      ctx.fillStyle = '#f2a7b8'; dot(ctx, x1, y1 + 0.3, w * 0.28);
      return;
    }
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
      const fin = girar([side * 12.5, yEnd], [side * 6.5, y], brazoPose(opts, side));
      pata(side * 6.5, y, fin[0], fin[1], 3.2);
    });
  }
  // las dos de abajo, andando
  for (const side of [-1, 1]) {
    const st = Math.sin(walk + (side > 0 ? Math.PI : 0)) * 1.6;
    const finP = girar([side * 5 + st, bot + 4], [side * 4, bot - 2], piernaPose(opts, side));
    pata(side * 4, bot - 2, finP[0], finP[1], 3.6);
  }
  // en pijama, las orejitas de osito (detrás de la cabeza del pijama)
  if (pj) for (const side of [-1, 1]) {
    ctx.fillStyle = gris; dot(ctx, side * 5.2, top + 0.6, 2.7);
    ctx.fillStyle = '#f0a8bc'; dot(ctx, side * 5.2, top + 0.6, 1.3);
  }
  // el cuerpo: un rectángulo alto (un poco más ancho abajo) con las esquinas redondeadas
  ctx.fillStyle = inv ? nieve : pj ? gris : skin;
  ctx.beginPath();
  ctx.moveTo(-7, top + 2); ctx.quadraticCurveTo(-7, top, -5, top);
  ctx.lineTo(5, top); ctx.quadraticCurveTo(7, top, 7, top + 2);
  ctx.lineTo(8, bot - 1); ctx.quadraticCurveTo(8, bot + 1, 6, bot + 1);
  ctx.lineTo(-6, bot + 1); ctx.quadraticCurveTo(-8, bot + 1, -8, bot - 1);
  ctx.closePath(); ctx.fill();
  // sombra de un lado
  ctx.save(); ctx.globalAlpha *= 0.3; ctx.fillStyle = inv ? nieveOsc : pj ? grisOsc : dark;
  ctx.fillRect(4, top + 1, 3.5, bot - top);
  ctx.restore();
  // en pijama (o de muñeco de nieve), el agujero de la cara: se ve la cara marrón de Tarda
  if ((pj || inv) && !back) { ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(ex * 0.6 + 0.4, top + 9, 6, 6.6, 0, 0, Math.PI * 2); ctx.fill(); }
  // las rayas del cuerpo, un poco torcidas como en la ficha
  if (os) {
    // el jersey de osito: desde debajo de la cara hasta abajo, con el cuello y el borde de abajo de punto
    ctx.fillStyle = osCol;
    ctx.beginPath(); ctx.moveTo(-7.6, top + 14); ctx.lineTo(7.6, top + 14); ctx.lineTo(8.3, bot - 1); ctx.quadraticCurveTo(8.3, bot + 1.3, 6, bot + 1.3);
    ctx.lineTo(-6, bot + 1.3); ctx.quadraticCurveTo(-8.3, bot + 1.3, -8.3, bot - 1); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = osOsc; ctx.fillRect(4, top + 15, 3.6, bot - top - 15); ctx.restore();
    ctx.fillStyle = osOsc; ctx.fillRect(-7.6, top + 14, 15.2, 1.8); ctx.fillRect(-8.3, bot - 1.2, 16.6, 1.8);
    ctx.strokeStyle = osClaro; ctx.lineWidth = 0.5; ctx.beginPath();
    for (let x = -6.6; x <= 6.8; x += 1.4) { ctx.moveTo(x, top + 14.2); ctx.lineTo(x, top + 15.6); ctx.moveTo(x, bot - 1); ctx.lineTo(x, bot + 0.4); }
    ctx.stroke();
    // el gorro de lana con orejitas de oso y dos ojitos
    for (const side of [-1, 1]) { ctx.fillStyle = osCol; dot(ctx, side * 6, top - 1.4, 2.8); ctx.fillStyle = '#f2a7b8'; dot(ctx, side * 6, top - 1.4, 1.3); }
    ctx.fillStyle = osCol;
    ctx.beginPath(); ctx.moveTo(-7.4, top + 4.4); ctx.quadraticCurveTo(-7.6, top - 3.6, 0, top - 3.8); ctx.quadraticCurveTo(7.6, top - 3.6, 7.4, top + 4.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = osOsc; rrect(ctx, -7.8, top + 2.4, 15.6, 2.6, 1.2); ctx.fill();
    if (!back) { ctx.fillStyle = '#1e1a1c'; dot(ctx, ex - 2.4, top - 0.6, 0.85); dot(ctx, ex + 2.4, top - 0.6, 0.85); ctx.fillStyle = '#fff'; dot(ctx, ex - 2.1, top - 0.9, 0.3); dot(ctx, ex + 2.7, top - 0.9, 0.3); }
  }
  if (inv) {
    // el muñeco de nieve: la raya entre las dos bolas de nieve, los botones negros y la bufanda blanca y azul
    ctx.strokeStyle = nieveOsc; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(-7.6, top + 23); ctx.quadraticCurveTo(0, top + 25.4, 7.8, top + 23); ctx.stroke();
    if (!back) { ctx.fillStyle = '#1e1a1c'; for (const by of [top + 20, top + 25.6, top + 30.4]) dot(ctx, ex * 0.3, by, 1.1); }
    ctx.fillStyle = nieve; rrect(ctx, -7.8, top + 14.4, 15.6, 3.6, 1.6); ctx.fill();
    ctx.fillStyle = azulB; for (const x of [-6, -2.6, 0.8, 4.2]) ctx.fillRect(x, top + 14.4, 1.4, 3.6);
    ctx.strokeStyle = nieveOsc; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(-7.6, top + 18); ctx.lineTo(7.6, top + 18); ctx.stroke();
    if (!back) {
      ctx.fillStyle = nieve; rrect(ctx, 3.6, top + 16, 3, 8, 1.2); ctx.fill();
      ctx.fillStyle = azulB; ctx.fillRect(3.6, top + 18.6, 3, 1.2); ctx.fillRect(3.6, top + 21.2, 3, 1.2);
    }
  } else if (!os) {
  ctx.strokeStyle = pj ? grisOsc : dark; ctx.lineWidth = 0.9;
  ctx.beginPath();
  for (const y of [top + 16, top + 22, top + 28, top + 34]) { if (y > bot - 4) break; ctx.moveTo(-7.6, y + 1); ctx.quadraticCurveTo(0, y - 1, 7.6, y); }
  ctx.stroke();
  }
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
    if (inv) {
      // la nariz de zanahoria
      ctx.fillStyle = '#f28a24';
      ctx.beginPath(); ctx.moveTo(fx + 0.8, -21); ctx.lineTo(fx + 0.8, -19.4); ctx.lineTo(fx - 3.6, -19.6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = '#c4621a'; ctx.lineWidth = 0.4;
      ctx.beginPath(); ctx.moveTo(fx - 0.6, -20.6); ctx.lineTo(fx - 0.4, -19.6); ctx.moveTo(fx - 2, -20.2); ctx.lineTo(fx - 1.8, -19.6); ctx.stroke();
    }
    ctx.restore();
  }
  if (inv && !back) {
    // de muñeco de nieve, una taza de chocolate caliente en la pata de arriba (Elora), con el humito
    const t0 = performance.now() / 1000;
    ctx.save(); ctx.translate(12.6, -11);
    ctx.fillStyle = '#d42a36'; rrect(ctx, -2.4, -2.6, 4.8, 5, 1); ctx.fill();          // la taza roja
    ctx.strokeStyle = '#d42a36'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(2.6, 0, 1.4, -Math.PI / 2, Math.PI / 2); ctx.stroke();   // el asa
    ctx.fillStyle = '#6b3a1e'; ctx.beginPath(); ctx.ellipse(0, -2.4, 2.2, 0.8, 0, 0, Math.PI * 2); ctx.fill();   // el chocolate
    ctx.fillStyle = '#f7f6f0'; ctx.fillRect(-1.8, -0.4, 3.6, 0.7);                       // una rayita blanca
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 0.5; ctx.beginPath();     // el humito, que sube
    for (const k of [-0.9, 0.9]) { const o = Math.sin(t0 * 3 + k * 2) * 0.6; ctx.moveTo(k, -3.4); ctx.quadraticCurveTo(k + o + 0.8, -5, k - o, -6.6); }
    ctx.stroke();
    ctx.restore();
  }
  if (rp) {
    // la ropa nueva de Tarda: pajarita roja debajo de la cara y sombrero de copa negro con cinta roja
    if (!back) {
      const px = ex * 0.6 + 0.4, py = top + 17;
      ctx.fillStyle = '#d42a36';
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 4, py - 2.2); ctx.lineTo(px - 4, py + 2.2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 4, py - 2.2); ctx.lineTo(px + 4, py + 2.2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#a31c26'; dot(ctx, px, py, 1.1);
    }
    ctx.fillStyle = '#26232c'; rrect(ctx, -7.5, top - 1.6, 15, 2.4, 1); ctx.fill();   // el ala
    rrect(ctx, -5, top - 10, 10, 9, 1.2); ctx.fill();                                  // la copa
    ctx.fillStyle = '#d42a36'; ctx.fillRect(-5, top - 3.6, 10, 1.8);                  // la cinta
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-4, top - 9.4, 1.4, 7);
  }
  if (alta && !B && !back && opts.cosiendo) {
    // en Navidad, la Tarda de la tienda está cosiendo (Elora): una tela roja delante de la tripa, la aguja grande que
    // sube y baja (Elora: "que se note más que está cosiendo"), el hilo largo y las puntadas, que van saliendo
    const t0 = performance.now() / 1000, fase = (t0 * 1.6) % 1, sube = Math.sin(fase * Math.PI * 2) * 4.5;
    ctx.save(); ctx.translate(1, top + 22); ctx.rotate(-0.08);
    ctx.fillStyle = '#b8232f'; rrect(ctx, -6.5, -3, 13, 9, 1.5); ctx.fill();                       // la tela roja
    ctx.fillStyle = '#d8344a'; rrect(ctx, -6.5, -3, 13, 7.6, 1.5); ctx.fill();
    ctx.fillStyle = '#2e9a4c'; dot(ctx, -3.6, 0.4, 1.2); dot(ctx, -2.2, -0.6, 1.2);                // un acebo bordado
    ctx.fillStyle = '#ffd83a'; dot(ctx, -2.9, 0.6, 0.6);
    // las puntadas blancas: van saliendo una a una
    const n = 2 + Math.floor((t0 * 1.6) % 6);
    ctx.strokeStyle = '#f7f6f0'; ctx.lineWidth = 0.7; ctx.lineCap = 'round'; ctx.beginPath();
    for (let k = 0; k < n; k++) { ctx.moveTo(-5 + k * 1.8, 3); ctx.lineTo(-4 + k * 1.8, 3); }
    ctx.stroke();
    const ax = -4 + n * 1.8, ay = 3;   // por donde entra la aguja ahora
    // la aguja plateada, grande, con su brillo
    ctx.strokeStyle = '#d9dbe3'; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(ax, ay - sube * 0.3); ctx.lineTo(ax + 3, ay - 8 - sube); ctx.stroke();
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.moveTo(ax + 0.6, ay - 2 - sube * 0.5); ctx.lineTo(ax + 2.2, ay - 6.4 - sube); ctx.stroke();
    // el hilo, largo, desde el ojo de la aguja hasta la tela
    ctx.strokeStyle = '#f7f6f0'; ctx.lineWidth = 0.55;
    ctx.beginPath(); ctx.moveTo(ax + 3, ay - 8 - sube); ctx.bezierCurveTo(ax + 9, ay - 12 - sube, ax + 9, ay + 2, ax - 0.6, ay); ctx.stroke();
    ctx.restore();
  } else if (alta && !B && !back && !opts.peluche) {   // (con el osito en la mano, sin la cinta: Elora)
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
// La maceta de Hoppy (Elora): marroncita, boca abajo en la cabeza como un casco. Arriba, el culo de la maceta con su
// agujerito; abajo, la boca de la maceta con el borde gordito, justo por debajo de los ojos.
function macetaCasco(ctx, hx, hy, B) {
  const base = B ? '#5a2a1a' : '#a8703f', borde = B ? '#6e3420' : '#bf8550', sombra = B ? '#3a1810' : '#7a4e2a';
  ctx.fillStyle = base;
  ctx.beginPath(); ctx.moveTo(hx - 6.2, hy - 11.4); ctx.lineTo(hx + 6.2, hy - 11.4); ctx.lineTo(hx + 9.8, hy - 0.4); ctx.lineTo(hx - 9.8, hy - 0.4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = sombra; ctx.globalAlpha *= 0.45;
  ctx.beginPath(); ctx.moveTo(hx + 2.6, hy - 11.4); ctx.lineTo(hx + 6.2, hy - 11.4); ctx.lineTo(hx + 9.8, hy - 0.4); ctx.lineTo(hx + 5, hy - 0.4); ctx.closePath(); ctx.fill();
  ctx.globalAlpha /= 0.45;
  ctx.fillStyle = sombra; ctx.beginPath(); ctx.ellipse(hx, hy - 11.4, 1.6, 0.6, 0, 0, Math.PI * 2); ctx.fill();   // el agujerito
  ctx.fillStyle = borde; rrect(ctx, hx - 10.8, hy - 1.2, 21.6, 3.2, 1.2); ctx.fill();
  ctx.fillStyle = sombra; ctx.globalAlpha *= 0.35; ctx.fillRect(hx - 10.4, hy + 1.2, 20.8, 0.8); ctx.globalAlpha /= 0.35;
}

function drawHoppy(ctx, pal, facing, walk, opts) {
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  // skin de pijama (hecha por Clad a partir del cartel de Elora; Elora la dejó así): camisón rosa y un peluchito
  const pj = pal.skin === 'pijama';
  // skin de Navidad (la pensó Elora con el quiz): de reno. Un jersey marrón MUY peludito (Elora: "DEMASIADO
  // PELUDITO"), una felpa con cuernos de reno y la naricita pintada de rojo con pintacaras
  const inv = pal.skin === 'invierno' && !B;
  const jersey = '#8a5a3a', jerseyClaro = '#a8744e', jerseyOsc = '#6a4228', cuerno = '#5a3418';
  const manoPeluche = facing === 'left' ? -1 : 1;   // la mano que coge el peluchito
  const shirt = B ? '#5e0810' : pj ? '#f4b9cf' : rp ? '#4fb36a' : '#d8344a', shirtDark = B ? '#3a0408' : pj ? '#d48aa8' : rp ? '#2f8a4a' : '#a8202f';
  const panel = B ? '#c9a0a0' : '#cfe9f6';
  const line = B ? '#2a0306' : '#4a2e22';
  const hx = 0, hy = back ? -15 : -14;
  const step = Math.sin(walk) * 1.8;

  // colita (detrás si mira de frente)
  if (!back) { ctx.fillStyle = skinDark; dot(ctx, -9.5, 4, 2.6); }
  // piernas con las patas de liebre grandes
  ctx.fillStyle = skin;
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.7 : 0;
    girado(ctx, piernaPose(opts, side), side * 3.5, 3, () => {
      ctx.fillRect(side * 3.5 - 1.8, 3, 3.6, 7 + lift);
      ctx.beginPath(); ctx.ellipse(side * 4.5, 10.5 + lift, 4.2, 2, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  // brazos abiertos (de Bloodie que persigue, arriba)
  ctx.strokeStyle = skin; ctx.lineWidth = 3; ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.8) + side) * (chasing ? 4 : 1.5);
    const aH = brazoPose(opts, side), hombroH = [side * 5.5, -4];
    if (pj && !B && !back && side === manoPeluche) continue;   // esa mano coge el peluchito (se dibuja con él; de espaldas, no)
    const manoH = girar(B && chasing ? [side * 13 + sw, -17 + Math.abs(sw)] : [side * 11 + sw * 0.4, -1 + sw * 0.3], hombroH, aH);
    if (inv) {
      // las mangas del jersey peludito: bolitas de pelo a lo largo del brazo
      for (let k = 0; k <= 4; k++) {
        const u = k / 5, x = side * 5.5 + (manoH[0] - side * 5.5) * u, y = -4 + (manoH[1] + 4) * u;
        ctx.fillStyle = jerseyOsc; dot(ctx, x, y + 0.4, 1.9);
        ctx.fillStyle = k % 2 ? jerseyClaro : jersey; dot(ctx, x, y, 1.7);
      }
      ctx.fillStyle = skin; dot(ctx, manoH[0], manoH[1], 2);   // la mano asoma por la manga
      continue;
    }
    ctx.beginPath(); ctx.moveTo(side * 5.5, -4); ctx.lineTo(manoH[0], manoH[1]); ctx.stroke();
    if (!(B && chasing)) { const pm = girar([side * 11.5 + sw * 0.4, -1 + sw * 0.3], hombroH, aH); ctx.fillStyle = skin; dot(ctx, pm[0], pm[1], 2); }
  }
  if (pj) {
    // el camisón y, de frente, el peluchito abrazado (un perrito de orejas caídas)
    camison(ctx, -8, shirt, shirtDark);
    // el peluchito, cogido con una mano (Elora): el brazo sale de la manga hasta el peluche
    if (!back) {
      const m = manoPeluche;
      ctx.strokeStyle = skin; ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(m * 6.5, -4.5); ctx.lineTo(m * 4.4, -1.6); ctx.stroke();
      peluche(ctx, m * 1.2, -2.6, '#ecdcc0', '#a87a54', 'caidas');
      ctx.fillStyle = skin; dot(ctx, m * 4.4, -1.6, 2);
    }
  } else if (inv) {
    // el jersey marrón MUY peludito: el cuerpo y, todo alrededor, bolitas de pelo, y mechoncitos por dentro
    // (Elora: menos ancho, que se pasó con el pelo)
    ctx.fillStyle = jersey; rrect(ctx, -6.2, -8.3, 12.4, 13, 3); ctx.fill();
    const borde = [];
    for (let x = -5.4; x <= 5.5; x += 2.2) { borde.push([x, -8.4]); borde.push([x, 4.8]); }
    for (let y = -6; y <= 3; y += 2.2) { borde.push([-6.3, y]); borde.push([6.3, y]); }
    ctx.fillStyle = jerseyOsc; for (const [x, y] of borde) dot(ctx, x, y + 0.4, 1.25);
    ctx.fillStyle = jersey; for (const [x, y] of borde) dot(ctx, x, y, 1.15);
    ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = jerseyOsc; ctx.fillRect(3.2, -7, 2.8, 11); ctx.restore();
    ctx.strokeStyle = jerseyClaro; ctx.lineWidth = 0.7; ctx.lineCap = 'round';
    ctx.beginPath();
    for (const [x, y] of [[-4, -5], [-1, -3], [2.4, -5.4], [-3.2, 0], [0.6, 1.6], [3.6, -1.2], [-5, 3], [2.2, 3.4]]) {
      ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 0.8, y - 1, x + 1.6, y - 0.2); ctx.moveTo(x + 0.4, y + 1); ctx.quadraticCurveTo(x + 1.2, y, x + 2, y + 0.8);
    }
    ctx.stroke();
  } else {
  // camiseta roja
  ctx.fillStyle = shirt;
  rrect(ctx, -6.5, -8, 13, 12.5, 2.5); ctx.fill();
  for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 4.5 : -8.5, -8, 4, 4);
  ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = shirtDark; ctx.fillRect(3.5, -7, 3, 11); ctx.restore();
  }
  if (!back && !pj && !inv) {
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
  // (las orejas largas ya no se ven: van escondidas dentro de la maceta, Elora)
  // cabeza
  ctx.fillStyle = skin; dot(ctx, hx, hy, 9);
  // la Hoppy de verdad (Elora, noviembre 2026; la ficha estaba mal): lleva una maceta marroncita boca abajo en la
  // cabeza, como un casco. Le tapa las orejas y los ojos; la boca sí se ve
  macetaCasco(ctx, hx, hy, B);
  if (rp) for (const [x, y] of [[-4.2, -5], [0.6, -7.8], [4.6, -4.2]]) {   // margaritas pintadas en la maceta (la ropa nueva)
    ctx.fillStyle = '#fbf8f0'; for (let k = 0; k < 5; k++) { const a = k * Math.PI * 2 / 5; dot(ctx, hx + x + Math.cos(a) * 1.2, hy + y + Math.sin(a) * 1.2, 0.8); }
    ctx.fillStyle = '#ffd83a'; dot(ctx, hx + x, hy + y, 0.7);
  }
  if (inv) {
    // la felpa con cuernos de reno: la diadema por encima de la cabeza y dos cuernos con dos puntas
    // (con la maceta, la felpa va por encima de la maceta y los cuernos salen de arriba) [PROVISIONAL]
    ctx.strokeStyle = '#c4303a'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(hx, hy + 1, 12.4, Math.PI * 1.22, Math.PI * 1.78); ctx.stroke();
    ctx.strokeStyle = cuerno; ctx.lineWidth = 1.6;
    for (const side of [-1, 1]) {
      const bx = hx + side * 5.6, by = hy - 9.4;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + side * 1.6, by - 4, bx + side * 1, by - 7.4);
      ctx.moveTo(bx + side * 0.9, by - 3.2); ctx.lineTo(bx + side * 3.6, by - 5);
      ctx.moveTo(bx + side * 1.2, by - 5.6); ctx.lineTo(bx - side * 1, by - 7.2);
      ctx.stroke();
    }
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // los ojos no se ven (la maceta los tapa, Elora): solo la naricita y la sonrisita
  ctx.strokeStyle = line; ctx.lineWidth = 0.9; ctx.lineCap = 'round';
  if (inv) { ctx.fillStyle = '#e8303c'; dot(ctx, hx, hy + 3.1, 1.6); ctx.fillStyle = 'rgba(255,255,255,0.6)'; dot(ctx, hx - 0.5, hy + 2.6, 0.45); }   // la nariz pintada de rojo con pintacaras (Elora)
  else { ctx.fillStyle = B ? '#2a0306' : '#8a5a48'; dot(ctx, hx, hy + 3.3, 0.8); }
  ctx.beginPath(); ctx.moveTo(hx - 2, hy + 4.6); ctx.quadraticCurveTo(hx - 1, hy + 6, hx, hy + 4.8); ctx.quadraticCurveTo(hx + 1, hy + 6, hx + 2, hy + 4.6); ctx.stroke();
  if (!B) { ctx.save(); ctx.globalAlpha *= 0.45; ctx.fillStyle = '#f08aa8'; dot(ctx, hx - 5.2, hy + 3, 1.4); dot(ctx, hx + 5.2, hy + 3, 1.4); ctx.restore(); }
}

// Draila, según su ficha (Elora): cocodrilo verde de morro largo con la boca abierta enseñando los
// dientes y mirando de reojo; un top rosa-rojo que deja ver la barriga amarilla, con el ombligo en
// espiral, y pantalón rosa-rojo; una mano en la cintura; la cola verde con la tripa amarilla a rayitas; pies verdes.
function drawDraila(ctx, pal, facing, walk, opts) {
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color, skinDark = pal.dark;
  // skin de pijama (hecha por Clad a partir del cartel de Elora; Elora la dejó así): pijama de manga larga y pantalón
  // largo con estrellas; hecho por Clad y Elora lo dejó así
  const pj = pal.skin === 'pijama';
  // skin de Navidad (la pensó Elora con el quiz): disfrazada de árbol de Navidad, con la cara asomando por un
  // agujero; bolas de colores, guirnalda, lucecitas y la estrella en la punta
  const inv = pal.skin === 'invierno' && !B;
  // la otra skin de Navidad de Draila (Elora): un plumífero como el de Gec, pero azul, con guantes azules de borde blanco
  const plum = pal.skin === 'abrigo' && !B;
  const azul = '#3d6fd6', azulOsc = '#2a4f9e', azulClaro = '#6f95e6', blancoD = '#f7f6f0';
  const ropa = B ? '#5e0810' : pj ? '#3a4a8c' : rp ? '#8e5cd6' : '#e2405c', ropaDark = B ? '#3a0408' : pj ? '#263266' : rp ? '#6a3fae' : '#b52a44';
  const amarillo = B ? '#8a6a3a' : '#f3dc5a';
  const line = B ? '#2a0306' : '#1d241a';
  const hy = -20;   // el cuello largo (Elora)
  const step = Math.sin(walk) * 1.5;
  const lado = facing === 'left' ? 1 : -1;      // la cola sale por el lado contrario a donde mira
  const mira = facing === 'left' ? -1 : facing === 'right' ? 1 : 0;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // la cola: verde por arriba y amarilla por abajo, con rayitas
  const cola = () => {
    const w = Math.sin(walk * 0.8) * 2.5;
    ctx.strokeStyle = skin; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(lado * 3, 5); ctx.quadraticCurveTo(lado * 14, 9, lado * (19 + w), 3); ctx.stroke();
    ctx.strokeStyle = amarillo; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(lado * 5, 7); ctx.quadraticCurveTo(lado * 14, 10.4, lado * (18.5 + w), 4.6); ctx.stroke();
    ctx.strokeStyle = line; ctx.lineWidth = 0.5;
    ctx.beginPath(); for (const k of [8, 11, 14]) { ctx.moveTo(lado * k, 6.3 + k * 0.12); ctx.lineTo(lado * k, 9.4); } ctx.stroke();
  };
  if (!back) cola();
  // piernas: el pantalón rosa hasta la rodilla y la pierna verde con el pie
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.6 : 0;
    girado(ctx, piernaPose(opts, side), side * 3, 2, () => {
      ctx.fillStyle = plum ? skin : ropa; ctx.fillRect(side * 3 - 2, 2, 4, 4.5);
      ctx.fillStyle = pj ? ropa : skin; ctx.fillRect(side * 3 - 1.7, 6, 3.4, 4.5 + lift);   // con pijama, pantalón largo
      ctx.beginPath(); ctx.ellipse(side * 3.8, 10.8 + lift, 3, 1.7, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  if (inv) {
    // el disfraz de árbol: tres pisos verdes (de abajo arriba), el tronquito, la guirnalda dorada, las bolas,
    // las lucecitas que se encienden y se apagan, y el agujero de la cara
    const t0 = performance.now() / 1000;
    ctx.fillStyle = '#7a4a26'; ctx.fillRect(-2.4, 4, 4.8, 3);
    const piso = (yb, yt, w, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(-w, yb); ctx.quadraticCurveTo(0, yb + 1.6, w, yb); ctx.lineTo(0, yt); ctx.closePath(); ctx.fill(); };
    piso(5, -10, 11, '#1f7a3a'); piso(-3.5, -19, 9, '#24883f'); piso(-12, -31, 7.4, '#2a9447');
    ctx.save(); ctx.globalAlpha *= 0.25; ctx.fillStyle = '#0f4a22';
    ctx.beginPath(); ctx.moveTo(0, -31); ctx.lineTo(7.4, -12); ctx.lineTo(11, 5); ctx.lineTo(4, 5.6); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = '#f2c43a'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(-8.6, 0.6); ctx.quadraticCurveTo(0, 3.4, 8.8, -1); ctx.moveTo(-6.6, -7.6); ctx.quadraticCurveTo(0, -5.4, 6.8, -9); ctx.stroke();
    for (const [bx, by, c] of [[-6, 2.6, '#e8303c'], [4.6, 2.2, '#3a8ee8'], [-1, 3.6, '#f2c43a'], [-4.4, -5.4, '#b65fe0'], [3.8, -6.2, '#e8303c'], [8, 3.4, '#f2c43a']]) { ctx.fillStyle = c; dot(ctx, bx, by, 1.15); }
    for (const [lx, ly, i] of [[-8.4, 4.4, 0], [-2.8, -1.6, 1], [6.8, -1.8, 2], [-6.6, -9.6, 3], [6.2, -11.4, 4]]) {
      ctx.fillStyle = Math.sin(t0 * 3 + i * 1.7) > 0 ? '#fff7b0' : '#8a8460'; dot(ctx, lx, ly, 0.6);
    }
    ctx.fillStyle = '#145a2a'; dot(ctx, 0, hy, 9.6);   // el borde del agujero de la cara
  } else {
  // los brazos: uno con la mano en la cintura (en jarra) y el otro colgando; persiguiendo, los dos arriba
  ctx.strokeStyle = plum ? azul : pj ? ropa : skin; ctx.lineWidth = plum ? 4 : 2.8;   // con pijama, manga larga; con plumífero, gordita
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1);
    const hombroD = [side * 4.5, -10], aD = brazoPose(opts, side);
    const puntos = chasing ? [[side * 12 + sw, -17 + Math.abs(sw)]]
      : side === 1 ? [[side * 10, -4], [side * 5.5, -1]]   // la mano en la cintura
        : [[side * 7.5 + sw * 0.3, 1]];
    ctx.beginPath(); ctx.moveTo(hombroD[0], hombroD[1]);
    let q = hombroD, prev = hombroD;
    for (const pt of puntos) { prev = q; q = girar(pt, hombroD, aD); ctx.lineTo(q[0], q[1]); }
    ctx.stroke();
    if (pj) { ctx.fillStyle = skin; dot(ctx, q[0], q[1], 1.5); }   // la mano asoma por la manga
    if (plum) {   // el guante azul con el borde blanco (el borde, un poco antes de la mano, en el brazo)
      const dx = q[0] - prev[0], dy = q[1] - prev[1], l = Math.hypot(dx, dy) || 1;
      ctx.fillStyle = blancoD; dot(ctx, q[0] - dx / l * 2.2, q[1] - dy / l * 2.2, 2.1);
      ctx.fillStyle = azul; dot(ctx, q[0], q[1], 2.1);
      ctx.strokeStyle = azul; ctx.lineWidth = 4;
    }
  }
  // el cuerpo: largo y verde; lleva un top rosa-rojo y se le ve la barriga (Elora), que es amarilla
  // con el ombligo en espiral; abajo, el pantalón rosa-rojo
  ctx.fillStyle = skin;
  rrect(ctx, -5, -14, 10, 18, 2.5); ctx.fill();
  if (!back && !pj && !plum) {   // con pijama (o plumífero), la barriga va tapada
    ctx.fillStyle = amarillo; rrect(ctx, -3.6, -2.4, 6.2, 3.8, 1.3); ctx.fill();   // la barriga
    ctx.strokeStyle = line; ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let a = 0; a < Math.PI * 4; a += 0.3) { const r = 0.2 + a * 0.1; const x = -0.5 + Math.cos(a) * r, y = -0.5 + Math.sin(a) * r; if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
    ctx.stroke();   // el ombligo
  }
  if (plum) {
    // el plumífero azul gordito: franjas acolchadas, el cuello alto y la cremallera
    for (let k = 0; k < 4; k++) {
      const y = -15 + k * 4.6, ancho = 6.8 - Math.abs(k - 1.5) * 0.3;
      ctx.fillStyle = azulOsc; rrect(ctx, -ancho, y + 0.6, ancho * 2, 5.2, 2.5); ctx.fill();
      ctx.fillStyle = azul; rrect(ctx, -ancho, y, ancho * 2, 5, 2.4); ctx.fill();
      ctx.fillStyle = azulClaro; rrect(ctx, -ancho + 1, y + 0.8, ancho * 2 - 5, 1.1, 0.5); ctx.fill();
    }
    ctx.fillStyle = azul; rrect(ctx, -4.4, -16.4, 8.8, 3, 1.4); ctx.fill();
    if (!back) { ctx.fillStyle = '#c9c9d2'; ctx.fillRect(-0.3, -16, 0.7, 19.6); }
  } else {
  ctx.fillStyle = ropa;
  rrect(ctx, -5, -14, 10, pj ? 18.5 : 11.6, 2.5); ctx.fill();   // el top (largo, Elora); con pijama, todo
  ctx.fillRect(-5, 1.5, 10, 3);                  // el pantalón
  ctx.save(); ctx.globalAlpha *= 0.45; ctx.fillStyle = ropaDark; ctx.fillRect(2.5, -13, 2.5, 10); ctx.restore();
  }
  if (pj && !B) {
    // las estrellas del pijama: amarillas, de cuatro puntas, unas grandes y otras pequeñitas
    ctx.fillStyle = '#ffe36b';
    for (const [ex, ey, r] of [[-2.6, -11, 1.6], [1.8, -8, 1.1], [-1.4, -4.6, 1.3], [2.6, -1.4, 1.6], [-2.8, 1.6, 1], [0.6, 3.2, 0.9]]) estrella(ctx, ex, ey, r);
  }
  }
  if (back) cola();
  // la cabeza: redonda, verde, con el morro largo
  ctx.fillStyle = skin;
  ctx.beginPath(); ctx.arc(0, hy, 8.5, 0, Math.PI * 2); ctx.fill();
  if (inv) {
    // la estrella dorada en la punta del árbol
    ctx.fillStyle = '#ffd83a'; estrella(ctx, 0, -32.5, 3.4);
    ctx.fillStyle = '#fff3a0'; dot(ctx, 0, -32.5, 1);
    if (back) { ctx.fillStyle = '#145a2a'; dot(ctx, 0, hy, 9.6); ctx.fillStyle = '#24883f'; dot(ctx, 0, hy, 8.6); }   // de espaldas, todo árbol
  }
  if (B) bloodyMarks(ctx, 0, hy, facing);
  if (back) return;
  const morroX = mira * 8, morroY = mira ? 0 : 6;   // de frente, el morro hacia abajo; de lado, hacia ese lado
  const largo = mira ? 10 : 6.5;
  // la boca abierta, roja por dentro, con los dientes
  ctx.save(); ctx.translate(morroX, hy + 2 + morroY * 0.5);
  if (mira) ctx.scale(mira, 1);
  const ancho = mira ? largo : 7;
  if (mira) {
    ctx.fillStyle = skin;   // la mandíbula de arriba
    rrect(ctx, -2, -4.5, largo + 2, 4, 2); ctx.fill();
    rrect(ctx, -2, 1.5, largo, 3.4, 1.7); ctx.fill();   // la de abajo
    ctx.fillStyle = B ? '#3a0408' : '#c4303a'; ctx.fillRect(-1, -0.6, largo - 1, 2.2);   // por dentro
    ctx.fillStyle = '#fbfbf4';
    for (let i = 0; i < 3; i++) {
      const tx = 1 + i * 2.8;
      ctx.beginPath(); ctx.moveTo(tx - 1, -0.6); ctx.lineTo(tx, 1); ctx.lineTo(tx + 1, -0.6); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(tx + 0.4, 1.6); ctx.lineTo(tx + 1.4, 0.2); ctx.lineTo(tx + 2.4, 1.6); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = line; dot(ctx, largo - 1, -3.4, 0.5);   // la nariz
  } else {
    ctx.fillStyle = skin; rrect(ctx, -ancho / 2 - 1, -3, ancho + 2, 8.5, 3.5); ctx.fill();
    ctx.fillStyle = B ? '#3a0408' : '#c4303a'; rrect(ctx, -ancho / 2 + 0.5, 0.2, ancho - 1, 3.6, 1.5); ctx.fill();
    ctx.fillStyle = '#fbfbf4';
    for (let i = 0; i < 3; i++) {
      const tx = -2.4 + i * 2.4;
      ctx.beginPath(); ctx.moveTo(tx - 1, 0.2); ctx.lineTo(tx, 1.8); ctx.lineTo(tx + 1, 0.2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(tx - 1, 3.8); ctx.lineTo(tx, 2.4); ctx.lineTo(tx + 1, 3.8); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = line; dot(ctx, -1.3, -1.6, 0.5); dot(ctx, 1.3, -1.6, 0.5);   // la nariz
  }
  ctx.restore();
  // el ojo grande, mirando de reojo, con el párpado de enfadada (de Bloodie, rojo o amarillo)
  const ojos = mira ? [[-mira * 2.5]] : [[-3.2], [3.2]];
  for (const [ox] of ojos) {
    const x = ox, y = hy - 3;
    ctx.fillStyle = B ? '#f0d0c8' : '#fff'; dot(ctx, x, y, 2.8);
    ctx.fillStyle = B ? (chasing ? '#ffe36b' : '#7a0b12') : '#111';
    dot(ctx, x + (mira || (ox < 0 ? 1 : -1)) * 1.1, y + 0.4, 1.5);
    ctx.strokeStyle = line; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(x - 2.8, y - 2.6 + (ox < 0 ? 0 : 1)); ctx.lineTo(x + 2.8, y - 2.6 + (ox < 0 ? 1 : 0)); ctx.stroke();
  }
  if (rp) {   // gafas de sol de corazón (la ropa nueva)
    // más grandes y que se vean bien (Elora): montura rosa fuerte, cristal oscuro con un brillito y las patillas
    const gy = hy - 3.6;
    if (ojos.length > 1) { ctx.strokeStyle = '#e8337f'; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-1.4, gy - 0.6); ctx.lineTo(1.4, gy - 0.6); ctx.stroke(); }
    ctx.strokeStyle = '#e8337f'; ctx.lineWidth = 1.1;
    for (const [ox] of ojos) { const d = ojos.length > 1 ? Math.sign(ox) : -mira; ctx.beginPath(); ctx.moveTo(ox + d * 3.6, gy - 1); ctx.lineTo(ox + d * 6.4, gy - 2.2); ctx.stroke(); }
    for (const [ox] of ojos) {
      ctx.fillStyle = '#e8337f'; corazon(ctx, ox, gy, 4.2);
      ctx.fillStyle = '#2a0a1e'; corazon(ctx, ox, gy + 0.2, 3.1);
      ctx.fillStyle = 'rgba(255,255,255,0.55)'; dot(ctx, ox - 1.2, gy - 1, 0.7);
    }
  }
}

// Chop, el reno (ficha de Elora): marrón clarito, con los cuernos grandes marrón oscuro (y un lazo rosa de
// regalo en uno), los ojos cerrados de contento, la naricita roja en el hocico clarito, una bufanda blanca con
// rayas rojas y verdes que vuela, un jersey rojo-rosa de «MERRY CHRISTMAS» con un arbolito, las pezuñas
// marrón oscuro y una colita. De Bloodie le falta un trozo de cuerno.
function drawReno(ctx, pal, facing, walk, opts) {
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const skin = pal.color;
  const hocico = B ? '#c9a0a0' : '#ecd6ad', cuerno = B ? '#3a0408' : '#7a2e1e';
  // skin de pijama (la pensó Elora): camisón largo rojo con arbolitos de Navidad y gorro de Papá Noel
  const pj = pal.skin === 'pijama' && !B;
  // skin de Navidad (Elora): un abrigo largo rojo y verde, como su bufanda (a rayas), con la bufanda de siempre
  const inv = pal.skin === 'invierno' && !B;
  const rojoC = '#d42a36', verdeC = '#2e9a4c';
  const jersey = B ? '#5e0810' : pj ? '#d23240' : rp ? '#4f8fe0' : '#e2646e', jerseyOsc = B ? '#3a0408' : pj ? '#a3222e' : rp ? '#3567b0' : '#b8454f';
  const blanco = B ? '#c9a0a0' : '#f7f6f0', rojo = B ? '#5e0810' : '#d42a36', verde = B ? '#3a0408' : '#2e9a4c';
  const pezuna = B ? '#2a0306' : '#5a2418', line = B ? '#2a0306' : '#3a2016';
  const lado = facing === 'left' ? -1 : 1;   // hacia dónde vuela la bufanda
  const hx = facing === 'left' ? -1.5 : facing === 'right' ? 1.5 : 0, hy = -15;
  const step = Math.sin(walk) * 1.5;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // la colita (detrás si mira de frente)
  const cola = () => { ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, 4, 2.4, 1.8, 0, 0, Math.PI * 2); ctx.fill(); };
  if (!back) { ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(-lado * 6.5, 4.5, 2, 1.4, -lado * 0.5, 0, Math.PI * 2); ctx.fill(); }
  // patas marrón clarito con las pezuñas oscuras
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.6 : 0;
    girado(ctx, piernaPose(opts, side), side * 3.4, 3, () => {
      ctx.fillStyle = skin; ctx.fillRect(side * 3.4 - 1.7, 3, 3.4, 7 + lift);
      ctx.fillStyle = pezuna; rrect(ctx, side * 3.4 - 2.2, 9 + lift, 4.4, 2.6, 1); ctx.fill();
    });
  }
  if (pj) {
    // el camisón largo rojo con arbolitos de Navidad (por delante y por detrás); redondito, con los hombros
    // curvos, los lados que se abren en curva y el bajo ondulado (Elora: "menos cuadrado"), y pegado al
    // cuerpo (Elora: "muy ancho")
    const camisonRedondo = (relleno) => {
      ctx.beginPath();
      ctx.moveTo(-4.6, -9.5);
      ctx.quadraticCurveTo(0, -10.4, 4.6, -9.5);
      ctx.quadraticCurveTo(6.8, -8.8, 6.6, -4.5);
      ctx.bezierCurveTo(6.4, 0, 7.6, 3.5, 7.2, 7);
      for (let k = 0; k < 4; k++) { const x0 = 7.2 - k * 3.6; ctx.quadraticCurveTo(x0 - 1.8, 9.2, x0 - 3.6, 7.6); }
      ctx.bezierCurveTo(-7.6, 3.5, -6.4, 0, -6.6, -4.5);
      ctx.quadraticCurveTo(-6.8, -8.8, -4.6, -9.5);
      ctx.closePath(); ctx.fillStyle = relleno; ctx.fill();
    };
    camisonRedondo(jersey);
    ctx.save(); ctx.clip(); ctx.globalAlpha *= 0.4; ctx.fillStyle = jerseyOsc;
    ctx.beginPath(); ctx.ellipse(5.6, 1, 2.6, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    for (const [ax, ay, t] of [[-2.8, -5.5, 0.9], [2.4, -3.5, 0.85], [-2, 2.2, 0.9], [3.1, 4.2, 0.85], [-4.4, 5.6, 0.75], [0.5, -0.8, 0.75]]) {
      ctx.fillStyle = '#2e9a4c';
      ctx.beginPath(); ctx.moveTo(ax, ay - 2 * t); ctx.lineTo(ax + 1.4 * t, ay + 0.8 * t); ctx.lineTo(ax - 1.4 * t, ay + 0.8 * t); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffd83a'; dot(ctx, ax, ay - 2.1 * t, 0.45 * t);
    }
  } else if (inv) {
    // el abrigo largo a rayas rojas y verdes, con los botones blancos
    ctx.save();
    ctx.beginPath(); ctx.moveTo(-6.6, -9.5); ctx.lineTo(6.6, -9.5); ctx.lineTo(8, 7.6); ctx.lineTo(-8, 7.6); ctx.closePath(); ctx.clip();
    for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? verdeC : rojoC; ctx.fillRect(-9, -9.5 + k * 3.2, 18, 3.3); }
    ctx.globalAlpha *= 0.3; ctx.fillStyle = '#3a0a10'; ctx.fillRect(4, -9.5, 4, 18);
    ctx.restore();
    if (!back) {
      ctx.strokeStyle = '#7a1018'; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(0.5, -7); ctx.lineTo(0.5, 7.6); ctx.stroke();
      for (const by of [-4.6, -0.6, 3.4]) { ctx.fillStyle = '#f7f6f0'; dot(ctx, -1.3, by, 1.05); }
    }
  } else {
  // el jersey rojo-rosa
  ctx.fillStyle = jersey; rrect(ctx, -6.5, -9, 13, 13.5, 3.5); ctx.fill();
  ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = jerseyOsc; ctx.fillRect(3.5, -8, 2.5, 11.5); ctx.restore();
  ctx.fillStyle = jerseyOsc; ctx.fillRect(-6.5, 2.6, 13, 1.6);   // el borde de abajo
  }
  if (!back && !B && !pj && !inv) {
    // el arbolito y las letras verdes de «MERRY CHRISTMAS» (a este tamaño, dos rayitas de letras)
    ctx.fillStyle = verde;
    ctx.beginPath(); ctx.moveTo(0, -7.6); ctx.lineTo(1.8, -4.4); ctx.lineTo(-1.8, -4.4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffd83a'; dot(ctx, 0, -7.8, 0.6);
    ctx.strokeStyle = '#3fbf5a'; ctx.lineWidth = 0.8;
    ctx.beginPath();
    for (let x = -4.4; x <= 3.6; x += 1.6) { ctx.moveTo(x, -2.6); ctx.lineTo(x + 0.9, -2.6); }
    for (let x = -5; x <= 4.2; x += 1.4) { ctx.moveTo(x, -0.6); ctx.lineTo(x + 0.8, -0.6); }
    ctx.stroke();
  }
  // brazos con las mangas del jersey y las pezuñas (de Bloodie que persigue, arriba). Van encima del
  // jersey: así, si se ponen en la barriga, se ven por delante (Elora)
  for (const side of [-1, 1]) {
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.4);
    const h = girar(chasing ? [side * 13 + sw, -18 + Math.abs(sw)] : [side * 10 + sw * 0.4, 2], [side * 5.5, -6], brazoPose(opts, side));
    ctx.strokeStyle = jerseyOsc; ctx.lineWidth = 3.9;
    ctx.beginPath(); ctx.moveTo(side * 5.5, -6); ctx.lineTo(h[0], h[1]); ctx.stroke();
    ctx.strokeStyle = inv ? rojoC : jersey; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(side * 5.5, -6); ctx.lineTo(h[0], h[1]); ctx.stroke();
    if (inv) { ctx.fillStyle = verdeC; dot(ctx, side * 5.5 + (h[0] - side * 5.5) * 0.8, -6 + (h[1] + 6) * 0.8, 1.8); }   // el puño verde
    ctx.fillStyle = pezuna; dot(ctx, h[0], h[1], 1.6);
  }
  if (back) cola();
  // los cuernos grandes marrón oscuro: un tronco que sube y tres puntas hacia dentro (como una E)
  const cuernoDe = (side) => {
    const x0 = hx + side * 3.4, y0 = hy - 6.5;
    const roto = B && side === 1;
    ctx.strokeStyle = cuerno; ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + side * 6, y0 - 4, x0 + side * 6, y0 - (roto ? 8 : 13));
    ctx.moveTo(x0 + side * 3, y0 - 2.6); ctx.lineTo(x0 + side * 1, y0 - 6);
    if (!roto) { ctx.moveTo(x0 + side * 5.6, y0 - 7); ctx.lineTo(x0 + side * 2.6, y0 - 9.6); ctx.moveTo(x0 + side * 6, y0 - 11); ctx.lineTo(x0 + side * 3.4, y0 - 13.4); }
    ctx.stroke();
  };
  // el lazo rosa de regalo en un cuerno (Elora)
  const lazo = () => {
    if (B) return;
    const lx = hx + 3.4 + 6.2, ly = hy - 6.5 - 11;
    ctx.fillStyle = '#f08aa8';
    ctx.beginPath(); ctx.ellipse(lx - 1.6, ly, 1.7, 1.1, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(lx + 1.6, ly, 1.7, 1.1, 0.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#d4607e'; dot(ctx, lx, ly, 0.8);
  };
  if (!inv) { cuernoDe(-1); cuernoDe(1); lazo(); }   // (con el gorrito, se pintan después)
  // las orejas, de lado
  for (const side of [-1, 1]) {
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(hx + side * 8.4, hy - 2.5, 3.4, 1.7, side * 0.5, 0, Math.PI * 2); ctx.fill();
    if (!back) { ctx.fillStyle = hocico; ctx.beginPath(); ctx.ellipse(hx + side * 8.5, hy - 2.5, 1.8, 0.8, side * 0.5, 0, Math.PI * 2); ctx.fill(); }
  }
  // la cabeza
  ctx.fillStyle = skin; dot(ctx, hx, hy, 8);
  if (inv) {
    // el gorrito rojo con el borde verde (Elora): tiene un agujero a la derecha por donde sale el cuerno del lazo;
    // el otro cuerno queda escondido debajo
    ctx.fillStyle = rojoC;
    ctx.beginPath(); ctx.moveTo(hx - 8, hy - 3); ctx.quadraticCurveTo(hx - 8.2, hy - 12.6, hx, hy - 12.8); ctx.quadraticCurveTo(hx + 8.2, hy - 12.6, hx + 8, hy - 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = verdeC; rrect(ctx, hx - 8.4, hy - 5.4, 16.8, 2.8, 1.3); ctx.fill();
    ctx.fillStyle = '#7a1018'; ctx.beginPath(); ctx.ellipse(hx + 3.6, hy - 7.2, 1.8, 1.1, 0, 0, Math.PI * 2); ctx.fill();   // el agujero
    cuernoDe(1); lazo();
  }
  // en pijama, el gorro de Papá Noel (sin bufanda): rojo, con el borde blanco y el pompón que cae a un lado
  if (pj) {
    ctx.fillStyle = '#d42a36';
    ctx.beginPath(); ctx.moveTo(hx - 7, hy - 4.5);
    ctx.quadraticCurveTo(hx - 3, hy - 15, hx + 4, hy - 13);
    ctx.quadraticCurveTo(hx + 10, hy - 11, hx + 11.5, hy - 4);
    ctx.lineTo(hx + 9.6, hy - 3.6); ctx.quadraticCurveTo(hx + 8, hy - 7, hx + 6, hy - 5.5);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#f7f6f0'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx - 7.4, hy - 4.2); ctx.quadraticCurveTo(hx - 0.5, hy - 8, hx + 6.6, hy - 5.4); ctx.stroke();
    ctx.fillStyle = '#f7f6f0'; dot(ctx, hx + 11, hy - 3, 1.9);
  } else {
  // la bufanda blanca con rayas rojas y verdes, y la punta larga que vuela hacia un lado
  ctx.fillStyle = blanco; rrect(ctx, -6.5, -10, 13, 3.4, 1.6); ctx.fill();
  const punta = [[lado * 4, -9], [lado * 9, -8.4], [lado * 12, -10.4], [lado * 15.5, -8.6]];
  const ola = Math.sin(walk) * 0.6;
  ctx.strokeStyle = blanco; ctx.lineWidth = 2.6;
  ctx.beginPath(); ctx.moveTo(punta[0][0], punta[0][1]);
  ctx.bezierCurveTo(punta[1][0], punta[1][1] + ola, punta[2][0], punta[2][1] - ola, punta[3][0], punta[3][1]);
  ctx.stroke();
  if (!B) {
    for (const [x, c] of [[-4.6, rojo], [-2, verde], [0.6, rojo], [3.2, verde]]) { ctx.fillStyle = c; ctx.fillRect(x, -10, 1.2, 3.4); }
    for (const [k, c] of [[0.3, rojo], [0.55, verde], [0.8, rojo]]) {
      const u = 1 - k;
      const px = u * u * u * punta[0][0] + 3 * u * u * k * punta[1][0] + 3 * u * k * k * punta[2][0] + k * k * k * punta[3][0];
      const py = u * u * u * punta[0][1] + 3 * u * u * k * (punta[1][1] + ola) + 3 * u * k * k * (punta[2][1] - ola) + k * k * k * punta[3][1];
      ctx.fillStyle = c; dot(ctx, px, py, 1.15);
    }
  }
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  // el hocico clarito con la naricita roja, los ojos cerrados de contento y una sonrisita
  const mx = hx + (facing === 'left' ? -1.5 : facing === 'right' ? 1.5 : 0);
  ctx.fillStyle = hocico; ctx.beginPath(); ctx.ellipse(mx, hy + 3.4, 4, 3.1, 0, 0, Math.PI * 2); ctx.fill();
  // con la Nariz brillante encendida (opts.nariz), la naricita brilla roja
  if (opts.nariz && !B) {
    const pulso = 0.5 + 0.2 * Math.sin(walk * 2 + performance.now() / 120);
    ctx.fillStyle = `rgba(255, 70, 70, ${pulso * 0.45})`; dot(ctx, mx, hy + 1.5, 4.2);
    ctx.fillStyle = `rgba(255, 120, 110, ${pulso * 0.6})`; dot(ctx, mx, hy + 1.5, 2.4);
  }
  ctx.fillStyle = B ? '#2a0306' : opts.nariz ? '#ff4a4a' : '#c0303a'; dot(ctx, mx, hy + 1.5, 1.2);
  ctx.strokeStyle = B && chasing ? '#ffe36b' : line; ctx.lineWidth = 0.9;
  for (const side of [-1, 1]) {
    const ex = hx + side * 3.3 + (mx - hx) * 0.5;
    ctx.beginPath(); ctx.arc(ex, hy - 1.4, 1.8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  }
  ctx.strokeStyle = line; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(mx - 1.6, hy + 4.2); ctx.quadraticCurveTo(mx, hy + 5.6, mx + 1.6, hy + 4.2); ctx.stroke();
  if (rp) {   // gafas redondas doradas (la ropa nueva)
    ctx.strokeStyle = '#d9a400'; ctx.lineWidth = 0.7;
    for (const side of [-1, 1]) { const gx = hx + side * 3.3 + (mx - hx) * 0.5; ctx.beginPath(); ctx.arc(gx, hy - 1.6, 2.6, 0, Math.PI * 2); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(hx - 0.7 + (mx - hx) * 0.5, hy - 1.8); ctx.lineTo(hx + 0.7 + (mx - hx) * 0.5, hy - 1.8); ctx.stroke();
  }
}

// Drake, el dragón (ficha de Elora): rosa-rojo, con el hocico largo, las orejas puntiagudas (rojas por dentro),
// los ojos cerrados de contento y un colmillito; unas alas enormes de murciélago, rosas, con el borde de picos;
// una camiseta amarilla que pone «FIRE» (Elora: "fire", fuego) con un monstruito de fuego dibujado; las patas
// rosas con garras y la cola larga naranja con rayas. Volando (opts.flap), las alas baten.
// En pijama, la bata amarilla clarita con llamitas y el peluchito de humano (batoDrake). De Bloodie, ala rota.
function drawDrake(ctx, pal, facing, walk, opts) {
  const rp = pal.skin === 'ropa' && !opts.bloody;   // la ropa nueva (la hizo Clad para Elora) [PROVISIONAL]
  const B = !!opts.bloody, chasing = !!opts.chasing, back = facing === 'up';
  const piel = pal.color, oscuro = pal.dark;
  const pj = pal.skin === 'pijama' && !B;
  // skin de Navidad (la pensó Elora con el quiz): de elfo. Traje verde y gorro puntiagudo verde con un cascabel
  const elfo = pal.skin === 'invierno' && !B;
  const verdeE = '#2e9a4c', verdeEOsc = '#1f6e36';
  // la otra skin de Navidad de Drake (Elora): un plumífero con los colores del fuego (rojo, naranja y amarillo) en
  // tonos de otoño, tostaditos
  const otono = pal.skin === 'abrigo' && !B;
  const franjas = [['#b8452c', '#8a3020'], ['#d9772b', '#a8561c'], ['#dfa42e', '#ad7c1c'], ['#b8452c', '#8a3020']];
  const membrana = B ? '#7a1018' : '#f3c2cc', camiseta = B ? '#5e0810' : rp ? '#2f3340' : '#f6e23a', camOsc = B ? '#3a0408' : rp ? '#1d2029' : '#d8bf1c';
  const cola = B ? '#5e0810' : '#f2a03a', colaRaya = B ? '#2a0306' : '#c9701a', line = B ? '#2a0306' : '#4a2230';
  const lado = facing === 'left' ? -1 : facing === 'right' ? 1 : 0;
  const hx = lado * 1.5, hy = -15;
  const step = Math.sin(walk) * 1.5;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  // las alas enormes, detrás (volando baten más)
  // volando (su habilidad), las alas suben y bajan mucho (Elora): arriba del todo y abajo del todo
  const vuela = opts.flap != null;
  const sf = vuela ? Math.sin(opts.flap) : 0;
  const bate = vuela ? sf * (sf > 0 ? 0.85 : 0.55) : Math.sin(walk * 0.5) * 0.06;
  const grande = vuela ? 1.25 : 1;
  const alto = vuela ? 1 - 0.35 * Math.max(0, sf) : 1;   // abajo, el ala se ve más corta (de canto)
  for (const side of [-1, 1]) {
    // con una pose (el Taller de Andares de Elora), cada ala se puede mover
    const alaPose = angPose(opts, side < 0 ? 'ai' : 'ad');
    ctx.save(); ctx.translate(side * 4, -7); if (alaPose) ctx.rotate(alaPose);
    ctx.rotate(side * (bate - (vuela ? 0.25 : 0.1))); ctx.scale(side * grande, grande * alto);
    const roto = B && side === 1;
    const largo = roto ? 0.6 : 1;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(9 * largo, -11); ctx.lineTo(22 * largo, -9);
    ctx.lineTo(20 * largo, 1); ctx.lineTo(16 * largo, -2); ctx.lineTo(13 * largo, 4); ctx.lineTo(9 * largo, 0); ctx.lineTo(5 * largo, 6); ctx.lineTo(1.5, 3);
    ctx.closePath();
    if (elfo) {   // de elfo, la tela de las alas con un difuminado de azul clarito a morado clarito (Elora)
      const gr = ctx.createLinearGradient(0, -6, 22 * largo, -4);
      gr.addColorStop(0, '#a9d4ff'); gr.addColorStop(1, '#d6bcff');
      ctx.fillStyle = gr;
    } else ctx.fillStyle = membrana;
    ctx.fill();
    // los huesos del ala, del color de la piel
    ctx.strokeStyle = elfo ? '#8a4fd0' : piel; ctx.lineWidth = 1.6;   // de elfo, los huesos morados (Elora)
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(9 * largo, -11); ctx.lineTo(22 * largo, -9);
    ctx.moveTo(9 * largo, -11); ctx.lineTo(16 * largo, -2); ctx.moveTo(9 * largo, -11); ctx.lineTo(9 * largo, 0); ctx.stroke();
    ctx.restore();
  }
  // la cola larga naranja con rayas, hacia un lado (detrás)
  const cl = lado || 1, ola = Math.sin(walk * 0.8) * 1.5;
  const colaCurva = () => { ctx.beginPath(); ctx.moveTo(cl * 2, 5); ctx.quadraticCurveTo(cl * 10, 10 + ola, cl * 17, 6 - ola); };
  ctx.strokeStyle = cola; ctx.lineWidth = 3.6; colaCurva(); ctx.stroke();
  ctx.strokeStyle = colaRaya; ctx.lineWidth = 0.8;
  ctx.beginPath(); for (const k of [0.35, 0.55, 0.75]) { const x = cl * (2 + 15 * k), y = 5 + (k < 0.6 ? 4 : 2.5); ctx.moveTo(x - 1, y - 1.6); ctx.lineTo(x + 1, y + 1.6); } ctx.stroke();
  // las patas rosas con garras
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.6 : 0;
    girado(ctx, piernaPose(opts, side), side * 3.4, 3, () => {
      ctx.fillStyle = piel; ctx.fillRect(side * 3.4 - 1.8, 3, 3.6, 7 + lift);
      ctx.beginPath(); ctx.ellipse(side * 3.6, 10 + lift, 2.7, 1.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 0.6;
      ctx.beginPath(); for (let i = -1; i <= 1; i++) { ctx.moveTo(side * 3.6 + i * 1.3, 11); ctx.lineTo(side * 3.6 + i * 1.6, 12.2 + lift); } ctx.stroke();
    });
  }
  // los brazos rosas, en las mangas de la camiseta, con garritas (de Bloodie que persigue, arriba)
  for (const side of [-1, 1]) {
    if (pj && side === -1 && !back) continue;   // en pijama, ese brazo abraza al peluchito
    const sw = Math.sin(walk * (chasing ? 2 : 0.7) + side) * (chasing ? 4 : 1.4);
    const h = girar(chasing ? [side * 13 + sw, -18 + Math.abs(sw)] : [side * 10 + sw * 0.4, 2], [side * 5.5, -6], brazoPose(opts, side));
    ctx.strokeStyle = piel; ctx.lineWidth = 2.8;
    ctx.beginPath(); ctx.moveTo(side * 5.5, -6); ctx.lineTo(h[0], h[1]); ctx.stroke();
    ctx.fillStyle = piel; dot(ctx, h[0], h[1], 1.6);
    ctx.strokeStyle = pj ? '#fbe9a2' : elfo ? verdeE : otono ? '#d9772b' : camiseta; ctx.lineWidth = otono ? 4.2 : 3.4;
    const m = [side * 5.5 + (h[0] - side * 5.5) * 0.4, -6 + (h[1] + 6) * 0.4];
    ctx.beginPath(); ctx.moveTo(side * 5.5, -6); ctx.lineTo(m[0], m[1]); ctx.stroke();
  }
  if (pj) batoDrake(ctx, facing, piel);
  else if (otono) {
    // el plumífero de otoño: franjas acolchadas rojo, naranja, amarillo y rojo tostados, cuello alto y cremallera
    franjas.forEach(([c, o], k) => {
      const y = -10.5 + k * 3.9, ancho = 7.6 - Math.abs(k - 1.5) * 0.3;
      ctx.fillStyle = o; rrect(ctx, -ancho, y + 0.6, ancho * 2, 4.4, 2.2); ctx.fill();
      ctx.fillStyle = c; rrect(ctx, -ancho, y, ancho * 2, 4.2, 2.1); ctx.fill();
      ctx.fillStyle = 'rgba(255,240,210,0.35)'; rrect(ctx, -ancho + 1.2, y + 0.7, ancho * 2 - 6, 1, 0.5); ctx.fill();
    });
    ctx.fillStyle = '#b8452c'; rrect(ctx, -4.8, -11.8, 9.6, 3, 1.4); ctx.fill();
    if (!back) { ctx.fillStyle = '#e8dcc4'; ctx.fillRect(-0.3, -11.4, 0.7, 15.8); }
  } else if (elfo) {
    // el traje verde de elfo, con el bajo de picos
    ctx.fillStyle = verdeE; rrect(ctx, -6.5, -9.5, 13, 12, 3); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-6.5, 1.5);
    for (let k = 0; k < 5; k++) { const x = -6.5 + k * 2.6; ctx.lineTo(x + 1.3, 4.6); ctx.lineTo(x + 2.6, 1.5); }
    ctx.closePath(); ctx.fill();
    ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = verdeEOsc; ctx.fillRect(3.4, -8.5, 2.6, 10); ctx.restore();
    // el cinturón negro con la hebilla dorada (Elora: cinturón sí, cuello de picos no)
    ctx.fillStyle = '#1e1a1c'; ctx.fillRect(-6.5, -2.4, 13, 2);
    ctx.fillStyle = '#f2c43a'; ctx.fillRect(-1.5, -2.8, 3, 2.8); ctx.fillStyle = '#1e1a1c'; ctx.fillRect(-0.7, -2, 1.4, 1.2);
  } else {
    // la camiseta amarilla
    ctx.fillStyle = camiseta; rrect(ctx, -6.5, -9.5, 13, 13, 3); ctx.fill();
    ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = camOsc; ctx.fillRect(3.4, -8.5, 2.6, 11); ctx.restore();
    if (!back && !B) {
      // «FIRE» (con letras de fuego) y el monstruito de fuego: llama roja con la carita clarita y dientes
      ctx.fillStyle = rp ? '#ffd23f' : '#3b3330'; ctx.font = 'bold 3.6px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('FIRE', 0, -6.6);
      ctx.fillStyle = '#e8452c';
      ctx.beginPath(); ctx.moveTo(0, -4.6); ctx.quadraticCurveTo(1.2, -3.2, 2.2, -4); ctx.quadraticCurveTo(3.4, -1, 2.2, 2.2);
      ctx.lineTo(-2.2, 2.2); ctx.quadraticCurveTo(-3.4, -1, -2.2, -4); ctx.quadraticCurveTo(-1.2, -3.2, 0, -4.6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffb48a'; ctx.beginPath(); ctx.ellipse(0, -0.8, 1.5, 1.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2a2020'; dot(ctx, -0.6, -1.4, 0.25); dot(ctx, 0.6, -1.4, 0.25);
      ctx.fillStyle = '#fff'; ctx.fillRect(-0.7, -0.4, 1.4, 0.5);
    }
  }
  // las orejas puntiagudas, rojas por dentro
  for (const side of [-1, 1]) {
    ctx.fillStyle = piel;
    ctx.beginPath(); ctx.moveTo(hx + side * 2.8, hy - 6); ctx.lineTo(hx + side * 7.5, hy - 12.5); ctx.lineTo(hx + side * 7.6, hy - 3.5); ctx.closePath(); ctx.fill();
    if (!back) {
      ctx.fillStyle = B ? '#3a0408' : '#e0263a';
      ctx.beginPath(); ctx.moveTo(hx + side * 4.2, hy - 6); ctx.lineTo(hx + side * 7, hy - 10.4); ctx.lineTo(hx + side * 6.9, hy - 5); ctx.closePath(); ctx.fill();
    }
  }
  // la cabeza
  ctx.fillStyle = piel; dot(ctx, hx, hy, 8);
  // el hocico largo: de lado sale hacia donde mira; de frente, hacia abajo
  const sx = hx + lado * 7, sy = hy + (lado ? 1.5 : 3.6);
  ctx.fillStyle = piel; ctx.beginPath(); ctx.ellipse(sx, sy, lado ? 6 : 4.4, lado ? 3.6 : 3.4, 0, 0, Math.PI * 2); ctx.fill();
  if (elfo) {
    // el gorro puntiagudo verde de elfo, entre las orejas, con la punta que cae y el cascabel dorado
    ctx.fillStyle = verdeE;
    ctx.beginPath(); ctx.moveTo(hx - 5.4, hy - 4.6);
    ctx.quadraticCurveTo(hx - 2, hy - 15, hx + 3.5, hy - 19);
    ctx.quadraticCurveTo(hx + 8.5, hy - 21, hx + 10.4, hy - 16.4);
    ctx.quadraticCurveTo(hx + 6, hy - 16.6, hx + 5.4, hy - 4.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = verdeEOsc; rrect(ctx, hx - 6, hy - 6.4, 12, 2.6, 1.2); ctx.fill();
    ctx.fillStyle = '#f2c43a'; dot(ctx, hx + 10.4, hy - 15.6, 1.8);
    ctx.fillStyle = '#b8901e'; dot(ctx, hx + 10.4, hy - 15, 0.5);
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (back) return;
  ctx.fillStyle = oscuro;   // los agujeritos de la nariz
  if (lado) dot(ctx, sx + lado * 4.2, sy - 1.4, 0.6);
  else { dot(ctx, sx - 1.2, sy - 0.8, 0.55); dot(ctx, sx + 1.2, sy - 0.8, 0.55); }
  // la sonrisa con un colmillito blanco
  ctx.strokeStyle = line; ctx.lineWidth = 0.7;
  ctx.beginPath();
  if (lado) { ctx.moveTo(sx + lado * 4.5, sy + 1.6); ctx.quadraticCurveTo(sx, sy + 3, sx - lado * 3.4, sy + 1); }
  else { ctx.moveTo(sx - 2.6, sy + 1.4); ctx.quadraticCurveTo(sx, sy + 2.8, sx + 2.6, sy + 1.4); }
  ctx.stroke();
  ctx.fillStyle = '#fff';
  const fx = lado ? sx - lado * 1.6 : sx + 1.4, fy = lado ? sy + 2.3 : sy + 2;
  ctx.beginPath(); ctx.moveTo(fx - 0.7, fy - 0.3); ctx.lineTo(fx, fy + 1.6); ctx.lineTo(fx + 0.7, fy - 0.3); ctx.closePath(); ctx.fill();
  // los ojos cerrados de contento (de Bloodie que persigue, amarillos)
  ctx.strokeStyle = B && chasing ? '#ffe36b' : line; ctx.lineWidth = 0.9;
  const ojos = lado ? [hx + lado * 1.5] : [hx - 3.2, hx + 3.2];
  for (const ex of ojos) { ctx.beginPath(); ctx.arc(ex, hy - 2, 1.9, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
  if (rp) {   // gafas de sol negras (la ropa nueva)
    ctx.fillStyle = '#1a1820'; for (const gx of ojos) { rrect(ctx, gx - 2.6, hy - 3.8, 5.2, 3.2, 1.2); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (const gx of ojos) ctx.fillRect(gx - 1.8, hy - 3.2, 1.2, 0.8);
    if (ojos.length > 1) { ctx.strokeStyle = '#1a1820'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(ojos[0] + 2.6, hy - 2.6); ctx.lineTo(ojos[1] - 2.6, hy - 2.6); ctx.stroke(); }
  }
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
  // en Navidad, vestido entero de Papá Noel (Elora): traje rojo con pelito blanco, cinturón negro, gorro y barba
  const pn = !!opts.navidad, rojoPN = '#c8202c', blancoPN = '#f2ece4';
  if (pn) {
    ctx.fillStyle = rojoPN; ctx.strokeStyle = linea; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.ellipse(0, 1, 7.2, 9.2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = blancoPN;
    for (let x = -5.6; x <= 5.7; x += 1.4) dot(ctx, x, 8.6 - Math.abs(x) * 0.25, 1.1);   // el pelito de abajo
    for (let y = -6; y <= 7; y += 1.5) dot(ctx, 0, y, 0.9);                              // la tira de delante
    ctx.fillStyle = '#1e1a1c'; ctx.fillRect(-7, 2, 14, 2);                              // el cinturón
    ctx.fillStyle = '#f2c43a'; ctx.fillRect(-1.5, 1.6, 3, 2.8); ctx.fillStyle = '#1e1a1c'; ctx.fillRect(-0.7, 2.4, 1.4, 1.2);
  }
  // los bracitos con garras
  for (const lado of [-1, 1]) {
    if (pn) {   // las mangas rojas con el puño blanco
      ctx.strokeStyle = rojoPN; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(lado * 6, -3); ctx.lineTo(lado * 8.4, 0.2); ctx.stroke();
      ctx.fillStyle = blancoPN; dot(ctx, lado * 8.6, 0.6, 1.3);
    }
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
  if (pn) gorritoNavidad(ctx, 0, -20.6, false);
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
  if (pn) {
    // la barba blanca de Papá Noel, debajo de la boca
    ctx.fillStyle = blancoPN;
    for (const [bx, by, r] of [[-4.6, -6.6, 1.8], [-2.4, -5.6, 2], [0, -5, 2.1], [2.4, -5.6, 2], [4.6, -6.6, 1.8], [-1.2, -3.2, 1.7], [1.2, -3.2, 1.7], [0, -1.6, 1.3]]) dot(ctx, bx, by, r);
  }
  // una gota de sangre que le cae de la boca
  const gota = (Math.sin(walk * 0.5) + 1) * 0.8;
  ctx.fillStyle = '#a3141c';
  ctx.beginPath(); ctx.ellipse(0.5, -6 + gota, 0.9, 1.4 + gota * 0.4, 0, 0, Math.PI * 2); ctx.fill();
}

// La perrita (Elora, 9-11-2026; la dibujó Clad con lo que contó Elora, hasta que ella haga su ficha): beige,
// orejas hacia abajo, un lirio rosa con el polen amarillo en la oreja izquierda (la del lazo de Carot; venenoso,
// porque es una amistad tóxica), collar rosa con un corazón amarillo y vestido azul.
function drawPerrita(ctx, pal, facing, walk, opts) {
  const B = !!opts.bloody, back = facing === 'up';
  // skins (Elora): pijama = camisón largo azul con liritos, sin el lirio y con un peluchito de perrito blanco con
  // manchas negras (como el de Carot); invierno (Navidad) = abrigo, gorro y bufanda azules, el gorro en lugar del
  // lirio; ropa = vestido morado (como el de Carot…) con el lirio blanco
  const pj = pal.skin === 'pijama' && !B, inv = pal.skin === 'invierno' && !B, rp = pal.skin === 'ropa' && !B;
  const beige = pal.color, beigeOsc = pal.dark, claro = B ? '#c9a0a0' : '#f6e7cc', marron = B ? '#2a0306' : '#4a3226';
  const vestido = B ? '#5e0810' : rp ? '#a07ad8' : '#6fa8e8', vestidoOsc = B ? '#3a0408' : rp ? '#7048b0' : '#3f78c4';
  const azulAbrigo = '#3f74cf', azulAbrigoOsc = '#2a55a3', azulClaro = '#8fbaf0', blanco = '#f7f6f0';
  const abraza = pj && !back && !opts.pose;   // en pijama, sin pose, un brazo abraza el peluchito
  const lado = facing === 'left' ? -1 : facing === 'right' ? 1 : 0;
  const step = Math.sin(walk) * 1.5;
  // la cola, de contenta (se mueve al andar)
  ctx.strokeStyle = beige; ctx.lineWidth = 3; ctx.lineCap = 'round';
  const cola = Math.sin(walk * 2) * 1.5;
  ctx.beginPath(); ctx.moveTo(7, 3); ctx.quadraticCurveTo(14, 0 + cola, 13 + cola, -6); ctx.stroke();
  // piernas y patitas
  for (const side of [-1, 1]) {
    const lift = side * step > 0 ? -side * step * 0.6 : 0;
    girado(ctx, piernaPose(opts, side), side * 3.5, 3, () => {
      ctx.fillStyle = beige; ctx.fillRect(side * 3.5 - 1.7, 3, 3.4, 8 + lift);
      ctx.beginPath(); ctx.ellipse(side * 4, 11 + lift, 3.2, 1.9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = claro; ctx.beginPath(); ctx.ellipse(side * 4, 11.3 + lift, 2, 1, 0, 0, Math.PI * 2); ctx.fill();
    });
  }
  ctx.fillStyle = beige; ctx.beginPath(); ctx.ellipse(0, 0, 7, 8, 0, 0, Math.PI * 2); ctx.fill();
  if (pj) {
    // el camisón largo azul, recto, con liritos rosas
    ctx.fillStyle = '#6fa8e8';
    ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.lineTo(8, 9); ctx.lineTo(-8, 9); ctx.closePath(); ctx.fill();
    for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 4.5 : -8, -8, 3.5, 4);
    ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = '#3f78c4';
    ctx.beginPath(); ctx.moveTo(3.5, -7); ctx.lineTo(6, -7); ctx.lineTo(7.8, 8.8); ctx.lineTo(5, 8.8); ctx.closePath(); ctx.fill(); ctx.restore();
    for (const [lx, ly] of [[-4.4, -5], [3, -5.6], [-5, 2], [4.6, 1.2], [-1.6, 6], [3.2, 6.6], [0.4, -1.6]]) {
      ctx.save(); ctx.translate(lx, ly); ctx.scale(0.22, 0.22); lirio(ctx, 0, 0, '#f6b3cf', '#e0457f'); ctx.restore();
    }
  } else if (inv) {
    // el abrigo azul, largo, con la tira del medio y botones blancos
    ctx.fillStyle = azulAbrigo;
    ctx.beginPath(); ctx.moveTo(-6.4, -8); ctx.lineTo(6.4, -8); ctx.lineTo(8.8, 9); ctx.lineTo(-8.8, 9); ctx.closePath(); ctx.fill();
    for (const side of [-1, 1]) ctx.fillRect(side > 0 ? 4.6 : -8.2, -8, 3.6, 4.4);
    ctx.save(); ctx.globalAlpha *= 0.4; ctx.fillStyle = azulAbrigoOsc;
    ctx.beginPath(); ctx.moveTo(3.6, -7); ctx.lineTo(6.2, -7); ctx.lineTo(8.6, 8.8); ctx.lineTo(5.4, 8.8); ctx.closePath(); ctx.fill(); ctx.restore();
    if (!back) {
      ctx.fillStyle = azulAbrigoOsc; ctx.fillRect(-0.5, -6.5, 1, 15.4);
      for (const by of [-3.6, 0.4, 4.4]) { ctx.fillStyle = blanco; dot(ctx, -1.9, by, 1.1); }
    }
  } else {
    // el vestido (azul; con la ropa nueva, morado), con la tira más oscura abajo
    ctx.fillStyle = vestido;
    ctx.beginPath(); ctx.moveTo(-6, -7); ctx.lineTo(6, -7); ctx.lineTo(11, 7); ctx.lineTo(-11, 7); ctx.closePath(); ctx.fill();
    ctx.fillStyle = vestidoOsc;
    ctx.beginPath(); ctx.moveTo(-9.9, 4); ctx.lineTo(9.9, 4); ctx.lineTo(11, 7); ctx.lineTo(-11, 7); ctx.closePath(); ctx.fill();
  }
  // en pijama, el peluchito de perrito blanco con las orejas caídas negras y manchas negras
  if (pj && !back) {
    peluche(ctx, -0.6, -3.4, '#fbf8f4', '#2a2226', 'caidas');
    ctx.fillStyle = '#2a2226'; dot(ctx, 0.6, 0.2, 0.7); dot(ctx, -1.6, 1.6, 0.5); dot(ctx, 0.9, 2.6, 0.45); dot(ctx, -1.5, -4.6, 0.45);
  }
  // brazos (se mueven desde el hombro; sin pose, se balancean un poco al andar)
  for (const side of [-1, 1]) {
    if (abraza && side < 0) {
      // el brazo que abraza el peluchito
      ctx.strokeStyle = beige; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-5.5, -4); ctx.quadraticCurveTo(-6.5, 1.5, 1.2, 0.8); ctx.stroke();
      ctx.fillStyle = beige; dot(ctx, 1.4, 0.8, 1.5);
      continue;
    }
    const balanceo = opts.pose ? 0 : Math.sin(walk + (side > 0 ? Math.PI : 0)) * 0.25;
    girado(ctx, brazoPose(opts, side) + balanceo, side * 5.5, -4, () => {
      // con el abrigo, la manga azul con el puño blanco
      if (inv) {
        ctx.strokeStyle = azulAbrigo; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(side * 5.5, -4); ctx.quadraticCurveTo(side * 9, 0, side * 8, 3.4); ctx.stroke();
        ctx.fillStyle = blanco; dot(ctx, side * 8, 3.4, 1.6);
      }
      ctx.strokeStyle = beige; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
      if (inv) { ctx.fillStyle = beige; dot(ctx, side * 8, 4.6, 1.6); return; }
      ctx.beginPath(); ctx.moveTo(side * 5.5, -4); ctx.quadraticCurveTo(side * 9, 0, side * 8, 4); ctx.stroke();
      ctx.fillStyle = beige; dot(ctx, side * 8, 4.3, 1.7);
    });
  }
  if (inv) {
    // la bufanda azul clarito con rayas blancas, y la punta que cuelga
    ctx.fillStyle = azulClaro; rrect(ctx, -6.4, -9.6, 12.8, 3.4, 1.6); ctx.fill();
    ctx.fillStyle = blanco; for (const x of [-4.6, -1.4, 1.8, 5]) ctx.fillRect(x, -9.6, 1.1, 3.4);
    if (!back) {
      ctx.fillStyle = azulClaro; rrect(ctx, 2.2, -7.4, 2.8, 7, 1.1); ctx.fill();
      ctx.fillStyle = blanco; ctx.fillRect(2.2, -4.8, 2.8, 1); ctx.fillRect(2.2, -2.4, 2.8, 1);
    }
  } else if (!pj) {
    // collar rosa con la chapita de corazón amarillo (en pijama no lo lleva)
    ctx.fillStyle = B ? '#7a0b12' : '#e8578f'; ctx.fillRect(-5.5, -8, 11, 2);
    if (!back && !B) { ctx.fillStyle = '#ffd23f'; corazon(ctx, 0, -5.2, 1.4); }
  }
  // cabeza y orejas hacia abajo
  const hx = 0, hy = -15, mx = hx + lado * 2.5;
  ctx.fillStyle = beige; ctx.beginPath(); ctx.ellipse(hx, hy, 9, 8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = beigeOsc;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(hx + s * 9, hy + 1, 3.2, 7, s * -0.25, 0, Math.PI * 2); ctx.fill(); }
  // el lirio de la oreja izquierda, con el polen amarillo: rosa; con la ropa nueva, blanco (Elora). Va antes de la
  // cara, para que nunca le tape un ojo (Elora)
  if (!inv && !pj && !B) lirio(ctx, hx - 9.4, hy - 6.2, rp ? '#fffdf7' : '#f48fb8', rp ? '#e4efc0' : '#e0457f', rp ? '#cfc4b0' : null);
  if (!back) {
    // hocico, nariz, boca sonriente con la lengüita, ojos y mofletes
    ctx.fillStyle = claro; ctx.beginPath(); ctx.ellipse(mx, hy + 3.5, 4.6, 3.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = marron; ctx.beginPath(); ctx.ellipse(mx, hy + 1.8, 1.7, 1.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; dot(ctx, mx - 0.5, hy + 1.4, 0.4);
    ctx.strokeStyle = marron; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(mx, hy + 3); ctx.lineTo(mx, hy + 4); ctx.stroke();
    ctx.beginPath(); ctx.arc(mx - 1.3, hy + 4, 1.3, 0, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(mx + 1.3, hy + 4, 1.3, 0, Math.PI); ctx.stroke();
    ctx.fillStyle = B ? '#7a0b12' : '#f07a9a'; ctx.beginPath(); ctx.ellipse(mx + 0.6, hy + 5.6, 1, 1.2, 0, 0, Math.PI * 2); ctx.fill();
    // de lado se le siguen viendo los dos ojos, un poco girados hacia donde mira (Elora: solo se quitaría uno si
    // la oreja lo tapara del todo, y su oreja no lo tapa)
    const ojos = [hx - 3.6 + lado * 1.6, hx + 3.6 + lado * 1.6];
    for (const ex of ojos) { ctx.fillStyle = B ? '#ff3b3b' : marron; dot(ctx, ex, hy - 2.2, 1.7); ctx.fillStyle = '#fff'; dot(ctx, ex - 0.5, hy - 2.8, 0.6); }
    if (!B) {
      ctx.fillStyle = 'rgba(240,120,150,.45)';
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(mx + s * 6, hy + 2, 1.6, 1, 0, 0, Math.PI * 2); ctx.fill(); }
    }
  }
  if (B) bloodyMarks(ctx, hx, hy, facing);
  if (inv) {
    // el gorro azul de lana con el borde y el pompón blancos (en lugar del lirio)
    ctx.fillStyle = azulAbrigo;
    ctx.beginPath(); ctx.ellipse(hx, hy - 4.6, 8.4, 5.6, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fill();
    ctx.fillStyle = azulAbrigoOsc; for (const x of [-4.5, -1.5, 1.5, 4.5]) ctx.fillRect(hx + x - 0.4, hy - 9.4, 0.8, 4.4);
    ctx.fillStyle = blanco; rrect(ctx, hx - 9, hy - 6, 18, 2.8, 1.4); ctx.fill();
    dot(ctx, hx, hy - 10.6, 2.2);
  }
}
// Un lirio de seis pétalos en punta (el de la perrita), con los estambres y el polen amarillo
function lirio(ctx, fx, fy, color, dentro, borde) {
  ctx.save(); ctx.translate(fx, fy); ctx.scale(1.4, 1.4);
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate(i * Math.PI / 3 - Math.PI / 2);
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(1.6, 1.8, 4.4, 0); ctx.quadraticCurveTo(1.6, -1.8, 0, 0); ctx.fill();
    if (borde) { ctx.strokeStyle = borde; ctx.lineWidth = 0.25; ctx.stroke(); }   // el blanco, con un borde para que se vea
    ctx.fillStyle = dentro;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(1, 0.7, 2.4, 0); ctx.quadraticCurveTo(1, -0.7, 0, 0); ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = '#7fb06a'; ctx.lineWidth = 0.25;
  for (let i = 0; i < 6; i++) {
    const a = i * Math.PI / 3, ex = Math.cos(a) * 2, ey = Math.sin(a) * 2;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(ex, ey); ctx.stroke();
    ctx.fillStyle = '#ffc21a'; ctx.beginPath(); ctx.ellipse(ex, ey, 0.55, 0.3, a, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

const OWN_DRAW = { perrita: drawPerrita, carot: drawCarot, frog: drawFroggy, octopus: drawOct, cat: drawCaty, lizard: drawGec, jellyfish: drawJely, tardigrade: drawTarda, hare: drawHoppy, crocodile: drawDraila, reindeer: drawReno, dragon: drawDrake, drakeSangriento: drawDrakeSangriento };
