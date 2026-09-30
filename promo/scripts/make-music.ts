// Original soundtrack generator — 120 BPM future-house, synthesised from scratch
// (no samples, no licensed material) and locked to the video's timing config:
// section changes land on scene cuts, sound effects land on on-screen events.
//
//   npm run music      → public/music.mp3  (picked up automatically by <MusicTrack/>)
//
// Retime the video in src/config/timing.ts, re-run this, and the music follows.
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COPY } from '../src/config/copy.ts';
import { BEAT, CUES, FPS, SCENES, SEASON_TIMELINE, TOTAL_FRAMES, TRANSITION, type SceneKey } from '../src/config/timing.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SR = 44100;
const SPB = BEAT / FPS; // seconds per beat (0.5 at 120 BPM)
const S16 = SPB / 4;
const DUR = TOTAL_FRAMES / FPS;
const N = Math.ceil(DUR * SR) + SR; // +1s headroom for tails, trimmed on export
const f2t = (frame: number) => frame / FPS;
const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

// ── deterministic noise
let seed = 0x9e3779b9;
const rnd = () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const noise = () => rnd() * 2 - 1;

// ── cubic-bezier easing (same curve as EASE.out in src/lib/motion.ts)
const bezier = (x1: number, y1: number, x2: number, y2: number) => (x: number) => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 12; i++) {
    const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x;
    const dx = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
    if (Math.abs(dx) < 1e-6) break;
    t -= cx / dx;
  }
  return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
};
const easeOut = bezier(0.16, 1, 0.3, 1);

// ── biquad (RBJ cookbook)
type FilterType = 'lp' | 'hp' | 'bp';
class Biquad {
  b0 = 1;
  b1 = 0;
  b2 = 0;
  a1 = 0;
  a2 = 0;
  z1 = 0;
  z2 = 0;
  type: FilterType;
  constructor(type: FilterType, f: number, q = 0.707) {
    this.type = type;
    this.set(f, q);
  }
  set(f: number, q = 0.707) {
    const w = (2 * Math.PI * Math.min(f, SR * 0.45)) / SR;
    const cw = Math.cos(w);
    const a = Math.sin(w) / (2 * q);
    let b0: number, b1: number, b2: number;
    if (this.type === 'lp') [b0, b1, b2] = [(1 - cw) / 2, 1 - cw, (1 - cw) / 2];
    else if (this.type === 'hp') [b0, b1, b2] = [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2];
    else [b0, b1, b2] = [a, 0, -a];
    const a0 = 1 + a;
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * cw) / a0;
    this.a2 = (1 - a) / a0;
  }
  p(x: number) {
    const y = this.b0 * x + this.z1;
    this.z1 = this.b1 * x - this.a1 * y + this.z2;
    this.z2 = this.b2 * x - this.a2 * y;
    return y;
  }
}

const polyblep = (t: number, dt: number) => {
  if (t < dt) {
    t /= dt;
    return t + t - t * t - 1;
  }
  if (t > 1 - dt) {
    t = (t - 1) / dt;
    return t * t + t + t + 1;
  }
  return 0;
};

// ── stereo buses
type Bus = { L: Float32Array; R: Float32Array };
const bus = (): Bus => ({ L: new Float32Array(N), R: new Float32Array(N) });
const drums = bus();
const music = bus(); // sidechained to the kick
const arpBus = bus(); // → ping-pong delay
const fx = bus();
const send = bus(); // → reverb

