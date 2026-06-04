import { VideoProject } from '../types/project';
import { CanvasRenderer } from './canvasRenderer';

export class VideoExporter {
  private ffmpeg: any;
  private isInitialized = false;

  async loadFFmpeg(): Promise<any> {
    const { FFmpeg, toBlobURL } = await import('@ffmpeg/ffmpeg');
    return { FFmpeg, toBlobURL };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const { FFmpeg, toBlobURL } = await this.loadFFmpeg();
      this.ffmpeg = new FFmpeg();

      const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/esm';
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
        renderer.renderScene(
          scene,
          project.colorPalette,
          frameProgress,
          currentTime
        );

        frames.push(
          await new Promise((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob!);
            }, 'image/jpeg', 0.85);
          })
        );

        currentTime += 1000 / fps;
        frameIndex++;
        onProgress((frameIndex / totalFrames) * 0.85);

        if (frameIndex % 12 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 10));
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
          canvas.toBlob((blob) => {
            resolve(blob!);
          }, 'image/jpeg', 0.85);
        })
      );

      frameIndex++;
      onProgress(0.85 + (frameIndex / totalFrames) * 0.15);

      if (frameIndex % 12 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 10));
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

    const fps = 24;
    const frameData: Uint8Array[] = [];

    for (let i = 0; i < frames.length; i++) {
      const arrayBuffer = await frames[i].arrayBuffer();
      frameData.push(new Uint8Array(arrayBuffer));
      onProgress(0.9 + (i / frames.length) * 0.05);
    }

    for (let i = 0; i < frameData.length; i++) {
      this.ffmpeg.FS('writeFile', `frame_${i.toString().padStart(6, '0')}.jpg`, frameData[i]);
    }

    const res = project.resolution === '720p' ? '1280x720' : '1920x1080';

    await this.ffmpeg.run(
      '-framerate', fps.toString(),
      '-i', 'frame_%06d.jpg',
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-pix_fmt', 'yuv420p',
      '-s', res,
      'output.mp4'
    );

    const data = this.ffmpeg.FS('readFile', 'output.mp4');
    const blob = new Blob([data.buffer], { type: 'video/mp4' });

    try {
      this.ffmpeg.FS('unlink', 'output.mp4');
      for (let i = 0; i < frameData.length; i++) {
        this.ffmpeg.FS('unlink', `frame_${i.toString().padStart(6, '0')}.jpg`);
      }
    } catch (e) {
      console.log('Cleanup note: files may not be fully cleaned');
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
      const videoBlob = await this.exportToMP4(frames, project, (p) => onProgress(0.9 + p * 0.1));
      return videoBlob;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }
}

export const videoExporter = new VideoExporter();
