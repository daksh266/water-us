import { initCareTable } from '../features/care/care-table.js';
import { keepFresh } from '../features/plants/state/keep-fresh.js';
import { createPlantStore } from '../features/plants/state/plant-store.js';
import { initScene } from '../shared/ui/scene.js';

const store = createPlantStore();

initScene();
initCareTable(document.getElementById('care-table-body'), store);
keepFresh(store);
