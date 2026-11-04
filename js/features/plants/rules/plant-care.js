/** A plant is thirsty once it has gone as many days as its watering interval without water. */
export function isThirsty(plant) {
  return plant.daysSinceWatered >= plant.wateringEveryDays;
}

/** How much water is left, from 0 (thirsty) to 100 (just watered). */
export function hydrationPercent(plant) {
  const left = 1 - plant.daysSinceWatered / plant.wateringEveryDays;
  return Math.round(Math.max(0, left) * 100);
}

/** How many days until the plant needs water. It is zero or less once the plant is thirsty. */
export function daysUntilDue(plant) {
  return plant.wateringEveryDays - plant.daysSinceWatered;
}

export function describeInterval(plant) {
  return plant.wateringEveryDays === 1 ? 'Water every day' : `Water every ${plant.wateringEveryDays} days`;
}

export function describeLastWatered(plant) {
  const days = plant.daysSinceWatered;
  if (days === 0) return 'Last watered today';
  if (days === 1) return 'Last watered yesterday';
  return `Last watered ${days} days ago`;
}

export function describeDue(plant) {
  const days = daysUntilDue(plant);
  if (days > 1) return `In ${days} days`;
  if (days === 1) return 'Tomorrow';
  if (days === 0) return 'Today';
  return days === -1 ? 'Overdue by 1 day' : `Overdue by ${-days} days`;
}
