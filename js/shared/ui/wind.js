const LEAF_COUNT = 16;
const GUST_COUNT = 5;
const GREENS = [
  ['#b9e08a', '#4f9a4a'],
  ['#9fd48f', '#2f7d4f'],
  ['#d3ec9b', '#6aa84f'],
  ['#8fcf9c', '#2c7a58'],
];
/** How far past the edge of the screen a leaf goes before it starts again, in pixels. */
const MARGIN = 60;
/** The angle of the leaf's point, from its top left corner to its bottom right corner. */
const POINT_ANGLE = Math.atan(0.6);

const between = (min, max) => min + Math.random() * (max - min);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
/** Turns any angle into one between -PI and PI. */
const wrap = (angle) => Math.atan2(Math.sin(angle), Math.cos(angle));

/**
 * A new flight for one leaf. The leaf steers by itself: its turning is a mix of slow waves, so the
 * path wanders, and now and then it curls into a loop. The wind keeps pushing it to the right.
 */
export function createFlight(width, height) {
  const [light, dark] = pick(GREENS);
  // Every leaf has its own character: from a calm drifter (0) to a wild swirler (1).
  const loopiness = Math.random();
  return {
    loopiness,
    // The gap between loops: wild leaves loop again and again, calm ones only once in a while.
    gapMin: 7 - 5.5 * loopiness,
    gapMax: 11 - 8 * loopiness,
    // How sharply a loop turns, and how long it lasts. Short means a small curve, long means a full loop or two.
    curlRate: between(2.5, 6),
    curlLong: between(0.7, 2.6),
    // The chance that one loop leads straight into another, which makes a chain of loops.
    chain: 0.7 * loopiness,
    x: -MARGIN,
    y: between(0.08, 0.92) * height,
    heading: between(-0.6, 0.6),
    speed: between(70, 130),
    wind: between(40, 75),
    waves: [
      { amp: between(1.2, 2.6), freq: between(0.5, 1.1), phase: between(0, 6.3) },
      { amp: between(0.8, 2.2), freq: between(1.2, 2.2), phase: between(0, 6.3) },
    ],
    // How hard the leaf is pulled back toward flying to the right.
    pull: between(0.5, 1.1),
    curlIn: between(0.5, 5),
    curl: 0,
    curlDir: 1,
    time: 0,
    flip: between(0, 6.3),
    flipRate: between(1.5, 3.5),
    size: between(16, 28),
    alpha: between(0.65, 1),
    light,
    dark,
  };
}

// A leaf catches a swirl of air. Each loop is a little different in size from the last.
function startCurl(flight, direction = Math.random() < 0.5 ? -1 : 1) {
  flight.curl = flight.curlLong * between(0.7, 1.3);
  flight.curlDir = direction;
  flight.curlIn = between(flight.gapMin, flight.gapMax);
}

/** Moves a flight forward by dt seconds. */
export function stepFlight(flight, dt) {
  flight.time += dt;
  let turn = -flight.pull * wrap(flight.heading);
  for (const wave of flight.waves) {
    turn += wave.amp * Math.sin(wave.freq * flight.time + wave.phase);
  }
  flight.curlIn -= dt;
  if (flight.curl <= 0 && flight.curlIn <= 0) {
    startCurl(flight);
  }
  if (flight.curl > 0) {
    turn += flight.curlRate * flight.curlDir;
    flight.curl -= dt;
    if (flight.curl <= 0 && Math.random() < flight.chain) {
      // Straight into the next loop, turning the same way (a spiral) or the other way (an S).
      startCurl(flight, Math.random() < 0.6 ? flight.curlDir : -flight.curlDir);
    }
  }
  flight.heading += turn * dt;
  flight.x += (Math.cos(flight.heading) * flight.speed + flight.wind) * dt;
  flight.y += Math.sin(flight.heading) * flight.speed * dt;
  flight.flip += flight.flipRate * dt;
}

function buildLeaf(flight) {
  const leaf = document.createElement('span');
  leaf.className = 'leaf';
  const blade = document.createElement('i');
  blade.className = 'blade';
  leaf.append(blade);
  paintLeaf(leaf, flight);
  return leaf;
}

function paintLeaf(leaf, flight) {
  leaf.style.setProperty('--size', `${flight.size}px`);
  leaf.style.setProperty('--alpha', flight.alpha);
  leaf.style.setProperty('--light', flight.light);
  leaf.style.setProperty('--dark', flight.dark);
}

function buildGust(layer) {
  const gust = document.createElement('span');
  gust.className = 'gust';
  gust.style.setProperty('--dur', `${between(3, 6)}s`);
  gust.style.setProperty('--delay', `${-between(0, 6)}s`);
  const randomize = () => {
    gust.style.setProperty('--y', `${between(5, 95)}%`);
    gust.style.setProperty('--rise', `${between(-8, 8)}vh`);
    gust.style.setProperty('--len', `${between(120, 280)}px`);
    gust.style.setProperty('--alpha', between(0.15, 0.4));
  };
  randomize();
  gust.addEventListener('animationiteration', randomize);
  layer.append(gust);
}

/** Fills the layer with leaves blowing across the screen and a few faint gusts of wind. */
export function initWind(layer) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  for (let i = 0; i < GUST_COUNT; i++) {
    buildGust(layer);
  }

  let width = layer.clientWidth;
  let height = layer.clientHeight;
  window.addEventListener('resize', () => {
    width = layer.clientWidth;
    height = layer.clientHeight;
  });

  const leaves = [];
  for (let i = 0; i < LEAF_COUNT; i++) {
    const flight = createFlight(width, height);
    // Start each leaf partway through its flight so the screen is not empty when the page opens.
    flight.x = between(0, width);
    for (let t = 0; t < between(0, 3); t += 0.05) {
      stepFlight(flight, 0.05);
    }
    const leaf = buildLeaf(flight);
    layer.append(leaf);
    leaves.push({ leaf, flight });
  }

  let last = performance.now();
  function frame(now) {
    // A long pause, such as a hidden tab, must not make the leaves jump.
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    for (const item of leaves) {
      stepFlight(item.flight, dt);
      const { x, y } = item.flight;
      const offScreen = x > width + MARGIN || y < -MARGIN * 2 || y > height + MARGIN * 2;
      if (offScreen) {
        item.flight = createFlight(width, height);
        paintLeaf(item.leaf, item.flight);
      }
      // The leaf's point faces the way it is flying, and it flips as it tumbles.
      const squash = 0.35 + 0.65 * Math.abs(Math.cos(item.flight.flip));
      item.leaf.style.transform =
        `translate3d(${item.flight.x}px, ${item.flight.y}px, 0) rotate(${item.flight.heading - POINT_ANGLE}rad) scaleY(${squash})`;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
