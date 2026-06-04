import { VideoProject } from '../types/project';
import { CanvasRenderer } from './canvasRenderer';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export class VideoExporter {
  private ffmpeg: FFmpeg | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      this.ffmpeg = new FFmpeg();

      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm';
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize FFmpeg:', error);
      throw error;
    }
  }

  async renderFrames(
    project: VideoProject,
    onProgress: (progress: number) => void
  ): Promise<Blob[]> {
    const canvas = document.createElement('canvas');
    const renderer = new CanvasRenderer(canvas, project.aspectRatio);

    const fps = 24;
    const totalFrames = Math.ceil(project.totalDuration * fps);
    const frames: Blob[] = [];

    let currentTime = 0;
    let frameIndex = 0;

    for (let sceneIdx = 0; sceneIdx < project.scenes.length; sceneIdx++) {
      const scene = project.scenes[sceneIdx];
      const sceneFrameCount = Math.ceil((scene.duration * fps) / 1000);

      for (let f = 0; f < sceneFrameCount; f++) {
        const frameProgress = f / sceneFrameCount;
        renderer.renderScene(scene, project.colorPalette, frameProgress, currentTime);

        frames.push(
          await new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85);
          })
        );

        currentTime += 1000 / fps;
        frameIndex++;
        onProgress((frameIndex / totalFrames) * 0.85);

        if (frameIndex % 12 === 0) {
          await new Promise((r) => setTimeout(r, 10));
        }
      }
    }

    const endCardFrames = Math.ceil((project.branding.duration * fps) / 1000);
    for (let f = 0; f < endCardFrames; f++) {
      const frameProgress = f / endCardFrames;
      renderer.renderEndCard(
        project.branding.logoUrl,
        project.branding.brandName,
        project.branding.slogan,
        project.colorPalette,
        frameProgress
      );

      frames.push(
        await new Promise((resolve) => {
          canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.85);
        })
      );

      frameIndex++;
      onProgress(0.85 + (frameIndex / totalFrames) * 0.15);

      if (frameIndex % 12 === 0) {
        await new Promise((r) => setTimeout(r, 10));
      }
    }

    return frames;
  }

  async exportToMP4(
    frames: Blob[],
    project: VideoProject,
    onProgress: (progress: number) => void
  ): Promise<Blob> {
    await this.initialize();
    const ff = this.ffmpeg!;

    for (let i = 0; i < frames.length; i++) {
      const name = `frame_${i.toString().padStart(6, '0')}.jpg`;
      await ff.writeFile(name, await fetchFile(frames[i]));
      onProgress(0.9 + (i / frames.length) * 0.05);
    }

    const fps = 24;
    const res = project.resolution === '720p' ? '1280x720' : '1920x1080';

    await ff.exec([
      '-framerate', fps.toString(),
      '-i', 'frame_%06d.jpg',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-pix_fmt', 'yuv420p',
      '-s', res,
      'output.mp4',
    ]);

    const data = await ff.readFile('output.mp4');
    const blob = new Blob([data], { type: 'video/mp4' });

    // Cleanup
    try {
      await ff.deleteFile('output.mp4');
      for (let i = 0; i < frames.length; i++) {
        await ff.deleteFile(`frame_${i.toString().padStart(6, '0')}.jpg`);
      }
    } catch (e) {
      // ignore cleanup errors
    }

    onProgress(1);
    return blob;
  }

  async exportVideo(
    project: VideoProject,
    onProgress: (progress: number) => void
  ): Promise<Blob> {
    try {
      const frames = await this.renderFrames(project, (p) => onProgress(p * 0.9));
      return await this.exportToMP4(frames, project, (p) => onProgress(0.9 + p * 0.1));
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();
