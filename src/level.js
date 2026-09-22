// Generador de niveles: una "habitación" grande hecha de pasillos.
// Cada nivel se genera a partir de su número, así el nivel 1 es siempre igual.

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

function pick(rand, arr) { return arr[Math.floor(rand() * arr.length)]; }
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
  if (MAPS[n]) return loadMap(n, MAPS[n], s);
  return generateRandomLevel(n, s);
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
  } else if (!map.lobby) {
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

  // decoración
  const decals = [];
  const dRand = rng(seed * 97 + 7);
  const floor = free.slice();
  shuffle(dRand, floor);
  const tranquilo = map.lobby || map.noButton; // el lobby y el Bonus no tienen sangre
  const nBlood = tranquilo ? 0 : LEVEL.bloodDecals, nDebris = tranquilo ? 4 : LEVEL.debrisDecals;
  for (let i = 0; i < nBlood && i < floor.length; i++) {
    decals.push({ kind: 'blood', x: (floor[i].tx + 0.5) * TILE, y: (floor[i].ty + 0.5) * TILE, r: 6 + dRand() * 9, seed: dRand() });
  }
  for (let i = nBlood; i < nBlood + nDebris && i < floor.length; i++) {
    decals.push({ kind: 'debris', x: (floor[i].tx + 0.5) * TILE, y: (floor[i].ty + 0.5) * TILE, r: 4 + dRand() * 5, seed: dRand() });
  }

  return { n, w: W, h: H, tiles, spawn, startDoor, exit, exits, button, items, enemies, decals, markers,
    free, coinRush: map.coinRush || null,
    name: map.name, theme: map.theme, lobby: !!map.lobby, noButton: !!map.noButton, seed };
}

function setTileRaw(tiles, W, H, tx, ty, v) {
  if (tx < 0 || ty < 0 || tx >= W || ty >= H) return;
  tiles[ty * W + tx] = v;
}

