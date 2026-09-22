// Musiquillas de fondo, hechas con el sintetizador del navegador (estilo Game Boy).
// Son melodías inventadas para el juego, no copias de nada.
//   'miedo'  → notas largas y raras en tono menor, para los pasillos.
//   'alegre' → saltarina y rápida en tono mayor, para la sala Bonus.

const NOTA = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

// "A3" -> 220 Hz
function hz(nombre) {
  const m = /^([A-G]#?)(-?\d)$/.exec(nombre);
  if (!m) return 0;
  const semis = NOTA[m[1]] + (Number(m[2]) + 1) * 12; // C-1 = 0
  return 440 * Math.pow(2, (semis - 69) / 12);
}

// Cada canción: pares [nota, duración en tiempos]. null = silencio.
const CANCIONES = {
  // Tono de La menor con notas "equivocadas" a propósito (Si bemol, Mi bemol, Fa sostenido).
  miedo: {
    tiempo: 0.36,       // segundos por tiempo: lento, como un reloj parado
    voz: 'square', volVoz: 0.09,
    bajoTipo: 'triangle', volBajo: 0.12,
    melodia: [
      ['A4', 2], ['A#4', 1], ['A4', 1], ['E4', 2], ['F4', 2],
      ['D#4', 3], [null, 1], ['A4', 2], ['G#4', 2],
      ['C5', 2], ['B4', 1], ['A#4', 1], ['A4', 2], [null, 2],
      ['F#4', 2], ['F4', 2], ['E4', 3], [null, 1],
      ['A4', 1], ['C5', 1], ['D#5', 2], ['D5', 2], ['A#4', 2],
      ['A4', 4], [null, 4],
    ],
    bajo: [
      ['A2', 4], ['A2', 4], ['F2', 4], ['F#2', 4],
      ['D2', 4], ['D#2', 4], ['A2', 4], ['E2', 4],
    ],
  },
  // Do mayor, saltarina, para el Bonus.
  alegre: {
    tiempo: 0.15,
    voz: 'square', volVoz: 0.08,
    bajoTipo: 'triangle', volBajo: 0.1,
    melodia: [
      ['C5', 1], ['E5', 1], ['G5', 1], ['C6', 1], ['B5', 1], ['G5', 1], ['E5', 2],
      ['D5', 1], ['F5', 1], ['A5', 1], ['D6', 1], ['C6', 1], ['A5', 1], ['F5', 2],
      ['E5', 1], ['G5', 1], ['C6', 1], ['E6', 1], ['D6', 1], ['C6', 1], ['G5', 2],
      ['F5', 1], ['A5', 1], ['C6', 1], ['A5', 1], ['G5', 1], ['E5', 1], ['C5', 2],
      ['G5', 1], ['A5', 1], ['B5', 1], ['C6', 2], [null, 1], ['G5', 1], ['E5', 1],
      ['F5', 1], ['G5', 1], ['A5', 1], ['G5', 2], [null, 1], ['E5', 1], ['C5', 1],
    ],
    bajo: [
      ['C3', 2], ['G3', 2], ['C3', 2], ['G3', 2],
      ['D3', 2], ['A3', 2], ['D3', 2], ['A3', 2],
      ['E3', 2], ['B3', 2], ['E3', 2], ['G3', 2],
      ['F3', 2], ['C4', 2], ['G3', 2], ['G3', 2],
    ],
  },
};

const ADELANTO = 0.6;  // cuánto se programa por delante

export class Music {
  constructor() {
    this.ctx = null;
    this.gain = null;
    this.playing = false;
    this.timer = null;
    this.volume = 0.22;
    this.cancion = null;   // qué canción está sonando
  }

  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
      this.gain = this.ctx.createGain();
      this.gain.gain.value = this.volume;
      this.gain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  // Una nota de onda cuadrada, como las de Game Boy.
  nota(freq, t0, dur, tipo, vol) {
    const c = this.ctx;
    const o = c.createOscillator(), g = c.createGain();
    o.type = tipo;
    o.frequency.setValueAtTime(freq, t0);
    // pequeño temblor, para que no suene plano
    o.frequency.linearRampToValueAtTime(freq * 0.995, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.04);
    g.gain.setValueAtTime(vol, t0 + dur * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.gain);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  // play('miedo') o play('alegre'). Si ya suena esa, no hace nada.
  play(nombre) {
    if (this.playing && this.cancion === nombre) return;
    if (!CANCIONES[nombre]) return;
    if (this.playing) this.stop();
    if (!this.ensure()) return;
    if (this.gain) this.gain.gain.value = this.volume;
    this.cancion = nombre;
    this.playing = true;
    this.melIdx = 0; this.bajoIdx = 0;
    this.melT = this.ctx.currentTime + 0.12;
    this.bajoT = this.melT;
    this.tick();
    this.timer = setInterval(() => this.tick(), 200);
  }

  start() { this.play('miedo'); }

  tick() {
    if (!this.playing || !this.ctx) return;
    const c = CANCIONES[this.cancion];
    if (!c) return;
    const hasta = this.ctx.currentTime + ADELANTO;
    // melodía
    while (this.melT < hasta) {
      const [n, t] = c.melodia[this.melIdx % c.melodia.length];
      const dur = t * c.tiempo;
      if (n) this.nota(hz(n), this.melT, dur * 0.9, c.voz, c.volVoz);
      this.melT += dur;
      this.melIdx++;
    }
    // bajo
    while (this.bajoT < hasta) {
      const [n, t] = c.bajo[this.bajoIdx % c.bajo.length];
      const dur = t * c.tiempo;
      this.nota(hz(n), this.bajoT, dur * 0.92, c.bajoTipo, c.volBajo);
      this.bajoT += dur;
      this.bajoIdx++;
    }
  }

  stop() {
    this.playing = false;
    this.cancion = null;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    // baja el volumen poco a poco para que no corte de golpe
    if (this.gain && this.ctx) {
      const g = this.gain.gain, t = this.ctx.currentTime;
      g.cancelScheduledValues(t);
      g.setValueAtTime(g.value, t);
      g.linearRampToValueAtTime(0.0001, t + 0.4);
      setTimeout(() => { if (!this.playing && this.gain) this.gain.gain.value = this.volume; }, 500);
    }
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) this.stop();
  }
}

export const music = new Music();
