// Las grabaciones de las cintas (Elora): se ven en la tele antigua que dibujó Elora
// (assets/sprites/cintas/tele.webp), con la cinta entrando en el vídeo, la pantalla sin señal,
// la grabación con las rayas de la tele por encima, el "ffffff" de una cinta vieja que funciona
// mal, el texto de lo que pasa y lo que dicen, y las voces.
//
// Las voces las pone el navegador (speechSynthesis): suenan algo distintas en cada aparato y,
// si un aparato no tiene voces, sale solo el texto. Cada personaje tiene su tono en VOCES.
// La grabación es el dibujo de Elora (assets/sprites/cintas/cinta-N.webp); la "cámara" se
// mueve y se acerca a cada personaje según los pasos de GRABACIONES.
// Los textos están en src/i18n.js ('cinta.N.x'), en español e inglés.

import { t, getLang } from './i18n.js';
import { sfx } from './sound.js';
import { audioContext } from './audio.js';
import { characterById, drawCharacter } from './characters.js';

const W = 960, H = 600;   // tamaño del lienzo

// La tele de Elora: la imagen y dónde está la pantalla (sus 4 esquinas) y la ranura del vídeo.
const TELE = {
  src: 'assets/sprites/cintas/tele.webp', w: 1372, h: 1022,
  pantalla: [[185, 172], [1160, 163], [1093, 686], [276, 790]],
  ranura: [912, 868],
};

// Tono de voz de cada uno: pitch (0 a 2, más alto = más agudo) y rate (velocidad, 1 = normal).
const VOCES = {
  gec: { pitch: 1.9, rate: 1.15 },      // Elora: voz infantil
  draila: { pitch: 1.15, rate: 0.92 },  // [PROVISIONAL] un poco seria
  tarda: { pitch: 0.8, rate: 0.95 },    // [PROVISIONAL]
};
const NOMBRES = { gec: 'Gec', draila: 'Draila', tarda: 'Tarda' };
// Los que hablan por fuera de la cinta: Tarda ve las cintas contigo (Elora), así que su voz no sale
// de la grabación: su texto va debajo de la tele, con su carita.
const FUERA = { tarda: true };

// Cada grabación: el dibujo y sus pasos. En cada paso (todo opcional):
//   cam: [x, y, zoom]  hacia dónde mira la cámara en el dibujo (en píxeles del dibujo; zoom 1 = entero)
//   mover: segundos que tarda la cámara en llegar      t: segundos que dura el paso como mínimo
//   texto: clave de lo que dice alguien (Elora: solo sale texto cuando alguien habla, con su nombre)
//   quien: quién habla (sale su nombre y se oye su voz)  voz: clave de lo que se oye, si no es el texto
//   audio: la frase grabada (ElevenLabs, assets/sonidos/cintas/); en español se oye esa grabación y,
//     si no se puede cargar (o el juego está en inglés), la voz del navegador
//   oscurecer: se va poniendo oscuro                  apagar: se apaga la tele (fin)
//   mueve: { actor: [movimientos] }  los personajes recortados se mueven como marionetas de papel
//     (Elora). Cada movimiento: { x, y, s, r, en, andar }: hasta dónde se desplaza (en píxeles del
//     dibujo, desde su sitio), su tamaño (s, 1 = normal), su giro (r, en radianes), en cuántos
//     segundos, si va dando pasitos (andar) y si se esconde detrás de los muebles (recorte: false
//     para que no). Se hacen uno detrás de otro.
// Si la grabación tiene "fondo" y "actores", el dibujo se pinta por partes: el cuarto sin los
// personajes (fondo) y cada personaje recortado encima (tools-fichas/recortar-cinta-1.sh).
// actor.ancla: el punto sobre el que gira y crece; actor.juega: se mueve solo todo el rato (jugando);
// actor.recorte: rectángulos [x, y, ancho, alto] fuera de los cuales no se ve (lo que queda detrás
// de la mesa, por ejemplo, para que al agacharse se esconda detrás).
// Qué grabación tiene cada cinta (Elora): cuando encuentras una cinta, se sortea cuál le toca,
// según el porcentaje de cintas que tiene cada grabación (grabación: %). Si no suman 100, el resto
// son cintas sin grabación (de momento). Una misma grabación puede salir en varias cintas.
// Lo que le tocó a cada cinta se guarda en el navegador: no cambia al volver a mirarla.
export const PORCENTAJES = { 1: 90 };   // Gec y Draila: el 90 % de las cintas (Elora)
const SORTEO_KEY = 'holeway.tapeRecs';
let sorteoEnMemoria = {};   // por si el navegador no deja guardar
function leerSorteo() { try { return JSON.parse(localStorage.getItem(SORTEO_KEY) || '{}') || {}; } catch (e) { return sorteoEnMemoria; } }
function guardarSorteo(m) { sorteoEnMemoria = m; try { localStorage.setItem(SORTEO_KEY, JSON.stringify(m)); } catch (e) { /* sin guardar */ } }
// la grabación de la cinta n (la primera que encontraste es la 1), o 0 si no tiene
export function grabacionDeCinta(n) {
  const m = leerSorteo();
  if (!(n in m)) {
    let r = Math.random() * 100, g = 0;
    for (const [id, pc] of Object.entries(PORCENTAJES)) { if (r < pc) { g = +id; break; } r -= pc; }
    m[n] = g; guardarSorteo(m);
  }
  return m[n] && GRABACIONES[m[n]] ? m[n] : 0;
}

