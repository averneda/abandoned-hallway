// Ajustes del juego. Cambiar números aquí cambia cómo se siente el juego.
// Todo está en píxeles, segundos o "tiles" (casillas de TILE píxeles).

export const TILE = 32;          // tamaño de una casilla
export const VIEW_W = 960;       // ancho de la pantalla de juego
export const VIEW_H = 600;       // alto de la pantalla de juego

export const PLAYER = {
  walk: 120,       // velocidad andando (px/s)
  run: 205,        // velocidad corriendo (px/s)
  radius: 11,      // tamaño para chocar
  hearts: 3,       // corazones al empezar
  invuln: 1.2,     // segundos sin poder recibir daño tras un golpe
  jumpTime: 0.42,  // duración del salto
  knockback: 260,  // empujón al ser tocado
};

// Medidor de ansiedad. Empieza vacío (verde) y se va llenando de rojo; si llega al máximo, el personaje muere.
export const ANXIETY = {
  max: 100,
  start: 0,
  nearGain: 14,         // cuánto sube por segundo con un Bloodie pegado
  nearRadiusTiles: 4.5, // a esta distancia (en casillas) empieza a subir
  calm: 1.5,            // cuánto baja por segundo cuando estás tranquilo
  food: -25,            // bolita de comida (baja la ansiedad)
  tape: -6,             // cinta de grabación
  button: -12,          // pulsar el botón
  hit: 12,              // te toca un Bloodie
};

// Cómo se ve el estrés (Elora): a partir de "from" (parte de la barra de ansiedad llena)
// la pantalla se oscurece con los bordes en rojo; a partir de "shakeFrom" además tiembla.
export const STRESS = {
  from: 0.5,        // desde la mitad de la barra
  shakeFrom: 0.75,  // tiembla desde las tres cuartas partes
  shakePx: 4,       // cuánto tiembla como mucho (píxeles)
};

// Estamina (pedida por Elora). Correr la gasta; parando se recupera sola.
// Las bolitas de estamina que hay por el suelo la rellenan de golpe.
export const STAMINA = {
  max: 100,
  start: 100,
  runCost: 26,      // cuánta se gasta por segundo corriendo
  regen: 16,        // cuánta se recupera por segundo cuando no corres
  regenDelay: 0.7,  // segundos después de dejar de correr hasta que empieza a recuperarse
  minToRun: 20,     // si se te acaba del todo, hay que llegar aquí para poder correr otra vez
  ball: 45,         // lo que da una bolita de estamina
};

// Los Bloodies especiales de Elora (src/especiales.js): salen en 1 de cada 10 pasillos (prob), nunca en los 5
// primeros (desdePasillo: a partir del 6). Lo de Elora: prob, desdePasillo, los 2 corazones de la boca del gato y
// de Oct, cada 20 s (minijuego de Oct y cambio de Gec y Draila). Lo demás [PROVISIONAL]: cuántas bocas, cuánto
// más rápido va Gec y cuánto más lejos ve Draila, el tamaño del laberinto y lo que tarda Oct en encontrarte.
export const BLOODIES_ESPECIALES = {
  prob: 0.1, desdePasillo: 6,
  bocas: 34, bocaRadio: 15, bocaDano: 2, bocaEspera: 4,          // Caty: la boca del gato muerde y espera 4 s
  cogeDano: 0.6, cogeDura: 1.4,   // media Caty sale de la boca y te coge con los brazos (Elora): a los 0,6 s, −2 ❤; a los 1,4 s te suelta [PROVISIONAL]
  minijuego: [9, 11], pecera: [9, 6], octTarda: 12, octDano: 2,  // Oct: cada ~10 s (Elora; antes 20); laberinto de 9 × 6; te encuentra en 12 s
  cambio: [18, 22], gecRapido: 1.35, drailaLento: 0.75, drailaVe: 1.6,   // Gec y Draila: se cambian cada ~20 s
};

