import React from 'react';
import { Theme } from '../types/project';
import { colorPalettes } from '../lib/colorPalettes';

interface ThemeSelectorProps {
  onSelect: (theme: Theme) => void;
  selectedTheme?: Theme;
}

const themes: Array<{ id: Theme; name: string; description: string }> = [
  { id: 'fomo', name: 'FOMO', description: 'Urgency & Scarcity' },
  { id: 'sales', name: 'SALES', description: 'High-Value Offers' },
  { id: 'promo', name: 'PROMO', description: 'Launch & Features' },
  { id: 'service', name: 'SERVICE', description: 'Product Superiority' },
  { id: 'social', name: 'SOCIAL PROOF', description: 'Credibility & Momentum' },
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ onSelect, selectedTheme }) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Video Theme</h2>
      <p className="text-gray-600 mb-8">
        Select a theme that matches your video's purpose. Each theme has unique colors and messaging.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {themes.map((theme) => {
          const palette = colorPalettes[theme.id];
          const isSelected = selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => onSelect(theme.id)}
              className={`relative overflow-hidden rounded-lg transition-all duration-300 transform hover:scale-105 ${
                isSelected ? 'ring-4 ring-gray-900 scale-105' : 'hover:shadow-lg'
              }`}
            >
              {/* Theme card with gradient background */}
              <div
                className="p-6 h-64 flex flex-col justify-between text-white relative z-10"
                style={{ background: palette.background }}
              >
                <div>
                  <h3 className="text-2xl font-black">{theme.name}</h3>
                  <p className="text-sm opacity-90 mt-1">{theme.description}</p>
                </div>

                {/* Color swatches */}
                <div className="flex gap-2 justify-between mt-4">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: palette.accent }}
                  />
                  <div className="w-8 h-8 rounded-full border-2 border-white/50" style={{ backgroundColor: palette.secondary }} />
                </div>
              </div>

              {/* Selection checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
