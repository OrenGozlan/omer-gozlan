/**
 * All on-screen copy, taken verbatim from the site (src/i18n.js, index.html meta,
 * src/App.jsx). Source noted per block. Nothing here is invented — if a scene
 * ever needs copy the site doesn't have, put `TODO:` in the string and list it
 * in README.md.
 *
 * Keyed by language so a Hebrew build only needs a `he` entry here (plus RTL
 * handling in KineticText); scenes read copy exclusively through this object.
 */

export type Medal = 'gold' | 'silver' | 'bronze';

export type Stop = {
  /** result as the site prints it */
  rank: string;
  event: string;
  detail: string;
  /** map pin label */
  pin: string;
  lon: number;
  lat: number;
  medal?: Medal;
  /** event photo (public/photos/…) for the route card */
  photo?: string;
  /** crop for the card */
  photoPosition?: string;
};

export type HomeResult = { rank: string; event: string; detail: string; medal: Medal };

export type Copy = {
  hook: { lead: string; number: string };
  name: { first: string; last: string; subline: string };
  montage: { lines: [string, string, string, string] };
  credentials: { rank: string; a: string; b: string; caption: string; label: string };
  stats: { n: number; prefix?: string; suffix?: string; label: string }[];
  season: {
    title: string;
    home: string;
    homeTitle: string;
    stops: Stop[];
    homeResults: HomeResult[];
    homePhoto: string;
    summary: string;
    tallyLabel: string;
  };
  testimonial: { quote: string; author: string; role: string };
  next: { heading: string; year: string; items: { t: string; s: string; tag: string }[] };
  values: { items: { t: string; d: string; photo: string }[] };
  cta: { headline: string; url: string; email: string; instagram: string; wordmark: string; monogram: string; tagline: string };
};

