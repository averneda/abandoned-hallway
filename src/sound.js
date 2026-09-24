// Sonidos provisionales hechos con el sintetizador del navegador.
// Cuando Elora grabe los suyos, se cargan como archivos desde assets/sonidos/ y se sustituyen aquí.

import { audioContext } from './audio.js';

function tone({ type = 'triangle', from = 440, to = from, time = 0.2, gain = 0.2, delay = 0 }) {
  const c = audioContext(); if (!c) return;
  const o = c.createOscillator(), g = c.createGain();
  const t0 = c.currentTime + delay;
  o.type = type;
  o.frequency.setValueAtTime(from, t0);
  if (to !== from) o.frequency.exponentialRampToValueAtTime(to, t0 + time);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + time);
  o.connect(g).connect(c.destination);
  o.start(t0); o.stop(t0 + time + 0.05);
}

export const sfx = {
  // "taaaaaaan": la muerte, como pidió Elora
  death() {
    tone({ type: 'sawtooth', from: 330, to: 82, time: 1.6, gain: 0.18 });
    tone({ type: 'square', from: 165, to: 41, time: 1.6, gain: 0.06 });
  },
  hurt() { tone({ type: 'square', from: 220, to: 110, time: 0.18, gain: 0.15 }); },
  coin() { tone({ type: 'triangle', from: 880, to: 880, time: 0.08, gain: 0.12 }); tone({ type: 'triangle', from: 1320, to: 1320, time: 0.14, gain: 0.12, delay: 0.07 }); },
  tape() { tone({ type: 'triangle', from: 520, to: 780, time: 0.15, gain: 0.12 }); },
  food() { tone({ type: 'sine', from: 400, to: 600, time: 0.12, gain: 0.12 }); tone({ type: 'sine', from: 600, to: 800, time: 0.12, gain: 0.1, delay: 0.1 }); },
  heart() { tone({ type: 'sine', from: 523, time: 0.12, gain: 0.12 }); tone({ type: 'sine', from: 659, time: 0.12, gain: 0.12, delay: 0.1 }); tone({ type: 'sine', from: 784, time: 0.2, gain: 0.12, delay: 0.2 }); },
  button() { tone({ type: 'square', from: 140, to: 90, time: 0.1, gain: 0.2 }); tone({ type: 'triangle', from: 600, to: 900, time: 0.25, gain: 0.1, delay: 0.15 }); },
  door() { tone({ type: 'sawtooth', from: 90, to: 60, time: 0.35, gain: 0.15 }); },
  freeze() { tone({ type: 'sine', from: 1200, to: 300, time: 0.6, gain: 0.12 }); tone({ type: 'triangle', from: 900, to: 200, time: 0.6, gain: 0.08, delay: 0.05 }); },
  bite() { tone({ type: 'sawtooth', from: 180, to: 60, time: 0.18, gain: 0.16 }); tone({ type: 'square', from: 900, to: 200, time: 0.3, gain: 0.08, delay: 0.05 }); },
  // Drake despega: un "fuush" que sube y un aleteo
  fly() { tone({ type: 'sawtooth', from: 150, to: 520, time: 0.35, gain: 0.1 }); tone({ type: 'triangle', from: 300, to: 260, time: 0.08, gain: 0.1, delay: 0.3 }); tone({ type: 'triangle', from: 300, to: 260, time: 0.08, gain: 0.1, delay: 0.45 }); },
  capa() { tone({ type: 'sine', from: 300, to: 700, time: 0.45, gain: 0.12 }); tone({ type: 'triangle', from: 450, to: 900, time: 0.45, gain: 0.08, delay: 0.08 }); },
  paint() { tone({ type: 'square', from: 700, to: 1300, time: 0.16, gain: 0.1 }); tone({ type: 'triangle', from: 400, to: 260, time: 0.25, gain: 0.08, delay: 0.1 }); },
  tongue() { tone({ type: 'square', from: 300, to: 900, time: 0.12, gain: 0.08 }); },
  dash() { tone({ type: 'sawtooth', from: 200, to: 700, time: 0.2, gain: 0.1 }); },
  stamina() { tone({ type: 'triangle', from: 440, to: 880, time: 0.18, gain: 0.12 }); tone({ type: 'sine', from: 660, to: 1320, time: 0.22, gain: 0.08, delay: 0.06 }); },
  levelUp() { [523, 659, 784, 1046].forEach((f, i) => tone({ type: 'triangle', from: f, time: 0.18, gain: 0.12, delay: i * 0.1 })); },
};
