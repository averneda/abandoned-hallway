// Mapas dibujados a mano. Cada letra es una casilla. Se pueden editar aquí directamente.
//
//   #  pared              .  suelo
//   R  rojo: trasto que NO se puede saltar (bloquea a todos)
//   O  naranja: trasto que el jugador puede saltar (los Bloodies no)
//   E  puerta de entrada    P  donde aparece el jugador    s  donde aparece un Bloodie
//   X  puerta de salida posible (hay varias; en cada partida se abre una, las demás son pared)
//   t  cinta   f  comida (baja ansiedad)   h  comida especial (+1 corazón)   c  moneda
//      De estos solo cuenta CUÁNTOS hay: en cada partida se reparten por sitios al azar,
//      salvo que el mapa tenga fixedItems: true (entonces se quedan donde están dibujados).
//   Solo en el lobby:  N  Tarda (tienda)   V  estantería de cintas   D  puerta a los pasillos
//
// Nivel 1 — El Colegio. Hecho a partir del dibujo de Elora (assets/referencias/escenarios/nivel-1-el-colegio.jpeg).

// El lobby: donde eliges personaje con Tarda, ves tus cintas y entras a los pasillos.
export const LOBBY = {
  lobby: true,
  name: { es: 'Lobby', en: 'Lobby' },
  theme: { floor: [96, 84, 76], wall: [52, 40, 36], grout: 'rgba(0,0,0,0.2)' },
  rows: [
    '##########################',
    '##########DD##############',
    '#..VVV...........N.......#',
    '#........................#',
    '#........................#',
    '#........................#',
    '#........................#',
    '#..........P.............#',
    '#........................#',
    '#....RR..........RR......#',
    '#........................#',
    '##########################',
  ],
};

// El Bonus: sale cada 5 pasillos. No hay Bloodies ni botón; las puertas ya están abiertas
// y los premios se quedan donde los dibujó Elora. Es la cara de un gato, simétrica.
export const BONUS = {
  name: { es: 'Bonus', en: 'Bonus' },
  noButton: true,
  fixedItems: true,
  // Lluvia de monedas al empezar: salen varias a la vez, duran unos segundos y se van.
  coinRush: { duration: 20, every: 4, life: 4, count: 6 },
  // Paredes negras y suelo de colores, como pidió Elora.
  theme: {
    wall: [14, 12, 18],
    floor: [150, 150, 160],
    floorColors: [[214, 106, 122], [232, 170, 86], [236, 224, 120], [126, 200, 128], [110, 172, 226], [176, 136, 216]],
    grout: 'rgba(0,0,0,0.28)',
  },
  // Es la cara de un gato y es simétrica: las orejas arriba, los ojos rojos,
  // la nariz en el centro (por ahí entras) y tres bigotes a cada lado con un premio al final.
  rows: [
    '########################################',
    '#######X###############X################',
    '######....###########....###############',
    '######.R..###########..R.###############',
    '######OOOO###########OOOO###############',
    '######...................###############',
    '######...................###############',
    '######...RRRR.....RRRR...###############',
    '######...RRRR.....RRRR...###############',
    '#.h..O...RRRR.....RRRR...O..t.##########',
    '######..e.............e..###############',
    'X....O....t....E....t....O....X#########',
    '######........OPO........###############',
    '#.f..O.........O.........O..c.##########',
    '######...................###############',
    '######...................###############',
    '########################################',
    '########################################',
    '########################################',
    '########################################',
    '########################################',
    '########################################',
    '########################################',
    '########################################',
    '########################################',
  ],
};

export const MAPS = {
  2: {
    name: { es: 'El Centro Comercial', en: 'The Mall' },
    theme: { floor: [195, 185, 170], wall: [60, 52, 48], grout: 'rgba(0,0,0,0.16)' },
    rows: [
      '########################################',
      '##############X########E################',
      '##...........s.........P.....###########',
      '##.c..#.tX.#............##.c..X.########',
      '##....#....#............##....O.########',
      '##c.OO#....#............##......########',
      '########.........RRRRR..........########',
      '##f......##......RRRRR........e.....c.##',
      '##f..s...##..t...RRRRR................##',
      '##...######..s...RRRRR...........c..####',
      '##c..........c..c........e.....c......##',
      '##.....c.##....##..........##.........##',
      '##..c.######..c..##.........############',
      '####.........h..c..............c......##',
      '####..X..####X####..............c..X..##',
      '####..........t............##c..O..e..##',
      '##c..........t.............##.........##',
      '##################...........e..########',
      '########################################',
    ],
  },
  1: {
    name: { es: 'El Colegio', en: 'The School' },
    // Suelo beige y paredes verdes, como pidió Elora.
    theme: { floor: [206, 190, 156], wall: [46, 82, 48], grout: 'rgba(0,0,0,0.22)' },
    rows: [
      '########################################',
      '#.......t.e..................t.........#',
      '#...........t..##X####.................#',
      '#.t............#O....#....t............#',
      '#...##########.#Os...#.t...............#',
      '#...#..t.....#.#..RRR#............t....#',
      '#...#..R....O#.#.....#.c...###..####...#',
      '#...#.......O..#c....#.....#.RRR...#...#',
      '#...#R.c.s..O..#..RR.#.....#.......#c..#',
      '#...#........#.......#c....#.......#...#',
      '#...#...c....#.......#.....#....cR.#...#',
      '#...#.....O..#.#.....#c....#.R.R...X...#',
      '#...#.....Oc.#.#O....#.......RsR.R.#...#',
      '#..c####.X####.##..###.......R.R...#...#',
      '#..c......e.............c..#.......#...#',
      '#........c...###..####.....#.......#...#',
      '#c.###..######...OO..#.....#......O#.c.#',
      '#..#....#...##...OO..#.....#c.....O#...#',
      '#..#....#......f.....#.....#.......#...#',
      '#f.X...O#............#....f#.......#...#',
      '#..#...O#.RR##RRR....#f....#..RRR..#...#',
      '#..#...O....##h.....P#.....#########...#',
      '#..##X##############E#.....h...........#',
      '#.............................e........#',
      '########################################',
    ],
  },
};
