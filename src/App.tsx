import React, { useState } from 'react';

type Step = 'welcome' | 'theme' | 'format' | 'audio' | 'text' | 'branding' | 'review' | 'exporting';
type Theme = 'fomo' | 'sales' | 'promo' | 'service' | 'social';
type AspectRatio = '9:16' | '1:1';

interface Scene {
  id: string;
  text: string;
  animation: string;
}

interface Project {
  theme: Theme;
  aspectRatio: AspectRatio;
  scenes: Scene[];
  brandName: string;
  slogan: string;
  musicFile: string;
  sfxEnabled: boolean;
}

const THEMES: Record<Theme, { label: string; desc: string; bg: string; color: string }> = {
  fomo:    { label: 'FOMO',         desc: 'Urgency & Scarcity',       bg: 'linear-gradient(135deg,#E63946,#FF9F1C)', color: '#fff' },
  sales:   { label: 'SALES',        desc: 'High-Value Offers',         bg: 'linear-gradient(135deg,#FFB800,#FF6B35)', color: '#1e1e1e' },
  promo:   { label: 'PROMO',        desc: 'Launch & Features',         bg: 'linear-gradient(135deg,#0077B6,#00B4D8)', color: '#fff' },
  service: { label: 'SERVICE',      desc: 'Product Superiority',       bg: 'linear-gradient(135deg,#2D6A4F,#52B788)', color: '#fff' },
  social:  { label: 'SOCIAL PROOF', desc: 'Credibility & Momentum',    bg: 'linear-gradient(135deg,#1a6b8a,#2196b0)', color: '#fff' },
};

const TEXTS: Record<Theme, string[]> = {
  fomo:    ['زمايلك بيطيروا في الشيفتات!', 'بتضيع حالات الكومبوزيت ليه؟', 'الحق مكانك قبل فوات الأوان!', 'Don\'t wait. Create yours today.'],
  sales:   ['الأسنانجي لازم يتدلع!', 'ابني بورتفوليو رقمي فخم.', 'استخدم الـ CV Maker مجاناً.', 'Start modern digital marketing.'],
  promo:   ['إطلاق أقوى تحديث للأطباء!', 'طفرة برمجية للأسنانجي المصري.', 'ميزات جديدة تقلب موازين التوظيف.', 'جرب التحديث مجاناً فوراً.'],
  service: ['يضمن لك الظهور في جوجل.', 'ChatGPT بيرشح اسمك للمرضى.', 'الـ CV PDF Maker مجاناً دائماً.', 'ادخل واكتشف ميزات جوجل والـ AI.'],
  social:  ['عشرات الدكاترة وثقوا فينا!', '"عملت الـ CV بتاعي في دقيقتين!"', '"أول شيفت جالي بسبب بورتفوليو"', 'انضم للدكاترة الناجحين حالاً.'],
};

function makeProject(theme: Theme): Project {
  return {
    theme,
    aspectRatio: '9:16',
    scenes: TEXTS[theme].map((text, i) => ({ id: `s${i}`, text, animation: ['morphIn','waveIn','bounceIn','glitchIn'][i % 4] })),
    brandName: 'PortfolioHubs',
    slogan: 'الاسنانجى لازم يتدلع',
    musicFile: 'default-track.mp3',
    sfxEnabled: true,
  };
}

const STEPS = ['theme', 'format', 'audio', 'text', 'branding', 'review'] as const;
const STEP_LABELS: Record<string, string> = {
  theme: 'Theme', format: 'Format', audio: 'Audio',
  text: 'Text', branding: 'Brand', review: 'Review',
};

