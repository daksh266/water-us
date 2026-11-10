import { initRain } from './rain.js';
import { initWind } from './wind.js';

/** Starts the falling rain and, on pages that have a wind layer, the blowing leaves. The backdrop and the sun are plain HTML and CSS. */
export function initScene() {
  initRain(document.getElementById('rain-layer'));
  const wind = document.getElementById('wind-layer');
  if (wind) {
    initWind(wind);
  }
}
