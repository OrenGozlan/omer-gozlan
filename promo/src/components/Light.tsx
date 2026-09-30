import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../config/theme';
import { EASE, lerp, tween } from '../lib/motion';

/**
 * Warm light leaks: soft blobs that sweep across the frame with eased motion,
 * screened over the image. `seed` gives each scene its own path.
 */
export const LightLeak = ({ seed, duration, intensity = 0.55 }: { seed: string; duration: number; intensity?: number }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = tween(frame, [0, duration], [0, 1], EASE.inOut);
  const blobs = [0, 1, 2].map((i) => {
    const r = (k: string) => random(`${seed}-${i}-${k}`);
    const x0 = r('x0') * width;
    const x1 = r('x1') * width;
    const y0 = r('y0') * height;
    const y1 = r('y1') * height;
    const size = (0.5 + r('s') * 0.6) * Math.max(width, height);
    const color = [COLORS.amber, COLORS.orange, COLORS.amberPale][i];
    return { x: lerp(x0, x1, p), y: lerp(y0, y1, p), size, color, a: (0.35 + r('a') * 0.4) * intensity };
  });
  const flicker = 0.85 + 0.15 * Math.sin(frame * 0.35 + seed.length);
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none', opacity: flicker }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x - b.size / 2,
            top: b.y - b.size / 2,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${b.color} 0%, transparent 62%)`,
            opacity: b.a,
            filter: 'blur(30px)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/**
 * Sun flare: hot core, anamorphic streak, and lens ghosts mirrored through the
 * frame centre. `amount` 0..1 drives size and brightness.
 */
export const SunFlare = ({ x, y, amount }: { x: number; y: number; amount: number }) => {
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height / 2;
  const core = 140 + amount * 520;
  const ghosts = [0.35, 0.7, 1.25, 1.6];
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: x - core,
          top: y - core,
          width: core * 2,
          height: core * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, #fff 0%, ${COLORS.amberPale} 12%, ${COLORS.amber} 30%, rgba(234,88,12,0.35) 50%, transparent 70%)`,
          opacity: Math.min(1, amount * 1.4),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - width * 0.9 * amount,
          top: y - 6,
          width: width * 1.8 * amount,
          height: 12,
          borderRadius: 12,
          background: `linear-gradient(90deg, transparent, ${COLORS.amberPale} 45%, #fff 50%, ${COLORS.amberPale} 55%, transparent)`,
          filter: 'blur(3px)',
          opacity: amount * 0.9,
        }}
      />
      {ghosts.map((g, i) => {
        const gx = x + (cx - x) * 2 * g;
        const gy = y + (cy - y) * 2 * g;
        const s = 40 + i * 50;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: gx - s / 2,
              top: gy - s / 2,
              width: s,
              height: s,
              borderRadius: '50%',
              border: `2px solid rgba(253,230,138,${0.25 * amount})`,
              background: `radial-gradient(circle, rgba(245,158,11,${0.18 * amount}) 0%, transparent 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
