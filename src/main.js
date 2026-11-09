// Arranque del juego y paso entre pantallas: menú → lobby → (cinemática) → pasillos.

import { VIEW_W, VIEW_H, CONTINUE_EVERY, COINS, DRAKE, ADVIENTO, NAVIDAD, skinsListas, ropaLista, ARBOL } from './config.js';
import { loadLang, t } from './i18n.js';
import { Input } from './input.js';
import { UI, tapeName } from './ui.js';
import { Game } from './game.js';
import { Lobby, cancionLobby, cancionPasillo, esNavidad, esDiaNino } from './lobby.js';
import { GuerraAlmohadas } from './almohadas.js';
import { Intro } from './intro.js';
import { Title } from './title.js';
import { TouchControls } from './touch.js';
import { music } from './music.js';
import { characterById, conSkin, SKINS } from './characters.js';
import { abrir as abrirAdviento, estadoVacio as advientoVacio, estadoDeEsteAnio } from './adviento.js';
import { arbolVacio, puntosNuevos, adorno, PUNTAS, MACETAS, MACETA_GRATIS } from './adornos.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const input = new Input();
const ui = new UI(document.getElementById('ui'), input);
const touch = new TouchControls(input);   // botones en pantalla, solo en móviles y tablets

loadLang();

// Lo que se recuerda entre partidas: personajes, monedas, cintas totales y personaje elegido.
// El progreso de los pasillos NO se guarda.
// Carot y Froggy son los personajes iniciales: se pueden elegir desde el principio (Elora).
const unlocked = new Set(['carot', 'froggy']);
const wallet = { coins: 0, tapes: 0 };
// tus récords de la guerra de almohadas (Elora): el tiempo que más has aguantado, los Bloodies que más has
// eliminado en una partida y los jugadores (para cuando haya online)
const recordAlm = { tiempo: 0, bloodies: 0, jugadores: 0 };
// La caja de cintas del lobby (Elora): los números de las cintas depositadas en la tienda de Tarda.
// Las demás cintas que tienes están en el inventario. Se pueden recuperar desde la caja.
const cajaCintas = new Set();
// drakeEnTienda: ya escapaste del pasillo de Drake y Drake está en la tienda (Elora)
// modoPijama: se puso el código del modo pijama (Elora): las skins de pijama salen en la tienda, gratis
// modoNavidad: se puso el código del modo Navidad (Elora): lobby de Navidad y el reno gratis
// modoBloodies: se puso el código de la actualización de los Bloodies (Elora): salen ya los Bloodies especiales
const flags = { introSeen: false, tutorialSeen: false, lobbySeen: false, drakeEnTienda: false, modoPijama: false, modoNavidad: false, modoBloodies: false };
// La skin que lleva puesta cada personaje (id del personaje → skin). Se ven en el modo pijama o, desde que
// salen las skins (Elora: martes 10 a las 16:00), si la has comprado.
const skinsElegidas = {};
// Las skins compradas con monedas (id del personaje → lista de skins)
const skinsCompradas = {};
const comprada = (id, skin) => !!(skinsCompradas[id] && skinsCompradas[id].includes(skin));
// las de Navidad (SKINS[...].navidad), de momento solo con el modo Navidad y gratis (Elora)
const esDeNavidad = (skin) => !!(SKINS[skin] && SKINS[skin].navidad);
// las de Navidad: gratis con el modo Navidad, o compradas (se venden solo en Navidad, Elora). Una que compraste es tuya
// y te la puedes poner también fuera de Navidad [PROVISIONAL]
// las de pijama: con el modo pijama, o compradas desde el estreno; las demás (la ropa nueva), si las has comprado
const esDePijama = (skin) => skin === 'pijama';
const tieneSkin = (id, skin) => esDeNavidad(skin) ? flags.modoNavidad || comprada(id, skin) : esDePijama(skin) ? flags.modoPijama || (skinsListas() && comprada(id, skin)) : comprada(id, skin);
const hayNavidadComprada = () => Object.values(skinsCompradas).some((l) => l.some(esDeNavidad));
// El calendario de Adviento (Elora): qué casillas has abierto y si ya te dieron los regalos finales
let adviento = advientoVacio();
// El minijuego del árbol de Navidad (idea del padre de Elora): los adornos que has cogido en los pasillos, cómo
// está el árbol del lobby y las cosas para la punta que tienes (la estrella siempre; las demás, de la tienda)
const adornosInv = {};
let arbol = arbolVacio();
const puntasTuyas = new Set(['estrella']);
const macetasTuyas = new Set([MACETA_GRATIS]);   // los colores de la maceta que tienes (la marrón, gratis: Elora)
// Los personajes que tienes: los comprados y, gratis y sin guardarlo, el reno en el modo Navidad y Drake en el
// modo pijama (Elora: para probar su pijama)
function tienes() {
  const extra = [];
  if (flags.modoNavidad) extra.push('reno');
  if (flags.modoPijama) extra.push('drake');
  return extra.length ? new Set([...unlocked, ...extra]) : unlocked;
}
function aplicarSkin(ch) { const s = skinsElegidas[ch.id]; return conSkin(ch, s && tieneSkin(ch.id, s) ? s : null); }
const run = { character: characterById('carot'), level: 1, tapes: 0 };
try {
  for (const id of JSON.parse(localStorage.getItem('holeway.unlocked') || '[]')) unlocked.add(id);
  wallet.coins = parseInt(localStorage.getItem('holeway.coins') || '0', 10) || 0;
  wallet.tapes = parseInt(localStorage.getItem('holeway.tapes') || '0', 10) || 0;
  const caja = localStorage.getItem('holeway.tapeBox');
  if (caja == null) {
    // partida de antes de la caja: las cintas que ya tenías estaban en la caja del lobby y ahí siguen [PROVISIONAL]
    for (let i = 1; i <= wallet.tapes; i++) cajaCintas.add(i);
  } else for (const n of JSON.parse(caja)) if (n >= 1 && n <= wallet.tapes) cajaCintas.add(n);
  flags.introSeen = localStorage.getItem('holeway.introSeen') === '1';
  flags.tutorialSeen = localStorage.getItem('holeway.tutorialSeen') === '1';
  flags.lobbySeen = localStorage.getItem('holeway.lobbySeen') === '1';
  flags.drakeEnTienda = localStorage.getItem('holeway.drakeEnTienda') === '1';
  flags.modoPijama = localStorage.getItem('holeway.modoPijama') === '1';
  flags.modoNavidad = localStorage.getItem('holeway.modoNavidad') === '1';
  flags.modoBloodies = localStorage.getItem('holeway.modoBloodies') === '1';
  Object.assign(skinsElegidas, JSON.parse(localStorage.getItem('holeway.skins') || '{}'));
  Object.assign(skinsCompradas, JSON.parse(localStorage.getItem('holeway.skinsCompradas') || '{}'));
  // el calendario de este año (los de antes de 2027 no guardaban el año: eran de 2026)
  const guardado = JSON.parse(localStorage.getItem('holeway.adviento') || 'null');
  if (guardado && guardado.anio == null) guardado.anio = 2026;
  adviento = estadoDeEsteAnio(guardado ? { ...advientoVacio(2026), ...guardado } : null);
  for (const [id, n] of Object.entries(JSON.parse(localStorage.getItem('holeway.adornos') || '{}'))) if (adorno(id) && n > 0) adornosInv[id] = n;
  const arbolGuardado = JSON.parse(localStorage.getItem('holeway.arbol') || 'null');
  if (arbolGuardado && Array.isArray(arbolGuardado.adornos)) arbol = { ...arbolVacio(), ...arbolGuardado, adornos: arbolGuardado.adornos.filter((a) => adorno(a.id)) };
  for (const id of JSON.parse(localStorage.getItem('holeway.puntas') || '[]')) if (PUNTAS.includes(id)) puntasTuyas.add(id);
  for (const id of JSON.parse(localStorage.getItem('holeway.macetas') || '[]')) if (MACETAS[id]) macetasTuyas.add(id);
  if (!macetasTuyas.has(arbol.maceta)) arbol.maceta = MACETA_GRATIS;
  Object.assign(recordAlm, JSON.parse(localStorage.getItem('holeway.recordAlmohadas') || '{}'));
  const chId = localStorage.getItem('holeway.character');
  if (chId && tienes().has(chId)) run.character = aplicarSkin(characterById(chId));
} catch (e) { /* nada */ }
function save() {
  try {
    localStorage.setItem('holeway.unlocked', JSON.stringify([...unlocked]));
    localStorage.setItem('holeway.coins', String(wallet.coins));
    localStorage.setItem('holeway.tapes', String(wallet.tapes));
    localStorage.setItem('holeway.tapeBox', JSON.stringify([...cajaCintas].sort((a, b) => a - b)));
    localStorage.setItem('holeway.character', run.character.id);
    localStorage.setItem('holeway.introSeen', flags.introSeen ? '1' : '0');
    localStorage.setItem('holeway.tutorialSeen', flags.tutorialSeen ? '1' : '0');
    localStorage.setItem('holeway.lobbySeen', flags.lobbySeen ? '1' : '0');
    localStorage.setItem('holeway.drakeEnTienda', flags.drakeEnTienda ? '1' : '0');
    localStorage.setItem('holeway.modoPijama', flags.modoPijama ? '1' : '0');
    localStorage.setItem('holeway.modoNavidad', flags.modoNavidad ? '1' : '0');
    localStorage.setItem('holeway.modoBloodies', flags.modoBloodies ? '1' : '0');
    localStorage.setItem('holeway.skins', JSON.stringify(skinsElegidas));
    localStorage.setItem('holeway.skinsCompradas', JSON.stringify(skinsCompradas));
    localStorage.setItem('holeway.adviento', JSON.stringify(adviento));
    localStorage.setItem('holeway.adornos', JSON.stringify(adornosInv));
    localStorage.setItem('holeway.arbol', JSON.stringify(arbol));
    localStorage.setItem('holeway.puntas', JSON.stringify([...puntasTuyas]));
    localStorage.setItem('holeway.macetas', JSON.stringify([...macetasTuyas]));
    localStorage.setItem('holeway.recordAlmohadas', JSON.stringify(recordAlm));
  } catch (e) { /* nada */ }
}

