import { initChapters } from '../features/home/chapters.js';
import { initScene } from '../shared/ui/scene.js';

const hero = document.getElementById('hero');

initScene();
initChapters(hero, document.querySelector('.scene'));
