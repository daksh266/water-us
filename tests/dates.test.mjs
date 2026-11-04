import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addDays, daysBetween, isDateKey, toDateKey } from '../js/shared/dates.js';

test('toDateKey writes the local date as yyyy-mm-dd', () => {
  assert.equal(toDateKey(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(toDateKey(new Date(2026, 10, 3, 0, 1)), '2026-11-03');
});

test('daysBetween counts whole days, forwards and backwards', () => {
  assert.equal(daysBetween('2026-11-01', '2026-11-03'), 2);
  assert.equal(daysBetween('2026-11-03', '2026-11-03'), 0);
  assert.equal(daysBetween('2026-11-03', '2026-11-01'), -2);
});

test('daysBetween is not thrown off by clocks changing', () => {
  assert.equal(daysBetween('2026-03-07', '2026-03-09'), 2);
  assert.equal(daysBetween('2026-10-30', '2026-11-02'), 3);
});

test('addDays crosses month and year ends, and leap days', () => {
  assert.equal(addDays('2026-01-31', 1), '2026-02-01');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2028-02-28', 1), '2028-02-29');
  assert.equal(addDays('2026-11-03', -15), '2026-10-19');
});

test('isDateKey accepts real dates only', () => {
  assert.equal(isDateKey('2026-11-03'), true);
  assert.equal(isDateKey('2026-02-30'), false);
  assert.equal(isDateKey('2026-13-01'), false);
  assert.equal(isDateKey('11/03/2026'), false);
  assert.equal(isDateKey(20261103), false);
  assert.equal(isDateKey(null), false);
});
