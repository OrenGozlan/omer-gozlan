import { Html5Audio, getStaticFiles, interpolate, staticFile } from 'remotion';
import { AUDIO, TOTAL_FRAMES } from '../config/timing';

const MUSIC_FILE = 'music.mp3';

/**
 * Optional soundtrack slot. Drop a track at promo/public/music.mp3 and it is
 * picked up automatically, with fade in/out. With no file present nothing is
 * mounted, so preview and render stay clean (silent output).
 */
export const MusicTrack = () => {
  const hasMusic = getStaticFiles().some((f) => f.name === MUSIC_FILE);
  if (!hasMusic) return null;
  return (
    <Html5Audio
      src={staticFile(MUSIC_FILE)}
      volume={(f) =>
        interpolate(
          f,
          [0, AUDIO.fadeInFrames, TOTAL_FRAMES - AUDIO.fadeOutFrames, TOTAL_FRAMES],
          [0, AUDIO.volume, AUDIO.volume, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
      }
    />
  );
};
