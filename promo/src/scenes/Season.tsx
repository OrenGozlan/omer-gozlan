import { geoMercator } from 'd3-geo';
import type { CSSProperties } from 'react';
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from 'remotion';
import { KineticText } from '../components/KineticText';
import { LightLeak } from '../components/Light';
import { gradientText } from '../components/Lockup';
import { MEDAL_COLORS, Medal } from '../components/Medal';
import { Volleyball } from '../components/Volleyball';
import { HOME, type Medal as MedalKind, type Stop } from '../config/copy';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES, SEASON_TIMELINE } from '../config/timing';
import worldDots from '../data/world-dots.json';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, springAt, tween } from '../lib/motion';

const C = CUES.season;
const D = SCENES.season.duration;

// ── timeline (scene-local frames) — shared with scripts/make-music.ts
const { intlStops: N_INTL, homeHit: HOME_HIT, outro: OUTRO } = SEASON_TIMELINE;
const hitAt = (i: number) => C.firstHit + i * C.hitEvery; // i = N_INTL → home
const legStart = (i: number) => hitAt(i) - C.hitEvery;
const homeDrop = (k: number) => SEASON_TIMELINE.homeDrops[k];

// ── static map geometry (module scope: computed once per render tab)
type Pt = { x: number; y: number };
const projection = geoMercator().scale(1000).translate([0, 0]);
const project = (lon: number, lat: number): Pt => {
  const p = projection([lon, lat]) ?? [0, 0];
  return { x: p[0], y: p[1] };
};
const DOT_PATH = (worldDots.dots as [number, number][])
  .map(([lon, lat]) => {
    const p = project(lon, lat);
    return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}h0`;
  })
  .join('');
const DOT_SIZE = 6.4;

type Cam = { x: number; y: number; z: number };
type Viewport = { cx: number; cy: number; w: number; h: number };

const fit = (pts: Pt[], vp: Viewport, minSpan = 640): Cam => {
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const w = Math.max(minSpan, (x1 - x0) * 1.35);
  const h = Math.max(minSpan * (vp.h / vp.w), (y1 - y0) * 1.6);
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, z: Math.min(vp.w / w, vp.h / h) };
};

const blendCam = (a: Cam, b: Cam, t: number): Cam => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: Math.exp(lerp(Math.log(a.z), Math.log(b.z), t)),
});

/** quadratic arc between two points, bulging "up" */
const arc = (a: Pt, b: Pt) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len;
  let ny = dx / len;
  if (ny > 0) [nx, ny] = [-nx, -ny];
  const k = Math.min(len * 0.3, 260);
  const c = { x: (a.x + b.x) / 2 + nx * k, y: (a.y + b.y) / 2 + ny * k };
  return (t: number): Pt => ({
    x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t ** 2 * b.x,
    y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t ** 2 * b.y,
  });
};

const polyline = (f: (t: number) => Pt, from: number, to: number, toScreen: (p: Pt) => Pt, n = 40) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const s = toScreen(f(from + ((to - from) * i) / n));
    pts.push(`${i === 0 ? 'M' : 'L'}${s.x.toFixed(1)} ${s.y.toFixed(1)}`);
  }
  return pts.join(' ');
};

/** medal coin that drops onto a pin, flips, lands with a sparkle burst, then settles small */
const PinMedal = ({ kind, label, at, x, y, settle, size }: { kind: MedalKind; label: string; at: number; x: number; y: number; settle: number; size: number }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const drop = springAt(frame, at, SPRINGS.slam);
  const t = frame - at;
  const spin = Math.cos(tween(t, [0, 16], [0, Math.PI * 4], EASE.out));
  const shine = tween(t, [14, 30], [0, 1], EASE.inOut);
  const small = tween(frame, [settle, settle + 12], [1, 0.52], EASE.inOut);
  const s = size * small;
  const burst = tween(t, [8, 30], [0, 1], EASE.out);
  return (
    <>
      {t >= 8 &&
        t < 32 &&
        Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2 + random(`sp${at}${i}`) * 0.4;
          const d = burst * size * (0.9 + random(`sd${at}${i}`) * 0.6);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x + Math.cos(a) * d - 4,
                top: y - size * 0.55 + Math.sin(a) * d - 4,
                width: 8,
                height: 8,
                borderRadius: 2,
                transform: 'rotate(45deg)',
                background: MEDAL_COLORS[kind].hi,
                opacity: 1 - burst,
                boxShadow: `0 0 10px ${MEDAL_COLORS[kind].mid}`,
              }}
            />
          );
        })}
      <Medal
        kind={kind}
        size={s}
        spin={spin}
        shine={shine > 0 && shine < 1 ? shine : -1}
        label={label}
        style={{
          position: 'absolute',
          left: x - s / 2,
          top: y - s * 1.45 - 6 + (1 - drop) * -220,
          opacity: Math.min(1, drop * 2),
          filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.5))',
        }}
      />
    </>
  );
};

const cardShell: CSSProperties = {
  background: 'rgba(11,20,38,0.88)',
  border: '1.5px solid rgba(253,230,138,0.25)',
  borderRadius: 20,
  overflow: 'hidden',
  boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
};

/** per-stop card: flips in on the hit, flips out just before the next one */
const StopCard = ({ stop, from, to, width }: { stop: Stop; from: number; to: number; width: number }) => {
  const frame = useCurrentFrame();
  const r = useResponsive();
  if (frame < from || frame >= to) return null;
  const flipIn = springAt(frame, from, SPRINGS.snappy);
  const flipOut = tween(frame, [to - 7, to], [0, 1], EASE.in);
  const rot = (1 - flipIn) * -80 + flipOut * 80;
  const kb = lerp(1.18, 1.04, tween(frame, [from, to], [0, 1], EASE.out));
  const photoH = r(400, 300);
  return (
    <div style={{ ...cardShell, width, transform: `perspective(1400px) rotateY(${rot}deg)`, transformOrigin: '0% 50%', opacity: 1 - flipOut * 0.6 }}>
      <div style={{ position: 'relative', height: photoH, overflow: 'hidden', background: COLORS.navy }}>
        {stop.photo ? (
          <Img
            src={staticFile(`photos/${stop.photo}.jpg`)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: stop.photoPosition ?? '50% 40%', transform: `scale(${kb})`, filter: 'saturate(1.08)' }}
          />
        ) : (
          // no photo on the site for this stop → typographic plate
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(circle at 30% 30%, ${COLORS.navy} 0%, ${COLORS.navyDeep} 80%)` }}>
            <div style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: photoH * 0.62, lineHeight: 1, transform: `scale(${kb})`, ...gradientText }}>{stop.rank}</div>
            <div style={{ position: 'absolute', left: 24, top: 18, fontFamily: FONTS.display, fontWeight: 800, fontSize: 30, letterSpacing: '0.14em', textTransform: 'uppercase', color: COLORS.amberPale }}>{stop.pin}</div>
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11,20,38,0.9) 0%, rgba(11,20,38,0) 40%)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: r('18px 24px 22px', '16px 24px 20px'), marginTop: -46, position: 'relative' }}>
        {stop.medal ? (
          <Medal kind={stop.medal} size={r(84, 80)} label={stop.rank.replace('#', '')} ribbon={false} shine={tween(frame, [from + 8, from + 26], [0, 1], EASE.inOut)} />
        ) : (
          <div
            style={{
              minWidth: r(84, 80),
              height: r(84, 80),
              borderRadius: '50%',
              border: `3px solid ${COLORS.amber}`,
              background: COLORS.navyDeep,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTS.display,
              fontWeight: 900,
              fontSize: stop.rank.length > 2 ? 30 : 38,
              color: COLORS.amber,
            }}
          >
            {stop.rank}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: r(38, 38), lineHeight: 1, color: COLORS.white, textTransform: 'uppercase' }}>{stop.event}</div>
          <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: r(24, 25), color: COLORS.amberPale }}>{stop.detail}</div>
        </div>
      </div>
    </div>
  );
};

