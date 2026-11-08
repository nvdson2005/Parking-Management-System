// Regenerates the .drawio files, applies ELK layout where hand layout is not enough,
// and exports PNGs (2x, diagram XML embedded) for the DOCX. Requires draw.io Desktop CLI.
// Usage: node docs/m2-report/scripts/export-diagrams.mjs
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'diagrams');
const drawio = process.env.DRAWIO || 'drawio';
const run = (args) => execFileSync(drawio, args, { stdio: ['ignore', 'ignore', 'ignore'] });

execFileSync(process.execPath, [join(root, 'scripts', 'diagrams.mjs')], { stdio: 'inherit' });

// Mermaid sources (e.g. the ERD) are converted to .drawio first.
for (const f of readdirSync(dir).filter((x) => x.endsWith('.mmd'))) {
  run(['-x', '-f', 'xml', '-o', join(dir, f.replace(/\.mmd$/, '.drawio')), join(dir, f)]);
  console.log('mermaid ' + f);
}

const elk = {
  '02-pfd.drawio': JSON.stringify([{ layout: 'elkLayered', config: { 'elk.direction': 'RIGHT', 'elk.spacing.nodeNode': '30', 'elk.layered.spacing.nodeNodeBetweenLayers': '70' }, edgeStyle: 'orthogonal', corners: 'rounded' }]),
};
for (const [file, layout] of Object.entries(elk)) {
  const p = join(dir, file);
  run(['-x', '-f', 'xml', '--layout', layout, '-o', p, p]);
  console.log('layout ' + file);
}
for (const f of readdirSync(dir).filter((x) => x.endsWith('.drawio'))) {
  const png = join(dir, f.replace(/\.drawio$/, '.png'));
  run(['-x', '-f', 'png', '-e', '-s', '2', '-b', '10', '-o', png, join(dir, f)]);
  console.log('png ' + f.replace(/\.drawio$/, '.png'));
}
