import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../config/theme';
import { TRANSITION } from '../config/timing';
import { EASE, lerp, tween } from '../lib/motion';
import { Volleyball } from './Volleyball';

/**
 * Scene transition: a volleyball whips across the frame on a parabolic arc,
 * passing close to camera exactly on the cut so the hard cut hides behind it.
 * Rendered at composition level (absolute frames).
 */
export const BallArc = ({ cut, direction }: { cut: number; direction: 1 | -1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const half = TRANSITION.halfLength;
  if (frame < cut - half || frame > cut + half) return null;

  const pos = (f: number) => {
    const p = tween(f, [cut - half, cut + half], [0, 1], EASE.inOut);
    const xStart = direction === 1 ? -0.2 * width : 1.2 * width;
    const xEnd = direction === 1 ? 1.2 * width : -0.2 * width;
    const x = lerp(xStart, xEnd, p);
    const y = height * 0.85 - Math.sin(Math.PI * p) * height * 0.55;
    const size = Math.min(width, height) * (0.18 + 0.5 * Math.sin(Math.PI * p));
    return { x, y, size, rot: p * 900 * direction };
  };

  const now = pos(frame);
  const trail = Array.from({ length: 10 }, (_, i) => pos(frame - (i + 1) * 0.45));
  const trailPath = [now, ...trail].map((q, i) => `${i === 0 ? 'M' : 'L'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' ');
  const flash = tween(Math.abs(frame - cut), [0, 3], [0.28, 0], EASE.out);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id={`trail-${cut}`} gradientUnits="userSpaceOnUse" x1={now.x} y1={now.y} x2={trail[9].x} y2={trail[9].y}>
            <stop offset="0%" stopColor={COLORS.amberPale} stopOpacity="0.9" />
            <stop offset="50%" stopColor={COLORS.amber} stopOpacity="0.55" />
            <stop offset="100%" stopColor={COLORS.orange} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={trailPath} stroke={`url(#trail-${cut})`} strokeWidth={now.size * 0.55} strokeLinecap="round" fill="none" style={{ filter: 'blur(10px)' }} />
      </svg>
      {trail.slice(0, 4).map((q, i) => (
        <Volleyball
          key={i}
          size={q.size}
          rotation={q.rot}
          style={{ position: 'absolute', left: q.x - q.size / 2, top: q.y - q.size / 2, opacity: 0.22 - i * 0.05, filter: 'blur(4px)' }}
        />
      ))}
      <Volleyball
        size={now.size}
        rotation={now.rot}
        style={{ position: 'absolute', left: now.x - now.size / 2, top: now.y - now.size / 2, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))' }}
      />
      <AbsoluteFill style={{ background: COLORS.amberPale, opacity: flash, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};
