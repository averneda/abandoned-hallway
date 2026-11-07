// Arranque del juego y paso entre pantallas: menú → lobby → (cinemática) → pasillos.

import { VIEW_W, VIEW_H, CONTINUE_EVERY, COINS, DRAKE, ADVIENTO } from './config.js';
import { loadLang, t } from './i18n.js';
import { Input } from './input.js';
import { UI, tapeName } from './ui.js';
import { Game } from './game.js';
import { Lobby } from './lobby.js';
import { Intro } from './intro.js';
import { Title } from './title.js';
import { TouchControls } from './touch.js';
import { music } from './music.js';
import { characterById, conSkin, SKINS } from './characters.js';
import { abrir as abrirAdviento, estadoVacio as advientoVacio } from './adviento.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const input = new Input();
const ui = new UI(document.getElementById('ui'), input);
const touch = new TouchControls(input);   // botones en pantalla, solo en móviles y tablets

loadLang();

// Lo que se recuerda entre partidas: personajes, monedas, cintas totales y personaje elegido.
// El progreso de los pasillos NO se guarda.
// Carot y Froggy son los personajes iniciales: se pueden elegir desde el principio (Elora).
const unlocked = new Set(['carot', 'froggy']);
const wallet = { coins: 0, tapes: 0 };
// La caja de cintas del lobby (Elora): los números de las cintas depositadas en la tienda de Tarda.
// Las demás cintas que tienes están en el inventario. Se pueden recuperar desde la caja.
const cajaCintas = new Set();
// drakeEnTienda: ya escapaste del pasillo de Drake y Drake está en la tienda (Elora)
// modoPijama: se puso el código del modo pijama (Elora): las skins de pijama salen en la tienda, gratis
// modoNavidad: se puso el código del modo Navidad (Elora): lobby de Navidad y el reno gratis
const flags = { introSeen: false, tutorialSeen: false, lobbySeen: false, drakeEnTienda: false, modoPijama: false, modoNavidad: false };
// La skin que lleva puesta cada personaje (id del personaje → skin). Solo se ven en el modo pijama.
const skinsElegidas = {};
// El calendario de Adviento (Elora): qué casillas has abierto y si ya te dieron los regalos finales
let adviento = advientoVacio();
// Los personajes que tienes: los comprados y, en el modo Navidad, también el reno (gratis, sin guardarlo)
function tienes() { return flags.modoNavidad ? new Set([...unlocked, 'reno']) : unlocked; }
function aplicarSkin(ch) { return conSkin(ch, flags.modoPijama ? skinsElegidas[ch.id] : null); }
const run = { character: characterById('carot'), level: 1, tapes: 0 };
try {
  for (const id of JSON.parse(localStorage.getItem('holeway.unlocked') || '[]')) unlocked.add(id);
  wallet.coins = parseInt(localStorage.getItem('holeway.coins') || '0', 10) || 0;
  wallet.tapes = parseInt(localStorage.getItem('holeway.tapes') || '0', 10) || 0;
  const caja = localStorage.getItem('holeway.tapeBox');
  if (caja == null) {
    // partida de antes de la caja: las cintas que ya tenías estaban en la caja del lobby y ahí siguen [PROVISIONAL]
    for (let i = 1; i <= wallet.tapes; i++) cajaCintas.add(i);
  } else for (const n of JSON.parse(caja)) if (n >= 1 && n <= wallet.tapes) cajaCintas.add(n);
  flags.introSeen = localStorage.getItem('holeway.introSeen') === '1';
  flags.tutorialSeen = localStorage.getItem('holeway.tutorialSeen') === '1';
  flags.lobbySeen = localStorage.getItem('holeway.lobbySeen') === '1';
  flags.drakeEnTienda = localStorage.getItem('holeway.drakeEnTienda') === '1';
  flags.modoPijama = localStorage.getItem('holeway.modoPijama') === '1';
  flags.modoNavidad = localStorage.getItem('holeway.modoNavidad') === '1';
  Object.assign(skinsElegidas, JSON.parse(localStorage.getItem('holeway.skins') || '{}'));
  adviento = { ...advientoVacio(), ...JSON.parse(localStorage.getItem('holeway.adviento') || '{}') };
  const chId = localStorage.getItem('holeway.character');
  if (chId && tienes().has(chId)) run.character = aplicarSkin(characterById(chId));
} catch (e) { /* nada */ }
function save() {
  try {
    localStorage.setItem('holeway.unlocked', JSON.stringify([...unlocked]));
    localStorage.setItem('holeway.coins', String(wallet.coins));
    localStorage.setItem('holeway.tapes', String(wallet.tapes));
    localStorage.setItem('holeway.tapeBox', JSON.stringify([...cajaCintas].sort((a, b) => a - b)));
    localStorage.setItem('holeway.character', run.character.id);
    localStorage.setItem('holeway.introSeen', flags.introSeen ? '1' : '0');
    localStorage.setItem('holeway.tutorialSeen', flags.tutorialSeen ? '1' : '0');
    localStorage.setItem('holeway.lobbySeen', flags.lobbySeen ? '1' : '0');
    localStorage.setItem('holeway.drakeEnTienda', flags.drakeEnTienda ? '1' : '0');
    localStorage.setItem('holeway.modoPijama', flags.modoPijama ? '1' : '0');
    localStorage.setItem('holeway.modoNavidad', flags.modoNavidad ? '1' : '0');
    localStorage.setItem('holeway.skins', JSON.stringify(skinsElegidas));
    localStorage.setItem('holeway.adviento', JSON.stringify(adviento));
  } catch (e) { /* nada */ }
}

