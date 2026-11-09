import { maxHearts, horaSkins, ahoraJuego, skinsListas, NAVIDAD, ADVIENTO, fechaNavidad, ARBOL } from './config.js';
// Pantallas en HTML por encima del juego: menú, personajes, diálogo, pausa, fin, continuar.

import { t, getLang, setLang } from './i18n.js';
import { CHARACTERS, drawCharacter, SKINS, skinsDe, conSkin, characterById, TARDA_GRIS } from './characters.js';
import { PAD_ACTIONS } from './input.js';
import { TapePlayer, grabacionDeCinta } from './tapes.js';
import { music } from './music.js';
import { casillas, estadoCasilla, textoDia, hoyJuego } from './adviento.js';
import { cancionLobby } from './lobby.js';
import { ADORNOS, SECCIONES, PUNTAS, adorno, drawAdorno, drawPunta, drawArbolCompleto, puedeIr, esGrande, puntosNuevos, TAM_ADORNO, MACETAS_ORDEN, drawMaceta } from './adornos.js';

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

// La huella del código secreto del 3D (Elora; código nuevo de noviembre de 2026, el de antes se olvidó).
// Mira las mayúsculas, como lo escribió Elora (solo la D de 3D en mayúscula).
const CODIGO_3D = 'a2a89abb';
// La huella del código del pasillo 50 (Elora): te lleva directo al pasillo de Drake (index.html?pasillo=50).
// Este sí mira las mayúsculas (Elora): todo en minúscula menos la P de pasillo.
const CODIGO_P50 = '39138241';
// La huella del código del modo Navidad (Elora): el lobby de Navidad (árbol y calendario) y el reno gratis.
// Mira las mayúsculas, como lo escribió Elora.
const CODIGO_NAVIDAD = 'e3b0eab2';
// La huella del código del modo online (Elora): abre la pantalla «JUEGO ONLINE». Mira las mayúsculas.
const CODIGO_ONLINE = '2dcf3ed7';
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
    // con el mando, lo elegido se enseña aunque esté más abajo (por ejemplo, en la columna de skins)
    if ((d.x || d.y) && items[this.navIndex] && items[this.navIndex].scrollIntoView) items[this.navIndex].scrollIntoView({ block: 'nearest' });
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
    if (this.reloj) { clearInterval(this.reloj); this.reloj = null; }
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
  showMenu({ onPlay, onPad, pijama, navidad }) {
    this.clear();
    const otraVez = () => this.showMenu({ onPlay, onPad, pijama, navidad });
    const s = this.el('div', 'screen titlemenu');
    s.appendChild(this.el('p', 'subtitle', t('menu.subtitle')));
    if (pijama && pijama.activo()) s.appendChild(this.el('p', 'pijama-badge', t('menu.pijama')));
    if (navidad && navidad.activo()) s.appendChild(this.el('p', 'pijama-badge navidad-badge', t('menu.navidad')));
    const row = this.el('div', 'row');
    const play = this.button(t('menu.play'), onPlay, true);
    row.append(play, this.button('🎮 ' + t('menu.pad'), onPad), this.button('🔑 ' + t('code.button'), () => this.showCode(otraVez, pijama, navidad)));
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
  showCode(onBack, pijama, navidad) {
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
      if (huellaCodigo(campo.value, true) === CODIGO_3D) {
        nota.textContent = t('code.ok');
        setTimeout(() => { location.href = '3d/'; }, 900);
      } else if (huellaCodigo(campo.value, true) === CODIGO_P50) {
        nota.textContent = t('code.p50');
        setTimeout(() => { location.href = location.pathname + '?pasillo=50'; }, 1200);
      } else if (huellaCodigo(campo.value, true) === CODIGO_ONLINE) {
        nota.textContent = t('code.onlineOk');
        setTimeout(() => this.showOnline(onBack), 900);
      } else if (navidad && CODIGO_NAVIDAD && huellaCodigo(campo.value, true) === CODIGO_NAVIDAD) {
        navidad.cambiar(true);
        nota.textContent = t('code.navidadOn');
        setTimeout(onBack, 1800);
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
    if (navidad && navidad.activo()) {
      s.appendChild(this.button(t('code.navidadOff'), () => { navidad.cambiar(false); this.toast(t('code.navidadOffDone')); onBack(); }));
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
  // vestido así; la que lleva puesta, marcada. En el modo pijama son gratis, y las de Navidad, con el modo Navidad.
  fillSkins(box, ch, skins, onChange) {
    box.innerHTML = '';
    const lista = skins ? skinsDe(ch.id).filter((k) => skins.disponible(k) && skins.puede(ch.id, k)) : [];
    box.classList.toggle('hidden', !lista.length);
    box.classList.toggle('muchas', lista.length >= 2);   // con tres cartitas o más, más pequeñitas para que quepan
    if (!lista.length) return;
    box.appendChild(this.el('div', 'skins-titulo', t('skins.title')));
    const puesta = skins.elegida(ch.id) || null;
    // desde que salen las skins (Elora: martes 10, 16:00) se compran con monedas; en el modo pijama, gratis.
    // Para no comprar sin querer: el primer toque pregunta «¿Comprar?» y el segundo compra.
    const tiene = (skin) => !skin || skins.tiene(ch.id, skin);
    for (const skin of [null, ...lista]) {
      const c = this.el('div', 'card skin' + (skin === puesta ? ' current' : ''));
      const cv = document.createElement('canvas'); cv.width = 80; cv.height = 80;
      const cx = cv.getContext('2d'); cx.translate(40, 52); cx.scale(2, 2);
      drawCharacter(cx, conSkin(ch, skin), 0, 0, 'down', 0, 0, false);
      c.appendChild(cv);
      const nombre = skin ? SKINS[skin].emoji + ' ' + t('skins.' + skin) : '👕 ' + t('skins.normal');
      c.appendChild(this.el('div', 'name', nombre));
      // el mini comentario de esa skin para este personaje (Elora: los de la fiesta de pijamas)
      const kFrase = skin ? 'skins.frase.' + skin + '.' + ch.id : null, frase = kFrase ? t(kFrase) : '';
      if (frase && frase !== kFrase) c.appendChild(this.el('div', 'skin-frase', '💬 ' + frase));
      const precio = skin ? SKINS[skin].personajes[ch.id].price : 0;
      const etiqueta = skin === puesta ? t('skins.puesta') : !skin ? '' : skins.gratis(skin) ? t('skins.free') : tiene(skin) ? '' : t('skins.precio', { n: precio });
      const pie = this.el('div', 'skin-precio', etiqueta);
      c.appendChild(pie);
      if (skin && SKINS[skin].personajes[ch.id].provisional) c.title = t('skins.prueba');
      c.onclick = () => {
        if (skin === puesta) return;
        if (tiene(skin)) { skins.elegir(ch, skin); onChange(); return; }
        if (skins.monedas() < precio) { pie.textContent = t('skins.faltan', { n: precio - skins.monedas() }); return; }
        if (c.dataset.preguntado) { skins.comprar(ch, skin, precio); return; }
        c.dataset.preguntado = '1'; pie.textContent = t('skins.comprar', { n: precio });
      };
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
    const salir = () => { player.parar(); this.tapePlayer = null; if (onExit) { onExit(); return; } music.play(cancionLobby()); this.showTapes(back); };
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
  showTarda({ onDeposit, onCharacters, onPuntas, onClose }) {
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
    s.appendChild(hoja);
    // en Navidad, Tarda vende las cosas para la punta del árbol (Elora)
    const ops = [op1, op2];
    if (onPuntas) { const op3 = this.button(t('shop.puntas'), onPuntas); op3.className = 'tienda-puntas'; s.appendChild(op3); ops.push(op3); }
    s.appendChild(this.button(t('shop.close'), onClose));
    this.root.appendChild(s);
    op1.focus();
    const paso = (k) => { const i = ops.indexOf(document.activeElement); ops[(i + k + ops.length) % ops.length].focus(); };
    this.keyHandler = (e) => {
      if (e.code === 'ArrowDown' || e.code === 'ArrowRight') { e.preventDefault(); paso(1); }
      else if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') { e.preventDefault(); paso(-1); }
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
  // ---------------- la pantalla «JUEGO ONLINE» (dibujo de Elora, assets/referencias/online/juego-online.webp):
  // a la izquierda, Tarda contenta detrás de una mesa con manchas de sangre y walkie-talkies y una radio encima;
  // a la derecha, Crear sala, Unirse a una sala y Amigos (que abre Ver amigos e Invitar amigos). Se abre con el
  // código del modo online. Todavía no conecta con nada: el modo online está por hacer [PENDIENTE].
  showOnline(onBack, amigos = false) {
    this.clear();
    const s = this.el('div', 'screen opaque online');
    s.appendChild(this.el('h2', 'online-titulo', t('online.title')));
    const cuerpo = this.el('div', 'online-cuerpo');
    const cv = document.createElement('canvas'); cv.width = 360; cv.height = 300; cv.className = 'online-dibujo';
    this.dibujarOnline(cv.getContext('2d'));
    const botones = this.el('div', 'online-botones');
    const nota = this.el('p', 'small note-inline online-nota', '');
    const pronto = () => { nota.textContent = '📻 ' + t('online.pronto'); nota.classList.remove('shake'); void nota.offsetWidth; nota.classList.add('shake'); };
    if (!amigos) {
      botones.append(
        this.button('🏠 ' + t('online.crear'), pronto, true),
        this.button('🚪 ' + t('online.unirse'), pronto, true),
        this.button('👫 ' + t('online.amigos'), () => this.showOnline(onBack, true), true));
    } else {
      botones.append(this.el('p', 'online-sub', '👫 ' + t('online.amigos')),
        this.button('👀 ' + t('online.verAmigos'), pronto, true),
        this.button('💌 ' + t('online.invitar'), pronto, true));
    }
    botones.appendChild(nota);
    cuerpo.append(cv, botones);
    s.append(cuerpo, this.el('p', 'small online-seguro', '🔒 ' + t('online.seguro')),
      this.button(t('code.back'), amigos ? () => this.showOnline(onBack) : onBack));
    this.root.appendChild(s);
    this.keyHandler = (e) => { if (e.code === 'Escape') (amigos ? this.showOnline(onBack) : onBack()); };
  }

  // Tarda detrás de la mesa con los walkie-talkies y la radio (como en el dibujo de Elora)
  dibujarOnline(x) {
    x.clearRect(0, 0, 360, 300);
    // Tarda, contenta, detrás de la mesa
    x.save(); x.translate(130, 150); x.scale(3.2, 3.2);
    drawCharacter(x, { ...characterById('tarda'), ...TARDA_GRIS }, 0, 0, 'down', 0, 0, false, { alta: true });
    x.restore();
    // la mesa, con manchas de sangre
    x.fillStyle = '#9a9aa3'; x.fillRect(20, 170, 320, 22);
    x.fillStyle = '#7d7d86'; x.fillRect(20, 192, 320, 8);
    x.fillRect(40, 200, 22, 95); x.fillRect(298, 200, 22, 95);
    x.fillStyle = '#9b1c26';
    for (const [mx, my, rx] of [[70, 180, 14], [190, 184, 10], [290, 178, 12], [50, 240, 6], [309, 260, 6]]) { x.beginPath(); x.ellipse(mx, my, rx, rx * 0.35, 0.2, 0, Math.PI * 2); x.fill(); }
    // los walkie-talkies y la radio encima de la mesa
    const walkie = (wx, c) => {
      x.fillStyle = '#3a3a42'; x.fillRect(wx, 138, 22, 34);
      x.strokeStyle = '#3a3a42'; x.lineWidth = 3; x.beginPath(); x.moveTo(wx + 16, 138); x.lineTo(wx + 18, 120); x.stroke();
      x.fillStyle = '#25252b'; x.beginPath(); x.arc(wx + 18, 119, 3, 0, Math.PI * 2); x.fill();
      x.fillStyle = c; x.fillRect(wx + 4, 143, 14, 8);
      x.fillStyle = '#5a5a64'; for (let k = 0; k < 3; k++) x.fillRect(wx + 4, 156 + k * 4, 14, 2);
    };
    walkie(215, '#f2d24a'); walkie(250, '#5fbf5a');
    x.fillStyle = '#4a4a54'; x.fillRect(282, 146, 52, 26);
    x.fillStyle = '#2b2b31'; x.beginPath(); x.arc(320, 159, 9, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#d42a36'; for (let k = 0; k < 6; k++) { x.beginPath(); x.arc(290 + (k % 3) * 7, 152 + Math.floor(k / 3) * 9, 2.2, 0, Math.PI * 2); x.fill(); }
    x.strokeStyle = '#4a4a54'; x.lineWidth = 2; x.beginPath(); x.moveTo(330, 146); x.quadraticCurveTo(342, 130, 330, 118); x.stroke();
  }

  // ---------------- el calendario de Adviento (Elora): las 5 casillas grandes (21 a 25) y las 5 chiquitas
  // (26 a 30). Se abre la de hoy; las que se te pasaron se recuperan por 1.000 monedas (Elora).
  // estado: { abiertas: [fechas] }; onAbrir(cual, fecha?) abre la de hoy (o recupera esa fecha) y devuelve el
  // texto de lo que te dan; monedas(): las que tienes.
  // El cartel de las skins, de cerca (Elora: "que se pueda interactuar con el cartel y que te diga lo que va a
  // pasar más de cerca y con más información"): una ventana de madera con el reloj que cuenta (días, horas,
  // minutos y segundos), la información de las skins de pijama y los personajes en sombra (siluetas, como quería
  // Elora: es una sorpresa; los secretos, Drake y Chop, no salen).
  // Desde que salen (Elora): «¡Ya ha llegado el día de la fiesta de pijamas! ¡A pasarlo bien!» y las siluetas se destapan.
  showCartel({ onClose }) {
    this.clear();
    const fiesta = skinsListas();
    const fondo = this.el('div', 'screen dim cartel-fondo');
    const s = this.el('div', 'cartel-grande' + (fiesta ? ' fiesta' : ''));
    // las letras grandes, decoradas con cosas de dormir: estrellas, una luna y zetas (Elora)
    const titulo = this.el('div', 'cartel-titulo-sueno');
    titulo.appendChild(this.el('h2', 'cartel-titulo', t(fiesta ? 'cartel.fiesta' : 'cartel.titulo')));
    for (const [cls, txt] of [['luna', '☾'], ['e1', '★'], ['e2', '✦'], ['e3', '★'], ['e4', '✦'], ['e5', '★'], ['zz', 'z Z']]) {
      const d = this.el('span', 'sueno ' + cls, txt); d.setAttribute('aria-hidden', 'true'); titulo.appendChild(d);
    }
    s.appendChild(titulo);
    s.appendChild(this.el('p', 'cartel-cuando', t(fiesta ? 'cartel.pasarlo' : 'cartel.cuando')));
    const reloj = this.el('div', 'cartel-reloj');
    if (!fiesta) s.appendChild(reloj);
    const pintarReloj = () => {
      if (fiesta) return;
      const seg = Math.max(0, Math.ceil((horaSkins() - ahoraJuego()) / 1000));
      reloj.innerHTML = '';
      if (seg <= 0) { this.showCartel({ onClose }); return; }   // ¡las 16:00! la fiesta empieza con la ventana abierta
      reloj.appendChild(this.el('span', 'cartel-faltan', t('cartel.faltan')));
      const d = Math.floor(seg / 86400), h = Math.floor(seg % 86400 / 3600), m = Math.floor(seg % 3600 / 60), sg = seg % 60;
      for (const [k, n] of [['d', d], ['h', h], ['m', m], ['s', sg]]) {
        if (k === 'd' && !d) continue;
        reloj.appendChild(this.el('span', 'cartel-num', t('cartel.' + k, { n })));
      }
    };
    pintarReloj();
    this.reloj = setInterval(pintarReloj, 250);
    const sombras = this.el('div', 'cartel-sombras');
    for (const ch of CHARACTERS) {
      if (ch.secreto || !SKINS.pijama.personajes[ch.id]) continue;
      const cv = document.createElement('canvas'); cv.width = 56; cv.height = 64;
      const cx = cv.getContext('2d'); cx.translate(28, 44); cx.scale(1.4, 1.4);
      drawCharacter(cx, conSkin(ch, 'pijama'), 0, 0, 'down', 0, 0, false);
      if (!fiesta) {
        cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalCompositeOperation = 'source-in';
        cx.fillStyle = '#2a1a10'; cx.fillRect(0, 0, 56, 64);   // en sombra: no se ve cómo es el pijama
        cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#ffe36b'; cx.font = 'bold 18px "Segoe UI", Arial';
        cx.textAlign = 'center'; cx.fillText('?', 28, 30);
      }
      sombras.appendChild(cv);
    }
    s.appendChild(sombras);
    s.appendChild(this.el('p', 'cartel-sorpresa', t(fiesta ? 'cartel.desvelado' : 'cartel.sorpresa')));
    const lista = this.el('ul', 'cartel-info');
    for (const k of ['info1', 'info2', 'info3', 'info4']) lista.appendChild(this.el('li', '', t('cartel.' + k)));
    s.appendChild(lista);
    // para cerrar, una ✕ en la esquina (lo pidió el padre de Elora) en vez del botón «Cerrar»
    const equis = this.button('✕', () => { this.clear(); onClose(); }, true);
    equis.className = 'cartel-x'; equis.setAttribute('aria-label', t('shop.close')); equis.title = t('shop.close');
    s.appendChild(equis);
    fondo.appendChild(s);
    this.root.appendChild(fondo);
    this.keyHandler = (e) => { if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); this.clear(); onClose(); } };
  }

  // El cartel de «¡La Navidad se acerca!», de cerca (Elora: "lo mismo con el cartel de Navidad"): el reloj hasta
  // el primer día del evento (NAVIDAD.desde), lo que va a haber (árbol, calendario, música nueva y pasillos nuevos con nieve: Elora) y
  // la silueta del personaje nuevo de Navidad. El 21 (el cartel sigue ese día): «¡Ya ha llegado la Navidad!»
  // destapaChop: si ese día la silueta de Chop se destapa (lo decide Elora)
  showCartelNavidad({ onClose, destapaChop }) {
    this.clear();
    const empieza = fechaNavidad('desde');   // la de este año
    const fiesta = ahoraJuego() >= empieza;
    const fondo = this.el('div', 'screen dim cartel-fondo');
    const s = this.el('div', 'cartel-grande navidad' + (fiesta ? ' fiesta' : ''));
    s.appendChild(this.el('h2', 'cartel-titulo', t(fiesta ? 'nav.fiesta' : 'nav.titulo')));
    s.appendChild(this.el('p', 'cartel-cuando', fiesta ? t('nav.feliz') : t('nav.cuando', { d: fechaNavidad('desde').getDate(), h: fechaNavidad('hasta').getDate() })));
    const reloj = this.el('div', 'cartel-reloj');
    if (!fiesta) s.appendChild(reloj);
    const pintarReloj = () => {
      if (fiesta) return;
      const seg = Math.max(0, Math.ceil((empieza - ahoraJuego()) / 1000));
      if (seg <= 0) { this.showCartelNavidad({ onClose, destapaChop }); return; }
      reloj.innerHTML = '';
      reloj.appendChild(this.el('span', 'cartel-faltan', t('nav.faltan')));
      const dd = Math.floor(seg / 86400), h = Math.floor(seg % 86400 / 3600), mi = Math.floor(seg % 3600 / 60), sg = seg % 60;
      for (const [k, n] of [['d', dd], ['h', h], ['m', mi], ['s', sg]]) {
        if (k === 'd' && !dd) continue;
        reloj.appendChild(this.el('span', 'cartel-num', t('cartel.' + k, { n })));
      }
    };
    pintarReloj();
    this.reloj = setInterval(pintarReloj, 250);
    // la silueta del personaje nuevo (Chop): en sombra con una «?»; destapado el 21 si Elora lo quiere
    const destapado = fiesta && destapaChop;
    const caja = this.el('div', 'cartel-sombras');
    const cv = document.createElement('canvas'); cv.width = 90; cv.height = 110;
    const cx = cv.getContext('2d'); cx.translate(45, 78); cx.scale(2.4, 2.4);
    drawCharacter(cx, characterById('reno'), 0, 0, 'down', 0, 0, false);
    if (!destapado) {
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalCompositeOperation = 'source-in';
      cx.fillStyle = '#10301c'; cx.fillRect(0, 0, 90, 110);
      cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#ffe36b'; cx.font = 'bold 30px "Segoe UI", Arial';
      cx.textAlign = 'center'; cx.fillText('?', 45, 62);
    }
    caja.appendChild(cv);
    s.appendChild(caja);
    const lista = this.el('ul', 'cartel-info');
    for (const k of ['info1', 'info2', 'info3', 'info4']) lista.appendChild(this.el('li', '', t('nav.' + k)));
    lista.appendChild(this.el('li', '', t(destapado ? 'nav.chop' : 'nav.quien')));
    s.appendChild(lista);
    // para cerrar, una ✕ en la esquina (lo pidió el padre de Elora) en vez del botón «Cerrar»
    const equis = this.button('✕', () => { this.clear(); onClose(); }, true);
    equis.className = 'cartel-x'; equis.setAttribute('aria-label', t('shop.close')); equis.title = t('shop.close');
    s.appendChild(equis);
    fondo.appendChild(s);
    this.root.appendChild(fondo);
    this.keyHandler = (e) => { if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); this.clear(); onClose(); } };
  }

  // tieneChop: el grande se llama «Calendario secreto» hasta que tienes a Chop; luego, «Calendario de Chop» (Elora)
  showAdviento({ estado, onAbrir, onClose, monedas, precio, tieneChop }) {
    const otraVez = (texto) => {
      this.showAdviento({ estado, onAbrir, onClose, monedas, precio, tieneChop });
      if (texto) { const n = this.root.querySelector('.adv-nota'); if (n) n.textContent = texto; }
    };
    this.clear();
    const s = this.el('div', 'screen dim adviento');
    s.appendChild(this.el('h2', '', '🎁 ' + t('adv.title')));
    const nota = this.el('p', 'small note-inline adv-nota', '');
    const bloque = (cual, titulo, final) => {
      const b = this.el('div', 'adv-bloque ' + cual);
      const todas = casillas(cual), conf = ADVIENTO[cual];
      b.appendChild(this.el('p', 'adv-titulo', t(titulo, { d: todas[0].dia, h: todas[todas.length - 1].dia, n: conf.monedasCadaDia })));
      // el grande va en páginas de 7 casillas (Elora): se abre en la página de hoy y se pasa con las flechitas
      const porPagina = conf.porPagina || todas.length, paginas = Math.ceil(todas.length / porPagina);
      if (this.advPagina == null) {
        const hoy = textoDia(hoyJuego()), k = todas.findIndex((c) => c.fecha >= hoy);   // la página de hoy
        this.advPagina = Math.floor((k >= 0 ? k : todas.length - 1) / porPagina);
      }
      const pagina = cual === 'grande' ? Math.min(this.advPagina, paginas - 1) : 0;
      const fila = this.el('div', 'adv-fila');
      todas.slice(pagina * porPagina, (pagina + 1) * porPagina).forEach((c, j) => {
        const i = pagina * porPagina + j;
        const est = estadoCasilla(c.fecha, estado.abiertas);
        const btn = this.el('button', 'adv-casilla ' + est + ' c' + (i % 5));
        btn.appendChild(this.el('span', 'adv-num', String(c.dia)));
        btn.appendChild(this.el('span', 'adv-est', { abierta: '✓', hoy: '🎁', perdida: '✗', cerrada: '🔒' }[est]));
        btn.title = t('adv.' + est);
        if (est !== 'hoy' && est !== 'perdida') btn.disabled = true;
        btn.onclick = () => {
          if (this.input) this.input.clear();
          if (est === 'hoy') { otraVez(onAbrir(cual)); return; }
          // un día que se te pasó: se recupera por 1.000 monedas, después de preguntar (Elora)
          nota.textContent = '';
          pregunta.innerHTML = '';
          if (monedas() < precio) { nota.textContent = t('adv.faltan', { dia: c.dia, n: precio - monedas() }); return; }
          pregunta.appendChild(this.el('span', '', t('adv.recuperar', { dia: c.dia, n: precio.toLocaleString(getLang() === 'en' ? 'en-US' : 'de-DE') })));
          pregunta.appendChild(this.button(t('adv.si'), () => otraVez(onAbrir(cual, c.fecha)), true));
          pregunta.appendChild(this.button(t('adv.no'), () => { pregunta.innerHTML = ''; }));
        };
        fila.appendChild(btn);
      });
      if (paginas > 1) {
        const flecha = (txt, d) => {
          const f = this.button(txt, () => { this.advPagina = pagina + d; otraVez(); });
          f.classList.add('adv-flecha'); f.disabled = pagina + d < 0 || pagina + d >= paginas;
          return f;
        };
        const nav = this.el('div', 'adv-paginas');
        nav.append(flecha('◀', -1), this.el('span', 'adv-pagina', t('adv.pagina', { n: pagina + 1, t: paginas })), flecha('▶', 1));
        b.append(fila, nav);
      } else b.appendChild(fila);
      b.appendChild(this.el('p', 'adv-final', t(final, { n: todas.length })));
      return b;
    };
    const pregunta = this.el('div', 'adv-pregunta');
    s.append(bloque('grande', tieneChop && tieneChop() ? 'adv.grandeChop' : 'adv.grande', 'adv.grandeFinal'), bloque('chico', 'adv.chico', 'adv.chicoFinal'), pregunta, nota);
    s.appendChild(this.el('p', 'small adv-ayuda', t('adv.ayuda', { n: precio.toLocaleString(getLang() === 'en' ? 'en-US' : 'de-DE') })));
    s.appendChild(this.button(t('adv.cerrar'), () => { this.advPagina = null; onClose(); }));
    this.root.appendChild(s);
    this.keyHandler = (e) => { if (e.code === 'Escape' || e.code === 'KeyE') { this.advPagina = null; onClose(); } };
  }

  toast(text, ms = 3500) {
    const n = this.el('div', 'dialog toast', text);
    n.style.pointerEvents = 'none';
    this.root.appendChild(n);
    setTimeout(() => n.remove(), ms);
  }

  // ---------------- el minijuego del árbol de Navidad (idea del padre de Elora; lo pensó Elora)
  // Sale el árbol en grande con el inventario de adornos a la izquierda (Elora). Eliges un adorno y tocas el
  // árbol para ponerlo; un adorno puesto se arrastra para moverlo; si lo quitas, se pierde. Las luces van aparte:
  // solo unas a la vez. Al poner algo en la punta, los adornos nuevos se cobran (1 punto = 1 moneda).
  // Con el mando o el teclado: se elige en el inventario con la cruceta y A; en el árbol, la cruceta mueve
  // la mano, A pone o coge y B vuelve al inventario.
  //   arbol: { adornos: [{id, x, y, pagado}], luces: {id, pagado} | null, punta }   (se cambia aquí mismo)
  //   inventario: { id: cuántos }   (se cambia aquí mismo)   puntas: Set con las de la punta que tienes
  //   onGuardar(): guardar   onTerminar(punta): pone la punta y devuelve las monedas ganadas
  showArbol({ arbol, inventario, puntas, macetas, onGuardar, onTerminar, onClose }) {
    this.clear();
    // Elora: al volver al árbol se quita la punta y se puede seguir decorando
    if (arbol.punta) { arbol.punta = null; onGuardar(); }
    const s = this.el('div', 'screen dim arbolj');
    const caja = this.el('div', 'arbolj-caja');
    const inv = this.el('div', 'arbolj-inv');
    const der = this.el('div', 'arbolj-der');
    const info = this.el('div', 'arbolj-info');
    const W = 380, H = 470, S = 5.4, BX = W / 2, BY = H - 50;   // abajo queda sitio para las cosas grandes
    const cv = document.createElement('canvas'); cv.width = W * 2; cv.height = H * 2; cv.className = 'arbolj-lienzo';
    const ctx = cv.getContext('2d');
    const ayuda = this.el('div', 'arbolj-ayuda', t('arbol.ayuda'));
    const botones = this.el('div', 'arbolj-botones');
    const cerrar = this.el('button', 'arbolj-x', '✕'); cerrar.setAttribute('aria-label', t('shop.close'));
    cerrar.onclick = () => { this.input && this.input.clear(); onClose(); };

    let sel = null;            // el adorno del inventario que vas a poner
    let elegido = null;        // el adorno puesto que has tocado (para quitarlo)
    let cogido = null;         // el adorno puesto que estás moviendo (con el ratón, el dedo, el mando o el teclado)
    let modoArbol = false;     // con el mando o el teclado: moviendo la mano por el árbol
    const mano = { x: 0, y: -30 };
    let raton = null;          // por dónde va el ratón (para enseñar el adorno antes de ponerlo)
    const avisar = (txt) => { ayuda.textContent = txt; };

    const tam = (id) => TAM_ADORNO(id);
    const tocado = (x, y) => {
      for (let i = arbol.adornos.length - 1; i >= 0; i--) {
        const a = arbol.adornos[i];
        if (Math.hypot(a.x - x, a.y - y) < tam(a.id) / 2 + 0.6) return i;
      }
      return -1;
    };
    const quitarPunta = () => { if (arbol.punta) arbol.punta = null; };
    const poner = (x, y) => {
      if (!sel || !inventario[sel]) return;
      if (!puedeIr(sel, x, y)) { avisar(t(esGrande(sel) ? 'arbol.fueraGrande' : 'arbol.fuera')); return; }
      inventario[sel] -= 1;
      if (inventario[sel] <= 0) delete inventario[sel];
      arbol.adornos.push({ id: sel, x, y, pagado: false });
      elegido = arbol.adornos.length - 1;
      quitarPunta();
      if (!inventario[sel]) sel = null;
      onGuardar(); pintarInventario(); pintarBotones();
      avisar(t('arbol.puesto'));
    };
    const mover = (i, x, y) => { if (puedeIr(arbol.adornos[i].id, x, y)) { arbol.adornos[i].x = x; arbol.adornos[i].y = y; } };

    // ---- el inventario (a la izquierda, Elora)
    const pintarInventario = () => {
      inv.innerHTML = '';
      inv.appendChild(this.el('div', 'arbolj-titulo', t('arbol.inventario')));
      const hay = Object.keys(inventario).some((id) => inventario[id] > 0 && adorno(id));
      if (!hay) inv.appendChild(this.el('p', 'arbolj-vacio', t('arbol.vacio')));
      for (const sec of SECCIONES) {
        const lista = ADORNOS.filter((a) => a.sec === sec && inventario[a.id] > 0);
        if (!lista.length) continue;
        const bloque = this.el('div', 'arbolj-sec');
        bloque.appendChild(this.el('div', 'arbolj-sec-tit', t('arbol.sec.' + sec)));
        const rejilla = this.el('div', 'arbolj-rejilla');
        for (const a of lista) {
          const b = this.el('button', 'arbolj-item' + (sel === a.id ? ' on' : ''));
          b.title = t('adorno.' + a.id);
          const c = document.createElement('canvas'); c.width = 80; c.height = 80;
          drawAdorno(c.getContext('2d'), a.id, 40, a.pj ? 46 : 40, a.pj ? 70 : 56, 1);
          b.append(c, this.el('span', 'arbolj-cuantos', '×' + inventario[a.id]));
          b.onclick = () => {
            if (a.sec === 'luces') return ponerLuces(a.id, b);
            sel = sel === a.id ? null : a.id;
            if (sel) { modoArbol = !!(this.input && this.input.padConnected); avisar(t(a.sec === 'grandes' ? 'arbol.elegidoGrande' : 'arbol.elegido', { name: t('adorno.' + a.id) })); }
            pintarInventario();
          };
          rejilla.appendChild(b);
        }
        bloque.appendChild(rejilla);
        inv.appendChild(bloque);
      }
      // lo de la punta: la que tengas termina el árbol (Elora)
      const bloque = this.el('div', 'arbolj-sec');
      bloque.appendChild(this.el('div', 'arbolj-sec-tit', t('arbol.sec.punta')));
      const rejilla = this.el('div', 'arbolj-rejilla');
      for (const id of PUNTAS) {
        const tiene = puntas.has(id);
        const b = this.el('button', 'arbolj-item punta' + (tiene ? '' : ' bloqueada'));
        b.title = t('punta.' + id) + (tiene ? '' : ' · ' + t('arbol.bloqueada'));
        const c = document.createElement('canvas'); c.width = 80; c.height = 80;
        drawPunta(c.getContext('2d'), id, 40, 40, 52, 1);
        b.append(c, this.el('span', 'arbolj-cuantos', tiene ? t('punta.' + id) : '🔒'));
        b.onclick = () => {
          if (!tiene) { avisar(t('arbol.bloqueadaAyuda', { name: t('punta.' + id) })); return; }
          const n = onTerminar(id);
          sel = null; elegido = null; modoArbol = false;
          avisar(n ? t('arbol.terminado', { n }) : t('arbol.terminadoCero'));
          if (n) this.toast('🎄 ' + t('arbol.terminado', { n }));
          pintarInventario(); pintarBotones();
        };
        rejilla.appendChild(b);
      }
      bloque.appendChild(rejilla);
      inv.appendChild(bloque);
      // el color de la maceta (Elora): los que tienes; los demás, en la tienda de Tarda
      const bm = this.el('div', 'arbolj-sec');
      bm.appendChild(this.el('div', 'arbolj-sec-tit', t('arbol.sec.maceta')));
      const rm = this.el('div', 'arbolj-rejilla');
      for (const id of MACETAS_ORDEN.filter((m) => macetas.has(m))) {
        const b = this.el('button', 'arbolj-item maceta' + ((arbol.maceta || 'marron') === id ? ' on' : ''));
        b.title = t('maceta.' + id);
        const c = document.createElement('canvas'); c.width = 80; c.height = 80;
        const cx = c.getContext('2d'); cx.translate(40, 64); cx.scale(3, 3); drawMaceta(cx, id);
        const nueva = !(arbol.macetasCobradas || []).includes(id);   // aún da sus 3 puntos (Elora)
        b.append(c, this.el('span', 'arbolj-cuantos', nueva ? '+' + ARBOL.puntosMaceta + ' pt' : t('maceta.' + id)));
        b.onclick = () => { arbol.maceta = id; quitarPunta(); onGuardar(); pintarInventario(); };
        rm.appendChild(b);
      }
      bm.appendChild(rm);
      if (macetas.size < MACETAS_ORDEN.length) bm.appendChild(this.el('div', 'arbolj-nota', t('arbol.macetasTienda')));
      inv.appendChild(bm);
      pintarInfo();
    };
    const ponerLuces = (id, b) => {
      if (arbol.luces && !b.dataset.preguntado) { b.dataset.preguntado = '1'; avisar(t('arbol.lucesCambiar')); return; }
      inventario[id] -= 1;
      if (inventario[id] <= 0) delete inventario[id];
      arbol.luces = { id, pagado: false };   // las de antes se pierden (Elora)
      quitarPunta();
      onGuardar(); pintarInventario(); pintarBotones();
      avisar(t('arbol.lucesPuestas'));
    };
    const pintarInfo = () => { const n = puntosNuevos(arbol, ARBOL.puntosMaceta); info.textContent = t('arbol.nuevos', { n, m: n * ARBOL.monedasPorPunto }); };

    // ---- los botones de debajo del árbol
    const pintarBotones = () => {
      botones.innerHTML = '';
      const quitar = this.el('button', 'arbolj-boton', t('arbol.quitar'));
      quitar.disabled = elegido == null || !arbol.adornos[elegido];
      quitar.onclick = () => {
        if (!quitar.dataset.preguntado) { quitar.dataset.preguntado = '1'; quitar.textContent = t('arbol.quitarSeguro'); return; }
        arbol.adornos.splice(elegido, 1);   // se pierde (Elora)
        elegido = null; quitarPunta(); onGuardar(); pintarBotones(); pintarInfo();
      };
      const borrar = this.el('button', 'arbolj-boton', t('arbol.borrar'));
      borrar.disabled = !arbol.adornos.length && !arbol.luces;
      borrar.onclick = () => {
        if (!borrar.dataset.preguntado) { borrar.dataset.preguntado = '1'; borrar.textContent = t('arbol.borrarSeguro'); return; }
        arbol.adornos = []; arbol.luces = null; arbol.punta = null;   // todo se pierde (Elora)
        elegido = null; onGuardar(); pintarBotones(); pintarInfo();
      };
      const moverB = this.el('button', 'arbolj-boton', t('arbol.mover'));
      moverB.disabled = !arbol.adornos.length;
      moverB.onclick = () => { sel = null; modoArbol = true; avisar(t('arbol.ayudaMando')); pintarInventario(); };
      botones.append(quitar, borrar, moverB);
    };

    // ---- el ratón y el dedo
    const aArbol = (e) => {
      const r = cv.getBoundingClientRect();
      const px = (e.clientX - r.left) * W / r.width, py = (e.clientY - r.top) * H / r.height;
      return { x: (px - BX) / S, y: (py - BY) / S };
    };
    cv.addEventListener('pointerdown', (e) => {
      const p = aArbol(e);
      const i = tocado(p.x, p.y);
      if (i >= 0) { elegido = i; cogido = i; try { cv.setPointerCapture(e.pointerId); } catch (er) { /* nada */ } pintarBotones(); }
      else if (sel) poner(p.x, p.y);
      else { elegido = null; pintarBotones(); }
    });
    cv.addEventListener('pointermove', (e) => { raton = aArbol(e); if (cogido != null) mover(cogido, raton.x, raton.y); });
    cv.addEventListener('pointerup', () => { if (cogido != null) { cogido = null; quitarPunta(); onGuardar(); } });
    cv.addEventListener('pointerleave', () => { raton = null; });

    // ---- el mando y el teclado en el árbol
    const accion = () => {
      if (cogido != null) { cogido = null; quitarPunta(); onGuardar(); avisar(t('arbol.ayudaMando')); return; }
      const i = tocado(mano.x, mano.y);
      if (i >= 0) { elegido = i; cogido = i; pintarBotones(); avisar(t('arbol.moviendo')); return; }
      if (sel) poner(mano.x, mano.y);
    };
    const salirArbol = () => { if (cogido != null) { cogido = null; onGuardar(); } modoArbol = false; avisar(t('arbol.ayuda')); };
    const moverMano = (dx, dy) => {
      mano.x = Math.max(-28, Math.min(28, mano.x + dx));
      mano.y = Math.max(-66, Math.min(1, mano.y + dy));
      if (cogido != null) mover(cogido, mano.x, mano.y);
    };
    this.keyHandler = (e) => {
      const d = { ArrowLeft: [-1.5, 0], ArrowRight: [1.5, 0], ArrowUp: [0, -1.5], ArrowDown: [0, 1.5] }[e.code];
      if (d && sel && !modoArbol) modoArbol = true;   // con el teclado: elegiste un adorno y mueves la mano
      if (modoArbol) {
        if (d) { e.preventDefault(); moverMano(d[0], d[1]); return; }
        if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); accion(); return; }
        if (e.code === 'Escape' || e.code === 'KeyE') { e.preventDefault(); salirArbol(); return; }
      }
      if (e.code === 'Escape' || e.code === 'KeyE') onClose();
    };
    this.padTick = () => {
      const input = this.input;
      if (!modoArbol) { this.padNavigate(); return; }
      for (const el of this.root.querySelectorAll('.padfocus')) el.classList.remove('padfocus');
      if (input.padDir.x || input.padDir.y) moverMano(input.padDir.x * 0.7, input.padDir.y * 0.7);
      if (input.padPressed.has('jump') || input.padPressed.has('interact')) { accion(); input.clear(); }
      else if (input.padPressed.has('run') || input.padPressed.has('pause')) { salirArbol(); input.clear(); }
    };

    // ---- dibujar el árbol (sin parar, para que las luces se enciendan y se apaguen)
    const t0 = performance.now();
    const pintar = () => {
      if (!cv.isConnected) return;
      const tt = (performance.now() - t0) / 1000;
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#1d1830'); g.addColorStop(1, '#3a2c3f');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // copitos de nieve cayendo
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (let k = 0; k < 26; k++) {
        const x = (k * 97 + Math.sin(tt * 0.6 + k) * 12) % W, y = (k * 53 + tt * (12 + (k % 5) * 4)) % H;
        ctx.beginPath(); ctx.arc(x, y, 1 + (k % 3) * 0.6, 0, Math.PI * 2); ctx.fill();
      }
      drawArbolCompleto(ctx, BX, BY, S, arbol, tt);
      ctx.save(); ctx.translate(BX, BY); ctx.scale(S, S);
      // el adorno tocado, con un círculo
      if (elegido != null && arbol.adornos[elegido]) {
        const a = arbol.adornos[elegido];
        ctx.strokeStyle = '#6be07a'; ctx.lineWidth = 0.5; ctx.setLineDash([1.2, 0.8]);
        ctx.beginPath(); ctx.arc(a.x, a.y, tam(a.id) / 2 + 1, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      }
      // el adorno que vas a poner, medio transparente donde está el ratón o la mano
      const donde = modoArbol ? mano : raton;
      if (sel && donde) {
        ctx.globalAlpha = puedeIr(sel, donde.x, donde.y) ? 0.6 : 0.25;
        drawAdorno(ctx, sel, donde.x, donde.y, tam(sel), tt);
        ctx.globalAlpha = 1;
      }
      // la mano del mando
      if (modoArbol) {
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.arc(mano.x, mano.y, 2.2, 0, Math.PI * 2); ctx.moveTo(mano.x - 3.6, mano.y); ctx.lineTo(mano.x + 3.6, mano.y);
        ctx.moveTo(mano.x, mano.y - 3.6); ctx.lineTo(mano.x, mano.y + 3.6); ctx.stroke();
      }
      ctx.restore();
      pintarInfo();
      requestAnimationFrame(pintar);
    };

    der.append(info, cv, botones, ayuda);
    caja.append(inv, der);
    s.append(caja, cerrar);
    this.root.appendChild(s);
    pintarInventario(); pintarBotones();
    requestAnimationFrame(pintar);
  }

  // ---------------- la tienda de Tarda: las cosas para la punta del árbol (Elora: 50 monedas cada una,
  // para siempre; la estrella es gratis)
  showPuntas({ tienes, macetas, monedas, precio, precioMaceta, onComprar, onBack }) {
    this.clear();
    const s = this.el('div', 'screen dim arbol-tienda');
    s.appendChild(this.el('h2', '', t('puntas.title')));
    s.appendChild(this.el('p', 'small', t('puntas.help', { n: precio })));
    const lista = this.el('div', 'arbol-tienda-lista');
    // tipo: 'punta' o 'maceta'. Para no comprar sin querer, el primer toque pregunta y el segundo compra.
    const tarjeta = (tipo, id, tiene, coste, dibujar) => {
      const c = this.el('div', 'card mini' + (tiene ? ' current' : ''));
      const cv = document.createElement('canvas'); cv.width = 96; cv.height = 96;
      dibujar(cv.getContext('2d'));
      c.appendChild(cv);
      c.appendChild(this.el('div', 'name', t(tipo + '.' + id)));
      const pie = this.el('div', 'skin-precio', tiene ? t('puntas.tuya') : t('puntas.precio', { n: coste }));
      c.appendChild(pie);
      c.onclick = () => {
        if (tiene) return;
        if (monedas() < coste) { pie.textContent = t('puntas.faltan', { n: coste - monedas() }); return; }
        if (c.dataset.preguntado) { onComprar(tipo, id); return; }
        c.dataset.preguntado = '1'; pie.textContent = t('puntas.comprar', { n: coste });
      };
      return c;
    };
    lista.appendChild(this.el('div', 'arbolj-sec-tit', t('arbol.sec.punta')));
    const fila = this.el('div', 'cards puntas-fila');
    for (const id of PUNTAS) fila.appendChild(tarjeta('punta', id, tienes.has(id), precio, (cx) => drawPunta(cx, id, 48, 48, 64, 1)));
    lista.appendChild(fila);
    lista.appendChild(this.el('div', 'arbolj-sec-tit', t('arbol.sec.maceta')));
    const fila2 = this.el('div', 'cards puntas-fila');
    for (const id of MACETAS_ORDEN) fila2.appendChild(tarjeta('maceta', id, macetas.has(id), precioMaceta, (cx) => { cx.translate(48, 78); cx.scale(3.6, 3.6); drawMaceta(cx, id); }));
    lista.appendChild(fila2);
    s.append(lista, this.button(t('puntas.back'), onBack));
    this.root.appendChild(s);
    this.keyHandler = (e) => { if (e.code === 'Escape' || e.code === 'KeyE') onBack(); };
  }
}
