import { Renderer3D } from './renderer-3d.js';
import { Game } from './game.js';
import { Lobby } from './lobby.js';
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
    <p class="small">Juegas con tu personaje · Busca el botón y escapa de los Bloodies.<br>
    Flechas o WASD: moverte · Arrastra el ratón (o Z y X): girar la cámara · Shift: correr · Espacio: saltar · E: botón · Esc: pausa</p>
    <button class="primary" id="start">Entrar al lobby</button>
    <a href="../index.html">Volver al juego original</a>
    <p class="small">Modelos provisionales · Partida de prueba sin guardar progreso</p>`);
  document.getElementById('start').onclick = () => { coins = 0; tapes = 0; lobby(); };
}
function pause() {
  if (!game || game.finished || game.paused) return;
  game.paused = true; clearInput();
  ui.showPause({ onResume: () => { ui.clear(); clearInput(); game.paused = false; }, onMenu: game instanceof Lobby ? menu : lobby });
}
// el personaje que tienes elegido en el juego 2D (si en esta prueba no existe, juega como Carot pero se ve como el tuyo)
function personaje() {
  let elegido = 'carot'; try { elegido = localStorage.getItem('holeway.character') || 'carot'; } catch (e) { /* nada */ }
  if (renderer) renderer.lookId = elegido;
  return characterById(elegido).id === elegido ? characterById(elegido) : characterById('carot');
}
// los personajes que tienes (comprados en el juego 2D)
function tuyos() {
  let lista = ['carot', 'froggy'];
  try { lista = [...new Set([...lista, ...JSON.parse(localStorage.getItem('holeway.unlocked') || '[]')])]; } catch (e) { /* nada */ }
  return lista;
}
const NOMBRES = { carot: 'Carot', froggy: 'Froggy', oct: 'Oct', tarda: 'Tarda', gek: 'Gec', drake: 'Drake', draila: 'Draila', katy: 'Caty', jely: 'Jely', hoppy: 'Hoppy' };
// El lobby en 3D (Elora): Tarda en su mostrador, la tele con la caja de cintas, las cajas naranjas con
// monedas para practicar el salto, el cartel de las skins y la puerta a los pasillos.
const practica = new Set();
function lobby() {
  clearInput(); ui.clear();
  game = new Lobby(personaje(), {
    practiceTaken: practica,
    onCoin: (k) => { coins += k; }, totalCoins: () => coins, totalTapes: () => tapes,
    onPause: pause,
    onStart: () => { practica.clear(); start(1); },
    onShop: () => {
      // Tarda deja elegir entre los personajes que ya tienes (la tienda para comprar está en el juego 2D)
      game.paused = true;
      const botones = tuyos().map((id) => `<button data-id="${id}">${NOMBRES[id] || id}</button>`).join('');
      screen(`<p class="eyebrow">LA TIENDA DE TARDA</p><h2>¿Con quién quieres jugar?</h2>
        <div class="row">${botones}</div>
        <p class="small">Para comprar personajes nuevos, ve a la tienda del juego normal.</p>
        <button class="primary" id="cerrar">Cerrar</button>`);
      root.querySelectorAll('[data-id]').forEach((b) => { b.onclick = () => {
        try { localStorage.setItem('holeway.character', b.dataset.id); } catch (e) { /* nada */ }
        const pos = { x: game.player.x, y: game.player.y };
        lobby(); game.player.x = pos.x; game.player.y = pos.y;
      }; });
      document.getElementById('cerrar').onclick = () => { ui.clear(); clearInput(); game.paused = false; };
    },
    onTapes: () => {
      game.paused = true;
      let caja = 0; try { caja = JSON.parse(localStorage.getItem('holeway.tapeBox') || '[]').length; } catch (e) { /* nada */ }
      screen(`<p class="eyebrow">LA CAJA DE CINTAS</p><h2>Tienes ${caja} ${caja === 1 ? 'cinta' : 'cintas'} en la caja</h2>
        <p class="small">Las grabaciones se ven en la tele del juego normal.</p>
        <button class="primary" id="cerrar">Cerrar</button>`);
      document.getElementById('cerrar').onclick = () => { ui.clear(); clearInput(); game.paused = false; };
    },
  });
  music.play('lobby');
}
function start(n) {
  clearInput(); ui.clear();
  const ficha = personaje();
  game = new Game(ficha, n, {
    onCoin: k => { coins += k; }, onTape: () => { tapes++; },
    totalCoins: () => coins, totalTapes: () => tapes,
    onPause: pause,
    onDeath: reason => {
      music.stop();
      ui.showGameOver({ reason, level: n, tapes, coins, onRetry: () => start(n), onMenu: lobby });
      clearInput();
    },
    onComplete: () => {
      coins += COINS.levelBonus; music.stop();
      screen(`<p class="eyebrow">SALIDA ENCONTRADA</p><h2>Has escapado del pasillo ${n}</h2>
        <p>${coins} monedas · ${tapes} cintas</p>
        <button class="primary" id="next">Siguiente pasillo</button><button id="menu">Volver al lobby</button>`);
      document.getElementById('next').onclick = () => start(n + 1);
      document.getElementById('menu').onclick = lobby;
    },
  });
  music.play(game.level.noButton ? 'alegre' : 'miedo');
}
function fail() {
  stopped = true; if (game) game.paused = true; music.stop(); touch.setVisible(false);
  screen('<h2>No se ha podido iniciar el modo 3D</h2><p>El navegador necesita WebGL. Puedes seguir jugando a la versión original.</p><a href="../index.html">Abrir juego 2D</a>');
}
try {
  renderer = new Renderer3D(document.getElementById('game'));
  // detrás del menú se ve el lobby, quieto
  lobby(); menu();
} catch (error) { console.error(error); fail(); }
document.getElementById('game').addEventListener('webglcontextlost', event => { event.preventDefault(); fail(); });
addEventListener('blur', () => { pause(); clearInput(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { pause(); clearInput(); } });
const GIRO = 2.2;   // lo rápido que gira la cámara con Z y X (radianes por segundo)
// Z y X giran la cámara (Q es la habilidad y E el botón)
const teclas = new Set();
addEventListener('keydown', (e) => teclas.add(e.code));
addEventListener('keyup', (e) => teclas.delete(e.code));
addEventListener('blur', () => teclas.clear());
const camInput = Object.create(input);
// arrastrando el ratón o el dedo por la pantalla también se gira la cámara
let arrastre = null;
const lienzo3d = document.getElementById('game');
lienzo3d.addEventListener('pointerdown', (e) => { arrastre = e.clientX; });
addEventListener('pointermove', (e) => { if (arrastre == null || !renderer) return; renderer.yaw += (e.clientX - arrastre) * 0.008; arrastre = e.clientX; });
addEventListener('pointerup', () => { arrastre = null; });
// lo de arriba en el lobby: el nombre, las monedas y qué puedes hacer cerca de cada cosa
function hudLobby() {
  hud.save();
  hud.fillStyle = 'rgba(5,12,17,.5)'; hud.fillRect(0, 0, 960, 58);
  hud.font = 'bold 26px system-ui, sans-serif'; hud.fillStyle = '#fff'; hud.textBaseline = 'middle';
  hud.textAlign = 'left'; hud.fillText('Lobby', 18, 29);
  hud.textAlign = 'right'; hud.fillStyle = '#ffd95a'; hud.fillText('🪙 ' + coins, 942, 29);
  const aviso = game.near === 'tarda' ? 'Habla con Tarda (E / Start)' : game.near === 'tapes' ? 'Mira la caja de cintas (E / Start)' : 'Sal por la puerta de arriba para entrar a los pasillos';
  hud.textAlign = 'center'; hud.font = 'bold 20px system-ui, sans-serif';
  hud.lineWidth = 5; hud.strokeStyle = 'rgba(0,0,0,.7)'; hud.strokeText(aviso, 480, 560);
  hud.fillStyle = game.near ? '#ffe36b' : '#fff'; hud.fillText(aviso, 480, 560);
  hud.restore();
}
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  if (!stopped) {
    input.pollPad(); ui.padNavigate();
    touch.setVisible(!root.querySelector('.screen'));
    // cámara como en Roblox (Elora): no gira sola. Las flechas, WASD y la cruceta mueven al personaje
    // según hacia dónde mira la cámara (arriba = hacia el fondo, abajo = hacia la cámara, izquierda y
    // derecha = a los lados) y el personaje se gira solo. La cámara se gira arrastrando el ratón o con Z y X.
    const base = input.axis();
    if (!root.querySelector('.screen') && !game.paused) {
      if (teclas.has('KeyZ')) renderer.yaw -= GIRO * dt;
      if (teclas.has('KeyX')) renderer.yaw += GIRO * dt;
    }
    camInput.axis = () => {
      if (!base.x && !base.y) return { x: 0, y: 0 };
      const c = Math.cos(renderer.yaw), s = Math.sin(renderer.yaw);
      // adelante = (sin, -cos); derecha = (cos, sin)
      return { x: base.x * c - base.y * s, y: base.x * s + base.y * c };
    };
    game.update(dt, camInput);
    renderer.render(game);
    hud.clearRect(0, 0, 960, 600);
    if (!root.querySelector('.screen')) {
      // Reuse all original labels and meters, in the user's saved language.
      if (game instanceof Lobby) hudLobby();
      else { hud.fillStyle = 'rgba(5,12,17,.55)'; hud.fillRect(0, 0, 960, 135); game.renderHUD(hud); }
      const stress = Math.max(0, (game.player.anxiety / 100 - .5) * 2);
      if (stress) game.renderStress(hud, stress);
      if (game.flash > 0) { hud.fillStyle = `rgba(190,10,20,${game.flash * .7})`; hud.fillRect(0, 0, 960, 600); }
    }
    input.endFrame();
    requestAnimationFrame(frame);
  }
}
requestAnimationFrame(frame);
window.holeway3D = { get game() { return game; }, get renderer() { return renderer; }, input, start, menu, pause, lobby };