const place = (b: Bus, t0: number, x: Float32Array, gain = 1, pan = 0, sendAmt = 0) => {
  const i0 = Math.round(t0 * SR);
  const gl = Math.cos(((pan + 1) * Math.PI) / 4) * gain;
  const gr = Math.sin(((pan + 1) * Math.PI) / 4) * gain;
  for (let i = 0; i < x.length; i++) {
    const j = i0 + i;
    if (j < 0 || j >= N) continue;
    b.L[j] += x[i] * gl;
    b.R[j] += x[i] * gr;
    if (sendAmt) {
      send.L[j] += x[i] * gl * sendAmt;
      send.R[j] += x[i] * gr * sendAmt;
    }
  }
};
const placeStereo = (b: Bus, t0: number, L: Float32Array, R: Float32Array, gain = 1, sendAmt = 0) => {
  const i0 = Math.round(t0 * SR);
  for (let i = 0; i < L.length; i++) {
    const j = i0 + i;
    if (j < 0 || j >= N) continue;
    b.L[j] += L[i] * gain;
    b.R[j] += R[i] * gain;
    if (sendAmt) {
      send.L[j] += L[i] * gain * sendAmt;
      send.R[j] += R[i] * gain * sendAmt;
    }
  }
};
/** pan sweeps across the sound (ball flying across the frame) */
const placeSweep = (b: Bus, t0: number, x: Float32Array, gain: number, panFrom: number, panTo: number, sendAmt = 0) => {
  const i0 = Math.round(t0 * SR);
  for (let i = 0; i < x.length; i++) {
    const j = i0 + i;
    if (j < 0 || j >= N) continue;
    const pan = panFrom + (panTo - panFrom) * (i / x.length);
    const gl = Math.cos(((pan + 1) * Math.PI) / 4) * gain;
    const gr = Math.sin(((pan + 1) * Math.PI) / 4) * gain;
    b.L[j] += x[i] * gl;
    b.R[j] += x[i] * gr;
    if (sendAmt) {
      send.L[j] += x[i] * gl * sendAmt;
      send.R[j] += x[i] * gr * sendAmt;
    }
  }
};

// ── instruments (mono buffers unless noted)
const buf = (sec: number) => new Float32Array(Math.ceil(sec * SR));

