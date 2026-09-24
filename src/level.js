// Niveles: todos son mapas dibujados por Elora (src/maps.js), que se van repitiendo.
// La forma es siempre la suya; el botón, la salida y los objetos cambian en cada partida.

import { TILE, LEVEL, MAP_RANDOM, BONUS_EVERY } from './config.js';
import { MAPS, BONUS } from './maps.js';

export const T = {
  FLOOR: 0,
  WALL: 1,
  OBSTACLE: 2,       // trasto: el jugador lo salta, los Sangrientos no pueden pasar
  DOOR_START: 3,     // puerta por la que entras (se cierra detrás de ti)
  EXIT_CLOSED: 4,    // puerta de salida cerrada
  EXIT_OPEN: 5,      // puerta de salida abierta
  BUTTON: 6,         // el botón que abre la salida
  BUTTON_PRESSED: 7,
  BLOCK: 8,          // trasto rojo: no se puede saltar, bloquea a todos
};

// Números "aleatorios" repetibles a partir de una semilla.
export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(rand, arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Cada partida usa una semilla distinta, así el botón, la puerta y los objetos
// cambian de sitio y el nivel no se puede aprender de memoria.
export function generateLevel(n, seed) {
  const s = seed == null ? Math.floor(Math.random() * 1e9) : seed;
  // Cada BONUS_EVERY pasillos toca el Bonus: sin Bloodies, sin botón y con premios.
  if (n > 0 && n % BONUS_EVERY === 0) return loadMap(n, BONUS, s);
  return loadMap(n, mapForLevel(n), s);
}

// Los mapas de Elora por turnos (El Colegio, El Centro Comercial, El Colegio...),
// saltándose los pasillos de Bonus. Un mapa nuevo en MAPS entra solo en la rueda.
export function mapForLevel(n) {
  const orden = Object.keys(MAPS).map(Number).sort((a, b) => a - b);
  const normales = n - Math.floor(n / BONUS_EVERY);   // pasillos normales hasta este, incluido
  return MAPS[orden[(normales - 1) % orden.length]];
}

// Casillas por las que el jugador puede pasar andando o saltando.
function walkable(t) { return t === T.FLOOR || t === T.OBSTACLE; }

// ¿A qué casillas se llega desde el punto de partida? Devuelve un array de 0/1.
function reachableFrom(tiles, W, H, sx, sy) {
  const seen = new Uint8Array(W * H);
  if (!walkable(tiles[sy * W + sx])) return seen;
  const q = [[sx, sy]];
  seen[sy * W + sx] = 1;
  while (q.length) {
    const [x, y] = q.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const i = ny * W + nx;
      if (seen[i] || !walkable(tiles[i])) continue;
      seen[i] = 1;
      q.push([nx, ny]);
    }
  }
  return seen;
}

// ¿Está esta casilla pegada a alguna por la que se pueda andar?
function touchesWalkable(tiles, W, H, tx, ty) {
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = tx + dx, ny = ty + dy;
    if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    if (walkable(tiles[ny * W + nx])) return true;
  }
  return false;
}

