/**
 * Single source of truth for all timing. Everything is in frames @ 30fps.
 *
 * Music grid: ~120 BPM → one beat every 15 frames. Scene cuts all land on the
 * grid. To retime, change a value in SCENE_DURATIONS — `from` values are
 * derived, so the scenes stay back-to-back. Scene-internal cues are offsets
 * from scene start.
 */

export const FPS = 30;
export const BEAT = 15;

/** n beats → frames */
export const beats = (n: number): number => Math.round(n * BEAT);

const SCENE_DURATIONS = {
  hook: beats(5), //          0.0s –  2.5s
  name: beats(7), //          2.5s –  6.0s
  montage: beats(16), //      6.0s – 14.0s
  credentials: beats(8), //  14.0s – 18.0s
  stats: beats(6), //        18.0s – 21.0s
  season: beats(25), //      21.0s – 33.5s
  testimonial: beats(9), //  33.5s – 38.0s
  next: beats(8), //         38.0s – 42.0s
  values: beats(8), //       42.0s – 46.0s
  night: beats(20), //       46.0s – 56.0s
  cta: beats(8), //          56.0s – 60.0s
} as const;

export type SceneKey = keyof typeof SCENE_DURATIONS;
export type SceneTiming = { from: number; duration: number };

export const SCENE_ORDER = Object.keys(SCENE_DURATIONS) as SceneKey[];

export const SCENES = SCENE_ORDER.reduce(
  (acc, key, i) => {
    const prev = i === 0 ? undefined : acc[SCENE_ORDER[i - 1]];
    acc[key] = { from: prev ? prev.from + prev.duration : 0, duration: SCENE_DURATIONS[key] };
    return acc;
  },
  {} as Record<SceneKey, SceneTiming>,
);

export const TOTAL_FRAMES = SCENES.cta.from + SCENES.cta.duration; // 1800

/** Scene-internal cues (frames from the start of that scene). */
export const CUES = {
  hook: {
    flareIn: 0, //          sun flare starts blooming out of black
    sandIn: 6,
    impact: beats(2), //     ball hits the sand
    slam: beats(3), //       "ISRAEL'S #1" slams in
  },
  name: {
    letterStart: 4,
    letterStagger: 2, //     frames between letters
    subline: beats(3),
    flagBar: beats(3) + 6,
  },
  montage: {
    // four photo effects, one line of the site's hero subline each
    slices: 0, //            photo assembles from staggered strips
    zoom: beats(4), //       zoom-through into the next photo
    mask: beats(8), //       word filled with a photo, then opens up
    grid: beats(12), //      mosaic flips in, centre tile takes over
    gridExpand: beats(14),
  },
  credentials: {
    badgeA: 0, //            #1 U18
    badgeB: beats(4), //     #1 U20
    together: beats(6), //   both badges + shared label
    reelSpin: 13, //         slot-reel spin length before it lands on "1"
  },
  stats: {
    first: 4,
    stagger: beats(1),
    countFrames: beats(2),
  },
  season: {
    title: 0,
    firstHit: beats(2), //   first international stop
    hitEvery: beats(2), //   one stop every two beats
    medalStagger: 8, //      home medals drop one after another
    homeHold: beats(3), //   time on the home stop (4 domestic medals)
    outroLength: beats(4), //camera pulls back, tally + summary
  },
  testimonial: {
    quoteMark: 0,
    words: 6,
    wordStagger: 1.6, //     frames per word, reading order
    author: beats(5.5),
  },
  next: {
    title: 0,
    firstCard: beats(1),
    cardEvery: beats(1.2),
  },
  values: {
    firstTile: 4,
    tileEvery: beats(1),
  },
  night: {
    // AI bullet-time clip (public/ai/night-bullet.mp4, Seedance from a real photo) with the real
    // 5-frame burst flashed in at the peak. Times in AI-clip seconds, frames in scene frames.
    aiPeak: 2.8, //          top of the jump in the AI clip → cut to the real burst here
    aiContact: 8.35, //      arm meets ball after the frozen orbit
    aiImpact: 8.95, //       ball hits the lens
    burstStep: 4, //         frames per real burst photo
    burstHold: 10, //        hold on the last burst photo before time freezes
  },
  cta: {
    headline: 0,
    contact: 12,
    lockup: 30,
    holdFrames: beats(2), // static hold before the end
  },
} as const;

/** Medals-route timeline (scene-local frames), shared by the scene and the music generator. */
export const SEASON_TIMELINE = (() => {
  const c = CUES.season;
  const intlStops = 8;
  const hits = Array.from({ length: intlStops + 1 }, (_, i) => c.firstHit + i * c.hitEvery); // last = home
  const homeHit = hits[intlStops];
  const homeDrops = Array.from({ length: 4 }, (_, k) => homeHit + 6 + k * c.medalStagger);
  return { intlStops, hits, homeHit, homeDrops, outro: homeHit + c.homeHold };
})();

/**
 * Night-spike timeline (scene-local frames): AI approach + leap → real burst flash →
 * AI freeze / orbit / spike into the lens. Shared by the scene and the music generator.
 */
export const NIGHT_TIMELINE = (() => {
  const c = CUES.night;
  const burstStart = Math.round(c.aiPeak * FPS);
  const changes = Array.from({ length: 5 }, (_, k) => ({ at: burstStart + k * c.burstStep, frame: k }));
  const resume = burstStart + 5 * c.burstStep + c.burstHold; // back to the AI clip, time frozen
  const fromAi = (sec: number) => resume + Math.round((sec - c.aiPeak) * FPS);
  return { burstStart, changes, resume, contact: fromAi(c.aiContact), impact: fromAi(c.aiImpact), fromAi };
})();

/** Volleyball-arc transitions sit on every scene cut. */
export const TRANSITION = {
  halfLength: 8, // frames before/after the cut the ball is on screen
  // no ball on the cut into the CTA: the spike already smashed the ball into the lens
  cuts: SCENE_ORDER.slice(1)
    .filter((k) => k !== 'cta')
    .map((k) => SCENES[k].from),
} as const;

/** Poster frame (absolute), taken from the name scene once the reveal settles. */
export const POSTER_FRAME = SCENES.name.from + beats(5);

export const AUDIO = {
  fadeInFrames: 10,
  fadeOutFrames: beats(3),
  volume: 0.9,
} as const;