let scene = null; // objeto con update(dt, input) y render(ctx), o null

// Monedas de práctica del lobby ya cogidas: vuelven a salir cuando escapas de un pasillo,
// para que no se puedan sacar monedas infinitas entrando y saliendo del lobby.
const practiceTaken = new Set();

// Lo que comparten el lobby y los pasillos.
const common = {
  onCoin: (k) => { wallet.coins += k; save(); },
  onTape: () => { wallet.tapes += 1; save(); },
  onAdorno: (id) => { adornosInv[id] = (adornosInv[id] || 0) + 1; save(); },   // un adorno para el árbol (Elora)
  totalCoins: () => wallet.coins,
  totalTapes: () => wallet.tapes,
  cintasEnCaja: () => cajaCintas.size,
};
// Las cintas del inventario (las que no están en la caja), en orden.
function inventarioCintas() { const r = []; for (let i = 1; i <= wallet.tapes; i++) if (!cajaCintas.has(i)) r.push(i); return r; }
function cintasDeLaCaja() { return [...cajaCintas].sort((a, b) => a - b); }

// ---------------- ajuste al tamaño de la ventana
function fit() {
  const s = Math.min(window.innerWidth / VIEW_W, window.innerHeight / VIEW_H);
  document.getElementById('stage').style.transform = `translate(-50%, -50%) scale(${s})`;
}
window.addEventListener('resize', fit);
fit();