const HomeCard = ({ width }: { width: number }) => {
  const frame = useCurrentFrame();
  const { copy } = usePromo();
  const r = useResponsive();
  if (frame < HOME_HIT || frame >= OUTRO) return null;
  const flipIn = springAt(frame, HOME_HIT, SPRINGS.snappy);
  const flipOut = tween(frame, [OUTRO - 7, OUTRO], [0, 1], EASE.in);
  const kb = lerp(1.16, 1.04, tween(frame, [HOME_HIT, OUTRO], [0, 1], EASE.out));
  return (
    <div style={{ ...cardShell, width, transform: `perspective(1400px) rotateY(${(1 - flipIn) * -80 + flipOut * 80}deg)`, transformOrigin: '0% 50%', opacity: 1 - flipOut * 0.6 }}>
      <div style={{ position: 'relative', height: r(250, 170), overflow: 'hidden' }}>
        <Img src={staticFile(`photos/${copy.season.homePhoto}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 32%', transform: `scale(${kb})` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11,20,38,0.95) 0%, rgba(11,20,38,0) 60%)' }} />
        <div style={{ position: 'absolute', left: 24, bottom: 12, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 40, height: 26, display: 'flex', flexDirection: 'column', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ flex: 1, background: COLORS.israelBlue }} />
            <div style={{ flex: 1.4, background: COLORS.white }} />
            <div style={{ flex: 1, background: COLORS.israelBlue }} />
          </div>
          <div style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: 44, color: COLORS.white, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{copy.season.homeTitle}</div>
        </div>
      </div>
      <div style={{ padding: '10px 22px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {copy.season.homeResults.map((h, k) => {
          const s = springAt(frame, homeDrop(k), SPRINGS.snappy);
          return (
            <div key={h.event} style={{ display: 'flex', alignItems: 'center', gap: 16, transform: `translateX(${(1 - s) * -40}px)`, opacity: s }}>
              <Medal kind={h.medal} size={52} label={h.rank.replace('#', '')} ribbon={false} />
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: 28, lineHeight: 1.05, color: COLORS.white, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h.event}</div>
                <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 19, color: COLORS.amberPale, whiteSpace: 'nowrap' }}>{h.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** running podium count — coin + number per colour */
const Tally = ({ counts, size, big }: { counts: Record<MedalKind, number>; size: number; big: number }) => {
  const r = useResponsive();
  const { copy } = usePromo();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 * big, alignItems: r('flex-start', 'center') }}>
      <div style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 22 * big, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.amberPale }}>{copy.season.tallyLabel}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 34 * big }}>
        {(['gold', 'silver', 'bronze'] as MedalKind[]).map((k) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 * big, opacity: counts[k] > 0 ? 1 : 0.3 }}>
            <Medal kind={k} size={size} ribbon={false} />
            <span style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: size * 0.95, color: COLORS.white, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{counts[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 6 · 2026 MEDALS ROUTE — tilted dot-matrix map; flight from Israel through
 * every international stop in date order, a card per stop with the event
 * photo, medal coins dropping onto podium stops, a live podium tally, then
 * home to Israel for the domestic medals and a pull-back over the whole route.
 */
export const Season = () => {
  const frame = useCurrentFrame();
  const { copy, format } = usePromo();
  const r = useResponsive();
  const { width, height, safe } = format;
  const stops = copy.season.stops;

  const vp: Viewport = r({ cx: 1310, cy: 540, w: 1000, h: 680 }, { cx: width / 2, cy: 640, w: 900, h: 560 });

  const home = project(HOME.lon, HOME.lat);
  const pts = stops.map((s) => project(s.lon, s.lat));
  const legPts = [...pts, home]; // leg i ends at legPts[i]
  const legFrom = (i: number) => (i === 0 ? home : legPts[i - 1]);

  // camera: re-frame each leg, then pull back over the whole route
  let cam = fit([home, pts[0]], vp);
  legPts.forEach((p, i) => {
    cam = blendCam(cam, fit([legFrom(i), p], vp), springAt(frame, legStart(i) - 2, SPRINGS.camera));
  });
  cam = blendCam(cam, fit([home, ...pts], vp, 900), springAt(frame, OUTRO - 4, SPRINGS.camera));
  const toScreen = (p: Pt): Pt => ({ x: vp.cx + (p.x - cam.x) * cam.z, y: vp.cy + (p.y - cam.y) * cam.z });

  const mapIn = tween(frame, [0, 14], [0, 1], EASE.out);
  const tilt = lerp(26, 14, tween(frame, [0, D], [0, 1], EASE.inOut));
  const current = legPts.reduce((acc, _, i) => (frame >= hitAt(i) ? i : acc), -1);
  const activeLeg = legPts.findIndex((_, i) => frame >= legStart(i) && frame < hitAt(i));
  const outro = springAt(frame, OUTRO, SPRINGS.snappy);

  const counts: Record<MedalKind, number> = { gold: 0, silver: 0, bronze: 0 };
  stops.forEach((s, i) => {
    if (s.medal && frame >= hitAt(i) + 6) counts[s.medal]++;
  });
  copy.season.homeResults.forEach((h, k) => {
    if (frame >= homeDrop(k) + 6) counts[h.medal]++;
  });

  const homeS = toScreen(home);
  const cardW = r(660, width - safe.left - safe.right);
  const origin = `${(vp.cx / width) * 100}% ${(vp.cy / height) * 100}%`;

  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at ${origin}, ${COLORS.navy} 0%, ${COLORS.navyDeep} 75%)`, overflow: 'hidden' }}>
      {/* ── tilted map plane: dots, routes, pins, medals, labels, ball */}
      <AbsoluteFill style={{ transform: `perspective(2200px) rotateX(${tilt}deg)`, transformOrigin: origin }}>
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0, opacity: mapIn, overflow: 'visible' }}>
          <g transform={`translate(${vp.cx} ${vp.cy}) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>
            <path d={DOT_PATH} stroke="#3a5080" strokeWidth={DOT_SIZE} strokeLinecap="round" fill="none" />
          </g>
        </svg>

        <svg width={width} height={height} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          <defs>
            <filter id="route-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {legPts.map((p, i) => {
            const prog = tween(frame, [legStart(i), hitAt(i)], [0, 1], EASE.inOut);
            if (prog <= 0) return null;
            const f = arc(legFrom(i), p);
            const done = prog >= 1;
            return (
              <g key={i}>
                <path d={polyline(f, 0, prog, toScreen)} fill="none" stroke={COLORS.amber} strokeOpacity={done ? 0.55 : 0.35} strokeWidth={done ? 3 : 10} strokeLinecap="round" filter={done ? undefined : 'url(#route-glow)'} />
                {!done && <path d={polyline(f, Math.max(0, prog - 0.35), prog, toScreen)} fill="none" stroke={COLORS.amberPale} strokeWidth={5} strokeLinecap="round" />}
              </g>
            );
          })}
          {/* comet dust behind the ball */}
          {activeLeg >= 0 &&
            Array.from({ length: 14 }, (_, k) => {
              const prog = tween(frame, [legStart(activeLeg), hitAt(activeLeg)], [0, 1], EASE.inOut);
              const t = prog - k * 0.018;
              if (t <= 0) return null;
              const q = toScreen(arc(legFrom(activeLeg), legPts[activeLeg])(t));
              const jitter = (random(`cj${activeLeg}${k}`) - 0.5) * 10;
              return <circle key={k} cx={q.x + jitter} cy={q.y - jitter} r={lerp(5, 1, k / 14)} fill={COLORS.amberPale} opacity={lerp(0.8, 0, k / 14)} />;
            })}
          {/* home */}
          <circle cx={homeS.x} cy={homeS.y} r={lerp(12, 16, tween(frame, [HOME_HIT, HOME_HIT + 10], [0, 1]))} fill={COLORS.israelBlue} stroke={COLORS.white} strokeWidth={4} />
          {frame >= HOME_HIT && (
            <circle
              cx={homeS.x}
              cy={homeS.y}
              r={lerp(14, 110, tween(frame, [HOME_HIT, HOME_HIT + 24], [0, 1], EASE.out))}
              fill="none"
              stroke={COLORS.white}
              strokeWidth={3}
              opacity={1 - tween(frame, [HOME_HIT, HOME_HIT + 24], [0, 1])}
            />
          )}
          {/* stop pins */}
          {pts.map((p, i) => {
            if (frame < hitAt(i)) return null;
            const s = toScreen(p);
            const ripple = tween(frame, [hitAt(i), hitAt(i) + 18], [0, 1], EASE.out);
            const pop = springAt(frame, hitAt(i), SPRINGS.slam);
            const medal = stops[i].medal;
            return (
              <g key={i}>
                <circle cx={s.x} cy={s.y} r={lerp(8, 80, ripple)} fill="none" stroke={COLORS.amberPale} strokeWidth={lerp(4, 0.5, ripple)} opacity={1 - ripple} />
                <circle cx={s.x} cy={s.y} r={10 * pop} fill={medal ? MEDAL_COLORS[medal].mid : COLORS.amber} stroke={COLORS.navyDeep} strokeWidth={3} />
              </g>
            );
          })}
        </svg>

        {/* medals on podium stops */}
        {stops.map((s, i) => {
          if (!s.medal) return null;
          const q = toScreen(pts[i]);
          return <PinMedal key={i} kind={s.medal} label={s.rank.replace('#', '')} at={hitAt(i)} x={q.x} y={q.y} settle={hitAt(i) + C.hitEvery - 4} size={r(86, 80)} />;
        })}
        {/* domestic medals fan out above home */}
        {copy.season.homeResults.map((h, k) => {
          const spacing = r(84, 78);
          return (
            <PinMedal
              key={h.event}
              kind={h.medal}
              label={h.rank.replace('#', '')}
              at={homeDrop(k)}
              x={homeS.x + (k - 1.5) * spacing}
              y={homeS.y + r(170, 160)}
              settle={OUTRO}
              size={r(76, 70)}
            />
          );
        })}

        {/* ball riding the active leg */}
        {activeLeg >= 0 &&
          (() => {
            const prog = tween(frame, [legStart(activeLeg), hitAt(activeLeg)], [0, 1], EASE.inOut);
            const q = toScreen(arc(legFrom(activeLeg), legPts[activeLeg])(prog));
            return <Volleyball size={50} rotation={frame * 24} style={{ position: 'absolute', left: q.x - 25, top: q.y - 25, filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.5))' }} />;
          })()}

        {/* pin label for the current stop */}
        {current >= 0 &&
          current < N_INTL &&
          (() => {
            const q = toScreen(pts[current]);
            const pop = springAt(frame, hitAt(current), SPRINGS.slam);
            const lift = stops[current].medal ? r(86, 80) * 1.45 + 20 : 30;
            return (
              <div
                style={{
                  position: 'absolute',
                  left: q.x,
                  top: q.y - lift,
                  transform: `translate(-50%, -100%) scale(${pop})`,
                  transformOrigin: '50% 100%',
                  opacity: 1 - tween(frame, [hitAt(current + 1) - 6, hitAt(current + 1)], [0, 1]),
                  padding: '8px 18px 6px',
                  borderRadius: 10,
                  background: COLORS.amber,
                  color: COLORS.navyDeep,
                  fontFamily: FONTS.display,
                  fontWeight: 900,
                  fontSize: 36,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                }}
              >
                {stops[current].pin}
              </div>
            );
          })()}
        <div
          style={{
            position: 'absolute',
            left: homeS.x + 22,
            top: homeS.y + 8,
            fontFamily: FONTS.display,
            fontWeight: 800,
            fontSize: frame >= HOME_HIT ? 34 : 26,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: COLORS.white,
            opacity: mapIn * (frame >= HOME_HIT ? 1 : 1 - tween(frame, [C.firstHit, C.firstHit + 8], [0, 0.5])),
          }}
        >
          {copy.season.home}
        </div>
      </AbsoluteFill>

      <LightLeak seed="season" duration={D} intensity={0.25} />

      {/* ── side panel backdrop */}
      <AbsoluteFill
        style={{
          background: r(
            'linear-gradient(90deg, rgba(6,11,23,0.96) 0%, rgba(6,11,23,0.85) 37%, rgba(6,11,23,0) 50%)',
            'linear-gradient(0deg, rgba(6,11,23,1) 0%, rgba(6,11,23,0.96) 42%, rgba(6,11,23,0) 54%), linear-gradient(180deg, rgba(6,11,23,0.9) 0%, rgba(6,11,23,0) 18%)',
          ),
        }}
      />

      {/* title */}
      <div style={{ position: 'absolute', left: safe.left, right: safe.right, top: safe.top - r(10, 20) }}>
        <KineticText text={copy.season.title.toUpperCase()} start={C.title} stagger={1} style={{ fontFamily: FONTS.display, fontWeight: 900, fontSize: r(112, 110), lineHeight: 0.9, color: COLORS.white, justifyContent: r('flex-start', 'center') }} />
      </div>

      {/* stop cards */}
      <div style={{ position: 'absolute', left: safe.left, top: r(236, 1000), opacity: 1 - outro }}>
        {stops.map((s, i) => (
          <StopCard key={i} stop={s} from={hitAt(i)} to={hitAt(i + 1)} width={cardW} />
        ))}
        <HomeCard width={cardW} />
      </div>

      {/* live tally (small) → big tally + summary on the outro */}
      <div style={{ position: 'absolute', left: safe.left, right: r(undefined, safe.right), bottom: safe.bottom - r(4, 10), opacity: tween(frame, [C.firstHit, C.firstHit + 10], [0, 1]) * (1 - outro) }}>
        <Tally counts={counts} size={46} big={1} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          right: r(width - 820, safe.right),
          top: r(0, 1010),
          bottom: r(0, safe.bottom),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: r('flex-start', 'center'),
          gap: 36,
          opacity: outro,
          transform: `translateY(${(1 - outro) * 50}px)`,
        }}
      >
        <Tally counts={counts} size={r(100, 96)} big={1.6} />
        <div style={{ fontFamily: FONTS.display, fontWeight: 800, fontSize: r(58, 60), lineHeight: 1.02, textTransform: 'uppercase', color: COLORS.white, textAlign: r('left', 'center') }}>{copy.season.summary}</div>
      </div>
    </AbsoluteFill>
  );
};
