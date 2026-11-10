import { createPlantCard } from './plant-card.js';

/**
 * Shows one card per plant, and keeps the cards up to date as the store changes.
 * The status element is a hidden live region that tells screen reader users when watering is done.
 */
export function initPlantList(container, store, status) {
  const cards = new Map();
  let watering = null;

  store.subscribe(({ plants, wateringId }) => {
    plants.forEach((plant) => {
      if (!cards.has(plant.id)) {
        const card = createPlantCard({ onWater: () => store.water(plant.id) });
        cards.set(plant.id, card);
        container.append(card.element);
      }
      cards.get(plant.id).update(plant, {
        watering: wateringId === plant.id,
        // Only one plant can be watered at a time.
        disabled: wateringId !== null,
      });
    });

    if (status && wateringId !== null) {
      // Cleared first, so watering the same plant again is announced again.
      status.textContent = '';
    } else if (status && watering !== null) {
      const plant = plants.find((p) => p.id === watering);
      status.textContent = plant ? `${plant.name} has been watered.` : '';
    }
    watering = wateringId;
  });
}
