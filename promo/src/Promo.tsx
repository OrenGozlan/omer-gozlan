import { AbsoluteFill, Sequence } from 'remotion';
import { z } from 'zod';
import { BallArc } from './components/BallArc';
import { Grain, Vignette } from './components/Grain';
import { MusicTrack } from './components/MusicTrack';
import { COPY } from './config/copy';
import { FORMATS } from './config/formats';
import { COLORS } from './config/theme';
import { SCENES, SCENE_ORDER, TRANSITION, type SceneKey } from './config/timing';
import { PromoProvider } from './lib/format-context';
import { Credentials } from './scenes/Credentials';
import { Cta } from './scenes/Cta';
import { Hook } from './scenes/Hook';
import { Montage } from './scenes/Montage';
import { Name } from './scenes/Name';
import { Next } from './scenes/Next';
import { Night } from './scenes/Night';
import { Season } from './scenes/Season';
import { Stats } from './scenes/Stats';
import { Testimonial } from './scenes/Testimonial';
import { Values } from './scenes/Values';

export const promoSchema = z.object({
  lang: z.enum(['en']),
  format: z.enum(['16x9', '9x16']),
});
export type PromoProps = z.infer<typeof promoSchema>;

const SCENE_COMPONENTS: Record<SceneKey, () => React.JSX.Element> = {
  hook: Hook,
  name: Name,
  montage: Montage,
  credentials: Credentials,
  stats: Stats,
  season: Season,
  testimonial: Testimonial,
  next: Next,
  values: Values,
  night: Night,
  cta: Cta,
};

/** One component for every language × aspect ratio; scenes read format + copy from context. */
export const Promo = ({ lang, format }: PromoProps) => (
  <PromoProvider value={{ format: FORMATS[format], copy: COPY[lang] }}>
    <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
      {SCENE_ORDER.map((key) => {
        const Scene = SCENE_COMPONENTS[key];
        return (
          <Sequence key={key} name={key} from={SCENES[key].from} durationInFrames={SCENES[key].duration}>
            <Scene />
          </Sequence>
        );
      })}
      <Vignette strength={0.45} />
      {TRANSITION.cuts.map((cut, i) => (
        <BallArc key={cut} cut={cut} direction={i % 2 === 0 ? 1 : -1} />
      ))}
      <Grain />
      <MusicTrack />
    </AbsoluteFill>
  </PromoProvider>
);
