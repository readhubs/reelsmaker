export type Theme = 'fomo' | 'sales' | 'promo' | 'service' | 'social';
export type AspectRatio = '9:16' | '1:1';
export type Resolution = '720p' | '1080p';
export type AnimationType =
  | 'fadeInSlideOut'
  | 'zoomInZoomOut'
  | 'rotateIn'
  | 'bounceIn'
  | 'morphIn'
  | 'waveIn'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'flipIn'
  | 'particleBurst'
  | 'glitchIn';

export interface Scene {
  id: string;
  duration: number; // in seconds (1-1.5)
  text: string;
  textSize: number;
  animation: AnimationType;
  transitionEffect: TransitionEffect;
  backgroundColor?: string;
  textColor: string;
}

export interface TransitionEffect {
  type: 'fade' | 'wipe' | 'zoom' | 'slide' | 'rotate' | 'morphWarp';
  duration: number; // in ms
  direction?: 'left' | 'right' | 'up' | 'down';
}

export interface BrandingCard {
  logoUrl: string;
  brandName: string;
  slogan: string;
  duration: number; // in seconds
  animationType: 'fadeIn' | 'slideUp' | 'scaleIn';
}

export interface AudioTrack {
  file: File | string; // File object or path
  duration: number;
  fadeInDuration: number; // 0.5s default
  fadeOutDuration: number; // 0.5s default
}

export interface VideoProject {
  id: string;
  theme: Theme;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  totalDuration: number; // final video duration
  scenes: Scene[];
  music: AudioTrack;
  sfxEnabled: boolean;
  branding: BrandingCard;
  colorPalette: ColorPalette;
  createdAt: number;
  updatedAt: number;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  gradientStart: string;
  gradientEnd: string;
}

export interface ExportSettings {
  theme: Theme;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  totalDuration: number;
  scenesCount: number;
  musicFile: string;
  sfxEnabled: boolean;
  colorCodes: {
    primary: string;
    secondary: string;
    accent: string;
  };
  brandingDetails: {
    logoFile: string;
    brandName: string;
    slogan: string;
  };
  sceneDescriptions: Array<{
    sceneNum: number;
    text: string;
    duration: number;
    animation: string;
  }>;
}