export const ENEMY = {
  // Bajadas un 25% a petición de Elora (antes 60 y 140).
  walk: 45,        // velocidad paseando
  chase: 105,      // velocidad persiguiendo (más que andar, menos que correr)
  sightTiles: 5,   // desde cuántas casillas te ven
  loseTiles: 7,    // a cuántas casillas dejan de perseguirte
  radius: 13,
  giveUpTime: 1.5, // segundos sin verte hasta que se rinden (van al último sitio donde te vieron)
  recoil: 1.4,     // segundos que se apartan después de tocarte (para no pegarse como imanes)
  trail: 7,        // casillas de rastro de sangre que dejan al moverse
};

// Habilidades de los personajes.
export const ABILITIES = {
  oct: { freezeTime: 10, cooldown: 25 },        // para a los Bloodies 10 s; se puede volver a usar a los 25 s
  carot: { jumpTime: 0.75, airSpeed: 1.35 },    // salto largo y rápido; en el aire pasa por encima de los Bloodies
  gek: { rangeTiles: 7, dashSpeed: 650, cooldown: 3 }, // lengua de 7 casillas; si se engancha, va rápido hasta allí
  // Draila: da un mordisco que lanza una onda de 5 casillas. Los Bloodies que toca salen despedidos.
  draila: { rangeTiles: 5, speed: 420, push: 520, stun: 1.6, cooldown: 6 },
  // Tarda: se envuelve en su capa "Tun". No le pueden hacer daño, pero va más lento.
  // Bolita Tun (Elora, 8-11-2026; antes era la capa Tun): se hace una bolita unos segundos; no se mueve, los
  // Bloodies no la ven ni le hacen daño, y al salir se le baja la ansiedad. usos: 3 veces por pasillo (Elora).
  // time, cooldown y calma [PROVISIONAL]
  tarda: { time: 6, cooldown: 20, calma: 35, usos: 3 },
  // Caty: pinta a TODOS los Bloodies del mapa de azul fosforito (el color de su mancha).
  // Es un mini-localizador: dura poco, pero te dice dónde están todos, estén donde estén.
  katy: { time: 3, cooldown: 10 },
  // Drake: vuela. Pasa por encima de los trastos (naranjas y rojos) y los Bloodies no le pueden coger.
  drake: { time: 5, cooldown: 16 },
  // Jely: inunda la sala 10 s. Con el agua los Bloodies van un 30% más lentos y ella un 20% más rápida.
  // Se puede volver a usar a los 20 s (Elora).
  jely: { time: 10, cooldown: 20, enemySlow: 0.7, playerFast: 1.2 },
  // Hoppy: Supercarrera (Elora). Corre el doble de rápido que corriendo normal y no se cansa.
  // Dura 5 s y se puede volver a usar a los 15 s (Elora).
  hoppy: { time: 5, cooldown: 15, speed: 2 },
  // Chop (Elora): Nariz brillante. Al coger una cinta, comida, un corazón o una bolita de estamina (las monedas no),
  // su nariz se enciende 5 s más (se van sumando) y ve más lejos en la oscuridad (luz: cuántas veces más [PROVISIONAL]).
  chop: { segundos: 5, luz: 1.8 },
};

export const COINS = {
  levelBonus: 10,  // monedas al terminar un nivel
  // Las tres monedas de Elora (se dibujan en src/coins.js). value: lo que vale cada una
  // (el número que lleva dibujado). chance: de cada 100 monedas, cuántas salen de ese tipo
  // [PROVISIONAL]. Las monedas de práctica del lobby son siempre de bronce.
  kinds: {
    bronce: { value: 1, chance: 60 },
    metal: { value: 2, chance: 30 },
    oro: { value: 3, chance: 10 },
  },
};

// Parámetros de cada personaje (Elora): Velocidad, Cordura y Sigilo, de 0 a 100 (están en
// src/characters.js). Con 50 el personaje juega "normal"; cada punto por encima o por debajo
// lo cambia un 1%. [PROVISIONAL] Cuánto cambia cada uno lo puede ajustar Elora.
//   Velocidad: lo rápido que anda y corre (0 → la mitad, 100 → 1,5 veces).
//   Cordura:   lo que se estresa (más cordura, menos sube la ansiedad: 0 → 1,5 veces, 100 → la mitad).
//   Sigilo:    desde cuántas casillas le ven los Bloodies (0 → 1,5 veces más lejos, 100 → la mitad).
//   Resistencia: lo que aguanta corriendo [PROVISIONAL, Elora decide qué hace]: cuánta estamina gasta
//              al correr (0 → 1,5 veces más, 100 → la mitad).
export const STAT_EFFECTS = {
  velocidad: (v) => 0.5 + v / 100,
  cordura: (v) => 1.5 - v / 100,
  sigilo: (v) => 1.5 - v / 100,
  resistencia: (v) => 1.5 - v / 100,
};

