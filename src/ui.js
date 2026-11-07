import { maxHearts } from './config.js';
// Pantallas en HTML por encima del juego: menú, personajes, diálogo, pausa, fin, continuar.

import { t, getLang, setLang } from './i18n.js';
import { CHARACTERS, drawCharacter, SKINS, skinsDe, conSkin } from './characters.js';
import { PAD_ACTIONS } from './input.js';
import { TapePlayer, grabacionDeCinta } from './tapes.js';
import { music } from './music.js';

// ---- nombres de las cintas (Elora): quien juega puede ponerle nombre a cada cinta; se guarda en
// el navegador. Si no le pone ninguno, sale el de siempre ('tape.G.name' en src/i18n.js, o "Cinta").
// Las cintas no van numeradas (Elora).
const TAPE_NAMES_KEY = 'holeway.tapeNames';
function savedTapeNames() { try { return JSON.parse(localStorage.getItem(TAPE_NAMES_KEY) || '{}') || {}; } catch (e) { return {}; } }
function setTapeName(n, name) {
  const all = savedTapeNames();
  const limpio = String(name || '').trim().slice(0, 40);
  if (limpio) all[n] = limpio; else delete all[n];
  try { localStorage.setItem(TAPE_NAMES_KEY, JSON.stringify(all)); } catch (e) { /* sin guardar */ }
}
// (las cintas con la misma grabación se llaman igual: el nombre y el texto van con la grabación, 'tape.G')
function defaultTapeName(n) { const k = 'tape.' + (grabacionDeCinta(n) || n) + '.name'; const v = t(k); return v === k ? t('tapes.item', { n }) : v; }
export function tapeName(n) { return savedTapeNames()[n] || defaultTapeName(n); }

// La huella del código secreto del 3D (Elora): sin mayúsculas, sin acentos y sin signos.
const CODIGO_3D = 'e94801bf';
// La huella del código del pasillo 50 (Elora): te lleva directo al pasillo de Drake (index.html?pasillo=50).
// Este sí mira las mayúsculas (Elora): todo en minúscula menos la P de pasillo.
const CODIGO_P50 = '39138241';
// La huella del código del modo pijama (Elora; también vale escrito con holeway/hallway y pijama/pijamas).
const CODIGO_PIJAMA = new Set(['a9e7a80e', 'f4ae3cc7', 'a35c150d', 'a7f5d55a', 'a64e4d24', '2443bff5', '2a22be4a', '8db173bb', 'db61d337', '9eff940c']);
function huellaCodigo(texto, mayusculas = false) {
  let n = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  n = (mayusculas ? n : n.toLowerCase()).replace(/[^A-Za-z0-9]+/g, ' ').trim();
  let h = 0x811c9dc5;
  for (const c of n) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h.toString(16);
}

export class UI {
  constructor(root, input) {
    this.root = root;
    this.input = input;
    this.keyHandler = null;
    this.navIndex = 0;
    window.addEventListener('keydown', (e) => { if (this.keyHandler) this.keyHandler(e); });
  }

  // ---- manejar las pantallas con el mando: la cruceta mueve la selección, A/Start la activa.
  // Se llama una vez por fotograma desde el bucle principal.
  padNavigate() {
    const input = this.input;
    if (!input) return;
    const items = [...this.root.querySelectorAll('button, .card, .dialog')].filter((el) => !el.closest('[inert]') && !el.disabled);
    if (!items.length) { this.navIndex = 0; return; }
    this.navIndex = Math.min(this.navIndex, items.length - 1);
    const d = input.padDirPressed;
    if (d.x || d.y) {
      const step = (d.y || d.x) > 0 ? 1 : -1;
      this.navIndex = (this.navIndex + step + items.length) % items.length;
    }
    for (let i = 0; i < items.length; i++) items[i].classList.toggle('padfocus', i === this.navIndex);
    if (input.padPressed.has('jump') || input.padPressed.has('interact')) {
      const el = items[this.navIndex];
      if (el) {
        el.click();
        // Nos "comemos" la pulsación: si no, la escena que se acaba de abrir
        // (una cinemática, un diálogo) la recibiría también y se saltaría sola.
        input.clear();
      }
    }
  }

