import { AudioTrack } from '../types/project';

export class AudioProcessor {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;

  async initialize(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  async loadAudio(file: File | string): Promise<AudioBuffer> {
    await this.initialize();

    let arrayBuffer: ArrayBuffer;

    if (typeof file === 'string') {
      const response = await fetch(file);
      arrayBuffer = await response.arrayBuffer();
    } else {
      arrayBuffer = await file.arrayBuffer();
    }

    if (!this.audioContext) throw new Error('AudioContext not initialized');

    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return this.audioBuffer;
  }

  async trimAudio(
    file: File | string,
    startTime: number,
    endTime: number
  ): Promise<AudioBuffer> {
    const buffer = await this.loadAudio(file);
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const sampleRate = buffer.sampleRate;
    const startSample = Math.floor(startTime * sampleRate);
    const endSample = Math.floor(endTime * sampleRate);
    const duration = (endSample - startSample) / sampleRate;

    const trimmedBuffer = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      endSample - startSample,
      sampleRate
    );

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const sourceData = buffer.getChannelData(i);
      const trimmedData = trimmedBuffer.getChannelData(i);
      trimmedData.set(sourceData.slice(startSample, endSample));
    }

    return trimmedBuffer;
  }

  applyFadeInOut(
    buffer: AudioBuffer,
    fadeInDuration: number,
    fadeOutDuration: number
  ): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const sampleRate = buffer.sampleRate;
    const fadeInSamples = Math.floor(fadeInDuration * sampleRate);
    const fadeOutSamples = Math.floor(fadeOutDuration * sampleRate);
    const totalSamples = buffer.length;

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);

      // Fade in
      for (let i = 0; i < Math.min(fadeInSamples, totalSamples); i++) {
        data[i] *= i / fadeInSamples;
      }

      // Fade out
      for (let i = Math.max(0, totalSamples - fadeOutSamples); i < totalSamples; i++) {
        data[i] *= (totalSamples - i) / fadeOutSamples;
      }
    }

    return buffer;
  }

  mixAudio(
    mainBuffer: AudioBuffer,
    sfxBuffer: AudioBuffer,
    sfxStartTime: number,
    sfxGain: number = 0.2
  ): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not initialized');

    const sampleRate = mainBuffer.sampleRate;
    const sfxStartSample = Math.floor(sfxStartTime * sampleRate);
    const mixedBuffer = this.audioContext.createBuffer(
      mainBuffer.numberOfChannels,
      mainBuffer.length,
      sampleRate
    );

    for (let channel = 0; channel < mainBuffer.numberOfChannels; channel++) {
      const mainData = mainBuffer.getChannelData(channel);
      const sfxData = sfxBuffer.getChannelData(channel % sfxBuffer.numberOfChannels);
      const mixedData = mixedBuffer.getChannelData(channel);

      // Copy main audio
      mixedData.set(mainData);

      // Mix in SFX
      for (let i = 0; i < Math.min(sfxData.length, mainData.length - sfxStartSample); i++) {
        mixedData[sfxStartSample + i] += sfxData[i] * sfxGain;
      }
    }

    return mixedBuffer;
  }

  async audioBufferToWav(buffer: AudioBuffer): Promise<Blob> {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;

    const data = buffer.getChannelData(0);
    const dataLength = data.length;
    const audioLength = dataLength * numberOfChannels * bytesPerSample;
    const buffer8 = new ArrayBuffer(44 + audioLength);
    const view = new DataView(buffer8);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + audioLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, audioLength, true);

    let offset = 44;
    for (let i = 0; i < dataLength; i++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(0)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }

    return new Blob([buffer8], { type: 'audio/wav' });
  }

  getAudioDuration(buffer: AudioBuffer): number {
    return buffer.length / buffer.sampleRate;
  }
}

export const audioProcessor = new AudioProcessor();
