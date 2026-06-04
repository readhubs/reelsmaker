import { create } from 'zustand';
import { VideoProject, Theme, AspectRatio, Resolution, Scene, BrandingCard, AudioTrack, ColorPalette } from '../types/project';
import { colorPalettes } from './colorPalettes';
import { generateSceneTexts } from './contentLibrary';

interface ProjectState {
  project: VideoProject | null;
  initializeProject: (theme: Theme) => void;
  updateTheme: (theme: Theme) => void;
  setAspectRatio: (ratio: AspectRatio) => void;
  setResolution: (resolution: Resolution) => void;
  setMusic: (music: AudioTrack) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  updateBranding: (branding: Partial<BrandingCard>) => void;
  setTotalDuration: (duration: number) => void;
  generateScenes: (duration: number) => void;
  updateColorPalette: (palette: Partial<ColorPalette>) => void;
  setSfxEnabled: (enabled: boolean) => void;
  getSceneTexts: () => string[];
  saveProject: () => void;
  loadProject: (project: VideoProject) => void;
}

const DEFAULT_BRANDING: BrandingCard = {
  logoUrl: '/assets/logos/logo.jpg',
  brandName: 'PortfolioHubs',
  slogan: 'الاسنانجى لازم يتدلع',
  duration: 3,
  animationType: 'fadeIn',
};

const DEFAULT_MUSIC: AudioTrack = {
  file: '/assets/music/default-track.mp3',
  duration: 20,
  fadeInDuration: 0.5,
  fadeOutDuration: 0.5,
};

const createInitialProject = (theme: Theme): VideoProject => {
  const aspectRatio: AspectRatio = '9:16';
  const totalDuration = 20;
  const sceneCount = Math.ceil((totalDuration - 3) / 1.5);
  const sceneTexts = generateSceneTexts(theme, sceneCount);

  const scenes: Scene[] = sceneTexts.map((text, index) => ({
    id: `scene-${index}`,
    duration: 1.5,
    text,
    textSize: 48,
    animation: [
      'fadeInSlideOut',
      'morphIn',
      'waveIn',
      'zoomInZoomOut',
      'bounceIn',
      'flipIn',
      'particleBurst',
      'glitchIn',
    ][index % 8] as any,
    transitionEffect: {
      type: 'fade',
      duration: 300,
    },
    textColor: '#FFFFFF',
  }));

  const palette = colorPalettes[theme];

  return {
    id: `project-${Date.now()}`,
    theme,
    aspectRatio,
    resolution: '720p',
    totalDuration,
    scenes,
    music: DEFAULT_MUSIC,
    sfxEnabled: true,
    branding: DEFAULT_BRANDING,
    colorPalette: palette,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  project: null,

  initializeProject: (theme: Theme) => {
    set({
      project: createInitialProject(theme),
    });
  },

  updateTheme: (theme: Theme) => {
    set((state) => {
      if (!state.project) return state;
      const newProject = {
        ...state.project,
        theme,
        colorPalette: colorPalettes[theme],
      };
      return { project: newProject };
    });
  },

  setAspectRatio: (ratio: AspectRatio) => {
    set((state) => {
      if (!state.project) return state;
      return { project: { ...state.project, aspectRatio: ratio } };
    });
  },

  setResolution: (resolution: Resolution) => {
    set((state) => {
      if (!state.project) return state;
      return { project: { ...state.project, resolution } };
    });
  },

  setMusic: (music: AudioTrack) => {
    set((state) => {
      if (!state.project) return state;
      return { project: { ...state.project, music } };
    });
  },

  updateScene: (sceneId: string, updates: Partial<Scene>) => {
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          scenes: state.project.scenes.map((s) =>
            s.id === sceneId ? { ...s, ...updates } : s
          ),
          updatedAt: Date.now(),
        },
      };
    });
  },

  updateBranding: (branding: Partial<BrandingCard>) => {
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          branding: { ...state.project.branding, ...branding },
          updatedAt: Date.now(),
        },
      };
    });
  },

  setTotalDuration: (duration: number) => {
    set((state) => {
      if (!state.project) return state;
      return { project: { ...state.project, totalDuration: duration } };
    });
  },

  generateScenes: (duration: number) => {
    set((state) => {
      if (!state.project) return state;
      const theme = state.project.theme;
      const sceneCount = Math.ceil((duration - 3) / 1.5);
      const sceneTexts = generateSceneTexts(theme, sceneCount);

      const scenes: Scene[] = sceneTexts.map((text, index) => ({
        id: `scene-${index}`,
        duration: 1.5,
        text,
        textSize: 48,
        animation: [
          'fadeInSlideOut',
          'morphIn',
          'waveIn',
          'zoomInZoomOut',
          'bounceIn',
          'flipIn',
          'particleBurst',
          'glitchIn',
        ][index % 8] as any,
        transitionEffect: {
          type: 'fade',
          duration: 300,
        },
        textColor: '#FFFFFF',
      }));

      return {
        project: {
          ...state.project,
          scenes,
          totalDuration: duration,
          updatedAt: Date.now(),
        },
      };
    });
  },

  updateColorPalette: (palette: Partial<ColorPalette>) => {
    set((state) => {
      if (!state.project) return state;
      return {
        project: {
          ...state.project,
          colorPalette: { ...state.project.colorPalette, ...palette },
          updatedAt: Date.now(),
        },
      };
    });
  },

  setSfxEnabled: (enabled: boolean) => {
    set((state) => {
      if (!state.project) return state;
      return { project: { ...state.project, sfxEnabled: enabled } };
    });
  },

  getSceneTexts: () => {
    const state = get();
    return state.project?.scenes.map((s) => s.text) || [];
  },

  saveProject: () => {
    const state = get();
    if (state.project) {
      localStorage.setItem(
        `project-${state.project.id}`,
        JSON.stringify(state.project)
      );
    }
  },

  loadProject: (project: VideoProject) => {
    set({ project });
  },
}));
