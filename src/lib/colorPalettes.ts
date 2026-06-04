import { Theme, ColorPalette } from '../types/project';

export const colorPalettes: Record<Theme, ColorPalette> = {
  fomo: {
    primary: '#E63946',
    secondary: '#F1FAEE',
    accent: '#FF9F1C',
    background: 'linear-gradient(135deg, #E63946 0%, #FF9F1C 100%)',
    text: '#FFFFFF',
    gradientStart: '#E63946',
    gradientEnd: '#FF9F1C',
  },
  sales: {
    primary: '#FFB800',
    secondary: '#1E1E1E',
    accent: '#FF6B35',
    background: 'linear-gradient(135deg, #FFB800 0%, #FF6B35 100%)',
    text: '#1E1E1E',
    gradientStart: '#FFB800',
    gradientEnd: '#FF6B35',
  },
  promo: {
    primary: '#0077B6',
    secondary: '#CAF0F8',
    accent: '#00B4D8',
    background: 'linear-gradient(135deg, #0077B6 0%, #00B4D8 100%)',
    text: '#FFFFFF',
    gradientStart: '#0077B6',
    gradientEnd: '#00B4D8',
  },
  service: {
    primary: '#2D6A4F',
    secondary: '#D8F3DC',
    accent: '#52B788',
    background: 'linear-gradient(135deg, #2D6A4F 0%, #52B788 100%)',
    text: '#FFFFFF',
    gradientStart: '#2D6A4F',
    gradientEnd: '#52B788',
  },
  social: {
    primary: '#6A4C93',
    secondary: '#F0E3FF',
    accent: '#9D84B7',
    background: 'linear-gradient(135deg, #6A4C93 0%, #9D84B7 100%)',
    text: '#FFFFFF',
    gradientStart: '#6A4C93',
    gradientEnd: '#9D84B7',
  },
};

export const getThemePalette = (theme: Theme): ColorPalette => {
  return colorPalettes[theme];
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${[r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }).join('')}`.toUpperCase();
};

export const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

  return rgbToHex(r, g, b);
};
