import React from 'react';
import { Bot } from 'lucide-react';
import { useRetellCall } from './hooks/useRetellCall';
import { CallControls } from './components/CallControls';
import { AudioVisualizer } from './components/AudioVisualizer';
import { StatusIndicator } from './components/StatusIndicator';

function App() {
  const {
    callState,
    audioLevels,
    agentId,
    startCall,
    stopCall,
    toggleMute,
    setVolume
  } = useRetellCall();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,0.8),transparent_70%)]" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Surview Voice Agent
            </h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Start a conversation with our AI voice agent. Click the call button to begin.
          </p>
          {agentId && (
            <p className="text-sm text-gray-500 mt-2">
              Agent ID: {agentId}
            </p>
          )}
        </div>

        {/* Main Interface */}
        <div className="w-full max-w-md">
          {/* Status Indicator */}
          <div className="flex justify-center mb-8">
            <StatusIndicator callState={callState} />
          </div>

          {/* Audio Visualizer */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
            <AudioVisualizer 
              audioLevels={audioLevels} 
              isActive={callState.status === 'connected'} 
            />
          </div>

          {/* Call Controls */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <CallControls
              callState={callState}
              onStartCall={startCall}
              onStopCall={stopCall}
              onToggleMute={toggleMute}
              onVolumeChange={setVolume}
            />
          </div>
        </div>

        {/* Setup Instructions */}
        {callState.status === 'error' && (
          <div className="mt-8 max-w-lg bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">Setup Required</h3>
            <p className="text-sm text-amber-700 mb-3">
              To enable voice calls, you need to add your Retell AI API key:
            </p>
            <ol className="text-xs text-amber-700 space-y-1 mb-3">
              <li>1. Create a .env file in your project root</li>
              <li>2. Add: VITE_RETELL_API_KEY=your_api_key_here</li>
              <li>3. Restart your development server</li>
              <li>4. For production, add the environment variable to your hosting platform</li>
            </ol>
            {callState.error && (
              <div className="text-xs text-red-600 font-mono bg-red-50 p-2 rounded mt-2">
                Error: {callState.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;