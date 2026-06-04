# Video Reel Maker - Complete Setup & Deployment Guide

## Pre-Deployment Checklist

Before uploading to GitHub/deploying, ensure you have these assets ready:

### ✅ Required Assets

1. **Music Track** → `public/assets/music/default-track.mp3`
   - Duration: 20 seconds
   - Format: MP3, WAV, or OGG
   - Bitrate: 128kbps+ recommended
   - Where to get: Use your own track, YouTube Audio Library, Epidemic Sound, etc.

2. **Logo Image** → `public/assets/logos/logo.jpg`
   - Dimensions: Square format (1:1 aspect ratio)
   - Size: 500×500px minimum
   - Format: JPG or PNG
   - This will be displayed in the end card branding

3. **Sound Effects** → `public/assets/sfx/` (Optional but recommended)
   - Create folder: `public/assets/sfx/`
   - Add these 10 files (or subset you have):
     ```
     whoosh-fast.mp3
     whoosh-soft.mp3
     impact-hard.mp3
     impact-soft.mp3
     pop-in.mp3
     swipe-left.mp3
     swipe-right.mp3
     reveal.mp3
     tick.mp3
     chime.mp3
     ```
   - Each file: 0.5-1.5 seconds, WAV or MP3
   - These map to animation transitions

## Folder Structure After Adding Assets

```
project/
├── public/
│   ├── assets/
│   │   ├── music/
│   │   │   └── default-track.mp3 ← ADD THIS
│   │   ├── sfx/ ← ADD THIS FOLDER
│   │   │   ├── whoosh-fast.mp3
│   │   │   ├── whoosh-soft.mp3
│   │   │   ├── impact-hard.mp3
│   │   │   ├── impact-soft.mp3
│   │   │   ├── pop-in.mp3
│   │   │   ├── swipe-left.mp3
│   │   │   ├── swipe-right.mp3
│   │   │   ├── reveal.mp3
│   │   │   ├── tick.mp3
│   │   │   └── chime.mp3
│   │   └── logos/
│   │       └── logo.jpg ← ADD THIS
│   ├── manifest.json ✅ (already created)
│   ├── sw.js ✅ (already created)
│   └── vite.svg
├── src/ ✅ (all components created)
└── dist/ (generated after build)
```


## Local Testing

1. **Install dependencies**:
```bash
npm install
```

2. **Add your assets** to `public/` folder structure above

3. **Start dev server**:
```bash
npm run dev
```
   - Opens at `http://localhost:5173`
   - Live reload enabled
   - Test all features locally

4. **Test full workflow**:
   - [ ] Select theme → colors load correctly
   - [ ] Choose format (9:16 or 1:1)
   - [ ] Upload/select music
   - [ ] Edit text scenes
   - [ ] Upload logo and edit branding
   - [ ] Review settings
   - [ ] Click export and wait for MP4 download

5. **Test on mobile**:
   - Get local IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)
   - Visit: `http://[YOUR-IP]:5173` on phone
   - Test upload functionality

## Production Build

```bash
npm run build
```

Outputs to `dist/` folder. This is what gets deployed.

**File size**: ~3-4MB (including FFmpeg WASM)

## Deployment Options

### Option 1: GitHub Pages (Recommended for free hosting)

1. **Create GitHub repository**:
   - Name: `video-reel-maker` (or your choice)
   - Public repository
   - Initialize with README ✓

2. **Clone locally and push code**:
```bash
git clone https://github.com/yourusername/video-reel-maker.git
cd video-reel-maker
# Copy all files from project folder
git add .
git commit -m "Initial commit: Video Reel Maker PWA"
git push origin main
```

3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "GitHub Pages"
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)` 
   - Save

4. **Create GitHub Actions workflow** (auto-deploy on push):
   - Create file: `.github/workflows/deploy.yml`
   - Content:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
```

5. **Access deployed site**:
   - URL: `https://yourusername.github.io/video-reel-maker`
   - Accessible globally immediately

### Option 2: Vercel (Recommended for easy deployment)

1. **Push to GitHub** (same as above)

2. **Sign up at vercel.com**

3. **Import project**:
   - Click "New Project"
   - Select GitHub repository
   - Vercel auto-detects Vite config
   - Deploy

4. **Custom domain** (optional):
   - Add domain in project settings
   - Configure DNS

### Option 3: Netlify

1. **Push to GitHub**

2. **Sign up at netlify.com**

3. **Connect GitHub**:
   - Click "New site from Git"
   - Select repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Deploy

### Option 4: Self-hosted (Any web server)

```bash
# Build
npm run build

# Copy dist/ folder contents to your web server's public folder
# Ensure server supports SPA routing (index.html fallback)
```

## Environment Setup for Production

### PWA Manifest

`public/manifest.json` is already configured with:
- App name, icons, theme colors
- Installable on home screen
- Offline support

