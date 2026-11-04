const DROP_COUNT = 20;

const between = (min, max) => min + Math.random() * (max - min);

// Gives a drop a new place, size, and drift. Its speed stays the same so it never jumps.
function randomizeLook(drop) {
  drop.style.setProperty('--x', `${between(2, 98)}%`);
  drop.style.setProperty('--size', `${between(12, 30)}px`);
  drop.style.setProperty('--alpha', between(0.35, 0.85));
  drop.style.setProperty('--drift', `${between(-40, 40)}px`);
}

/** Fills the layer with drops that fall forever, each one with its own speed. */
export function initRain(layer) {
  for (let i = 0; i < DROP_COUNT; i++) {
    const drop = document.createElement('span');
    drop.className = 'drop';
    drop.style.setProperty('--dur', `${between(6, 13)}s`);
    // A negative delay means the drops are already mid-fall when the page opens.
    drop.style.setProperty('--delay', `${-between(0, 13)}s`);
    randomizeLook(drop);
    drop.append(document.createElement('i'));
    // Every time a drop reaches the bottom and starts again, it comes back somewhere new.
    drop.addEventListener('animationiteration', () => randomizeLook(drop));
    layer.append(drop);
  }
}
