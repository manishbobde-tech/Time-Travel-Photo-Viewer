import React from 'react';
import { Era } from '../types';
import { ERAS } from '../constants';

interface SceneSelectorProps {
  onSelect: (era: Era) => void;
  onBack: () => void;
}

const SceneSelector: React.FC<SceneSelectorProps> = ({ onSelect, onBack }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Select Your Destination
        </h2>
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white transition underline"
        >
          Retake Photo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ERAS.map((era) => (
          <button
            key={era.id}
            onClick={() => onSelect(era)}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${era.color} p-1 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20`}
          >
            <div className="relative h-full w-full bg-gray-900 rounded-xl p-6 flex flex-col items-center text-center gap-4 transition-colors group-hover:bg-opacity-90">
              <div className="text-5xl mb-2 filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                {era.icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">{era.name}</h3>
              <p className="text-sm text-gray-300 leading-relaxed opacity-80 group-hover:opacity-100">
                {era.description}
              </p>
              <div className="mt-auto pt-4 w-full">
                <span className="block w-full py-2 bg-white/10 rounded-lg text-xs font-semibold uppercase tracking-wider text-white group-hover:bg-white/20 transition">
                  Time Travel
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SceneSelector;