### Service Worker

`public/sw.js` handles:
- Offline caching
- Network-first strategy for dynamic content
- Auto-updates on new deploy

## Post-Deployment

### Verify Installation

1. **Visit deployed URL**
2. **Check PWA features**:
   - Android: "Install app" popup should appear
   - iPhone: Use "Add to Home Screen" from share menu
   - Desktop: Click install icon in address bar (Chrome/Edge)

3. **Test functionality**:
   - [ ] All themes load with correct colors
   - [ ] Music plays
   - [ ] SFX work (if you added them)
   - [ ] Export generates MP4
   - [ ] Can download video

4. **Test offline**:
   - After installing as PWA
   - Disconnect internet
   - App should still be launchable and usable for creation

### Monitor Performance

- Check browser DevTools → Network tab
- FFmpeg loads on first export (~30MB download)
- Subsequent exports use cached FFmpeg
- Typical export: 5-15 seconds

## Customization Options

### Change Default Brand

Edit `src/lib/projectStore.ts`:
```typescript
const DEFAULT_BRANDING: BrandingCard = {
  logoUrl: '/assets/logos/logo.jpg',
  brandName: 'PortfolioHubs', // ← Change this
  slogan: 'الاسنانجى لازم يتدلع', // ← Change this
  duration: 3,
  animationType: 'fadeIn',
};
```

### Adjust Default Duration

Edit `src/lib/projectStore.ts`:
```typescript
const createInitialProject = (theme: Theme): VideoProject => {
  const totalDuration = 20; // ← Change this (seconds)
  // ...
}
```

### Add More Animations

Edit `src/lib/animations.ts` to add new animation methods and export them

### Modify Color Palettes

Edit `src/lib/colorPalettes.ts` to change theme colors

### Add Custom Text Lines

Edit `src/lib/contentLibrary.ts` to add more text library entries

## Troubleshooting Deployment

| Issue | Solution |
|-------|----------|
| "File not found" for assets | Ensure assets in `public/assets/` folder, not `src/assets/` |
| GitHub Pages shows 404 | Check repository Settings → Pages, ensure main branch selected |
| Fonts not loading | Google Fonts URL is in `src/index.css` and `tailwind.config.js` |
| PWA not installing | Check `public/manifest.json` exists and is valid JSON |
| FFmpeg fails on export | Browser likely doesn't support WASM, try Chrome/Firefox |
| Videos won't download | Check browser's download permission settings |
| Mobile app crashes | Close other apps to free memory, try on desktop first |

## Analytics & Tracking (Optional)

To track usage, add to `src/App.tsx`:

```typescript
// Google Analytics
useEffect(() => {
  if (window.gtag) {
    window.gtag('event', 'page_view');
  }
}, []);

// Track export completion
const handleExport = async () => {
  // ... existing code ...
  if (window.gtag) {
    window.gtag('event', 'video_exported', {
      theme: project.theme,
      resolution: project.resolution,
      duration: project.totalDuration,
    });
  }
};
```

## Security Notes

- **No backend**: All data stays on user's device
- **CORS**: FFmpeg CDN (`cdn.jsdelivr.net`) must be accessible
- **Content Security Policy**: Configure if hosting on restrictive server
- **Data Privacy**: No analytics by default (add your own if needed)

## Performance Optimization Tips

### For End Users

1. **Faster exports**:
   - Close other browser tabs
   - Use 720p instead of 1080p
   - Shorter videos (15-20s ideal)

2. **Better quality**:
   - High-quality music (128kbps+)
   - Square aspect logos
   - Desktop/tablet for export (vs mobile)

### For Deployment

1. **Caching**:
   - Set `Cache-Control: max-age=31536000` for static assets
   - Use CDN for distribution (GitHub Pages uses Cloudflare)

2. **Compression**:
   - Build already optimized
   - Gzip compression handled by host

3. **Monitoring**:
   - Set up Sentry or LogRocket for error tracking
   - Track export success rate

## Backup & Version Control

### Keep backups of:
- `public/assets/music/default-track.mp3`
- `public/assets/logos/logo.jpg`
- `public/assets/sfx/` folder

### Git strategy:
```bash
# Never commit large binaries to Git
# Use .gitignore:
echo "public/assets/music/*.mp3" >> .gitignore
echo "public/assets/logos/*.jpg" >> .gitignore
echo "public/assets/sfx/*.mp3" >> .gitignore

# Use Git LFS for binary files (optional):
git lfs track "*.mp3"
git lfs track "*.jpg"
```

## Support Resources

- **React**: https://react.dev
- **Vite**: https://vitejs.dev
- **TypeScript**: https://www.typescriptlang.org
- **FFmpeg.wasm**: https://ffmpeg.org/ffmpeg.wasm
- **Tailwind**: https://tailwindcss.com

---

**Once you have assets ready and deploy, your PWA will be live and ready for users!**
