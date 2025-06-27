export interface CreateWebCallResponse {
  access_token: string;
  call_id: string;
  agent_id: string;
}

export interface CallState {
  status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
  duration: number;
  isMuted: boolean;
  volume: number;
  error?: string;
}

export interface AudioLevel {
  level: number;
  timestamp: number;
}