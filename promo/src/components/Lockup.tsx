import { COLORS, FONTS, GRADIENTS } from '../config/theme';

/** "OG" monogram — same mark as public/favicon.svg on the site. */
export const Monogram = ({ size }: { size: number }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.22,
      background: GRADIENTS.brand,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: FONTS.display,
      fontWeight: 900,
      fontSize: size * 0.5,
      color: COLORS.white,
      letterSpacing: '-0.02em',
      boxShadow: `0 ${size * 0.12}px ${size * 0.4}px rgba(234,88,12,0.35)`,
    }}
  >
    OG
  </div>
);

/** Thin blue–white–blue bar: the Israel accent, used sparingly. */
export const FlagBar = ({ width, height = 10 }: { width: number; height?: number }) => (
  <div style={{ width, height, display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden' }}>
    <div style={{ flex: 1, background: COLORS.israelBlue }} />
    <div style={{ flex: 1.4, background: COLORS.white }} />
    <div style={{ flex: 1, background: COLORS.israelBlue }} />
  </div>
);

/** Gradient text (site wordmark style: amber → orange). */
export const gradientText = {
  background: GRADIENTS.brandText,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
} as const;
