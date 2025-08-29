// types/chat.ts
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: string;
  tracking?: TrackingInfo;
  source?: 'rules' | 'llm' | 'default';
}

export interface TrackingInfo {
  status: string;
  eta: string;
  carrier: string;
}

export interface ChatRequest {
  question: string;
  customerId?: string;
}

export interface ChatResponse {
  answer: string;
  source: 'rules' | 'llm' | 'default';
  timestamp: string;
  tracking?: TrackingInfo;
}

export interface ApiError {
  error: string;
  timestamp: string;
}