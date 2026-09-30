import { AbsoluteFill, random, staticFile, useCurrentFrame } from 'remotion';

/**
 * Sand-grain / film-grain overlay. The only linear motion in the piece:
 * a slow constant drift, plus a per-2-frame jitter so the grain "lives".
 */
export const Grain = ({ opacity = 0.14 }: { opacity?: number }) => {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 2);
  const jx = Math.round(random(`gx${tick}`) * 512);
  const jy = Math.round(random(`gy${tick}`) * 512);
  const driftX = frame * 0.6;
  const driftY = frame * -0.35;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: `url(${staticFile('fx/grain.png')})`,
        backgroundSize: '384px 384px',
        backgroundPosition: `${jx + driftX}px ${jy + driftY}px`,
        mixBlendMode: 'overlay',
        opacity,
      }}
    />
  );
};

export const Vignette = ({ strength = 0.55 }: { strength?: number }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);
