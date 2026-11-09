// Musiquillas de fondo, hechas con el sintetizador del navegador (estilo Game Boy).
// Son melodías inventadas para el juego, no copias de nada.
//   'pasillo' → lenta y rarita, en vals, con campanitas y cascabeles a lo lejos: la música de los
//              pasillos (Elora la eligió: "está tan guay que quiero que sea la de los pasillos").
//   'miedo'  → notas largas y raras en tono menor: la de los pasillos de antes (ya no suena).
//   'alegre' → saltarina y rápida en tono mayor, para la sala Bonus.
//   'lobby'  → calentita, con emoción y un poco misteriosa: se nota que el lobby es una zona segura (Elora).
//   'fuego'  → rápida y nerviosa, mientras el Drake Sangriento viene a escupir fuego (Elora).
//   'navidad' → vals alegre con campanitas y cascabeles, para el lobby en Navidad (Elora).
//   'pasilloNavidad' → lenta y mecida como un villancico de cuna, un poco misteriosa: los pasillos
//              en Navidad (Elora).
//   'pijamas' → alegre y blandita, como una fiesta de pijamas con estrellitas: el lobby en la fiesta
//              del Día del Niño y con el modo pijama (Elora; cómo suena, Clad [PROVISIONAL]).

import { audioContext } from './audio.js';

const NOTA = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