const kick = () => {
  const x = buf(0.5);
  let ph = 0;
  const hp = new Biquad('hp', 900);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    const f = 46 + 130 * Math.exp(-t / 0.028);
    ph += (2 * Math.PI * f) / SR;
    const body = Math.sin(ph) * Math.exp(-t / 0.3) * Math.min(1, t / 0.0015);
    const click = hp.p(noise()) * Math.exp(-t / 0.004) * 0.35;
    x[i] = Math.tanh(1.9 * (body + click)) / Math.tanh(1.9);
  }
  return x;
};
const clap = () => {
  const x = buf(0.4);
  const bp = new Biquad('bp', 1350, 0.9);
  const hp = new Biquad('hp', 500);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    let env = 0;
    for (let k = 0; k < 3; k++) if (t >= k * 0.011) env = Math.max(env, Math.exp(-(t - k * 0.011) / 0.006));
    if (t > 0.022) env = Math.max(env, 0.65 * Math.exp(-(t - 0.022) / 0.12));
    x[i] = hp.p(bp.p(noise())) * env * 2.4;
  }
  return x;
};
const hat = (open: boolean) => {
  const x = buf(open ? 0.32 : 0.07);
  const hp = new Biquad('hp', 7600, 0.8);
  for (let i = 0; i < x.length; i++) x[i] = hp.p(noise()) * Math.exp(-i / SR / (open ? 0.085 : 0.016));
  return x;
};
const snare = () => {
  const x = buf(0.25);
  const bp = new Biquad('bp', 1900, 0.7);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = bp.p(noise()) * Math.exp(-t / 0.08) * 1.6 + Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t / 0.045) * 0.5;
  }
  return x;
};
const crash = (len = 2.4) => {
  const x = buf(len);
  const hp = new Biquad('hp', 3800, 0.6);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = hp.p(noise()) * Math.exp(-t / 0.75) * Math.min(1, t / 0.002);
  }
  return x;
};
const impact = () => {
  const x = buf(2.6);
  let ph = 0;
  const lp = new Biquad('lp', 260);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (30 + 55 * Math.exp(-t / 0.9))) / SR;
    x[i] = Math.sin(ph) * Math.exp(-t / 0.75) + lp.p(noise()) * Math.exp(-t / 0.12) * 1.4;
  }
  return x;
};
const riser = (len: number) => {
  const x = buf(len);
  const bp = new Biquad('bp', 400, 2.2);
  const lp = new Biquad('lp', 2600);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const p = i / x.length;
    if (i % 32 === 0) bp.set(400 * (22 ** p), 2.2);
    ph += (150 * 8 ** p) / SR;
    const saw = 2 * (ph % 1) - 1;
    x[i] = (bp.p(noise()) * 2.2 + lp.p(saw) * 0.12) * p ** 2.2;
  }
  return x;
};
const whoosh = (len: number) => {
  const x = buf(len);
  const bp = new Biquad('bp', 600, 1.4);
  for (let i = 0; i < x.length; i++) {
    const p = i / x.length;
    if (i % 32 === 0) bp.set(500 + 4200 * Math.sin(Math.PI * p) ** 1.5, 1.4);
    x[i] = bp.p(noise()) * Math.sin(Math.PI * p) ** 2 * 2.2;
  }
  return x;
};
const tick = (f = 3200) => {
  const x = buf(0.03);
  const hp = new Biquad('hp', 4000);
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    x[i] = Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.004) + hp.p(noise()) * Math.exp(-t / 0.0015) * 0.6;
  }
  return x;
};
/** coin / bell: inharmonic partials, fast attack */
const chime = (f: number, len = 1.8) => {
  const x = buf(len);
  const parts: [number, number, number][] = [
    [1, 1, 0.9],
    [2.76, 0.5, 0.45],
    [5.4, 0.28, 0.22],
    [8.9, 0.12, 0.1],
  ];
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    let v = 0;
    for (const [m, a, d] of parts) v += Math.sin(2 * Math.PI * f * m * t) * a * Math.exp(-t / d);
    x[i] = v * Math.min(1, t / 0.001) * 0.5;
  }
  return x;
};
const pluck = (f: number, len = 0.4, bright = 1) => {
  const x = buf(len);
  const lp = new Biquad('lp', 6000, 1.2);
  let ph = 0;
  const dt = f / SR;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    if (i % 16 === 0) lp.set(500 + 7000 * bright * Math.exp(-t / 0.07), 1.2);
    ph = (ph + dt) % 1;
    const saw = 2 * ph - 1 - polyblep(ph, dt);
    const sq = (ph < 0.5 ? 1 : -1) + polyblep(ph, dt) - polyblep((ph + 0.5) % 1, dt);
    x[i] = lp.p(saw * 0.6 + sq * 0.4) * Math.exp(-t / 0.16) * Math.min(1, t / 0.002);
  }
  return x;
};
/** stereo supersaw chord with ADSR and a (possibly moving) low-pass */
const supersaw = (notes: number[], len: number, o: { attack?: number; release?: number; cutoff: (p: number) => number; q?: number }) => {
  const total = len + (o.release ?? 0.1);
  const L = buf(total);
  const R = buf(total);
  const detune = [-0.016, -0.008, 0, 0.008, 0.016];
  for (const m of notes) {
    detune.forEach((d, v) => {
      const f = mtof(m) * (1 + d);
      const dt = f / SR;
      let ph = rnd();
      const pan = (v / (detune.length - 1)) * 2 - 1;
      const gl = Math.cos(((pan * 0.8 + 1) * Math.PI) / 4);
      const gr = Math.sin(((pan * 0.8 + 1) * Math.PI) / 4);
      for (let i = 0; i < L.length; i++) {
        ph = (ph + dt) % 1;
        const s = (2 * ph - 1 - polyblep(ph, dt)) * 0.12;
        L[i] += s * gl;
        R[i] += s * gr;
      }
    });
  }
  const fl = new Biquad('lp', 1000, o.q ?? 0.9);
  const fr = new Biquad('lp', 1000, o.q ?? 0.9);
  const a = o.attack ?? 0.005;
  const rel = o.release ?? 0.1;
  for (let i = 0; i < L.length; i++) {
    const t = i / SR;
    if (i % 32 === 0) {
      const c = o.cutoff(Math.min(1, t / len));
      fl.set(c, o.q ?? 0.9);
      fr.set(c, o.q ?? 0.9);
    }
    const env = Math.min(1, t / a) * (t > len ? Math.exp(-(t - len) / (rel / 4)) : 1);
    L[i] = fl.p(L[i]) * env;
    R[i] = fr.p(R[i]) * env;
  }
  return { L, R };
};
const bassNote = (m: number, len: number) => {
  const x = buf(len + 0.03);
  const f = mtof(m);
  const dt = f / SR;
  const lp = new Biquad('lp', 750, 1.1);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR;
    ph = (ph + dt) % 1;
    const saw = 2 * ph - 1 - polyblep(ph, dt);
    const sub = Math.sin(2 * Math.PI * ph);
    const env = Math.min(1, t / 0.003) * (0.75 + 0.25 * Math.exp(-t / 0.06)) * (t > len ? Math.exp(-(t - len) / 0.008) : 1);
    x[i] = Math.tanh(1.6 * (lp.p(saw) * 0.8 + sub * 0.7)) * env;
  }
  return x;
};