// ---------------- pantallas
function gotoMenu() {
  scene = new Title();   // el cartel de Elora, dibujado en el canvas
  music.stop();
  ui.showMenu({
    // La cinemática sale al principio, la primera vez, y lleva al lobby.
    onPlay: () => { if (flags.introSeen) gotoLobby(); else gotoIntro(); },
    onPad: () => ui.showPadSetup({ input, onClose: gotoMenu }),
    // la actualización de los Bloodies (Elora): con su código salen ya los Bloodies especiales
    bloodies: { activo: () => flags.modoBloodies, cambiar: (on) => { flags.modoBloodies = on; save(); } },
    // el modo pijama secreto (Elora): se pone y se quita con el código
    pijama: {
      activo: () => flags.modoPijama,
      cambiar: (on) => {
        flags.modoPijama = on;
        // al quitarlo, si llevabas a Drake sin haberlo comprado, vuelves a Carot
        run.character = aplicarSkin(tienes().has(run.character.id) ? run.character : characterById('carot'));
        save();
      },
    },
    // el modo Navidad secreto (Elora): lobby de Navidad y el reno gratis; al quitarlo, si llevabas el reno
    // y no lo has ganado, vuelves a Carot
    navidad: {
      activo: () => flags.modoNavidad,
      cambiar: (on) => {
        flags.modoNavidad = on;
        if (!tienes().has(run.character.id)) run.character = aplicarSkin(characterById('carot'));
        save();
      },
    },
  });
}