// "A3" -> 220 Hz
function hz(nombre) {
  const m = /^([A-G]#?)(-?\d)$/.exec(nombre);
  if (!m) return 0;
  const semis = NOTA[m[1]] + (Number(m[2]) + 1) * 12; // C-1 = 0
  return 440 * Math.pow(2, (semis - 69) / 12);
}

// Cada canción: pares [nota, duración en tiempos]. null = silencio.
// Opcional: 'campanas' (otra pista de notas cortitas y agudas) y 'cascabeles' (un número por tiempo:
// 0 = nada, 1 = cascabel; un número más pequeño suena más bajito, como más lejos).
const CANCIONES = {
  // Tono de La menor con notas "equivocadas" a propósito (Si bemol, Mi bemol, Fa sostenido).
  // Era la de los pasillos; ahora suena 'pasillo' (Elora). Se deja por si se quiere volver a usar.
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
  // Fa mayor, calentita y con emoción, que se note que el lobby es una zona segura donde no te va a pasar
  // nada raro (Elora, 9-11-2026), pero un poco misteriosa (Elora): unos acordes raritos que vienen de Fa menor
  // (Si bemol menor y Re bemol) y una campanita con un Si natural, y siempre vuelve tranquila a casa (a Fa mayor).
  // Va subiendo poco a poco hasta la nota más alta (la emoción). Melodía inventada (no es una copia de nada).
  // Antes era en Mi menor, misteriosa del todo, como de sala de espera.
  lobby: {
    tiempo: 0.29,
    voz: 'triangle', volVoz: 0.13,
    bajoTipo: 'sine', volBajo: 0.14,
    melodia: [
      ['A4', 1], ['C5', 1], ['F5', 2],               ['E5', 1], ['D5', 1], ['C5', 2],
      ['D5', 1], ['F5', 1], ['A5', 2],               ['F5', 2], ['C#5', 2],                   // misterio (Si bemol menor)
      ['A4', 1], ['C5', 1], ['F5', 1], ['G5', 1],    ['A5', 2], ['G5', 1], ['E5', 1],
      ['F5', 1], ['E5', 1], ['D5', 1], ['C5', 1],    ['C5', 3], [null, 1],                    // flotando (Re bemol)
      ['D5', 1], ['F5', 1], ['A#5', 2],              ['A5', 1], ['G5', 1], ['E5', 2],
      ['C5', 1], ['E5', 1], ['A5', 2],               ['F5', 3], [null, 1],
      ['D5', 1], ['F5', 1], ['A#5', 1], ['A5', 1],   ['G5', 2], ['C6', 2],                    // la emoción
      ['A#5', 1], ['G#5', 1], ['G5', 1], ['E5', 1],  ['F5', 3], [null, 1],                    // un poco rarito… y a casa
    ],
    bajo: [
      ['F2', 2], ['C3', 2], ['C2', 2], ['G2', 2], ['D2', 2], ['A2', 2], ['A#1', 2], ['F2', 2],
      ['F2', 2], ['C3', 2], ['C2', 2], ['G2', 2], ['D2', 2], ['A2', 2], ['C#2', 2], ['G#2', 2],
      ['A#1', 2], ['F2', 2], ['C2', 2], ['G2', 2], ['A1', 2], ['E2', 2], ['D2', 2], ['A2', 2],
      ['A#1', 2], ['F2', 2], ['C2', 2], ['G2', 2], ['A#1', 2], ['C2', 2], ['F2', 4],
    ],
    campanas: [['C6', 0.5], [null, 3.5], ['B5', 0.5], ['F6', 0.5], [null, 3], ['E6', 0.5], [null, 3.5], ['C#6', 0.5], ['A5', 0.5], [null, 3]],
    tipoCampana: 'sine', volCampana: 0.04,
  },
  // Re menor, muy rápida y repetitiva, como un corazón que late deprisa: para cuando el Drake
  // Sangriento viene a escupir fuego en el pasillo 50 (Elora: "más rápida, que dé un poco de ansiedad").
  fuego: {
    tiempo: 0.105,
    voz: 'square', volVoz: 0.085,
    bajoTipo: 'sawtooth', volBajo: 0.07,
    melodia: [
      ['D5', 1], ['F5', 1], ['D5', 1], ['G#5', 1], ['D5', 1], ['F5', 1], ['D5', 1], ['A5', 1],
      ['D5', 1], ['F5', 1], ['D5', 1], ['G#5', 1], ['A5', 2], ['G#5', 2],
      ['C5', 1], ['D#5', 1], ['C5', 1], ['F#5', 1], ['C5', 1], ['D#5', 1], ['C5', 1], ['G5', 1],
      ['A#4', 1], ['D5', 1], ['F5', 1], ['A5', 1], ['G#5', 2], ['A5', 2],
    ],
    bajo: [
      ['D2', 1], ['D3', 1], ['D2', 1], ['D3', 1], ['D2', 1], ['D3', 1], ['D2', 1], ['D#3', 1],
      ['C2', 1], ['C3', 1], ['C2', 1], ['C3', 1], ['A#1', 1], ['A#2', 1], ['A1', 1], ['A2', 1],
    ],
  },
  // Sol mayor, alegre pero blandita, como una fiesta de pijamas: saltitos de almohada, un bostezo en
  // medio, estrellitas que brillan (campanitas) y una pandereta suave. La pidió Elora para el lobby en
  // la fiesta de pijamas (melodía inventada, no es una copia de nada) [PROVISIONAL cómo suena].
  pijamas: {
    tiempo: 0.19,
    voz: 'triangle', volVoz: 0.14,
    bajoTipo: 'sine', volBajo: 0.13,
    melodia: [
      ['G4', 1], ['B4', 1], ['D5', 1], ['G5', 1], ['F#5', 1], ['D5', 1], ['E5', 2],
      ['C5', 1], ['E5', 1], ['G5', 1], ['E5', 1], ['D5', 1], ['B4', 1], ['A4', 2],
      ['G4', 1], ['B4', 1], ['D5', 1], ['G5', 1], ['A5', 1], ['G5', 1], ['F#5', 1], ['E5', 1],
      ['D5', 1], ['C5', 1], ['B4', 1], ['A4', 1], ['G4', 2], [null, 2],
      ['E5', 2], ['D5', 1], ['B4', 1], ['C5', 2], ['A4', 2],          // el bostezo
      ['B4', 1], ['D5', 1], ['G5', 1], ['D5', 1], ['E5', 2], [null, 1], ['D5', 1],
      ['C5', 1], ['B4', 1], ['A4', 1], ['B4', 1], ['C5', 1], ['D5', 1], ['E5', 1], ['F#5', 1],
      ['G5', 3], ['D5', 1], ['G4', 2], [null, 2],
    ],
    bajo: [
      ['G2', 2], ['D3', 2], ['E2', 2], ['B2', 2],
      ['C3', 2], ['G2', 2], ['D2', 2], ['A2', 2],
      ['G2', 2], ['D3', 2], ['D2', 2], ['A2', 2],
      ['D2', 2], ['A2', 2], ['G2', 2], ['D3', 2],
      ['C3', 2], ['G2', 2], ['A2', 2], ['E2', 2],
      ['G2', 2], ['D3', 2], ['C3', 2], ['G2', 2],
      ['A2', 2], ['E3', 2], ['D2', 2], ['A2', 2],
      ['G2', 4], ['D2', 2], ['G2', 2],
    ],
    campanas: [['D6', 0.5], [null, 3.5], ['B5', 0.5], ['G6', 0.5], [null, 3]],
    tipoCampana: 'sine', volCampana: 0.05,
    cascabeles: [0, 0, 0.6, 0],
  },
  // Fa mayor, en vals (de tres en tres), como una cajita de música de Navidad, con campanitas y
  // cascabeles. La pidió Elora para el lobby en Navidad (melodía inventada, no es ningún villancico).
  navidad: {
    tiempo: 0.24,
    voz: 'triangle', volVoz: 0.14,
    bajoTipo: 'sine', volBajo: 0.13,
    melodia: [
      ['C5', 2], ['A4', 1],   ['F5', 2], ['E5', 1],   ['D5', 1], ['E5', 1], ['F5', 1],   ['C5', 3],
      ['A4', 2], ['A#4', 1],  ['C5', 2], ['A5', 1],   ['G5', 1], ['F5', 1], ['E5', 1],   ['F5', 3],
      ['A5', 2], ['G5', 1],   ['F5', 2], ['D5', 1],   ['E5', 1], ['F5', 1], ['G5', 1],   ['C5', 3],
      ['D5', 2], ['A#4', 1],  ['C5', 1], ['D5', 1], ['E5', 1],   ['A5', 1], ['G5', 1], ['E5', 1],   ['F5', 3],
    ],
    // "um-pa-pa": la nota de abajo y dos más de su acorde, un acorde por compás
    bajo: [
      ['F2', 1], ['C3', 1], ['A2', 1],    ['F2', 1], ['C3', 1], ['A2', 1],
      ['A#1', 1], ['F2', 1], ['D2', 1],   ['C2', 1], ['G2', 1], ['E2', 1],
      ['F2', 1], ['C3', 1], ['A2', 1],    ['F2', 1], ['C3', 1], ['A2', 1],
      ['C2', 1], ['G2', 1], ['E2', 1],    ['F2', 1], ['C3', 1], ['A2', 1],
      ['F2', 1], ['C3', 1], ['A2', 1],    ['D2', 1], ['A2', 1], ['F2', 1],
      ['C2', 1], ['G2', 1], ['E2', 1],    ['C2', 1], ['G2', 1], ['E2', 1],
      ['G2', 1], ['D3', 1], ['A#2', 1],   ['C2', 1], ['G2', 1], ['E2', 1],
      ['C2', 1], ['G2', 1], ['E2', 1],    ['F2', 1], ['C3', 1], ['A2', 1],
    ],
    campanas: [['C6', 0.5], [null, 2.5], ['A5', 0.5], ['C6', 0.5], [null, 2]],
    tipoCampana: 'sine', volCampana: 0.07,
    cascabeles: [0, 1, 1],
  },
  // La menor, lenta y rarita, en vals, como una cajita de música que se ha quedado sola en el
  // pasillo, con campanitas sueltas y cascabeles a lo lejos (melodía inventada). Clad la hizo para los
  // pasillos en Navidad, pero a Elora le gustó tanto que es la de los pasillos de siempre.
  pasillo: {
    tiempo: 0.34,
    voz: 'triangle', volVoz: 0.12,
    bajoTipo: 'triangle', volBajo: 0.12,
    melodia: [
      ['A4', 2], ['E5', 1],   ['D5', 1], ['C5', 1], ['B4', 1],   ['C5', 2], ['A4', 1],   ['G#4', 3],
      ['A4', 2], ['C5', 1],   ['F5', 2], ['E5', 1],   ['D#5', 1], ['E5', 1], ['B4', 1],   ['A4', 3],
      ['E5', 2], ['F5', 1],   ['E5', 1], ['D5', 1], ['C5', 1],   ['D5', 2], ['A#4', 1],  ['A4', 3],
      ['F4', 2], ['A4', 1],   ['G#4', 1], ['B4', 1], ['D5', 1],   ['C5', 1], ['B4', 1], ['G#4', 1],   ['A4', 3],
    ],
    // una nota larga por compás
    bajo: [
      ['A2', 3], ['G2', 3], ['A2', 3], ['E2', 3],
      ['A2', 3], ['D2', 3], ['B1', 3], ['A2', 3],
      ['F2', 3], ['A2', 3], ['A#1', 3], ['A2', 3],
      ['F2', 3], ['E2', 3], ['E2', 3], ['A2', 3],
    ],
    campanas: [['E6', 0.5], [null, 5.5], ['A5', 0.5], [null, 5.5], ['C6', 0.5], [null, 5.5], ['B5', 0.5], [null, 5.5]],
    tipoCampana: 'sine', volCampana: 0.05,
    cascabeles: [0.5, 0, 0, 0, 0, 0, 0.35, 0.25, 0, 0, 0, 0],
  },
  // Sol mayor, lenta y mecida (de seis en seis, como una nana), con aire de villancico: acordes de
  // Navidad, y de vez en cuando un acorde menor (Do menor) o uno mágico (La bemol) que la vuelven
  // misteriosa, para que siga siendo de pasillo (Elora: "un poquito más de misterio"). Campanitas de cajita de música en cada compás y cascabeles suaves.
  // La pidió Elora para los pasillos en Navidad: "que tenga un aire de Navidad, que no solo sea con
  // cosas de Navidad" (melodía inventada, no es ningún villancico).
  pasilloNavidad: {
    tiempo: 0.25,
    voz: 'triangle', volVoz: 0.13,
    bajoTipo: 'sine', volBajo: 0.12,
    melodia: [
      ['B4', 2], ['D5', 1], ['G5', 2], ['F#5', 1],   ['E5', 3], ['C5', 3],
      ['D5', 2], ['B4', 1], ['G4', 2], ['A4', 1],    ['A4', 6],
      ['B4', 2], ['E5', 1], ['G5', 2], ['F#5', 1],   ['E5', 2], ['D5', 1], ['C5', 3],
      ['D#5', 3], ['C5', 2], ['G4', 1],              ['D5', 6],
      ['G5', 2], ['F#5', 1], ['E5', 2], ['D5', 1],   ['D#5', 2], ['G#5', 1], ['C6', 3],
      ['C6', 2], ['B5', 1], ['A5', 2], ['E5', 1],    ['F#5', 3], ['A5', 3],
      ['B5', 2], ['A5', 1], ['G5', 2], ['D5', 1],    ['D#5', 2], ['D5', 1], ['C5', 3],
      ['F#5', 3], ['A4', 3],                         ['G4', 6],
    ],
    // los acordes: Sol, Do, Sol, Re / Mi menor, Do, Do menor, Sol / Sol, La bemol, La menor, Re / Sol, Do menor, Re, Sol
    bajo: [
      ['G2', 3], ['D3', 3],   ['C3', 3], ['G2', 3],   ['G2', 3], ['D3', 3],   ['D2', 3], ['A2', 3],
      ['E2', 3], ['B2', 3],   ['C3', 3], ['G2', 3],   ['C3', 3], ['D#3', 3],  ['G2', 3], ['D3', 3],
      ['G2', 3], ['D3', 3],   ['G#2', 3], ['D#3', 3], ['A2', 3], ['E3', 3],   ['D2', 3], ['A2', 3],
      ['B1', 3], ['D3', 3],   ['C3', 3], ['D#3', 3],  ['D3', 3], ['C3', 3],   ['G2', 6],
    ],
    campanas: [
      ['D6', 1.5], [null, 4.5], ['E6', 1.5], [null, 4.5], ['B5', 1.5], [null, 4.5], ['A5', 1.5], [null, 4.5],
      ['E6', 1.5], [null, 4.5], ['C6', 1.5], [null, 4.5], ['D#6', 1.5], [null, 4.5], ['D6', 1.5], [null, 4.5],
      ['B5', 1.5], [null, 4.5], ['D#6', 1.5], [null, 4.5], ['E6', 1.5], [null, 4.5], ['A5', 1.5], [null, 4.5],
      ['D6', 1.5], [null, 4.5], ['D#6', 1.5], [null, 4.5], ['A5', 1.5], [null, 4.5], ['D6', 1.5], [null, 4.5],
    ],
    tipoCampana: 'sine', volCampana: 0.05,
    cascabeles: [0.25, 0, 0, 0.15, 0, 0],
  },

};

const ADELANTO = 0.6;  // cuánto se programa por delante

export class Music {
  constructor() {
    this.ctx = null;
    this.gain = null;        // volumen general de la música (no se toca al cambiar de canción)
    this.songGain = null;    // volumen de la canción que suena ahora: es el que se apaga poco a poco
    this.playing = false;
    this.timer = null;
    this.volume = 0.22;
    this.cancion = null;   // qué canción está sonando
  }

  ensure() {
    if (!this.ctx) {
      this.ctx = audioContext();
      if (!this.ctx) return null;
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
    o.connect(g).connect(this.songGain);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }

  // play('miedo'), play('alegre'), play('lobby'), play('fuego'), play('navidad'), play('pasillo'), play('pasilloNavidad') o play('pijamas'). Si ya suena esa, no hace nada.
  play(nombre) {
    if (this.playing && this.cancion === nombre) return;
    if (!CANCIONES[nombre]) return;
    if (this.playing) this.stop();
    if (!this.ensure()) return;
    // Cada canción tiene su propio volumen: así la anterior se apaga sola sin callar a la nueva.
    this.songGain = this.ctx.createGain();
    this.songGain.connect(this.gain);
    this.cancion = nombre;
    this.playing = true;
    this.melIdx = 0; this.bajoIdx = 0; this.campIdx = 0; this.cascIdx = 0;
    this.melT = this.ctx.currentTime + 0.12;
    this.bajoT = this.melT; this.campT = this.melT; this.cascT = this.melT;
    this.tick();
    this.timer = setInterval(() => this.tick(), 200);
  }

  start() { this.play('pasillo'); }

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
    // campanitas (si la canción tiene)
    while (c.campanas && this.campT < hasta) {
      const [n, t] = c.campanas[this.campIdx % c.campanas.length];
      const dur = t * c.tiempo;
      if (n) this.nota(hz(n), this.campT, dur * 0.9, c.tipoCampana, c.volCampana);
      this.campT += dur;
      this.campIdx++;
    }
    // cascabeles (si la canción tiene): un "chis" cortito y agudo
    while (c.cascabeles && this.cascT < hasta) {
      const fuerza = c.cascabeles[this.cascIdx % c.cascabeles.length];
      if (fuerza) this.cascabel(this.cascT, fuerza);
      this.cascT += c.tiempo;
      this.cascIdx++;
    }
  }

  // Un golpe de cascabel: ruido muy agudo que se apaga enseguida.
  cascabel(t0, fuerza = 1) {
    const c = this.ctx;
    if (!this.ruido) {
      const n = Math.floor(c.sampleRate * 0.2);
      this.ruido = c.createBuffer(1, n, c.sampleRate);
      const d = this.ruido.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    src.buffer = this.ruido;
    f.type = 'highpass'; f.frequency.value = 7000;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.05 * fuerza, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    src.connect(f).connect(g).connect(this.songGain);
    src.start(t0);
    src.stop(t0 + 0.15);
  }

  stop() {
    this.playing = false;
    this.cancion = null;
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    // baja el volumen de esta canción poco a poco para que no corte de golpe (incluidas
    // las notas que ya estaban programadas) y luego la desconecta
    const sg = this.songGain;
    this.songGain = null;
    if (sg && this.ctx) {
      const t = this.ctx.currentTime;
      sg.gain.setValueAtTime(1, t);
      sg.gain.linearRampToValueAtTime(0.0001, t + 0.4);
      setTimeout(() => sg.disconnect(), 1000);
    }
  }

  setEnabled(on) {
    this.enabled = on;
    if (!on) this.stop();
  }
}

export const music = new Music();
