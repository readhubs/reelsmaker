import React, { useState } from 'react';
import { AudioTrack } from '../types/project';
import { Upload, Music } from 'lucide-react';

interface MusicUploaderProps {
  onMusicSelected: (music: AudioTrack) => void;
  currentMusic?: AudioTrack;
}

export const MusicUploader: React.FC<MusicUploaderProps> = ({ onMusicSelected, currentMusic }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [musicName, setMusicName] = useState(currentMusic?.file === '/assets/music/default-track.mp3' ? 'Default Track' : 'Custom Music');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    setIsLoading(true);
    try {
      // Create audio context to get duration
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const duration = audioBuffer.duration;

      setMusicName(file.name);
      onMusicSelected({
        file,
        duration,
        fadeInDuration: 0.5,
        fadeOutDuration: 0.5,
      });
    } catch (error) {
      console.error('Error loading audio:', error);
      alert('Error loading audio file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDefault = () => {
    setMusicName('Default Track');
    onMusicSelected({
      file: '/assets/music/default-track.mp3',
      duration: 20,
      fadeInDuration: 0.5,
      fadeOutDuration: 0.5,
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Background Music</h2>
      <p className="text-gray-600 mb-8">Choose a music track or upload your own.</p>

      <div className="space-y-4">
        {/* Default track option */}
        <button
          onClick={handleUseDefault}
          className={`w-full p-6 rounded-lg border-2 transition-all duration-300 text-left ${
            musicName === 'Default Track'
              ? 'border-gray-900 bg-gray-50'
              : 'border-gray-200 hover:border-gray-400'
          }`}
        >
          <div className="flex items-center gap-4">
            <Music className="w-8 h-8 text-gray-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Default Track</h3>
              <p className="text-sm text-gray-600">20 seconds • Professional Background Music</p>
            </div>
          </div>
        </button>

        {/* Upload custom music */}
        <label className="w-full p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer text-center hover:bg-gray-50">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className={`w-8 h-8 ${isLoading ? 'text-gray-400' : 'text-gray-600'}`} />
            <div>
              <p className="font-semibold text-gray-900">
                {isLoading ? 'Loading...' : 'Upload Custom Music'}
              </p>
              <p className="text-sm text-gray-600">MP3, WAV, or OGG • Click to browse</p>
            </div>
          </div>
        </label>

        {/* Current track info */}
        {musicName && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Current:</span> {musicName}
            </p>
            {currentMusic && (
              <p className="text-xs text-blue-700 mt-1">
                Duration: {Math.round(currentMusic.duration)}s • Fade-in: {currentMusic.fadeInDuration}s • Fade-out:{' '}
                {currentMusic.fadeOutDuration}s
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