// ── harmony: Fm7 – Dbmaj7 – Ab/Eb – Eb (vi–IV–I–V in Ab), one chord per bar
const PROG = [
  { root: 41, chord: [53, 56, 60, 63] },
  { root: 37, chord: [49, 53, 56, 60] },
  { root: 44, chord: [51, 56, 60, 63] },
  { root: 39, chord: [51, 55, 58, 62] },
];
const ARP = [0, 2, 1, 3, 2, 1, 3, 2];

// ── pre-rendered drum hits (re-used; each call to kick() etc. costs a buffer)
const KICK = kick();
const CLAP = clap();
const HAT_C = hat(false);
const HAT_O = hat(true);
const SNARE = snare();

const kickTimes: number[] = [];
const hitKick = (t: number, g = 1) => {
  place(drums, t, KICK, 0.95 * g);
  kickTimes.push(t);
};

type Style = 'intro' | 'drop' | 'groove' | 'build' | 'breakdown' | 'outro';
const SECTIONS: Partial<Record<SceneKey, Style>> = {
  name: 'intro',
  montage: 'drop',
  credentials: 'groove',
  stats: 'build',
  season: 'drop',
  testimonial: 'breakdown',
  next: 'build',
  values: 'drop',
  cta: 'outro',
};

const writeSection = (key: SceneKey, style: Style) => {
  const t0 = f2t(SCENES[key].from);
  const nBeats = SCENES[key].duration / BEAT;
  const bars = Math.ceil(nBeats / 4);
  const bright = key === 'season' ? 1.25 : key === 'values' ? 1.1 : 1;

  if (style === 'drop') {
    place(drums, t0, crash(), 0.32, 0, 0.3);
    place(fx, t0, impact(), 0.28);
  }

  for (let bar = 0; bar < bars; bar++) {
    const { root, chord } = PROG[bar % 4];
    const barT = t0 + bar * 4 * SPB;
    const barBeats = Math.min(4, nBeats - bar * 4);
    const barLen = barBeats * SPB;
    const prog = bar / Math.max(1, bars - 1);

    // chords
    if (style === 'drop' || style === 'groove') {
      const slots = style === 'drop' ? [2, 6, 10, 13] : [2, 10];
      for (const s of slots) {
        if (s >= barBeats * 4) continue;
        const { L, R } = supersaw(chord, S16 * 1.6, { cutoff: (p) => 5200 * bright * (1 - 0.6 * p), release: 0.12 });
        placeStereo(music, barT + s * S16, L, R, 0.55, 0.35);
      }
    } else if (style === 'intro' || style === 'build' || style === 'breakdown') {
      const lo = style === 'build' ? 600 : 400;
      const hi = style === 'breakdown' ? 3200 : 4200;
      const { L, R } = supersaw(chord, barLen, {
        attack: style === 'breakdown' ? 0.35 : 0.05,
        release: 0.6,
        cutoff: (p) => lo + (hi - lo) * Math.min(1, (bar + p) / bars),
      });
      placeStereo(music, barT, L, R, style === 'breakdown' ? 0.85 : 0.36, 0.5);
    }

    // bass: house offbeats
    if (style !== 'breakdown' && style !== 'outro') {
      for (let b = 0; b < barBeats; b++) {
        const bt = barT + b * SPB;
        place(music, bt + 2 * S16, bassNote(root + 12, S16 * 1.7), style === 'intro' ? 0.32 : 0.42);
        if (style === 'drop' && b === 3) place(music, bt + 3 * S16, bassNote(root + 24, S16 * 0.8), 0.3);
      }
    }

    // arp
    if (style === 'drop' || style === 'breakdown') {
      const step = style === 'drop' ? 1 : 4; // 16ths in drops, quarters in the breakdown
      for (let s = 0; s < barBeats * 4; s += step) {
        const note = chord[ARP[(s / step) % ARP.length]] + (style === 'drop' ? 24 : 12);
        place(arpBus, barT + s * S16, pluck(mtof(note), 0.35, bright), style === 'drop' ? 0.2 : 0.42, ((s / step) % 2 ? 0.35 : -0.35), 0.4);
      }
    }

    // drums
    for (let b = 0; b < barBeats; b++) {
      const bt = barT + b * SPB;
      const lb = bar * 4 + b;
      if (style === 'drop' || style === 'groove' || style === 'intro') {
        if (!(style === 'intro' && lb === 0)) hitKick(bt);
        if (style !== 'intro' && b % 2 === 1) place(drums, bt, CLAP, 0.5, 0, 0.25);
        place(drums, bt + 2 * S16, HAT_O, style === 'intro' ? 0.12 : 0.16, 0.15);
        if (style === 'drop') {
          place(drums, bt + S16, HAT_C, 0.1, -0.2);
          place(drums, bt + 3 * S16, HAT_C, 0.12, -0.2);
        }
      } else if (style === 'build') {
        if (lb < nBeats - 1) hitKick(bt, 0.9);
        // snare roll that tightens toward the drop: 8ths → 16ths → 32nds
        const left = nBeats - lb;
        const div = left > 4 ? 2 : left > 2 ? 4 : 8;
        for (let k = 0; k < div; k++) place(drums, bt + (k * SPB) / div, SNARE, 0.18 + 0.3 * prog * (k / div + 0.5), 0, 0.2);
      } else if (style === 'outro') {
        if (lb < 6) hitKick(bt, lb === 0 ? 1 : 0.8);
        if (lb < 6) place(drums, bt + 2 * S16, HAT_O, 0.12, 0.15);
      }
    }
  }

  if (style === 'build') place(fx, t0, riser(nBeats * SPB), 0.34, 0, 0.3);
  if (style === 'outro') {
    place(drums, t0, crash(3), 0.34, 0, 0.35);
    place(fx, t0, impact(), 0.34);
    const { L, R } = supersaw(PROG[0].chord.concat(PROG[0].chord[0] + 12), SPB * 1.5, { cutoff: () => 4000, release: 1.6 });
    placeStereo(music, t0, L, R, 0.55, 0.6);
    // final ringing chord after the lockup
    const last = supersaw(PROG[2].chord.concat(PROG[2].chord[1] + 12), 5 * SPB, { attack: 0.02, release: 2.2, cutoff: (p) => 3800 - 2600 * p });
    placeStereo(music, t0 + 6 * SPB, last.L, last.R, 0.5, 0.7);
  }
};

