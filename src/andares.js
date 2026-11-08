// Cómo anda y corre cada personaje, inventado por Elora en su Taller de Andares
// (https://claude.ai/artifact/PEMWcs5gJ2DXtHSigBhahm, colección "animaciones").
// Cada andar es una lista de pasos (posturas: brazos, piernas, inclinar, subir) y una velocidad
// (pasos por segundo). El personaje va pasando de un paso al siguiente, suavemente.
// Un personaje que no está aquí (o sin "andar" o sin "correr") se mueve como siempre.
// Todos los ha hecho Elora (7-11-2026; Chop y Drake, 8-11-2026); Gec corre como siempre, en su monopatín (Elora).
export const ANDARES = {
  // Carot
  carot: {
    andar: { velocidad: 4, pasos: [
      { bi: 12, bd: -8, pi: 18, pd: -12, cuerpo: 0, sube: 0 },
      { bi: 10, bd: -11, pi: 14, pd: -6, cuerpo: 0, sube: 0 },
      { bi: 10, bd: -11, pi: 1, pd: 4, cuerpo: 0, sube: 0 },
      { bi: 25, bd: -24, pi: 16, pd: -12, cuerpo: 0, sube: 0 },
      { bi: 25, bd: -24, pi: 24, pd: -20, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 12, pasos: [
      { bi: 44, bd: -44, pi: -4, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 44, bd: -44, pi: 7, pd: -19, cuerpo: 0, sube: 0 },
      { bi: 44, bd: -44, pi: 29, pd: -23, cuerpo: 0, sube: 0 },
      { bi: 54, bd: -56, pi: 29, pd: -23, cuerpo: 0, sube: 0 },
      { bi: 54, bd: -56, pi: 12, pd: -11, cuerpo: 0, sube: 0 },
      { bi: 54, bd: -56, pi: -1, pd: 5, cuerpo: 0, sube: 0 },
    ] },
  },
  // Froggy
  froggy: {
    andar: { velocidad: 4, pasos: [
      { bi: 45, bd: 41, pi: 57, pd: 0, cuerpo: 0, sube: 0 },
      { bi: -4, bd: 7, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
      { bi: -22, bd: -41, pi: 0, pd: -41, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 8, pasos: [
      { bi: 80, bd: -23, pi: -42, pd: 38, cuerpo: 0, sube: 0 },
      { bi: 91, bd: -6, pi: 4, pd: -1, cuerpo: 0, sube: 0 },
      { bi: 9, bd: -75, pi: 53, pd: -57, cuerpo: 0, sube: 0 },
      { bi: 9, bd: -75, pi: 3, pd: -1, cuerpo: 0, sube: 0 },
    ] },
  },
  // Oct
  oct: {
    andar: { velocidad: 4, pasos: [
      { bi: -21, bd: 14, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 0, bd: -1, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
      { bi: -19, bd: 30, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 8, pasos: [
      { bi: 81, bd: -87, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 41, bd: -42, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 84, bd: -78, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
    ] },
  },
  // Tarda
  tarda: {
    andar: { velocidad: 4, pasos: [
      { bi: 55, bd: 42, pi: 33, pd: 5, cuerpo: 0, sube: 0 },
      { bi: -33, bd: 42, pi: -9, pd: 5, cuerpo: 0, sube: 0 },
      { bi: -33, bd: -48, pi: -9, pd: -52, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 8, pasos: [
      { bi: 51, bd: -37, pi: 39, pd: -32, cuerpo: 0, sube: 0 },
      { bi: -28, bd: 26, pi: -24, pd: 18, cuerpo: 0, sube: 0 },
    ] },
  },
  // Gec: anda como lo hizo Elora y corre como siempre, en su monopatín (Elora)
  gek: {
    andar: { velocidad: 4, pasos: [
      { bi: -6, bd: -23, pi: 47, pd: -55, cuerpo: 0, sube: 0 },
      { bi: -6, bd: 17, pi: -20, pd: 17, cuerpo: 0, sube: 0 },
    ] },
  },
  // Draila
  draila: {
    andar: { velocidad: 4, pasos: [
      { bi: 25, bd: -1, pi: 7, pd: -31, cuerpo: 0, sube: 0 },
      { bi: 4, bd: 7, pi: 7, pd: -2, cuerpo: 0, sube: 0 },
      { bi: -9, bd: 12, pi: 36, pd: -2, cuerpo: 0, sube: 0 },
      { bi: 9, bd: 4, pi: 7, pd: -2, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 8, pasos: [
      { bi: 101, bd: 1, pi: 39, pd: -41, cuerpo: 0, sube: 0 },
      { bi: 94, bd: 8, pi: 17, pd: -13, cuerpo: 0, sube: 0 },
      { bi: 98, bd: 16, pi: -2, pd: 7, cuerpo: 0, sube: 0 },
    ] },
  },
  // Caty
  katy: {
    andar: { velocidad: 4, pasos: [
      { bi: -7, bd: -47, pi: 21, pd: 1, cuerpo: 0, sube: 0 },
      { bi: 7, bd: 0, pi: -3, pd: 1, cuerpo: 0, sube: 0 },
      { bi: 26, bd: -36, pi: -3, pd: -17, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 11, pasos: [
      { bi: 35, bd: -106, pi: 52, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 35, bd: -98, pi: 15, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 35, bd: -115, pi: -1, pd: -47, cuerpo: 0, sube: 0 },
      { bi: 35, bd: -102, pi: -1, pd: -3, cuerpo: 0, sube: 0 },
    ] },
  },
  // Jely
  jely: {
    andar: { velocidad: 4, pasos: [
      { bi: -8, bd: 7, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 0, bd: -6, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 8, pasos: [
      { bi: 16, bd: -9, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 43, bd: -51, pi: 0, pd: 0, cuerpo: 0, sube: 0 },
    ] },
  },
  // Hoppy
  hoppy: {
    andar: { velocidad: 4, pasos: [
      { bi: -42, bd: 39, pi: -8, pd: 5, cuerpo: 0, sube: 0 },
      { bi: -12, bd: 6, pi: 17, pd: -15, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 6, pasos: [
      { bi: -9, bd: 5, pi: -14, pd: 15, cuerpo: 0, sube: 0 },
      { bi: 63, bd: -63, pi: 52, pd: -40, cuerpo: 0, sube: 0 },
    ] },
  },  // Chop (Elora, 8-11-2026)
  reno: {
    andar: { velocidad: 4, pasos: [
      { bi: -50, bd: -39, pi: 58, pd: 0, cuerpo: 0, sube: 0 },
      { bi: -21, bd: 26, pi: 4, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 61, bd: 88, pi: 4, pd: -35, cuerpo: 0, sube: 0 },
      { bi: -17, bd: 21, pi: 4, pd: 1, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 11, pasos: [
      { bi: 110, bd: -107, pi: 61, pd: 0, cuerpo: 0, sube: 0 },
      { bi: 98, bd: -99, pi: 1, pd: -56, cuerpo: 0, sube: 0 },
      { bi: 76, bd: -80, pi: 76, pd: -84, cuerpo: 0, sube: 0 },
    ] },
  },
  // Drake (Elora, 8-11-2026; también mueve las alas: ai y ad)
  drake: {
    andar: { velocidad: 4, pasos: [
      { bi: 49, bd: -49, pi: 34, pd: 0, ai: -62, ad: 60, cuerpo: 0, sube: 0 },
      { bi: 69, bd: -68, pi: 4, pd: 0, ai: -50, ad: 50, cuerpo: 0, sube: 0 },
      { bi: 60, bd: -66, pi: 4, pd: -19, ai: -58, ad: 53, cuerpo: 0, sube: 0 },
    ] },
    correr: { velocidad: 5, pasos: [
      { bi: 26, bd: -16, pi: 30, pd: -11, ai: 21, ad: -20, cuerpo: 0, sube: 0 },
      { bi: 48, bd: -44, pi: 28, pd: -16, ai: 4, ad: -6, cuerpo: 0, sube: 0 },
      { bi: 15, bd: -16, pi: 49, pd: -43, ai: -19, ad: 20, cuerpo: 0, sube: 0 },
      { bi: 15, bd: -16, pi: 49, pd: -43, ai: -19, ad: 20, cuerpo: 0, sube: 0 },
    ] },
  },
};

const PARTES = ['bi', 'bd', 'pi', 'pd', 'ai', 'ad', 'cuerpo', 'sube'];

// La postura en este momento, o null si ese personaje se mueve como siempre.
// segundos: el tiempo que lleva andando o corriendo.
export function poseAndando(id, corriendo, segundos) {
  const a = ANDARES[id], m = a && (corriendo ? a.correr : a.andar);
  if (!m || !m.pasos || !m.pasos.length) return null;
  const ps = m.pasos;
  if (ps.length === 1) return ps[0];
  const f = segundos * m.velocidad, i = Math.floor(f) % ps.length, k = f - Math.floor(f);
  const e = (1 - Math.cos(k * Math.PI)) / 2, p0 = ps[i], p1 = ps[(i + 1) % ps.length], out = {};
  for (const n of PARTES) out[n] = (p0[n] || 0) + ((p1[n] || 0) - (p0[n] || 0)) * e;
  return out;
}
