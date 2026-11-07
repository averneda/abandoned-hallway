// Un solo "altavoz" (AudioContext) para la música y los efectos: algunos navegadores,
// sobre todo en móviles, fallan o se callan si hay dos.

let ctx = null;

export function audioContext() {
  if (!ctx) {
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}
