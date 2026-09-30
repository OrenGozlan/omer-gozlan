# Omer Gozlan — 55s sponsorship promo (Remotion)

Motion-graphics promo built from the site's own copy, palette, fonts and photos.
Standalone for now (not embedded in the site).

```bash
cd promo
npm install
npm run preview        # Remotion Studio
npm run render:all     # H.264 MP4s + PNG posters → out/
npm run render:16x9    # or just one format
npm run render:9x16
npm run frames -- 9x16 150,320,590   # quick review stills → out/frames/
npm run typecheck
```

Node ≥ 22.6 (render scripts are `.ts` run with Node's built-in type stripping).

## Compositions

| ID | Size | Output |
|---|---|---|
| `Promo-EN-16x9` | 1920×1080 | `out/promo-en-16x9.mp4`, `out/poster-en-16x9.png` |
| `Promo-EN-9x16` | 1080×1920 | `out/promo-en-9x16.mp4`, `out/poster-en-9x16.png` |

Both use the same `<Promo lang format>` component (`src/Promo.tsx`); every scene reads
format + copy from context, so there are no per-format scene copies. Adding a language =
add a `COPY.<lang>` entry and the lang to `LANGS` in `src/Root.tsx`.

The 9:16 layout keeps titles inside a social-safe box (240 top / 420 bottom / 90 left / 130 right),
see `src/config/formats.ts`.

## Storyboard (30 fps, 1665 frames = 55.5s, 120 BPM grid = 15 frames/beat)

| # | Scene | Seconds | Content |
|---|---|---|---|
| 1 | Hook | 0–2.5 | black → sun flare → ball hits sand (shockwave, dust) → **ISRAEL'S #1** slam |
| 2 | Name | 2.5–6 | **OMER GOZLAN** letter stagger; 3-plane parallax (clean plate / athlete cutout / type) |
| 3 | Montage | 6–15 | hero subline "Rising Star of Israeli Beach Volleyball", one photo effect per chunk: staggered strips → zoom-through + flare → word-as-window text mask + iris → 3×3 mosaic flip, centre tile takes over |
| 4 | Credentials | 15–19 | slot-reel badges **#1 U18**, **#1 U20**, then both + "Israel U18 & U20 Rank" |
| 5 | Stats | 19–22.5 | counters: 11 podiums 2024-26 · 7× international medalist · 3× national champion |
| 6 | 2026 medals route | 22.5–35.5 | tilted dot-map; flight from Israel through all 8 international stops in date order; per-stop card with event photo; medal coins drop + spin onto podium stops; live podium tally; home leg to Israel with the 4 domestic medals; pull-back with 4 gold · 2 silver · 1 bronze and the site's summary line |
| 7 | Testimonial | 35.5–40.5 | Wingate director quote, lit word by word |
| 8 | What's Next | 40.5–45.5 | 2027 targets from the site, cards fly in from depth |
| 9 | Why partner | 45.5–50.5 | the six sponsor value props as photo tiles |
| 10 | CTA | 50.5–55.5 | "Partnership inquiries open", URL + email + IG, OG lockup, 1s static hold |

A volleyball arc crosses every scene cut (`src/components/BallArc.tsx`).

## Retiming

Everything lives in **`src/config/timing.ts`**:
- `SCENE_DURATIONS` — change a scene length; later scenes shift automatically.
- `CUES` — in-scene beats (impact, slam, badge beats, map hit spacing, CTA hold…).
- `POSTER_FRAME` — which frame the poster is taken from (default: name scene, beat 5).

## Copy sources (nothing invented)

All strings are in `src/config/copy.ts`, each with its source:
- Hook "Israel's #1", CTA "Partnership inquiries open" — `index.html` meta description / og:description
- Name, subline — `i18n.en.hero.name`, `<title>`
- Credentials — `i18n.en.stats[1]` ("#1 · Israel U18 & U20 Rank")
- Season stops + results — `i18n.en.record.s2026`, ordered by date from the Wingate Pulse API;
  summary line from `i18n.en.record.progression`
- Montage — `i18n.en.hero.sub`
- Stats — `i18n.en.stats[2]`, `i18n.en.hero.badges`
- Medals route — international stops + domestic results from `i18n.en.record.s2026`; the domestic
  results have no exact dates on the site, so they're shown together on the home leg at the end
- Testimonial — `i18n.en.testimonial`; What's Next — `i18n.en.targets` (5 of the 8 items);
  Why partner — `i18n.en.sponsor.items`
- Contact — `src/App.jsx` (`EMAIL`, `IG_OMER`) + site URL

Scene 4 deliberately does **not** use the `og:description` list (CEV Bulgaria, Volleyball World
England, U18/U20 Worlds) — those events are not in the 2026 record.

Spelling note: record uses "Remerchen", gallery uses "Remerschen" — the promo uses **Remerschen**
(correct spelling). Consider fixing `i18n.js` to match.

## Music

`public/music.mp3` is an **original track generated in code** by `scripts/make-music.ts`
(`npm run music`, ~4s): 120 BPM future-house in Ab (Fm7 – Dbmaj7 – Ab – Eb), synthesised from
scratch — supersaw chords, plucked arp with ping-pong delay, house bassline, sidechained to the
kick, reverb, −14 LUFS. No samples or licensed material, so it's safe for social posting.

Sections follow the scenes (from `timing.ts`): riser + impact + slam in the hook, filtered intro
under the name, drops on montage / medals route / why-partner, groove under credentials, snare-roll
builds with risers into the medals route and into why-partner, breakdown under the testimonial,
outro under the CTA. Sound effects are locked to on-screen events: a whoosh panned with every
ball-arc cut, reel clicks on the #1 badges, a tick per counted number on the stats, a ding on every
map stop, a coin chime on every medal, ticks on the mosaic and value tiles, a hit on the lockup.

Retime the video → `npm run music` → re-render; it stays in sync. To use a licensed track
instead, overwrite `public/music.mp3` (fades are applied by `<MusicTrack/>`).

## Assets

`public/photos/*` are downscaled copies of site photos (`../public/photos`). Athlete cutouts
and clean plates are generated locally (rembg, no uploads) by `scripts/prepare_assets.py`,
textures (`fx/grain.png`, `fx/sand.jpg`) procedurally by the same script. Map dots are
precomputed by `npm run build:map` → `src/data/world-dots.json`.

Photo slots → site photos are listed in `PICKS` in `scripts/prepare_assets.py` (name, montage,
stats, testimonial, next, route cards, value tiles). Portorož and Pingtan have no photo on the
site, so their route cards use a typographic plate. Luxembourg shots carry a watermark banner at
the bottom — the Remerschen card crops to the top of the frame.

## Open items

- Photo rights: several shots are event/pro photographer images — confirm usage rights before
  wide paid distribution (see outreach open decisions).
- Hebrew version: not built (EN only by request). Needs HE copy for hook + logo slot.
