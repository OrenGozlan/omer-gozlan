import { AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { gradientText } from '../components/Lockup';
import { SunFlare } from '../components/Light';
import { Volleyball } from '../components/Volleyball';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, SPRINGS, lerp, shake, springAt, tween } from '../lib/motion';

const C = CUES.hook;
const PARTICLES = 48;

/** 1 · HOOK — black → sun flare → ball hits the sand → "ISRAEL'S #1" slams in. */
export const Hook = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { copy } = usePromo();
  const r = useResponsive();
  const minDim = Math.min(width, height);
  const maxDim = Math.max(width, height);

  const impact = { x: width * 0.5, y: height * r(0.6, 0.56) };
  const flarePos = { x: width * r(0.74, 0.72), y: height * r(0.18, 0.15) };

  // ── flare: blooms out of black, flashes again on impact
  const bloom = springAt(frame, C.flareIn, SPRINGS.soft);
  const impactFlash = tween(frame, [C.impact, C.impact + 10], [0.35, 0], EASE.out);
  const flareAmount = bloom * lerp(1, 0.65, tween(frame, [10, 30], [0, 1], EASE.inOut)) + impactFlash;

  // ── camera: slow push, impact shake, slam shake
  const s1 = shake(frame, C.impact, 22, 1);
  const s2 = shake(frame, C.slam, 12, 4);
  const camScale = tween(frame, [0, SCENES.hook.duration], [1.18, 1.04], EASE.inOut) + tween(frame, [C.impact, C.impact + 12], [0.035, 0], EASE.out);

  // ── ball: falls away from camera onto the sand, then bounces back past it
  const fall = tween(frame, [2, C.impact], [0, 1], EASE.in);
  const bounce = tween(frame, [C.impact, C.impact + 14], [0, 1], EASE.out);
  const ballSize = frame < C.impact ? lerp(minDim * 1.5, minDim * 0.14, fall) : lerp(minDim * 0.14, minDim * 0.9, bounce);
  const ballX = frame < C.impact ? lerp(width * 0.64, impact.x, fall) : lerp(impact.x, width * 0.3, bounce);
  const ballY = frame < C.impact ? lerp(-height * 0.1, impact.y, fall) : lerp(impact.y, -height * 0.45, bounce);
  const ballOpacity = tween(frame, [2, 6], [0, 1]) * (1 - tween(frame, [C.impact + 8, C.impact + 13], [0, 1]));
  const shadowR = frame < C.impact ? lerp(minDim * 0.34, minDim * 0.075, fall) : lerp(minDim * 0.075, minDim * 0.3, bounce);
  const shadowA = frame < C.impact ? lerp(0.05, 0.6, fall) : lerp(0.6, 0, bounce);

  // ── shockwave rings
  const rings = [0, 3, 7].map((d, i) => {
    const t = tween(frame, [C.impact + d, C.impact + d + 24], [0, 1], EASE.out);
    return { r: t * maxDim * (0.75 - i * 0.12), a: frame < C.impact + d ? 0 : (1 - t) * (0.9 - i * 0.2), w: lerp(46, 4, t) };
  });
  const crater = tween(frame, [C.impact, C.impact + 6], [0, 1], EASE.out);

  // ── slam
  const slam = springAt(frame, C.slam, SPRINGS.slam);
  const slamScale = lerp(2.8, 1, slam);
  const slamOpacity = tween(frame, [C.slam, C.slam + 3], [0, 1]);
  const slamBlur = lerp(24, 0, tween(frame, [C.slam, C.slam + 6], [0, 1]));
  const dim = tween(frame, [C.slam - 2, C.slam + 8], [0, 0.5], EASE.out);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.ink, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${s1.x + s2.x}px, ${s1.y + s2.y}px) scale(${camScale})` }}>
        {/* sand */}
        <AbsoluteFill style={{ opacity: tween(frame, [C.sandIn, C.sandIn + 18], [0, 1], EASE.out) }}>
          <Img src={staticFile('fx/sand.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.12) saturate(1.25) contrast(1.08)' }} />
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse 90% 80% at ${(flarePos.x / width) * 100}% ${(flarePos.y / height) * 100}%, rgba(255,214,140,0.3) 0%, rgba(0,0,0,0) 40%, rgba(5,6,8,0.7) 100%)`,
            }}
          />
        </AbsoluteFill>

        {/* ball shadow + crater */}
        <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <radialGradient id="hook-shadow">
              <stop offset="0%" stopColor="#1a1008" stopOpacity="1" />
              <stop offset="100%" stopColor="#1a1008" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hook-crater">
              <stop offset="0%" stopColor="#3b2a17" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#6b4f2c" stopOpacity="0.35" />
              <stop offset="85%" stopColor="#f6ddaa" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f6ddaa" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx={impact.x} cy={impact.y} rx={minDim * 0.16 * crater} ry={minDim * 0.1 * crater} fill="url(#hook-crater)" />
          <ellipse cx={impact.x + minDim * 0.02} cy={impact.y + minDim * 0.015} rx={shadowR} ry={shadowR * 0.62} fill="url(#hook-shadow)" opacity={shadowA} />
          {rings.map((ring, i) => (
            <g key={i} opacity={ring.a}>
              <ellipse cx={impact.x} cy={impact.y} rx={ring.r} ry={ring.r * 0.62} fill="none" stroke="#fbe7bf" strokeWidth={ring.w} style={{ filter: 'blur(6px)' }} />
              <ellipse cx={impact.x} cy={impact.y} rx={Math.max(0, ring.r - ring.w)} ry={Math.max(0, ring.r - ring.w) * 0.62} fill="none" stroke="#2a1b0c" strokeWidth={ring.w * 0.6} style={{ filter: 'blur(8px)' }} opacity={0.6} />
            </g>
          ))}
        </svg>

        {/* dust spray */}
        {Array.from({ length: PARTICLES }, (_, i) => {
          const t = frame - C.impact;
          if (t < 0 || t > 28) return null;
          const ang = random(`pa${i}`) * Math.PI * 2;
          const speed = 0.25 + random(`ps${i}`) * 0.55;
          const dist = speed * maxDim * 0.5 * (1 - Math.exp(-t / 6));
          const lift = 1 + t * 0.04 * random(`pl${i}`);
          const size = (4 + random(`pz${i}`) * 12) * lift;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: impact.x + Math.cos(ang) * dist - size / 2,
                top: impact.y + Math.sin(ang) * dist * 0.62 - size / 2 - t * t * 0.08 * random(`pv${i}`) * 10,
                width: size,
                height: size,
                borderRadius: '50%',
                background: i % 3 === 0 ? '#fff4dc' : '#e9c98f',
                opacity: tween(t, [0, 28], [1, 0], EASE.inOut),
                filter: 'blur(1px)',
              }}
            />
          );
        })}

        <Volleyball
          size={ballSize}
          rotation={frame * 14}
          style={{ position: 'absolute', left: ballX - ballSize / 2, top: ballY - ballSize / 2, opacity: ballOpacity, filter: frame < C.impact ? `blur(${lerp(10, 0, fall)}px)` : 'blur(2px)' }}
        />
      </AbsoluteFill>

      <SunFlare x={flarePos.x} y={flarePos.y} amount={flareAmount} />

      <AbsoluteFill style={{ background: COLORS.navyDeep, opacity: dim }} />

      {/* slam */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: slamOpacity }}>
        <div
          style={{
            display: 'flex',
            flexDirection: r('row', 'column'),
            alignItems: r('baseline', 'center'),
            gap: r(36, 0),
            transform: `scale(${slamScale})`,
            filter: `blur(${slamBlur}px) drop-shadow(0 12px 40px rgba(0,0,0,0.55))`,
            fontFamily: FONTS.display,
            fontWeight: 900,
            lineHeight: 0.86,
            textTransform: 'uppercase',
          }}
        >
          <span style={{ fontSize: r(230, 200), color: COLORS.white, letterSpacing: '-0.01em' }}>{copy.hook.lead}</span>
          <span style={{ fontSize: r(360, 560), letterSpacing: '-0.03em', ...gradientText }}>{copy.hook.number}</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