// ── HOOK: riser into the impact, slam, breath before the groove
{
  const h = SCENES.hook.from;
  const impactT = f2t(h + CUES.hook.impact);
  const slamT = f2t(h + CUES.hook.slam);
  place(fx, 0, riser(impactT), 0.38, 0, 0.3);
  place(fx, impactT, impact(), 0.55);
  place(drums, impactT, crash(1.2), 0.18, 0, 0.3);
  hitKick(slamT, 1.05);
  place(drums, slamT, CLAP, 0.55, 0, 0.5);
  place(drums, slamT, crash(3), 0.36, 0, 0.5);
  const { L, R } = supersaw(PROG[0].chord.concat(PROG[0].chord[0] + 12), SPB * 1.4, { cutoff: (p) => 5000 - 3500 * p, release: 1 });
  placeStereo(music, slamT, L, R, 0.6, 0.7);
  place(fx, f2t(SCENES.name.from) - SPB, riser(SPB), 0.2);
}

for (const [key, style] of Object.entries(SECTIONS) as [SceneKey, Style][]) writeSection(key, style);

// ── SFX locked to on-screen events
// ball arc across every cut: whoosh panned with the flight direction
TRANSITION.cuts.forEach((cut, i) => {
  const len = (2 * TRANSITION.halfLength) / FPS;
  const dir = i % 2 === 0 ? 1 : -1;
  placeSweep(fx, f2t(cut - TRANSITION.halfLength), whoosh(len), 0.32, -0.85 * dir, 0.85 * dir, 0.2);
});

