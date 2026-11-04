import { initPlantList } from '../features/plants/components/plant-list.js';
import { createPlantStore } from '../features/plants/state/plant-store.js';
import { initScene } from '../shared/ui/scene.js';

const store = createPlantStore();

initScene();
initPlantList(document.getElementById('plant-list'), store);

document.getElementById('reset').addEventListener('click', () => {
  if (window.confirm('Put every plant back to where it started?')) {
    store.reset();
  }
});

// Work the days out again if the page was left open overnight.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    store.refresh();
  }
});
