// Controles táctiles para jugar desde el móvil o la tablet: una cruceta virtual
// a la izquierda y botones estilo NES a la derecha (B correr, A saltar,
// START coger, SELECT habilidad). Solo aparecen en pantallas táctiles.
// Meten sus pulsaciones en Input (touchDown / touchPressed / touchDir).

import { t } from './i18n.js';

const DEAD = 14;      // píxeles que hay que mover el dedo para que cuente como dirección
const DIAG = 0.45;    // cuánto tiene que dominar un eje para no ser diagonal

export class TouchControls {
  constructor(input) {
    this.input = input;
    this.enabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || matchMedia('(pointer: coarse)').matches;
    if (!this.enabled) return;
    this.visible = true;
    this.build();
  }

  build() {
    const root = document.createElement('div');
    root.id = 'touch';
    this.root = root;

    // ---- cruceta virtual: se apoya el dedo y se arrastra hacia donde quieras ir
    const pad = document.createElement('div');
    pad.className = 'tpad';
    const stick = document.createElement('div');
    stick.className = 'tstick';
    pad.appendChild(stick);
    root.appendChild(pad);

    let padPointer = null;
    let padCenter = null;
    const movePad = (e) => {
      const dx = e.clientX - padCenter.x, dy = e.clientY - padCenter.y;
      const d = Math.hypot(dx, dy);
      let x = 0, y = 0;
      if (d > DEAD) {
        if (Math.abs(dx) > Math.abs(dy) * DIAG) x = Math.sign(dx);
        if (Math.abs(dy) > Math.abs(dx) * DIAG) y = Math.sign(dy);
      }
      this.input.touchDir = { x, y };
      const k = Math.min(1, d / 55);
      stick.style.transform = d > 2 ? `translate(${dx / d * 34 * k}px, ${dy / d * 34 * k}px)` : '';
    };
    pad.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      padPointer = e.pointerId;
      const r = pad.getBoundingClientRect();
      padCenter = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      movePad(e);
      try { pad.setPointerCapture(e.pointerId); } catch (err) { /* algunos navegadores no dejan */ }
    });
    pad.addEventListener('pointermove', (e) => { if (e.pointerId === padPointer) movePad(e); });
    const endPad = (e) => {
      if (e.pointerId !== padPointer) return;
      padPointer = null;
      this.input.touchDir = { x: 0, y: 0 };
      stick.style.transform = '';
    };
    pad.addEventListener('pointerup', endPad);
    pad.addEventListener('pointercancel', endPad);

    // ---- botones: mismos nombres que el mando de NES
    const button = (cls, label, action) => {
      const b = document.createElement('div');
      b.className = 'tbtn ' + cls;
      b.textContent = label;
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        b.classList.add('on');
        this.input.touchDown.add(action);
        this.input.touchPressed.add(action);
        try { b.setPointerCapture(e.pointerId); } catch (err) { /* algunos navegadores no dejan */ }
      });
      const up = () => { b.classList.remove('on'); this.input.touchDown.delete(action); };
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
      root.appendChild(b);
      return b;
    };
    button('ta', 'A', 'jump');
    button('tb', 'B', 'run');
    button('tstart tpill', 'START', 'interact');
    button('tselect tpill', 'SELECT', 'ability');
    button('tpause', '❚❚', 'pause');

    // aviso para girar el móvil (solo sale en vertical, por CSS)
    const hint = document.createElement('div');
    hint.id = 'rotate-hint';
    hint.textContent = '📱↻ ' + t('touch.rotate');
    document.body.appendChild(hint);
    this.hint = hint;

    document.body.appendChild(root);
  }

  // Se esconden cuando hay un menú o un diálogo abierto (se juega tocando la pantalla del menú).
  setVisible(v) {
    if (!this.enabled || this.visible === v) return;
    this.visible = v;
    this.root.classList.toggle('hidden', !v);
    if (!v) { this.input.touchDown.clear(); this.input.touchDir = { x: 0, y: 0 }; }
  }
}