// montage: accent on each photo effect, ticks on the mosaic flips
{
  const m = SCENES.montage.from;
  const M = CUES.montage;
  place(fx, f2t(m + M.zoom) - 0.33, riser(0.33), 0.25);
  for (const at of [M.mask, M.grid]) place(drums, f2t(m + at), crash(1.2), 0.18, 0, 0.3);
  for (let k = 0; k < 9; k++) place(fx, f2t(m + M.grid + k * 3), tick(2600 + k * 90), 0.1, (k % 3) - 1);
  placeSweep(fx, f2t(m + M.gridExpand) - 0.1, whoosh(0.5), 0.22, 0, 0);
}

// credentials: slot-reel clicks decelerating onto the landing thump
{
  const c = SCENES.credentials.from;
  const K = CUES.credentials;
  for (const start of [c + K.badgeA + 2, c + K.badgeB + 2]) {
    let last = 0;
    const strip = 21;
    for (let f = 0; f <= K.reelSpin; f += 0.05) {
      const idx = Math.floor(easeOut(f / K.reelSpin) * (strip - 1));
      if (idx > last) {
        place(fx, f2t(start + f), tick(3400), 0.12, 0.1);
        last = idx;
      }
    }
    const land = f2t(start + K.reelSpin);
    place(drums, land, KICK, 0.5);
    place(fx, land, chime(mtof(84)), 0.12, 0, 0.3);
  }
  placeSweep(fx, f2t(c + K.together) - 0.1, whoosh(0.45), 0.16, -0.4, 0.4);
}

// stats: a tick per counted number, punch when each counter lands
{
  const s = SCENES.stats.from;
  const K = CUES.stats;
  COPY.en.stats.forEach((st, i) => {
    const start = s + K.first + i * K.stagger;
    let last = 0;
    for (let f = 0; f <= K.countFrames; f += 0.1) {
      const v = Math.round(st.n * easeOut(f / K.countFrames));
      if (v > last) {
        place(fx, f2t(start + f), tick(2400 + v * 60), 0.11, i - 1);
        last = v;
      }
    }
    place(fx, f2t(start + K.countFrames), chime(mtof(79 + i * 3)), 0.12, i - 1, 0.3);
  });
}

// medals route: ding on each stop, coin chime when a medal lands, home medals in a run
{
  const s = SCENES.season.from;
  const MEDAL_NOTE = { gold: 91, silver: 88, bronze: 84 } as const;
  const stops = COPY.en.season.stops;
  SEASON_TIMELINE.hits.forEach((h, i) => {
    const t = f2t(s + h);
    const chord = PROG[i % 4].chord;
    place(fx, t, pluck(mtof(chord[3] + 24), 0.6, 1.2), 0.16, 0, 0.45);
    const medal = i < stops.length ? stops[i].medal : undefined;
    if (medal) place(fx, t + f2t(7), chime(mtof(MEDAL_NOTE[medal])), 0.2, 0.2, 0.4);
  });
  COPY.en.season.homeResults.forEach((r, k) => place(fx, f2t(s + SEASON_TIMELINE.homeDrops[k] + 7), chime(mtof(MEDAL_NOTE[r.medal] - k)), 0.18, -0.3 + k * 0.2, 0.4));
  place(fx, f2t(s + SEASON_TIMELINE.outro) - 0.2, whoosh(0.8), 0.2, 0, 0.3);
}

// next: soft swish per target card; values: tick per tile
{
  const n = SCENES.next.from;
  COPY.en.next.items.forEach((_, i) => place(fx, f2t(n + CUES.next.firstCard + i * CUES.next.cardEvery), whoosh(0.3), 0.1, 0.4, 0.2));
  const v = SCENES.values.from;
  COPY.en.values.items.forEach((_, i) => place(fx, f2t(v + CUES.values.firstTile + i * CUES.values.tileEvery), tick(2200 + i * 150), 0.12, (i % 3) - 1));
}

// cta: lockup hit
{
  const t = f2t(SCENES.cta.from + CUES.cta.lockup);
  place(drums, t, KICK, 0.6);
  place(fx, t, chime(mtof(84)), 0.16, 0, 0.5);
}

