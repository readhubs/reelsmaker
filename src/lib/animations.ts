import { AnimationType } from '../types/project';

export interface AnimationConfig {
  type: AnimationType;
  duration: number; // in ms
  delay?: number;
  easing: string;
}

export class AnimationEngine {
  private animationFrames: Map<string, number> = new Map();

  getAnimationConfig(type: AnimationType, duration: number = 800): AnimationConfig {
    const baseConfigs: Record<AnimationType, Omit<AnimationConfig, 'duration'>> = {
      fadeInSlideOut: {
        type: 'fadeInSlideOut',
        easing: 'ease-out',
      },
      zoomInZoomOut: {
        type: 'zoomInZoomOut',
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      rotateIn: {
        type: 'rotateIn',
        easing: 'ease-out',
      },
      bounceIn: {
        type: 'bounceIn',
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      morphIn: {
        type: 'morphIn',
        easing: 'ease-in-out',
      },
      waveIn: {
        type: 'waveIn',
        easing: 'ease-in-out',
      },
      slideLeft: {
        type: 'slideLeft',
        easing: 'ease-out',
      },
      slideRight: {
        type: 'slideRight',
        easing: 'ease-out',
      },
      scaleUp: {
        type: 'scaleUp',
        easing: 'ease-out',
      },
      flipIn: {
        type: 'flipIn',
        easing: 'ease-out',
      },
      particleBurst: {
        type: 'particleBurst',
        easing: 'ease-out',
      },
      glitchIn: {
        type: 'glitchIn',
        easing: 'ease-out',
      },
    };

    return {
      ...baseConfigs[type],
      duration,
    };
  }

  // Morph animation - text transforms shape
  renderMorphAnimation(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number, // 0 to 1
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Morph effect: scale + rotation + skew
    const scale = 0.8 + progress * 0.4;
    const rotation = (1 - progress) * Math.PI * 0.5;
    const skewY = (1 - progress) * 0.3;

    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(rotation);
    // skew via transform matrix: [a,b,c,d,e,f] — skewY = tan(angle) in c slot
    ctx.transform(1, skewY, 0, 1, 0, 0);
    ctx.translate(-x, -y);

    ctx.globalAlpha = Math.min(progress * 1.5, 1);
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  // Wave animation - text ripples
  renderWaveAnimation(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number,
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const letters = text.split('');
    const startX = x - (text.length * fontSize) / 3;

    letters.forEach((letter, index) => {
      const letterX = startX + index * (fontSize * 0.6);
      const wave = Math.sin((progress + index * 0.15) * Math.PI * 2) * (fontSize * 0.2);
      const scale = 0.6 + progress * 0.4;

      ctx.save();
      ctx.translate(letterX, y + wave);
      ctx.scale(scale, scale);
      ctx.globalAlpha = Math.min(progress * 1.2, 1);
      ctx.fillText(letter, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }

  // Bounce animation - text bounces in
  renderBounceAnimation(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number,
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Elastic easing
    let easeProgress = progress;
    if (progress < 0.5) {
      easeProgress = progress * 2;
    } else {
      easeProgress = 1 + (progress - 0.5) * 2 * Math.sin((1 - progress) * Math.PI * 4);
    }

    const scale = easeProgress;
    const bounce = Math.max(0, 1 - progress) * fontSize * 0.3;

    ctx.translate(x, y + bounce);
    ctx.scale(scale, scale);
    ctx.globalAlpha = Math.min(progress * 1.5, 1);
    ctx.fillText(text, 0, 0);

    ctx.restore();
  }

  // Glitch animation - text glitches
  renderGlitchAnimation(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number,
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const glitchAmount = Math.random() * progress * 20;
    const glitchY = (Math.random() - 0.5) * fontSize * 0.3;

    // Red channel
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.min(progress * 1.5, 1) * 0.7;
    ctx.fillText(text, x + glitchAmount, y + glitchY);

    // Green channel offset
    ctx.globalAlpha = Math.min(progress * 1.5, 1) * 0.7;
    ctx.fillText(text, x - glitchAmount, y - glitchY);

    // Main text
    ctx.fillStyle = color;
    ctx.globalAlpha = Math.min(progress * 1.5, 1);
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  // Particle burst - text particles explode outward
  renderParticleBurst(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number,
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();
    ctx.font = `${fontSize * 0.3}px ${font}`;
    ctx.fillStyle = color;

    const particleCount = text.length * 3;
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const distance = progress * 200;
      const px = x + Math.cos(angle) * distance;
      const py = y + Math.sin(angle) * distance;

      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - progress * 1.5);
      ctx.fillRect(px, py, 3, 3);
      ctx.restore();
    }

    // Fade in main text at end
    if (progress > 0.5) {
      ctx.font = `${fontSize}px ${font}`;
      ctx.fillStyle = color;
      ctx.globalAlpha = (progress - 0.5) * 2;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
    }

    ctx.restore();
  }

  // Flip animation - text flips in 3D
  renderFlipAnimation(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number,
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();

    const angle = progress * Math.PI;
    const scale = Math.cos(angle * 0.5);

    ctx.translate(x, y);
    ctx.scale(scale, 1);
    ctx.rotate(angle);
    ctx.translate(-x, -y);

    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = Math.min(progress * 1.2, 1);
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  // Fade and slide animation
  renderFadeSlideAnimation(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number,
    direction: 'in' | 'out' = 'in',
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();
    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (direction === 'in') {
      const slide = (1 - progress) * 50;
      ctx.globalAlpha = progress;
      ctx.fillText(text, x + slide, y);
    } else {
      const slide = progress * 50;
      ctx.globalAlpha = 1 - progress;
      ctx.fillText(text, x + slide, y);
    }

    ctx.restore();
  }

  // Zoom animation
  renderZoomAnimation(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number,
    direction: 'in' | 'out' = 'in',
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();

    const scale = direction === 'in' ? progress * 1.2 : 1.2 - progress * 0.2;

    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-x, -y);

    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = direction === 'in' ? progress : 1 - progress;
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  // Rotate animation
  renderRotateAnimation(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    color: string,
    progress: number,
    font: string = 'Almarai ExtraBold'
  ) {
    ctx.save();

    ctx.translate(x, y);
    ctx.rotate(progress * Math.PI * 2);
    ctx.translate(-x, -y);

    ctx.font = `${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = Math.min(progress * 1.5, 1);
    ctx.fillText(text, x, y);

    ctx.restore();
  }
}

export const animationEngine = new AnimationEngine();
