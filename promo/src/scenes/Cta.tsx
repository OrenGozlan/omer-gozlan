import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KenBurns } from '../components/KenBurns';
import { KineticText } from '../components/KineticText';
import { LightLeak } from '../components/Light';
import { FlagBar, Monogram, gradientText } from '../components/Lockup';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, springAt, tween } from '../lib/motion';

const C = CUES.cta;
/** everything settles before the final static hold */
const ACTIVE = SCENES.cta.duration - C.holdFrames;

/** 6 · CTA — "Partnership inquiries open", site URL + contact, logo lockup, hold. */
export const Cta = () => {
  const frame = useCurrentFrame();
  const { copy, format } = usePromo();
  const r = useResponsive();

  const contact = springAt(frame, C.contact, SPRINGS.snappy, ACTIVE - C.contact);
  const lockup = springAt(frame, C.lockup, SPRINGS.slam, ACTIVE - C.lockup);
  const lockWipe = tween(frame, [C.lockup + 2, C.lockup + 14], [0, 100], EASE.out);
  const rule = tween(frame, [C.contact, C.contact + 14], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep, overflow: 'hidden' }}>
      <KenBurns src="photos/cta-highfive.jpg" duration={ACTIVE} scale={[1.14, 1.06]} objectPosition={r('50% 35%', '55% 40%')} imgStyle={{ filter: 'grayscale(0.35) brightness(0.4) contrast(1.05)' }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(6,11,23,0.55) 0%, rgba(6,11,23,0.8) 55%, rgba(6,11,23,0.95) 100%)` }} />
      <LightLeak seed="cta" duration={ACTIVE} intensity={0.45} />

      <AbsoluteFill
        style={{
          paddingTop: format.safe.top,
          paddingBottom: format.safe.bottom,
          paddingLeft: format.safe.left,
          paddingRight: format.safe.right,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <KineticText
          text={copy.cta.headline.toUpperCase()}
          unit="word"
          start={C.headline}
          stagger={3}
          style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: r(112, 138),
            lineHeight: 0.9,
            color: COLORS.white,
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: r(1700, 760),
          }}
        />

        {/* lockup */}
        <div
          style={{
            display: 'flex',
            flexDirection: r('row', 'column'),
            alignItems: 'center',
            gap: r(44, 34),
            transform: `scale(${lerp(0.82, 1, lockup)})`,
            opacity: Math.min(1, lockup * 2),
          }}
        >
          <Monogram size={r(170, 190)} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: r('flex-start', 'center'), gap: 14, clipPath: `inset(-20% ${100 - lockWipe}% -20% 0)` }}>
            <div style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: r(128, 124), lineHeight: 0.9, letterSpacing: '-0.005em', ...gradientText }}>{copy.cta.wordmark}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <FlagBar width={46} height={28} />
              <div style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: r(30, 30), letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.amberPale }}>{copy.cta.tagline}</div>
            </div>
          </div>
        </div>

        {/* contact */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, transform: `translateY(${(1 - contact) * 60}px)`, opacity: contact }}>
          <div style={{ width: r(680, 600) * rule, height: 3, background: COLORS.amber, borderRadius: 3 }} />
          <div style={{ fontFamily: FONTS.body, fontWeight: 800, fontSize: r(50, 46), color: COLORS.amber, letterSpacing: '0.01em' }}>{copy.cta.url}</div>
          <div style={{ display: 'flex', flexDirection: r('row', 'column'), alignItems: 'center', gap: r(36, 10), fontFamily: FONTS.body, fontWeight: 600, fontSize: r(36, 38), color: COLORS.white }}>
            <span>{copy.cta.email}</span>
            {r(<span style={{ color: COLORS.amber }}>·</span>, null)}
            <span>{copy.cta.instagram}</span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
