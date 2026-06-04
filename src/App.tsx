import React, { useState, useEffect } from 'react';
import { Theme } from './types/project';
import { useProjectStore } from './lib/projectStore';
import { videoExporter } from './lib/videoExporter';
import { ThemeSelector } from './components/ThemeSelector';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { MusicUploader } from './components/MusicUploader';
import { TextEditor } from './components/TextEditor';
import { BrandingEditor } from './components/BrandingEditor';
import { SettingsReview } from './components/SettingsReview';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Step = 'welcome' | 'theme' | 'format' | 'audio' | 'text' | 'branding' | 'review' | 'exporting';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const {
    project,
    initializeProject,
    setAspectRatio,
    setMusic,
    updateScene,
    updateBranding,
  } = useProjectStore();

  const steps: Array<{ id: Step; name: string; title: string }> = [
    { id: 'theme', name: 'Theme', title: 'Choose Theme' },
    { id: 'format', name: 'Format', title: 'Video Format' },
    { id: 'audio', name: 'Audio', title: 'Music & SFX' },
    { id: 'text', name: 'Text', title: 'Scene Text' },
    { id: 'branding', name: 'Branding', title: 'End Card' },
    { id: 'review', name: 'Review', title: 'Settings Review' },
  ];

  const handleThemeSelect = (theme: Theme) => {
    initializeProject(theme);
    setCurrentStep('format');
  };

  const handleExport = async () => {
    if (!project) return;

    setIsExporting(true);
    setCurrentStep('exporting');
    setExportProgress(0);

    try {
      const videoBlob = await videoExporter.exportVideo(project, (progress) => {
        setExportProgress(Math.round(progress * 100));
      });

      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reel-${Date.now()}.mp4`;
      a.click();
      URL.revokeObjectURL(url);

      setCurrentStep('welcome');
      setIsExporting(false);
      alert('Video exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
      setCurrentStep('review');
    }
  };

  const getCurrentStepIndex = () => steps.findIndex((s) => s.id === currentStep);
  const canGoNext = project && currentStep !== 'review';
  const canGoPrev = currentStep !== 'welcome' && currentStep !== 'exporting';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">Video Reel Maker</h1>
              <p className="text-sm text-gray-600 mt-1">Create professional Instagram & TikTok reels in minutes</p>
            </div>
            {project && (
              <div className="text-right">
                <p className="text-xs text-gray-600">Theme: <span className="font-bold text-gray-900 uppercase">{project.theme}</span></p>
                <p className="text-xs text-gray-600">Duration: <span className="font-bold text-gray-900">{Math.round(project.totalDuration)}s</span></p>
              </div>
            )}
          </div>

          {currentStep !== 'welcome' && currentStep !== 'exporting' && (
            <div className="space-y-2">
              <div className="flex gap-2 justify-between">
                {steps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    disabled={!project || idx > getCurrentStepIndex()}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      idx <= getCurrentStepIndex()
                        ? 'bg-gray-900'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-600 flex justify-between">
                <span>Step {getCurrentStepIndex() + 1} of {steps.length}</span>
                <span className="font-semibold text-gray-900">{steps[getCurrentStepIndex()]?.name}</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {currentStep === 'welcome' && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Create Your First Reel</h1>
            <p className="text-lg text-gray-600 mb-8">
              Design stunning video reels with automatic text generation, professional animations, and branded end cards—all without coding.
            </p>
            <button
              onClick={() => {
                initializeProject('sales');
                setCurrentStep('theme');
              }}
              className="bg-gray-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all hover:shadow-lg"
            >
              Get Started
            </button>
          </div>
        )}

        {currentStep === 'theme' && <ThemeSelector onSelect={handleThemeSelect} selectedTheme={project?.theme} />}

        {currentStep === 'format' && project && (
          <AspectRatioSelector
            onSelect={setAspectRatio}
            selectedRatio={project.aspectRatio}
          />
        )}

        {currentStep === 'audio' && project && (
          <MusicUploader onMusicSelected={setMusic} currentMusic={project.music} />
        )}

        {currentStep === 'text' && project && (
          <TextEditor
            scenes={project.scenes}
            onSceneUpdate={(sceneId, text) => updateScene(sceneId, { text })}
          />
        )}

        {currentStep === 'branding' && project && (
          <BrandingEditor branding={project.branding} onUpdate={updateBranding} />
        )}

        {currentStep === 'review' && project && (
          <SettingsReview
            project={project}
            onEdit={(section) => {
              if (section === 'theme') setCurrentStep('theme');
              else if (section === 'format') setCurrentStep('format');
              else if (section === 'audio') setCurrentStep('audio');
              else if (section === 'text') setCurrentStep('text');
              else if (section === 'branding') setCurrentStep('branding');
            }}
            onExport={handleExport}
            isExporting={isExporting}
          />
        )}

        {currentStep === 'exporting' && (
          <div className="max-w-2xl mx-auto py-12">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="mb-6">
                <div className="inline-block">
                  <svg className="w-16 h-16 text-gray-900 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Creating Your Video</h2>
              <p className="text-gray-600 mb-6">This usually takes 2–5 minutes depending on your device...</p>

              <div className="space-y-2 mb-6">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gray-900 h-full transition-all duration-300"
                    style={{ width: `${exportProgress}%` }}
                  />
                </div>
                <p className="text-lg font-bold text-gray-900">{exportProgress}%</p>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>Rendering frames...</p>
                <p>Encoding MP4...</p>
                <p>Download will start automatically</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {currentStep !== 'welcome' && currentStep !== 'exporting' && (
        <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
            <button
              onClick={() => {
                const currentIdx = getCurrentStepIndex();
                if (currentIdx > 0) {
                  setCurrentStep(steps[currentIdx - 1].id);
                } else {
                  setCurrentStep('welcome');
                }
              }}
              disabled={!canGoPrev}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-100 text-gray-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex gap-2">
              {currentStep !== 'review' && (
                <button
                  onClick={() => {
                    const currentIdx = getCurrentStepIndex();
                    if (currentIdx < steps.length - 1) {
                      setCurrentStep(steps[currentIdx + 1].id);
                    }
                  }}
                  disabled={!canGoNext}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-900 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