let scene = null; // objeto con update(dt, input) y render(ctx), o null

// Monedas de práctica del lobby ya cogidas: vuelven a salir cuando escapas de un pasillo,
// para que no se puedan sacar monedas infinitas entrando y saliendo del lobby.
const practiceTaken = new Set();

// Lo que comparten el lobby y los pasillos.
const common = {
  onCoin: (k) => { wallet.coins += k; save(); },
  onTape: () => { wallet.tapes += 1; save(); },
  totalCoins: () => wallet.coins,
  totalTapes: () => wallet.tapes,
  cintasEnCaja: () => cajaCintas.size,
};
// Las cintas del inventario (las que no están en la caja), en orden.
function inventarioCintas() { const r = []; for (let i = 1; i <= wallet.tapes; i++) if (!cajaCintas.has(i)) r.push(i); return r; }
function cintasDeLaCaja() { return [...cajaCintas].sort((a, b) => a - b); }

// ---------------- ajuste al tamaño de la ventana
function fit() {
  const s = Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H);
  document.getElementById('stage').style.transform = `translate(-50%, -50%) scale(${s})`;
}
window.addEventListener('resize', fit);
fit();

// ---------------- pantallas
function gotoMenu() {
  scene = new Title();   // el cartel de Elora, dibujado en el canvas
  music.stop();
  ui.showMenu({
    // La cinemática sale al principio, la primera vez, y lleva al lobby.
    onPlay: () => { if (flags.introSeen) gotoLobby(); else gotoIntro(); },
    onPad: () => ui.showPadSetup({ input, onClose: gotoMenu }),
    // el modo pijama secreto (Elora): se pone y se quita con el código
    pijama: {
      activo: () => flags.modoPijama,
      cambiar: (on) => { flags.modoPijama = on; run.character = aplicarSkin(run.character); save(); },
    },
    // el modo Navidad secreto (Elora): lobby de Navidad y el reno gratis; al quitarlo, si llevabas el reno
    // y no lo has ganado, vuelves a Carot
    navidad: {
      activo: () => flags.modoNavidad,
      cambiar: (on) => {
        flags.modoNavidad = on;
        if (!tienes().has(run.character.id)) run.character = aplicarSkin(characterById('carot'));
        save();
      },
    },
  });
}