// abrir: 'almohadas' para volver a la pantalla de la guerra de almohadas al terminar una partida
function gotoLobby(abrir) {
  const lobby = new Lobby(run.character, {
    ...common,
    practiceTaken,
    onPause: () => {
      lobby.paused = true;
      ui.showPause({ menuLabel: 'pause.mainMenu', onResume: () => { ui.clear(); lobby.paused = false; input.clear(); }, onMenu: gotoMenu });
    },
    onShop: () => {
      lobby.paused = true;
      const close = () => { ui.clear(); lobby.paused = false; input.clear(); };
      // la tienda de Tarda (dibujo de Elora): Depositar cintas o Cambiar personaje
      const menu = () => ui.showTarda({ onDeposit: depositar, onCharacters: () => open(), onPuntas: esNavidad() ? puntas : null, onClose: close });
      // en Navidad, las cosas para la punta del árbol y los colores de la maceta (Elora: para siempre)
      const puntas = () => ui.showPuntas({
        tienes: puntasTuyas, macetas: macetasTuyas, monedas: () => wallet.coins, precio: ARBOL.precioPunta, precioMaceta: ARBOL.precioMaceta,
        onComprar: (tipo, id) => {
          if (tipo === 'maceta') { wallet.coins -= ARBOL.precioMaceta; macetasTuyas.add(id); }
          else { wallet.coins -= ARBOL.precioPunta; puntasTuyas.add(id); }
          save(); puntas();
          ui.toast((tipo === 'maceta' ? '🎨 ' : '⭐ ') + t(tipo === 'maceta' ? 'puntas.compradaMaceta' : 'puntas.comprada', { name: t(tipo + '.' + id) }));
        },
        onBack: menu,
      });
      const depositar = () => ui.showDeposit({
        inventario: inventarioCintas(),
        onDeposit: (nums) => {
          for (const n of nums) cajaCintas.add(n);
          save();
          ui.toast('📦 ' + t('deposit.done', { n: nums.length }));
          depositar();
        },
        onBack: menu,
      });
      // focusId: a quién señalar al abrir (tras comprar, al recién comprado)
      const open = (focusId) => ui.showShop({
        unlocked: tienes(), coins: wallet.coins, current: run.character, focusId,
        // los secretos no salen hasta que los tienes (el reno: ganándolo en el calendario o en el modo Navidad)
        secretos: flags.drakeEnTienda ? new Set(['reno']) : new Set(['drake', 'reno']),
        onChoose: (ch) => { run.character = aplicarSkin(ch); save(); lobby.setCharacter(run.character); close(); },
        // las skins: en el modo pijama, gratis y de todos; desde que salen (martes 10, 16:00), se compran con
        // monedas, solo de los personajes que tienes. Si es el personaje que llevas, se lo pone ya
        // las skins salen siempre: la ropa nueva se vende todo el año (Elora)
        skins: {
          gratis: (skin) => esDeNavidad(skin) ? flags.modoNavidad : esDePijama(skin) ? flags.modoPijama : false,
          // la ropa nueva, desde que sale (Elora: el martes 10 por la mañana)
          disponible: (skin) => esDeNavidad(skin) || (esDePijama(skin) ? flags.modoPijama || skinsListas() : ropaLista()),
          // de qué personajes se enseñan: en el modo pijama o Navidad, de todos (gratis); si no, solo de los tuyos
          // las de Navidad: en Navidad, de tus personajes (se compran); con el modo Navidad, de todos (gratis); y las que ya tienes
          puede: (id, skin) => esDeNavidad(skin) ? flags.modoNavidad || comprada(id, skin) || (esNavidad() && tienes().has(id)) : esDePijama(skin) ? flags.modoPijama || tienes().has(id) : tienes().has(id),
          tiene: (id, skin) => tieneSkin(id, skin),
          monedas: () => wallet.coins,
          comprar: (ch, skin, precio) => {
            wallet.coins -= precio;
            (skinsCompradas[ch.id] = skinsCompradas[ch.id] || []).push(skin);
            skinsElegidas[ch.id] = skin;
            if (ch.id === run.character.id) { run.character = aplicarSkin(ch); lobby.setCharacter(run.character); }
            save(); open(ch.id);
            ui.toast(SKINS[skin].emoji + ' ' + t('skins.comprada', { name: ch.name }));
          },
          elegida: (id) => { const s = skinsElegidas[id]; return s && tieneSkin(id, s) ? s : null; },
          elegir: (ch, skin) => {
            if (skin) skinsElegidas[ch.id] = skin; else delete skinsElegidas[ch.id];
            if (ch.id === run.character.id) { run.character = aplicarSkin(ch); lobby.setCharacter(run.character); }
            save();
            // al ponértela sale su mini comentario, si tiene (Elora)
            const kFrase = 'skins.frase.' + skin + '.' + ch.id;
            if (skin) ui.toast(SKINS[skin].emoji + ' ' + (t(kFrase) !== kFrase ? ch.name + ': ' + t(kFrase) : t(SKINS[skin].navidad ? 'skins.toastNav' : 'skins.toast', { name: ch.name })));
          },
        },
        onBuy: (ch) => { wallet.coins -= ch.price; unlocked.add(ch.id); save(); open(ch.id); ui.toast('⭐ ' + t('select.bought', { name: ch.name })); },
        onClose: menu,
      });
      menu();
    },
    onTapes: () => {
      lobby.paused = true;
      const verCaja = () => ui.showTapes({
        caja: cintasDeLaCaja(),
        onRecover: (n) => { cajaCintas.delete(n); save(); ui.toast('🎒 ' + t('tapes.recovered', { name: tapeName(n) })); verCaja(); },
        onClose: () => { ui.clear(); lobby.paused = false; input.clear(); },
      });
      verCaja();
    },
    // el calendario de Adviento (Elora): abrir la casilla de hoy y darte lo que toque
    // el cartel de las skins, de cerca (Elora)
    onCartel: (cual) => {
      lobby.paused = true;
      const onClose = () => { lobby.paused = false; input.clear(); };
      if (cual === 'navidad') ui.showCartelNavidad({ onClose, destapaChop: NAVIDAD.destaparChop });
      else if (cual === 'ropa') ui.showCartelRopa({ onClose });
      else ui.showCartel({ onClose });
    },
    onAdviento: () => {
      lobby.paused = true;
      ui.showAdviento({
        estado: adviento,
        monedas: () => wallet.coins,
        precio: ADVIENTO.precioRecuperar,
        tieneChop: () => unlocked.has(ADVIENTO.grande.personaje),
        // fecha: un día que se te pasó y recuperas por 1.000 monedas (Elora)
        onAbrir: (cual, fecha) => {
          if (fecha && wallet.coins < ADVIENTO.precioRecuperar) return '';
          const p = abrirAdviento(cual, adviento, undefined, fecha);
          if (!p) return '';
          if (fecha) wallet.coins -= ADVIENTO.precioRecuperar;
          // si ya tenías a Chop (de otro año), el regalo final son 100 monedas (Elora)
          const yaLoTenias = p.personaje && unlocked.has(p.personaje);
          const extra = yaLoTenias ? ADVIENTO.grande.siYaLoTienes : 0;
          wallet.coins += extra;
          wallet.coins += p.monedas;
          wallet.tapes += p.cintas;                         // las cintas van al inventario
          if (p.personaje) unlocked.add(p.personaje);       // el personaje secreto: Chop
          save();
          if (p.final === 'grande' && yaLoTenias) return (p.monedas ? t('adv.monedas', { n: p.monedas }) + ' ' : '') + t('adv.finalGrandeYa', { n: ADVIENTO.grande.dias, m: extra });
          if (p.final === 'grande') return (p.monedas ? t('adv.monedas', { n: p.monedas }) + ' ' : '') + t('adv.finalGrande', { n: ADVIENTO.grande.dias }) + ' ' + t('adv.finalGrandeLuego');
          if (p.final === 'chico') return t('adv.finalChico');
          if (fecha) return t('adv.recuperado');
          return p.monedas ? t('adv.monedas', { n: p.monedas }) : t('adv.guardado');
        },
        onClose: () => { ui.clear(); lobby.paused = false; input.clear(); },
      });
    },
    // la guerra de almohadas contra los Bloodies (Elora): en la fiesta del Día del Niño, en el montón de almohadas
    // la guerra de almohadas (Elora): primero su pantalla, con JUGAR, ONLINE (más adelante) y tus récords
    onAlmohadas: () => {
      lobby.paused = true;
      ui.showAlmohadas({
        record: recordAlm,
        onJugar: () => {
          ui.clear();
          scene = new GuerraAlmohadas(run.character, {
            onCoin: (n) => { wallet.coins += n; save(); },
            // al acabar: se apuntan los récords y se dice cuáles son nuevos
            onFin: ({ tiempo, bloodies }) => {
              const nuevos = [];
              if (tiempo > recordAlm.tiempo) { recordAlm.tiempo = tiempo; nuevos.push('tiempo'); }
              if (bloodies > recordAlm.bloodies) { recordAlm.bloodies = bloodies; nuevos.push('bloodies'); }
              save();
              return nuevos;
            },
            onSalir: () => gotoLobby('almohadas'),
          });
          music.play('alegre');
          input.clear();
        },
        onClose: () => { ui.clear(); lobby.paused = false; input.clear(); },
      });
    },
    // el árbol de Navidad (Elora): cómo está, para dibujarlo, y el minijuego de decorarlo
    arbol: () => arbol,
    onArbol: () => {
      lobby.paused = true;
      ui.showArbol({
        arbol, inventario: adornosInv, puntas: puntasTuyas, macetas: macetasTuyas,
        onGuardar: save,
        onTerminar: (punta) => {
          // los adornos nuevos se cobran: 1 punto = 1 moneda (Elora); los que ya estaban no vuelven a dar
          const n = puntosNuevos(arbol, ARBOL.puntosMaceta) * ARBOL.monedasPorPunto;
          for (const a of arbol.adornos) a.pagado = true;
          arbol.macetasCobradas = [...new Set([...(arbol.macetasCobradas || []), arbol.maceta])];   // el color, solo una vez
          if (arbol.luces) arbol.luces.pagado = true;
          arbol.punta = punta;
          wallet.coins += n;
          save();
          return n;
        },
        onClose: () => { ui.clear(); lobby.paused = false; input.clear(); },
      });
    },
    onStart: () => startLevel(1),
  });
  scene = lobby;
  music.play(cancionLobby());   // musiquilla del lobby (en Navidad, la de Navidad), pedidas por Elora
  ui.clear();
  // Tarda saluda la primera vez que entras al lobby.
  if (!flags.lobbySeen) {
    lobby.paused = true;
    ui.showDialogue([t('lobby.welcome')], () => { lobby.paused = false; input.clear(); flags.lobbySeen = true; save(); });
  } else if (abrir === 'almohadas' && lobby.monton) {
    // al acabar una guerra de almohadas, vuelves a su pantalla, al lado del montón
    lobby.player.x = lobby.monton.x - 40; lobby.player.y = lobby.monton.y;
    lobby.cb.onAlmohadas();
  }
}