export const COPY: Record<'en', Copy> = {
  en: {
    hook: {
      // index.html meta description: "Israel's #1 U18 & U20 beach volleyball player"
      lead: 'ISRAEL’S',
      number: '#1',
    },
    name: {
      // i18n en.hero.name / <title>
      first: 'OMER',
      last: 'GOZLAN',
      subline: 'Beach Volleyball · Team Israel',
    },
    montage: {
      // i18n en.hero.sub: "Rising Star of Israeli Beach Volleyball", one chunk per effect
      lines: ['Rising', 'Star', 'of Israeli', 'Beach Volleyball'],
    },
    credentials: {
      // i18n en.stats[1]: { n: '#1', l: 'Israel U18 & U20 Rank' }
      rank: '1',
      a: 'U18',
      b: 'U20',
      caption: 'Israel',
      label: 'Israel U18 & U20 Rank',
    },
    stats: [
      // i18n en.stats[2] and en.hero.badges[1], [0]
      { n: 11, label: 'Podiums 2024-26' },
      { n: 7, suffix: '×', label: 'International Medalist' },
      { n: 3, suffix: '×', label: 'National Champion' },
    ],
    season: {
      // i18n en.record.s2026_h
      title: '2026 Season',
      home: 'Israel',
      homeTitle: 'Israel',
      // i18n en.record.s2026 — international events, in date order (Wingate Pulse API)
      stops: [
        { rank: '#1', event: 'CEV Nations Cup 2026', detail: 'Adults — Gold · Cyprus', pin: 'Cyprus', lon: 33.4, lat: 35.1, medal: 'gold', photo: 'card-cyprus', photoPosition: '50% 20%' },
        { rank: '#2', event: 'Hungary Adults Cup 2026', detail: 'Silver — Adults', pin: 'Hungary', lon: 19.5, lat: 47.2, medal: 'silver', photo: 'card-hungary', photoPosition: '50% 18%' },
        { rank: '#5', event: 'MEVZA U20 Qualifier — Portorož', detail: '5th Place · top seed', pin: 'Portorož', lon: 13.59, lat: 45.51 },
        { rank: '#1', event: 'MEVZA U20 Championship 2026', detail: 'Gold · Limassol, Cyprus', pin: 'Limassol', lon: 33.04, lat: 34.68, medal: 'gold', photo: 'card-limassol', photoPosition: '50% 45%' },
        { rank: '#9', event: 'MEVZA Zonal Tour — Remerschen', detail: '9th Place · Luxembourg', pin: 'Remerschen', lon: 6.35, lat: 49.49, photo: 'card-remerschen', photoPosition: '50% 22%' },
        { rank: '17', event: 'Beach Pro Tour Futures — Pingtan, China', detail: '17th · Beach Pro Tour debut', pin: 'Pingtan', lon: 119.79, lat: 25.5 },
        { rank: '1/8', event: 'CEV U20 European Championship 2026', detail: '1/8 Finals · Battipaglia, Italy', pin: 'Battipaglia', lon: 14.98, lat: 40.61, photo: 'card-battipaglia', photoPosition: '50% 35%' },
        { rank: '#9', event: 'CEV U22 European Championship 2026', detail: '9th Place · 1/8 Finals · Madrid, Spain', pin: 'Madrid', lon: -3.7, lat: 40.42, photo: 'card-madrid', photoPosition: '50% 30%' },
      ],
      // i18n en.record.s2026 — domestic results (no exact dates on the site, shown together at home)
      homeResults: [
        { rank: '#1', event: '2026 Israel Championship U18', detail: 'National Champion — 3rd straight year', medal: 'gold' },
        { rank: '#1', event: 'Israel Adults A — Wingate', detail: 'Gold · Israel Adults Tour', medal: 'gold' },
        { rank: '#2', event: 'Israel Adults A — Poleg', detail: 'Silver · Israel Adults Tour', medal: 'silver' },
        { rank: '#3', event: '2026 Israel Adults Championship', detail: 'Bronze — Israel Adults National Championship', medal: 'bronze' },
      ],
      homePhoto: 'card-home',
      // i18n en.record.progression
      summary: '7 podiums, 2 international titles, and a Pro Tour debut.',
      tallyLabel: '2026 podiums',
    },
    testimonial: {
      // i18n en.testimonial
      quote:
        'There has never been an 11th-grade student with two European medals. Omer is an exceptional talent — a young athlete with maturity, perseverance, and an unshakable belief in his path.',
      author: 'Eyal Aharonson',
      role: 'Director, Academy for Excellence in Sports, Wingate Institute',
    },
    next: {
      // i18n en.targets (heading + selected items)
      heading: 'What’s Next',
      year: '2027',
      items: [
        { t: 'Beach Pro Tour 2027', s: 'First full season of FIVB ranking points', tag: 'Pro Tour' },
        { t: 'CEV U20 European Championship 2027', s: 'Target: podium', tag: 'Continental' },
        { t: 'CEV U22 European Championship 2027', s: 'Target: podium', tag: 'Continental' },
        { t: 'MEVZA U20 Championship 2027', s: 'Defending the Limassol 2026 gold', tag: 'Continental' },
        { t: 'CEV Nations Cup 2027', s: 'Adults · defending the 2026 gold', tag: 'Continental' },
      ],
    },
    values: {
      // i18n en.sponsor.items
      items: [
        { t: 'Rising Star', d: 'Partner with an athlete at the beginning of a promising international career', photo: 'v-rising' },
        { t: 'Young Audience', d: 'Connect with youth sports enthusiasts and their families across Israel', photo: 'v-audience' },
        { t: 'International Exposure', d: 'Brand visibility at European championships and international tournaments', photo: 'v-exposure' },
        { t: 'Content & Media', d: 'Authentic content creation and social media collaboration opportunities', photo: 'v-content' },
        { t: 'Inspiring Story', d: 'Align with a dedicated athlete who embodies determination and excellence', photo: 'v-story' },
        { t: 'Long-term Partnership', d: 'Grow together as Omer advances to professional international competition', photo: 'v-longterm' },
      ],
    },
    cta: {
      // index.html og:description: "Partnership inquiries open."
      headline: 'Partnership inquiries open',
      url: 'orengozlan.github.io/omer-gozlan',
      email: 'oren.gozlan@gmail.com',
      instagram: '@g0zlan_',
      wordmark: 'OMER GOZLAN',
      monogram: 'OG', // public/favicon.svg
      tagline: 'Beach Volleyball · Team Israel',
    },
  },
};

/** Home base for the flight path (Tel Aviv area). */
export const HOME = { lon: 34.78, lat: 32.08 };
