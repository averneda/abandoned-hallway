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
  tarda: { time: 8, slow: 0.7, cooldown: 22 },
  // Katy: pinta a TODOS los Bloodies del mapa de azul fosforito (el color de su mancha).
  // Es un mini-localizador: dura poco, pero te dice dónde están todos, estén donde estén.
  katy: { time: 3, cooldown: 10 },
};

export const COINS = {
  levelBonus: 10,  // monedas al terminar un nivel
};

export const LEVEL = {
  cellsW: 9,          // "habitaciones" de la cuadrícula a lo ancho
  cellsH: 7,          // ... y a lo alto
  corridor: 3,        // ancho de los pasillos en casillas
  loops: 0.20,        // probabilidad de abrir pasillos extra (más caminos)
  rooms: 2,           // zonas abiertas grandes
  enemiesBase: 2,     // Sangrientos en el nivel 1
  enemiesPerLevel: 0.6, // cuántos más por nivel
  enemiesMax: 9,
  tapes: 4,           // cintas por nivel
  food: 3,            // bolitas de comida por nivel
  hearts: 1,          // comidas especiales (+1 corazón) por nivel
  coins: 8,           // monedas por nivel
  stamina: 3,         // bolitas de estamina por nivel
  obstacles: 6,       // trastos que hay que saltar
  bloodDecals: 14,    // manchas de sangre (dibujada)
  debrisDecals: 18,   // cosas rotas por el suelo
};

// Distancias mínimas al repartir al azar el botón y la puerta en los mapas dibujados.
// Están en casillas, medidas en línea recta desde donde entra el jugador.
export const MAP_RANDOM = {
  exitMinTiles: 14,       // la salida nunca sale pegada a la entrada
  buttonMinTiles: 10,     // el botón tampoco
  buttonExitMinTiles: 6,  // ni justo al lado de la salida
};

export const BONUS_EVERY = 5;   // cada cuántos pasillos toca el Bonus
export const CONTINUE_EVERY = 5;      // cada cuántos niveles sale "¿continuar o salir?"
export const LIGHT_RADIUS_TILES = 6;  // hasta dónde ves en la oscuridad
export const DOOR_CLOSE_DELAY = 1.6;  // segundos hasta que la puerta de entrada se cierra