// La cinemática se ve al empezar a jugar y termina llevándote al lobby.
function gotoIntro() {
  const done = () => { flags.introSeen = true; save(); gotoLobby(); };
  music.stop();
  scene = new Intro(run.character, done);
  ui.showIntro({ onSkip: () => { if (!scene.finished) { scene.finished = true; done(); } } });
}

function startLevel(n, reintento = false) {
  run.level = n;
  if (n === 1) run.tapes = 0;
  // Los corazones que pierdes se quedan perdidos al pasar de pasillo; solo se curan cogiendo corazones
  // (Elora). Al empezar en el pasillo 1 (desde el lobby) se empieza con todos. Al reintentar un pasillo,
  // con los que tenías al entrar en él.
  if (n === 1 && !reintento) run.hearts = null;
  const game = new Game(run.character, n, {
    ...common,
    startHearts: run.hearts,
    nieve: esNavidad(),   // en Navidad, montones de nieve en los pasillos (Elora)
    navidad: esNavidad(), // y los Bloodies con gorrito de Papá Noel (Elora)
    adornos: esNavidad(), // y adornos para el árbol del lobby (Elora)
    diaNino: esDiaNino(), // la fiesta del Día del Niño (Elora): Bloodies con gorro de dormir y el comentario del pijama
    // Tarda explicando el pasillo de Drake (Elora)
    onDialogue: (lines) => {
      game.paused = true;
      ui.showDialogue(lines, () => { game.paused = false; input.clear(); });
    },
    onPause: () => {
      game.paused = true;
      ui.showPause({ onResume: () => { ui.clear(); game.paused = false; input.clear(); }, onMenu: () => gotoLobby() });
    },
    onDeath: (reason) => {
      music.stop();
      ui.showGameOver({
        reason, level: n, tapes: run.tapes + game.tapes, coins: wallet.coins,
        onRetry: () => startLevel(n, true),
        onMenu: () => gotoLobby(),
      });
    },
    onComplete: ({ tapes }) => {
      practiceTaken.clear();
      run.hearts = game.player.hearts;   // pasan al pasillo siguiente tal cual
      run.tapes += tapes;
      wallet.coins += COINS.levelBonus;
      // escapaste del pasillo de Drake: Drake ya está en la tienda de Tarda (Elora)
      const drakeNuevo = n === DRAKE.level && !flags.drakeEnTienda;
      if (n === DRAKE.level) flags.drakeEnTienda = true;
      save();
      if (drakeNuevo) ui.toast('🐉 ' + t('msg.drakeShop', { n: DRAKE.price }));
      if (n % CONTINUE_EVERY === 0) {
        scene = null;
        ui.showContinue({ level: n, tapes: run.tapes, coins: wallet.coins, onContinue: () => startLevel(n + 1), onExit: () => gotoLobby() });
      } else {
        startLevel(n + 1);
        scene.say(t('msg.levelBonus', { n: COINS.levelBonus }), 3);
      }
    },
  });
  scene = game;
  // Musiquilla de miedo en los pasillos (en Navidad, la de miedo de Navidad) y alegre en el Bonus.
  game.musica = cancionPasillo();
  music.play(game.level.noButton ? 'alegre' : game.musica);
  ui.clear();
  // Tarda explica el juego la primera vez que entras al pasillo 1.
  if (n === 1 && !flags.tutorialSeen) {
    game.paused = true;
    const lines = [1, 2, 3, 4, 5].map((i) => t('tutorial.' + i));
    if (run.character.ability) lines.push(t('tutorial.ability') + ' ' + t('select.ability.' + run.character.ability) + '.');
    ui.showDialogue(lines, () => { game.paused = false; input.clear(); flags.tutorialSeen = true; save(); });
  }
}

