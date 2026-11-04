import { addDays, daysBetween, isDateKey, toDateKey } from '../../../shared/dates.js';
import { PLANTS } from '../data/plants.js';
import { clearLastWatered, getStorage, loadLastWatered, saveLastWatered } from './plant-storage.js';

/** How long the rain falls before the plant has "drunk" and turns happy. */
const DRINK_DELAY_MS = 700;
/** How long the whole watering animation lasts. */
const WATERING_DURATION_MS = 1500;

/**
 * Holds the plants and the watering actions, so the components only have to show them.
 *
 * The list in data/plants.js is where every plant starts. The first time someone visits, a plant
 * with "daysSinceWatered: 15" counts as watered 15 days before that visit. From then on the store
 * remembers the real date each plant was last watered, so plants get thirsty as days pass.
 */
export function createPlantStore({
  seed = PLANTS,
  storage = getStorage(),
  now = () => new Date(),
} = {}) {
  let lastWatered = {};
  // wateringId is the plant being watered right now, or null when nothing is being watered.
  let state = { plants: [], wateringId: null };
  const listeners = new Set();

  // Plants without a saved date start from the numbers in the data file.
  function fillMissingDates() {
    const saved = loadLastWatered(storage);
    const today = toDateKey(now());
    lastWatered = {};
    for (const plant of seed) {
      lastWatered[plant.id] = isDateKey(saved[plant.id])
        ? saved[plant.id]
        : addDays(today, -plant.daysSinceWatered);
    }
    saveLastWatered(storage, lastWatered);
  }

  // The plants with daysSinceWatered worked out from today's date.
  function currentPlants() {
    const today = toDateKey(now());
    return seed.map((plant) => ({
      ...plant,
      daysSinceWatered: Math.max(0, daysBetween(lastWatered[plant.id], today)),
    }));
  }

  function update(changes) {
    state = { ...state, ...changes };
    listeners.forEach((listener) => listener(state));
  }

  fillMissingDates();
  state = { plants: currentPlants(), wateringId: null };

  return {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },

    water(id) {
      if (state.wateringId !== null) {
        return;
      }
      update({ wateringId: id });
      setTimeout(() => {
        lastWatered[id] = toDateKey(now());
        saveLastWatered(storage, lastWatered);
        update({ plants: currentPlants() });
      }, DRINK_DELAY_MS);
      setTimeout(() => update({ wateringId: null }), WATERING_DURATION_MS);
    },

    /** Works the days out again, for example when the tab is opened the next morning. */
    refresh() {
      update({ plants: currentPlants() });
    },

    /** Forgets all saved dates, so every plant goes back to where it started. */
    reset() {
      if (state.wateringId !== null) {
        return;
      }
      clearLastWatered(storage);
      fillMissingDates();
      update({ plants: currentPlants() });
    },
  };
}