export function generateRandomLevel(n, seed = 0) {
  // El laberinto depende solo del número de pasillo (así el pasillo 3 siempre tiene la misma forma),
  // pero el botón, la salida y los objetos se colocan con el azar de esta partida.
  const rand = rng(1000 + n * 7919);
  const luck = rng(seed * 2654435761 + 999);
  const CW = LEVEL.cellsW, CH = LEVEL.cellsH, C = LEVEL.corridor, S = C + 1;
  const W = CW * S + 1, H = CH * S + 1;
  const tiles = new Uint8Array(W * H).fill(T.WALL);

  const grid = (v) => Array.from({ length: CH }, () => new Array(CW).fill(v));
  const east = grid(false), south = grid(false), visited = grid(false);

  // 1. Laberinto base (recorrido con pila).
  const stack = [[0, 0]];
  visited[0][0] = true;
  while (stack.length) {
    const [cx, cy] = stack[stack.length - 1];
    const nb = [];
    if (cx > 0 && !visited[cy][cx - 1]) nb.push([cx - 1, cy, 'W']);
    if (cx < CW - 1 && !visited[cy][cx + 1]) nb.push([cx + 1, cy, 'E']);
    if (cy > 0 && !visited[cy - 1][cx]) nb.push([cx, cy - 1, 'N']);
    if (cy < CH - 1 && !visited[cy + 1][cx]) nb.push([cx, cy + 1, 'S']);
    if (!nb.length) { stack.pop(); continue; }
    const [nx, ny, d] = pick(rand, nb);
    if (d === 'E') east[cy][cx] = true;
    if (d === 'W') east[cy][cx - 1] = true;
    if (d === 'S') south[cy][cx] = true;
    if (d === 'N') south[cy - 1][cx] = true;
    visited[ny][nx] = true;
    stack.push([nx, ny]);
  }

  // 2. Pasillos extra para que haya varios caminos.
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    if (x < CW - 1 && !east[y][x] && rand() < LEVEL.loops) east[y][x] = true;
    if (y < CH - 1 && !south[y][x] && rand() < LEVEL.loops) south[y][x] = true;
  }

  // 3. Zonas abiertas (bloques 2x2 sin paredes).
  const roomCorners = [];
  for (let i = 0; i < LEVEL.rooms; i++) {
    const rx = 1 + Math.floor(rand() * (CW - 2)), ry = Math.floor(rand() * (CH - 1));
    east[ry][rx] = true; south[ry][rx] = true; east[ry + 1][rx] = true; south[ry][rx + 1] = true;
    roomCorners.push([rx, ry]);
  }

  // 4. Pasar de celdas a casillas.
  const origin = (cx, cy) => [cx * S + 1, cy * S + 1];
  const set = (tx, ty, v) => { tiles[ty * W + tx] = v; };
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    const [ox, oy] = origin(x, y);
    for (let j = 0; j < C; j++) for (let i = 0; i < C; i++) set(ox + i, oy + j, T.FLOOR);
    if (east[y][x]) for (let j = 0; j < C; j++) set(ox + C, oy + j, T.FLOOR);
    if (south[y][x]) for (let i = 0; i < C; i++) set(ox + i, oy + C, T.FLOOR);
  }
  for (const [rx, ry] of roomCorners) { const [ox, oy] = origin(rx, ry); set(ox + C, oy + C, T.FLOOR); }

  // 5. Distancias desde la celda de entrada (para colocar cosas lejos).
  const startCy = Math.floor(rand() * CH);
  const dist = grid(-1);
  const q = [[0, startCy]]; dist[startCy][0] = 0;
  const degree = grid(0);
  while (q.length) {
    const [cx, cy] = q.shift();
    const d = dist[cy][cx];
    const nbs = [];
    if (cx < CW - 1 && east[cy][cx]) nbs.push([cx + 1, cy]);
    if (cx > 0 && east[cy][cx - 1]) nbs.push([cx - 1, cy]);
    if (cy < CH - 1 && south[cy][cx]) nbs.push([cx, cy + 1]);
    if (cy > 0 && south[cy - 1][cx]) nbs.push([cx, cy - 1]);
    degree[cy][cx] = nbs.length;
    for (const [nx, ny] of nbs) if (dist[ny][nx] < 0) { dist[ny][nx] = d + 1; q.push([nx, ny]); }
  }
  let maxDist = 0;
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) maxDist = Math.max(maxDist, dist[y][x]);

  // Puerta de entrada y aparición del jugador.
  const [sx, sy] = origin(0, startCy);
  const startDoor = { tx: 0, ty: sy + 1 };
  set(startDoor.tx, startDoor.ty, T.DOOR_START);
  const spawn = { x: (sx + 0.5) * TILE, y: (sy + 1 + 0.5) * TILE };

  // 6. Puerta de salida: en un borde, lo más lejos posible.
  const border = [];
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    if (x === 0 && y === startCy) continue;
    if (x === 0 || x === CW - 1 || y === 0 || y === CH - 1) border.push([x, y, dist[y][x]]);
  }
  border.sort((a, b) => b[2] - a[2]);
  // entre las celdas del borde más lejanas: cuantas más, más cambia la salida de una partida a otra
  const [ex, ey] = pick(luck, border.slice(0, Math.max(3, Math.ceil(border.length * 0.35))));
  const [eox, eoy] = origin(ex, ey);
  let exit;
  if (ex === CW - 1) exit = { tx: W - 1, ty: eoy + 1 };
  else if (ey === CH - 1) exit = { tx: eox + 1, ty: H - 1 };
  else if (ey === 0) exit = { tx: eox + 1, ty: 0 };
  else exit = { tx: 0, ty: eoy + 1 };
  set(exit.tx, exit.ty, T.EXIT_CLOSED);

  // 7. Botón: lejos de la entrada y de la salida, mejor en un callejón sin salida.
  let candidates = [];
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    if ((x === 0 && y === startCy) || (x === ex && y === ey)) continue;
    if (dist[y][x] >= Math.max(2, Math.floor(maxDist * 0.5))) candidates.push([x, y]);
  }
  const farEnough = candidates.filter(([x, y]) => { const [ox, oy] = origin(x, y); return Math.hypot((ox + 1.5) * TILE - spawn.x, (oy + 1.5) * TILE - spawn.y) >= 8 * TILE; });
  if (farEnough.length) candidates = farEnough;
  // se prefieren los callejones sin salida, pero solo si hay unos cuantos donde elegir
  const deadEnds = candidates.filter(([x, y]) => degree[y][x] === 1);
  if (deadEnds.length >= 3) candidates = deadEnds;
  const [bx, by] = pick(luck, candidates);
  const [box, boy] = origin(bx, by);
  const button = { tx: box + 1, ty: boy + 1 };
  set(button.tx, button.ty, T.BUTTON);

  // 8. Trastos que bloquean pasillos (el jugador salta, los Sangrientos no).
  const passages = [];
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    if (dist[y][x] < 2) continue;
    const [ox, oy] = origin(x, y);
    if (east[y][x] && x < CW - 1 && dist[y][x + 1] >= 2 && !isRoomCell(x, y) && !isRoomCell(x + 1, y))
      passages.push(Array.from({ length: C }, (_, j) => [ox + C, oy + j]));
    if (south[y][x] && y < CH - 1 && dist[y + 1][x] >= 2 && !isRoomCell(x, y) && !isRoomCell(x, y + 1))
      passages.push(Array.from({ length: C }, (_, i) => [ox + i, oy + C]));
  }
  function isRoomCell(x, y) {
    return roomCorners.some(([rx, ry]) => x >= rx && x <= rx + 1 && y >= ry && y <= ry + 1);
  }
  shuffle(rand, passages);
  for (const p of passages.slice(0, LEVEL.obstacles)) for (const [tx, ty] of p) set(tx, ty, T.OBSTACLE);

  // 9. Objetos: cintas y comida en casillas de suelo (no en la celda de entrada).
  const floorTiles = [];
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    if (dist[y][x] < 1) continue;
    const [ox, oy] = origin(x, y);
    for (let j = 0; j < C; j++) for (let i = 0; i < C; i++)
      if (tiles[(oy + j) * W + ox + i] === T.FLOOR) floorTiles.push([ox + i, oy + j]);
  }
  shuffle(luck, floorTiles);
  const items = [];
  let k = 0;
  for (let i = 0; i < LEVEL.tapes; i++, k++) items.push(mkItem('tape', floorTiles[k]));
  for (let i = 0; i < LEVEL.food; i++, k++) items.push(mkItem('food', floorTiles[k]));
  for (let i = 0; i < LEVEL.hearts; i++, k++) items.push(mkItem('heart', floorTiles[k]));
  for (let i = 0; i < LEVEL.coins; i++, k++) items.push(mkItem('coin', floorTiles[k]));
  for (let i = 0; i < LEVEL.stamina; i++, k++) items.push(mkItem('stamina', floorTiles[k]));
  function mkItem(type, [tx, ty]) { return { type, x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE, taken: false }; }

  // 10. Sangrientos: en celdas lejos de la entrada.
  const enemyCount = Math.min(LEVEL.enemiesMax, Math.floor(LEVEL.enemiesBase + (n - 1) * LEVEL.enemiesPerLevel));
  // Lejos de verdad: no solo por pasillos, también en línea recta (que no aparezcan al lado a través de una pared).
  const farCells = [];
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    if (dist[y][x] < 3 || (x === bx && y === by)) continue;
    const [ox, oy] = origin(x, y);
    const dx = (ox + 1.5) * TILE - spawn.x, dy = (oy + 1.5) * TILE - spawn.y;
    if (Math.hypot(dx, dy) >= 9 * TILE) farCells.push([x, y]);
  }
  shuffle(luck, farCells);
  const enemies = farCells.slice(0, enemyCount).map(([x, y]) => {
    const [ox, oy] = origin(x, y);
    return { x: (ox + 1.5) * TILE, y: (oy + 1.5) * TILE };
  });

  // 11. Decoración: sangre dibujada y cosas rotas.
  const decals = [];
  for (let i = 0; i < LEVEL.bloodDecals && k < floorTiles.length; i++, k++) {
    const [tx, ty] = floorTiles[k];
    decals.push({ kind: 'blood', x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE, r: 6 + rand() * 9, seed: rand() });
  }
  for (let i = 0; i < LEVEL.debrisDecals && k < floorTiles.length; i++, k++) {
    const [tx, ty] = floorTiles[k];
    decals.push({ kind: 'debris', x: (tx + 0.5) * TILE, y: (ty + 0.5) * TILE, r: 4 + rand() * 5, seed: rand() });
  }

  return { n, w: W, h: H, tiles, spawn, startDoor, exit, exits: [exit], button, items, enemies, decals, markers: {},
    free: floorTiles.map(([tx, ty]) => ({ tx, ty })), coinRush: null, name: null, theme: null, noButton: false, seed };
}

export function tileAt(level, tx, ty) {
  if (tx < 0 || ty < 0 || tx >= level.w || ty >= level.h) return T.WALL;
  return level.tiles[ty * level.w + tx];
}

export function setTile(level, tx, ty, v) {
  if (tx < 0 || ty < 0 || tx >= level.w || ty >= level.h) return;
  level.tiles[ty * level.w + tx] = v;
}

// ¿Esta casilla bloquea el paso?  who: 'player' | 'enemy'
export function solidFor(t, who, jumping = false) {
  switch (t) {
    case T.FLOOR: return false;
    case T.OBSTACLE: return who === 'player' ? !jumping : true;
    case T.BLOCK: return true;
    case T.EXIT_OPEN: return who !== 'player';
    default: return true;
  }
}

// ¿Esta casilla tapa la vista? Paredes, puertas y trastos rojos (altos) sí; los trastos naranjas (bajos) no.
export function blocksSight(t) {
  return t !== T.FLOOR && t !== T.OBSTACLE;
}
