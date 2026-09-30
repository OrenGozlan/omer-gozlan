import { Easing, interpolate, spring, type SpringConfig } from 'remotion';
import { FPS } from '../config/timing';

/** Easing curves. Nothing in the piece moves linearly except texture drift. */
export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1), //       expo-out: fast in, long settle
  inOut: Easing.bezier(0.65, 0, 0.35, 1), //    camera moves
  in: Easing.bezier(0.55, 0, 0.9, 0.3), //      accelerating fall
  punch: Easing.bezier(0.2, 1.4, 0.4, 1), //    slight overshoot
} as const;

export const SPRINGS = {
  slam: { damping: 11, stiffness: 260, mass: 0.7 },
  snappy: { damping: 16, stiffness: 220, mass: 0.6 },
  soft: { damping: 22, stiffness: 120, mass: 0.9 },
  camera: { damping: 26, stiffness: 140, mass: 1 },
} satisfies Record<string, Partial<SpringConfig>>;

/** Spring that starts at `delay` frames. */
export const springAt = (frame: number, delay: number, config: Partial<SpringConfig> = SPRINGS.snappy, durationInFrames?: number) =>
  spring({ frame: frame - delay, fps: FPS, config, durationInFrames });

/** Clamped, eased interpolate over a frame window. */
export const tween = (
  frame: number,
  [start, end]: readonly [number, number],
  [from, to]: readonly [number, number],
  easing: (t: number) => number = EASE.out,
) =>
  interpolate(frame, [start, end], [from, to], {
    easing,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Exponentially-decaying shake after an impact at `at`. */
export const shake = (frame: number, at: number, amplitude: number, seed = 1) => {
  const t = frame - at;
  if (t < 0) return { x: 0, y: 0 };
  const decay = Math.exp(-t / 4);
  return {
    x: Math.sin(t * 2.7 + seed) * amplitude * decay,
    y: Math.cos(t * 3.3 + seed * 2) * amplitude * decay,
  };
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
