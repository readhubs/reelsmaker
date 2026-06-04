import { Scene, ColorPalette, AspectRatio } from '../types/project';
import { animationEngine } from './animations';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement, aspectRatio: AspectRatio = '9:16') {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Failed to get canvas context');
    this.ctx = context;

    // Set resolution based on aspect ratio
    if (aspectRatio === '9:16') {
      this.width = 720;
      this.height = 1280;
    } else {
      this.width = 1080;
      this.height = 1080;
    }

    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  private drawGradientBackground(gradient: string) {
    // Parse gradient string and apply
    if (gradient.includes('linear-gradient')) {
      const gradientRegex = /linear-gradient\(.*?,(.*?),(.*?)\)/;
      const match = gradient.match(gradientRegex);
      if (match) {
        const color1 = match[1].trim();
        const color2 = match[2].trim();
        const canvasGradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        canvasGradient.addColorStop(0, color1);
        canvasGradient.addColorStop(1, color2);
        this.ctx.fillStyle = canvasGradient;
      }
    } else {
      this.ctx.fillStyle = gradient;
    }
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private addAnimatedBackground(palette: ColorPalette, time: number) {
    // Draw gradient
    this.drawGradientBackground(palette.background);

    // Add subtle animated particles
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.sin(time * 0.0005 + i) + 1) * this.width * 0.5;
      const y = (Math.cos(time * 0.0004 + i) + 1) * this.height * 0.5;
      const size = 50 + Math.sin(time * 0.001 + i) * 30;

      this.ctx.fillStyle = palette.accent;
      this.ctx.globalAlpha = 0.05;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }

  renderScene(
    scene: Scene,
    palette: ColorPalette,
    progress: number, // 0 to 1 for the scene duration
    currentTime: number
  ) {
    // Clear and draw background
    this.addAnimatedBackground(palette, currentTime);

    // Draw text based on animation type
    const fontSize = Math.max(36, Math.min(72, scene.textSize));
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Choose animation renderer
    switch (scene.animation) {
      case 'morphIn':
        animationEngine.renderMorphAnimation(
          this.ctx,
          scene.text,
          centerX,
          centerY,
          fontSize,
          scene.textColor,
          progress,
          'Almarai ExtraBold'
        );
        break;

      case 'waveIn':
        animationEngine.renderWaveAnimation(
          this.ctx,
          scene.text,
          centerX,
          centerY,
          fontSize,
          scene.textColor,
          progress,
          'Almarai ExtraBold'
        );
        break;

      case 'bounceIn':
        animationEngine.renderBounceAnimation(
          this.ctx,
          scene.text,
          centerX,
          centerY,
          fontSize,
          scene.textColor,
          progress,
          'Almarai ExtraBold'
        );
        break;

      case 'glitchIn':
        animationEngine.renderGlitchAnimation(
          this.ctx,
          scene.text,
          centerX,
          centerY,
          fontSize,
          scene.textColor,
          progress,
          'Almarai ExtraBold'
        );
        break;

      case 'particleBurst':
        animationEngine.renderParticleBurst(
          this.ctx,
          scene.text,
          centerX,
          centerY,
          fontSize,
          scene.textColor,
          progress,
          'Almarai ExtraBold'
        );
        break;

      case 'flipIn':
        animationEngine.renderFlipAnimation(
          this.ctx,
          scene.text,
          centerX,
          centerY,
          fontSize,
          scene.textColor,
          progress,
          'Almarai ExtraBold'
        );
        break;

      case 'zoomInZoomOut':
        animationEngine.renderZoomAnimation(
          this.ctx,
          scene.text,
          centerX,
          centerY,
          fontSize,
          scene.textColor,
          progress,
          'in',
          'Almarai ExtraBold'
        );
        break;

      case 'rotateIn':
        animationEngine.renderRotateAnimation(
          this.ctx,
          scene.text,
          centerX,
          centerY,
          fontSize,
          scene.textColor,
          progress,
          'Almarai ExtraBold'
        );
        break;

      case 'fadeInSlideOut':
      default:
        if (progress < 0.5) {
          animationEngine.renderFadeSlideAnimation(
            this.ctx,
            scene.text,
            centerX,
            centerY,
            fontSize,
            scene.textColor,
            progress * 2,
            'in',
            'Almarai ExtraBold'
          );
        } else {
          animationEngine.renderFadeSlideAnimation(
            this.ctx,
            scene.text,
            centerX,
            centerY,
            fontSize,
            scene.textColor,
            (progress - 0.5) * 2,
            'out',
            'Almarai ExtraBold'
          );
        }
        break;
    }

    // Draw bottom branding bar
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, this.height - 60, this.width, 60);

    this.ctx.fillStyle = palette.primary;
    this.ctx.font = 'bold 14px Almarai';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PortfolioHubs', this.width / 2, this.height - 20);
  }

  renderEndCard(
    logoUrl: string,
    brandName: string,
    slogan: string,
    palette: ColorPalette,
    progress: number // 0 to 1
  ) {
    // Draw gradient background
    this.drawGradientBackground(palette.background);

    // Add particles
    const particleCount = 5;
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.sin(progress * 2 + i) + 1) * this.width * 0.5;
      const y = (Math.cos(progress * 1.5 + i) + 1) * this.height * 0.5;
      const size = 60 + Math.sin(progress * 3 + i) * 40;

      this.ctx.fillStyle = palette.accent;
      this.ctx.globalAlpha = 0.08;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;

    // Fade in effect for end card
    const alpha = Math.min(progress * 1.5, 1);

    // Draw logo (if available)
    if (logoUrl && logoUrl !== '/assets/logos/logo.jpg') {
      const img = new Image();
      img.src = logoUrl;
      const logoSize = 120;
      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(
        img,
        this.width / 2 - logoSize / 2,
        this.height / 2 - 180,
        logoSize,
        logoSize
      );
      this.ctx.globalAlpha = 1;
    }

    // Draw brand name
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = palette.text;
    this.ctx.font = 'bold 64px Almarai ExtraBold';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(brandName, this.width / 2, this.height / 2 + 50);

    // Draw slogan
    this.ctx.font = '36px Almarai';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(slogan, this.width / 2, this.height / 2 + 120);
    this.ctx.globalAlpha = 1;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}
