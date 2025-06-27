import { useState, useEffect, useCallback, useRef } from 'react';
import { RetellWebClient } from 'retell-client-js-sdk';
import type { CallState, CreateWebCallResponse, AudioLevel } from '../types/retell';

// Extract agent ID from URL path
const getAgentIdFromUrl = (): string => {
  const path = window.location.pathname;
  const segments = path.split('/').filter(segment => segment.length > 0);
  
  // Look for agent_id in the URL path
  const agentIndex = segments.findIndex(segment => segment === 'agent_id');
  if (agentIndex !== -1 && agentIndex + 1 < segments.length) {
    return segments[agentIndex + 1];
  }
  
  // Fallback: if URL is like /agent_123456, extract the agent part
  const agentSegment = segments.find(segment => segment.startsWith('agent_'));
  if (agentSegment) {
    return agentSegment;
  }
  
  // Default fallback
  return 'agent_a144835b4e555700c5bd3148fe';
};

export const useRetellCall = () => {
  const [callState, setCallState] = useState<CallState>({
    status: 'idle',
    duration: 0,
    isMuted: false,
    volume: 0.8
  });
  
  const [audioLevels, setAudioLevels] = useState<AudioLevel[]>([]);
  const [agentId, setAgentId] = useState<string>('');
  const retellWebClient = useRef<RetellWebClient | null>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<number>(0);

  // Initialize agent ID from URL
  useEffect(() => {
    const urlAgentId = getAgentIdFromUrl();
    setAgentId(urlAgentId);
    console.log('Agent ID from URL:', urlAgentId);
  }, []);

  // Initialize Retell Web Client
  useEffect(() => {
    retellWebClient.current = new RetellWebClient();
    
    // Set up event listeners
    const client = retellWebClient.current;
    
    client.on('conversationStarted', () => {
      console.log('Conversation started');
      setCallState(prev => ({ ...prev, status: 'connected' }));
      startTime.current = Date.now();
      
      // Start duration timer
      durationInterval.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        setCallState(prev => ({ ...prev, duration: elapsed }));
      }, 1000);
    });
    
    client.on('conversationEnded', () => {
      console.log('Conversation ended');
      setCallState(prev => ({ ...prev, status: 'disconnected' }));
      setAudioLevels([]);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    });
    
    client.on('error', (error) => {
      console.error('Retell error:', error);
      setCallState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error.message || 'An error occurred'
      }));
    });
    
    client.on('update', (update) => {
      console.log('Call update:', update);
    });

    // Simulate audio levels for visualization
    const audioInterval = setInterval(() => {
      if (callState.status === 'connected') {
        setAudioLevels(prev => {
          const newLevel = Math.random() * 100;
          const newLevels = [...prev, { level: newLevel, timestamp: Date.now() }];
          return newLevels.slice(-50); // Keep last 50 levels
        });
      }
    }, 100);

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      clearInterval(audioInterval);
      client.removeAllListeners();
    };
  }, [callState.status]);

  const createWebCall = async (): Promise<CreateWebCallResponse> => {
    try {
      // Get API key from environment variable
      const retellApiKey = import.meta.env.VITE_RETELL_API_KEY;
      
      if (!retellApiKey) {
        throw new Error('VITE_RETELL_API_KEY environment variable is not set. Please add it to your .env file.');
      }
      
      console.log('Creating web call for agent:', agentId);
      
      // Make direct request to Retell AI API
      const response = await fetch('https://api.retellai.com/v2/create-web-call', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agentId
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Retell API error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const callData = await response.json();
      console.log('Successfully created web call:', { callId: callData.call_id });
      
      return callData;
    } catch (error) {
      console.error('Create web call error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create web call - please check your setup');
    }
  };

  const startCall = useCallback(async () => {
    if (!retellWebClient.current || !agentId) return;
    
    try {
      setCallState(prev => ({ ...prev, status: 'connecting', error: undefined }));
      
      const callResponse = await createWebCall();
      
      await retellWebClient.current.startCall({
        accessToken: callResponse.access_token,
        sampleRate: 24000,
        emitRawAudioSamples: false
      });
      
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Failed to start call'
      }));
    }
  }, [agentId]);

  const stopCall = useCallback(async () => {
    if (!retellWebClient.current) return;
    
    try {
      console.log('Stopping call and disconnecting websocket...');
      await retellWebClient.current.stopCall();
      setCallState(prev => ({ ...prev, status: 'disconnected' }));
      setAudioLevels([]);
      
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }
    } catch (error) {
      console.error('Failed to stop call:', error);
      // Even if there's an error, we should still update the UI state
      setCallState(prev => ({ ...prev, status: 'disconnected' }));
      setAudioLevels([]);
    }
  }, []);

  const toggleMute = useCallback(async () => {
    // Implementation depends on Retell SDK capabilities
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setCallState(prev => ({ ...prev, volume }));
  }, []);

  return {
    callState,
    audioLevels,
    agentId,
    startCall,
    stopCall,
    toggleMute,
    setVolume
  };
};