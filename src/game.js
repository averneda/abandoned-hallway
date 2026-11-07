// El nivel en marcha: jugador, Bloodies, objetos, botón, puertas y dibujo.

import { TILE, VIEW_W, VIEW_H, PLAYER, ANXIETY, STRESS, STAMINA, ENEMY, ABILITIES, LIGHT_RADIUS_TILES, DOOR_CLOSE_DELAY, statMul, maxHearts, DRAKE } from './config.js';
import { T, generateLevel, tileAt, setTile, solidFor, blocksSight, rng } from './level.js';
import { CHARACTERS, drawCharacter, PINTURAS_FOSFORITO, DRAKE_SANGRIENTO, characterById, TARDA_GRIS } from './characters.js';
// de quién puede ir disfrazado un Bloodie: de todos menos del personaje secreto de Navidad (el reno),
// para no descubrir la sorpresa
const BLOODY_LOOKS = CHARACTERS.filter((c) => !c.navidad);
import { t, getLang } from './i18n.js';
import { sfx } from './sound.js';
import { music } from './music.js';
import { poseAndando } from './andares.js';
import { drawCoinFast, glowSprite, pickCoinKind, coinValue } from './coins.js';

const ESTAMINA = '#2fe0a6';   // verde-turquesa de la estamina (barra y bolitas)
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const FACING_VEC = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export function dist(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

// La mancha de luz que "agujerea" la oscuridad: fuerte en el centro y difuminada en el borde.
let luz = null;
function lightSprite() {
  if (luz) return luz;
  const S = 128, c = document.createElement('canvas');
  c.width = c.height = S;
  const g2 = c.getContext('2d'), g = g2.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, 'rgba(0,0,0,1)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.85)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  g2.fillStyle = g; g2.fillRect(0, 0, S, S);
  luz = c;
  return luz;
}

// ¿Un cuadrado de radio r en (x,y) choca con alguna casilla sólida?
export function collides(level, x, y, r, who, jumping) {
  const x0 = Math.floor((x - r) / TILE), x1 = Math.floor((x + r) / TILE);
  const y0 = Math.floor((y - r) / TILE), y1 = Math.floor((y + r) / TILE);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
    if (solidFor(tileAt(level, tx, ty), who, jumping)) return true;
  }
  return false;
}

// Mueve una entidad eje por eje, parándola contra las paredes. Devuelve true si chocó.
export function move(level, e, dx, dy, who, jumping = false) {
  let hit = false;
  const r = e.r;
  if (dx !== 0) {
    const nx = e.x + dx;
    if (!collides(level, nx, e.y, r, who, jumping)) e.x = nx;
    else {
      hit = true;
      e.x = dx > 0 ? Math.floor((nx + r) / TILE) * TILE - r - 0.01 : Math.ceil((nx - r) / TILE) * TILE + r + 0.01;
    }
  }
  if (dy !== 0) {
    const ny = e.y + dy;
    if (!collides(level, e.x, ny, r, who, jumping)) e.y = ny;
    else {
      hit = true;
      e.y = dy > 0 ? Math.floor((ny + r) / TILE) * TILE - r - 0.01 : Math.ceil((ny - r) / TILE) * TILE + r + 0.01;
    }
  }
  return hit;
}

// ¿Hay línea de visión entre dos puntos? Paredes, puertas y trastos rojos (altos) la cortan.
function canSee(level, ax, ay, bx, by) {
  const d = dist(ax, ay, bx, by);
  const steps = Math.ceil(d / 8);
  for (let i = 1; i < steps; i++) {
    const x = ax + (bx - ax) * i / steps, y = ay + (by - ay) * i / steps;
    if (blocksSight(tileAt(level, Math.floor(x / TILE), Math.floor(y / TILE)))) return false;
  }
  return true;
}

export function facingOf(dx, dy, prev) {
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'right' : 'left';
  if (dy !== 0) return dy > 0 ? 'down' : 'up';
  return prev;
}

export class Game {
  // levelOrNumber: número de pasillo, o un nivel ya cargado (lo usa el lobby).
  // callbacks: { onDeath(reason), onComplete({tapes, coins}), onPause(), onCoin(n), totalCoins() }
  constructor(character, levelOrNumber, callbacks) {
    this.ch = character;
    this.cb = callbacks;
    this.level = typeof levelOrNumber === 'number' ? generateLevel(levelOrNumber) : levelOrNumber;
    this.n = typeof levelOrNumber === 'number' ? levelOrNumber : 0;
    this.time = 0;
    this.paused = false;
    this.finished = false;
    this.rand = rng(this.n * 31 + 7);

    const L = this.level;
    this.jumpTime = character.ability === 'carot' ? ABILITIES.carot.jumpTime : PLAYER.jumpTime;
    this.player = {
      x: L.spawn.x, y: L.spawn.y, r: PLAYER.radius, facing: 'up', walk: 0,
      hearts: maxHearts(character), anxiety: ANXIETY.start, invuln: 0, jump: 0, jumping: false,
      kx: 0, ky: 0, moving: false, cooldown: 0,
      tongue: null,  // lengua de Gec: {dir, len, max, phase, target}
      capa: 0,       // segundos que le queda la capa Tun de Tarda (inmortal, pero más lento)
      fly: 0,        // segundos que le quedan a Drake volando (pasa por encima de trastos y nadie le coge)
      supercarrera: 0, // segundos que le quedan a Hoppy corriendo a toda velocidad (sin cansarse)
      stamina: STAMINA.start,  // se gasta corriendo y se recupera parando
      agotado: false,          // se quedó a cero: hay que recuperar un poco antes de volver a correr
      sinCorrer: 0,            // segundos desde la última vez que corrió
    };
    // corazones con los que llegas de otro pasillo (si no, todos)
    if (callbacks && callbacks.startHearts != null) this.player.hearts = Math.max(1, Math.min(maxHearts(character), callbacks.startHearts));
    this.wave = null;  // onda del mordisco de Draila: {x, y, dir, len, max, golpeados}
    this.freeze = 0; // segundos que quedan de Bloodies parados (habilidad de Oct)
    this.flood = 0;  // segundos que quedan de sala inundada (habilidad de Jely)

    this.enemies = L.enemies.map((e, i) => ({
      x: e.x, y: e.y, r: ENEMY.radius, dir: DIRS[Math.floor(this.rand() * 4)], turn: 1 + this.rand() * 2,
      chasing: false, lostFor: 0, stuck: 0, recoil: 0, phase: this.rand() * 10, facing: 'down', walk: 0,
      pintado: 0,  // segundos que le queda la pintura fosforita de Caty
      lastSeen: null, trail: [], trailDist: 0,
      look: BLOODY_LOOKS[(i + Math.floor(this.rand() * BLOODY_LOOKS.length)) % BLOODY_LOOKS.length],
    }));
    // El pasillo de Drake (Elora): el fuego del Drake Sangriento, las T y Tarda explicándolo
    this.fuego = L.fuego ? { fase: 'espera', t: 0 } : null;
    this.enT = false;   // estás encima de una T (para no rebotar de una hoja a otra)
    const n = (L.markers.N || [])[0];
    this.npc = n ? { x: n.x, y: n.y, look: { ...characterById('tarda'), ...TARDA_GRIS } } : null;
    // botones pulsados (en el pasillo de Drake hay 5 y hay que pulsarlos todos)
    this.botonesPulsados = 0;
    this.tapes = 0;
    this.coins = 0;
    // En el Bonus no hay botón: las puertas ya están abiertas.
    this.buttonPressed = !!this.level.noButton;
    this.doorClosed = false;
    this.messages = []; // {text, ttl}
    this.flash = 0;
    this.nextRush = 0;   // cuándo toca la siguiente tanda de monedas
    this.cam = { x: 0, y: 0 };
    if (this.n > 0) {
      const name = L.name ? (L.name[getLang()] || L.name.es) : null;
      this.say(name ? t('msg.levelStartNamed', { n: this.n, name }) : t('msg.levelStart', { n: this.n }), 3);
      if (L.noButton) this.say(t('msg.bonus'), 6);
      if (L.fuego) this.say(t('msg.drakeLevel'), 8);
    }

    // La oscuridad es un degradado suave: se calcula a media resolución (4 veces menos trabajo)
    // y se estira al pintarla, sin que se note.
    // En el Bonus la luz es enorme y suave: basta con un cuarto de resolución, y así no va con lag (Elora).
    const res = L.noButton ? 0.25 : 0.5;
    this.dark = document.createElement('canvas');
    this.dark.width = VIEW_W * res; this.dark.height = VIEW_H * res;
    this.dark.getContext('2d').setTransform(res, 0, 0, res, 0, 0);
    this.updateCamera();
  }

  say(text, ttl = 3) { this.messages.push({ text, ttl }); if (this.messages.length > 3) this.messages.shift(); }

