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
  
  export interface TrackingInfo {
    status: string;
    eta: string;
    carrier: string;
  }
  
  export interface ErrorResponse {
    error: string;
    timestamp: string;
  }
  
  export interface HealthResponse {
    status: 'ok' | 'error';
    timestamp: string;
    version?: string;
  }
  
  export interface LogEvent {
    level: 'info' | 'warn' | 'error';
    responseLength?: number;
    timestamp: string;
    message: string;
    question?: string;
    source?: string;
    duration?: number;
    customerId?: string;
    error?: string;

  }