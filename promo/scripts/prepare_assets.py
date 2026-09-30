"""
One-off asset prep for the promo. Re-run only when changing photo picks.

Requires: pip install "rembg[cpu]" opencv-python-headless pillow numpy
Usage (from /promo):  python scripts/prepare_assets.py

Outputs into promo/public/:
  photos/<slot>.jpg            downscaled copies of site photos (max 2600px)
  photos/<slot>-cutout.png     athlete matte (rembg, local model, no upload)
  photos/<slot>-plate.jpg      clean plate: athlete inpainted out, for parallax
  fx/grain.png                 tileable film/sand grain
  fx/sand.jpg                  procedural sand surface for the hook scene
"""
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT.parent / "public" / "photos"
PHOTOS = ROOT / "public" / "photos"
FX = ROOT / "public" / "fx"

# slot name -> source photo on the site
PICKS = {
    "name-wide": "mevza-u20-portrait.jpg",
    "name-tall": "VIK_0475.jpg",
    "cred-dig": "VIK_0434.jpg",
    "cred-set": "mevza-u20-set.jpg",
    "cred-focus": "u22-madrid-focus.jpg",
    "cta-highfive": "VIK_0504.jpg",
    # montage
    "m-slices": "u22-madrid-spike.jpg",
    "m-zoom": "VIK_8968.JPG",
    "m-mask": "isr-adults-block.jpg",
    "m-grid-center": "mevza-u20-dive.jpg",
    "m-grid-1": "VIK_0507.jpg",
    "m-grid-2": "u22-madrid-block.jpg",
    "m-grid-3": "mevza-u20-podium.jpg",
    "m-grid-4": "isr-adults-medal-ceremony.jpg",
    "m-grid-5": "VIK_1692.jpg",
    "m-grid-6": "isr-adults-night-spike.jpg",
    "m-grid-7": "u20-euro-jersey.jpg",
    "m-grid-8": "u22-madrid-portrait.jpg",
    # stats / testimonial / next
    "stats-ceremony": "VIK_1692.jpg",
    "quote-block": "u22-madrid-block.jpg",
    "next-night": "isr-adults-night-spike.jpg",
    # season route cards (event photos)
    "card-cyprus": "VIK_0507.jpg",
    "card-hungary": "VIK_8913.JPG",
    "card-limassol": "mevza-u20-podium.jpg",
    "card-remerschen": "lux-zonal-portrait.jpg",
    "card-battipaglia": "u20-euro-jersey.jpg",
    "card-madrid": "u22-madrid-portrait.jpg",
    "card-home": "isr-adults-trophy.jpg",
    # why-partner tiles
    "v-rising": "defensive-play.jpg",
    "v-audience": "victory-moment.jpg",
    "v-exposure": "european-championship.jpg",
    "v-content": "precision-pass.jpg",
    "v-story": "championship-focus.jpg",
    "v-longterm": "team-partnership.jpg",
}
CUTOUTS = ["name-wide", "name-tall"]


def copy_photos() -> None:
    PHOTOS.mkdir(parents=True, exist_ok=True)
    for slot, src in PICKS.items():
        im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
        im.thumbnail((2600, 2600), Image.LANCZOS)
        im.save(PHOTOS / f"{slot}.jpg", quality=90)
        print(f"{slot}.jpg {im.size}")


def cutouts() -> None:
    from rembg import new_session, remove

    session = new_session("isnet-general-use")
    for slot in CUTOUTS:
        out = remove(Image.open(PHOTOS / f"{slot}.jpg"), session=session, post_process_mask=True)
        out.save(PHOTOS / f"{slot}-cutout.png")
        print(f"{slot}-cutout.png")


def clean_plates() -> None:
    for slot in CUTOUTS:
        img = cv2.imread(str(PHOTOS / f"{slot}.jpg"))
        alpha = np.array(Image.open(PHOTOS / f"{slot}-cutout.png"))[:, :, 3]
        mask = cv2.dilate((alpha > 8).astype(np.uint8) * 255, np.ones((41, 41), np.uint8))
        # inpaint at quarter res (fast, and the plate is blurred anyway)
        small = cv2.resize(img, None, fx=0.25, fy=0.25)
        small_mask = cv2.resize(mask, None, fx=0.25, fy=0.25, interpolation=cv2.INTER_NEAREST)
        filled = cv2.inpaint(small, small_mask, 15, cv2.INPAINT_TELEA)
        filled = cv2.GaussianBlur(cv2.resize(filled, (img.shape[1], img.shape[0])), (0, 0), 18)
        m = cv2.GaussianBlur(mask, (0, 0), 12).astype(np.float32)[:, :, None] / 255
        plate = (img * (1 - m) + filled * m).astype(np.uint8)
        cv2.imwrite(str(PHOTOS / f"{slot}-plate.jpg"), plate, [cv2.IMWRITE_JPEG_QUALITY, 88])
        print(f"{slot}-plate.jpg")


def textures() -> None:
    FX.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(7)

    grain = rng.normal(128, 40, (512, 512)).clip(0, 255).astype(np.uint8)
    Image.fromarray(grain, "L").save(FX / "grain.png")

    n_px = 2400

    def octave(cell: int) -> np.ndarray:
        s = rng.random((n_px // cell + 2, n_px // cell + 2)).astype(np.float32)
        return cv2.resize(s, (n_px, n_px), interpolation=cv2.INTER_CUBIC)

    noise = 0.22 * octave(220) + 0.2 * octave(40) + 0.28 * octave(5) + 0.3 * rng.random((n_px, n_px)).astype(np.float32)
    yy, xx = np.mgrid[0:n_px, 0:n_px].astype(np.float32)
    ripples = 0.5 + 0.5 * np.sin((xx * 0.8 + yy * 0.35) / 38 + octave(300) * 6)
    noise = 0.72 * noise + 0.28 * ripples
    noise = (noise - noise.min()) / (noise.max() - noise.min())

    base = np.array([214, 176, 120], np.float32)
    hi = np.array([246, 221, 170], np.float32)
    lo = np.array([150, 112, 68], np.float32)
    t = noise[:, :, None]
    col = np.where(t > 0.5, base + (hi - base) * ((t - 0.5) * 2), lo + (base - lo) * (t * 2))
    speck = rng.random((n_px, n_px))
    col[speck > 0.997] = [255, 245, 225]
    col[speck < 0.003] = [90, 64, 38]
    Image.fromarray(col.clip(0, 255).astype(np.uint8)).save(FX / "sand.jpg", quality=88)
    print("fx/grain.png fx/sand.jpg")


if __name__ == "__main__":
    copy_photos()
    cutouts()
    clean_plates()
    textures()
