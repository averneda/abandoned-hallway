// Pantallas en HTML por encima del juego: menú, personajes, diálogo, pausa, fin, continuar.

import { t, getLang, setLang } from './i18n.js';
import { CHARACTERS, drawCharacter } from './characters.js';
import { PAD_ACTIONS } from './input.js';

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
    const items = [...this.root.querySelectorAll('button, .card, .dialog')];
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

  clear() { this.root.innerHTML = ''; this.keyHandler = null; this.padTick = null; this.navIndex = 0; }

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
  showMenu({ onPlay, onPad }) {
    this.clear();
    const s = this.el('div', 'screen titlemenu');
    s.appendChild(this.el('p', 'subtitle', t('menu.subtitle')));
    const row = this.el('div', 'row');
    const play = this.button(t('menu.play'), onPlay, true);
    row.append(play, this.button('🎮 ' + t('menu.pad'), onPad));
    s.appendChild(row);
    s.appendChild(this.langRow(() => this.showMenu({ onPlay, onPad })));
    this.root.appendChild(s);
    const info = this.el('div', 'titleinfo');
    info.appendChild(this.el('div', '', t('menu.controls')));
    info.appendChild(this.el('div', '', t('menu.version')));
    this.root.appendChild(info);
    play.focus();
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
  showShop({ unlocked, coins, current, focusId, onChoose, onBuy, onClose }) {
    this.clear();
    const s = this.el('div', 'screen dim shop');
    const head = this.el('div', 'shop-head');
    head.append(this.el('h2', '', t('shop.title')), this.el('p', 'coins', '🪙 ' + t('select.coins', { n: coins })));
    s.appendChild(head);

    const roster = this.el('div', 'roster');
    const ficha = this.el('div', 'ficha');
    const actions = this.el('div', 'row');
    const note = this.el('p', 'small note-inline', '');
    let focus = Math.max(0, CHARACTERS.findIndex((c) => c.id === (focusId || current.id)));

    const activate = (ch) => {
      if (unlocked.has(ch.id)) { onChoose(ch); return; }
      if (coins >= ch.price) { onBuy(ch); }
      else { note.textContent = t('select.notEnough', { n: ch.price - coins }); note.classList.add('shake'); setTimeout(() => note.classList.remove('shake'), 400); }
    };

    const cardEls = CHARACTERS.map((ch, i) => {
      const locked = !unlocked.has(ch.id);
      const c = this.el('div', 'card mini' + (locked ? ' locked' : '') + (ch.id === current.id ? ' current' : ''));
      const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
      const cx = cv.getContext('2d'); cx.translate(32, 40); cx.scale(1.5, 1.5);
      drawCharacter(cx, ch, 0, 0, 'down', 0, 0, false);
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
      const ch = CHARACTERS[focus];
      cardEls.forEach((c, i) => c.classList.toggle('focus', i === focus));
      note.textContent = '';
      this.fillFicha(ficha, ch);
      actions.innerHTML = '';
      const locked = !unlocked.has(ch.id);
      let label;
      if (ch.id === current.id) label = t('shop.current');
      else if (!locked) label = t('select.choose');
      else label = '🔒 ' + t('shop.buy', { n: ch.price });
      const main = this.button(label, () => activate(ch), true);
      if (ch.id === current.id) main.disabled = true;
      actions.append(main, this.button(t('shop.close'), onClose));
    };

    s.append(roster, ficha, actions, note);
    this.root.appendChild(s);
    refresh();
    this.keyHandler = (e) => {
      if (e.code === 'ArrowRight') { focus = (focus + 1) % CHARACTERS.length; refresh(); }
      else if (e.code === 'ArrowLeft') { focus = (focus + CHARACTERS.length - 1) % CHARACTERS.length; refresh(); }
      else if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); activate(CHARACTERS[focus]); }
      else if (e.code === 'Escape') onClose();
    };
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
    side.appendChild(this.el('div', 'ficha-especie', ch.species[getLang()] || ch.species.es));
    for (const [stat, key] of [['velocidad', 'stat.speed'], ['cordura', 'stat.sanity'], ['sigilo', 'stat.stealth']]) {
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

  // ---------------- estantería: las cintas que has conseguido
  showTapes({ total, onClose }) {
    this.clear();
    const s = this.el('div', 'screen dim');
    s.appendChild(this.el('h2', '', t('tapes.title')));
    s.appendChild(this.el('p', '', total ? t('tapes.count', { n: total }) : t('tapes.none')));
    if (total) {
      const list = this.el('div', 'tapes');
      for (let i = 1; i <= total; i++) {
        const row = this.el('div', 'tape');
        row.appendChild(this.el('div', 'tape-name', '📼 ' + t('tapes.item', { n: i })));
        const key = 'tape.' + i;
        const text = t(key);
        row.appendChild(this.el('div', 'tape-text', text === key ? t('tapes.placeholder') : text));
        list.appendChild(row);
      }
      s.appendChild(list);
    }
    s.appendChild(this.button(t('shop.close'), onClose, true));
    this.root.appendChild(s);
    this.keyHandler = (e) => { if (e.code === 'Escape' || e.code === 'Enter' || e.code === 'KeyE') onClose(); };
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