  // Movimiento del jugador (también lo usa el lobby).
  updatePlayer(dt, input) {
    const L = this.level, p = this.player;
    const ax = input.axis();
    let vx = ax.x, vy = ax.y;
    const len = Math.hypot(vx, vy);
    if (len > 0) { vx /= len; vy /= len; }
    // correr gasta estamina; si se acaba, se anda hasta recuperar un poco
    const quiereCorrer = input.isDown('run') && len > 0;
    const turbo = p.supercarrera > 0;   // Supercarrera de Hoppy: corre sola, sin gastar estamina
    const corriendo = turbo ? len > 0 : quiereCorrer && (this.sinCansancio || (p.agotado ? p.stamina >= STAMINA.minToRun : p.stamina > 0));
    if (turbo || (this.sinCansancio && corriendo)) {   // (en el lobby se corre sin cansarse: Elora)
      p.agotado = false;
    } else if (corriendo) {
      p.agotado = false;
      p.sinCorrer = 0;
      p.stamina -= STAMINA.runCost * dt * statMul(this.ch, 'resistencia');
      if (p.stamina <= 0) { p.stamina = 0; p.agotado = true; this.say(t('msg.tired'), 1.5); }
    } else {
      p.sinCorrer += dt;
      if (p.sinCorrer >= STAMINA.regenDelay) p.stamina = Math.min(STAMINA.max, p.stamina + STAMINA.regen * dt);
    }
    let speed = (corriendo ? PLAYER.run : PLAYER.walk) * statMul(this.ch, 'velocidad');
    if (p.capa > 0) speed *= ABILITIES.tarda.slow;   // con la capa Tun se va más despacio
    if (turbo) speed = PLAYER.run * ABILITIES.hoppy.speed * statMul(this.ch, 'velocidad');   // Supercarrera de Hoppy
    if (this.flood > 0) speed *= ABILITIES.jely.playerFast;   // Jely nada más rápido en el agua
    p.moving = len > 0;
    p.corriendo = corriendo;   // (Gec va en monopatín cuando corre)
    p.facing = facingOf(ax.x, ax.y, p.facing);
    if (p.moving) { p.walk += dt * (corriendo ? 16 : 11); p.andando = (p.andando || 0) + dt; } else p.andando = 0;

    if (input.wasPressed('jump') && !p.jumping && p.fly <= 0) { p.jumping = true; p.jump = this.jumpTime; }
    if (p.jumping) {
      p.jump -= dt;
      if (this.ch.ability === 'carot') speed *= ABILITIES.carot.airSpeed;
      // no aterrizar dentro de un trasto
      if (p.jump <= 0 && !collides(L, p.x, p.y, p.r, 'player', false)) p.jumping = false;
    }

    // lengua de Gec (tecla Q)
    if (p.cooldown > 0) p.cooldown -= dt;
    if (this.ch.ability === 'gek' && input.wasPressed('ability') && p.cooldown <= 0 && !p.tongue) this.shootTongue();
    if (this.ch.ability === 'draila' && input.wasPressed('ability') && p.cooldown <= 0) this.bite();
    if (this.ch.ability === 'tarda' && input.wasPressed('ability') && p.cooldown <= 0) {
      p.capa = ABILITIES.tarda.time;
      p.cooldown = ABILITIES.tarda.cooldown;
      this.say(t('msg.capa'), 2);
      sfx.capa();
    }
    if (this.ch.ability === 'katy' && input.wasPressed('ability') && p.cooldown <= 0) this.paint();
    if (this.ch.ability === 'hoppy' && input.wasPressed('ability') && p.cooldown <= 0 && p.supercarrera <= 0) {
      p.supercarrera = ABILITIES.hoppy.time;
      p.cooldown = ABILITIES.hoppy.cooldown;
      this.say(t('msg.supercarrera'), 2);
      sfx.supercarrera();
    }
    if (p.supercarrera > 0) p.supercarrera -= dt;
    if (this.ch.ability === 'drake' && input.wasPressed('ability') && p.cooldown <= 0 && p.fly <= 0) {
      p.fly = ABILITIES.drake.time;
      p.cooldown = ABILITIES.drake.cooldown;
      p.jumping = false;
      this.say(t('msg.fly'), 2);
      sfx.fly();
    }
    if (p.fly > 0) {
      p.fly -= dt;
      // no aterrizar encima de un trasto: sigue volando hasta estar sobre el suelo
      // (0,35 s es lo que tarda en bajar; así baja siempre ya fuera del trasto)
      if (p.fly < 0.35 && collides(L, p.x, p.y, p.r, 'player', false)) p.fly = 0.35;
    }
    if (p.capa > 0) p.capa -= dt;
    if (p.tongue) {
      const tg = p.tongue;
      if (tg.phase === 'out') {
        tg.len = Math.min(tg.max, tg.len + dt * 900);
        if (tg.len >= tg.max) {
          if (tg.target) { tg.phase = 'dash'; p.jumping = true; p.jump = 0.05; sfx.dash(); }
          else tg.phase = 'in';
        }
      } else if (tg.phase === 'dash') {
        const dx = tg.target.x - p.x, dy = tg.target.y - p.y, l = Math.hypot(dx, dy);
        const step = ABILITIES.gek.dashSpeed * dt;
        if (l <= step + 1) { p.x = tg.target.x; p.y = tg.target.y; p.tongue = null; p.jump = 0.05; }
        else {
          const hit = move(L, p, dx / l * step, dy / l * step, 'player', true);
          tg.len = Math.max(0, l - step);
          if (hit) { p.tongue = null; p.jump = 0.05; }
        }
        p.walk += dt * 30;
        return; // durante el tirón no se controla al personaje
      } else {
        tg.len -= dt * 1200;
        if (tg.len <= 0) p.tongue = null;
      }
    }

    // empujón tras un golpe
    const kdx = p.kx * dt, kdy = p.ky * dt;
    p.kx *= Math.max(0, 1 - dt * 8); p.ky *= Math.max(0, 1 - dt * 8);

    move(L, p, vx * speed * dt + kdx, vy * speed * dt + kdy, p.fly > 0 ? 'flyer' : 'player', p.jumping);
    if (p.invuln > 0) p.invuln -= dt;
  }

  // Gec lanza la lengua hacia donde mira. Si toca algo sólido antes de 7 casillas, se engancha ahí.
  shootTongue() {
    const L = this.level, p = this.player;
    const [dx, dy] = FACING_VEC[p.facing];
    const maxLen = ABILITIES.gek.rangeTiles * TILE;
    let target = null, len = maxLen;
    for (let d = 8; d <= maxLen; d += 8) {
      const x = p.x + dx * d, y = p.y + dy * d;
      const tile = tileAt(L, Math.floor(x / TILE), Math.floor(y / TILE));
      if (solidFor(tile, 'player', false)) {
        len = d;
        // se queda justo antes del sitio donde se enganchó
        const back = Math.max(p.r + 6, d - TILE * 0.75);
        target = { x: p.x + dx * back, y: p.y + dy * back };
        break;
      }
    }
    if (target && dist(target.x, target.y, p.x, p.y) < TILE * 0.5) target = null; // ya estás pegado a ello
    p.tongue = { dir: [dx, dy], len: 0, max: len, phase: 'out', target };
    p.cooldown = ABILITIES.gek.cooldown;
    sfx.tongue();
  }

  // Draila muerde y lanza una onda que empuja a los Bloodies.
  bite() {
    const p = this.player;
    const [dx, dy] = FACING_VEC[p.facing];
    this.wave = { x: p.x, y: p.y - 6, dir: [dx, dy], len: 0, max: ABILITIES.draila.rangeTiles * TILE, golpeados: new Set() };
    p.cooldown = ABILITIES.draila.cooldown;
    this.say(t('msg.bite'), 1.5);
    sfx.bite();
  }

