import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { createPlantStore } from '../js/features/plants/state/plant-store.js';

const SEED = [
  { id: 1, name: 'Cactus', emoji: 'c', wateringEveryDays: 7, daysSinceWatered: 15 },
  { id: 2, name: 'Fern', emoji: 'f', wateringEveryDays: 3, daysSinceWatered: 1 },
];

// A stand-in for the browser's storage, and a clock the tests can move.
function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
    removeItem: (key) => { delete data[key]; },
  };
}
function clock(year, month, day) {
  const time = { current: new Date(year, month - 1, day, 14, 30) };
  return { now: () => time.current, setDay: (y, m, d) => { time.current = new Date(y, m - 1, d, 9, 0); } };
}
const days = (store) => store.getState().plants.map((plant) => plant.daysSinceWatered);

test('on the first visit, plants start from the numbers in the data file', () => {
  const store = createPlantStore({ seed: SEED, storage: fakeStorage(), now: clock(2026, 11, 3).now });
  assert.deepEqual(days(store), [15, 1]);
});

test('the starting dates are saved, so days keep counting on the next visit', () => {
  const storage = fakeStorage();
  const day = clock(2026, 11, 3);
  createPlantStore({ seed: SEED, storage, now: day.now });

  day.setDay(2026, 11, 6);
  const nextVisit = createPlantStore({ seed: SEED, storage, now: day.now });
  assert.deepEqual(days(nextVisit), [18, 4]);
});

test('watering sets a plant to 0 days and remembers it', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  const storage = fakeStorage();
  const day = clock(2026, 11, 3);
  const store = createPlantStore({ seed: SEED, storage, now: day.now });

  store.water(1);
  assert.equal(store.getState().wateringId, 1);
  mock.timers.tick(700);
  assert.deepEqual(days(store), [0, 1]);
  mock.timers.tick(800);
  assert.equal(store.getState().wateringId, null);
  mock.timers.reset();

  day.setDay(2026, 11, 4);
  const later = createPlantStore({ seed: SEED, storage, now: day.now });
  assert.deepEqual(days(later), [1, 2]);
});

test('only one plant can be watered at a time', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  const store = createPlantStore({ seed: SEED, storage: fakeStorage(), now: clock(2026, 11, 3).now });
  store.water(1);
  store.water(2);
  assert.equal(store.getState().wateringId, 1);
  mock.timers.tick(2000);
  assert.deepEqual(days(store), [0, 1]);
  mock.timers.reset();
});

test('refresh works the days out again after midnight', () => {
  const day = clock(2026, 11, 3);
  const store = createPlantStore({ seed: SEED, storage: fakeStorage(), now: day.now });
  day.setDay(2026, 11, 4);
  assert.deepEqual(days(store), [15, 1]);
  store.refresh();
  assert.deepEqual(days(store), [16, 2]);
});

test('reset puts every plant back where it started', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  const store = createPlantStore({ seed: SEED, storage: fakeStorage(), now: clock(2026, 11, 3).now });
  store.water(1);
  mock.timers.tick(2000);
  mock.timers.reset();
  assert.deepEqual(days(store), [0, 1]);
  store.reset();
  assert.deepEqual(days(store), [15, 1]);
});

test('unreadable saved data is ignored', () => {
  for (const bad of ['not json', '[1,2]', 'null', '{"1":"yesterday","2":5}']) {
    const storage = fakeStorage({ 'water-us:last-watered:v1': bad });
    const store = createPlantStore({ seed: SEED, storage, now: clock(2026, 11, 3).now });
    assert.deepEqual(days(store), [15, 1], `for ${bad}`);
  }
});

test('a saved date in the future never gives negative days', () => {
  const storage = fakeStorage({ 'water-us:last-watered:v1': JSON.stringify({ 1: '2030-01-01', 2: '2026-11-03' }) });
  const store = createPlantStore({ seed: SEED, storage, now: clock(2026, 11, 3).now });
  assert.deepEqual(days(store), [0, 0]);
});

test('a plant added to the data file later starts from its own numbers', () => {
  const storage = fakeStorage();
  const day = clock(2026, 11, 3);
  createPlantStore({ seed: SEED, storage, now: day.now });
  const more = [...SEED, { id: 3, name: 'Basil', emoji: 'b', wateringEveryDays: 2, daysSinceWatered: 3 }];
  assert.deepEqual(days(createPlantStore({ seed: more, storage, now: day.now })), [15, 1, 3]);
});

test('a browser that cannot save does not break anything', () => {
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
  const store = createPlantStore({ seed: SEED, storage: broken, now: clock(2026, 11, 3).now });
  assert.deepEqual(days(store), [15, 1]);
});