  clear() {
    if (this.tapePlayer) { this.tapePlayer.parar(); this.tapePlayer = null; }
    this.root.innerHTML = ''; this.keyHandler = null; this.padTick = null; this.navIndex = 0;
  }

  el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  button(label, onClick, primary = false) {
    const b = this.el('button', primary ? 'primary' : '', label);
    b.onclick = () => {
      // Al pulsar con Enter o Espacio, la tecla no debe llegar también a la escena nueva.
      if (this.input) this.input.clear();
      onClick();
    };
    return b;
  }

  langRow(onChange) {
    const row = this.el('div', 'lang');
    row.appendChild(this.el('span', '', t('menu.language') + ':'));
    for (const l of ['es', 'en']) {
      const b = this.el('button', getLang() === l ? 'on' : '', l.toUpperCase());
      b.onclick = () => { setLang(l); onChange(); };
      row.appendChild(b);
    }
    return row;
  }

  // ---------------- menú principal
  // El título lo dibuja la escena Title en el canvas (el cartel de Elora);
  // aquí solo van los botones, abajo del todo.
  // pijama: el modo pijama secreto (Elora) = { activo(), cambiar(on) }
  showMenu({ onPlay, onPad, pijama }) {
    this.clear();
    const otraVez = () => this.showMenu({ onPlay, onPad, pijama });
    const s = this.el('div', 'screen titlemenu');
    s.appendChild(this.el('p', 'subtitle', t('menu.subtitle')));
    if (pijama && pijama.activo()) s.appendChild(this.el('p', 'pijama-badge', t('menu.pijama')));
    const row = this.el('div', 'row');
    const play = this.button(t('menu.play'), onPlay, true);
    row.append(play, this.button('🎮 ' + t('menu.pad'), onPad), this.button('🔑 ' + t('code.button'), () => this.showCode(otraVez, pijama)));
    s.appendChild(row);
    s.appendChild(this.langRow(otraVez));
    this.root.appendChild(s);
    const info = this.el('div', 'titleinfo');
    info.appendChild(this.el('div', '', t('menu.controls')));
    info.appendChild(this.el('div', '', t('menu.version')));
    this.root.appendChild(info);
    play.focus();
  }

