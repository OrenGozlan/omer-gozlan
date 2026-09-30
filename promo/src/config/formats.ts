export type FormatKey = '16x9' | '9x16';

export type Format = {
  key: FormatKey;
  width: number;
  height: number;
  vertical: boolean;
  /** Title-safe insets. Vertical keeps clear of Reels/TikTok/Shorts UI. */
  safe: { top: number; right: number; bottom: number; left: number };
};

export const FORMATS: Record<FormatKey, Format> = {
  '16x9': {
    key: '16x9',
    width: 1920,
    height: 1080,
    vertical: false,
    safe: { top: 96, right: 120, bottom: 96, left: 120 },
  },
  '9x16': {
    key: '9x16',
    width: 1080,
    height: 1920,
    vertical: true,
    // top: status bar + account row; bottom: caption, CTA and nav; right: action rail
    safe: { top: 240, right: 130, bottom: 420, left: 90 },
  },
};