export default function App() {
  const [step, setStep] = useState<Step>('welcome');
  const [project, setProject] = useState<Project | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [editingScene, setEditingScene] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const stepIdx = STEPS.indexOf(step as any);

  const go = (s: Step) => setStep(s);

  const selectTheme = (theme: Theme) => {
    setProject(makeProject(theme));
    go('format');
  };

  const updateScene = (id: string, text: string) => {
    if (!project) return;
    setProject({ ...project, scenes: project.scenes.map(s => s.id === id ? { ...s, text } : s) });
  };

  const handleExport = async () => {
    if (!project) return;
    go('exporting');
    setExportProgress(0);

    // Simulate progress (real FFmpeg export loads lazily)
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 150));
      setExportProgress(i);
    }

    try {
      const { videoExporter } = await import('./lib/videoExporter');
      const blob = await videoExporter.exportVideo(
        {
          id: 'proj-1',
          theme: project.theme,
          aspectRatio: project.aspectRatio,
          resolution: '720p',
          totalDuration: 20,
          scenes: project.scenes.map((s, i) => ({
            id: s.id, duration: 1.5, text: s.text, textSize: 48,
            animation: s.animation as any,
            transitionEffect: { type: 'fade' as any, duration: 300 },
            textColor: '#FFFFFF',
          })),
          music: { file: '/assets/music/default-track.mp3', duration: 20, fadeInDuration: 0.5, fadeOutDuration: 0.5 },
          sfxEnabled: project.sfxEnabled,
          branding: { logoUrl: '/assets/logos/logo.jpg', brandName: project.brandName, slogan: project.slogan, duration: 3, animationType: 'fadeIn' },
          colorPalette: { primary: '#E63946', secondary: '#fff', accent: '#FF9F1C', background: THEMES[project.theme].bg, text: '#fff', gradientStart: '#E63946', gradientEnd: '#FF9F1C' },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        p => setExportProgress(Math.round(p * 100))
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `reel-${Date.now()}.mp4`; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Export failed — see console for details.');
    }
    go('review');
  };

  const t = project ? THEMES[project.theme] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: "'Almarai', sans-serif" }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: step !== 'welcome' && step !== 'exporting' ? 16 : 0 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#111' }}>Video Reel Maker</h1>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6b7280' }}>Create Instagram &amp; TikTok reels — no backend, no APIs</p>
            </div>
            {project && (
              <div style={{ textAlign: 'right', fontSize: 12, color: '#6b7280' }}>
                <div>Theme: <strong style={{ color: '#111', textTransform: 'uppercase' }}>{project.theme}</strong></div>
                <div>Format: <strong style={{ color: '#111' }}>{project.aspectRatio}</strong></div>
              </div>
            )}
          </div>

          {/* Step progress */}
          {step !== 'welcome' && step !== 'exporting' && (
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                {STEPS.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => project && i <= stepIdx && go(s as Step)}
                    style={{
                      flex: 1, height: 6, borderRadius: 99, border: 'none', cursor: project && i <= stepIdx ? 'pointer' : 'default',
                      background: i <= stepIdx ? '#111' : '#e5e7eb', transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
                <span>Step {stepIdx + 1} of {STEPS.length}</span>
                <strong style={{ color: '#111' }}>{STEP_LABELS[step]}</strong>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 24px 120px' }}>

        {/* WELCOME */}
        {step === 'welcome' && (
          <div style={{ textAlign: 'center', maxWidth: 600, margin: '60px auto 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎬</div>
            <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 16px', color: '#111' }}>Create Your First Reel</h2>
            <p style={{ fontSize: 18, color: '#4b5563', marginBottom: 40, lineHeight: 1.6 }}>
              Design stunning video reels with automatic text generation, 12+ animations, and branded end cards — 100% client-side.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
              {(['9:16 Portrait', '720p MP4', '450+ Texts', 'No Backend'] as const).map(f => (
                <span key={f} style={{ background: '#f3f4f6', padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, color: '#374151' }}>{f}</span>
              ))}
            </div>
            <button
              onClick={() => go('theme')}
              style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 12, padding: '16px 48px', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}
            >
              Get Started →
            </button>
          </div>
        )}

        {/* THEME */}
        {step === 'theme' && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', color: '#111' }}>Choose Your Theme</h2>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>Each theme auto-generates scene text, colors, and animations.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 16 }}>
              {(Object.entries(THEMES) as [Theme, typeof THEMES[Theme]][]).map(([id, th]) => (
                <button
                  key={id}
                  onClick={() => selectTheme(id)}
                  style={{
                    background: th.bg, border: project?.theme === id ? '4px solid #111' : '4px solid transparent',
                    borderRadius: 16, padding: 24, cursor: 'pointer', color: th.color,
                    textAlign: 'left', transform: project?.theme === id ? 'scale(1.04)' : 'scale(1)',
                    transition: 'all 0.2s', minHeight: 150,
                  }}
                >
                  <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{th.label}</div>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>{th.desc}</div>
                  {project?.theme === id && <div style={{ marginTop: 12, fontSize: 20 }}>✓</div>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FORMAT */}
        {step === 'format' && project && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', color: '#111' }}>Video Format</h2>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>Choose the aspect ratio for your reel.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {([['9:16', 'Vertical', 'Instagram Reels, TikTok', '40px', '72px'], ['1:1', 'Square', 'Universal format', '56px', '56px']] as const).map(([ratio, name, desc, w, h]) => (
                <button
                  key={ratio}
                  onClick={() => setProject({ ...project, aspectRatio: ratio as AspectRatio })}
                  style={{
                    background: '#fff', border: project.aspectRatio === ratio ? '3px solid #111' : '2px solid #e5e7eb',
                    borderRadius: 16, padding: 24, cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 20, alignItems: 'center',
                  }}
                >
                  <div style={{ width: w, height: h, border: '3px solid #9ca3af', borderRadius: 8, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: '#111', marginBottom: 4 }}>{name} ({ratio})</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AUDIO */}
        {step === 'audio' && project && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', color: '#111' }}>Music &amp; SFX</h2>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>Select background music for your reel.</p>
            <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
              <label style={{
                background: '#fff', border: project.musicFile === 'default-track.mp3' ? '3px solid #111' : '2px solid #e5e7eb',
                borderRadius: 16, padding: 20, cursor: 'pointer', display: 'flex', gap: 16, alignItems: 'center',
              }}>
                <input type="radio" checked={project.musicFile === 'default-track.mp3'} onChange={() => setProject({ ...project, musicFile: 'default-track.mp3' })} style={{ width: 18, height: 18 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#111' }}>Default Track</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>20 seconds · Professional Background Music</div>
                </div>
              </label>

              <label style={{
                background: '#fff', border: '2px dashed #d1d5db',
                borderRadius: 16, padding: 20, cursor: 'pointer', textAlign: 'center',
              }}>
                <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={e => {
                  const f = e.target.files?.[0];
                  if (f) setProject({ ...project, musicFile: f.name });
                }} />
                <div style={{ fontSize: 28, marginBottom: 8 }}>🎵</div>
                <div style={{ fontWeight: 700, color: '#111' }}>Upload Custom Music</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>MP3, WAV, or OGG · Click to browse</div>
              </label>

              <label style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 20px', background: '#fff', borderRadius: 16, border: '2px solid #e5e7eb', cursor: 'pointer' }}>
                <input type="checkbox" checked={project.sfxEnabled} onChange={e => setProject({ ...project, sfxEnabled: e.target.checked })} style={{ width: 18, height: 18 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#111' }}>Enable Sound Effects</div>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Adds whoosh, pop, and transition sounds</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* TEXT */}
        {step === 'text' && project && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', color: '#111' }}>Edit Scene Text</h2>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>Each scene lasts ~1.5 seconds. Click the pencil to edit any line.</p>
            <div style={{ display: 'grid', gap: 10, maxWidth: 640 }}>
              {project.scenes.map((scene, i) => (
                <div key={scene.id} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '2px solid #e5e7eb', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ background: '#111', color: '#fff', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Scene {i + 1} · {scene.animation}</div>
                    {editingScene === scene.id ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          style={{ width: '100%', border: '2px solid #111', borderRadius: 8, padding: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', minHeight: 60 }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          <button onClick={() => { updateScene(scene.id, editText); setEditingScene(null); }} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer', fontWeight: 700 }}>Save</button>
                          <button onClick={() => setEditingScene(null)} style={{ background: '#f3f4f6', color: '#111', border: 'none', borderRadius: 8, padding: '6px 16px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 15, color: '#111', lineHeight: 1.5, direction: /[\u0600-\u06FF]/.test(scene.text) ? 'rtl' : 'ltr' }}>{scene.text}</div>
                    )}
                  </div>
                  {editingScene !== scene.id && (
                    <button onClick={() => { setEditingScene(scene.id); setEditText(scene.text); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4, fontSize: 18 }} title="Edit">✏️</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BRANDING */}
        {step === 'branding' && project && (
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', color: '#111' }}>End Card Branding</h2>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>Customize the final 3 seconds of your video.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, maxWidth: 700 }}>
              <div style={{ display: 'grid', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, color: '#111' }}>Brand Name</label>
                  <input value={project.brandName} onChange={e => setProject({ ...project, brandName: e.target.value })}
                    style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, color: '#111' }}>Slogan</label>
                  <input value={project.slogan} onChange={e => setProject({ ...project, slogan: e.target.value })} dir="rtl"
                    style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 15, fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: 6, color: '#111' }}>Logo</label>
                  <label style={{ display: 'block', border: '2px dashed #d1d5db', borderRadius: 10, padding: '16px', textAlign: 'center', cursor: 'pointer', color: '#6b7280' }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                    Click to upload logo
                  </label>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 12, color: '#111', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Preview</div>
                <div style={{ background: t?.bg || '#111', borderRadius: 16, padding: '40px 24px', textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{project.brandName}</div>
                  <div style={{ fontSize: 16, opacity: 0.9, direction: 'rtl' }}>{project.slogan}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REVIEW */}
        {step === 'review' && project && (
          <div style={{ maxWidth: 640 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', color: '#111' }}>Review Settings</h2>
            <p style={{ color: '#6b7280', marginBottom: 32 }}>Everything looks good? Export your video.</p>

            {[
              { label: 'Theme', value: project.theme.toUpperCase(), section: 'theme' },
              { label: 'Aspect Ratio', value: project.aspectRatio, section: 'format' },
              { label: 'Music', value: project.musicFile, section: 'audio' },
              { label: 'SFX', value: project.sfxEnabled ? 'Enabled' : 'Disabled', section: 'audio' },
              { label: 'Scenes', value: `${project.scenes.length} scenes`, section: 'text' },
              { label: 'Brand', value: project.brandName, section: 'branding' },
            ].map(row => (
              <div key={row.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 20px', border: '2px solid #e5e7eb', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{row.label}</div>
                  <div style={{ fontWeight: 700, color: '#111', marginTop: 2 }}>{row.value}</div>
                </div>
                <button onClick={() => go(row.section as Step)} style={{ background: '#f3f4f6', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontWeight: 600, color: '#374151' }}>Edit</button>
              </div>
            ))}

            <div style={{ background: '#111', borderRadius: 16, padding: 32, textAlign: 'center', marginTop: 24 }}>
              <div style={{ color: '#e5e7eb', marginBottom: 8, fontSize: 15 }}>Ready to export? Output: 720p MP4 · 20 seconds</div>
              <button
                onClick={handleExport}
                style={{ background: '#fff', color: '#111', border: 'none', borderRadius: 12, padding: '16px 48px', fontSize: 18, fontWeight: 900, cursor: 'pointer', width: '100%' }}
              >
                Export Video (MP4)
              </button>
            </div>
          </div>
        )}

        {/* EXPORTING */}
        {step === 'exporting' && (
          <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 48, border: '2px solid #e5e7eb' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>🎬</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 8px', color: '#111' }}>Creating Your Video</h2>
              <p style={{ color: '#6b7280', marginBottom: 32 }}>Rendering frames &amp; encoding MP4...</p>
              <div style={{ background: '#f3f4f6', borderRadius: 99, height: 12, overflow: 'hidden', marginBottom: 12 }}>
                <div style={{ background: '#111', height: '100%', width: `${exportProgress}%`, borderRadius: 99, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#111' }}>{exportProgress}%</div>
            </div>
          </div>
        )}
      </main>

      {/* Footer nav */}
      {step !== 'welcome' && step !== 'exporting' && (
        <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e5e7eb', padding: '12px 24px', zIndex: 50 }}>
          <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
            <button
              onClick={() => {
                if (stepIdx > 0) go(STEPS[stepIdx - 1] as Step);
                else go('welcome');
              }}
              style={{ background: '#f3f4f6', color: '#111', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
            >
              ← Back
            </button>
            {step !== 'review' && (
              <button
                onClick={() => project && go(STEPS[stepIdx + 1] as Step)}
                disabled={!project}
                style={{ background: '#111', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, cursor: project ? 'pointer' : 'not-allowed', fontSize: 15, opacity: project ? 1 : 0.4 }}
              >
                Next →
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
