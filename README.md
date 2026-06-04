# Video Reel Maker - PWA Client-Side Generator

Professional Instagram, TikTok, and Facebook reel creator built entirely on client-side. No backend, no API keys, no servers needed.

## Features

- **Client-Side Only**: All video rendering and processing happens in your browser
- **No AI APIs**: Complete control, no external service dependencies
- **Frame-by-Frame MP4 Export**: 720p or 1080p MP4 video generation
- **Advanced Animations**: 12+ unique morphing and text animations
- **Smart Text Library**: 5 themes (FOMO, Sales, Promo, Service, Social Proof) with 100+ auto-generated text lines
- **Theme-Driven Colors**: Dynamic color palettes that update based on selected theme
- **Audio Processing**: Music trimming, fade in/out, SFX mixing (Web Audio API)
- **Branded End Card**: Logo, brand name, slogan reveal animation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **PWA Support**: Installable app with offline capability
- **Settings Review**: Comprehensive configuration review before export
- **Editable Everything**: Edit all text, colors, and settings before export

## Project Structure

```
src/
├── components/           # UI components
│   ├── ThemeSelector.tsx
│   ├── AspectRatioSelector.tsx
│   ├── MusicUploader.tsx
│   ├── TextEditor.tsx
│   ├── BrandingEditor.tsx
│   └── SettingsReview.tsx
├── lib/                  # Core libraries
│   ├── contentLibrary.ts # 450+ text lines organized by theme
│   ├── colorPalettes.ts  # Theme color systems
│   ├── animations.ts     # 12+ animation effects
│   ├── audioProcessor.ts # Web Audio API wrapper
│   ├── canvasRenderer.ts # Canvas frame rendering
│   ├── videoExporter.ts  # FFmpeg integration
│   └── projectStore.ts   # State management (Zustand)
├── types/               # TypeScript interfaces
├── App.tsx              # Main app flow
└── index.css            # Tailwind + fonts

public/
├── manifest.json        # PWA metadata
└── sw.js               # Service Worker

```

## Setup & Deployment

### Local Development

1. **Clone and install**:
```bash
npm install
npm run dev
```

2. **Build for production**:
```bash
npm run build
```

3. **Deploy to GitHub Pages**:
```bash
# Copy dist/ contents to gh-pages branch
# Or use GitHub Actions workflow
```

### Required Assets

Place these files in the specified locations:

#### 1. Default Music Track
- **Path**: `public/assets/music/default-track.mp3`
- **Duration**: 20 seconds recommended
- **Format**: MP3, WAV, or OGG

#### 2. Sound Effects (Optional)
Create `public/assets/sfx/` folder with:
- `whoosh-fast.mp3` - Fast slide/wipe transition
- `whoosh-soft.mp3` - Soft slide transition
- `impact-hard.mp3` - Hard reveal/pop
- `impact-soft.mp3` - Soft reveal
- `pop-in.mp3` - Pop appearance
- `swipe-left.mp3` - Left swipe
- `swipe-right.mp3` - Right swipe
- `reveal.mp3` - Text reveal
- `tick.mp3` - Tick/countdown sound
- `chime.mp3` - Chime/bell sound

#### 3. Default Logo
- **Path**: `public/assets/logos/logo.jpg`
- **Recommended**: Square format, 500×500px minimum
- **This can be overridden by users at runtime**

## Usage Flow

### Step-by-Step

1. **Theme Selection** → Choose from 5 pre-designed themes
2. **Video Format** → Select 9:16 (portrait) or 1:1 (square)
3. **Music & Audio** → Use default or upload custom music
4. **Text Editing** → Review and edit auto-generated text per scene
5. **Branding** → Customize logo, brand name, slogan
6. **Settings Review** → Review all configurations, download JSON report
7. **Export** → Generate MP4 at 720p or 1080p

### Text Library

The app includes **450+ text lines** organized by:

- **5 Themes**: FOMO, Sales, Promo, Service, Social Proof
- **3 Categories per theme**:
  - Opening Hooks (stop-scroll)
  - Middle Value Lines (main content)
  - Closing CTAs (call-to-action)

Auto-generated scenes combine these intelligently. All text is fully editable before export.

## Technical Highlights

### Performance Optimization

- **Frame-by-Frame Rendering**: 24fps at 720p/1080p
- **Batched Processing**: 12 frames per batch with yield delays
- **Canvas Optimization**: Use of `toBlob()` for efficient JPEG encoding (0.85 quality)
- **Memory Management**: Frames streamed to FFmpeg, not held in memory
- **Audio Processing**: Web Audio API (native, no external library)
- **Lazy Loading**: FFmpeg loaded only on export initiation

