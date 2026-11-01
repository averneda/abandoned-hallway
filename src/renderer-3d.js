// 3D presentation only: Game remains the authority for movement and collisions.
import * as THREE from '../vendor/three.module.js';
import { TILE } from './config.js';
import { T } from './level.js';

export class Renderer3D {
  constructor(canvas) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.setSize(960, 600, false);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera = new THREE.PerspectiveCamera(40, 960 / 600, 0.1, 65);
    this.boxGeo = new THREE.BoxGeometry(1, 1, 1);
    this.ballGeo = new THREE.SphereGeometry(1, 12, 8);
    this.materials = new Map();
    this.actorMeshes = new Map();
    this.itemMeshes = new Map();
    this.doors = [];
  }
  material(color, glow = false) {
    const key = color + ':' + glow;
    if (!this.materials.has(key)) this.materials.set(key, new THREE.MeshStandardMaterial({
      color, roughness: .85, emissive: glow ? color : 0x000000, emissiveIntensity: glow ? .5 : 0,
    }));
    return this.materials.get(key);
  }
  shape(parent, geometry, color, x, y, z, sx, sy, sz, glow = false) {
    const mesh = new THREE.Mesh(geometry, this.material(color, glow));
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); parent.add(mesh); return mesh;
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
    this.scene.background = new THREE.Color('#0b1419');
    this.scene.fog = new THREE.Fog('#0b1419', 19, 34);
    this.scene.add(new THREE.HemisphereLight('#c7e2e6', '#302c36', 1.25));
    const sun = new THREE.DirectionalLight('#c4d4f4', 2);
    sun.position.set(-6, 12, 5); this.scene.add(sun);
    this.light = new THREE.PointLight('#ffe3ab', 14, 10, 2); this.scene.add(this.light);
    const L = game.level;
    const world = new THREE.Group();
    const rgb = a => '#' + a.map(v => v.toString(16).padStart(2, '0')).join('');
    const wallColor = rgb(L.theme.wall), floorColor = rgb(L.theme.floor);
    // Shared geometry/materials keep this small static map inexpensive.
    for (let z = 0; z < L.h; z++) for (let x = 0; x < L.w; x++) {
      const t = L.tiles[z * L.w + x], X = x + .5, Z = z + .5;
      if (t !== T.WALL) {
        const color = L.theme.floorColors ? rgb(L.theme.floorColors[(x + z) % L.theme.floorColors.length]) : floorColor;
        this.box(world, color, X, -.07, Z, .97, .12, .97);
      }
      if (t === T.WALL) {
        // Low cutaway walls retain the original narrow corridors and visibility.
        this.box(world, wallColor, X, .48, Z, 1, .96, 1);
        this.box(world, '#7b9483', X, .98, Z, 1.02, .06, 1.02);
        if ((x * 7 + z) % 6 === 0) this.box(world, '#c2cfbe', X, .55, Z + .505, .62, .17, .02);
      } else if (t === T.OBSTACLE || t === T.BLOCK) {
        const h = t === T.BLOCK ? 1.05 : .42;
        this.box(world, t === T.BLOCK ? '#9d3544' : '#b8793f', X, h / 2, Z, .92, h, .92);
        this.box(world, '#dec09a', X, h + .025, Z, .94, .05, .94);
        this.box(world, '#503b36', X, h / 2, Z + .465, .75, .04, .02);
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
    this.actorMeshes.set(game.player, this.actor(game.ch, false));
    for (const e of game.enemies) this.actorMeshes.set(e, this.actor(e.look, true));
  }
  actor(ch, bloody) {
    const g = new THREE.Group(), body = bloody ? '#a33049' : ch.color, dark = bloody ? '#59283c' : ch.dark;
    const limbs = [];
    this.ball(g, body, 0, .45, 0, .26, .32, .22);
    this.ball(g, body, 0, .83, 0, .28, .26, .25);
    for (const side of [-1, 1]) {
      limbs.push(this.ball(g, dark, side * .16, .13, .04, .12, .16, .18));
      this.ball(g, body, side * .29, .47, 0, .09, .21, .1);
      this.ball(g, bloody ? '#ffcfc0' : '#ffffff', side * .105, .87, .216, .068, .082, .045);
      this.ball(g, '#18262e', side * .105, .865, .253, .028, .044, .018);
    }
    this.ball(g, bloody ? '#432036' : '#ce9293', 0, .76, .25, .055, .04, .035);
    if (ch.shape === 'rabbit') for (const s of [-1, 1]) {
      const ear = this.ball(g, body, s * .14, 1.18, 0, .085, .3, .09); ear.rotation.z = s * -.12;
      this.ball(g, bloody ? '#582139' : '#dba6a6', s * .14, 1.2, .073, .04, .2, .025);
    }
    if (['cat', 'dragon'].includes(ch.shape)) for (const s of [-1, 1]) this.ball(g, dark, s * .2, 1.06, 0, .09, .15, .08);
    if (['lizard', 'crocodile', 'dragon'].includes(ch.shape)) {
      this.ball(g, dark, 0, .25, -.35, .12, .12, .4);
      this.ball(g, body, 0, .76, .28, .2, .12, .21);
    }
    if (['octopus', 'jellyfish', 'tardigrade'].includes(ch.shape)) for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3;
      this.ball(g, dark, Math.cos(angle) * .25, .16, Math.sin(angle) * .25, .09, .18, .09);
    }
    this.scene.add(g); g.userData.limbs = limbs; return g;
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
    this.camera.position.set(x, 12.5, z + 9.3);
    this.camera.lookAt(x, 0, z - .7);
    this.light.position.set(x, 2.5, z);
    for (const [e, mesh] of this.actorMeshes) {
      const jump = e === p && p.jumping && p.jump > 0 ? Math.sin((1 - p.jump / game.jumpTime) * Math.PI) * .85 : 0;
      mesh.position.set(e.x / TILE, jump, e.y / TILE);
      mesh.rotation.y = { down: 0, up: Math.PI, left: -Math.PI / 2, right: Math.PI / 2 }[e.facing];
      mesh.userData.limbs.forEach((limb, i) => { limb.position.y = .13 + Math.sin(e.walk + i * Math.PI) * .06; });
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
