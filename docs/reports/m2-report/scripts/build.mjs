// Runs the scheduler, then expands <!-- include: path --> markers in report.src.md
// into CO3011_M2_Report_v0.1.md. Usage: node docs/m2-report/scripts/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
execFileSync(process.execPath, [join(root, 'scripts', 'schedule.mjs')], { stdio: 'inherit' });
const src = readFileSync(join(root, 'report.src.md'), 'utf8');
const out = src.replace(/<!-- include: (\S+) -->/g, (_, p) => readFileSync(join(root, p), 'utf8').trim());
const missing = out.match(/<!-- include:/g);
if (missing) throw new Error('unresolved include markers');
writeFileSync(join(root, 'CO3011_M2_Report_v0.1.md'), out);
console.log('built CO3011_M2_Report_v0.1.md');