// ── mix: sidechain, delay, reverb, bus sum, master
console.log('mixing…');
const duck = new Float32Array(N).fill(1);
for (const tk of kickTimes) {
  const i0 = Math.round(tk * SR);
  for (let i = 0; i < 0.45 * SR; i++) {
    const j = i0 + i;
    if (j >= N) break;
    const t = i / SR;
    const g = 1 - 0.72 * Math.exp(-t / 0.11) * Math.min(1, t / 0.004 + 0.3);
    if (g < duck[j]) duck[j] = g;
  }
}

// ping-pong delay (dotted 8th) on the arp
{
  const d = Math.round(S16 * 3 * SR);
  const fb = 0.38;
  for (let i = d; i < N; i++) {
    arpBus.L[i] += arpBus.R[i - d] * fb;
    arpBus.R[i] += arpBus.L[i - d] * fb;
  }
}

// Freeverb-style reverb on the send bus
const reverb = (inp: Float32Array, spread: number) => {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((n) => ({ b: new Float32Array(n + spread), i: 0, s: 0 }));
  const aps = [556, 441, 341, 225].map((n) => ({ b: new Float32Array(n + spread), i: 0 }));
  const out = new Float32Array(inp.length);
  const fb = 0.86;
  const damp = 0.25;
  for (let n = 0; n < inp.length; n++) {
    const x = inp[n] * 0.015;
    let y = 0;
    for (const c of combs) {
      const o = c.b[c.i];
      c.s = o * (1 - damp) + c.s * damp;
      c.b[c.i] = x + c.s * fb;
      c.i = (c.i + 1) % c.b.length;
      y += o;
    }
    for (const a of aps) {
      const o = a.b[a.i];
      a.b[a.i] = y + o * 0.5;
      a.i = (a.i + 1) % a.b.length;
      y = o - y;
    }
    out[n] = y;
  }
  return out;
};
const wetL = reverb(send.L, 0);
const wetR = reverb(send.R, 23);

const outL = new Float32Array(N);
const outR = new Float32Array(N);
const hpL = new Biquad('hp', 28);
const hpR = new Biquad('hp', 28);
for (let i = 0; i < N; i++) {
  const g = duck[i];
  let l = drums.L[i] * 0.9 + (music.L[i] + arpBus.L[i]) * g * 0.8 + fx.L[i] * 0.85 + wetL[i] * 0.9;
  let r = drums.R[i] * 0.9 + (music.R[i] + arpBus.R[i]) * g * 0.8 + fx.R[i] * 0.85 + wetR[i] * 0.9;
  l = hpL.p(l);
  r = hpR.p(r);
  outL[i] = Math.tanh(l * 1.25) / 1.1;
  outR[i] = Math.tanh(r * 1.25) / 1.1;
}

// trim to the composition, short fade at the very end
const len = Math.round(DUR * SR);
const fade = Math.round(0.05 * SR);
let peak = 0;
for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(outL[i]), Math.abs(outR[i]));
const norm = 0.95 / (peak || 1);
const pcm = Buffer.alloc(44 + len * 4);
pcm.write('RIFF', 0);
pcm.writeUInt32LE(36 + len * 4, 4);
pcm.write('WAVEfmt ', 8);
pcm.writeUInt32LE(16, 16);
pcm.writeUInt16LE(1, 20);
pcm.writeUInt16LE(2, 22);
pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 4, 28);
pcm.writeUInt16LE(4, 32);
pcm.writeUInt16LE(16, 34);
pcm.write('data', 36);
pcm.writeUInt32LE(len * 4, 40);
for (let i = 0; i < len; i++) {
  const f = i > len - fade ? (len - i) / fade : 1;
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outL[i] * norm * f)) * 32767), 44 + i * 4);
  pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, outR[i] * norm * f)) * 32767), 46 + i * 4);
}
const wav = path.join(root, 'out', 'music.wav');
const mp3 = path.join(root, 'public', 'music.mp3');
writeFileSync(wav, pcm);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', wav, '-af', 'loudnorm=I=-14:TP=-1.2:LRA=9', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '256k', mp3]);
console.log(`→ ${path.relative(root, mp3)} (${DUR.toFixed(1)}s, ${kickTimes.length} kicks)`);
