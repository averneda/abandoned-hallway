// 3D presentation only: Game remains the authority for movement and collisions.
// Estilo de dibujos animados (Elora: "un 3D como el de los juegos de Roblox de dibujos"): colores vivos,
// sombreado por escalones (toon), sin contorno negro (Elora), personajes cabezones con ojos
// grandes, y la cámara más cerca, detrás del personaje.
import * as THREE from '../vendor/three.module.js';
import { TILE } from './config.js';
import { T } from './level.js';

// el día de las skins nuevas (el mismo que SKINS_DIA del juego 2D)
const SKINS_DIA = [2026, 11, 15];
const BORDES = false;   // la raya negra alrededor de personajes y cosas (Elora: mejor sin ella)

// Los colores de cada personaje, de sus fichas (Elora).
const LOOKS = {
  carot: { forma: 'rabbit', piel: '#f7b48f', ropa: '#ef9cc0', oscuro: '#f7b48f', oreja: '#f7c9b0' },
  froggy: { forma: 'frog', piel: '#7cc36a', ropa: '#6fd0c4', oscuro: '#5aa04a' },
  oct: { forma: 'octopus', piel: '#7fd0ec', ropa: '#8b5cc8' },
  tarda: { forma: 'tardigrade', piel: '#b07c52', oscuro: '#7a5232' },
  gek: { forma: 'lizard', piel: '#98cc84', ropa: '#a9abb0', oscuro: '#6fae5a' },
  drake: { forma: 'dragon', piel: '#ee7a4a', ropa: '#ee7a4a', oscuro: '#b64c26' },
  draila: { forma: 'crocodile', piel: '#3f9a4a', ropa: '#e2405c', oscuro: '#2f7a3a' },
  katy: { forma: 'cat', piel: '#f08a3c', ropa: '#fbf0a8', oscuro: '#c0561c' },
  jely: { forma: 'jellyfish', piel: '#3f9fe0', cabeza: '#a9e4e2' },
  tardaGris: { forma: 'tardigrade', piel: '#a9a8ad', oscuro: '#74737a' },   // la Tarda de la tienda, gris (Elora)
  hoppy: { forma: 'hare', piel: '#c49a7a', ropa: '#d8344a', oscuro: '#93694c', oreja: '#f2d23c' },
};

