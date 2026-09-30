import { loadFont as loadBarlowCondensed } from '@remotion/google-fonts/BarlowCondensed';
import { loadFont as loadBarlow } from '@remotion/google-fonts/Barlow';

// Same families as the site (src/index.css): Barlow Condensed display + Barlow body.
const condensed = loadBarlowCondensed('normal', { weights: ['600', '700', '800', '900'], subsets: ['latin', 'latin-ext'] });
const body = loadBarlow('normal', { weights: ['500', '600', '700', '800'], subsets: ['latin', 'latin-ext'] });

export const FONTS = {
  display: condensed.fontFamily,
  body: body.fontFamily,
} as const;

// Site palette: amber-500 → orange-600 gradient, cream, stone darks.
// Navy/near-black for contrast; Israel blue + white as accent only.
export const COLORS = {
  amber: '#f59e0b',
  amberLight: '#fbbf24',
  amberPale: '#fde68a',
  orange: '#ea580c',
  cream: '#fffbf2',
  sand: '#d6b078',
  navy: '#0b1426',
  navyDeep: '#060b17',
  ink: '#050608',
  stone: '#1c1917',
  israelBlue: '#0038b8',
  white: '#ffffff',
} as const;

export const GRADIENTS = {
  brand: `linear-gradient(120deg, ${COLORS.amber} 0%, ${COLORS.orange} 100%)`,
  brandText: `linear-gradient(100deg, ${COLORS.amberPale} 0%, ${COLORS.amber} 45%, ${COLORS.orange} 100%)`,
} as const;
