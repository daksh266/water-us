import { createPlantCard } from './plant-card.js';

/** Shows one card per plant, and keeps the cards up to date as the store changes. */
export function initPlantList(container, store) {
  const cards = new Map();

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
  });
}
