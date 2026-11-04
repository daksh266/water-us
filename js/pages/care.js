import { initCareTable } from '../features/care/care-table.js';
import { createPlantStore } from '../features/plants/state/plant-store.js';
import { initScene } from '../shared/ui/scene.js';

initScene();
initCareTable(document.getElementById('care-table-body'), createPlantStore());
