import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KenBurns } from '../components/KenBurns';
import { LightLeak } from '../components/Light';
import { gradientText } from '../components/Lockup';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, springAt, tween } from '../lib/motion';

const C = CUES.stats;
const D = SCENES.stats.duration;

const Counter = ({ n, suffix, label, start }: { n: number; suffix?: string; label: string; start: number }) => {
  const frame = useCurrentFrame();
  const r = useResponsive();
  const rise = springAt(frame, start, SPRINGS.snappy);
  const p = tween(frame, [start, start + C.countFrames], [0, 1], EASE.out);
  const done = start + C.countFrames;
  const punch = frame >= done ? lerp(1.12, 1, springAt(frame, done, SPRINGS.slam)) : 1;
  const rule = tween(frame, [start + 6, start + 22], [0, 1], EASE.out);
  const suffixIn = springAt(frame, done - 4, SPRINGS.snappy);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: r(460, 800), transform: `translateY(${(1 - rise) * 80}px)`, opacity: Math.min(1, rise * 2) }}>
      <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: FONTS.display, fontWeight: 900, fontSize: r(260, 230), lineHeight: 0.9, transform: `scale(${punch})`, fontVariantNumeric: 'tabular-nums' }}>
        <span style={gradientText}>{Math.round(lerp(0, n, p))}</span>
        {suffix && <span style={{ ...gradientText, fontSize: '0.55em', marginLeft: '0.04em', opacity: suffixIn, transform: `scale(${suffixIn})`, display: 'inline-block' }}>{suffix}</span>}
      </div>
      <div style={{ width: 220 * rule, height: 4, background: COLORS.amber, borderRadius: 4, margin: '18px 0 20px' }} />
      <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: r(52, 56), textTransform: 'uppercase', color: COLORS.white, letterSpacing: '0.03em', textAlign: 'center', lineHeight: 1 }}>{label}</div>
    </div>
  );
};

/** 5 · STATS — the site's headline numbers, counted up one beat apart. */
export const Stats = () => {
  const { copy } = usePromo();
  const r = useResponsive();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <KenBurns src="photos/stats-ceremony.jpg" duration={D} scale={[1.2, 1.08]} objectPosition="50% 30%" imgStyle={{ filter: 'blur(6px) brightness(0.35) saturate(0.9)' }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(6,11,23,0.6), rgba(6,11,23,0.85))` }} />
      <LightLeak seed="stats" duration={D} intensity={0.4} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: r('row', 'column'), alignItems: 'center', justifyContent: 'center', gap: r(40, 90) }}>
        {copy.stats.map((s, i) => (
          <Counter key={s.label} n={s.n} suffix={s.suffix} label={s.label} start={C.first + i * C.stagger} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
