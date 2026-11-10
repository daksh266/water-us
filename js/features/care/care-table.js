import { daysUntilDue, describeDue, describeEvery } from '../plants/rules/plant-care.js';

/** Fills the care guide table with every plant, how often it needs water, and when it is next due. */
export function initCareTable(body, store) {
  store.subscribe(({ plants }) => {
    body.replaceChildren();
    for (const plant of plants) {
      const row = body.insertRow();

      const name = row.insertCell();
      name.textContent = `${plant.emoji} ${plant.name}`;

      row.insertCell().textContent = describeEvery(plant);

      const due = row.insertCell();
      due.textContent = describeDue(plant);
      due.className = daysUntilDue(plant) <= 0 ? 'due thirsty-now' : 'due';
    }
  });
}