export const GRABACIONES = {
  1: {
    src: 'assets/sprites/cintas/cinta-1.webp', w: 1278, h: 925,
    fondo: 'assets/sprites/cintas/cinta-1-fondo.webp',
    actores: {
      draila: { src: 'assets/sprites/cintas/cinta-1-draila.webp', ancla: [115, 567], x: -330,   // empieza fuera, a la izquierda
        recorte: [[0, 0, 1278, 567], [0, 0, 77, 925]] },   // por encima del escritorio (y su cola, a la izquierda)
      gec: { src: 'assets/sprites/cintas/cinta-1-gec.webp', ancla: [690, 808], juega: true },
    },
    pasos: [
      { cam: [640, 462, 1], t: 2.4 },                                        // Gec juega en su cuarto
      { cam: [740, 700, 2.2], mover: 2.2, t: 2.6 },
      { cam: [330, 470, 1.4], mover: 1.2, t: 3, quien: 'tarda', texto: 'cinta.1.tarda1', audio: 'assets/sonidos/cintas/cinta1-01-tarda.mp3',   // entra Draila
        mueve: { draila: [{ x: 0, en: 2.6, andar: true }] } },
      { cam: [150, 470, 2], mover: 0.9, t: 0.9 },
      { quien: 'draila', texto: 'cinta.1.c', audio: 'assets/sonidos/cintas/cinta1-02-draila.mp3', t: 1.6 },                       // ¡Gec, la cena ya está lista, ven!
      { cam: [740, 700, 2.2], mover: 1.1, t: 1.1 },
      { quien: 'gec', texto: 'cinta.1.d', audio: 'assets/sonidos/cintas/cinta1-03-gec.mp3', t: 1.6,                            // ¡Ya voy! Jejeje. (voz infantil)
        mueve: { gec: [{ s: 1.06, en: 0.15 }, { s: 1, en: 0.25 }] } },
      { quien: 'tarda', texto: 'cinta.1.tarda2', audio: 'assets/sonidos/cintas/cinta1-04-tarda.mp3', t: 1.6 },                   // No parece que Gec quiera ir...
      { cam: [175, 470, 2.2], mover: 1.2, t: 2.4,                            // Draila se agacha (mucho: Elora)
        mueve: { draila: [{ y: 130, en: 1 }] } },
      { quien: 'draila', texto: 'cinta.1.g', voz: 'cinta.1.g.voz', audio: 'assets/sonidos/cintas/cinta1-05-draila.mp3', t: 1.4,  // ¿Mmm? (ladea la cabeza)
        mueve: { draila: [{ r: -0.14, en: 0.4 }] } },
      { quien: 'draila', texto: 'cinta.1.h', audio: 'assets/sonidos/cintas/cinta1-06-draila.mp3', t: 1.6,                         // Jeje... (se levanta)
        mueve: { draila: [{ r: 0, y: -6, en: 0.8 }, { y: 0, en: 0.3 }] } },
      { cam: [118, 405, 3.2], mover: 0.9, quien: 'draila', texto: 'cinta.1.i', audio: 'assets/sonidos/cintas/cinta1-07-draila.mp3', t: 2.2 },   // ¡Oh! ¿Cuándo dejé la cámara encendida?...
      { cam: [130, 430, 4.5], mover: 1.5, t: 1.6, oscurecer: true,          // ...y viene a apagarla
        mueve: { draila: [{ s: 2.6, y: -80, x: 15, en: 1.5, andar: true, recorte: false }] } },
      { apagar: true },
    ],
  },
};