export class Renderer3D {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.setSize(960, 600, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera = new THREE.PerspectiveCamera(62, 960 / 600, 0.05, 60);
    // sombreado de dibujos: tres escalones de luz
    const pasos = new Uint8Array([90, 170, 255]);
    this.toon = new THREE.DataTexture(pasos, pasos.length, 1, THREE.RedFormat);
    this.toon.minFilter = this.toon.magFilter = THREE.NearestFilter; this.toon.needsUpdate = true;
    this.contorno = new THREE.MeshBasicMaterial({ color: '#141018', side: THREE.BackSide });
    this.boxGeo = new THREE.BoxGeometry(1, 1, 1);
    this.ballGeo = new THREE.SphereGeometry(1, 12, 8);
    this.materials = new Map();
    this.actorMeshes = new Map();
    this.itemMeshes = new Map();
    this.doors = [];
    this.yaw = 0;   // hacia dónde mira la cámara (0 = hacia arriba del mapa)
  }
  material(color, glow = false) {
    const key = color + ':' + glow;
    if (!this.materials.has(key)) this.materials.set(key, new THREE.MeshToonMaterial({
      color, gradientMap: this.toon, emissive: glow ? color : 0x000000, emissiveIntensity: glow ? .55 : 0,
    }));
    return this.materials.get(key);
  }
  shape(parent, geometry, color, x, y, z, sx, sy, sz, glow = false) {
    const mesh = new THREE.Mesh(geometry, this.material(color, glow));
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); parent.add(mesh); return mesh;
  }
  // el contorno negro de dibujo: una copia un poco más grande, vista por dentro
  // Elora prefiere sin bordes negros: BORDES = false (la función se queda por si los quiere otra vez)
  borde(mesh, grosor = .045) {
    if (!BORDES) return mesh;
    const b = new THREE.Mesh(mesh.geometry, this.contorno);
    const s = mesh.scale;
    b.scale.set(1 + grosor / Math.max(s.x, .05), 1 + grosor / Math.max(s.y, .05), 1 + grosor / Math.max(s.z, .05));
    mesh.add(b); return mesh;
  }
  box(parent, color, x, y, z, sx, sy, sz, glow = false) {
    return this.shape(parent, this.boxGeo, color, x, y, z, sx, sy, sz, glow);
  }
  ball(parent, color, x, y, z, sx, sy, sz, glow = false) {
    return this.shape(parent, this.ballGeo, color, x, y, z, sx, sy, sz, glow);
  }
  build(game) {
    if (this.scene) this.scene.traverse(object => { if (object.isInstancedMesh) object.dispose(); });
    this.game = game;
    this.actorMeshes.clear(); this.itemMeshes.clear(); this.doors = []; this.button = null;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#2a1d3d');
    this.scene.fog = new THREE.Fog('#2a1d3d', 7, 19);
    this.scene.add(new THREE.HemisphereLight('#fff1dc', '#5b4a7a', 1.6));
    const sun = new THREE.DirectionalLight('#ffffff', 1.6);
    sun.position.set(-5, 12, 7); this.scene.add(sun);
    this.light = new THREE.PointLight('#ffd98a', 10, 9, 2); this.scene.add(this.light);
    const L = game.level;
    const world = new THREE.Group();
    const rgb = a => '#' + a.map(v => v.toString(16).padStart(2, '0')).join('');
    // colores más vivos que en 2D, como en los dibujos animados
    const viva = (a, k = 1.25) => rgb(a.map((v) => Math.min(255, Math.round(v * k))));
    const wallColor = viva(L.theme.wall, 1.6), wallTop = viva(L.theme.wall, 2.4), floorColor = viva(L.theme.floor, 1.05);
    // Shared geometry/materials keep this small static map inexpensive.
    // en el lobby, la estantería de las cintas (V) no se dibuja como pared: allí van la tele y la caja
    const estante = new Set(((L.lobby && L.markers.V) || []).map((v) => v.ty * L.w + v.tx));
    for (let z = 0; z < L.h; z++) for (let x = 0; x < L.w; x++) {
      const t = L.tiles[z * L.w + x], X = x + .5, Z = z + .5;
      if (estante.has(z * L.w + x)) { this.box(world, floorColor, X, -.07, Z, .97, .12, .97); continue; }
      if (t !== T.WALL) {
        const color = L.theme.floorColors ? rgb(L.theme.floorColors[(x + z) % L.theme.floorColors.length]) : floorColor;
        this.box(world, color, X, -.07, Z, .97, .12, .97);
      }
      if (t === T.WALL) {
        // Low cutaway walls retain the original narrow corridors and visibility.
        this.box(world, wallColor, X, .6, Z, 1, 1.2, 1);
        this.box(world, wallTop, X, 1.22, Z, 1.0, .05, 1.0);        // la parte de arriba, más clarita
        this.box(world, '#f2e7c9', X, .12, Z, 1.01, .1, 1.01);     // el rodapié clarito
        if ((x * 7 + z) % 6 === 0) this.box(world, '#ffd36b', X, .8, Z + .505, .5, .32, .02);   // un cartelito
      } else if (t === T.OBSTACLE || t === T.BLOCK) {
        const h = t === T.BLOCK ? 1.05 : .42;
        this.box(world, t === T.BLOCK ? '#e0384e' : '#ff9a3c', X, h / 2, Z, .9, h, .9);
        this.box(world, t === T.BLOCK ? '#ff7b8a' : '#ffc27a', X, h + .02, Z, .9, .04, .9);   // la tapa, más clarita
        this.box(world, '#ffe2b8', X, h / 2, Z + .455, .7, .05, .02);
      } else if ([T.DOOR_START, T.EXIT_CLOSED, T.EXIT_OPEN].includes(t)) {
        const g = new THREE.Group(); g.position.set(X, 0, Z); this.scene.add(g);
        this.box(g, '#283f45', -.44, .75, 0, .12, 1.5, .25);
        this.box(g, '#283f45', .44, .75, 0, .12, 1.5, .25);
        this.box(g, '#283f45', 0, 1.48, 0, 1, .13, .25);
        const panel = this.box(g, '#425c61', 0, .7, 0, .76, 1.4, .14);
        const lamp = this.box(g, '#f15e61', 0, 1.48, .15, .5, .06, .04, true);
        this.doors.push({ index: z * L.w + x, panel, lamp, start: t === T.DOOR_START });
      } else if (t === T.BUTTON || t === T.BUTTON_PRESSED) {
        this.box(world, '#36444d', X, .3, Z, .5, .6, .5);
        this.button = this.box(this.scene, '#ff695c', X, .64, Z, .35, .08, .35, true);
      }
    }
    for (const d of L.decals) this.ball(world, '#772838', d.x / TILE, .005, d.y / TILE, d.r / TILE, .018, d.r / TILE * .7);
    // Combine repeated static geometry into instanced draws, including floor tiles.
    const batches = new Map();
    world.updateMatrixWorld(true);
    for (const mesh of world.children) {
      const key = mesh.geometry.uuid + mesh.material.uuid;
      if (!batches.has(key)) batches.set(key, []);
      batches.get(key).push(mesh);
    }
    for (const meshes of batches.values()) {
      const batch = new THREE.InstancedMesh(meshes[0].geometry, meshes[0].material, meshes.length);
      meshes.forEach((mesh, i) => batch.setMatrixAt(i, mesh.matrixWorld));
      batch.instanceMatrix.needsUpdate = true;
      this.scene.add(batch);
    }
    if (L.lobby) this.lobby(L);
    this.actorMeshes.set(game.player, this.actor(game.ch, false, this.lookId));
    for (const e of game.enemies) this.actorMeshes.set(e, this.actor(e.look, true));
  }
  // Las cosas del lobby (Elora): Tarda gris detrás de su mostrador, la tele marrón y la caja de cartón
  // con las cintas, la puerta a los pasillos (bordes rojos y luz ámbar) y el cartel de las skins.
  lobby(L) {
    this.scene.background = new THREE.Color('#3a2b3f');
    this.scene.fog = new THREE.Fog('#3a2b3f', 12, 26);
    this.light.intensity = 6;
    const lamp = new THREE.PointLight('#ffcf8a', 8, 14, 1.6); lamp.position.set(L.w / 2, 3.2, L.h / 2); this.scene.add(lamp);
    // Tarda y su mostrador
    for (const n of L.markers.N || []) {
      const X = n.tx + .5, Z = n.ty + .5;
      const tarda = this.actor({ id: 'tardaGris', shape: 'tardigrade' }, false, 'tardaGris');
      tarda.position.set(X, 0, Z - .1); tarda.scale.setScalar(1.15);
      this.box(this.scene, '#8a5a34', X, .38, Z + .55, 1.5, .76, .4);       // el mostrador
      this.box(this.scene, '#b07a48', X, .78, Z + .55, 1.6, .06, .5);       // la tabla de arriba
      for (const k of [-.2, 0, .2]) this.ball(this.scene, '#ffd95a', X + .45 + k * .3, .83, Z + .55, .07, .03, .07, true);   // monedas
    }
    // la tele marrón y la caja de cartón con las cintas
    const V = L.markers.V || [];
    if (V.length) {
      const a = V[0], b = V[V.length - 1];
      const tx = a.tx + .9, tz = a.ty + .5;
      this.box(this.scene, '#e9dfc3', tx, .25, tz, 1.1, .5, .7);            // el mueble
      this.box(this.scene, '#8b5a2b', tx, .82, tz, 1, .7, .55);             // la tele
      this.box(this.scene, '#6fd0c4', tx, .84, tz + .28, .72, .48, .02, true);   // la pantalla
      for (const s2 of [-1, 1]) { const ant = this.box(this.scene, '#333', tx + s2 * .18, 1.32, tz, .03, .35, .03); ant.rotation.z = s2 * -.4; }
      const cx = b.tx + .2, cz = b.ty + .5;
      this.box(this.scene, '#c99a5b', cx, .3, cz, .8, .6, .6);              // la caja
      this.box(this.scene, '#e6b878', cx, .62, cz + .2, .8, .04, .25);      // una solapa abierta
      for (let i = 0; i < 3; i++) this.box(this.scene, '#242c39', cx - .2 + i * .2, .64, cz, .14, .1, .3);   // las cintas asomando
    }
    // la puerta a los pasillos: abierta, con los bordes rojos y una luz ámbar
    for (const d of L.markers.D || []) {
      const X = d.tx + .5, Z = d.ty + .5, g = new THREE.Group(); g.position.set(X, 0, Z); this.scene.add(g);
      this.box(g, '#b3202a', -.46, .8, 0, .1, 1.6, .3); this.box(g, '#b3202a', .46, .8, 0, .1, 1.6, .3); this.box(g, '#b3202a', 0, 1.6, 0, 1.02, .12, .3);
      this.box(g, '#120c14', 0, .78, -.1, .82, 1.56, .08);
      this.box(g, '#ffd35a', 0, 1.72, .12, .4, .1, .06, true);
      const luz = new THREE.PointLight('#ffd35a', 4, 4, 2); luz.position.set(X, 1.4, Z + .6); this.scene.add(luz);
      // el cartel de las skins, colgado en la pared a la izquierda de la puerta (Elora)
      const lienzo = document.createElement('canvas'); lienzo.width = 256; lienzo.height = 104;
      const c = lienzo.getContext('2d');
      c.fillStyle = '#a8733f'; c.fillRect(0, 0, 256, 104); c.fillStyle = '#8c5d30'; c.fillRect(0, 50, 256, 4);
      c.strokeStyle = '#5a3d26'; c.lineWidth = 8; c.strokeRect(0, 0, 256, 104);
      c.fillStyle = '#fff6dc'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.font = 'bold 30px system-ui, sans-serif';
      const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
      const faltan = Math.round((new Date(SKINS_DIA[0], SKINS_DIA[1] - 1, SKINS_DIA[2]) - hoy) / 86400000);
      c.fillText('¡Nuevas skins!', 128, 27);
      c.fillText(faltan > 1 ? `Faltan ${faltan} días` : faltan === 1 ? 'Falta 1 día' : '¡YA ES LA HORA!', 128, 78);
      const tex = new THREE.CanvasTexture(lienzo); tex.colorSpace = THREE.SRGBColorSpace;
      const cartel = new THREE.Mesh(new THREE.PlaneGeometry(1.7, .7), new THREE.MeshBasicMaterial({ map: tex }));
      cartel.position.set(X - 1.6, .95, Z + .52); this.scene.add(cartel);
    }
  }
  // Los personajes de Elora, en dibujo 3D: cabezones, con ojos grandes y sus colores de la ficha.
  actor(ch, bloody, lookId) {
    const L = LOOKS[lookId || ch.id] || { piel: ch.color, ropa: ch.dark, forma: ch.shape };
    const g = new THREE.Group(), cuerpo = new THREE.Group(); g.add(cuerpo);
    const piel = bloody ? '#b8202b' : L.piel, ropa = bloody ? '#5e0810' : (L.ropa || L.piel);
    const oscuro = bloody ? '#5e0810' : (L.oscuro || L.piel);
    const bola = (color, x, y, z, sx, sy, sz, conBorde = true) => { const m = this.ball(cuerpo, color, x, y, z, sx, sy, sz); if (conBorde) this.borde(m); return m; };
    const limbs = [];
    // piernas y pies
    if (!['octopus', 'jellyfish'].includes(L.forma)) for (const side of [-1, 1]) limbs.push(bola(oscuro, side * .13, .1, .03, .1, .11, .14));
    // cuerpo (la ropa) y brazos
    if (L.forma === 'jellyfish') bola(piel, 0, .3, 0, .3, .32, .3);
    else if (L.forma === 'tardigrade') bola(piel, 0, .5, 0, .27, .45, .24);
    else bola(ropa, 0, .38, 0, .25, .27, .21);
    if (!['jellyfish', 'tardigrade'].includes(L.forma)) for (const side of [-1, 1]) {
      const brazo = bola(piel, side * .28, .4, 0, .075, .17, .08); brazo.rotation.z = side * .35;
    }
    // la cabeza grande
    const hy = L.forma === 'tardigrade' ? 1.02 : .86;
    const cabeza = bola(L.cabeza || piel, 0, hy, 0, .34, .31, .31);
    // los ojos grandes, con su brillo (de Bloodie, amarillos)
    for (const side of [-1, 1]) {
      this.ball(cuerpo, bloody ? '#ffe36b' : '#ffffff', side * .12, hy + .03, .25, .085, .1, .05);
      this.ball(cuerpo, '#141018', side * .12, hy + .02, .29, .045, .06, .025);
      if (!bloody) this.ball(cuerpo, '#ffffff', side * .12 + .02, hy + .05, .305, .015, .018, .01);
    }
    this.ball(cuerpo, '#141018', 0, hy - .12, .28, .05, .025, .02);   // la boquita
    // lo de cada uno
    const f = L.forma;
    if (f === 'rabbit' || f === 'hare') for (const side of [-1, 1]) {
      const caida = f === 'rabbit' && side < 0;
      const oreja = bola(piel, side * .14, hy + .38, -.02, .08, .26, .07); oreja.rotation.z = caida ? 1.1 : side * -.12;
      if (caida) oreja.position.set(-.3, hy + .2, -.02);
      if (!bloody) { const dentro = this.ball(cuerpo, L.oreja || '#f7c9b0', oreja.position.x, oreja.position.y, .045, .04, .17, .03); dentro.rotation.z = oreja.rotation.z; }
    }
    if (f === 'rabbit' && !bloody) { bola('#d63a7a', -.16, hy + .26, .1, .1, .07, .06); bola('#d63a7a', -.02, hy + .29, .1, .1, .07, .06); }
    if (f === 'cat') for (const side of [-1, 1]) { const o = bola(piel, side * .2, hy + .3, 0, .09, .13, .07); o.rotation.z = side * -.3; this.ball(cuerpo, bloody ? oscuro : '#a9a2e6', side * .23, hy + .4, 0, .04, .05, .04); }
    if (f === 'frog') for (const side of [-1, 1]) bola(piel, side * .16, hy + .28, .05, .11, .1, .1);
    if (['lizard', 'crocodile', 'dragon', 'cat'].includes(f)) bola(oscuro, 0, .25, -.3, .09, .09, .3);   // la cola
    if (f === 'crocodile' || f === 'dragon') { bola(piel, 0, hy - .1, .3, .2, .1, .17); for (let i = -1; i <= 1; i++) this.ball(cuerpo, '#ffffff', i * .07, hy - .15, .44, .025, .04, .02); }
    if (f === 'dragon') for (const side of [-1, 1]) { const ala = bola(oscuro, side * .35, .55, -.12, .25, .16, .03); ala.rotation.z = side * .5; bola('#fff4c2', side * .14, hy + .32, 0, .04, .1, .04); }
    if (f === 'octopus' || f === 'jellyfish') for (let i = 0; i < 6; i++) {
      const ang = i * Math.PI / 3; limbs.push(bola(f === 'jellyfish' ? (L.cabeza || piel) : piel, Math.cos(ang) * .22, .08, Math.sin(ang) * .22, .07, .13, .07));
    }
    if (f === 'octopus' && !bloody) for (const side of [-1, 1]) { const gafa = this.ball(cuerpo, '#141018', side * .12, hy + .03, .27, .1, .11, .02); gafa.material = this.material('#141018'); gafa.renderOrder = -1; }
    if (f === 'tardigrade') for (let i = 0; i < 3; i++) for (const side of [-1, 1]) limbs.push(bola(piel, side * .3, .3 + i * .17, 0, .1, .06, .08));
    this.scene.add(g); g.userData.limbs = limbs; g.userData.cuerpo = cuerpo; return g;
  }
  item(it) {
    const g = new THREE.Group();
    if (it.type === 'tape') {
      this.box(g, '#242c39', 0, 0, 0, .45, .28, .13);
      this.box(g, '#e4dcc0', 0, .04, .075, .36, .09, .025);
      for (const x of [-.11, .11]) this.ball(g, '#abb6b8', x, -.06, .08, .055, .055, .02);
    } else if (it.type === 'coin') {
      this.ball(g, '#ffd061', 0, 0, 0, .17, .2, .05, true);
    } else if (it.type === 'heart') {
      for (const x of [-.07, .07]) this.ball(g, '#ff4c76', x, .04, 0, .12, .12, .08, true);
      const bottom = this.box(g, '#ff4c76', 0, -.04, 0, .17, .17, .1, true); bottom.rotation.z = Math.PI / 4;
    } else this.ball(g, it.type === 'stamina' ? '#2fe0a6' : '#e4af69', 0, 0, 0, .16, .16, .16, true);
    this.scene.add(g); this.itemMeshes.set(it, g); return g;
  }
  render(game) {
    if (game !== this.game) this.build(game);
    const p = game.player, x = p.x / TILE, z = p.y / TILE;
    // la cámara, detrás del personaje y mirando hacia donde mira él (Elora). Si detrás hay una pared,
    // se acerca para no meterse dentro.
    const fx = Math.sin(this.yaw), fz = -Math.cos(this.yaw), L = game.level;
    let dist = 3.4;
    for (let d = .3; d <= 3.4; d += .1) {
      const tx = Math.floor(x - fx * d), tz = Math.floor(z - fz * d);
      const tt = tx < 0 || tz < 0 || tx >= L.w || tz >= L.h ? T.WALL : L.tiles[tz * L.w + tx];
      if (tt === T.WALL || tt === T.DOOR_START || tt === T.EXIT_CLOSED) { dist = Math.max(.35, d - .25); break; }
    }
    const alto = 1.25 + dist * .32;
    const want = { x: x - fx * dist, y: alto, z: z - fz * dist };
    this.cam = this.cam ? { x: this.cam.x + (want.x - this.cam.x) * .25, y: this.cam.y + (want.y - this.cam.y) * .25, z: this.cam.z + (want.z - this.cam.z) * .25 } : want;
    this.camera.position.set(this.cam.x, this.cam.y, this.cam.z);
    this.camera.lookAt(x + fx * 1.8, .75, z + fz * 1.8);
    this.light.position.set(x, 2.5, z);
    for (const [e, mesh] of this.actorMeshes) {
      const jump = e === p && p.jumping && p.jump > 0 ? Math.sin((1 - p.jump / game.jumpTime) * Math.PI) * .85 : 0;
      mesh.position.set(e.x / TILE, jump, e.y / TILE);
      if (e === p) {
        // el personaje mira hacia donde anda (de espaldas a la cámara al ir hacia delante)
        if (p.moving) this.angJugador = Math.atan2(p.vx || 0, p.vy || 0);
        if (this.angJugador == null) this.angJugador = Math.PI;
        mesh.rotation.y = this.angJugador;
      } else mesh.rotation.y = { down: 0, up: Math.PI, left: -Math.PI / 2, right: Math.PI / 2 }[e.facing];
      mesh.userData.limbs.forEach((limb, i) => { limb.userData.y0 ??= limb.position.y; limb.position.y = limb.userData.y0 + Math.max(0, Math.sin(e.walk + i * Math.PI)) * .06; });
      // andando, el cuerpo bota un poquito, como en los dibujos
      mesh.userData.cuerpo.position.y = Math.abs(Math.sin(e.walk)) * .04;
      mesh.visible = e !== p || p.invuln <= 0 || Math.floor(game.time * 12) % 2 === 0;
    }
    for (const it of game.level.items) {
      // Expired coin-rush items never allocate a mesh.
      const mesh = this.itemMeshes.get(it) || (!it.taken ? this.item(it) : null);
      if (!mesh) continue;
      mesh.visible = !it.taken;
      mesh.position.set(it.x / TILE, .38 + Math.sin(game.time * 3 + it.x) * .06, it.y / TILE);
      mesh.rotation.y = game.time * 1.3;
    }
    for (const door of this.doors) {
      const open = door.start ? !game.doorClosed : game.level.tiles[door.index] === T.EXIT_OPEN;
      door.panel.visible = !open;
      door.lamp.material = this.material(open ? '#89ffc8' : '#f15e61', true);
    }
    if (this.button) this.button.material = this.material(game.buttonPressed ? '#89ffc8' : '#ff695c', true);
    this.renderer.render(this.scene, this.camera);
  }
}
