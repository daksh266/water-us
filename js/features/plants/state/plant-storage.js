// Saves when each plant was last watered, in the visitor's own browser. Nothing leaves the browser.
import { isDateKey } from '../../../shared/dates.js';

const KEY = 'water-us:last-watered:v1';

/** The browser's storage, or a stand-in that forgets everything if the browser blocks storage. */
export function getStorage() {
  try {
    const storage = window.localStorage;
    storage.setItem('water-us:test', '1');
    storage.removeItem('water-us:test');
    return storage;
  } catch {
    const memory = new Map();
    return {
      getItem: (key) => (memory.has(key) ? memory.get(key) : null),
      setItem: (key, value) => memory.set(key, String(value)),
      removeItem: (key) => memory.delete(key),
    };
  }
}

/** The saved dates as { plantId: "yyyy-mm-dd" }. Anything unreadable is ignored. */
export function loadLastWatered(storage) {
  try {
    const saved = JSON.parse(storage.getItem(KEY));
    if (saved === null || typeof saved !== 'object' || Array.isArray(saved)) {
      return {};
    }
    return Object.fromEntries(Object.entries(saved).filter(([, value]) => isDateKey(value)));
  } catch {
    return {};
  }
}

export function saveLastWatered(storage, lastWatered) {
  try {
    storage.setItem(KEY, JSON.stringify(lastWatered));
  } catch {
    // The browser would not save it. The page still works, it just will not remember.
  }
}

export function clearLastWatered(storage) {
  try {
    storage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