  updateWave(dt) {
    const w = this.wave, L = this.level;
    w.len += ABILITIES.draila.speed * dt;
    const cx = w.x + w.dir[0] * w.len, cy = w.y + w.dir[1] * w.len;
    // la onda se para si choca con una pared
    if (blocksSight(tileAt(L, Math.floor(cx / TILE), Math.floor(cy / TILE))) || w.len >= w.max) { this.wave = null; return; }
    // empuja a los Bloodies que toca
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (w.golpeados.has(i)) continue;
      if (dist(e.x, e.y, cx, cy) > e.r + TILE * 0.6) continue;
      w.golpeados.add(i);
      e.kx = w.dir[0] * ABILITIES.draila.push;
      e.ky = w.dir[1] * ABILITIES.draila.push;
      e.recoil = ABILITIES.draila.stun;   // se aparta y deja de perseguir un rato
      e.chasing = false;
      e.lastSeen = null;
      sfx.hurt();
    }
  }

  // Caty pinta a TODOS los Bloodies del mapa de un color fosforito, cada vez uno distinto (Elora):
  // durante unos segundos se ven en la oscuridad y, si están fuera de la pantalla, sale una flecha
  // señalándolos.
  paint() {
    const p = this.player;
    p.cooldown = ABILITIES.katy.cooldown;
    if (this.enemies.length === 0) { this.say(t('msg.paintNone'), 2); return; }
    const otros = PINTURAS_FOSFORITO.filter((c) => c !== this.pintura);   // nunca el mismo que la vez anterior
    this.pintura = otros[Math.floor(Math.random() * otros.length)];
    for (const e of this.enemies) e.pintado = ABILITIES.katy.time;
    this.say(t('msg.paint', { color: t('paint.color.' + this.pintura.id) }), 2);
    sfx.paint();
  }

  update(dt, input) {
    if (this.paused || this.finished) return;
    this.time += dt;
    const L = this.level, p = this.player;

    if (input.wasPressed('pause')) { this.cb.onPause(); return; }

    // --- puerta de entrada se cierra ---
    if (!this.doorClosed && !L.noButton && this.time > DOOR_CLOSE_DELAY) {
      this.doorClosed = true;
      this.say(t('msg.doorClosed'));
      sfx.door();
    }

    // --- habilidades con la tecla Q ---
    if (this.freeze > 0) this.freeze -= dt;
    if (this.wave) this.updateWave(dt);
    if (this.ch.ability === 'oct' && input.wasPressed('ability') && p.cooldown <= 0) {
      this.freeze = ABILITIES.oct.freezeTime;
      p.cooldown = ABILITIES.oct.cooldown;
      this.say(t('msg.freeze'), 2);
      sfx.freeze();
    }
    if (this.flood > 0) this.flood -= dt;
    if (this.ch.ability === 'jely' && input.wasPressed('ability') && p.cooldown <= 0 && this.flood <= 0) {
      this.flood = ABILITIES.jely.time;
      p.cooldown = ABILITIES.jely.cooldown;
      this.say(t('msg.flood'), 2);
      sfx.flood();
    }

    this.updatePlayer(dt, input);

    // --- lluvia de monedas del Bonus: salen varias a la vez, duran unos segundos y se van ---
    if (L.coinRush) this.updateCoinRush(dt);

    // --- objetos ---
    for (const it of L.items) {
      if (it.taken || dist(it.x, it.y, p.x, p.y) > p.r + 10) continue;
      it.taken = true;
      if (it.type === 'tape') { this.tapes++; p.anxiety += ANXIETY.tape; this.say(t('msg.tape'), 1.5); sfx.tape(); this.cb.onTape(); }
      else if (it.type === 'food') { p.anxiety += ANXIETY.food; this.say(t('msg.food'), 1.5); sfx.food(); }
      else if (it.type === 'heart') { p.hearts = Math.min(maxHearts(this.ch), p.hearts + 1); this.say(t('msg.heart'), 1.5); sfx.heart(); }
      else if (it.type === 'coin') { const v = coinValue(it.kind); this.coins += v; this.cb.onCoin(v); sfx.coin(); }
      else if (it.type === 'stamina') {
        p.stamina = Math.min(STAMINA.max, p.stamina + STAMINA.ball);
        p.agotado = false;
        this.say(t('msg.stamina'), 1.5); sfx.stamina();
      }
    }

    // --- botón ---
    if (L.buttons && L.buttons.length) {
      // el botón sin pulsar que tienes al lado
      const cerca = this.buttonPressed ? null : L.buttons.find((b) => tileAt(L, b.tx, b.ty) === T.BUTTON
        && dist((b.tx + 0.5) * TILE, (b.ty + 0.5) * TILE, p.x, p.y) < TILE * 1.4);
      this.nearButton = !!cerca;
      if (cerca && input.wasPressed('interact')) {
        setTile(L, cerca.tx, cerca.ty, T.BUTTON_PRESSED);
        this.botonesPulsados++;
        p.anxiety += ANXIETY.button;
        sfx.button();
        if (this.botonesPulsados >= L.buttons.length) {
          this.buttonPressed = true;
          for (const e of L.exits) setTile(L, e.tx, e.ty, T.EXIT_OPEN);
          this.say(t('msg.buttonPressed'), 3.5);
          this.say(t('msg.exitHint'), 3.5);
        } else {
          this.say(t('msg.buttonsLeft', { n: this.botonesPulsados, total: L.buttons.length }), 3.5);
        }
      }
    }

    // --- pasillo de Drake: zona segura, huecos, las T, Tarda y el fuego (Elora) ---
    if (L.seguro) {
      const i = Math.floor(p.y / TILE) * L.w + Math.floor(p.x / TILE);
      p.seguro = !!L.seguro[i];     // zona verde: no te quitan vida pase lo que pase, ni la ansiedad
      p.enHueco = !!L.refugio[i];   // hueco con naranja: el fuego no te hace nada
      if (p.seguro) p.anxiety -= ANXIETY.calm * dt;
    }
    this.updateTeleport(p);
    if (this.npc) {
      this.nearNpc = !this.nearButton && dist(this.npc.x, this.npc.y, p.x, p.y) < TILE * 1.8;
      if (this.nearNpc && input.wasPressed('interact') && this.cb.onDialogue) {
        this.cb.onDialogue([1, 2, 3, 4, 5].map((k) => t('drake.tarda.' + k)));
      }
    }
    if (this.fuego) this.updateFuego(dt, p);

    // --- salida ---
    if (this.buttonPressed && tileAt(L, Math.floor(p.x / TILE), Math.floor(p.y / TILE)) === T.EXIT_OPEN) {
      this.finished = true;
      sfx.levelUp();
      this.cb.onComplete({ tapes: this.tapes, coins: this.coins });
      return;
    }

    // --- Bloodies ---
    let nearest = Infinity;
    const frozen = this.freeze > 0;
    for (const e of this.enemies) {
      const d = dist(e.x, e.y, p.x, p.y);
      nearest = Math.min(nearest, d);
      for (const tr of e.trail) tr.age += dt;
      if (e.pintado > 0) e.pintado -= dt;
      // empujón de la onda de Draila
      if (e.kx || e.ky) {
        move(L, e, e.kx * dt, e.ky * dt, 'enemy');
        e.kx *= Math.max(0, 1 - dt * 6); e.ky *= Math.max(0, 1 - dt * 6);
        if (Math.hypot(e.kx, e.ky) < 5) { e.kx = 0; e.ky = 0; }
      }
      if (frozen) continue; // parados por Oct: no se mueven ni hacen daño
      const edt = this.flood > 0 ? dt * ABILITIES.jely.enemySlow : dt;   // en el agua de Jely van más lentos

      // Solo te ven si no hay pared ni trasto alto en medio.
      const sees = e.recoil <= 0 && d < ENEMY.sightTiles * TILE * statMul(this.ch, 'sigilo') && canSee(L, e.x, e.y, p.x, p.y);
      if (sees) { e.chasing = true; e.lostFor = 0; e.lastSeen = { x: p.x, y: p.y }; }
      else if (e.chasing) {
        e.lostFor += dt;
        if (d > ENEMY.loseTiles * TILE || e.lostFor > ENEMY.giveUpTime) { e.chasing = false; e.lastSeen = null; }
      }

      const ox = e.x, oy = e.y;
      if (e.recoil > 0) {
        // acaba de tocarte: se aparta un momento
        e.recoil -= dt;
        const dx = e.x - p.x, dy = e.y - p.y, l = Math.hypot(dx, dy) || 1;
        move(L, e, dx / l * ENEMY.walk * edt, dy / l * ENEMY.walk * edt, 'enemy');
      } else if (e.chasing && e.stuck < 0.6) {
        // va hacia donde te vio por última vez (si te escondes, va allí y luego se rinde)
        const tgt = e.lastSeen || p;
        const dx = tgt.x - e.x, dy = tgt.y - e.y, l = Math.hypot(dx, dy) || 1;
        if (l > 4) move(L, e, dx / l * ENEMY.chase * edt, dy / l * ENEMY.chase * edt, 'enemy');
      } else {
        // paseo por los pasillos
        e.turn -= dt;
        const hit = move(L, e, e.dir[0] * ENEMY.walk * edt, e.dir[1] * ENEMY.walk * edt, 'enemy');
        if (hit || e.turn <= 0) this.pickDirection(e);
        if (e.stuck >= 0.6) { e.stuck = e.stuck > 1.4 ? 0 : e.stuck + dt; }
      }
      const mdx = e.x - ox, mdy = e.y - oy;
      const moved = Math.hypot(mdx, mdy);
      if (moved > 0.2) { e.facing = facingOf(mdx, mdy, e.facing); e.walk += dt * (e.chasing ? 20 : 8); }
      if (e.chasing) e.stuck = moved < 0.5 ? e.stuck + dt : 0;

      // rastro de sangre: una gota por casilla recorrida, se guardan las últimas 7
      e.trailDist += moved;
      if (e.trailDist >= TILE) {
        e.trailDist = 0;
        e.trail.push({ x: e.x + (this.rand() - 0.5) * 10, y: e.y + 6 + (this.rand() - 0.5) * 8, r: 3 + this.rand() * 4, age: 0, seed: this.rand() });
        if (e.trail.length > ENEMY.trail) e.trail.shift();
      }

      // te toca (Carot pasa por encima si está saltando)
      const overJump = this.ch.ability === 'carot' && p.jumping;
      const inmortal = p.capa > 0 || p.fly > 0;   // la capa Tun de Tarda o Drake volando
      if (d < e.r + p.r && p.invuln <= 0 && e.recoil <= 0 && !overJump && !inmortal && !p.seguro) {
        p.hearts -= 1;
        p.invuln = PLAYER.invuln;
        p.anxiety += ANXIETY.hit * statMul(this.ch, 'cordura');
        e.recoil = ENEMY.recoil;
        e.chasing = false;
        this.flash = 0.5;
        sfx.hurt();
        const dx = p.x - e.x, dy = p.y - e.y, l = Math.hypot(dx, dy) || 1;
        p.kx = dx / l * PLAYER.knockback; p.ky = dy / l * PLAYER.knockback;
      }
    }

    // --- ansiedad (sube con Bloodies cerca, baja cuando estás tranquilo) ---
    const nr = ANXIETY.nearRadiusTiles * TILE;
    if (nearest < nr && !frozen && !p.seguro) p.anxiety += (ANXIETY.nearGain * (1 - nearest / nr) + 2) * dt * statMul(this.ch, 'cordura');
    else p.anxiety -= ANXIETY.calm * dt;
    p.anxiety = Math.max(0, Math.min(ANXIETY.max, p.anxiety));

    // --- mensajes y efectos ---
    for (const m of this.messages) m.ttl -= dt;
    this.messages = this.messages.filter((m) => m.ttl > 0);
    if (this.flash > 0) this.flash -= dt;

    // --- muerte ---
    if (p.hearts <= 0) { this.finished = true; sfx.death(); this.cb.onDeath('hearts'); return; }
    if (p.anxiety >= ANXIETY.max && !p.seguro) { this.finished = true; sfx.death(); this.cb.onDeath('anxiety'); return; }

    this.updateCamera();
  }

  updateCamera() {
    const L = this.level, p = this.player;
    const mw = L.w * TILE, mh = L.h * TILE;
    this.cam.x = mw <= VIEW_W ? (mw - VIEW_W) / 2 : Math.max(0, Math.min(mw - VIEW_W, p.x - VIEW_W / 2));
    this.cam.y = mh <= VIEW_H ? (mh - VIEW_H) / 2 : Math.max(0, Math.min(mh - VIEW_H, p.y - VIEW_H / 2));
  }

  // Monedas que aparecen y desaparecen durante los primeros segundos del Bonus.
  updateCoinRush(dt) {
    const L = this.level, r = L.coinRush, p = this.player;
    // las que ya estaban: se les acaba el tiempo
    for (const it of L.items) {
      if (it.ttl == null || it.taken) continue;
      it.ttl -= dt;
      if (it.ttl <= 0) it.taken = true;
    }
    if (this.time > r.duration || this.time < this.nextRush) return;
    this.nextRush = this.time + r.every;
    // sitios lejos del jugador y repartidos, para que haya que correr
    const libres = (L.free || []).filter((c) => {
      const d = Math.hypot((c.tx + 0.5) * TILE - p.x, (c.ty + 0.5) * TILE - p.y);
      return d > TILE * 2.5 && tileAt(L, c.tx, c.ty) === T.FLOOR;
    });
    if (!libres.length) return;
    const puestas = [];
    for (let i = 0; i < r.count && libres.length; i++) {
      // se elige una al azar que no esté pegada a las otras de esta tanda
      let mejor = null, mejorD = -1;
      for (let intento = 0; intento < 12; intento++) {
        const c = libres[Math.floor(this.rand() * libres.length)];
        const d = puestas.length ? Math.min(...puestas.map((q) => Math.hypot(q.tx - c.tx, q.ty - c.ty))) : 99;
        if (d > mejorD) { mejorD = d; mejor = c; }
        if (d >= 6) break;
      }
      if (!mejor) break;
      puestas.push(mejor);
      L.items.push({ type: 'coin', kind: pickCoinKind(this.rand), x: (mejor.tx + 0.5) * TILE, y: (mejor.ty + 0.5) * TILE, taken: false, ttl: r.life, born: this.time });
    }
    this.say(t('msg.coinRush'), 2);
  }

  pickDirection(e) {
    const L = this.level;
    const open = DIRS.filter(([dx, dy]) => {
      const tx = Math.floor((e.x + dx * TILE * 1.2) / TILE), ty = Math.floor((e.y + dy * TILE * 1.2) / TILE);
      return !solidFor(tileAt(L, tx, ty), 'enemy');
    });
    const notBack = open.filter(([dx, dy]) => !(dx === -e.dir[0] && dy === -e.dir[1]));
    const pool = notBack.length ? notBack : (open.length ? open : DIRS);
    e.dir = pool[Math.floor(this.rand() * pool.length)];
    e.turn = 1.2 + this.rand() * 2.5;
  }

  // ------------------------------------------------------------ dibujo
  render(ctx) {
    const p = this.player;
    ctx.fillStyle = '#0b0a0e';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    // con mucho estrés la pantalla tiembla (Elora); el marcador no tiembla
    const estres = Math.max(0, (p.anxiety / ANXIETY.max - STRESS.from) / (1 - STRESS.from));
    const temblor = Math.max(0, (p.anxiety / ANXIETY.max - STRESS.shakeFrom) / (1 - STRESS.shakeFrom)) * STRESS.shakePx;
    const sx = Math.round(Math.sin(this.time * 47) * temblor), sy = Math.round(Math.cos(this.time * 53) * temblor);
    ctx.save();
    ctx.translate(sx, sy);
    ctx.save();
    ctx.translate(-Math.round(this.cam.x), -Math.round(this.cam.y));
    this.renderWorld(ctx);

    // rastros de sangre de los Bloodies
    for (const e of this.enemies) for (const tr of e.trail) {
      ctx.fillStyle = `rgba(143,17,25,${Math.max(0.25, 1 - tr.age / 12)})`;
      ctx.beginPath(); ctx.ellipse(tr.x, tr.y, tr.r, tr.r * 0.6, tr.seed * 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(tr.x + tr.r * 0.8, tr.y + tr.r * 0.3, tr.r * 0.3, 0, Math.PI * 2); ctx.fill();
    }

    // Bloodies y jugador (ordenados por altura para que se tapen bien)
    const frozen = this.freeze > 0;
    const actors = this.enemies.map((e) => ({ y: e.y, draw: () => drawCharacter(ctx, e.look, e.x, e.y, e.facing, frozen ? 0 : e.walk, 0, false, { bloody: true, chasing: e.chasing && !frozen, frozen, pintado: e.pintado > 0 ? this.pintura : null }) }));
    // Tarda, en el pasillo de Drake (Elora: está ahí para explicarte cómo funciona)
    if (this.npc) actors.push({ y: this.npc.y, draw: () => drawCharacter(ctx, this.npc.look, this.npc.x, this.npc.y - 6, 'down', this.time * 2, 0, false, { alta: true }) });
    actors.push({ y: p.y, draw: () => this.drawPlayer(ctx) });
    actors.sort((a, b) => a.y - b.y);
    for (const a of actors) a.draw();

    ctx.restore();

    // oscuridad
    this.renderDarkness(ctx);
    ctx.restore();

    // estrés: la pantalla se oscurece con los bordes en rojo, latiendo (Elora)
    if (estres > 0) this.renderStress(ctx, estres);

    // flechas de la pintura de Caty hacia los Bloodies que están fuera de la pantalla
    this.renderPaintMarkers(ctx);

    // golpe
    if (this.flash > 0) { ctx.fillStyle = `rgba(190,10,20,${this.flash * 0.7})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }
    // hielo de Oct
    if (frozen) { ctx.fillStyle = `rgba(120,200,255,${Math.min(0.18, this.freeze * 0.1)})`; ctx.fillRect(0, 0, VIEW_W, VIEW_H); }
    // agua de Jely
    if (this.flood > 0) this.renderFlood(ctx);
    // el fuego del Drake Sangriento
    if (this.fuego) this.renderFuego(ctx);

    this.renderHUD(ctx);
  }

  // Las T del pasillo de Drake: al entrar en el cuadrado de una T pasas a la T de la otra hoja (y se
  // puede volver, Elora). Las T de la mitad izquierda del mapa van con las de la derecha.
  updateTeleport(p) {
    const ts = this.level.markers.T;
    if (!ts || !ts.length) return;
    const tx = Math.floor(p.x / TILE), ty = Math.floor(p.y / TILE);
    const aqui = ts.find((m) => m.tx === tx && m.ty === ty);
    if (!aqui) { this.enT = false; return; }
    if (this.enT) return;
    const mitad = this.level.w / 2;
    const otras = ts.filter((m) => (m.tx < mitad) !== (aqui.tx < mitad));
    if (!otras.length) return;
    const cx = otras.reduce((s, m) => s + m.x, 0) / otras.length, cy = otras.reduce((s, m) => s + m.y, 0) / otras.length;
    p.x = cx; p.y = cy; p.kx = 0; p.ky = 0;
    this.enT = true;
    this.updateCamera(true);
    sfx.button();
    this.say(t('msg.teleport'), 2.5);
  }

  // El fuego del Drake Sangriento (Elora): cada DRAKE.fireEvery segundos sale el aviso "¡EL FUEGO SE
  // ACERCA!" y tienes DRAKE.warn segundos para meterte en un hueco con naranja. Drake sube volando desde
  // abajo, se para arriba del todo (fuera del mapa), escupe fuego y se vuelve a ir.
  updateFuego(dt, p) {
    const f = this.fuego;
    f.t += dt;
    if (f.fase === 'espera' && f.t >= DRAKE.fireEvery) {
      f.fase = 'aviso'; f.t = 0;   // el aviso grande lo pinta renderFuego
      sfx.hurt();
      music.play('fuego');         // música rápida y nerviosa mientras viene Drake (Elora)
    } else if (f.fase === 'aviso' && f.t >= DRAKE.warn) {
      f.fase = 'fuego'; f.t = 0;
      const libre = p.seguro || p.enHueco || p.capa > 0 || p.fly > 0;
      if (libre) this.say(t('msg.fuegoSalvado'), 3);
      else {
        p.hearts = Math.max(0, p.hearts - DRAKE.damage);
        p.anxiety += ANXIETY.hit * statMul(this.ch, 'cordura');
        this.flash = 0.8;
        sfx.hurt();
        this.say(t('msg.fuegoQuema', { n: DRAKE.damage }), 3);
      }
    } else if (f.fase === 'fuego' && f.t >= DRAKE.fireTime) {
      f.fase = 'vuelta'; f.t = 0;
    } else if (f.fase === 'vuelta' && f.t >= DRAKE.flyTime) {
      f.fase = 'espera'; f.t = 0;
      music.play('miedo');
    }
    // Drake está viniendo y aún no te has escondido: te sube un poco la ansiedad (Elora)
    if (f.fase === 'aviso' && !p.seguro && !p.enHueco) p.anxiety += DRAKE.anxiety * dt * statMul(this.ch, 'cordura');
  }

  // Drake (gigante, DRAKE.size veces un Bloody) volando por la pantalla, el aviso y las llamas.
  renderFuego(ctx) {
    const f = this.fuego;
    if (f.fase === 'espera') return;
    const arriba = -40, abajo = VIEW_H + 420;
    let y;
    if (f.fase === 'aviso') y = abajo + (arriba - abajo) * Math.min(1, f.t / DRAKE.flyTime);
    else if (f.fase === 'fuego') y = arriba;
    else y = arriba - (f.t / DRAKE.flyTime) * 500;
    // las llamas, que bajan desde la boca de Drake hasta abajo del todo
    if (f.fase === 'fuego') {
      const k = Math.min(1, f.t / 0.35) * (1 - Math.max(0, (f.t - DRAKE.fireTime + 0.4) / 0.4));
      const g = ctx.createLinearGradient(0, 0, 0, VIEW_H);
      g.addColorStop(0, `rgba(255,240,120,${0.85 * k})`); g.addColorStop(0.4, `rgba(255,120,20,${0.7 * k})`); g.addColorStop(1, `rgba(200,20,10,${0.55 * k})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.fillStyle = `rgba(255,200,60,${0.6 * k})`;
      for (let i = 0; i < 26; i++) {
        const x = (i / 25) * VIEW_W + Math.sin(this.time * 9 + i) * 18;
        const h = VIEW_H * (0.55 + 0.45 * Math.abs(Math.sin(this.time * 6 + i * 1.7)));
        ctx.beginPath(); ctx.moveTo(x - 22, 0); ctx.quadraticCurveTo(x + Math.sin(this.time * 12 + i) * 30, h * 0.6, x, h); ctx.quadraticCurveTo(x + 10, h * 0.5, x + 22, 0); ctx.fill();
      }
    }
    // Drake gigante
    ctx.save(); ctx.translate(VIEW_W / 2, y); ctx.scale(DRAKE.size, DRAKE.size);
    drawCharacter(ctx, DRAKE_SANGRIENTO, 0, 0, f.fase === 'vuelta' ? 'up' : 'down', this.time * 6, 0, false, {});
    ctx.restore();
    // el aviso, grande y parpadeando, con la cuenta atrás
    if (f.fase === 'aviso') {
      const queda = Math.ceil(DRAKE.warn - f.t);
      ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (Math.floor(this.time * 3) % 2 === 0) {
        ctx.font = 'bold 44px system-ui, sans-serif'; ctx.lineWidth = 7; ctx.strokeStyle = '#000';
        ctx.strokeText(t('msg.fuegoAviso'), VIEW_W / 2, VIEW_H * 0.3); ctx.fillStyle = '#ff5a1f'; ctx.fillText(t('msg.fuegoAviso'), VIEW_W / 2, VIEW_H * 0.3);
      }
      ctx.font = 'bold 30px system-ui, sans-serif'; ctx.lineWidth = 6; ctx.strokeStyle = '#000';
      const linea = this.player.seguro || this.player.enHueco ? t('msg.fuegoBien') : t('msg.fuegoEscondete', { s: queda });
      ctx.strokeText(linea, VIEW_W / 2, VIEW_H * 0.3 + 48); ctx.fillStyle = this.player.seguro || this.player.enHueco ? '#7dff9a' : '#ffe36b';
      ctx.fillText(linea, VIEW_W / 2, VIEW_H * 0.3 + 48);
      ctx.restore();
    }
  }

  // La sala inundada de Jely: agua azul por encima de todo, con ondas que se mueven y burbujas que suben.
  // Entra y se va poco a poco (medio segundo).
  renderFlood(ctx) {
    const a = Math.min(1, this.flood / 0.5, (ABILITIES.jely.time - this.flood) / 0.5);
    const tt = this.time;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(40,120,200,0.28)';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    // ondas claras
    ctx.strokeStyle = 'rgba(170,225,255,0.35)';
    ctx.lineWidth = 2;
    for (let y = 20; y < VIEW_H; y += 46) {
      ctx.beginPath();
      for (let x = 0; x <= VIEW_W; x += 12) {
        const yy = y + Math.sin(x * 0.03 + tt * 2 + y) * 4;
        if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
    // burbujas (cada una en su propio trazo)
    ctx.strokeStyle = 'rgba(220,245,255,0.6)';
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 24; i++) {
      const sx = ((i * 97.3) % VIEW_W) + Math.sin(tt * 2 + i) * 6;
      const sy = VIEW_H - (((tt * (25 + (i % 5) * 8)) + i * 53) % (VIEW_H + 20));
      const r = 2 + (i % 3);
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  // Viñeta de estrés: oscura hacia fuera y roja en los bordes; late más fuerte cuanto más estrés.
  renderStress(ctx, estres) {
    if (!this.stressGrad) {
      const g = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, VIEW_H * 0.25, VIEW_W / 2, VIEW_H / 2, VIEW_W * 0.62);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(0.55, 'rgba(30,0,4,0.35)');
      g.addColorStop(1, 'rgba(170,0,12,0.85)');
      this.stressGrad = g;
    }
    const latido = 0.8 + 0.2 * Math.sin(this.time * (5 + estres * 5));
    ctx.save();
    ctx.globalAlpha = Math.min(1, estres * latido);
    ctx.fillStyle = this.stressGrad;
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.restore();
  }

  // Los Bloodies pintados que se salen de la pantalla se marcan con una flecha en el borde:
  // así la pintura funciona como un localizador de todo el mapa, no solo de lo que ves.
  renderPaintMarkers(ctx) {
    const cam = this.cam, m = 22;
    for (const e of this.enemies) {
      if (e.pintado <= 0) continue;
      const sx = e.x - cam.x, sy = e.y - cam.y;
      if (sx > m && sx < VIEW_W - m && sy > m && sy < VIEW_H - m) continue;  // ya se ve
      const cx = VIEW_W / 2, cy = VIEW_H / 2;
      const dx = sx - cx, dy = sy - cy;
      const ang = Math.atan2(dy, dx);
      // dónde corta la línea centro→Bloodie con el borde de la pantalla (dejando margen)
      const k = Math.min((VIEW_W / 2 - m) / Math.max(Math.abs(dx), 1e-6), (VIEW_H / 2 - m) / Math.max(Math.abs(dy), 1e-6));
      const px = cx + dx * k, py = cy + dy * k;
      ctx.save();
      ctx.translate(px, py); ctx.rotate(ang);
      ctx.globalAlpha = e.pintado < 0.6 ? e.pintado / 0.6 : 1;   // se apaga al acabarse
      const pin = this.pintura || PINTURAS_FOSFORITO[0];
      ctx.shadowColor = pin.c; ctx.shadowBlur = 12;
      ctx.fillStyle = pin.c;
      ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(-7, -7); ctx.lineTo(-3, 0); ctx.lineTo(-7, 7); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
  }

  drawPlayer(ctx) {
    const p = this.player;
    // lengua de Gec
    if (p.tongue && p.tongue.len > 0) {
      const [dx, dy] = p.tongue.dir;
      ctx.strokeStyle = '#ff6f9c'; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.x, p.y - 12); ctx.lineTo(p.x + dx * p.tongue.len, p.y - 12 + dy * p.tongue.len); ctx.stroke();
      ctx.fillStyle = '#ff4d85';
      ctx.beginPath(); ctx.arc(p.x + dx * p.tongue.len, p.y - 12 + dy * p.tongue.len, 4, 0, Math.PI * 2); ctx.fill();
    }
    let jumpH = p.jumping && p.jump > 0.06 ? Math.sin((1 - p.jump / this.jumpTime) * Math.PI) * (this.ch.ability === 'carot' ? 34 : 22) : 0;
    // Drake volando: sube, se balancea un poco y baja despacio al final
    if (p.fly > 0) jumpH = (26 + Math.sin(this.time * 5) * 3) * Math.min(1, p.fly / 0.35, (ABILITIES.drake.time - p.fly) / 0.25 + 0.2);
    // los andares que inventó Elora en su Taller de Andares (solo andando por el suelo, sin saltar ni volar)
    const pose = p.moving && !p.jumping && p.fly <= 0 && !p.tongue ? poseAndando(this.ch.id, !!p.corriendo, p.andando || 0) : null;
    drawCharacter(ctx, this.ch, p.x, p.y, p.facing, p.moving || (p.tongue && p.tongue.phase === 'dash') ? p.walk : 0, jumpH,
      p.invuln > 0 && Math.floor(this.time * 12) % 2 === 0, { capa: p.capa > 0, flap: p.fly > 0 ? this.time * 14 : null, skate: !!p.corriendo, lengua: !!p.tongue, pose });
    // sin estamina: gotas de sudor de cansancio (Elora)
    if (p.agotado) this.drawSweat(ctx, p.x, p.y - jumpH);
    // Supercarrera de Hoppy: rayas de velocidad detrás
    if (p.supercarrera > 0 && p.moving) this.drawSpeedLines(ctx, p, jumpH);
    // la onda del mordisco de Draila
    if (this.wave) {
      const w = this.wave;
      const cx = w.x + w.dir[0] * w.len, cy = w.y + w.dir[1] * w.len;
      const fuerza = 1 - w.len / w.max;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.atan2(w.dir[1], w.dir[0]));
      ctx.globalAlpha = Math.max(0.2, fuerza);
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = i === 0 ? '#ffffff' : '#9fe0ff';
        ctx.lineWidth = 4 - i;
        ctx.beginPath();
        ctx.arc(-i * 7, 0, 16 + i * 3, -1.1, 1.1);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  // Rayas de velocidad detrás del jugador (Supercarrera de Hoppy): salen hacia atrás y se borran.
  drawSpeedLines(ctx, p, jumpH) {
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.facing] || [0, 1];
    const px = -d[1], py = d[0];   // de lado
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineCap = 'round'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      const off = (i - 1.5) * 6, fase = (this.time * 6 + i * 0.37) % 1;
      const x0 = p.x - d[0] * (14 + fase * 10) + px * off, y0 = p.y - 8 - jumpH - d[1] * (14 + fase * 10) + py * off;
      ctx.globalAlpha = 1 - fase;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 - d[0] * 12, y0 - d[1] * 12); ctx.stroke();
    }
    ctx.restore();
  }

  // Tres gotas de sudor que salen de la cabeza y caen, una detrás de otra.
  drawSweat(ctx, x, y) {
    for (let i = 0; i < 3; i++) {
      const ph = (this.time * 1.6 + i / 3) % 1;
      const side = i === 1 ? 1 : -1;
      const dx = x + side * (11 + ph * 5), dy = y - 24 + ph * 14;
      ctx.globalAlpha = ph < 0.8 ? 1 : (1 - ph) * 5;
      ctx.fillStyle = '#8fd8ff';
      ctx.beginPath();
      ctx.moveTo(dx, dy - 7);
      ctx.quadraticCurveTo(dx + 5, dy, dx, dy + 4.5);
      ctx.quadraticCurveTo(dx - 5, dy, dx, dy - 7);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(dx - 1.2, dy, 1.3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // Suelo, paredes, decoración, trastos, puertas, botón y objetos. (También lo usa el lobby.)
  renderWorld(ctx) {
    const L = this.level, cam = this.cam;
    const tx0 = Math.floor(cam.x / TILE), ty0 = Math.floor(cam.y / TILE);
    const tx1 = Math.ceil((cam.x + VIEW_W) / TILE), ty1 = Math.ceil((cam.y + VIEW_H) / TILE);

    // Lo que no cambia nunca (suelo, paredes, manchas y trastos) se pinta una sola vez
    // en una imagen guardada y aquí solo se copia el trozo que se ve.
    if (!this.staticLayer) this.staticLayer = this.buildStaticLayer();
    const layer = this.staticLayer;
    const sx = Math.max(0, Math.floor(cam.x)), sy = Math.max(0, Math.floor(cam.y));
    const sw = Math.min(layer.width - sx, VIEW_W + 1), sh = Math.min(layer.height - sy, VIEW_H + 1);
    if (sw > 0 && sh > 0) ctx.drawImage(layer, sx, sy, sw, sh, sx, sy, sw, sh);

    // puertas y botón: cambian durante la partida, se pintan en cada fotograma
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const tile = tileAt(L, tx, ty);
      const x = tx * TILE, y = ty * TILE;
      if (tile === T.DOOR_START) {
        this.drawDoor(ctx, x, y, !this.doorClosed, '#6b4a2b', '#c9a45c');
      } else if (tile === T.EXIT_CLOSED) {
        this.drawDoor(ctx, x, y, false, '#3d4650', '#e0343d');
      } else if (tile === T.EXIT_OPEN) {
        this.drawDoor(ctx, x, y, true, '#3d4650', '#6be07a');
      } else if (tile === T.BUTTON || tile === T.BUTTON_PRESSED) {
        ctx.fillStyle = '#5c6270'; ctx.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
        ctx.fillStyle = '#3c414c'; ctx.fillRect(x + 6, y + TILE - 12, TILE - 12, 6);
        const on = tile === T.BUTTON_PRESSED;
        ctx.fillStyle = on ? '#4ad35c' : (Math.sin(this.time * 5) > 0 ? '#ff3b47' : '#b7202a');
        ctx.beginPath(); ctx.arc(x + TILE / 2, y + TILE / 2 - 2, on ? 6 : 8, 0, Math.PI * 2); ctx.fill();
      }
    }

    this.renderItems(ctx);
  }

  // La imagen fija del nivel: se hace una vez al empezar a dibujarlo.
  buildStaticLayer() {
    const L = this.level;
    const theme = L.theme || { floor: [72, 78, 92], wall: [34, 30, 42], grout: 'rgba(0,0,0,0.18)' };
    const layer = document.createElement('canvas');
    layer.width = L.w * TILE; layer.height = L.h * TILE;
    const ctx = layer.getContext('2d');

    // suelo y paredes
    for (let ty = 0; ty < L.h; ty++) for (let tx = 0; tx < L.w; tx++) {
      const tile = tileAt(L, tx, ty);
      const x = tx * TILE, y = ty * TILE;
      if (tile === T.WALL) {
        const h = ((tx * 7 + ty * 13) % 5) * 2;
        ctx.fillStyle = `rgb(${theme.wall[0] + h},${theme.wall[1] + h},${theme.wall[2] + h})`;
        ctx.fillRect(x, y, TILE, TILE);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(x, y, TILE, 3);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(x, y + TILE - 3, TILE, 3);
        if (tileAt(L, tx, ty + 1) !== T.WALL) { ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fillRect(x, y + TILE - 6, TILE, 6); }
      } else {
        if (theme.floorColors) {
          // suelo de varios colores, como el del Bonus
          const c = theme.floorColors[(tx * 5 + ty * 3 + ((tx + ty) % 2) * 2) % theme.floorColors.length];
          ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
        } else {
          const v = ((tx * 31 + ty * 17) % 7);
          ctx.fillStyle = `rgb(${theme.floor[0] + v},${theme.floor[1] + v},${theme.floor[2] + v})`;
        }
        ctx.fillRect(x, y, TILE, TILE);
        // pasillo de Drake: la zona segura, verde; los huecos con naranja, un poco naranjas
        if (L.seguro && L.seguro[ty * L.w + tx]) { ctx.fillStyle = 'rgba(60,200,110,0.45)'; ctx.fillRect(x, y, TILE, TILE); }
        else if (L.refugio && L.refugio[ty * L.w + tx]) { ctx.fillStyle = 'rgba(255,150,60,0.18)'; ctx.fillRect(x, y, TILE, TILE); }
        ctx.strokeStyle = theme.grout;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
      }
    }

    // manchas de sangre
    ctx.fillStyle = '#8f1119';
    for (const d of L.decals) {
      ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r, d.r * 0.7, d.seed * 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(d.x + d.r * 0.9, d.y + d.r * 0.4, d.r * 0.35, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(d.x - d.r * 0.8, d.y - d.r * 0.5, d.r * 0.25, 0, Math.PI * 2); ctx.fill();
    }

    // trastos
    for (let ty = 0; ty < L.h; ty++) for (let tx = 0; tx < L.w; tx++) {
      const tile = tileAt(L, tx, ty);
      const x = tx * TILE, y = ty * TILE;
      if (tile === T.OBSTACLE) {
        // naranja: se puede saltar
        ctx.fillStyle = '#b8651f'; ctx.fillRect(x + 2, y + 6, TILE - 4, TILE - 8);
        ctx.fillStyle = '#e08a3c'; ctx.fillRect(x + 2, y + 2, TILE - 4, 8);
        ctx.strokeStyle = '#6e3a10'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x + 6, y + 14); ctx.lineTo(x + TILE - 6, y + 14); ctx.moveTo(x + 6, y + 22); ctx.lineTo(x + TILE - 6, y + 22); ctx.stroke();
      } else if (tile === T.BLOCK) {
        // rojo: alto, no se puede saltar y tapa la vista
        ctx.fillStyle = '#8e1c24'; ctx.fillRect(x + 1, y + 4, TILE - 2, TILE - 5);
        ctx.fillStyle = '#c4303a'; ctx.fillRect(x + 1, y + 1, TILE - 2, 7);
        ctx.strokeStyle = '#4a0b10'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x + 5, y + 10); ctx.lineTo(x + TILE - 5, y + TILE - 6); ctx.moveTo(x + TILE - 5, y + 10); ctx.lineTo(x + 5, y + TILE - 6); ctx.stroke();
      }
    }
    // las T del pasillo de Drake: un cuadrado morado con la T
    const ts = L.markers.T || [];
    if (ts.length) {
      ctx.fillStyle = 'rgba(150,60,220,0.55)';
      for (const m of ts) ctx.fillRect(m.tx * TILE + 1, m.ty * TILE + 1, TILE - 2, TILE - 2);
      for (const lado of [ts.filter((m) => m.tx < L.w / 2), ts.filter((m) => m.tx >= L.w / 2)]) {
        if (!lado.length) continue;
        const cx = lado.reduce((a, m) => a + m.x, 0) / lado.length, cy = lado.reduce((a, m) => a + m.y, 0) / lado.length;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 40px system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('T', cx, cy + 2);
      }
    }
    return layer;
  }

  // Cintas, comida, corazones, estamina y monedas (se mueven un poco, se pintan en cada fotograma).
  renderItems(ctx) {
    const L = this.level, cam = this.cam;
    for (const it of L.items) {
      if (it.x < cam.x - 20 || it.x > cam.x + VIEW_W + 20 || it.y < cam.y - 20 || it.y > cam.y + VIEW_H + 20) continue;
      if (it.taken) continue;
      const bob = Math.sin(this.time * 3 + it.x) * 2;
      if (it.type === 'tape') this.drawTape(ctx, it.x, it.y + bob);
      else if (it.type === 'food') {
        ctx.fillStyle = '#d9a04b'; ctx.beginPath(); ctx.arc(it.x, it.y + bob, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f3c477'; ctx.beginPath(); ctx.arc(it.x - 2, it.y - 2 + bob, 3, 0, Math.PI * 2); ctx.fill();
      } else if (it.type === 'heart') {
        this.brillo(ctx, it.x, it.y + bob, 14, '#ff3b47', 0.55);
        ctx.fillStyle = '#ff3b47';
        this.heart(ctx, it.x, it.y + bob, 7);
      } else if (it.type === 'stamina') {
        // bolita de estamina: una bola verde-turquesa con un rayito dentro
        const pulso = 1 + Math.sin(this.time * 5 + it.x) * 0.08;
        ctx.save();
        this.brillo(ctx, it.x, it.y + bob, 16, ESTAMINA, 0.6);
        ctx.fillStyle = ESTAMINA;
        ctx.beginPath(); ctx.arc(it.x, it.y + bob, 7 * pulso, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#eafff6';
        ctx.beginPath();
        ctx.moveTo(it.x + 1.5, it.y + bob - 5); ctx.lineTo(it.x - 2.5, it.y + bob + 0.5);
        ctx.lineTo(it.x - 0.2, it.y + bob + 0.5); ctx.lineTo(it.x - 1.5, it.y + bob + 5);
        ctx.lineTo(it.x + 2.5, it.y + bob - 0.5); ctx.lineTo(it.x + 0.2, it.y + bob - 0.5);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      } else if (it.type === 'coin') {
        let escala = 1, alfa = 1;
        if (it.ttl != null) {
          const edad = this.time - it.born;
          if (edad < 0.25) escala = edad / 0.25;                      // aparece creciendo
          if (it.ttl < 1.2) alfa = Math.sin(it.ttl * 14) > 0 ? 1 : 0.25; // parpadea antes de irse
        }
        if (escala <= 0) continue;
        ctx.save();
        ctx.globalAlpha = alfa;
        const w = (Math.abs(Math.cos(this.time * 4 + it.x)) * 7 + 1) * escala;
        const h = 7 * escala;
        if (it.ttl != null) this.brillo(ctx, it.x, it.y + bob, 16 * escala, '#ffe36b', 0.7);
        drawCoinFast(ctx, it.x, it.y + bob, it.kind, w, h);
        ctx.restore();
      }
    }
  }

  // un brillo redondo de color (rápido: es un dibujito guardado, no shadowBlur)
  brillo(ctx, x, y, r, color, alfa = 1) {
    const a = ctx.globalAlpha;
    ctx.globalAlpha = a * alfa;
    ctx.drawImage(glowSprite(color), x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = a;
  }

  drawTape(ctx, x, y) {
    ctx.fillStyle = '#1c1c22'; ctx.fillRect(x - 10, y - 6, 20, 13);
    ctx.fillStyle = '#e8e2c8'; ctx.fillRect(x - 7, y - 3, 14, 5);
    ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(x - 4, y + 3, 2, 0, Math.PI * 2); ctx.moveTo(x + 6, y + 3); ctx.arc(x + 4, y + 3, 2, 0, Math.PI * 2); ctx.fill();
  }

  drawDoor(ctx, x, y, open, frame, light) {
    ctx.fillStyle = frame; ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = open ? '#050408' : this.shade(frame, -20);
    ctx.fillRect(x + 4, y + 3, TILE - 8, TILE - 6);
    if (!open) { ctx.fillStyle = this.shade(frame, 25); ctx.fillRect(x + TILE / 2 - 1, y + 3, 2, TILE - 6); }
    ctx.fillStyle = light;
    ctx.shadowColor = light; ctx.shadowBlur = 10;
    ctx.fillRect(x + 12, y + 1, TILE - 24, 3);
    ctx.shadowBlur = 0;
  }

  shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (n >> 16) + amt)), g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt)), b = Math.max(0, Math.min(255, (n & 255) + amt));
    return `rgb(${r},${g},${b})`;
  }

  renderDarkness(ctx) {
    const d = this.dark.getContext('2d');
    const p = this.player, cam = this.cam, L = this.level;
    d.globalCompositeOperation = 'source-over';
    d.fillStyle = L.noButton ? 'rgba(4,2,8,0.72)' : 'rgba(4,2,8,0.93)';
    d.fillRect(0, 0, VIEW_W, VIEW_H);
    d.globalCompositeOperation = 'destination-out';
    // cada luz es la misma mancha redonda (hecha una sola vez), estirada al tamaño que toque
    const sprite = lightSprite();
    const hole = (x, y, r, strength = 1) => {
      d.globalAlpha = strength;
      d.drawImage(sprite, x - r, y - r, r * 2, r * 2);
    };
    const flicker = 1 + Math.sin(this.time * 9) * 0.02 + Math.sin(this.time * 23) * 0.01;
    // El Bonus está mucho más iluminado: es una sala alegre y se tiene que ver entera.
    const radio = (L.noButton ? LIGHT_RADIUS_TILES * 2.6 : LIGHT_RADIUS_TILES) * TILE * flicker;
    hole(p.x - cam.x, p.y - cam.y, radio);
    // Con la salida abierta, su luz verde se ve desde lejos para guiarte hasta ella.
    if (this.buttonPressed) for (const e of L.exits) hole((e.tx + 0.5) * TILE - cam.x, (e.ty + 0.5) * TILE - cam.y, TILE * 3, 0.8);
    // Los Bloodies pintados por Caty se ven en la oscuridad.
    for (const e of this.enemies) {
      if (e.pintado > 0) hole(e.x - cam.x, e.y - cam.y, TILE * 2.6, 0.9);
    }
    // Las monedas de la lluvia brillan, para poder encontrarlas.
    for (const it of L.items) {
      if (it.taken || it.ttl == null) continue;
      hole(it.x - cam.x, it.y - cam.y, TILE * 2.2, 0.75);
    }
    d.globalAlpha = 1;
    ctx.drawImage(this.dark, 0, 0, VIEW_W, VIEW_H);
  }

  renderHUD(ctx) {
    const p = this.player;
    const font = '"Segoe UI", system-ui, Arial';
    ctx.save();
    ctx.textBaseline = 'top';
    // corazones
    for (let i = 0; i < maxHearts(this.ch); i++) {
      ctx.fillStyle = i < p.hearts ? '#ff3b47' : 'rgba(255,255,255,0.18)';
      this.heart(ctx, 26 + i * 30, 26, 11);
    }
    // ansiedad: fondo verde, se llena de rojo de izquierda a derecha
    const bx = 16, by = 52, bw = 220, bh = 16;
    const frac = p.anxiety / ANXIETY.max;
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
    ctx.fillStyle = '#3fae5a'; ctx.fillRect(bx, by, bw, bh);
    const high = frac > 0.7 && Math.sin(this.time * 10) > 0;
    ctx.fillStyle = high ? '#ff5560' : '#c4161f';
    ctx.fillRect(bx, by, bw * frac, bh);
    ctx.fillStyle = '#fff'; ctx.font = `bold 13px ${font}`;
    ctx.fillText(t('hud.anxiety').toUpperCase(), bx + 4, by + 1);
    // estamina: se vacía al correr y se rellena sola al parar
    const sy = by + 22, sh = 12, sfrac = p.stamina / STAMINA.max;
    ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(bx - 2, sy - 2, bw + 4, sh + 4);
    ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.fillRect(bx, sy, bw, sh);
    // al quedarse sin estamina la barra parpadea en naranja, para que se note
    ctx.fillStyle = p.agotado && Math.sin(this.time * 10) > 0 ? '#ff9b3d' : ESTAMINA;
    ctx.fillRect(bx, sy, bw * sfrac, sh);
    ctx.fillStyle = '#fff'; ctx.font = `bold 11px ${font}`;
    ctx.shadowColor = '#000'; ctx.shadowBlur = 3;
    ctx.fillText(t('hud.stamina').toUpperCase(), bx + 4, sy);
    ctx.shadowBlur = 0;
    // habilidad
    this.renderAbility(ctx, bx, sy + 20, font);
    // nivel, cintas, monedas
    ctx.textAlign = 'right'; ctx.font = `bold 20px ${font}`;
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#000'; ctx.shadowBlur = 6;
    ctx.fillText(t('hud.level', { n: this.n }), VIEW_W - 18, 16);
    ctx.font = `16px ${font}`;
    ctx.fillText(`${t('hud.tapes')}: ${this.tapes} / ${this.level.items.filter((i) => i.type === 'tape').length}`, VIEW_W - 18, 44);
    ctx.fillStyle = '#ffd95a';
    ctx.fillText(`${t('hud.coins')}: ${this.cb.totalCoins()}`, VIEW_W - 18, 66);
    // en el pasillo de Drake: cuántos botones llevas (Elora: hay que pulsar los 5)
    const nb = this.level.buttons ? this.level.buttons.length : 0;
    if (nb > 1) {
      ctx.fillStyle = this.buttonPressed ? '#7dff9a' : '#ff8a8a';
      ctx.fillText(t('hud.buttons', { n: this.botonesPulsados, total: nb }), VIEW_W - 18, 88);
    }
    // mensajes
    ctx.textAlign = 'center';
    let yy = VIEW_H - 40;
    if (this.nearButton) { ctx.font = `bold 20px ${font}`; ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.pressButton'), VIEW_W / 2, yy); yy -= 30; }
    else if (this.nearNpc) { ctx.font = `bold 20px ${font}`; ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.talkTarda'), VIEW_W / 2, yy); yy -= 30; }
    this.renderMessages(ctx, yy, font);
    ctx.restore();
  }

  renderAbility(ctx, x, y, font) {
    const p = this.player;
    ctx.font = `bold 15px ${font}`;
    if (this.ch.ability === 'oct') {
      const name = t('ability.oct.name');
      if (this.freeze > 0) { ctx.fillStyle = '#9fe8ff'; ctx.fillText(`${name}: ${Math.ceil(this.freeze)}s`, x, y); }
      else if (p.cooldown > 0) { ctx.fillStyle = '#a99db3'; ctx.fillText(t('hud.abilityWait', { name, s: Math.ceil(p.cooldown) }), x, y); }
      else { ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.abilityReady', { name }), x, y); }
    } else if (this.ch.ability === 'gek') {
      const name = t('ability.gek.name');
      if (p.cooldown > 0) { ctx.fillStyle = '#a99db3'; ctx.fillText(t('hud.abilityWait', { name, s: Math.ceil(p.cooldown) }), x, y); }
      else { ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.abilityReady', { name }), x, y); }
    } else if (this.ch.ability === 'drake') {
      const name = t('ability.drake.name');
      if (p.fly > 0) { ctx.fillStyle = '#ffb070'; ctx.fillText(`${name}: ${Math.ceil(p.fly)}s`, x, y); }
      else if (p.cooldown > 0) { ctx.fillStyle = '#a99db3'; ctx.fillText(t('hud.abilityWait', { name, s: Math.ceil(p.cooldown) }), x, y); }
      else { ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.abilityReady', { name }), x, y); }
    } else if (this.ch.ability === 'hoppy') {
      const name = t('ability.hoppy.name');
      if (p.supercarrera > 0) { ctx.fillStyle = '#ffd36b'; ctx.fillText(`${name}: ${Math.ceil(p.supercarrera)}s`, x, y); }
      else if (p.cooldown > 0) { ctx.fillStyle = '#a99db3'; ctx.fillText(t('hud.abilityWait', { name, s: Math.ceil(p.cooldown) }), x, y); }
      else { ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.abilityReady', { name }), x, y); }
    } else if (this.ch.ability === 'jely') {
      const name = t('ability.jely.name');
      if (this.flood > 0) { ctx.fillStyle = '#8fd4ff'; ctx.fillText(`${name}: ${Math.ceil(this.flood)}s`, x, y); }
      else if (p.cooldown > 0) { ctx.fillStyle = '#a99db3'; ctx.fillText(t('hud.abilityWait', { name, s: Math.ceil(p.cooldown) }), x, y); }
      else { ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.abilityReady', { name }), x, y); }
    } else if (this.ch.ability === 'tarda') {
      const name = t('ability.tarda.name');
      if (p.capa > 0) { ctx.fillStyle = '#c9a3f0'; ctx.fillText(`${name}: ${Math.ceil(p.capa)}s`, x, y); }
      else if (p.cooldown > 0) { ctx.fillStyle = '#a99db3'; ctx.fillText(t('hud.abilityWait', { name, s: Math.ceil(p.cooldown) }), x, y); }
      else { ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.abilityReady', { name }), x, y); }
    } else if (this.ch.ability === 'draila' || this.ch.ability === 'katy') {
      const name = t('ability.' + this.ch.ability + '.name');
      if (p.cooldown > 0) { ctx.fillStyle = '#a99db3'; ctx.fillText(t('hud.abilityWait', { name, s: Math.ceil(p.cooldown) }), x, y); }
      else { ctx.fillStyle = '#ffe36b'; ctx.fillText(t('hud.abilityReady', { name }), x, y); }
    } else if (this.ch.ability === 'carot') {
      ctx.fillStyle = '#ffe36b';
      ctx.fillText(t('ability.carot.name'), x, y);
    }
  }

  renderMessages(ctx, yy, font) {
    ctx.font = `18px ${font}`;
    ctx.textAlign = 'center';
    const maxW = VIEW_W - 80;
    for (let i = this.messages.length - 1; i >= 0; i--) {
      const m = this.messages[i];
      ctx.fillStyle = `rgba(255,255,255,${Math.min(1, m.ttl)})`;
      // partir en líneas si el texto es largo
      const lines = [];
      let cur = '';
      for (const w of m.text.split(' ')) {
        const test = cur ? cur + ' ' + w : w;
        if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
      }
      if (cur) lines.push(cur);
      for (let k = lines.length - 1; k >= 0; k--) { ctx.fillText(lines[k], VIEW_W / 2, yy); yy -= 26; }
    }
  }

  heart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.9);
    ctx.bezierCurveTo(x - s * 1.2, y, x - s * 0.6, y - s * 0.9, x, y - s * 0.3);
    ctx.bezierCurveTo(x + s * 0.6, y - s * 0.9, x + s * 1.2, y, x, y + s * 0.9);
    ctx.fill();
  }
}
