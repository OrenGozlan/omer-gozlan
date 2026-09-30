import { useId, type CSSProperties } from 'react';
import type { Medal as MedalKind } from '../config/copy';
import { COLORS, FONTS } from '../config/theme';

export const MEDAL_COLORS: Record<MedalKind, { hi: string; mid: string; lo: string; text: string }> = {
  gold: { hi: '#fff3c4', mid: '#f5b50b', lo: '#9a5b06', text: '#5b3403' },
  silver: { hi: '#ffffff', mid: '#b8c2cf', lo: '#56606e', text: '#2c333d' },
  bronze: { hi: '#ffe0c2', mid: '#d0773b', lo: '#6e3312', text: '#43200a' },
};

type Props = {
  kind: MedalKind;
  size: number;
  /** -1..1: horizontal squash for a coin-flip spin */
  spin?: number;
  /** 0..1 position of the specular sweep; outside range = hidden */
  shine?: number;
  label?: string;
  ribbon?: boolean;
  style?: CSSProperties;
};

/** Medal coin with ribbon, bevel and a moving specular highlight. */
export const Medal = ({ kind, size, spin = 1, shine = -1, label, ribbon = true, style }: Props) => {
  const id = useId().replace(/:/g, '');
  const c = MEDAL_COLORS[kind];
  const sx = Math.max(0.06, Math.abs(spin));
  return (
    <svg width={size} height={size * (ribbon ? 1.45 : 1)} viewBox={`0 ${ribbon ? -45 : 0} 100 ${ribbon ? 145 : 100}`} style={{ overflow: 'visible', ...style }}>
      <defs>
        <radialGradient id={`face-${id}`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor={c.hi} />
          <stop offset="45%" stopColor={c.mid} />
          <stop offset="100%" stopColor={c.lo} />
        </radialGradient>
        <linearGradient id={`rim-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.hi} />
          <stop offset="100%" stopColor={c.lo} />
        </linearGradient>
        <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <circle cx="50" cy="50" r="46" />
        </clipPath>
      </defs>
      {ribbon && (
        <g>
          <path d="M28 -45 L46 -45 L56 12 L40 14 Z" fill={COLORS.israelBlue} />
          <path d="M72 -45 L54 -45 L44 12 L60 14 Z" fill={COLORS.white} />
          <path d="M28 -45 L46 -45 L56 12 L40 14 Z" fill="#000" opacity="0.15" />
        </g>
      )}
      <g transform={`translate(50 50) scale(${sx} 1) translate(-50 -50)`}>
        <circle cx="50" cy="50" r="48" fill={`url(#rim-${id})`} />
        <circle cx="50" cy="50" r="41" fill={`url(#face-${id})`} />
        <circle cx="50" cy="50" r="36" fill="none" stroke={c.hi} strokeOpacity="0.55" strokeWidth="1.6" />
        {label && spin > 0.35 && (
          <text x="50" y="62" textAnchor="middle" fontFamily={FONTS.display} fontWeight={900} fontSize="34" fill={c.text}>
            {label}
          </text>
        )}
        {shine >= 0 && shine <= 1 && (
          <g clipPath={`url(#clip-${id})`}>
            <rect x={-40 + shine * 140} y="-10" width="28" height="120" fill={`url(#shine-${id})`} transform="rotate(20 50 50)" />
          </g>
        )}
      </g>
    </svg>
  );
};
