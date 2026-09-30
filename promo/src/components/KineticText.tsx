import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import { SPRINGS, springAt } from '../lib/motion';

type Props = {
  text: string;
  start: number;
  stagger?: number;
  /** split granularity: letters for display type, words for long lines */
  unit?: 'letter' | 'word';
  /** reading direction — the stagger follows it */
  dir?: 'ltr' | 'rtl';
  style?: CSSProperties;
  /** style applied to every unit (e.g. gradient text fill must sit on the unit) */
  unitStyle?: CSSProperties;
};

/**
 * Masked stagger reveal: each unit rises out of its own clipping box on a
 * spring, in reading order.
 */
export const KineticText = ({ text, start, stagger = 2, unit = 'letter', dir = 'ltr', style, unitStyle }: Props) => {
  const frame = useCurrentFrame();
  const parts = unit === 'letter' ? Array.from(text) : text.split(/(\s+)/);
  let index = 0;
  return (
    <div dir={dir} style={{ display: 'flex', flexWrap: unit === 'word' ? 'wrap' : 'nowrap', whiteSpace: 'pre', ...style }}>
      {parts.map((p, i) => {
        if (/^\s+$/.test(p)) return <span key={i}>{p}</span>;
        const s = springAt(frame, start + index++ * stagger, SPRINGS.snappy);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.04em', marginBottom: '-0.04em' }}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 105}%) rotate(${(1 - s) * 6}deg)`,
                transformOrigin: '0% 100%',
                ...unitStyle,
              }}
            >
              {p}
            </span>
          </span>
        );
      })}
    </div>
  );
};
