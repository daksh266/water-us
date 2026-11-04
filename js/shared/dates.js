// Dates are written as "yyyy-mm-dd" text, for example "2026-11-03". Working with whole days as
// text avoids problems with clocks changing and with the time of day.

const pad = (number) => String(number).padStart(2, '0');

function toTime(key) {
  const [year, month, day] = key.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Today's date, in the visitor's own time zone, as "yyyy-mm-dd". */
export function toDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Whether the text is a real date written as "yyyy-mm-dd". */
export function isDateKey(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  return addDays(value, 0) === value;
}

/** The whole number of days from one date to another. It is negative if "to" comes first. */
export function daysBetween(fromKey, toKey) {
  return Math.round((toTime(toKey) - toTime(fromKey)) / 86400000);
}

/** The date a number of days after (or before, if negative) the given date. */
export function addDays(key, days) {
  const date = new Date(toTime(key) + days * 86400000);
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}
