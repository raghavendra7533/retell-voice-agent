import React from 'react';
import type { AudioLevel } from '../types/retell';

interface AudioVisualizerProps {
  audioLevels: AudioLevel[];
  isActive: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  audioLevels, 
  isActive 
}) => {
  const bars = Array.from({ length: 20 }, (_, i) => {
    const level = audioLevels[audioLevels.length - 1 - i]?.level || 0;
    const height = isActive ? Math.max(level * 0.6, 10) : 10;
    
    return (
      <div
        key={i}
        className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-75 ease-out"
        style={{
          height: `${height}%`,
          minHeight: '8px',
          width: '3px',
          opacity: isActive ? 0.8 + (level / 500) : 0.3
        }}
      />
    );
  });

  return (
    <div className="flex items-end justify-center gap-1 h-16 px-4">
      {bars}
    </div>
  );
};