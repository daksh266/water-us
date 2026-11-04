/**
 * What a plant looks like. The check in scripts/check-plants.mjs uses this list too,
 * so a plant with a missing or misspelled field is caught before it reaches the page.
 */
export const PLANT_FIELDS = {
  id: 'number',
  name: 'string',
  emoji: 'string',
  wateringEveryDays: 'number',
  daysSinceWatered: 'number',
};

/**
 * @typedef {Object} Plant
 * @property {number} id
 * @property {string} name
 * @property {string} emoji
 * @property {number} wateringEveryDays
 * @property {number} daysSinceWatered
 */
