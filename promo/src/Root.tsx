import { Composition, Folder } from 'remotion';
import { FORMATS, type FormatKey } from './config/formats';
import { FPS, TOTAL_FRAMES } from './config/timing';
import { Promo, promoSchema, type PromoProps } from './Promo';

const LANGS: PromoProps['lang'][] = ['en'];
const ASPECTS: FormatKey[] = ['16x9', '9x16'];

/** Composition id convention: Promo-<LANG>-<aspect>, e.g. Promo-EN-9x16. */
export const compositionId = (lang: PromoProps['lang'], format: FormatKey) => `Promo-${lang.toUpperCase()}-${format}`;

export const RemotionRoot = () => (
  <Folder name="Promo">
    {LANGS.flatMap((lang) =>
      ASPECTS.map((format) => (
        <Composition
          key={compositionId(lang, format)}
          id={compositionId(lang, format)}
          component={Promo}
          schema={promoSchema}
          defaultProps={{ lang, format }}
          durationInFrames={TOTAL_FRAMES}
          fps={FPS}
          width={FORMATS[format].width}
          height={FORMATS[format].height}
        />
      )),
    )}
  </Folder>
);
