import React from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2,
  Loader2,
  X
} from 'lucide-react';
import type { CallState } from '../types/retell';

interface CallControlsProps {
  callState: CallState;
  onStartCall: () => void;
  onStopCall: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  callState,
  onStartCall,
  onStopCall,
  onToggleMute,
  onVolumeChange
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Call Status */}
      <div className="text-center">
        <div className="text-2xl font-semibold text-gray-800 mb-2">
          {callState.status === 'idle' && 'Ready to Call'}
          {callState.status === 'connecting' && 'Connecting...'}
          {callState.status === 'connected' && 'Connected'}
          {callState.status === 'disconnected' && 'Call Ended'}
          {callState.status === 'error' && 'Connection Error'}
        </div>
        
        {callState.status === 'connected' && (
          <div className="text-gray-600 font-mono text-lg">
            {formatDuration(callState.duration)}
          </div>
        )}
        
        {callState.error && (
          <div className="text-red-500 text-sm mt-2">
            {callState.error}
          </div>
        )}
      </div>

      {/* Call Buttons */}
      <div className="flex items-center gap-4">
        {/* Start Call Button - Only show when idle, disconnected, or error */}
        {(callState.status === 'idle' || callState.status === 'disconnected' || callState.status === 'error') && (
          <button
            onClick={onStartCall}
            className="
              w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-300 transform hover:scale-105 active:scale-95
              shadow-lg hover:shadow-xl
              bg-green-500 hover:bg-green-600 text-white
            "
          >
            <Phone className="w-8 h-8" />
          </button>
        )}

        {/* Connecting State - Show cancel button with loading indicator */}
        {callState.status === 'connecting' && (
          <div className="relative">
            <button
              onClick={onStopCall}
              className="
                w-20 h-20 rounded-full flex items-center justify-center
                transition-all duration-300 transform hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                bg-red-500 hover:bg-red-600 text-white
              "
            >
              <X className="w-8 h-8" />
            </button>
            {/* Loading indicator overlay */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          </div>
        )}

        {/* End Call Button - Show when connected */}
        {callState.status === 'connected' && (
          <button
            onClick={onStopCall}
            className="
              w-20 h-20 rounded-full flex items-center justify-center
              transition-all duration-300 transform hover:scale-105 active:scale-95
              shadow-lg hover:shadow-xl
              bg-red-500 hover:bg-red-600 text-white
            "
          >
            <PhoneOff className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Secondary Controls - Only show when connected */}
      {callState.status === 'connected' && (
        <div className="flex items-center gap-4">
          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              transition-all duration-200 hover:scale-105
              ${callState.isMuted 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {callState.isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <Volume2 className="w-4 h-4 text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={callState.volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};