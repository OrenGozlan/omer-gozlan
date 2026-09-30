import type { CSSProperties } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { EASE, tween } from '../lib/motion';

type Props = {
  src: string;
  duration: number;
  scale?: readonly [number, number];
  /** drift in px over the duration */
  drift?: readonly [number, number];
  objectPosition?: string;
  style?: CSSProperties;
  imgStyle?: CSSProperties;
};

/** Eased push-in on a still. Also used for parallax layers (different drift per layer). */
export const KenBurns = ({ src, duration, scale = [1.06, 1.16], drift = [0, 0], objectPosition = '50% 50%', style, imgStyle }: Props) => {
  const frame = useCurrentFrame();
  const s = tween(frame, [0, duration], scale, EASE.inOut);
  const dx = tween(frame, [0, duration], [0, drift[0]], EASE.inOut);
  const dy = tween(frame, [0, duration], [0, drift[1]], EASE.inOut);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', ...style }}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition,
          transform: `translate(${dx}px, ${dy}px) scale(${s})`,
          ...imgStyle,
        }}
      />
    </AbsoluteFill>
  );
};
