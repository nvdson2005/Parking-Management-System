// Baseline V2.0 (A-106). Runs the unchanged V1.0 scheduler (schedule.mjs) against data/plan-v2.0.mjs
// and writes the tables into generated-v2/. V1.0 inputs and outputs are left untouched, so
// `git diff --diff-filter=MD baseline-v1.0 -- docs/m2-report` stays as it was.
// Usage: node docs/m2-report/scripts/schedule-v2.mjs
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
let src = readFileSync(join(here, 'schedule.mjs'), 'utf8');

const swaps = [
  ["from '../data/plan.mjs'", "from '../data/plan-v2.0.mjs'"],
  ["join(here, '..', 'generated')", "join(here, '..', 'generated-v2')"],
  // Labels in the V1.0 script name the four-week window; V2.0 has three weeks (CR-01).
  ["'Giờ/tuần (W12 / W13-W15)'", "'Giờ/tuần (W12 / W13 / W14)'"],
  ["`${W[0].hoursPerPerson} / ${W[1].hoursPerPerson}`", "W.map((w) => w.hoursPerPerson).join(' / ')"],
  ["'Giờ khả dụng W12-W15'", "'Giờ khả dụng W12-W14'"],
  ["['Năng lực W12-W15', totals.capacityTotal]", "['Năng lực W12-W14', totals.capacityTotal]"],
];
for (const [from, to] of swaps) {
  if (!src.includes(from)) throw new Error(`schedule.mjs changed; cannot find: ${from}`);
  src = src.replace(from, to);
}

const tmp = join(here, '.schedule-v2.tmp.mjs');
writeFileSync(tmp, src);
try {
  await import(pathToFileURL(tmp).href);
} finally {
  rmSync(tmp, { force: true });
}