// Lee un mapa dibujado a mano (ver src/maps.js).
// Las paredes, los trastos, la entrada y los Bloodies son los que dibujó Elora.
// El botón, la puerta de salida y los objetos se colocan al azar en cada partida.
export function loadMap(n, map, seed = 0) {
  const rows = map.rows;
  const H = rows.length, W = Math.max(...rows.map((r) => r.length));
  const tiles = new Uint8Array(W * H).fill(T.WALL);
  const enemies = [], exitSpots = [], markers = {}, fixed = [];
  const counts = { tape: 0, food: 0, heart: 0, coin: 0, stamina: 0 };
  let spawn = null, startDoor = null;
  const center = (tx, ty) => ({ x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE });
  const legend = { '.': T.FLOOR, '#': T.WALL, 'R': T.BLOCK, 'O': T.OBSTACLE, 'E': T.DOOR_START };
  const itemLetters = { t: 'tape', f: 'food', h: 'heart', c: 'coin', e: 'stamina' };

  for (let ty = 0; ty < H; ty++) for (let tx = 0; tx < W; tx++) {
    const ch = rows[ty][tx] || '#';
    if (ch in legend) {
      tiles[ty * W + tx] = legend[ch];
      if (ch === 'E' && !startDoor) startDoor = { tx, ty };
      continue;
    }
    if (ch === 'X') { exitSpots.push({ tx, ty }); tiles[ty * W + tx] = T.WALL; continue; }
    if (ch === 'B') { tiles[ty * W + tx] = T.FLOOR; continue; } // solo marca una idea; el botón va al azar
    tiles[ty * W + tx] = T.FLOOR;
    if (ch === 'P') spawn = center(tx, ty);
    else if (ch === 's') enemies.push(center(tx, ty));
    else if (ch in itemLetters) {
      counts[itemLetters[ch]]++;
      if (map.fixedItems) fixed.push({ type: itemLetters[ch], ...center(tx, ty), taken: false });
    }
    else if (ch !== ' ') { (markers[ch] = markers[ch] || []).push({ tx, ty, ...center(tx, ty) }); }
  }
  if (!spawn) throw new Error('Mapa ' + n + ': falta P');

  const rand = rng(seed * 2654435761 + 12345);
  const stx = Math.floor(spawn.x / TILE), sty = Math.floor(spawn.y / TILE);
  const reach = reachableFrom(tiles, W, H, stx, sty);
  const far = (tx, ty, tiles2) => Math.hypot(tx - stx, ty - sty);

  // Casillas de suelo a las que se llega desde la entrada: ahí van el botón y los objetos.
  const free = [];
  for (let ty = 0; ty < H; ty++) for (let tx = 0; tx < W; tx++) {
    if (tiles[ty * W + tx] !== T.FLOOR || !reach[ty * W + tx]) continue;
    if (tx === stx && ty === sty) continue;
    free.push({ tx, ty });
  }

  let button = null, exit = null, exits = [], items = [];
  if (map.noButton) {
    // Bonus: todas las puertas están abiertas desde el principio y no hay botón.
    exits = exitSpots.filter((e) => touchesWalkable(tiles, W, H, e.tx, e.ty));
    for (const e of exits) setTileRaw(tiles, W, H, e.tx, e.ty, T.EXIT_OPEN);
    exit = exits[0] || null;
    items = fixed;
  } else if (map.lobby) {
    items = fixed;   // las monedas de práctica del lobby, donde están dibujadas
  } else {
    // --- puerta de salida: una de las candidatas, lejos de la entrada
    const usable = exitSpots.filter((e) => {
      // tiene que dar a una casilla a la que se pueda llegar
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = e.tx + dx, ny = e.ty + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (walkable(tiles[ny * W + nx]) && reach[ny * W + nx]) return true;
      }
      return false;
    });
    if (!usable.length) throw new Error('Mapa ' + n + ': ninguna salida X es alcanzable');
    const farExits = usable.filter((e) => far(e.tx, e.ty) >= MAP_RANDOM.exitMinTiles);
    const exitPool = farExits.length ? farExits : usable;
    exit = exitPool[Math.floor(rand() * exitPool.length)];
    exits = [exit];
    setTileRaw(tiles, W, H, exit.tx, exit.ty, T.EXIT_CLOSED);

    // --- botón: lejos de la entrada y de la salida
    const buttonPool = free.filter((c) => far(c.tx, c.ty) >= MAP_RANDOM.buttonMinTiles
      && Math.hypot(c.tx - exit.tx, c.ty - exit.ty) >= MAP_RANDOM.buttonExitMinTiles);
    const pool = buttonPool.length ? buttonPool : free;
    button = pool[Math.floor(rand() * pool.length)];
    setTileRaw(tiles, W, H, button.tx, button.ty, T.BUTTON);

    // --- objetos
    if (map.fixedItems) {
      items = fixed;
    } else {
      // tantos como dibujó Elora, pero repartidos al azar
      const spots = free.filter((c) => !(c.tx === button.tx && c.ty === button.ty));
      shuffle(rand, spots);
      let k = 0;
      for (const [type, howMany] of Object.entries(counts)) {
        for (let i = 0; i < howMany && k < spots.length; i++, k++) {
          items.push({ type, x: (spots[k].tx + 0.5) * TILE, y: (spots[k].ty + 0.5) * TILE, taken: false });
        }
      }
    }
  }

  // decoración: sangre dibujada por el suelo (el lobby y el Bonus no tienen)
  const decals = [];
  const dRand = rng(seed * 97 + 7);
  const floor = free.slice();
  shuffle(dRand, floor);
  const nBlood = map.lobby || map.noButton ? 0 : LEVEL.bloodDecals;
  for (let i = 0; i < nBlood && i < floor.length; i++) {
    decals.push({ kind: 'blood', x: (floor[i].tx + 0.5) * TILE, y: (floor[i].ty + 0.5) * TILE, r: 6 + dRand() * 9, seed: dRand() });
  }

  return { n, w: W, h: H, tiles, spawn, startDoor, exit, exits, button, items, enemies, decals, markers,
    free, coinRush: map.coinRush || null,
    name: map.name, theme: map.theme, lobby: !!map.lobby, noButton: !!map.noButton, seed };
}

function setTileRaw(tiles, W, H, tx, ty, v) {
  if (tx < 0 || ty < 0 || tx >= W || ty >= H) return;
  tiles[ty * W + tx] = v;
}

export function tileAt(level, tx, ty) {
  if (tx < 0 || ty < 0 || tx >= level.w || ty >= level.h) return T.WALL;
  return level.tiles[ty * level.w + tx];
}

export function setTile(level, tx, ty, v) {
  if (tx < 0 || ty < 0 || tx >= level.w || ty >= level.h) return;
  level.tiles[ty * level.w + tx] = v;
}

// ¿Esta casilla bloquea el paso?  who: 'player' | 'flyer' (Drake volando) | 'enemy'
export function solidFor(t, who, jumping = false) {
  switch (t) {
    case T.FLOOR: return false;
    case T.OBSTACLE: return who === 'flyer' ? false : who === 'player' ? !jumping : true;
    case T.BLOCK: return who !== 'flyer';
    case T.EXIT_OPEN: return who === 'enemy';
    default: return true;
  }
}

// ¿Esta casilla tapa la vista? Paredes, puertas y trastos rojos (altos) sí; los trastos naranjas (bajos) no.
export function blocksSight(t) {
  return t !== T.FLOOR && t !== T.OBSTACLE;
}
