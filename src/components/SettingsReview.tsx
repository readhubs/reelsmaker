import React from 'react';
import { VideoProject, ExportSettings } from '../types/project';

interface SettingsReviewProps {
  project: VideoProject;
  onEdit: (section: string) => void;
  onExport: () => void;
  isExporting?: boolean;
}

export const SettingsReview: React.FC<SettingsReviewProps> = ({ project, onEdit, onExport, isExporting }) => {
  const generateExportReport = (): ExportSettings => {
    return {
      theme: project.theme.toUpperCase() as any,
      aspectRatio: project.aspectRatio,
      resolution: project.resolution,
      totalDuration: project.totalDuration,
      scenesCount: project.scenes.length,
      musicFile: typeof project.music.file === 'string' ? project.music.file : (project.music.file as any).name,
      sfxEnabled: project.sfxEnabled,
      colorCodes: {
        primary: project.colorPalette.primary,
        secondary: project.colorPalette.secondary,
        accent: project.colorPalette.accent,
      },
      brandingDetails: {
        logoFile: project.branding.logoUrl,
        brandName: project.branding.brandName,
        slogan: project.branding.slogan,
      },
      sceneDescriptions: project.scenes.map((s, idx) => ({
        sceneNum: idx + 1,
        text: s.text,
        duration: s.duration,
        animation: s.animation,
      })),
    };
  };

  const settings = generateExportReport();
  const resolutionMap: Record<string, string> = {
    '720p': '1280×720px (720p)',
    '1080p': '1920×1080px (1080p)',
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Settings</h2>
      <p className="text-gray-600 mb-6">
        Verify all your video configurations below. Everything is editable—click to modify any section.
      </p>

      <div className="space-y-4">
        {/* Theme & Colors */}
        <div
          className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEdit('theme')}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Theme & Colors</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Theme: {settings.theme}</p>
                <div className="flex gap-2 mt-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: settings.colorCodes.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: settings.colorCodes.secondary }}
                    title="Secondary"
                  />
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: settings.colorCodes.accent }}
                    title="Accent"
                  />
                </div>
              </div>
            </div>
            <button className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition">Edit</button>
          </div>
        </div>

        {/* Video Format */}
        <div
          className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEdit('format')}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Format</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Aspect Ratio: {settings.aspectRatio}</p>
                <p>Resolution: {resolutionMap[settings.resolution]}</p>
                <p>Total Duration: {Math.round(settings.totalDuration)}s</p>
                <p>Scenes: {settings.scenesCount} scenes</p>
              </div>
            </div>
            <button className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition">Edit</button>
          </div>
        </div>

        {/* Audio */}
        <div
          className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEdit('audio')}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Audio Settings</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Music: {settings.musicFile}</p>
                <p>SFX: {settings.sfxEnabled ? 'Enabled' : 'Disabled'}</p>
                <p>Fade-in: {project.music.fadeInDuration}s | Fade-out: {project.music.fadeOutDuration}s</p>
              </div>
            </div>
            <button className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition">Edit</button>
          </div>
        </div>

        {/* Text & Scenes */}
        <div
          className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEdit('text')}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Text Scenes ({settings.scenesCount})</h3>
              <div className="space-y-2 text-sm text-gray-600 max-h-32 overflow-y-auto">
                {settings.sceneDescriptions.slice(0, 5).map((scene) => (
                  <div key={scene.sceneNum} className="text-xs">
                    <p>
                      <span className="font-semibold">Scene {scene.sceneNum}:</span> {scene.text}
                    </p>
                  </div>
                ))}
                {settings.scenesCount > 5 && (
                  <p className="text-xs text-gray-500 italic">+{settings.scenesCount - 5} more scenes...</p>
                )}
              </div>
            </div>
            <button className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition whitespace-nowrap">
              Edit
            </button>
          </div>
        </div>

        {/* Branding */}
        <div
          className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEdit('branding')}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">End Card Branding</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Brand Name: {settings.brandingDetails.brandName}</p>
                <p>Slogan: {settings.brandingDetails.slogan}</p>
                <p>Duration: {project.branding.duration}s</p>
              </div>
            </div>
            <button className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded transition">Edit</button>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg text-white">
        <h3 className="text-lg font-bold mb-2">Ready to Export?</h3>
        <p className="text-sm text-gray-200 mb-4">
          Your video will be rendered at {settings.resolution} resolution with all settings applied.
        </p>

        <button
          onClick={onExport}
          disabled={isExporting}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
            isExporting
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-white text-gray-900 hover:bg-gray-100 hover:shadow-lg'
          }`}
        >
          {isExporting ? 'Exporting... Please Wait' : 'Export Video (MP4)'}
        </button>

        {isExporting && (
          <div className="mt-3 space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-2"></div>
            <p className="text-xs text-gray-300">Rendering frames... This may take a few minutes.</p>
          </div>
        )}
      </div>

      {/* Download report button */}
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            const report = JSON.stringify(settings, null, 2);
            const blob = new Blob([report], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `video-settings-${Date.now()}.json`;
            a.click();
          }}
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          Download Settings Report (JSON)
        </button>
      </div>
    </div>
  );
};