// Corazones con los que empieza cada personaje (Elora los elige: campo corazones; si no tiene, PLAYER.hearts).
export function maxHearts(ch) { return ch && typeof ch.corazones === 'number' ? ch.corazones : PLAYER.hearts; }

// Multiplicador de un parámetro para un personaje (si no tiene ese parámetro, 50 = normal).
export function statMul(ch, stat) {
  const v = ch && ch.stats && typeof ch.stats[stat] === 'number' ? ch.stats[stat] : 50;
  return STAT_EFFECTS[stat](Math.max(0, Math.min(100, v)));
}

export const LEVEL = {
  bloodDecals: 14,    // manchas de sangre (dibujada) por el suelo de cada pasillo
};

// Distancias mínimas al repartir al azar el botón y la puerta en los mapas dibujados.
// Están en casillas, medidas en línea recta desde donde entra el jugador.
export const MAP_RANDOM = {
  exitMinTiles: 14,       // la salida nunca sale pegada a la entrada
  buttonMinTiles: 10,     // el botón tampoco
  buttonExitMinTiles: 6,  // ni justo al lado de la salida
};

// El día que salen las skins nuevas (Elora, el 7-11-2026: "faltan 3 días"): el cartel del lobby cuenta los días que faltan
// (Elora, 9-11-2026: el estreno se mueve al primer día de la fiesta del Día del Niño; antes era el martes 10)
export const SKINS_DIA = '2026-11-15';
// ...y la hora (Elora: "después de comer"; las 16:00; el día es el domingo 15). A esa hora (la del aparato de quien
// juega) las skins de pijama salen solas en la tienda de Tarda, para comprarlas con monedas, y el cartel se quita.
export const SKINS_HORA = '16:00';
// Para que salgan ya sin esperar a la hora, poner true. Para probarlo: index.html?skins=1
export const SKINS_LISTAS = false;
// La hora de ahora para el juego. Para probar otra: index.html?ahora=2026-11-10T15:58:30
let desfase = 0;
try {
  const p = new URLSearchParams(location.search).get('ahora');
  if (p && !isNaN(new Date(p))) desfase = new Date(p) - Date.now();
} catch (e) { /* nada */ }
export function ahoraJuego() { return new Date(Date.now() + desfase); }
// Cuándo salen las skins (fecha y hora)
export function horaSkins() {
  const [a, m, d] = SKINS_DIA.split('-').map(Number), [h, mi] = SKINS_HORA.split(':').map(Number);
  return new Date(a, m - 1, d, h, mi);
}
// ¿Ya han salido las skins? (con index.html?skins=1, sí, para probarlo)
// La ropa nueva (skins de Clad para Elora): sale «mañana más o menos antes del cole, por la mañana» (Elora): el
// martes 10-11-2026 a las 8:00 [PROVISIONAL la hora]. Hasta entonces, un cartel en el lobby cuenta lo que falta.
// Para probarla ya: index.html?ropa=1
export const ROPA_SALE = '2026-11-10T08:00:00';
export function horaRopa() { return new Date(ROPA_SALE); }
export function ropaLista(ahora = ahoraJuego()) {
  try { if (new URLSearchParams(location.search).get('ropa') === '1') return true; } catch (e) { /* nada */ }
  return ahora >= horaRopa();
}
export function skinsListas(ahora = ahoraJuego()) {
  if (SKINS_LISTAS) return true;
  try { if (new URLSearchParams(location.search).get('skins') === '1') return true; } catch (e) { /* nada */ }
  return ahora >= horaSkins();
}
// El evento de Navidad (Elora): el árbol de Navidad en el lobby, el calendario, la nieve... Empieza el 5 de diciembre
// (Elora; antes el 21) y termina el 30 de diciembre (Elora).
// Para verlo antes de tiempo: index.html?navidad=1
// cartelDesde: el día que sale el cartel «¡La Navidad se acerca!» con la cuenta atrás hasta 'desde' (Elora:
// el día después de poner las skins de pijama para todos). null = todavía no. Para verlo: index.html?cartelnavidad=1
// destaparChop: si el primer día del evento, en el cartel de cerca, la silueta de Chop se destapa (Elora: no, sigue
// siendo secreto hasta que lo ganes en el calendario)
// desde: Elora lo cambió del 21 al 5 de diciembre (8-11-2026)
// Las fechas son mes-día: la Navidad se repite igual todos los años (Elora: "que la próxima Navidad pase lo mismo").
export const NAVIDAD = { desde: '12-05', hasta: '12-30', cartelDesde: '11-09', destaparChop: false };   // cartel: desde el 9 de noviembre (Elora, 9-11-2026: «se pueden 3», con los otros dos carteles; antes desde el 16)
// La fiesta del Día del Niño (Elora): del 15 al 20 de noviembre, todos los años. El lobby de fiesta de pijamas,
// Tarda en pijama, los Bloodies con gorro de dormir y el comentario del pijama al empezar un pasillo.
// Para probarlo: index.html?dianino=1
export const DIA_NINO = { desde: '11-15', hasta: '11-20' };
// La guerra de almohadas contra los Bloodies (Elora), solo en la fiesta del Día del Niño. tiempo: los segundos que hay
// que aguantar para ganar; 0 = sin tiempo, dura hasta que te eliminan (Elora; antes 1 minuto); vidasTuyas: tus vidas, con cualquier personaje
// (Elora: 5; antes eran las de tu personaje); vidasBloodie: las almohadas que aguanta cada Bloodie (Elora: 1; antes 3);
// monedasBloodie: lo que da cada uno que derrotas (Elora: 5); tiroBloodie: cada cuántos segundos tira una almohada
// cada Bloodie (Elora: cada 10 s y a veces 5: tiroRapido; antes entre 1,4 y 2,6); probRapido: cuántas veces es a los
// 5 s [PROVISIONAL: 3 de cada 10]. Lo demás [PROVISIONAL]
export const ALMOHADAS = {
  tiempo: 0, vidasTuyas: 5, vidasBloodie: 1, monedasBloodie: 5, aLaVez: 2,
  velocidadJugador: 190, velocidadBloodies: 85, velocidadTuya: 430, velocidadBloodie: 240,
  recargaTuya: 0.35, tiroBloodie: 10, tiroRapido: 5, probRapido: 0.3,
};
// En Navidad, el taller de Papá Noel (MAPA_NAVIDAD en maps.js) sale al azar: 1 de cada 5 pasillos más o menos (Elora)
// (para probarlo: index.html?taller=1, que lo saca siempre en Navidad)
export const MAPA_NAVIDAD_PROB = typeof location !== 'undefined' && /[?&]taller=1/.test(location.search) ? 1 : 0.2;   // cartel: en 2026, el día después de las skins (Elora)
// La fecha de este año (o del año que se diga) de una de esas fechas: fechaNavidad('desde') → Date
export function fechaNavidad(clave, anio = ahoraJuego().getFullYear()) {
  const [m, d] = NAVIDAD[clave].split('-').map(Number);
  return new Date(anio, m - 1, d);
}
// La nieve de los pasillos en Navidad (Elora): montones de nieve en el suelo; si los pisas vas más despacio,
// y los Bloodies también (Elora: "un 20 %"). Solo en Navidad (o con el modo Navidad), no en el Bonus.
// lento: la velocidad encima de la nieve (0.8 = un 20 % más despacio).
// cadaCasillas: sale un montón por cada tantas casillas de suelo [PROVISIONAL]; radio: lo grande que es
// cada montón, en casillas [PROVISIONAL].
export const NIEVE = { lento: 0.8, cadaCasillas: 45, radio: [1.2, 2.4] };

