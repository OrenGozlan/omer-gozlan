import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KenBurns } from '../components/KenBurns';
import { KineticText } from '../components/KineticText';
import { LightLeak } from '../components/Light';
import { gradientText } from '../components/Lockup';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, springAt, tween } from '../lib/motion';

const C = CUES.next;
const D = SCENES.next.duration;

const Card = ({ t, s, tag, start, lead }: { t: string; s: string; tag: string; start: number; lead: boolean }) => {
  const frame = useCurrentFrame();
  const r = useResponsive();
  const p = springAt(frame, start, SPRINGS.snappy);
  return (
    <div
      style={{
        transform: `translateZ(${(1 - p) * -700}px) rotateX(${(1 - p) * 35}deg) translateY(${(1 - p) * 40}px)`,
        opacity: Math.min(1, p * 1.6),
        background: lead ? 'rgba(245,158,11,0.14)' : 'rgba(11,20,38,0.78)',
        border: `2px solid ${lead ? COLORS.amber : 'rgba(253,230,138,0.22)'}`,
        borderRadius: 18,
        padding: r('20px 28px', '20px 26px'),
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        backdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            fontFamily: FONTS.body,
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: 999,
            background: lead ? COLORS.amber : 'rgba(253,230,138,0.12)',
            color: lead ? COLORS.navyDeep : COLORS.amberPale,
          }}
        >
          {tag}
        </span>
      </div>
      <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: r(40, 40), color: COLORS.white, textTransform: 'uppercase', lineHeight: 1 }}>{t}</div>
      <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: r(25, 26), color: COLORS.amberPale }}>{s}</div>
    </div>
  );
};

/** 8 · WHAT'S NEXT — 2027 targets from the site, flying in from depth. */
export const Next = () => {
  const frame = useCurrentFrame();
  const { copy, format } = usePromo();
  const r = useResponsive();
  const year = springAt(frame, 4, SPRINGS.soft);
  const yearDrift = tween(frame, [0, D], [0, -60], EASE.inOut);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep, overflow: 'hidden' }}>
      <KenBurns src="photos/next-night.jpg" duration={D} scale={[1.1, 1.2]} objectPosition="50% 30%" imgStyle={{ filter: 'blur(5px) brightness(0.38) saturate(0.9)' }} />
      <AbsoluteFill style={{ background: r('linear-gradient(90deg, rgba(6,11,23,0.9) 0%, rgba(6,11,23,0.4) 60%, rgba(6,11,23,0.7) 100%)', 'linear-gradient(180deg, rgba(6,11,23,0.8) 0%, rgba(6,11,23,0.5) 40%, rgba(6,11,23,0.9) 100%)') }} />
      <LightLeak seed="next" duration={D} intensity={0.35} />

      {/* heading block */}
      <div style={{ position: 'absolute', left: format.safe.left, right: r(1000, format.safe.right), top: r(0, format.safe.top), bottom: r(0, undefined), display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: r('flex-start', 'center') }}>
        <KineticText text={copy.next.heading.toUpperCase()} start={C.title} stagger={1} style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: r(110, 104), lineHeight: 0.9, color: COLORS.white }} />
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: r(330, 300),
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
            transform: `translateX(${yearDrift}px) scale(${lerp(0.8, 1, year)})`,
            transformOrigin: r('0% 50%', '50% 50%'),
            opacity: year,
            ...gradientText,
          }}
        >
          {copy.next.year}
        </div>
      </div>

      {/* targets */}
      <div
        style={{
          position: 'absolute',
          left: r(980, format.safe.left),
          right: format.safe.right,
          top: r(format.safe.top, 720),
          bottom: format.safe.bottom,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: r(16, 18),
          perspective: 1400,
        }}
      >
        {copy.next.items.map((it, i) => (
          <Card key={it.t} {...it} start={C.firstCard + i * C.cardEvery} lead={i === 0} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