const cargar = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
const suave = (x) => x * x * (3 - 2 * x);   // empieza y acaba despacio

// Una voz. Devuelve { done } (se pone a true al acabar), o null si el aparato no tiene voces.
// Una frase grabada. Devuelve { done }, que se pone a true al acabar (o si falla: entonces, alFallar()).
function grabada(src, alFallar) {
  const st = { done: false };
  const a = new Audio(src);
  a.volume = 1;
  a.onended = () => { st.done = true; };
  a.onerror = () => { if (!st.done) { st.done = true; alFallar(); } };
  const pr = a.play();
  if (pr && pr.catch) pr.catch(() => { if (!st.done) { st.done = true; alFallar(); } });
  st.parar = () => { try { a.pause(); } catch (e) { /* nada */ } };
  return st;
}

function hablar(texto, quien) {
  const s = window.speechSynthesis;
  if (!s || typeof SpeechSynthesisUtterance === 'undefined') return null;
  const en = getLang() === 'en';
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = en ? 'en-US' : 'es-ES';
  const voces = s.getVoices().filter((v) => (v.lang || '').toLowerCase().startsWith(en ? 'en' : 'es'));
  if (voces.length) u.voice = voces.find((v) => /es-es|en-us/i.test(v.lang)) || voces[0];
  Object.assign(u, VOCES[quien] || {});
  const st = { done: false };
  u.onend = u.onerror = () => { st.done = true; };
  s.cancel(); s.speak(u);
  return st;
}

// El "ffffff" de fondo de una cinta vieja que funciona mal (Elora), con algún chasquido.
function siseo() {
  const c = audioContext(); if (!c) return null;
  const n = c.sampleRate * 2;
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (Math.random() < 0.0004 ? 6 : 1);   // chasquidos sueltos
  const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
  const filtro = c.createBiquadFilter(); filtro.type = 'highpass'; filtro.frequency.value = 2500;
  const g = c.createGain(); g.gain.value = 0.035;
  src.connect(filtro).connect(g).connect(c.destination);
  src.start();
  return { g, c, parar() { try { g.gain.setTargetAtTime(0, c.currentTime, 0.05); src.stop(c.currentTime + 0.3); } catch (e) { /* ya parado */ } } };
}

