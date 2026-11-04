// Checks the project before it is merged:
//   1. Every plant in the list has the fields the app needs, spelled correctly.
//   2. No file still has leftover merge conflict markers.
// Run it with:  node scripts/check-plants.mjs
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PLANT_FIELDS } from '../js/features/plants/models/plant.model.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const dataFile = 'js/features/plants/data/plants.js';
const errors = [];

// Prints an error that GitHub also shows on the file in the pull request.
function fail(file, line, message) {
  errors.push(message);
  console.error(`::error file=${file},line=${line}::${message}`);
}

function lineOf(file, text) {
  const index = readFileSync(join(root, file), 'utf8').split('\n').findIndex((l) => l.includes(text));
  return index === -1 ? 1 : index + 1;
}

// How many single-letter edits it takes to turn a into b.
function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
      previous = current;
    }
  }
  return row[b.length];
}

// 1. Leftover conflict markers, in any text file.
function* textFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* textFiles(path);
    else if (/\.(html|css|js|mjs|json|md|ya?ml|svg)$/.test(entry.name)) yield path;
  }
}

for (const path of textFiles(root)) {
  const file = relative(root, path);
  readFileSync(path, 'utf8').split('\n').forEach((text, index) => {
    if (/^(<{7}|>{7})( |$)/.test(text)) {
      fail(file, index + 1, `${file} still has merge conflict markers (${text.slice(0, 7)}). Resolve the conflict and delete the marker lines.`);
    }
  });
}

// 2. The plant list.
let plants = [];
try {
  ({ PLANTS: plants } = await import(pathToFileURL(join(root, dataFile)).href));
} catch (error) {
  fail(dataFile, 1, `${dataFile} could not be read: ${error.message}`);
}

const seen = new Set();
for (const plant of plants) {
  const label = `"${plant.name ?? 'a plant'}"`;
  const line = lineOf(dataFile, `name: '${plant.name}'`);

  for (const key of Object.keys(plant)) {
    if (key in PLANT_FIELDS) continue;
    const guess = Object.keys(PLANT_FIELDS).find((field) => distance(key, field) <= 2);
    fail(dataFile, line, `${label} has a field called "${key}", which the app does not know.${guess ? ` Did you mean "${guess}"?` : ''}`);
  }
  for (const [key, type] of Object.entries(PLANT_FIELDS)) {
    if (!(key in plant)) fail(dataFile, line, `${label} is missing "${key}".`);
    else if (typeof plant[key] !== type) fail(dataFile, line, `${label} has "${key}" set to a ${typeof plant[key]}, but it must be a ${type}.`);
  }
  if (seen.has(plant.id)) fail(dataFile, line, `${label} reuses the id ${plant.id}. Every plant needs its own id.`);
  seen.add(plant.id);
}

if (errors.length > 0) {
  console.error(`\nCheck failed with ${errors.length} problem${errors.length === 1 ? '' : 's'}.`);
  process.exit(1);
}
console.log(`Check passed: ${plants.length} plants look good, and no conflict markers were found.`);
