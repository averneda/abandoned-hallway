# Abandoned Hallway

El primer videojuego de **Cat Games** 🐱 — creado por **Elora**.

Juego de supervivencia y terror suave: avanzas por pasillos abandonados esquivando a los Sangrientos (Bloodies), buscas el botón que abre la salida, recoges cintas de grabación con información del lugar y monedas para desbloquear personajes. En español e inglés.

## 🎮 Jugar

**Juega aquí, sin instalar nada:** https://averneda.github.io/abandoned-hallway/

También funciona con mando USB: enchúfalo, abre el juego y aprieta cualquier botón para que el navegador lo detecte. En el menú, "Configurar mando" deja cambiar cada botón.

| Acción | Mando de NES | Tecla |
|---|---|---|
| Moverse | Cruceta | Flechas (o W A S D) |
| Correr | B | Shift |
| Saltar | A | Espacio |
| Coger / pulsar / hablar | Start | E (o Enter) |
| Habilidad del personaje | Select | Q (o F) |
| Pausa | — | Esc (o P) |

### Jugar sin internet (Windows)

Descarga este repositorio, haz doble clic en `iniciar.bat` (necesita [Node.js](https://nodejs.org/)) y se abre solo en el navegador.

## ✏️ El arte

Los dibujos originales de Elora están en [`assets/referencias/`](assets/referencias/): los mapas de los niveles y el cartel del título. El juego los recrea con código.

## English

Abandoned Hallway is a soft-horror survival game created by Elora, the first game by Cat Games. Dodge the Bloodies through abandoned hallways, find the hidden button that opens the exit, and collect recording tapes and coins. Play it in your browser (link above) — it supports English and USB gamepads.

---

© 2026 Elora — **Todos los derechos reservados / All rights reserved.**
Puedes jugarlo y disfrutarlo, pero el juego, sus personajes, su historia y sus dibujos son de Elora. No está permitido copiarlos ni reutilizarlos sin permiso.

## Prueba 3D (experimental)

Abre `3d.html` desde el mismo servidor local (`iniciar.bat`) para probar el modo
3D con Carot. Conserva los mapas del Colegio, el Centro Comercial y el Bonus,
las colisiones, el salto, los Bloodies, los objetos y el botón de salida del
juego original. Cámara elevada fija; mismos controles de teclado y mando.
El modo 2D de `index.html` sigue siendo la versión principal.

Esta primera prueba no incluye lobby ni tienda, no guarda progreso y presenta
modelos geométricos provisionales. La iluminación y la visibilidad aún no
reproducen la oscuridad del modo 2D, por lo que no sirve para comparar dificultad.
Las pantallas nuevas del prototipo están en español; el HUD reutiliza el idioma
guardado. Los controles táctiles se reutilizan, pendientes de prueba en dispositivos reales.

Three.js r160 está incluido en `vendor/` para funcionar sin CDN. Su licencia MIT
se conserva en `vendor/three.LICENSE`; el arte, los personajes y la historia de
Elora mantienen los derechos indicados arriba.