### Morphing & Animation Engine

- **MorphIn**: Text morphs from abstract shape
- **WaveIn**: Wave ripple effect on text
- **BounceIn**: Elastic bounce entrance
- **GlitchIn**: Trendy glitch effect
- **ParticleBurst**: Text particles explode outward
- **FlipIn**: 3D flip rotation
- **ZoomInZoomOut**: Scale-based entrance
- **RotateIn**: 360° rotation
- **FadeInSlideOut**: Classic fade + slide

### State Management

Uses **Zustand** for lightweight, reactive state:
- Project configuration persistence
- LocalStorage auto-save
- Real-time preview sync

### Video Export

- **Canvas Rendering**: Real-time frame generation
- **FFmpeg Integration**: Client-side H.264/AAC codec
- **Resolution Options**: 720p (1280×720) or 1080p (1920×1080)
- **Audio Mixing**: Web Audio API for music trim + SFX
- **Estimated Time**: 5-15 seconds for 15-20s video (depends on device)

## Color Palettes by Theme

| Theme | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| FOMO | #E63946 (Red) | #F1FAEE (Cream) | #FF9F1C (Orange) |
| SALES | #FFB800 (Gold) | #1E1E1E (Dark) | #FF6B35 (Orange) |
| PROMO | #0077B6 (Blue) | #CAF0F8 (Light) | #00B4D8 (Teal) |
| SERVICE | #2D6A4F (Green) | #D8F3DC (Light) | #52B788 (Sage) |
| SOCIAL | #6A4C93 (Purple) | #F0E3FF (Light) | #9D84B7 (Mauve) |

## Browser Compatibility

- **Chrome/Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ⚠️ Partial (some audio features limited)
- **Mobile**: ✅ iOS Safari, Chrome Android

## PWA Features

- **Installable**: Add to home screen on any device
- **Offline Support**: Service worker caching strategy
- **Cross-Device**: Responsive design (mobile-first)
- **Fast**: Network-first strategy for dynamic content

## Settings Export

Before exporting, download a comprehensive JSON report with:
- Theme and color codes
- Video resolution and aspect ratio
- Scene text and animations
- Audio settings
- Branding details

Perfect for recreating videos or sharing configurations.

## Performance Tips

1. **For Faster Exports**:
   - Use 720p instead of 1080p
   - Keep video to 15-20 seconds
   - Use built-in SFX (faster than custom uploads)

2. **For Better Results**:
   - Use high-quality source music (128kbps+ bitrate)
   - Keep SFX files under 1MB each
   - Use square logos (1:1 aspect ratio)

3. **For Mobile**:
   - Recommended: Desktop or tablet for export
   - Video creation works on all devices
   - Download videos may require adequate storage

## Troubleshooting

**Export hangs/stalls**:
- Check browser console for errors
- Try 720p instead of 1080p
- Close other browser tabs
- Restart browser if needed

**Audio not syncing**:
- Ensure music duration > video duration
- Check fade-in/out settings
- Try default music first

**Canvas rendering issues**:
- Try different browser
- Clear browser cache
- Check font loading (Almarai)

## API & Integration

While this is a standalone PWA, you can integrate it with:

- **Backend Services**: POST generated videos to your server
- **Cloud Storage**: Upload to S3, Google Cloud, etc.
- **Analytics**: Track video creation metrics
- **Social APIs**: Direct share to TikTok, Instagram (requires OAuth)

Extend in `src/App.tsx` after successful export.

## Deployment to GitHub Pages

1. **Update package.json**:
```json
"homepage": "https://yourusername.github.io/video-reel-maker"
```

2. **Build and deploy**:
```bash
npm run build
# Use GitHub Actions or gh-pages package
```

3. **Configure**:
   - Enable GitHub Pages in repository settings
   - Select `dist/` folder as source

## Future Enhancements

- [ ] Frame-by-frame editor
- [ ] Multi-language support
- [ ] Custom animation builder
- [ ] AI text suggestions (optional)
- [ ] Video templates library
- [ ] Collaboration mode (IndexedDB sync)
- [ ] Analytics dashboard

## License

MIT

## Support

For issues or feature requests, open an issue on GitHub.

---

**Created with**: React + TypeScript + Tailwind + FFmpeg + Web Audio API
**No external APIs, no backend, 100% client-side processing**
