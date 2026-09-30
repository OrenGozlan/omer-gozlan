import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KenBurns } from '../components/KenBurns';
import { LightLeak } from '../components/Light';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, springAt, tween } from '../lib/motion';

const C = CUES.testimonial;
const D = SCENES.testimonial.duration;
/** words from the quote picked out in amber */
const HIGHLIGHT = /^(two|European|medals\.|exceptional|talent)$/;

/** 7 · TESTIMONIAL — the Wingate director's quote, lit word by word. */
export const Testimonial = () => {
  const frame = useCurrentFrame();
  const { copy, format } = usePromo();
  const r = useResponsive();
  const words = copy.testimonial.quote.split(' ');
  const mark = springAt(frame, C.quoteMark, SPRINGS.slam);
  const author = springAt(frame, C.author, SPRINGS.snappy);
  const panel = tween(frame, [0, 16], [0, 1], EASE.out);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep, overflow: 'hidden' }}>
      {/* photo panel: right column (wide) / top band (tall), wipes open */}
      <div
        style={{
          position: 'absolute',
          ...(format.vertical ? { left: 0, right: 0, top: 0, height: 900 } : { top: 0, bottom: 0, right: 0, width: 760 }),
          clipPath: format.vertical ? `inset(0 0 ${(1 - panel) * 100}% 0)` : `inset(0 0 0 ${(1 - panel) * 100}%)`,
        }}
      >
        <KenBurns src="photos/quote-block.jpg" duration={D} scale={[1.14, 1.04]} drift={[r(-20, 0), r(0, 20)]} objectPosition={r('50% 30%', '50% 20%')} imgStyle={{ filter: 'brightness(0.8) saturate(1.05)' }} />
        <AbsoluteFill
          style={{
            background: format.vertical
              ? 'linear-gradient(0deg, rgba(6,11,23,1) 0%, rgba(6,11,23,0) 45%)'
              : 'linear-gradient(90deg, rgba(6,11,23,1) 0%, rgba(6,11,23,0) 40%)',
          }}
        />
      </div>
      <LightLeak seed="quote" duration={D} intensity={0.35} />

      <div
        style={{
          position: 'absolute',
          left: format.safe.left,
          right: r(760 + 60, format.safe.right),
          top: r(0, 700),
          bottom: r(0, format.safe.bottom),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontWeight: 900,
            fontSize: r(260, 220),
            lineHeight: 0.6,
            height: r(120, 100),
            color: COLORS.amber,
            transform: `scale(${lerp(0.4, 1, mark)}) rotate(${(1 - mark) * -20}deg)`,
            transformOrigin: '0% 50%',
            opacity: Math.min(1, mark * 2),
          }}
        >
          “
        </div>
        <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: r(50, 44), lineHeight: 1.28, color: COLORS.white }}>
          {words.map((w, i) => {
            const t = tween(frame, [C.words + i * C.wordStagger, C.words + i * C.wordStagger + 8], [0, 1], EASE.out);
            return (
              <span key={i} style={{ opacity: lerp(0.14, 1, t), color: HIGHLIGHT.test(w) ? COLORS.amber : undefined, display: 'inline-block', transform: `translateY(${(1 - t) * 10}px)` }}>
                {w}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </div>
        <div style={{ marginTop: r(44, 36), display: 'flex', alignItems: 'center', gap: 22, transform: `translateX(${(1 - author) * -40}px)`, opacity: author }}>
          <div style={{ width: 70, height: 4, background: COLORS.amber, borderRadius: 4 }} />
          <div>
            <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: r(46, 44), color: COLORS.white, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{copy.testimonial.author}</div>
            <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: r(26, 26), color: COLORS.amberPale }}>{copy.testimonial.role}</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
