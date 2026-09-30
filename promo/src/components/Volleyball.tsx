import { useId, type CSSProperties } from 'react';
import { COLORS } from '../config/theme';

/**
 * Stylised volleyball. Seams follow the lucide "volleyball" glyph the site uses
 * in its hero, with amber / Israel-blue panel tints and spherical shading.
 */
export const Volleyball = ({ size, rotation = 0, style }: { size: number; rotation?: number; style?: CSSProperties }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id={`shade-${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
        <clipPath id={`clip-${id}`}>
          <circle cx="12" cy="12" r="10" />
        </clipPath>
      </defs>
      <g transform={`rotate(${rotation} 12 12)`} clipPath={`url(#clip-${id})`}>
        <circle cx="12" cy="12" r="10" fill={COLORS.cream} />
        {/* panel tints, drawn as fat strokes along the seams */}
        <path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" stroke={COLORS.amber} strokeWidth="4.2" fill="none" transform="translate(0 -2)" />
        <path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" stroke={COLORS.israelBlue} strokeWidth="4.2" fill="none" transform="translate(1.6 0.6)" />
        <path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" stroke={COLORS.amber} strokeWidth="4.2" fill="none" transform="translate(-2 0)" />
        <g stroke={COLORS.navy} strokeWidth="0.9" fill="none" strokeLinecap="round">
          <path d="M11.1 7.1a16.55 16.55 0 0 1 10.9 4" />
          <path d="M12 12a12.6 12.6 0 0 1-8.7 5" />
          <path d="M16.8 13.6a16.55 16.55 0 0 1-9 7.5" />
          <path d="M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" />
          <path d="M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" />
        </g>
      </g>
      <circle cx="12" cy="12" r="10" fill={`url(#shade-${id})`} />
      <circle cx="12" cy="12" r="10" fill="none" stroke={COLORS.navy} strokeWidth="0.6" strokeOpacity="0.6" />
    </svg>
  );
};
