import React, { useState } from 'react';
import { BrandingCard } from '../types/project';
import { Upload } from 'lucide-react';

interface BrandingEditorProps {
  branding: BrandingCard;
  onUpdate: (branding: Partial<BrandingCard>) => void;
}

export const BrandingEditor: React.FC<BrandingEditorProps> = ({ branding, onUpdate }) => {
  const [logoPreview, setLogoPreview] = useState<string>(branding.logoUrl);
  const [brandName, setBrandName] = useState(branding.brandName);
  const [slogan, setSlogan] = useState(branding.slogan);
  const [duration, setDuration] = useState(branding.duration);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setLogoPreview(dataUrl);
      onUpdate({ logoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBrandName(value);
    onUpdate({ brandName: value });
  };

  const handleSloganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSlogan(value);
    onUpdate({ slogan: value });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDuration(value);
    onUpdate({ duration: value });
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">End Card Branding</h2>
      <p className="text-gray-600 mb-6">Customize your brand's final reveal at the end of the video.</p>

      <div className="space-y-6">
        {/* Logo upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">Logo</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer text-center hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Upload Logo</p>
                <p className="text-xs text-gray-600">PNG or JPG • Square format recommended</p>
              </label>
            </div>

            {logoPreview && (
              <div className="w-32 h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>
        </div>

        {/* Brand name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={handleBrandNameChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Enter brand name"
          />
          <p className="text-xs text-gray-500 mt-1">Default: PortfolioHubs</p>
        </div>

        {/* Slogan */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Slogan</label>
          <input
            type="text"
            value={slogan}
            onChange={handleSloganChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-right"
            placeholder="Enter slogan"
            dir="rtl"
          />
          <p className="text-xs text-gray-500 mt-1">Default: الاسنانجى لازم يتدلع</p>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">End Card Duration (seconds)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={duration}
              onChange={handleDurationChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-bold text-gray-900 w-12">{duration.toFixed(1)}s</span>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-gray-700 mb-3">PREVIEW</p>
          <div className="bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg p-8 text-white text-center aspect-video flex flex-col items-center justify-center">
            {logoPreview && (
              <img src={logoPreview} alt="Brand logo" className="w-20 h-20 object-contain mb-4" />
            )}
            <p className="text-2xl font-black mb-2">{brandName}</p>
            <p className="text-lg" dir="rtl">
              {slogan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