function gotoLobby() {
  const lobby = new Lobby(run.character, {
    ...common,
    practiceTaken,
    onPause: () => {
      lobby.paused = true;
      ui.showPause({ menuLabel: 'pause.mainMenu', onResume: () => { ui.clear(); lobby.paused = false; input.clear(); }, onMenu: gotoMenu });
    },
    onShop: () => {
      lobby.paused = true;
      const close = () => { ui.clear(); lobby.paused = false; input.clear(); };
      // la tienda de Tarda (dibujo de Elora): Depositar cintas o Cambiar personaje
      const menu = () => ui.showTarda({ onDeposit: depositar, onCharacters: () => open(), onClose: close });
      const depositar = () => ui.showDeposit({
        inventario: inventarioCintas(),
        onDeposit: (nums) => {
          for (const n of nums) cajaCintas.add(n);
          save();
          ui.toast('📦 ' + t('deposit.done', { n: nums.length }));
          depositar();
        },
        onBack: menu,
      });
      // focusId: a quién señalar al abrir (tras comprar, al recién comprado)
      const open = (focusId) => ui.showShop({
        unlocked: tienes(), coins: wallet.coins, current: run.character, focusId,
        // los secretos no salen hasta que los tienes (el reno: ganándolo en el calendario o en el modo Navidad)
        secretos: flags.drakeEnTienda ? new Set(['reno']) : new Set(['drake', 'reno']),
        onChoose: (ch) => { run.character = aplicarSkin(ch); save(); lobby.setCharacter(run.character); close(); },
        // en el modo pijama, las skins (gratis); si es el personaje que llevas, se lo pone ya
        skins: flags.modoPijama ? {
          elegida: (id) => skinsElegidas[id] || null,
          elegir: (ch, skin) => {
            if (skin) skinsElegidas[ch.id] = skin; else delete skinsElegidas[ch.id];
            if (ch.id === run.character.id) { run.character = aplicarSkin(ch); lobby.setCharacter(run.character); }
            save();
            if (skin) ui.toast(SKINS[skin].emoji + ' ' + t('skins.toast', { name: ch.name }));
          },
        } : null,
        onBuy: (ch) => { wallet.coins -= ch.price; unlocked.add(ch.id); save(); open(ch.id); ui.toast('⭐ ' + t('select.bought', { name: ch.name })); },
        onClose: menu,
      });
      menu();
    },
    onTapes: () => {
      lobby.paused = true;
      const verCaja = () => ui.showTapes({
        caja: cintasDeLaCaja(),
        onRecover: (n) => { cajaCintas.delete(n); save(); ui.toast('🎒 ' + t('tapes.recovered', { name: tapeName(n) })); verCaja(); },
        onClose: () => { ui.clear(); lobby.paused = false; input.clear(); },
      });
      verCaja();
    },
    // el calendario de Adviento (Elora): abrir la casilla de hoy y darte lo que toque
    onAdviento: () => {
      lobby.paused = true;
      ui.showAdviento({
        estado: adviento,
        monedas: () => wallet.coins,
        precio: ADVIENTO.precioRecuperar,
        // fecha: un día que se te pasó y recuperas por 1.000 monedas (Elora)
        onAbrir: (cual, fecha) => {
          if (fecha && wallet.coins < ADVIENTO.precioRecuperar) return '';
          const p = abrirAdviento(cual, adviento, undefined, fecha);
          if (!p) return '';
          if (fecha) wallet.coins -= ADVIENTO.precioRecuperar;
          wallet.coins += p.monedas;
          wallet.tapes += p.cintas;                         // las cintas van al inventario
          if (p.personaje) unlocked.add(p.personaje);       // el personaje secreto (sale en la tienda cuando exista)
          save();
          if (p.final === 'grande') return (p.monedas ? t('adv.monedas', { n: p.monedas }) + ' ' : '') + t('adv.finalGrande') + ' ' + t('adv.finalGrandeLuego');
          if (p.final === 'chico') return t('adv.finalChico');
          if (fecha) return t('adv.recuperado');
          return p.monedas ? t('adv.monedas', { n: p.monedas }) : t('adv.guardado');
        },
        onClose: () => { ui.clear(); lobby.paused = false; input.clear(); },
      });
    },
    onStart: () => startLevel(1),
  });
  scene = lobby;
  music.play('lobby');   // musiquilla tranquila del lobby, pedida por Elora
  ui.clear();
  // Tarda saluda la primera vez que entras al lobby.
  if (!flags.lobbySeen) {
    lobby.paused = true;
    ui.showDialogue([t('lobby.welcome')], () => { lobby.paused = false; input.clear(); flags.lobbySeen = true; save(); });
  }
}

// La cinemática se ve al empezar a jugar y termina llevándote al lobby.
function gotoIntro() {
  const done = () => { flags.introSeen = true; save(); gotoLobby(); };
  music.stop();
  scene = new Intro(run.character, done);
  ui.showIntro({ onSkip: () => { if (!scene.finished) { scene.finished = true; done(); } } });
}

