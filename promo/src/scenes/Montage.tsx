import { AbsoluteFill, Img, Sequence, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticText } from '../components/KineticText';
import { LightLeak, SunFlare } from '../components/Light';
import { gradientText } from '../components/Lockup';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, springAt, tween } from '../lib/motion';

const C = CUES.montage;
const photo = (slot: string) => staticFile(`photos/${slot}.jpg`);

const displayType = {
  fontFamily: FONTS.display,
  fontWeight: 900,
  textTransform: 'uppercase' as const,
  lineHeight: 0.86,
  color: COLORS.white,
  textShadow: '0 6px 40px rgba(0,0,0,0.5)',
};

/** A · photo assembles from staggered strips, then the camera punches through it. */
const Slices = ({ slot, word, duration }: { slot: string; word: string; duration: number }) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const { format } = usePromo();
  const r = useResponsive();
  const n = r(6, 4);
  const stripW = width / n;
  const kb = tween(frame, [0, duration], [1.08, 1.18], EASE.inOut);
  const punch = tween(frame, [duration - 10, duration], [0, 1], EASE.in);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${1 + punch * 1.6})`, filter: `blur(${punch * 18}px)`, opacity: 1 - punch * 0.4 }}>
        {Array.from({ length: n }, (_, i) => {
          const s = springAt(frame, i * 3, SPRINGS.snappy);
          const dir = i % 2 === 0 ? -1 : 1;
          const edge = 1 - tween(frame, [i * 3 + 6, i * 3 + 20], [0, 1]);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i * stripW,
                top: 0,
                width: stripW + 1,
                height: '100%',
                overflow: 'hidden',
                transform: `translateY(${dir * (1 - s) * 110}%)`,
                boxShadow: `inset -3px 0 0 rgba(245,158,11,${0.9 * edge})`,
              }}
            >
              <Img
                src={photo(slot)}
                style={{
                  position: 'absolute',
                  left: -i * stripW,
                  top: 0,
                  width,
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: '50% 40%',
                  transform: `scale(${kb})`,
                  filter: 'brightness(0.8) contrast(1.08) saturate(1.1)',
                }}
              />
            </div>
          );
        })}
        <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(6,11,23,0.8) 0%, rgba(6,11,23,0) 50%)' }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: format.safe.left, right: format.safe.right, bottom: format.safe.bottom + r(0, 40), display: 'flex', justifyContent: r('flex-start', 'center') }}>
        <KineticText text={word.toUpperCase()} start={12} stagger={2} style={{ ...displayType, fontSize: r(300, 230) }} />
      </div>
    </AbsoluteFill>
  );
};

/** B · arrive through a zoom-blur, word slams with a star flare. */
const ZoomThrough = ({ slot, word, duration }: { slot: string; word: string; duration: number }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const r = useResponsive();
  const arrive = tween(frame, [0, 18], [0, 1], EASE.out);
  const scale = lerp(1.6, 1.06, arrive) + tween(frame, [18, duration], [0, 0.06], EASE.inOut);
  const blur = lerp(18, 0, arrive);
  const ghosts = 1 - tween(frame, [0, 12], [0, 1]);
  const slam = springAt(frame, 8, SPRINGS.slam);
  const flash = tween(frame, [0, 6], [0.8, 0], EASE.out);
  const flare = springAt(frame, 10, SPRINGS.soft) * (1 - tween(frame, [30, duration], [0, 0.5], EASE.inOut));
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep, overflow: 'hidden' }}>
      {[1.14, 1.07, 1].map((g, i) => (
        <AbsoluteFill key={i} style={{ opacity: i === 2 ? 1 : 0.35 * ghosts, transform: `scale(${scale * g})`, filter: `blur(${blur + (2 - i) * 4}px)` }}>
          <Img src={photo(slot)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: r('50% 30%', '50% 25%'), filter: 'brightness(0.62) saturate(1.15)' }} />
        </AbsoluteFill>
      ))}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(6,11,23,0.15) 0%, rgba(6,11,23,0.7) 100%)' }} />
      <SunFlare x={width * 0.5 + r(200, 110)} y={height * r(0.36, 0.4)} amount={flare * 0.55} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...displayType, fontSize: r(400, 300), transform: `scale(${lerp(2.2, 1, slam)})`, opacity: Math.min(1, slam * 3), letterSpacing: '0.02em', ...gradientText }}>
          {word.toUpperCase()}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: COLORS.cream, opacity: flash, mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

/** C · the word is a window onto the photo, then an iris opens to full frame. */
const TextMask = ({ slot, lead, word, duration }: { slot: string; lead: string; word: string; duration: number }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const r = useResponsive();
  const fontSize = r(420, 250);
  const textIn = springAt(frame, 0, SPRINGS.snappy);
  const iris = tween(frame, [30, 50], [0, Math.hypot(width, height) / 2], EASE.inOut);
  const kb = tween(frame, [0, duration], [1.2, 1.05], EASE.inOut);
  const leadIn = springAt(frame, 4, SPRINGS.snappy);
  const leadOut = tween(frame, [28, 36], [1, 0]);
  const textY = height / 2 + fontSize * 0.33;
  const textTransform = `translate(${width / 2} ${height / 2}) scale(${lerp(0.85, 1, textIn)}) translate(${-width / 2} ${-height / 2})`;
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      {/* faint full photo behind so the frame never feels empty */}
      <Img src={photo(slot)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, filter: 'blur(8px) grayscale(0.6)', transform: `scale(${kb})` }} />
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="montage-text" clipPathUnits="userSpaceOnUse">
            <text x={width / 2} y={textY} textAnchor="middle" fontFamily={FONTS.display} fontWeight={900} fontSize={fontSize} letterSpacing="4" transform={textTransform}>
              {word.toUpperCase()}
            </text>
            <circle cx={width / 2} cy={height / 2} r={iris} />
          </clipPath>
        </defs>
      </svg>
      <AbsoluteFill style={{ clipPath: 'url(#montage-text)' }}>
        <Img src={photo(slot)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 35%', transform: `scale(${kb})`, filter: 'saturate(1.1) contrast(1.05)' }} />
      </AbsoluteFill>
      {/* outline keeps the letterforms crisp while the window is small */}
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        <text
          x={width / 2}
          y={textY}
          textAnchor="middle"
          fontFamily={FONTS.display}
          fontWeight={900}
          fontSize={fontSize}
          letterSpacing="4"
          fill="none"
          stroke={COLORS.amber}
          strokeWidth={3}
          opacity={textIn * (1 - tween(frame, [30, 42], [0, 1]))}
          transform={textTransform}
        >
          {word.toUpperCase()}
        </text>
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            ...displayType,
            fontSize: r(110, 90),
            color: COLORS.amberPale,
            transform: `translateY(${-fontSize * 0.62 - (1 - leadIn) * 40}px)`,
            opacity: leadIn * leadOut,
            letterSpacing: '0.2em',
          }}
        >
          {lead.toUpperCase()}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(6,11,23,0.55) 0%, rgba(6,11,23,0) 40%)', opacity: tween(frame, [40, 55], [0, 1]) }} />
      <LightLeak seed="mask" duration={duration} intensity={0.35} />
    </AbsoluteFill>
  );
};

type Rect = { x: number; y: number; w: number; h: number };

/** D · 3×3 mosaic flips in, the centre tile takes over the frame. */
const Mosaic = ({ tiles, center, words, expandAt, duration }: { tiles: string[]; center: string; words: string; expandAt: number; duration: number }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { format } = usePromo();
  const r = useResponsive();
  const gap = 12;
  const cw = (width - gap * 4) / 3;
  const ch = (height - gap * 4) / 3;
  const cell = (i: number): Rect => ({ x: gap + (i % 3) * (cw + gap), y: gap + Math.floor(i / 3) * (ch + gap), w: cw, h: ch });
  const order = [3, 0, 6, 1, 4, 7, 2, 5, 8]; // flip-in order
  const expand = tween(frame, [expandAt, expandAt + 16], [0, 1], EASE.inOut);
  const full: Rect = { x: 0, y: 0, w: width, h: height };
  const kb = tween(frame, [expandAt, duration], [1.12, 1.02], EASE.out);

  const slotFor = (i: number) => (i === 4 ? center : tiles[i < 4 ? i : i - 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep, perspective: 1800 }}>
      {Array.from({ length: 9 }, (_, i) => {
        const start = order.indexOf(i) * 3;
        const s = springAt(frame, start, SPRINGS.snappy);
        const c = cell(i);
        const isCenter = i === 4;
        const rect = isCenter ? { x: lerp(c.x, full.x, expand), y: lerp(c.y, full.y, expand), w: lerp(c.w, full.w, expand), h: lerp(c.h, full.h, expand) } : c;
        const push = isCenter ? 0 : expand;
        const dx = (c.x + c.w / 2 - width / 2) * push * 0.25;
        const dy = (c.y + c.h / 2 - height / 2) * push * 0.25;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: rect.x,
              top: rect.y,
              width: rect.w,
              height: rect.h,
              overflow: 'hidden',
              borderRadius: lerp(10, 0, isCenter ? expand : 0),
              transform: `translate(${dx}px, ${dy}px) rotateY(${(1 - s) * (random(`flip${i}`) > 0.5 ? 90 : -90)}deg) scale(${1 - push * 0.08})`,
              opacity: Math.min(1, s * 2) * (isCenter ? 1 : 1 - push * 0.7),
              zIndex: isCenter ? 2 : 1,
              boxShadow: isCenter ? `0 30px 80px rgba(0,0,0,${0.5 * expand})` : undefined,
            }}
          >
            <Img
              src={photo(slotFor(i))}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '50% 35%',
                transform: `scale(${isCenter ? kb : 1.05})`,
                filter: isCenter ? `brightness(${lerp(0.9, 0.7, expand)})` : 'brightness(0.78) saturate(1.05)',
              }}
            />
          </div>
        );
      })}
      <AbsoluteFill style={{ zIndex: 3, background: 'linear-gradient(0deg, rgba(6,11,23,0.85) 0%, rgba(6,11,23,0) 45%)', opacity: expand }} />
      <div style={{ position: 'absolute', zIndex: 4, left: format.safe.left, right: format.safe.right, bottom: format.safe.bottom + r(0, 30), display: 'flex', justifyContent: r('flex-start', 'center') }}>
        <KineticText
          text={words.toUpperCase()}
          unit="word"
          start={expandAt + 12}
          stagger={4}
          style={{ ...displayType, fontSize: r(210, 170), justifyContent: r('flex-start', 'center'), textAlign: r('left', 'center') }}
          unitStyle={{}}
        />
      </div>
      <div style={{ position: 'absolute', zIndex: 3, inset: 0 }}>
        <LightLeak seed="grid" duration={duration} intensity={0.3} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * 3 · MONTAGE — "Rising Star of Israeli Beach Volleyball" (site hero subline),
 * one chunk per photo effect: strips → zoom-through → text mask → mosaic.
 */
export const Montage = () => {
  const { copy } = usePromo();
  const r = useResponsive();
  const [w1, w2, w3, w4] = copy.montage.lines;
  const [lead, word] = w3.split(' ');
  const D = SCENES.montage.duration;
  const segs = [C.slices, C.zoom, C.mask, C.grid, D];
  const len = (i: number) => segs[i + 1] - segs[i];
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={len(0)} layout="none">
        <Slices slot={r('m-zoom', 'm-slices')} word={w1} duration={len(0)} />
      </Sequence>
      <Sequence from={segs[1]} durationInFrames={len(1)} layout="none">
        <ZoomThrough slot={r('m-grid-5', 'm-grid-1')} word={w2} duration={len(1)} />
      </Sequence>
      <Sequence from={segs[2]} durationInFrames={len(2)} layout="none">
        <TextMask slot={r('m-grid-4', 'm-mask')} lead={lead} word={word} duration={len(2)} />
      </Sequence>
      <Sequence from={segs[3]} durationInFrames={len(3)} layout="none">
        <Mosaic
          tiles={['m-grid-1', 'm-grid-2', 'm-grid-3', 'm-grid-4', 'm-grid-5', 'm-grid-6', 'm-grid-7', 'm-grid-8']}
          center="m-grid-center"
          words={w4}
          expandAt={C.gridExpand - C.grid}
          duration={len(3)}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
