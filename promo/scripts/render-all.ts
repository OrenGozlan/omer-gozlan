// Renders every Promo-* composition to H.264 MP4 plus a PNG poster frame.
// Bundles once, then renders sequentially. Run: npm run render:all
// Optional filter: npm run render:all -- 9x16
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia, renderStill } from '@remotion/renderer';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { POSTER_FRAME } from '../src/config/timing.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out');
mkdirSync(outDir, { recursive: true });
const filter = process.argv[2];

console.log('Bundling…');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src/index.ts') });

const comps = (await getCompositions(serveUrl)).filter((c) => c.id.startsWith('Promo-') && (!filter || c.id.includes(filter)));
if (comps.length === 0) throw new Error(`No compositions matched "${filter ?? 'Promo-*'}"`);

for (const composition of comps) {
  const slug = composition.id.toLowerCase().replace(/^promo-/, '');
  const video = path.join(outDir, `promo-${slug}.mp4`);
  const poster = path.join(outDir, `poster-${slug}.png`);

  let last = -1;
  await renderMedia({
    serveUrl,
    composition,
    codec: 'h264',
    crf: 18,
    pixelFormat: 'yuv420p',
    colorSpace: 'bt709', // tv-range BT.709 — what social uploaders expect (default gives yuvj420p)
    imageFormat: 'jpeg',
    jpegQuality: 95,
    outputLocation: video,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== last) {
        last = pct;
        process.stdout.write(`\r${composition.id}  ${pct}%   `);
      }
    },
  });
  console.log(`\n  → ${path.relative(root, video)}`);

  await renderStill({ serveUrl, composition, frame: POSTER_FRAME, output: poster, imageFormat: 'png' });
  console.log(`  → ${path.relative(root, poster)} (frame ${POSTER_FRAME})`);
}
