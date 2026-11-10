import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createFlight, stepFlight } from '../js/shared/ui/wind.js';

const FLIGHTS = 200;

test('a leaf always has real numbers for its place and direction', () => {
  for (let i = 0; i < FLIGHTS; i++) {
    const flight = createFlight(1000, 600);
    for (let t = 0; t < 60; t += 0.05) {
      stepFlight(flight, 0.05);
    }
    for (const value of [flight.x, flight.y, flight.heading]) {
      assert.ok(Number.isFinite(value), `flight ${i} reached ${value}`);
    }
  }
});

test('the wind carries leaves to the right on average', () => {
  let total = 0;
  for (let i = 0; i < FLIGHTS; i++) {
    const flight = createFlight(1000, 600);
    const start = flight.x;
    for (let t = 0; t < 10; t += 0.05) {
      stepFlight(flight, 0.05);
    }
    total += flight.x - start;
  }
  assert.ok(total / FLIGHTS > 100, `leaves only moved ${Math.round(total / FLIGHTS)}px on average`);
});