// ---------------- bucle principal
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  input.pollPad();
  if (ui.padTick) ui.padTick();
  else ui.padNavigate();
  // los botones táctiles se esconden cuando hay un menú o diálogo abierto (los avisos no cuentan)
  if (touch.enabled) touch.setVisible(!ui.root.querySelector('.screen, .dialog:not(.toast)'));
  if (scene) {
    scene.update(dt, input);
    if (scene) scene.render(ctx);
  } else {
    ctx.fillStyle = '#07060a';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  input.endFrame();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Gancho para pruebas automáticas (no afecta al juego).
window.holewayDebug = { get scene() { return scene; }, run, unlocked, wallet, flags, gotoLobby, startLevel, music, input, touch, adornosInv, get arbol() { return arbol; }, puntasTuyas, macetasTuyas };

// Atajo para ver una grabación directamente, sin buscar la cinta en los pasillos:
// index.html?cinta=1 (lo usa ver-cinta.bat). Primero hay que pulsar el botón, para que el
// navegador deje sonar las voces y el "ffffff". Al salir, se va al menú.
const cintaDirecta = parseInt(new URLSearchParams(location.search).get('cinta') || '0', 10);
// Atajo para probar un pasillo directamente: index.html?pasillo=50 (el pasillo de Drake). Empiezas
// con el personaje que tengas elegido; al salir o morir vuelves al lobby, como siempre.
const pasilloDirecto = parseInt(new URLSearchParams(location.search).get('pasillo') || '0', 10);
if (cintaDirecta) {
  ui.showTapeDirect(cintaDirecta, () => { location.href = location.pathname; });
} else if (pasilloDirecto > 0) {
  flags.introSeen = true; flags.lobbySeen = true; flags.tutorialSeen = true;
  history.replaceState(null, '', location.pathname);   // para que al recargar no vuelva a entrar
  startLevel(pasilloDirecto);
} else {
  gotoMenu();
}