function startLevel(n, reintento = false) {
  run.level = n;
  if (n === 1) run.tapes = 0;
  // Los corazones que pierdes se quedan perdidos al pasar de pasillo; solo se curan cogiendo corazones
  // (Elora). Al empezar en el pasillo 1 (desde el lobby) se empieza con todos. Al reintentar un pasillo,
  // con los que tenías al entrar en él.
  if (n === 1 && !reintento) run.hearts = null;
  const game = new Game(run.character, n, {
    ...common,
    startHearts: run.hearts,
    // Tarda explicando el pasillo de Drake (Elora)
    onDialogue: (lines) => {
      game.paused = true;
      ui.showDialogue(lines, () => { game.paused = false; input.clear(); });
    },
    onPause: () => {
      game.paused = true;
      ui.showPause({ onResume: () => { ui.clear(); game.paused = false; input.clear(); }, onMenu: () => gotoLobby() });
    },
    onDeath: (reason) => {
      music.stop();
      ui.showGameOver({
        reason, level: n, tapes: run.tapes + game.tapes, coins: wallet.coins,
        onRetry: () => startLevel(n, true),
        onMenu: () => gotoLobby(),
      });
    },
    onComplete: ({ tapes }) => {
      practiceTaken.clear();
      run.hearts = game.player.hearts;   // pasan al pasillo siguiente tal cual
      run.tapes += tapes;
      wallet.coins += COINS.levelBonus;
      // escapaste del pasillo de Drake: Drake ya está en la tienda de Tarda (Elora)
      const drakeNuevo = n === DRAKE.level && !flags.drakeEnTienda;
      if (n === DRAKE.level) flags.drakeEnTienda = true;
      save();
      if (drakeNuevo) ui.toast('🐉 ' + t('msg.drakeShop', { n: DRAKE.price }));
      if (n % CONTINUE_EVERY === 0) {
        scene = null;
        ui.showContinue({ level: n, tapes: run.tapes, coins: wallet.coins, onContinue: () => startLevel(n + 1), onExit: () => gotoLobby() });
      } else {
        startLevel(n + 1);
        scene.say(t('msg.levelBonus', { n: COINS.levelBonus }), 3);
      }
    },
  });
  scene = game;
  // Musiquilla de miedo en los pasillos y alegre en el Bonus.
  music.play(game.level.noButton ? 'alegre' : 'miedo');
  ui.clear();
  // Tarda explica el juego la primera vez que entras al pasillo 1.
  if (n === 1 && !flags.tutorialSeen) {
    game.paused = true;
    const lines = [1, 2, 3, 4, 5].map((i) => t('tutorial.' + i));
    if (run.character.ability) lines.push(t('tutorial.ability') + ' ' + t('select.ability.' + run.character.ability) + '.');
    ui.showDialogue(lines, () => { game.paused = false; input.clear(); flags.tutorialSeen = true; save(); });
  }
}

// ---------------- bucle principal
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  input.pollPad();
  if (ui.padTick) ui.padTick();
  else ui.padNavigate();
  // los botones táctiles se esconden cuando hay un menú o diálogo abierto (los avisos no cuentan)
  if (touch.enabled) touch.setVisible(!ui.root.querySelector('.screen, .dialog:not(.toast)'));
  if (scene) {
    scene.update(dt, input);
    if (scene) scene.render(ctx);
  } else {
    ctx.fillStyle = '#07060a';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  input.endFrame();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Gancho para pruebas automáticas (no afecta al juego).
window.holewayDebug = { get scene() { return scene; }, run, unlocked, wallet, flags, gotoLobby, startLevel, music, input, touch };

// Atajo para ver una grabación directamente, sin buscar la cinta en los pasillos:
// index.html?cinta=1 (lo usa ver-cinta.bat). Primero hay que pulsar el botón, para que el
// navegador deje sonar las voces y el "ffffff". Al salir, se va al menú.
const cintaDirecta = parseInt(new URLSearchParams(location.search).get('cinta') || '0', 10);
// Atajo para probar un pasillo directamente: index.html?pasillo=50 (el pasillo de Drake). Empiezas
// con el personaje que tengas elegido; al salir o morir vuelves al lobby, como siempre.
const pasilloDirecto = parseInt(new URLSearchParams(location.search).get('pasillo') || '0', 10);
if (cintaDirecta) {
  ui.showTapeDirect(cintaDirecta, () => { location.href = location.pathname; });
} else if (pasilloDirecto > 0) {
  flags.introSeen = true; flags.lobbySeen = true; flags.tutorialSeen = true;
  history.replaceState(null, '', location.pathname);   // para que al recargar no vuelva a entrar
  startLevel(pasilloDirecto);
} else {
  gotoMenu();
}