  // ---------------- código secreto (Elora): con el código bueno se abre Abandoned Holeway en 3D (3d/).
  // Con el del pasillo 50 (Elora), vas directo al pasillo de Drake. Con el del modo pijama (Elora), las skins de pijama salen en la tienda de Tarda, gratis; se queda puesto
  // en este navegador hasta que se quita con el botón de aquí.
  // Los códigos no están escritos aquí (para que sigan siendo secretos): se compara su "huella".
  showCode(onBack, pijama) {
    this.clear();
    const s = this.el('div', 'screen');
    s.appendChild(this.el('h2', '', '🔑 ' + t('code.title')));
    const campo = document.createElement('input');
    campo.type = 'text'; campo.id = 'codigo-secreto'; campo.autocomplete = 'off'; campo.spellcheck = false;
    // que el teclado de la tablet no ponga mayúsculas solo (el código del pasillo 50 las mira)
    campo.setAttribute('autocapitalize', 'none'); campo.setAttribute('autocorrect', 'off');
    campo.placeholder = t('code.placeholder'); campo.className = 'code-input';
    const nota = this.el('p', 'small note-inline', '');
    const probar = () => {
      const huella = huellaCodigo(campo.value);
      if (huella === CODIGO_3D) {
        nota.textContent = t('code.ok');
        setTimeout(() => { location.href = '3d/'; }, 900);
      } else if (huellaCodigo(campo.value, true) === CODIGO_P50) {
        nota.textContent = t('code.p50');
        setTimeout(() => { location.href = location.pathname + '?pasillo=50'; }, 1200);
      } else if (pijama && CODIGO_PIJAMA.has(huella)) {
        pijama.cambiar(true);
        nota.textContent = t('code.pijamaOn');
        setTimeout(onBack, 1800);
      } else {
        nota.textContent = t('code.wrong');
        nota.classList.remove('shake'); void nota.offsetWidth; nota.classList.add('shake');
      }
    };
    campo.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); probar(); } e.stopPropagation(); });
    const row = this.el('div', 'row');
    row.append(this.button(t('code.enter'), probar, true), this.button(t('code.back'), onBack));
    s.append(campo, row);
    if (pijama && pijama.activo()) {
      s.appendChild(this.button(t('code.pijamaOff'), () => { pijama.cambiar(false); this.toast(t('code.pijamaOffDone')); onBack(); }));
    }
    s.appendChild(nota);
    this.root.appendChild(s);
    this.keyHandler = (e) => { if (e.code === 'Escape') onBack(); };
    campo.focus();
  }

  // ---------------- configurar el mando USB
  // input: el objeto Input, para leer los botones que se aprietan y guardar el mapeo.
  showPadSetup({ input, onClose }) {
    this.clear();
    const s = this.el('div', 'screen opaque pad');
    s.appendChild(this.el('h2', '', '🎮 ' + t('pad.title')));
    const status = this.el('p', 'small', '');
    s.appendChild(status);
    s.appendChild(this.el('p', 'small', t('pad.help')));

    const rows = this.el('div', 'padrows');
    let waitingFor = null; // acción que está esperando un botón
    const note = this.el('p', 'small note-inline', '');

    const rowEls = PAD_ACTIONS.map((action) => {
      const row = this.el('div', 'padrow');
      const name = this.el('div', 'padname', t('action.' + action));
      const val = this.el('div', 'padval', '');
      const btn = this.button(t('pad.change'), () => {
        waitingFor = waitingFor === action ? null : action;
        note.textContent = waitingFor ? t('pad.waiting') : '';
        refresh();
      });
      row.append(name, val, btn);
      rows.appendChild(row);
      return { action, row, val, btn };
    });
    s.appendChild(rows);
    s.appendChild(note);

    const bottom = this.el('div', 'row');
    bottom.append(
      this.button(t('pad.close'), onClose, true),
      this.button(t('pad.reset'), () => { input.resetPadMap(); waitingFor = null; note.textContent = ''; refresh(); }),
    );
    s.appendChild(bottom);
    this.root.appendChild(s);

    const refresh = () => {
      const pad = input.getPad();
      status.textContent = pad ? t('pad.connected', { name: (pad.id || '').slice(0, 40) }) : t('pad.none');
      status.style.color = pad ? '#6be07a' : '#ffb3b8';
      for (const r of rowEls) {
        const b = input.padMap[r.action];
        r.val.textContent = b == null ? t('pad.unset') : t('pad.button', { n: b });
        r.row.classList.toggle('waiting', waitingFor === r.action);
        // se ilumina cuando aprietas ese botón, para ver que responde
        r.row.classList.toggle('active', b != null && input.rawDown.has(b));
      }
    };
    refresh();

    // Mientras la pantalla está abierta, miramos el mando en cada fotograma.
    this.padTick = () => {
      if (waitingFor) {
        const b = [...input.rawPressed][0];
        if (b != null) {
          // si ese botón ya era de otra acción, se la quitamos
          const prev = PAD_ACTIONS.find((a) => a !== waitingFor && input.padMap[a] === b);
          if (prev) { input.setPadButton(prev, null); note.textContent = t('pad.taken', { name: t('action.' + prev) }); }
          else note.textContent = '';
          input.setPadButton(waitingFor, b);
          waitingFor = null;
        }
      }
      refresh();
    };

    this.keyHandler = (e) => {
      if (e.code === 'Escape') { if (waitingFor) { waitingFor = null; note.textContent = ''; refresh(); } else onClose(); }
    };
  }

  // ---------------- tienda de Tarda: elegir personaje o comprarlo con monedas (se abre encima del lobby)
  // Arriba, todos los personajes en fila; abajo, la ficha del que está señalado: la ficha de Elora
  // (su foto) con los parámetros escritos en el lado derecho, que ella dejó en blanco para eso.
  // secretos: los personajes que aún no salen en la tienda (Drake, hasta escapar del pasillo 50: Elora)
  // skins (modo pijama, Elora): { elegida(id), elegir(ch, skin) } o nada si el modo pijama no está puesto
  showShop({ unlocked, coins, current, focusId, onChoose, onBuy, onClose, secretos, skins }) {
    const LISTA = CHARACTERS.filter((c) => !(c.secreto && !unlocked.has(c.id) && secretos && secretos.has(c.id)));
    this.clear();
    const s = this.el('div', 'screen dim shop');
    const head = this.el('div', 'shop-head');
    head.append(this.el('h2', '', t('shop.title')), this.el('p', 'coins', '🪙 ' + t('select.coins', { n: coins })));
    s.appendChild(head);

    const roster = this.el('div', 'roster');
    const ficha = this.el('div', 'ficha');
    const actions = this.el('div', 'row');
    const note = this.el('p', 'small note-inline', '');
    let focus = Math.max(0, LISTA.findIndex((c) => c.id === (focusId || current.id)));

    const activate = (ch) => {
      if (unlocked.has(ch.id)) { onChoose(ch); return; }
      if (ch.price == null) { note.textContent = t('shop.specialNote'); return; }   // Drake: no se compra con monedas
      if (coins >= ch.price) { onBuy(ch); }
      else { note.textContent = t('select.notEnough', { n: ch.price - coins }); note.classList.add('shake'); setTimeout(() => note.classList.remove('shake'), 400); }
    };

    const cardEls = LISTA.map((ch, i) => {
      const locked = !unlocked.has(ch.id);
      const c = this.el('div', 'card mini' + (locked ? ' locked' : '') + (ch.id === current.id ? ' current' : ''));
      const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
      const cx = cv.getContext('2d'); cx.translate(32, 40); cx.scale(1.5, 1.5);
      drawCharacter(cx, skins ? conSkin(ch, skins.elegida(ch.id)) : ch, 0, 0, 'down', 0, 0, false);
      c.appendChild(cv);
      c.appendChild(this.el('div', 'name', (locked ? '🔒 ' : '') + ch.name));
      // ratón: pasar por encima enseña la ficha (solo con ratón de verdad: en el móvil, tocar
      // también "pasa por encima" y elegiría o compraría al primer toque).
      // Tocar/clic: la primera vez enseña la ficha, la segunda elige.
      c.onpointerenter = (e) => { if (e.pointerType === 'mouse') { focus = i; refresh(); } };
      c.onclick = () => { if (focus === i) activate(ch); else { focus = i; refresh(); } };
      roster.appendChild(c);
      return c;
    });

    const refresh = () => {
      const ch = LISTA[focus];
      cardEls.forEach((c, i) => c.classList.toggle('focus', i === focus));
      note.textContent = '';
      this.fillFicha(ficha, ch);
      this.fillSkins(panelSkins, ch, skins, () => {
        // al cambiar de skin, se redibuja su cartita de arriba
        const cv = cardEls[focus].querySelector('canvas'), cx = cv.getContext('2d');
        cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cv.width, cv.height);
        cx.translate(32, 40); cx.scale(1.5, 1.5);
        drawCharacter(cx, conSkin(ch, skins.elegida(ch.id)), 0, 0, 'down', 0, 0, false);
        refresh();
      });
      actions.innerHTML = '';
      const locked = !unlocked.has(ch.id);
      let label;
      if (ch.id === current.id) label = t('shop.current');
      else if (!locked) label = t('select.choose');
      else if (ch.price == null) label = '🔒 ' + t('shop.special');
      else label = '🔒 ' + t('shop.buy', { n: ch.price });
      const main = this.button(label, () => activate(ch), true);
      if (ch.id === current.id) main.disabled = true;
      actions.append(main, this.button(t('shop.close'), onClose));
    };

    // la ficha y, a su derecha, las skins del personaje (solo en el modo pijama)
    const medio = this.el('div', 'shop-medio');
    const panelSkins = this.el('div', 'skins-panel');
    medio.append(ficha, panelSkins);
    s.append(roster, medio, actions, note);
    this.root.appendChild(s);
    refresh();
    this.keyHandler = (e) => {
      if (e.code === 'ArrowRight') { focus = (focus + 1) % LISTA.length; refresh(); }
      else if (e.code === 'ArrowLeft') { focus = (focus + LISTA.length - 1) % LISTA.length; refresh(); }
      else if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); activate(LISTA[focus]); }
      else if (e.code === 'Escape') onClose();
    };
  }

  // Las skins de un personaje en la tienda (modo pijama, Elora): una cartita por skin con el personaje
  // vestido así; la que lleva puesta, marcada. En el modo pijama son gratis.
  fillSkins(box, ch, skins, onChange) {
    box.innerHTML = '';
    const lista = skins ? skinsDe(ch.id) : [];
    box.classList.toggle('hidden', !lista.length);
    if (!lista.length) return;
    box.appendChild(this.el('div', 'skins-titulo', t('skins.title')));
    const puesta = skins.elegida(ch.id) || null;
    for (const skin of [null, ...lista]) {
      const c = this.el('div', 'card skin' + (skin === puesta ? ' current' : ''));
      const cv = document.createElement('canvas'); cv.width = 80; cv.height = 80;
      const cx = cv.getContext('2d'); cx.translate(40, 52); cx.scale(2, 2);
      drawCharacter(cx, conSkin(ch, skin), 0, 0, 'down', 0, 0, false);
      c.appendChild(cv);
      const nombre = skin ? SKINS[skin].emoji + ' ' + t('skins.' + skin) : '👕 ' + t('skins.normal');
      c.appendChild(this.el('div', 'name', nombre));
      c.appendChild(this.el('div', 'skin-precio', skin === puesta ? t('skins.puesta') : skin ? t('skins.free') : ''));
      if (skin && SKINS[skin].personajes[ch.id].provisional) c.title = t('skins.prueba');
      c.onclick = () => { if (skin !== puesta) { skins.elegir(ch, skin); onChange(); } };
      box.appendChild(c);
    }
  }

  // Rellena la ficha de un personaje: la foto de Elora si la hay, o una ficha de papel con su dibujo.
  // En el lado derecho van sus parámetros (Velocidad, Cordura, Sigilo, de 0 a 100) y su habilidad.
  fillFicha(box, ch) {
    box.innerHTML = '';
    if (ch.ficha) {
      const img = this.el('img', 'ficha-foto');
      img.src = ch.ficha; img.alt = ch.name;
      box.appendChild(img);
    } else {
      box.appendChild(this.paperFicha(ch));
    }
    const side = this.el('div', 'ficha-datos');
    // el cuadro que dejó Elora en su ficha (en % de la ficha); si no hay, el de style.css
    if (ch.fichaCuadro) for (const k of ['left', 'top', 'right', 'bottom']) side.style[k] = ch.fichaCuadro[k] + '%';
    // la especie y los corazones que tiene (Elora)
    const esp = this.el('div', 'ficha-especie', ch.species[getLang()] || ch.species.es);
    esp.appendChild(this.el('span', 'ficha-corazones', ' ' + '❤'.repeat(maxHearts(ch))));
    esp.title = t('stat.hearts', { n: maxHearts(ch) });
    side.appendChild(esp);
    for (const [stat, key] of [['velocidad', 'stat.speed'], ['cordura', 'stat.sanity'], ['sigilo', 'stat.stealth'], ['resistencia', 'stat.endurance']]) {
      const v = ch.stats ? ch.stats[stat] : 50;
      const row = this.el('div', 'ficha-stat');
      const bar = this.el('div', 'ficha-barra ' + stat);
      const fill = this.el('div', 'ficha-relleno'); fill.style.width = v + '%';
      bar.appendChild(fill);
      row.append(this.el('span', 'ficha-nombre', t(key)), bar, this.el('span', 'ficha-num', String(v)));
      side.appendChild(row);
    }
    const hab = this.el('div', 'ficha-habilidad');
    hab.append(this.el('b', '', t('stat.ability') + ': '),
      document.createTextNode(ch.ability ? t('select.ability.' + ch.ability) : t('stat.abilityPending')));
    side.appendChild(hab);
    box.appendChild(side);
  }

  // Ficha de papel para los personajes que aún no tienen la suya dibujada por Elora:
  // el mismo formato que las suyas (dibujo a la izquierda, raya, nombre arriba a la derecha).
  paperFicha(ch) {
    const cv = document.createElement('canvas');
    cv.className = 'ficha-foto';
    cv.width = 700; cv.height = 500;
    const x = cv.getContext('2d');
    x.fillStyle = '#f1eee7'; x.fillRect(0, 0, 700, 500);
    x.strokeStyle = '#5a5a5a'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(405, 0); x.lineTo(395, 500); x.stroke();
    x.beginPath(); x.moveTo(0, 445); x.quadraticCurveTo(200, 420, 395, 440); x.stroke();
    x.save(); x.translate(200, 330); x.scale(7, 7);
    drawCharacter(x, ch, 0, 0, 'down', 0, 0, false);
    x.restore();
    x.fillStyle = '#3a3a3a'; x.font = 'bold 56px "Comic Sans MS", "Chalkboard SE", "Segoe Print", "Segoe UI", sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(ch.name.toUpperCase(), 550, 70);
    return cv;
  }

  // ---------------- ver una grabación directamente (index.html?cinta=N, ver-cinta.bat): un botón grande para
  // empezar (los navegadores no dejan sonar nada hasta que se pulsa algo) y, al volver, onExit().
  showTapeDirect(n, onExit) {
    this.clear();
    const s = this.el('div', 'screen opaque');
    s.appendChild(this.el('h2', '', '📼 ' + t('tapes.title')));
    s.appendChild(this.button(t('tapes.play'), () => this.playTape(n, null, onExit), true));
    this.root.appendChild(s);
    this.keyHandler = (e) => { if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); this.playTape(n, null, onExit); } };
  }

  // ---------------- la tele: ver la grabación de una cinta (src/tapes.js). Al volver, otra vez la estantería
  // (o onExit(), si se vino directamente).
  playTape(n, back, onExit) {
    this.clear();
    music.stop();
    const s = this.el('div', 'screen tv');
    const cv = document.createElement('canvas'); cv.width = 960; cv.height = 600; cv.className = 'tv-canvas';
    const row = this.el('div', 'row');
    const player = new TapePlayer(cv, n, () => { again.classList.remove('hidden'); });
    const salir = () => { player.parar(); this.tapePlayer = null; if (onExit) { onExit(); return; } music.play('lobby'); this.showTapes(back); };
    const again = this.button(t('tapes.again'), () => { player.parar(); this.playTape(n, back, onExit); });
    again.classList.add('hidden');
    row.append(again, this.button(t('tapes.back'), salir, true));
    s.append(cv, row);
    this.root.appendChild(s);
    this.tapePlayer = player;
    this.keyHandler = (e) => { if (e.code === 'Escape' || e.code === 'KeyE') salir(); };
  }

  // ---------------- la caja de cintas del lobby: las cintas que has depositado en la tienda de Tarda
  // (Elora). Aquí se ven, se les pone nombre y se pueden recuperar (vuelven al inventario).
  // opts: { caja: [números de cinta], onRecover(n), onClose }
  showTapes(opts) {
    const { caja, onRecover, onClose } = opts;
    this.clear();
    const s = this.el('div', 'screen dim');
    s.appendChild(this.el('h2', '', t('tapes.boxTitle')));
    s.appendChild(this.el('p', '', caja.length ? t('tapes.boxCount', { n: caja.length }) : t('tapes.boxEmpty')));
    if (caja.length) {
      const list = this.el('div', 'tapes');
      for (const i of caja) {
        const row = this.el('div', 'tape');
        // el nombre de la cinta: el que le ponga quien juega (Elora) o, si no, el de siempre
        const nombre = this.el('div', 'tape-name', '📼 ' + tapeName(i));
        row.appendChild(nombre);
        const grab = grabacionDeCinta(i);
        const key = 'tape.' + (grab || i);
        const text = t(key);
        row.appendChild(this.el('div', 'tape-text', text === key ? t('tapes.placeholder') : text));
        // si la cinta ya tiene grabación, se puede ver en la tele (src/tapes.js)
        const botones = this.el('div', 'tape-buttons');
        if (grab) botones.appendChild(this.button(t('tapes.play'), () => this.playTape(grab, opts)));
        botones.appendChild(this.button(t('tapes.rename'), () => {
          // se cambia el nombre ahí mismo: Enter guarda, Esc deja el que tenía; vacío = el de siempre
          const campo = document.createElement('input');
          campo.className = 'tape-input'; campo.maxLength = 40;
          campo.value = savedTapeNames()[i] || ''; campo.placeholder = defaultTapeName(i);
          const guardar = () => { setTapeName(i, campo.value); this.showTapes(opts); };
          campo.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Enter') guardar();
            else if (e.key === 'Escape') this.showTapes(opts);
          });
          campo.addEventListener('blur', guardar);
          nombre.replaceChildren('📼 ', campo);
          campo.focus();
        }));
        // recuperarla: vuelve al inventario (Elora)
        botones.appendChild(this.button(t('tapes.recover'), () => { onRecover(i); }));
        row.appendChild(botones);
        list.appendChild(row);
      }
      s.appendChild(list);
    }
    s.appendChild(this.button(t('shop.close'), onClose, true));
    this.root.appendChild(s);
    // (si se está escribiendo el nombre de una cinta, las teclas son para escribir, no para cerrar)
    this.keyHandler = (e) => { if (e.target && e.target.tagName === 'INPUT') return; if (e.code === 'Escape' || e.code === 'KeyE') onClose(); };
  }

  // ---------------- la tienda de Tarda (dibujo de Elora): "Depositar cintas" y "Cambiar personaje"
  // Se ve el dibujo entero; las dos franjas de la izquierda son los botones.
  showTarda({ onDeposit, onCharacters, onClose }) {
    this.clear();
    const s = this.el('div', 'screen dim tienda');
    const hoja = this.el('div', 'tienda-hoja');
    const img = this.el('img', 'tienda-dibujo'); img.src = 'assets/sprites/tienda/tienda.webp'; img.alt = "Tarda's shop";
    hoja.appendChild(img);
    // las franjas del dibujo (en % del dibujo; están torcidas, como las dibujó Elora)
    const op1 = this.button(t('shop.deposit'), onDeposit);
    op1.className = 'tienda-op'; op1.style.clipPath = 'polygon(0 0, 54.5% 0, 54.5% 10.6%, 0 25.8%)';
    const op2 = this.button(t('shop.characters'), onCharacters);
    op2.className = 'tienda-op'; op2.style.clipPath = 'polygon(0 26.4%, 54.5% 11.2%, 54.5% 25%, 0 44.6%)';
    hoja.append(op1, op2);
    hoja.appendChild(this.el('div', 'tienda-ayuda', t('shop.pick')));
    s.append(hoja, this.button(t('shop.close'), onClose));
    this.root.appendChild(s);
    op1.focus();
    this.keyHandler = (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowRight') { e.preventDefault(); op2.focus(); }
      else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') { e.preventDefault(); op1.focus(); }
      else if (e.code === 'Escape' || e.code === 'KeyE') onClose();
    };
  }

  // ---------------- depositar cintas (Elora): salen todas las del inventario en orden; se marcan las
  // que quieras y el botón "Depositar" pregunta antes de dejarlas en la caja.
  showDeposit({ inventario, onDeposit, onBack }) {
    this.clear();
    const s = this.el('div', 'screen dim');
    s.appendChild(this.el('h2', '', t('deposit.title')));
    const marcadas = new Set();
    const boton = this.button('', () => preguntar(), true);
    const pintarBoton = () => { boton.textContent = t('deposit.button', { n: marcadas.size }); boton.disabled = marcadas.size === 0; };
    if (!inventario.length) {
      s.appendChild(this.el('p', '', t('deposit.empty')));
    } else {
      s.appendChild(this.el('p', '', t('deposit.help')));
      const list = this.el('div', 'tapes');
      for (const i of inventario) {
        const fila = this.el('button', 'tape tape-pick');
        fila.setAttribute('aria-pressed', 'false');
        const marca = this.el('span', 'tape-check', '');
        fila.append(marca, this.el('span', 'tape-name', '📼 ' + tapeName(i)));
        fila.onclick = () => {
          if (marcadas.has(i)) marcadas.delete(i); else marcadas.add(i);
          const on = marcadas.has(i);
          fila.classList.toggle('on', on); fila.setAttribute('aria-pressed', String(on));
          marca.textContent = on ? '✓' : '';
          pintarBoton();
        };
        list.appendChild(fila);
      }
      s.appendChild(list);
    }
    const fila = this.el('div', 'row');
    if (inventario.length) fila.appendChild(boton);
    fila.appendChild(this.button(t('tapes.back'), onBack));
    s.appendChild(fila);
    pintarBoton();
    // el aviso: ¿seguro/segura? (en la caja se pueden recuperar)
    const preguntar = () => {
      if (!marcadas.size) return;
      const capa = this.el('div', 'aviso-fondo');
      const caja = this.el('div', 'aviso');
      caja.appendChild(this.el('p', 'aviso-texto', t('deposit.confirm')));
      caja.appendChild(this.el('p', 'aviso-nota', t('deposit.confirmNote')));
      const si = this.button(t('deposit.yes'), () => onDeposit([...marcadas].sort((a, b) => a - b)), true);
      const no = this.button(t('deposit.no'), () => { capa.remove(); this.keyHandler = teclas; boton.focus(); });
      const r = this.el('div', 'row'); r.append(si, no);
      caja.appendChild(r); capa.appendChild(caja); this.root.appendChild(capa);
      // mientras está el aviso, el mando solo ve sus dos botones
      s.inert = true;
      const quitarInert = () => { s.inert = false; };
      no.addEventListener('click', quitarInert);
      si.focus();
      this.navIndex = 0;
      this.keyHandler = (e) => { if (e.code === 'Escape') no.click(); };
    };
    this.root.appendChild(s);
    const teclas = (e) => { if (e.code === 'Escape') onBack(); };
    this.keyHandler = teclas;
  }

  // ---------------- cinemática (solo botón de saltar y nota)
  showIntro({ onSkip }) {
    this.clear();
    const corner = this.el('div', 'corner');
    corner.appendChild(this.button(t('intro.skip'), onSkip));
    this.root.appendChild(corner);
    this.root.appendChild(this.el('div', 'note', t('intro.note')));
  }

  // ---------------- diálogo (Tarda explicando)
  showDialogue(lines, onDone) {
    this.clear();
    let i = 0;
    const box = this.el('div', 'dialog');
    const who = this.el('div', 'who', t('dialog.guide'));
    const text = this.el('div', 'text', lines[0]);
    const next = this.el('div', 'next', t('dialog.next'));
    box.append(who, text, next);
    const advance = () => {
      i++;
      if (i >= lines.length) { this.clear(); onDone(); }
      else text.textContent = lines[i];
    };
    box.onclick = advance;
    this.root.appendChild(box);
    this.keyHandler = (e) => { if (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyE') { e.preventDefault(); advance(); } };
  }

  // ---------------- pausa
  showPause({ onResume, onMenu, menuLabel }) {
    this.clear();
    const s = this.el('div', 'screen dim');
    s.appendChild(this.el('h2', '', t('pause.title')));
    const r = this.button(t('pause.resume'), onResume, true);
    s.appendChild(r);
    s.appendChild(this.button(t(menuLabel || 'pause.menu'), onMenu));
    this.root.appendChild(s);
    r.focus();
    this.keyHandler = (e) => { if (e.code === 'Escape' || e.code === 'KeyP') onResume(); };
  }

  // ---------------- fin de partida
  showGameOver({ reason, level, tapes, coins, onRetry, onMenu }) {
    this.clear();
    const s = this.el('div', 'screen opaque');
    s.appendChild(this.el('h1', '', t('over.title')));
    s.appendChild(this.el('p', '', t(reason === 'anxiety' ? 'over.anxiety' : 'over.hearts')));
    s.appendChild(this.el('p', 'small', t('over.stats', { n: level, tapes, coins })));
    const row = this.el('div', 'row');
    const r = this.button(t('over.retry'), onRetry, true);
    row.append(r, this.button(t('over.menu'), onMenu));
    s.appendChild(row);
    this.root.appendChild(s);
    r.focus();
  }

  // ---------------- ¿continuar o salir?
  showContinue({ level, tapes, coins, onContinue, onExit }) {
    this.clear();
    const s = this.el('div', 'screen opaque');
    s.appendChild(this.el('h2', '', t('cont.title', { n: level })));
    s.appendChild(this.el('p', '', t('cont.text', { tapes, coins })));
    const row = this.el('div', 'row');
    const c = this.button(t('cont.yes'), onContinue, true);
    row.append(c, this.button(t('cont.no'), onExit));
    s.appendChild(row);
    this.root.appendChild(s);
    c.focus();
  }

  // Aviso breve entre niveles (nuevo personaje) sin pantalla completa.
  toast(text, ms = 3500) {
    const n = this.el('div', 'dialog toast', text);
    n.style.pointerEvents = 'none';
    this.root.appendChild(n);
    setTimeout(() => n.remove(), ms);
  }
}
