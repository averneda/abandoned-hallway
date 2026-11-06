// Arranque del juego y paso entre pantallas: menú → lobby → (cinemática) → pasillos.

import { VIEW_W, VIEW_H, CONTINUE_EVERY, COINS } from './config.js';
import { loadLang, t } from './i18n.js';
import { Input } from './input.js';
import { UI } from './ui.js';
import { Game } from './game.js';
import { Lobby } from './lobby.js';
import { Intro } from './intro.js';
import { Title } from './title.js';
import { TouchControls } from './touch.js';
import { music } from './music.js';
import { characterById } from './characters.js';

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
const flags = { introSeen: false, tutorialSeen: false, lobbySeen: false };
const run = { character: characterById('carot'), level: 1, tapes: 0 };
try {
  for (const id of JSON.parse(localStorage.getItem('holeway.unlocked') || '[]')) unlocked.add(id);
  wallet.coins = parseInt(localStorage.getItem('holeway.coins') || '0', 10) || 0;
  wallet.tapes = parseInt(localStorage.getItem('holeway.tapes') || '0', 10) || 0;
  flags.introSeen = localStorage.getItem('holeway.introSeen') === '1';
  flags.tutorialSeen = localStorage.getItem('holeway.tutorialSeen') === '1';
  flags.lobbySeen = localStorage.getItem('holeway.lobbySeen') === '1';
  const chId = localStorage.getItem('holeway.character');
  if (chId && unlocked.has(chId)) run.character = characterById(chId);
} catch (e) { /* nada */ }
function save() {
  try {
    localStorage.setItem('holeway.unlocked', JSON.stringify([...unlocked]));
    localStorage.setItem('holeway.coins', String(wallet.coins));
    localStorage.setItem('holeway.tapes', String(wallet.tapes));
    localStorage.setItem('holeway.character', run.character.id);
    localStorage.setItem('holeway.introSeen', flags.introSeen ? '1' : '0');
    localStorage.setItem('holeway.tutorialSeen', flags.tutorialSeen ? '1' : '0');
    localStorage.setItem('holeway.lobbySeen', flags.lobbySeen ? '1' : '0');
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
};

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
      // focusId: a quién señalar al abrir (tras comprar, al recién comprado)
      const open = (focusId) => ui.showShop({
        unlocked, coins: wallet.coins, current: run.character, focusId,
        onChoose: (ch) => { run.character = ch; save(); lobby.setCharacter(ch); close(); },
        onBuy: (ch) => { wallet.coins -= ch.price; unlocked.add(ch.id); save(); open(ch.id); ui.toast('⭐ ' + t('select.bought', { name: ch.name })); },
        onClose: close,
      });
      open();
    },
    onTapes: () => {
      lobby.paused = true;
      ui.showTapes({ total: wallet.tapes, onClose: () => { ui.clear(); lobby.paused = false; input.clear(); } });
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

function startLevel(n) {
  run.level = n;
  if (n === 1) run.tapes = 0;
  const game = new Game(run.character, n, {
    ...common,
    onPause: () => {
      game.paused = true;
      ui.showPause({ onResume: () => { ui.clear(); game.paused = false; input.clear(); }, onMenu: () => gotoLobby() });
    },
    onDeath: (reason) => {
      music.stop();
      ui.showGameOver({
        reason, level: n, tapes: run.tapes + game.tapes, coins: wallet.coins,
        onRetry: () => startLevel(n),
        onMenu: () => gotoLobby(),
      });
    },
    onComplete: ({ tapes }) => {
      practiceTaken.clear();
      run.tapes += tapes;
      wallet.coins += COINS.levelBonus; save();
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
if (cintaDirecta) {
  ui.showTapeDirect(cintaDirecta, () => { location.href = location.pathname; });
} else {
  gotoMenu();
}
