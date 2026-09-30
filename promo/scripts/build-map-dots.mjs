// Precomputes the dot-matrix world map used in the Season scene.
// Samples a lon/lat grid over Europe → East Asia and keeps points on land.
// Run: npm run build:map   (output is committed; only re-run to change the grid)
import { writeFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-50m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

const BOUNDS = { lonMin: -24, lonMax: 140, latMin: 4, latMax: 70 };
const STEP = 0.6; // degrees

const dots = [];
for (let lat = BOUNDS.latMax; lat >= BOUNDS.latMin; lat -= STEP) {
  for (let lon = BOUNDS.lonMin; lon <= BOUNDS.lonMax; lon += STEP) {
    if (geoContains(land, [lon, lat])) dots.push([+lon.toFixed(2), +lat.toFixed(2)]);
  }
}

const out = new URL('../src/data/world-dots.json', import.meta.url);
writeFileSync(out, JSON.stringify({ step: STEP, bounds: BOUNDS, dots }));
console.log(`wrote ${dots.length} dots → ${out.pathname}`);
