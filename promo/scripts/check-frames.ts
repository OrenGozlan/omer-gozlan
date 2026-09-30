// Renders a set of stills for quick visual review → out/frames/<comp>-<frame>.jpg
// Usage: npm run frames -- [16x9|9x16] [frame,frame,...]
import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out', 'frames');
mkdirSync(outDir, { recursive: true });

const filter = process.argv[2];
const frames = (process.argv[3] ?? '40,150,225,280,330,420,500,640,760,900,1000,1040,1150,1300,1450,1600,1790').split(',').map(Number);

const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });
const comps = (await getCompositions(serveUrl)).filter((c) => c.id.startsWith('Promo-') && (!filter || c.id.includes(filter)));

for (const composition of comps) {
  for (const frame of frames) {
    const output = path.join(outDir, `${composition.id}-${String(frame).padStart(4, '0')}.jpg`);
    await renderStill({ serveUrl, composition, frame, output, imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5 });
  }
  console.log(`${composition.id}: ${frames.length} frames → out/frames`);
}