// El minijuego del árbol de Navidad (idea del padre de Elora; lo pensó Elora): los adornos salen por los pasillos
// en Navidad (de 5 a 10 por pasillo, Elora) y al poner la punta cada punto es 1 moneda (Elora).
//   rareza: % de que un adorno valga 1, 2, 3, 5 o 10 puntos (Elora: los puntos dicen lo raro que es) [PROVISIONAL los %]
//   precioPunta: lo que cuesta en la tienda de Tarda cada cosa para la punta (menos la estrella, gratis) (Elora)
export const ARBOL = {
  porPasillo: [5, 10],
  rareza: { 1: 45, 2: 22, 3: 15, 5: 12, 10: 6 },
  monedasPorPunto: 1,
  precioPunta: 50,
  // las cosas grandes para debajo del árbol (Elora: de 10 a 50 puntos): % de que un adorno sea una cosa grande,
  // y de las grandes, % de cada valor [PROVISIONAL]
  grandes: { prob: 8, rareza: { 10: 45, 20: 25, 30: 15, 40: 10, 50: 5 } },
  precioMaceta: 50,   // cada color de la maceta en la tienda de Tarda (la marrón, gratis) [PROVISIONAL el precio]
  puntosMaceta: 3,    // cada color da 3 puntos, solo la primera vez que terminas el árbol con él (Elora)
};
// El calendario de Adviento del lobby (Elora): sale durante el evento de Navidad. Ver src/adviento.js.
// grande: del 5 al 25 de diciembre (Elora, 8-11-2026: 21 casillas, en páginas de 7); 20 monedas cada día y, si
// abres todas, el personaje secreto (Chop, id 'reno'). chico: del 26 al 30; si abres los 5, 50 monedas más el
// regalo del finde (30 monedas y 3 cintas).
// precioRecuperar: lo que cuesta abrir un día que se te pasó (Elora: 1.000 monedas).
export const ADVIENTO = {
  precioRecuperar: 1000,
  grande: { primerDia: '12-05', dias: 21, porPagina: 7, monedasCadaDia: 20, personaje: 'reno', siYaLoTienes: 100 },   // si ya tienes a Chop (de otro año): 100 monedas (Elora)   // (mes-día: cada año)
  chico: { primerDia: '12-26', dias: 5, premioMonedas: 50, findeMonedas: 30, findeCintas: 3 },
};
export const BONUS_EVERY = 5;   // cada cuántos pasillos toca el Bonus
// El pasillo de Drake (Elora): en el pasillo 50 hay un mapa inmenso (dos hojas de Elora) sin Bloodies.
// Cada 30 s el Drake Sangriento sube volando y escupe fuego: tienes 10 s para meterte en un hueco con
// naranja o en la zona verde; si no, te quita 3 corazones. Hay 5 botones que abren la supersalida.
// Al escapar, Drake aparece en la tienda de Tarda por 200 monedas.
export const DRAKE = {
  level: 50,        // en qué pasillo está (Elora)
  price: 200,       // lo que cuesta Drake en la tienda después de escapar (Elora)
  damage: 3,        // corazones que quita el fuego si te pilla fuera (Elora)
  fireEvery: 30,    // segundos entre fuego y fuego (Elora)
  warn: 10,         // segundos que tienes para esconderte desde que sale el aviso (Elora)
  fireTime: 1.5,    // lo que dura el fuego en pantalla [PROVISIONAL]
  flyTime: 2.5,     // lo que tarda Drake en subir volando y en irse [PROVISIONAL]
  size: 10,         // el Drake Sangriento es 10 veces más grande que un Bloody normal (Elora)
  anxiety: 3,       // ansiedad por segundo si Drake viene y aún no te has escondido (Elora: "un poco") [PROVISIONAL]
  buttonsApart: 8,  // casillas mínimas entre botón y botón, para que estén repartidos [PROVISIONAL]
};
export const CONTINUE_EVERY = 5;      // cada cuántos niveles sale "¿continuar o salir?"
export const LIGHT_RADIUS_TILES = 6;  // hasta dónde ves en la oscuridad
export const DOOR_CLOSE_DELAY = 1.6;  // segundos hasta que la puerta de entrada se cierra
