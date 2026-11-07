// El calendario de Adviento del lobby (evento de Navidad, Elora).
//
// - Calendario grande, del 21 al 25 de diciembre: cada día que lo abres te da 20 monedas, y si abres los
//   5 te llevas el regalo secreto (un personaje nuevo de Navidad: el reno, que dibujará Elora).
// - Calendario chiquito, del 26 al 30 de diciembre: es un extra. Si abres los 5, el regalo final:
//   50 monedas + el regalo del finde (30 monedas y 3 cintas) (Elora).
// Cada casilla se abre su día. Si un día se te pasa, la puedes recuperar por 1.000 monedas (Elora): no te da
// el regalo de ese día, solo cuenta para el regalo final (la sorpresa).
// Los números están en ADVIENTO de src/config.js.
// Para probarlo otro día: index.html?navidad=1&dia=2026-12-23

import { ADVIENTO } from './config.js';

// "AAAA-MM-DD" de una fecha (hora local)
export function textoDia(f) {
  const d = new Date(f);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function sumarDias(txt, n) {
  const [a, m, d] = txt.split('-').map(Number);
  return textoDia(new Date(a, m - 1, d + n));
}

// El día de hoy para el juego (con ?dia=AAAA-MM-DD se puede probar otro día)
export function hoyJuego() {
  try {
    const p = new URLSearchParams(location.search).get('dia');
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) { const [a, m, d] = p.split('-').map(Number); return new Date(a, m - 1, d); }
  } catch (e) { /* nada */ }
  return new Date();
}

// Las casillas de un calendario ('grande' o 'chico'): [{ fecha, dia }]
export function casillas(cual) {
  const c = ADVIENTO[cual];
  return Array.from({ length: c.dias }, (_, i) => { const fecha = sumarDias(c.primerDia, i); return { fecha, dia: Number(fecha.slice(8)) }; });
}

// Cómo está una casilla: 'abierta' (ya la abriste), 'hoy' (se puede abrir ahora), 'perdida' (su día pasó
// sin abrirla) o 'cerrada' (aún no ha llegado su día)
export function estadoCasilla(fecha, abiertas, hoy = hoyJuego()) {
  if (abiertas.includes(fecha)) return 'abierta';
  const h = textoDia(hoy);
  if (fecha === h) return 'hoy';
  return fecha < h ? 'perdida' : 'cerrada';
}

// ¿Están abiertas todas las casillas de ese calendario?
export function completo(cual, abiertas) { return casillas(cual).every((c) => abiertas.includes(c.fecha)); }

// Lo que se guarda: { abiertas: [fechas], premioGrande: bool, premioChico: bool }
export function estadoVacio() { return { abiertas: [], premioGrande: false, premioChico: false }; }

// Abre la casilla de hoy de ese calendario (o, con fecha, una que se te pasó: recuperarla). Devuelve lo que
// te dan: { monedas, cintas, personaje, final: 'grande' | 'chico' | null } o null si no se puede abrir.
export function abrir(cual, estado, hoy = hoyJuego(), fecha = textoDia(hoy)) {
  const casilla = casillas(cual).find((c) => c.fecha === fecha);
  if (!casilla || estado.abiertas.includes(fecha)) return null;
  const est = estadoCasilla(fecha, estado.abiertas, hoy);
  if (est !== 'hoy' && est !== 'perdida') return null;
  estado.abiertas.push(fecha);
  const c = ADVIENTO[cual];
  const premio = { monedas: 0, cintas: 0, personaje: null, final: null };
  if (cual === 'grande') {
    if (est === 'hoy') premio.monedas += c.monedasCadaDia;   // un día recuperado no da sus monedas (Elora)
    if (!estado.premioGrande && completo('grande', estado.abiertas)) {
      estado.premioGrande = true; premio.personaje = c.personaje; premio.final = 'grande';
    }
  } else if (!estado.premioChico && completo('chico', estado.abiertas)) {
    estado.premioChico = true; premio.final = 'chico';
    premio.monedas += c.premioMonedas + c.findeMonedas;
    premio.cintas += c.findeCintas;
  }
  return premio;
}