export class TapePlayer {
  // canvas: dónde se dibuja; n: número de grabación (no de cinta); alAcabar(): cuando termina
  constructor(canvas, n, alAcabar) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.n = n; this.g = GRABACIONES[n]; this.alAcabar = alAcabar;
    this.vivo = true;
    this.ruidoCv = document.createElement('canvas'); this.ruidoCv.width = 160; this.ruidoCv.height = 100;
    const actores = Object.entries(this.g.actores || {});
    Promise.all([cargar(TELE.src), cargar(this.g.src), this.g.fondo ? cargar(this.g.fondo) : null,
      ...actores.map(([, a]) => cargar(a.src))]).then(([tele, img, fondo, ...sprites]) => {
      if (!this.vivo) return;
      this.tele = tele; this.img = img; this.fondo = fondo;
      // cada personaje recortado: su imagen, su sitio y lo que le queda por moverse
      this.actores = {};
      actores.forEach(([id, a], i) => {
        this.actores[id] = { ...a, img: sprites[i], est: { x: a.x || 0, y: a.y || 0, s: 1, r: 0 }, cola: [], tiempo: 0, paso: 0 };
      });
      if (fondo && actores.length && sprites.every(Boolean)) {
        this.escena = document.createElement('canvas'); this.escena.width = this.g.w; this.escena.height = this.g.h;
      }
      this.prepararMarco();
      this.empezar();
    });
  }

  // La pantalla de la tele, en píxeles del lienzo.
  medidas() {
    const e = Math.min((W - 20) / TELE.w, (H - 10) / TELE.h);
    const ox = (W - TELE.w * e) / 2, oy = (H - TELE.h * e) / 2;
    const q = TELE.pantalla.map(([x, y]) => [ox + x * e, oy + y * e]);
    const xs = q.map((p) => p[0]), ys = q.map((p) => p[1]);
    const caja = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    return { e, ox, oy, q, caja };
  }

  // El marco: la tele de Elora con la pantalla recortada (para dibujar la grabación debajo).
  prepararMarco() {
    const m = this.m = this.medidas();
    const c = this.marco = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    if (this.tele) x.drawImage(this.tele, m.ox, m.oy, TELE.w * m.e, TELE.h * m.e);
    x.globalCompositeOperation = 'destination-out';
    this.camino(x); x.fill();
  }

  camino(x) {
    const q = this.m.q;
    x.beginPath(); x.moveTo(q[0][0], q[0][1]);
    for (let i = 1; i < 4; i++) x.lineTo(q[i][0], q[i][1]);
    x.closePath();
  }

  empezar() {
    this.fase = 'meter'; this.tf = 0;      // fase y tiempo dentro de la fase
    this.paso = -1; this.texto = null; this.quien = null;
    this.cam = { x: this.g.w / 2, y: this.g.h / 2, z: 1 }; this.camDe = null;
    this.oscuro = 0;
    sfx.tapeIn();
    let antes = performance.now();
    const bucle = (ahora) => {
      if (!this.vivo) return;
      const dt = Math.min(0.1, (ahora - antes) / 1000); antes = ahora;
      this.actualizar(dt); this.dibujar();
      requestAnimationFrame(bucle);
    };
    requestAnimationFrame(bucle);
  }

  // Parar del todo (al cerrar la pantalla de las cintas).
  parar() {
    this.vivo = false;
    if (this.voz && this.voz.parar) this.voz.parar();
    if (this.sis) this.sis.parar();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  actualizar(dt) {
    this.tf += dt;
    if (this.fase === 'meter' && this.tf > 1.1) { this.fase = 'nieve'; this.tf = 0; sfx.staticNoise(1.3); }
    else if (this.fase === 'nieve' && this.tf > 1.3) { this.fase = 'ver'; this.tf = 0; this.sis = siseo(); this.siguiente(); }
    else if (this.fase === 'ver') {
      const p = this.g.pasos[this.paso];
      // la cámara
      if (this.camDe) {
        const k = p.mover ? Math.min(1, this.tf / p.mover) : 1;
        const s = suave(k), a = this.camDe, b = p.cam;
        this.cam = { x: a.x + (b[0] - a.x) * s, y: a.y + (b[1] - a.y) * s, z: a.z + (b[2] - a.z) * s };
      }
      if (p.oscurecer) this.oscuro = Math.max(0, Math.min(0.75, (this.tf / (p.t || 1) - 0.55) * 2));   // al final del paso (tapa la cámara)
      this.moverActores(dt);
      // el chisporroteo de la cinta sube y baja un poco
      if (this.sis) this.sis.g.gain.value = 0.03 + Math.random() * 0.012;
      // ¿se acabó el paso? (lo que dure como mínimo, lo que tarde la cámara y lo que tarde la voz)
      const minimo = Math.max(p.t || 0, p.mover || 0);
      const vozLista = !this.voz || this.voz.done || this.tf > this.vozTope;
      if (this.tf >= minimo && vozLista) this.siguiente();
    } else if (this.fase === 'apagar' && this.tf > 0.7) { this.fase = 'nieve2'; this.tf = 0; sfx.staticNoise(0.9); }
    else if (this.fase === 'nieve2' && this.tf > 0.9) { this.fase = 'fin'; this.tf = 0; if (this.alAcabar) this.alAcabar(); }
  }

  // Los personajes recortados: hacen sus movimientos uno detrás de otro.
  moverActores(dt) {
    for (const a of Object.values(this.actores || {})) {
      a.tiempo += dt;
      if (!a.mov && a.cola.length) { const m = a.cola.shift(); a.mov = { m, de: { ...a.est }, t: 0 }; }
      if (!a.mov) { a.andando = false; continue; }
      const mv = a.mov; mv.t += dt;
      const k = Math.min(1, mv.t / (mv.m.en || 0.01)), s = suave(k);
      for (const c of ['x', 'y', 's', 'r']) if (mv.m[c] != null) a.est[c] = mv.de[c] + (mv.m[c] - mv.de[c]) * s;
      a.andando = !!mv.m.andar && k < 1;
      if (mv.m.recorte != null) a.conRecorte = mv.m.recorte;
      if (k >= 1) a.mov = null;
    }
  }

  // El dibujo por partes: el cuarto y, encima, cada personaje en su sitio.
  pintarEscena() {
    const x = this.escena.getContext('2d');
    x.drawImage(this.fondo, 0, 0);
    for (const a of Object.values(this.actores)) {
      const e = a.est;
      let dy = e.y, r = e.r, sy = e.s;
      if (a.andando) { dy += -Math.abs(Math.sin(a.tiempo * 9)) * 7; r += Math.sin(a.tiempo * 9) * 0.03; }   // pasitos
      if (a.juega) { r += Math.sin(a.tiempo * 2.6) * 0.035; sy *= 1 + Math.sin(a.tiempo * 5.2) * 0.012; }  // jugando
      x.save();
      if (a.recorte && a.conRecorte !== false) {
        x.beginPath();
        for (const [rx, ry, rw, rh] of a.recorte) x.rect(rx, ry, rw, rh);
        x.clip();
      }
      x.translate(a.ancla[0] + e.x, a.ancla[1] + dy);
      x.rotate(r); x.scale(e.s, sy);
      x.drawImage(a.img, -a.ancla[0], -a.ancla[1]);
      x.restore();
    }
    return this.escena;
  }

  siguiente() {
    this.paso++; this.tf = 0;
    const p = this.g.pasos[this.paso];
    if (!p || p.apagar) {
      this.fase = 'apagar'; this.tf = 0; this.texto = null; this.fuera = null;
      if (this.sis) { this.sis.parar(); this.sis = null; }
      sfx.tvOff();
      return;
    }
    this.camDe = p.cam ? { ...this.cam } : null;
    for (const [id, movs] of Object.entries(p.mueve || {})) {
      const a = this.actores && this.actores[id];
      if (a) { a.cola = movs.map((m) => ({ ...m })); a.mov = null; }
    }
    // el texto de este paso (si no tiene, no sale ninguno); el de Tarda va fuera de la tele
    this.texto = null; this.quien = null; this.fuera = null;
    if (p.texto && FUERA[p.quien]) this.fuera = { texto: t(p.texto), quien: p.quien };
    else if (p.texto) { this.texto = t(p.texto); this.quien = p.quien || null; }
    this.voz = null;
    if (p.quien) {
      const dicho = t(p.voz || p.texto);
      // por si el aparato no avisa de que la voz ha terminado: como mucho, lo que tardaría más un poco
      this.vozTope = 1.2 + dicho.length * 0.09;
      if (p.audio && getLang() !== 'en') {
        // la voz grabada (ElevenLabs); si no se puede oír, la del navegador
        const yo = this.paso;
        this.voz = grabada(p.audio, () => { if (this.vivo && this.paso === yo) this.voz = hablar(dicho, p.quien); });
        this.vozTope = Math.max(this.vozTope, 8);
      } else {
        this.voz = hablar(dicho, p.quien);
      }
    }
  }

  // ---- dibujo
  dibujar() {
    const x = this.ctx, m = this.m;
    x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
    // lo que sale en la pantalla
    x.save();
    this.camino(x); x.clip();
    const c = m.caja;
    x.fillStyle = '#05060a'; x.fillRect(c.x, c.y, c.w, c.h);
    if (this.fase === 'nieve' || this.fase === 'nieve2' || this.fase === 'meter') this.nieve(x, this.fase === 'meter' ? 0.25 : 1);
    else if (this.fase === 'ver') this.grabacion(x);
    else if (this.fase === 'apagar') this.apagando(x);
    else if (this.fase === 'fin') {
      x.fillStyle = '#e8e8f0'; x.font = 'bold 34px "Courier New", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(t('tapes.end'), c.x + c.w / 2, c.y + c.h / 2);
    }
    // las rayas de la tele de Elora, también por encima de la grabación (Elora)
    if (this.tele && this.fase !== 'fin') {
      x.globalAlpha = 1; x.globalCompositeOperation = 'multiply';
      x.drawImage(this.tele, m.ox, m.oy, TELE.w * m.e, TELE.h * m.e);
      x.globalCompositeOperation = 'source-over'; x.globalAlpha = 1;
    }
    // rayitas finas de tele antigua
    x.fillStyle = 'rgba(0,0,0,0.13)';
    for (let y = c.y; y < c.y + c.h; y += 3) x.fillRect(c.x, y, c.w, 1);
    x.restore();
    // la tele por encima
    x.drawImage(this.marco, 0, 0);
    // lo que dice Tarda, que está viendo la cinta contigo: debajo de la tele, con su carita
    if (this.fuera && this.fase === 'ver') this.panelFuera(x, this.fuera.texto, this.fuera.quien);
    // la cinta entrando en el vídeo
    if (this.fase === 'meter') {
      const k = Math.min(1, this.tf / 0.9);
      const [rx, ry] = [m.ox + TELE.ranura[0] * m.e, m.oy + TELE.ranura[1] * m.e];
      const s = 1.6 - suave(k) * 1.1, a = 1 - Math.max(0, (k - 0.75) / 0.25);
      x.save(); x.globalAlpha = a; x.translate(rx, ry + (1 - k) * 40); x.scale(s, s);
      x.fillStyle = '#16161a'; x.fillRect(-26, -15, 52, 30);
      x.fillStyle = '#e8e8ee'; x.fillRect(-18, -8, 36, 12);
      x.fillStyle = '#16161a'; for (const dx of [-9, 9]) { x.beginPath(); x.arc(dx, -2, 3.5, 0, Math.PI * 2); x.fill(); }
      x.restore();
    }
  }

  nieve(x, alfa) {
    const r = this.ruidoCv, rx = r.getContext('2d'), im = rx.createImageData(r.width, r.height);
    for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    rx.putImageData(im, 0, 0);
    const c = this.m.caja;
    x.globalAlpha = alfa; x.imageSmoothingEnabled = false;
    x.drawImage(r, c.x, c.y, c.w, c.h);
    x.imageSmoothingEnabled = true; x.globalAlpha = 1;
  }

  grabacion(x) {
    const c = this.m.caja, g = this.g;
    const img = this.escena ? this.pintarEscena() : this.img;
    if (img) {
      // la cámara: lo que se ve del dibujo (zoom 1 = el dibujo entero de ancho o de alto)
      const base = Math.max(c.w / g.w, c.h / g.h);
      const esc = base * this.cam.z;
      let sw = c.w / esc, sh = c.h / esc;
      let sx = this.cam.x - sw / 2, sy = this.cam.y - sh / 2;
      sx = Math.max(0, Math.min(g.w - sw, sx)); sy = Math.max(0, Math.min(g.h - sh, sy));
      // la imagen tiembla un poco de vez en cuando, como una cinta vieja
      const tiembla = Math.random() < 0.08 ? (Math.random() - 0.5) * 6 : 0;
      x.drawImage(img, sx, sy, sw, sh, c.x + tiembla, c.y, c.w, c.h);
    }
    // parpadeo de brillo
    x.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`; x.fillRect(c.x, c.y, c.w, c.h);
    // una franja de interferencia que baja de vez en cuando
    const ciclo = (performance.now() / 1000) % 5;
    if (ciclo < 0.6) {
      const y = c.y + (ciclo / 0.6) * c.h;
      x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(c.x, y, c.w, 6);
      x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(c.x, y + 6, c.w, 3);
    }
    if (this.oscuro) { x.fillStyle = `rgba(0,0,0,${this.oscuro})`; x.fillRect(c.x, c.y, c.w, c.h); }
    // el punto rojo de "grabando"
    if (Math.floor(performance.now() / 600) % 2 === 0) {
      x.fillStyle = '#ff2a2a'; x.beginPath(); x.arc(c.x + c.w - 34, c.y + 30, 6, 0, Math.PI * 2); x.fill();
    }
    // lo que dice alguien de la grabación
    if (this.texto) this.subtitulo(x, this.texto, this.quien);
  }

  subtitulo(x, texto, quien) {
    const c = this.m.caja;
    const narra = !quien;
    const linea = quien ? `${NOMBRES[quien] || quien}: ${texto}` : texto;
    x.font = (narra ? 'italic ' : 'bold ') + '19px "Segoe UI", system-ui, Arial';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    // se parte en líneas si no cabe
    const palabras = linea.split(' '), lineas = [];
    let l = '';
    for (const p of palabras) { const prueba = l ? l + ' ' + p : p; if (x.measureText(prueba).width > c.w - 50 && l) { lineas.push(l); l = p; } else l = prueba; }
    if (l) lineas.push(l);
    // encima del borde de abajo de la pantalla (que está algo inclinado: se usa su punto más alto)
    const abajo = Math.min(this.m.q[2][1], this.m.q[3][1]);
    const alto = lineas.length * 24 + 12, y0 = abajo - alto - 12;
    x.fillStyle = 'rgba(0,0,0,0.6)'; x.fillRect(c.x + 18, y0, c.w - 36, alto);
    lineas.forEach((ln, i) => {
      const y = y0 + 18 + i * 24;
      x.lineWidth = 4; x.strokeStyle = '#000'; x.strokeText(ln, c.x + c.w / 2, y);
      x.fillStyle = narra ? '#ffe9a8' : '#ffffff'; x.fillText(ln, c.x + c.w / 2, y);
    });
  }

  panelFuera(x, texto, quien) {
    const x0 = 70, w = W - 140;
    x.font = '18px "Segoe UI", system-ui, Arial';
    const palabras = texto.split(' '), lineas = [];
    let l = '';
    for (const p of palabras) { const prueba = l ? l + ' ' + p : p; if (x.measureText(prueba).width > w - 130 && l) { lineas.push(l); l = p; } else l = prueba; }
    if (l) lineas.push(l);
    const h = 40 + lineas.length * 24, y0 = H - h - 8;
    x.fillStyle = 'rgba(12, 10, 16, 0.94)'; x.strokeStyle = '#6cc77f'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(x0 + 12, y0); x.arcTo(x0 + w, y0, x0 + w, y0 + h, 12); x.arcTo(x0 + w, y0 + h, x0, y0 + h, 12);
    x.arcTo(x0, y0 + h, x0, y0, 12); x.arcTo(x0, y0, x0 + w, y0, 12); x.closePath(); x.fill(); x.stroke();
    // su carita
    x.save(); x.translate(x0 + 50, y0 + h / 2 + 8); x.scale(1.7, 1.7);
    drawCharacter(x, characterById(quien), 0, 0, 'down', performance.now() / 300, 0, false);
    x.restore();
    x.textAlign = 'left'; x.textBaseline = 'middle';
    x.fillStyle = '#6cc77f'; x.font = 'bold 17px "Segoe UI", system-ui, Arial';
    x.fillText(NOMBRES[quien] || quien, x0 + 100, y0 + 20);
    x.fillStyle = '#ffffff'; x.font = '18px "Segoe UI", system-ui, Arial';
    lineas.forEach((ln, i) => x.fillText(ln, x0 + 100, y0 + 44 + i * 24));
  }

  apagando(x) {
    // la tele antigua se apaga: la imagen se aplasta en una raya blanca y luego en un punto
    const c = this.m.caja, k = Math.min(1, this.tf / 0.7);
    const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
    const h = Math.max(2, c.h * (1 - k * 2)), w = k < 0.5 ? c.w : Math.max(4, c.w * (1 - (k - 0.5) * 2));
    x.fillStyle = '#f4f6ff'; x.fillRect(cx - w / 2, cy - h / 2, w, h);
  }
}
