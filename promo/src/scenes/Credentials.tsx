import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { KenBurns } from '../components/KenBurns';
import { LightLeak } from '../components/Light';
import { FlagBar, gradientText } from '../components/Lockup';
import { COLORS, FONTS, GRADIENTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, springAt, tween } from '../lib/motion';

const C = CUES.credentials;

/** Slot-machine reel that spins down and lands on `digit` (motion only — no data implied). */
const Reel = ({ digit, start, fontSize }: { digit: string; start: number; fontSize: number }) => {
  const frame = useCurrentFrame();
  const lineH = fontSize * 0.9;
  const strip = [...'0123456789', ...'0123456789', digit];
  const idx = (f: number) => tween(f, [start, start + C.reelSpin], [0, strip.length - 1], EASE.out);
  const velocity = Math.abs(idx(frame) - idx(frame - 1));
  return (
    <div style={{ height: lineH, overflow: 'hidden', lineHeight: `${lineH}px` }}>
      <div style={{ transform: `translateY(${-idx(frame) * lineH}px)`, filter: `blur(${Math.min(14, velocity * 5)}px)` }}>
        {strip.map((d, i) => (
          <div key={i} style={{ height: lineH, textAlign: 'center' }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

const Badge = ({ start, division, size }: { start: number; division: string; size: number }) => {
  const frame = useCurrentFrame();
  const { copy } = usePromo();
  const land = start + C.reelSpin;
  const ring = tween(frame, [start, start + 14], [0, 1], EASE.out);
  const punch = springAt(frame, land, SPRINGS.slam);
  const scale = frame < land ? tween(frame, [start, start + 6], [0.7, 1], EASE.out) : lerp(1.14, 1, punch);
  const pill = springAt(frame, land, SPRINGS.snappy);
  const wave = tween(frame, [land, land + 18], [0, 1], EASE.out);
  const numSize = size * 0.5;

  return (
    <div style={{ position: 'relative', width: size, height: size, transform: `scale(${scale})` }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <circle cx="50" cy="50" r="46" fill="rgba(6,11,23,0.55)" />
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={COLORS.amber}
          strokeWidth="2.2"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - ring}
          transform={`rotate(${-90 + frame * 0.6} 50 50)`}
        />
        <circle cx="50" cy="50" r="41" fill="none" stroke={COLORS.amberPale} strokeOpacity={0.25} strokeWidth="0.6" />
        {frame >= land && <circle cx="50" cy="50" r={46 + wave * 30} fill="none" stroke={COLORS.amberPale} strokeWidth={lerp(3, 0.2, wave)} opacity={1 - wave} />}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: size * 0.07, letterSpacing: '0.3em', color: COLORS.amberPale, textTransform: 'uppercase', marginBottom: size * 0.01, paddingLeft: '0.3em' }}>
          {copy.credentials.caption}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', fontFamily: FONTS.display, fontWeight: 900, fontSize: numSize, color: COLORS.white, lineHeight: 0.9 }}>
          <span style={{ fontSize: numSize * 0.55, marginTop: numSize * 0.08, marginRight: numSize * 0.02, ...gradientText }}>#</span>
          <Reel digit={copy.credentials.rank} start={start} fontSize={numSize} />
        </div>
        <div
          style={{
            marginTop: size * 0.03,
            padding: `${size * 0.012}px ${size * 0.06}px`,
            borderRadius: 999,
            background: GRADIENTS.brand,
            fontFamily: FONTS.display,
            fontWeight: 800,
            fontSize: size * 0.11,
            letterSpacing: '0.04em',
            color: COLORS.navyDeep,
            transform: `translateY(${(1 - pill) * 40}px) scale(${lerp(0.6, 1, pill)})`,
            opacity: Math.min(1, pill * 2),
          }}
        >
          {division}
        </div>
      </div>
    </div>
  );
};

/** One badge over a photo, with a circular masked reveal centred on the badge. */
const Solo = ({ photo, division, duration, badgeAt, objectPosition }: { photo: string; division: string; duration: number; badgeAt: { x: string; y: string }; objectPosition: string }) => {
  const frame = useCurrentFrame();
  const r = useResponsive();
  const reveal = tween(frame, [0, 14], [8, 150], EASE.out);
  const size = r(560, 560);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <AbsoluteFill style={{ clipPath: `circle(${reveal}% at ${badgeAt.x} ${badgeAt.y})` }}>
        <KenBurns src={photo} duration={duration} scale={[1.14, 1.04]} drift={[r(-30, 0), r(0, -20)]} objectPosition={objectPosition} imgStyle={{ filter: 'brightness(0.62) saturate(1.1)' }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle at ${badgeAt.x} ${badgeAt.y}, rgba(6,11,23,0.75) 0%, rgba(6,11,23,0.2) 45%, rgba(6,11,23,0.55) 100%)` }} />
        <LightLeak seed={division} duration={duration} intensity={0.45} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: badgeAt.x, top: badgeAt.y, transform: 'translate(-50%, -50%)' }}>
        <Badge start={2} division={division} size={size} />
      </div>
    </AbsoluteFill>
  );
};

const Together = () => {
  const frame = useCurrentFrame();
  const { copy } = usePromo();
  const r = useResponsive();
  const label = springAt(frame, 6, SPRINGS.snappy);
  const size = r(420, 460);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, ${COLORS.navy} 0%, ${COLORS.navyDeep} 70%)`, alignItems: 'center', justifyContent: 'center' }}>
      <LightLeak seed="together" duration={SCENES.credentials.duration - C.together} intensity={0.35} />
      <div style={{ display: 'flex', flexDirection: r('row', 'column'), gap: r(120, 60), alignItems: 'center' }}>
        {/* both badges already landed: start them "in the past" so reels sit on the digit */}
        <Badge start={-C.reelSpin - 30} division={copy.credentials.a} size={size} />
        <Badge start={-C.reelSpin - 30} division={copy.credentials.b} size={size} />
      </div>
      <div
        style={{
          marginTop: r(70, 80),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          transform: `translateY(${(1 - label) * 60}px)`,
          opacity: label,
        }}
      >
        <FlagBar width={90} height={34} />
        <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: r(78, 72), textTransform: 'uppercase', color: COLORS.white, letterSpacing: '0.02em', textAlign: 'center', maxWidth: r(1600, 800), lineHeight: 1 }}>
          {copy.credentials.label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** 3 · CREDENTIALS — #1 U18, #1 U20, then both with the site's label. */
export const Credentials = () => {
  const { copy } = usePromo();
  const r = useResponsive();
  const at = r({ x: '30%', y: '50%' }, { x: '50%', y: '29%' });
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={C.badgeB - C.badgeA} layout="none">
        <Solo photo="photos/cred-dig.jpg" division={copy.credentials.a} duration={C.badgeB} badgeAt={at} objectPosition={r('50% 40%', '62% 50%')} />
      </Sequence>
      <Sequence from={C.badgeB} durationInFrames={C.together - C.badgeB} layout="none">
        <Solo photo={r('photos/cred-set.jpg', 'photos/cred-focus.jpg')} division={copy.credentials.b} duration={C.together - C.badgeB} badgeAt={r({ x: '68%', y: '50%' }, { x: '50%', y: '63%' })} objectPosition={r('50% 30%', '50% 40%')} />
      </Sequence>
      <Sequence from={C.together} layout="none">
        <Together />
      </Sequence>
    </AbsoluteFill>
  );
};
