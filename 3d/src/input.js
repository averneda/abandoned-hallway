// Entradas del juego: teclado y mando USB (por ejemplo, el mando de NES).
// El juego pregunta por "acciones", no por teclas ni botones, así cambiar los controles
// es cambiar solo estas tablas.

const KEYS = {
  up: ['ArrowUp', 'KeyW'],
  down: ['ArrowDown', 'KeyS'],
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
  run: ['ShiftLeft', 'ShiftRight'],
  jump: ['Space'],
  interact: ['KeyE', 'Enter'],
  ability: ['KeyQ', 'KeyF'],
  pause: ['Escape', 'KeyP'],
};

// Acciones que se pueden asignar a un botón del mando, en el orden en que se configuran.
// Los nombres por defecto siguen el mando de NES: B correr, A saltar, Start coger, Select habilidad.
export const PAD_ACTIONS = ['run', 'jump', 'interact', 'ability', 'pause'];

// Mapeo por defecto de un mando de NES USB corriente.
// Son los números de botón que suele dar el navegador; si no coinciden, se configuran en el juego.
const DEFAULT_PAD = { run: 2, jump: 1, interact: 9, ability: 8, pause: 3 };

const PREVENT = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']);
const AXIS_DEAD = 0.45; // a partir de aquí se considera que la cruceta está movida

export class Input {
  constructor() {
    this.down = new Set();
    this.pressed = new Set();
    this.enabled = true;
    // mando
    this.padMap = { ...DEFAULT_PAD };
    this.padIndex = null;
    this.padName = '';
    this.padDown = new Set();     // acciones pulsadas ahora en el mando
    this.padPressed = new Set();  // acciones que se acaban de pulsar
    this.padDir = { x: 0, y: 0 };
    this.padDirPressed = { x: 0, y: 0 }; // la cruceta se acaba de mover en esta dirección
    this.rawDown = new Set();     // números de botón pulsados (para la pantalla de configurar)
    this.rawPressed = new Set();
    // táctil (los botones en pantalla del móvil, ver touch.js)
    this.touchDown = new Set();
    this.touchPressed = new Set();
    this.touchDir = { x: 0, y: 0 };
    this.loadPadMap();

    window.addEventListener('keydown', (e) => {
      if (PREVENT.has(e.code)) e.preventDefault();
      if (!this.enabled) return;
      if (!e.repeat) this.pressed.add(e.code);
      this.down.add(e.code);
    });
    window.addEventListener('keyup', (e) => { this.down.delete(e.code); });
    window.addEventListener('blur', () => { this.down.clear(); this.pressed.clear(); });
    window.addEventListener('gamepadconnected', (e) => { this.padIndex = e.gamepad.index; this.padName = e.gamepad.id; });
    window.addEventListener('gamepaddisconnected', (e) => { if (this.padIndex === e.gamepad.index) { this.padIndex = null; this.padName = ''; } });
  }

  // ---- mando: guardar y cargar la configuración de botones
  loadPadMap() {
    try {
      const saved = JSON.parse(localStorage.getItem('holeway.padMap') || 'null');
      if (saved && typeof saved === 'object') this.padMap = { ...DEFAULT_PAD, ...saved };
    } catch (e) { /* sin almacenamiento */ }
  }

  savePadMap() {
    try { localStorage.setItem('holeway.padMap', JSON.stringify(this.padMap)); } catch (e) { /* nada */ }
  }

  setPadButton(action, button) { this.padMap[action] = button; this.savePadMap(); }
  resetPadMap() { this.padMap = { ...DEFAULT_PAD }; this.savePadMap(); }

  getPad() {
    if (!navigator.getGamepads) return null;
    const pads = navigator.getGamepads();
    if (this.padIndex != null && pads[this.padIndex]) return pads[this.padIndex];
    for (const p of pads) if (p && p.connected) { this.padIndex = p.index; this.padName = p.id; return p; }
    return null;
  }

  get padConnected() { return !!this.getPad(); }

  // Se llama una vez por fotograma, antes de que el juego lea las acciones.
  pollPad() {
    const pad = this.getPad();
    this.padPressed.clear();
    this.rawPressed.clear();
    this.padDirPressed = { x: 0, y: 0 };
    if (!pad) { this.padDown.clear(); this.rawDown.clear(); this.padDir = { x: 0, y: 0 }; return; }

    // botones
    const nowRaw = new Set();
    for (let i = 0; i < pad.buttons.length; i++) if (pad.buttons[i] && pad.buttons[i].pressed) nowRaw.add(i);
    for (const b of nowRaw) if (!this.rawDown.has(b)) this.rawPressed.add(b);
    this.rawDown = nowRaw;

    const nowActions = new Set();
    for (const [action, button] of Object.entries(this.padMap)) if (nowRaw.has(button)) nowActions.add(action);
    for (const a of nowActions) if (!this.padDown.has(a)) this.padPressed.add(a);
    this.padDown = nowActions;

    // cruceta: ejes o botones de dirección (12 arriba, 13 abajo, 14 izquierda, 15 derecha)
    let x = 0, y = 0;
    if (pad.axes.length >= 2) {
      if (Math.abs(pad.axes[0]) > AXIS_DEAD) x = Math.sign(pad.axes[0]);
      if (Math.abs(pad.axes[1]) > AXIS_DEAD) y = Math.sign(pad.axes[1]);
    }
    if (nowRaw.has(14)) x = -1; else if (nowRaw.has(15)) x = 1;
    if (nowRaw.has(12)) y = -1; else if (nowRaw.has(13)) y = 1;
    if (x !== 0 && this.padDir.x !== x) this.padDirPressed.x = x;
    if (y !== 0 && this.padDir.y !== y) this.padDirPressed.y = y;
    this.padDir = { x, y };
  }

  isDown(action) {
    return KEYS[action].some((k) => this.down.has(k)) || this.padDown.has(action) || this.touchDown.has(action);
  }

  wasPressed(action) {
    return KEYS[action].some((k) => this.pressed.has(k)) || this.padPressed.has(action) || this.touchPressed.has(action);
  }

  // Dirección del movimiento: {x: -1..1, y: -1..1}
  axis() {
    let x = (this.isDown('right') ? 1 : 0) - (this.isDown('left') ? 1 : 0);
    let y = (this.isDown('down') ? 1 : 0) - (this.isDown('up') ? 1 : 0);
    if (x === 0) x = this.padDir.x || this.touchDir.x;
    if (y === 0) y = this.padDir.y || this.touchDir.y;
    return { x, y };
  }

  // Llamar al final de cada fotograma.
  endFrame() { this.pressed.clear(); this.padPressed.clear(); this.rawPressed.clear(); this.touchPressed.clear(); this.padDirPressed = { x: 0, y: 0 }; }
  clear() { this.down.clear(); this.pressed.clear(); this.padPressed.clear(); this.rawPressed.clear(); this.touchPressed.clear(); }
}
