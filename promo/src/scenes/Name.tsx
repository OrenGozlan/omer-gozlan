import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KenBurns } from '../components/KenBurns';
import { KineticText } from '../components/KineticText';
import { LightLeak } from '../components/Light';
import { FlagBar } from '../components/Lockup';
import { COLORS, FONTS } from '../config/theme';
import { CUES, SCENES } from '../config/timing';
import { usePromo, useResponsive } from '../lib/format-context';
import { EASE, tween } from '../lib/motion';

const C = CUES.name;
const D = SCENES.name.duration;

/**
 * 2 · NAME — letter-stagger "OMER GOZLAN" over the athlete, three parallax
 * planes: clean plate (slow), athlete cutout (faster), type (fastest).
 */
export const Name = () => {
  const frame = useCurrentFrame();
  const { copy, format } = usePromo();
  const r = useResponsive();
  const slot = r('name-wide', 'name-tall');
  const objectPosition = r('50% 38%', '50% 30%');

  // masked reveal: diagonal wipe opens the photo on the cut
  const wipe = tween(frame, [0, 12], [0, 1], EASE.out);
  const clip = `polygon(0 0, ${wipe * 140}% 0, ${wipe * 140 - 40}% 100%, 0 100%)`;

  const textDrift = tween(frame, [0, D], [0, r(-60, -30)], EASE.inOut);
  const sublineWipe = tween(frame, [C.subline, C.subline + 12], [0, 100], EASE.out);
  const flag = tween(frame, [C.flagBar, C.flagBar + 10], [0, 1], EASE.out);

  const nameSize = r(250, 250);
  const nameBlock = r(
    { left: format.safe.left, bottom: format.safe.bottom + 40, alignItems: 'flex-start' as const },
    { left: 0, right: 0, bottom: format.safe.bottom + 10, alignItems: 'center' as const },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.navyDeep }}>
      <AbsoluteFill style={{ clipPath: clip }}>
        {/* plane 1: background plate */}
        <KenBurns
          src={`photos/${slot}-plate.jpg`}
          duration={D}
          scale={[1.12, 1.17]}
          drift={[r(40, 20), 0]}
          objectPosition={objectPosition}
          imgStyle={{ filter: 'blur(4px) brightness(0.72) saturate(1.1)' }}
        />
        <AbsoluteFill
          style={{
            background: r(
              `linear-gradient(90deg, rgba(6,11,23,0.85) 0%, rgba(6,11,23,0.35) 45%, rgba(6,11,23,0) 70%), linear-gradient(0deg, rgba(6,11,23,0.7) 0%, rgba(6,11,23,0) 45%)`,
              `linear-gradient(0deg, rgba(6,11,23,0.92) 0%, rgba(6,11,23,0.5) 32%, rgba(6,11,23,0) 55%)`,
            ),
          }}
        />
        {/* plane 2: athlete */}
        <KenBurns
          src={`photos/${slot}-cutout.png`}
          duration={D}
          scale={[1.12, 1.21]}
          drift={[r(-45, -25), r(0, -20)]}
          objectPosition={objectPosition}
          imgStyle={{ filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.45)) contrast(1.05) saturate(1.08)' }}
        />
        {r(null, <AbsoluteFill style={{ background: 'linear-gradient(0deg, rgba(6,11,23,0.9) 0%, rgba(6,11,23,0.4) 22%, rgba(6,11,23,0) 38%)' }} />)}
        <LightLeak seed="name" duration={D} intensity={0.5} />
      </AbsoluteFill>

      {/* plane 3: type */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          ...nameBlock,
          transform: `translateX(${textDrift}px)`,
          fontFamily: FONTS.display,
          fontWeight: 900,
          textTransform: 'uppercase',
          color: COLORS.white,
          textShadow: '0 4px 30px rgba(0,0,0,0.45)',
        }}
      >
        <KineticText text={copy.name.first} start={C.letterStart} stagger={C.letterStagger} style={{ fontSize: nameSize, lineHeight: 0.84, letterSpacing: '-0.01em' }} />
        <KineticText
          text={copy.name.last}
          start={C.letterStart + copy.name.first.length * C.letterStagger}
          stagger={C.letterStagger}
          style={{ fontSize: nameSize, lineHeight: 0.84, letterSpacing: '-0.01em' }}
          unitStyle={{ color: COLORS.amber }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: r(28, 34) }}>
          <div style={{ transform: `scaleX(${flag})`, transformOrigin: 'left center' }}>
            <FlagBar width={r(64, 56)} height={r(40, 36)} />
          </div>
          <div
            style={{
              fontFamily: FONTS.body,
              fontWeight: 700,
              fontSize: r(40, 38),
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: COLORS.amberPale,
              clipPath: `inset(0 ${100 - sublineWipe}% 0 0)`,
              textShadow: 'none',
            }}
          >
            {copy.name.subline}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
