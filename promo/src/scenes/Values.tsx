import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { LightLeak } from '../components/Light';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, springAt, tween } from '../lib/motion';

const C = CUES.values;
const D = SCENES.values.duration;

const Tile = ({ t, d, photo, start }: { t: string; d: string; photo: string; start: number }) => {
  const frame = useCurrentFrame();
  const r = useResponsive();
  const wipe = tween(frame, [start, start + 14], [0, 1], EASE.out);
  const text = springAt(frame, start + 6, SPRINGS.snappy);
  const kb = lerp(1.25, 1.05, tween(frame, [start, D], [0, 1], EASE.out));
  const glint = tween(frame, [start + 8, start + 26], [-0.4, 1.4], EASE.inOut);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, clipPath: `inset(${(1 - wipe) * 100}% 0 0 0 round 16px)`, background: COLORS.navy }}>
      <Img src={staticFile(`photos/${photo}.jpg`)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})`, filter: 'brightness(0.72) saturate(1.1)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(6,11,23,0.95) 0%, rgba(6,11,23,0.55) 45%, rgba(6,11,23,0.05) 100%)' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, width: '30%', left: `${glint * 100}%`, background: 'linear-gradient(100deg, transparent, rgba(253,230,138,0.22), transparent)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: r('26px 28px', '22px 22px'), transform: `translateY(${(1 - text) * 40}px)`, opacity: text }}>
        <div style={{ width: 48, height: 4, background: COLORS.amber, borderRadius: 4, marginBottom: 14 }} />
        <div style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: r(50, 44), lineHeight: 0.95, color: COLORS.white, textTransform: 'uppercase', marginBottom: 10 }}>{t}</div>
        <div style={{ fontFamily: FONTS.body, fontWeight: 500, fontSize: r(22, 22), lineHeight: 1.3, color: COLORS.amberPale }}>{d}</div>
      </div>
    </div>
  );
};

/** 9 · WHY PARTNER — the site's six sponsor value props as photo tiles. */
export const Values = () => {
  const { copy, format } = usePromo();
  const r = useResponsive();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <LightLeak seed="values" duration={D} intensity={0.3} />
      <div
        style={{
          position: 'absolute',
          left: format.safe.left,
          right: format.safe.right,
          top: format.safe.top,
          bottom: format.safe.bottom,
          display: 'grid',
          gridTemplateColumns: r('repeat(3, 1fr)', 'repeat(2, 1fr)'),
          gridTemplateRows: r('repeat(2, 1fr)', 'repeat(3, 1fr)'),
          gap: 24,
        }}
      >
        {copy.values.items.map((it, i) => (
          <Tile key={it.t} {...it} start={C.firstTile + i * C.tileEvery} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
