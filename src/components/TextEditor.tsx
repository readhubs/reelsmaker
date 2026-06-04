import React, { useState } from 'react';
import { Scene } from '../types/project';
import { Edit2, X } from 'lucide-react';

interface TextEditorProps {
  scenes: Scene[];
  onSceneUpdate: (sceneId: string, text: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({ scenes, onSceneUpdate }) => {
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (scene: Scene) => {
    setEditingSceneId(scene.id);
    setEditText(scene.text);
  };

  const handleSave = () => {
    if (editingSceneId && editText.trim()) {
      onSceneUpdate(editingSceneId, editText);
      setEditingSceneId(null);
    }
  };

  const handleCancel = () => {
    setEditingSceneId(null);
    setEditText('');
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Scene Text</h2>
      <p className="text-gray-600 mb-6">
        Review and edit the text for each scene. Each scene lasts approximately 1.5 seconds.
      </p>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {scenes.map((scene, index) => (
          <div key={scene.id} className="p-4 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-xs text-gray-500">Scene {index + 1} • {scene.animation}</span>
                </div>

                {editingSceneId === scene.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Enter scene text..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-3 py-1 bg-gray-900 text-white rounded text-xs font-semibold hover:bg-gray-800 transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-200 text-gray-900 rounded text-xs font-semibold hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed text-sm">{scene.text}</p>
                )}
              </div>

              {editingSceneId !== scene.id && (
                <button
                  onClick={() => handleEdit(scene)}
                  className="p-2 hover:bg-gray-100 rounded transition"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4">
        Tip: Keep text short (max 6 words) for better visibility on mobile devices.
      </p>
    </div>
  );
};
