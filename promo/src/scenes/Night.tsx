import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../config/theme';
import { CUES, FPS, NIGHT_TIMELINE as T, SCENES } from '../config/timing';
import { usePromo } from '../lib/format-context';
import { EASE, SPRINGS, lerp, shake, springAt, tween } from '../lib/motion';

const C = CUES.night;
const D = SCENES.night.duration;
const AI = staticFile('ai/night-bullet.mp4');
const BURST = [1, 2, 3, 4, 5].map((i) => staticFile(`photos/night-${i}.jpg`));

/**
 * One portrait "window" of footage. 9:16 fills the frame; 16:9 shows a centred 3:4 panel over a
 * blurred, darkened copy of the same footage (so the source is never upscaled past its detail).
 */
const Framed = ({ children, backdrop }: { children: (style: CSSProperties) => ReactNode; backdrop: (style: CSSProperties) => ReactNode }) => {
  const { format } = usePromo();
  const fill: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };
  if (format.vertical) return <AbsoluteFill>{children(fill)}</AbsoluteFill>;
  const panelW = Math.round((format.height * 3) / 4);
  return (
    <AbsoluteFill>
      {backdrop({ ...fill, filter: 'blur(28px) brightness(0.35) saturate(0.8)', transform: 'scale(1.15)' })}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: (format.width - panelW) / 2, width: panelW, overflow: 'hidden', boxShadow: '0 0 80px rgba(0,0,0,0.7)' }}>
        {children(fill)}
      </div>
    </AbsoluteFill>
  );
};

const AiClip = ({ fromSec }: { fromSec: number }) => {
  const trimBefore = Math.round(fromSec * FPS);
  return (
    <Framed backdrop={(style) => <OffthreadVideo src={AI} trimBefore={trimBefore} muted style={style} />}>
      {(style) => <OffthreadVideo src={AI} trimBefore={trimBefore} muted style={style} />}
    </Framed>
  );
};

/** real 5-frame burst from the same match, flashed in at the peak like press cameras firing */
const Burst = () => {
  const frame = useCurrentFrame(); // local to the burst sequence
  const idx = Math.min(4, Math.floor(frame / C.burstStep));
  const since = frame - idx * C.burstStep;
  const flash = frame < 5 * C.burstStep ? tween(since, [0, 3], [0.45, 0], EASE.out) : 0;
  return (
    <AbsoluteFill>
      <Framed backdrop={(style) => <Img src={BURST[idx]} style={style} />}>
        {(style) => (
          <>
            {BURST.map((src, i) => (
              <Img key={src} src={src} style={{ ...style, objectPosition: '50% 40%', opacity: i === idx ? 1 : 0 }} />
            ))}
          </>
        )}
      </Framed>
      <AbsoluteFill style={{ background: COLORS.white, opacity: flash, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

/**
 * 10 · NIGHT SPIKE — bullet-time: AI approach + leap (Seedance 2.5, generated from a real photo
 * of Omer on this court), the real 5-frame burst at the peak, frozen orbit, spike into the lens.
 * No text overlays — the footage carries it.
 */
export const Night = () => {
  const frame = useCurrentFrame();
  const hit = shake(frame, T.impact, 26, 2);
  const impactFlash = tween(frame, [T.impact, T.impact + 2], [0.7, 0], EASE.out);
  const frozen = tween(frame, [T.resume, T.resume + 20], [0, 1]) * (1 - tween(frame, [T.contact - 10, T.contact], [0, 1]));
  const vignette = lerp(0.35, 0.6, frozen);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${hit.x}px, ${hit.y}px)` }}>
        <Sequence durationInFrames={T.burstStart} layout="none">
          <AiClip fromSec={0} />
        </Sequence>
        <Sequence from={T.burstStart} durationInFrames={T.resume - T.burstStart} layout="none">
          <Burst />
        </Sequence>
        <Sequence from={T.resume} durationInFrames={D - T.resume} layout="none">
          <AiClip fromSec={C.aiPeak} />
        </Sequence>
      </AbsoluteFill>
      <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse 70% 70% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,${vignette}) 100%)` }} />
      <AbsoluteFill style={{ background: COLORS.white, opacity: impactFlash * springAt(frame, T.impact, SPRINGS.snappy), mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};
