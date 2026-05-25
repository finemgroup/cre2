import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST_ASSETS = path.resolve('dist/assets');
const JS_BUDGET_BYTES = 160 * 1024;
const CSS_BUDGET_BYTES = 48 * 1024;
const TOTAL_JS_BUDGET_BYTES = 520 * 1024;
const TOTAL_CSS_BUDGET_BYTES = 64 * 1024;
const MAP_LAYER_METADATA_BUDGET_BYTES = 24 * 1024;
const MAP_LAYER_GEOMETRY_BUDGET_BYTES = 96 * 1024;

const files = await readdir(DIST_ASSETS);
const failures = [];
let totalJsBytes = 0;
let totalCssBytes = 0;

for (const file of files) {
  const filePath = path.join(DIST_ASSETS, file);
  const info = await stat(filePath);
  if (file.endsWith('.js') && info.size > JS_BUDGET_BYTES) {
    failures.push(`${file} is ${info.size} bytes, over JS budget ${JS_BUDGET_BYTES}`);
  }
  if (file.endsWith('.js')) totalJsBytes += info.size;
  if (file.endsWith('.css') && info.size > CSS_BUDGET_BYTES) {
    failures.push(`${file} is ${info.size} bytes, over CSS budget ${CSS_BUDGET_BYTES}`);
  }
  if (file.endsWith('.css')) totalCssBytes += info.size;
  if (/map-layer.*metadata.*\.json$/i.test(file) && info.size > MAP_LAYER_METADATA_BUDGET_BYTES) {
    failures.push(
      `${file} is ${info.size} bytes, over map layer metadata budget ${MAP_LAYER_METADATA_BUDGET_BYTES}`
    );
  }
  if (/map-layer.*geometry.*\.json$/i.test(file) && info.size > MAP_LAYER_GEOMETRY_BUDGET_BYTES) {
    failures.push(
      `${file} is ${info.size} bytes, over map layer geometry budget ${MAP_LAYER_GEOMETRY_BUDGET_BYTES}`
    );
  }
}

if (totalJsBytes > TOTAL_JS_BUDGET_BYTES) {
  failures.push(`Total JS is ${totalJsBytes} bytes, over budget ${TOTAL_JS_BUDGET_BYTES}`);
}

if (totalCssBytes > TOTAL_CSS_BUDGET_BYTES) {
  failures.push(`Total CSS is ${totalCssBytes} bytes, over budget ${TOTAL_CSS_BUDGET_BYTES}`);
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Bundle budget check passed.');
