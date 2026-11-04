import { initRain } from './rain.js';

/** Starts the falling rain behind the page. The backdrop and the sun are plain HTML and CSS. */
export function initScene() {
  initRain(document.getElementById('rain-layer'));
}
