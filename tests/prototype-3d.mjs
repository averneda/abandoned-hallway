// Run: node --test tests/prototype-3d.mjs
// Exercises the shared game and real Three scene graph; no GPU/browser mock claims.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.js';
import { Renderer3D } from '../src/renderer-3d.js';
import { Game, collides } from '../src/game.js';
import { characterById } from '../src/characters.js';
import { generateLevel, T } from '../src/level.js';
import { TILE } from '../src/config.js';

globalThis.document = { createElement: () => ({ getContext: () => ({ setTransform() {} }) }) };
globalThis.window = {};
const idle = { axis: () => ({ x: 0, y: 0 }), isDown: () => false, wasPressed: () => false };
function setup(n = 1) {
  const events = { coins: 0, tapes: 0, complete: false, death: false };
  const game = new Game(characterById('carot'), generateLevel(n, 301), {
    onCoin: k => { events.coins += k; }, onTape: () => { events.tapes++; },
    totalCoins: () => events.coins, onPause() {},
    onDeath: () => { events.death = true; }, onComplete: () => { events.complete = true; },
  });
  game.n = n;
  const view = Object.create(Renderer3D.prototype);
  Object.assign(view, {
    renderer: { render() {} }, camera: new THREE.PerspectiveCamera(40, 1.6, .1, 65),
    boxGeo: new THREE.BoxGeometry(1, 1, 1), ballGeo: new THREE.SphereGeometry(1, 12, 8),
    materials: new Map(), actorMeshes: new Map(), itemMeshes: new Map(), doors: [],
  });
  return { game, view, events };
}

test('School, mall and bonus create finite 3D scenes with matching actors and items', () => {
  for (const n of [1, 2, 5]) {
    const { game, view } = setup(n);
    view.render(game);
    assert.equal(view.actorMeshes.size, game.enemies.length + 1);
    assert.equal(view.itemMeshes.size, game.level.items.length);
    assert.ok(view.scene.children.filter(o => o.isInstancedMesh).length < 20);
    view.scene.updateMatrixWorld(true);
    view.scene.traverse(o => assert.ok(o.matrixWorld.elements.every(Number.isFinite)));
    assert.equal(view.doors.length, game.level.exits.length + (game.level.startDoor ? 1 : 0));
  }
});

test('Movement respects map walls and jump is visible above the floor', () => {
  const { game, view } = setup();
  assert.equal(collides(game.level, TILE / 2, TILE / 2, 11, 'player', false), true);
  const before = game.player.x;
  game.update(.05, { ...idle, axis: () => ({ x: -1, y: 0 }) });
  assert.ok(game.player.x < before);
  game.update(.05, { ...idle, wasPressed: action => action === 'jump' });
  view.render(game);
  assert.ok(view.actorMeshes.get(game.player).position.y > 0);
  game.player.jump = -.5;
  view.render(game);
  assert.ok(view.actorMeshes.get(game.player).position.y >= 0);
});

test('Collecting a tape hides its 3D object and increments the existing counters', () => {
  const { game, view, events } = setup();
  view.render(game);
  const it = game.level.items.find(i => i.type === 'tape');
  game.player.x = it.x; game.player.y = it.y;
  game.update(.016, idle); view.render(game);
  assert.equal(it.taken, true); assert.equal(events.tapes, 1);
  assert.equal(view.itemMeshes.get(it).visible, false);
});

test('Button opens the rendered exit, entering it completes the level', () => {
  const { game, view, events } = setup();
  const b = game.level.button;
  game.player.x = (b.tx + .5) * TILE; game.player.y = (b.ty + .5) * TILE;
  game.update(.016, { ...idle, wasPressed: action => action === 'interact' });
  view.render(game);
  assert.equal(game.buttonPressed, true);
  assert.ok(view.doors.filter(d => !d.start).every(d => !d.panel.visible));
  const e = game.level.exit;
  assert.equal(game.level.tiles[e.ty * game.level.w + e.tx], T.EXIT_OPEN);
  game.player.x = (e.tx + .5) * TILE; game.player.y = (e.ty + .5) * TILE;
  game.update(.016, idle);
  assert.equal(events.complete, true);
  assert.equal(game.finished, true);
});

test('Pause stops simulation; death callback and level rebuild work', () => {
  const { game, view, events } = setup();
  game.paused = true; game.update(1, idle); assert.equal(game.time, 0);
  game.paused = false; game.player.hearts = 0; game.update(.016, idle);
  assert.equal(events.death, true);
  view.render(game);
  const oldScene = view.scene;
  const next = setup(5).game; view.render(next);
  assert.notEqual(view.scene, oldScene);
  assert.equal(view.button, null);
  assert.equal(view.actorMeshes.size, 1);
  assert.ok(view.doors.filter(d => !d.start).every(d => !d.panel.visible));
});
