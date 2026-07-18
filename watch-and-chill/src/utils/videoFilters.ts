export type VideoFilter = {
  id: string;
  label: string;
  // Valid as both a CSS `filter` value and a Canvas2D `ctx.filter` value.
  css: string;
};

export const VIDEO_FILTERS: VideoFilter[] = [
  { id: 'normal', label: 'Normalny', css: 'none' },
  { id: 'vivid', label: 'Żywe', css: 'saturate(1.6) contrast(1.1)' },
  { id: 'bw', label: 'Czarno-białe', css: 'grayscale(1)' },
  { id: 'warm', label: 'Ciepłe', css: 'sepia(0.35) saturate(1.3) brightness(1.05)' },
  { id: 'cool', label: 'Chłodne', css: 'saturate(1.15) hue-rotate(-12deg) brightness(1.05)' },
  { id: 'vintage', label: 'Vintage', css: 'sepia(0.4) contrast(0.9) brightness(0.95) saturate(0.75)' },
  { id: 'contrast', label: 'Kontrast', css: 'contrast(1.4) saturate(1.15)' },
  { id: 'fade', label: 'Blady', css: 'contrast(0.85) brightness(1.1) saturate(0.7)' },
];
