import { initHome } from '../features/home/home.js';
import { initScene } from '../shared/ui/scene.js';

initScene();
initHome(document.getElementById('hero'));
