import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  describeDue,
  describeInterval,
  describeLastWatered,
  hydrationPercent,
  isThirsty,
} from '../js/features/plants/rules/plant-care.js';

const plant = (wateringEveryDays, daysSinceWatered) => ({ wateringEveryDays, daysSinceWatered });

test('a plant is thirsty once it reaches its watering interval', () => {
  assert.equal(isThirsty(plant(3, 2)), false);
  assert.equal(isThirsty(plant(3, 3)), true);
  assert.equal(isThirsty(plant(3, 10)), true);
});

test('hydration goes from 100 down to 0 and never below', () => {
  assert.equal(hydrationPercent(plant(4, 0)), 100);
  assert.equal(hydrationPercent(plant(4, 1)), 75);
  assert.equal(hydrationPercent(plant(4, 4)), 0);
  assert.equal(hydrationPercent(plant(4, 9)), 0);
});

test('the wording reads naturally for 0, 1, and many days', () => {
  assert.equal(describeLastWatered(plant(3, 0)), 'Last watered today');
  assert.equal(describeLastWatered(plant(3, 1)), 'Last watered yesterday');
  assert.equal(describeLastWatered(plant(3, 5)), 'Last watered 5 days ago');
  assert.equal(describeInterval(plant(1, 0)), 'Water every day');
  assert.equal(describeInterval(plant(7, 0)), 'Water every 7 days');
});

test('describeDue says when the next watering is', () => {
  assert.equal(describeDue(plant(7, 2)), 'In 5 days');
  assert.equal(describeDue(plant(7, 6)), 'Tomorrow');
  assert.equal(describeDue(plant(7, 7)), 'Today');
  assert.equal(describeDue(plant(7, 8)), 'Overdue by 1 day');
  assert.equal(describeDue(plant(7, 15)), 'Overdue by 8 days');
});
