import React from 'react';
import { AspectRatio } from '../types/project';

interface AspectRatioSelectorProps {
  onSelect: (ratio: AspectRatio) => void;
  selectedRatio: AspectRatio;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ onSelect, selectedRatio }) => {
  const ratios: Array<{ id: AspectRatio; name: string; description: string; dimensions: string }> = [
    { id: '9:16', name: 'Vertical', description: 'Instagram/TikTok Reels', dimensions: '1080×1920px' },
    { id: '1:1', name: 'Square', description: 'Universal format', dimensions: '1080×1080px' },
  ];

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Video Format</h2>
      <p className="text-gray-600 mb-8">Choose your video's aspect ratio for optimal display.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ratios.map((ratio) => (
          <button
            key={ratio.id}
            onClick={() => onSelect(ratio.id)}
            className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
              selectedRatio === ratio.id
                ? 'border-gray-900 bg-gray-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-400'
            }`}
          >
            {/* Aspect ratio preview */}
            <div className="flex gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{ratio.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{ratio.description}</p>
                <p className="text-xs text-gray-500">{ratio.dimensions}</p>
              </div>

              {/* Visual preview */}
              <div className="flex items-center justify-center">
                {ratio.id === '9:16' ? (
                  <div className="w-12 h-20 border-2 border-gray-400 rounded" />
                ) : (
                  <div className="w-16 h-16 border-2 border-gray-400 rounded" />
                )}
              </div>
            </div>

            {/* Selection indicator */}
            {selectedRatio === ratio.id && (
              <div className="absolute top-3 right-3 bg-gray-900 text-white rounded-full p-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
