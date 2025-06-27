import React from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { CallState } from '../types/retell';

interface StatusIndicatorProps {
  callState: CallState;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ callState }) => {
  const getStatusIcon = () => {
    switch (callState.status) {
      case 'connected':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'connecting':
        return <Wifi className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'disconnected':
        return <WifiOff className="w-5 h-5 text-gray-400" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (callState.status) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-blue-600';
      case 'error':
        return 'text-red-600';
      case 'disconnected':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (callState.status) {
      case 'connected':
        return 'Connected to AI Agent';
      case 'connecting':
        return 'Connecting to AI Agent...';
      case 'error':
        return 'Connection Failed';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Ready to Connect';
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
};