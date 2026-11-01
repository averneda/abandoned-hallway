import { Renderer3D } from './renderer-3d.js';
import { Game } from './game.js';
import { Input } from './input.js';
import { UI } from './ui.js';
import { TouchControls } from './touch.js';
import { characterById } from './characters.js';
import { loadLang } from './i18n.js';
import { music } from './music.js';
import { COINS } from './config.js';

loadLang();
const stage = document.getElementById('stage');
const root = document.getElementById('ui');
const hud = document.getElementById('hud').getContext('2d');
const input = new Input();
const ui = new UI(root, input);
const touch = new TouchControls(input);
let renderer, game, coins = 0, tapes = 0, last = performance.now(), stopped = false;
const fit = () => { stage.style.transform = `translate(-50%, -50%) scale(${Math.min(innerWidth / 960, innerHeight / 600)})`; };
addEventListener('resize', fit); fit();
function clearInput() {
  input.clear(); input.padDown.clear(); input.touchDown.clear();
  input.touchDir = { x: 0, y: 0 }; input.padDir = { x: 0, y: 0 };
}
function screen(markup) { ui.clear(); root.innerHTML = `<div class="screen">${markup}</div>`; clearInput(); }
function menu() {
  if (game) game.paused = true;
  music.stop();
  screen(`<p class="eyebrow">ELORA PRESENTA · CAT GAMES</p>
    <h1>ABANDONED<br>HOLEWAY</h1>
    <p>Los pasillos de siempre. Una nueva dimensión.</p>
    <p class="small">Prueba 3D con Carot · Busca el botón y escapa de los Bloodies.<br>
    WASD / flechas: moverte · Shift: correr · Espacio: saltar · E: botón · Esc: pausa</p>
    <button class="primary" id="start">Entrar en el colegio</button>
    <a href="./index.html">Volver al juego original</a>
    <p class="small">Modelos provisionales · Partida de prueba sin guardar progreso</p>`);
  document.getElementById('start').onclick = () => { coins = 0; tapes = 0; start(1); };
}
function pause() {
  if (!game || game.finished || game.paused) return;
  game.paused = true; clearInput();
  ui.showPause({ onResume: () => { ui.clear(); clearInput(); game.paused = false; }, onMenu: menu });
}
function start(n) {
  clearInput(); ui.clear();
  game = new Game(characterById('carot'), n, {
    onCoin: k => { coins += k; }, onTape: () => { tapes++; },
    totalCoins: () => coins, totalTapes: () => tapes,
    onPause: pause,
    onDeath: reason => {
      music.stop();
      ui.showGameOver({ reason, level: n, tapes, coins, onRetry: () => start(n), onMenu: menu });
      clearInput();
    },
    onComplete: () => {
      coins += COINS.levelBonus; music.stop();
      screen(`<p class="eyebrow">SALIDA ENCONTRADA</p><h2>Has escapado del pasillo ${n}</h2>
        <p>${coins} monedas · ${tapes} cintas</p>
        <button class="primary" id="next">Siguiente pasillo</button><button id="menu">Menú</button>`);
      document.getElementById('next').onclick = () => start(n + 1);
      document.getElementById('menu').onclick = menu;
    },
  });
  music.play(game.level.noButton ? 'alegre' : 'miedo');
}
function fail() {
  stopped = true; if (game) game.paused = true; music.stop(); touch.setVisible(false);
  screen('<h2>No se ha podido iniciar el modo 3D</h2><p>El navegador necesita WebGL. Puedes seguir jugando a la versión original.</p><a href="./index.html">Abrir juego 2D</a>');
}
try {
  renderer = new Renderer3D(document.getElementById('game'));
  // The menu shows the actual first level, paused, behind its overlay.
  start(1); menu();
} catch (error) { console.error(error); fail(); }
document.getElementById('game').addEventListener('webglcontextlost', event => { event.preventDefault(); fail(); });
addEventListener('blur', () => { pause(); clearInput(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); clearInput(); } });
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (!stopped) {
    input.pollPad(); ui.padNavigate();
    touch.setVisible(!root.querySelector('.screen'));
    game.update(dt, input);
    renderer.render(game);
    hud.clearRect(0, 0, 960, 600);
    if (!root.querySelector('.screen')) {
      // Reuse all original labels and meters, in the user's saved language.
      hud.fillStyle = 'rgba(5,12,17,.55)'; hud.fillRect(0, 0, 960, 135);
      game.renderHUD(hud);
      const stress = Math.max(0, (game.player.anxiety / 100 - .5) * 2);
      if (stress) game.renderStress(hud, stress);
      if (game.flash > 0) { hud.fillStyle = `rgba(190,10,20,${game.flash * .7})`; hud.fillRect(0, 0, 960, 600); }
    }
    input.endFrame();
    requestAnimationFrame(frame);
  }
}
requestAnimationFrame(frame);
window.holeway3D = { get game() { return game; }, get renderer() { return renderer; }, input, start, menu, pause };
