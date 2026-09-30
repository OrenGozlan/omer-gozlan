// AI clips for the promo via Higgsfield / Seedance 2.5 image-to-video. Every clip starts
// from a real photo so the athlete and venue are Omer's own, not an AI stand-in.
//
//   bullet — night court (Omer #1 at the net, partner setting): approach, take-off,
//            bullet-time freeze with a 180° orbit, spike straight into the lens
//   after  — start on burst frame 5 (arm cocked) → the hit, follow-through and landing
//   before — start on burst frame 1, generate the landing/walk-back, then reverse it
//
// Usage (credentials are read from .env.local at runtime, never printed):
//   npm run hf -- bullet|after|before [more…] [--duration=N] [--resolution=720p]
// Output: out/ai/<clip>.mp4 (+ <clip>.json with request id / status / URL)
//
// This makes billable generation requests.
import { createHiggsfieldClient } from '@higgsfield/client/v2';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'out', 'ai');
mkdirSync(outDir, { recursive: true });

const credentials = process.env.HF_CREDENTIALS;
if (!credentials || credentials.split(':').length !== 2) {
  console.error('HF_CREDENTIALS missing or not in key-id:key-secret form. Put it in promo/.env.local.');
  process.exit(1);
}

const API = 'https://api.higgsfield.ai';
const MODEL = 'bytedance/seedance-2.5/image-to-video';

const client = createHiggsfieldClient({ credentials, pollInterval: 5000, maxPollTime: 15 * 60 * 1000 });

/** documented upload flow: get a signed URL, PUT the bytes, use the public URL as image_url */
const upload = async (file: string): Promise<string> => {
  const res = await fetch(`${API}/files/generate-upload-url`, {
    method: 'POST',
    headers: { Authorization: `Key ${credentials}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_type: 'image/jpeg' }),
  });
  if (!res.ok) throw new Error(`generate-upload-url failed: HTTP ${res.status}`);
  const { upload_url, public_url, upload_headers } = (await res.json()) as { upload_url: string; public_url: string; upload_headers?: Record<string, string> };
  const put = await fetch(upload_url, { method: 'PUT', headers: upload_headers ?? { 'Content-Type': 'image/jpeg' }, body: readFileSync(file) });
  if (!put.ok) throw new Error(`upload PUT failed: HTTP ${put.status}`);
  return public_url;
};

const SCENE =
  'Night beach volleyball on a sand court under bright stadium floodlights, city buildings behind, sand dust in the air. Static camera, same framing and lens as the photo, the same player in a white sleeveless jersey number 1 and black shorts. Photorealistic, natural athletic motion, cinematic sports photography, no text.';

type Clip = { frame: string; prompt: string; reverse: boolean; duration: number; resolution: '480p' | '720p' | '1080p' };

const CLIPS: Record<string, Clip> = {
  bullet: {
    frame: 'night-court-omer.jpg', // portrait crop with Omer alone — with the partner in frame the model picks him as the hitter
    duration: 10,
    resolution: '720p', // long prompt + >5s fails at 1080p; 720p with the condensed prompt below
    reverse: false,
    // user's bullet-time brief, condensed (the full 1.4k-char text fails for >5s clips)
    prompt:
      'The player in the photo (curly hair, white #1 jersey, black shorts) is the hitter and the only athlete who jumps; an off-screen teammate sets the ball high for him. Keep his face and hair exactly as in the photo. ' +
      'One continuous cinematic shot, night beach volleyball under stadium floodlights. #1 takes a fast three-step approach, plants hard and explodes upward, sand spraying off his feet; the camera tracks low from behind and tilts up with his leap, hitting arm cocked, other hand reaching toward the blue, yellow and white ball above the net. ' +
      'At the peak time freezes completely: player, ball, sand and dust suspended in the floodlight glow while the camera orbits 180 degrees to the opposite side of the net, ending with the ball centered and his face and raised arm behind it. ' +
      'Time snaps back: he smashes the ball straight at the camera; it rockets into the lens, spinning, until it slams into the camera, the frame shakes and cuts to black. ' +
      'Bullet time, warm rim light, dark sky, shallow depth of field, motion blur on the spike.',
  },
  after: {
    frame: 'night-5.jpg',
    prompt: `${SCENE} The player at the peak of his jump serve swings his right arm forward and strikes the ball hard toward the net; the ball flies away out of frame. He follows through and lands in the sand with a spray of sand.`,
    reverse: false,
    duration: 5,
    resolution: '720p',
  },
  before: {
    frame: 'night-1.jpg',
    prompt: `${SCENE} The player in mid-air, arm raised by the ball, catches the ball in his right hand as he comes down, lands softly in the sand, then walks slowly backward away from the net toward the baseline.`,
    reverse: true,
    duration: 5,
    resolution: '720p',
  },
};

const run = async (name: string) => {
  const clip = CLIPS[name];
  const image_url = await upload(path.join(root, 'public', 'photos', clip.frame));
  console.log(`[${name}] uploaded ${clip.frame}, generating…`);
  const result = await client.subscribe(MODEL, {
    input: { image_url, prompt: clip.prompt, duration: clip.duration, resolution: clip.resolution, generate_audio: false },
  });
  const status = result.status as string;
  writeFileSync(path.join(outDir, `${name}.json`), JSON.stringify({ request_id: result.request_id, status, video: result.video?.url ?? null }, null, 2));
  if (status !== 'completed' || !result.video?.url) {
    // failed, nsfw (moderated) or canceled — never report these as success
    throw new Error(`[${name}] request ${result.request_id} ended with status "${status}"${result.video?.url ? '' : ', no video returned'}`);
  }
  const raw = path.join(outDir, `${name}-raw.mp4`);
  const video = await fetch(result.video.url);
  if (!video.ok) throw new Error(`[${name}] download failed: HTTP ${video.status}`);
  writeFileSync(raw, Buffer.from(await video.arrayBuffer()));
  const final = path.join(outDir, `${name}.mp4`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', raw, ...(clip.reverse ? ['-vf', 'reverse'] : []), '-an', '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', final]);
  console.log(`[${name}] completed → ${path.relative(root, final)}\n  video URL: ${result.video.url}`);
};

const flags = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=') as [string, string]));
const names = process.argv.slice(2).filter((a) => !a.startsWith('--'));
for (const n of names) {
  if (!CLIPS[n]) continue;
  if (flags.duration) CLIPS[n].duration = Number(flags.duration);
  if (flags.resolution) CLIPS[n].resolution = flags.resolution as Clip['resolution'];
}
const unknown = names.filter((n) => !CLIPS[n]);
if (!names.length || unknown.length) {
  console.error(`usage: npm run hf -- <${Object.keys(CLIPS).join('|')}> …${unknown.length ? `  (unknown: ${unknown.join(', ')})` : ''}`);
  process.exit(1);
}
const results = await Promise.allSettled(names.map(run));
let failed = 0;
for (const r of results) {
  if (r.status === 'rejected') {
    failed++;
    console.error(String(r.reason instanceof Error ? r.reason.message : r.reason));
  }
}
process.exit(failed ? 1 : 0);
